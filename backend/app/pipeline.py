"""End-to-end pipeline: load data -> features -> models -> SAR -> fusion -> store -> alerts."""
from __future__ import annotations
import json, uuid
import numpy as np
import pandas as pd
from . import models
from .adapters import live_manager
from .alerts import build_message, should_alert
from .config import DATA_MODE, DEMO_DIR
from .db import Alert, RiskPrediction, Session
from .features import rainfall_features
from .fusion import fuse, clamp


def load_inputs(mode_override: str | None = None) -> dict:
    """Load zone inputs. Connects to real-time adapters when DATA_MODE is 'live'."""
    mode = (mode_override or DATA_MODE).lower()
    if mode == "live":
        return live_manager.get_live_inputs(force_live=True)
    return {
        "terrain": pd.read_csv(DEMO_DIR / "terrain.csv"),
        "rain": pd.read_csv(DEMO_DIR / "rainfall.csv"),
        "sat": pd.read_csv(DEMO_DIR / "satellite_features.csv"),
        "mode": "DEMO",
        "meta": {"status": "DEMO", "provider": "Synthetic baseline"},
    }


def sar_score(r: pd.Series) -> float:
    """Normalise deformation, coherence loss and vegetation change to 0-100."""
    d = min(abs(float(r.deformation_mm)) / 20.0, 1.0)
    c = 1.0 - max(0.0, min(1.0, float(r.coherence)))
    v = min(max(-float(r.ndvi_change), 0.0) / 0.15, 1.0)
    return clamp(100.0 * (0.6 * d + 0.25 * c + 0.15 * v))


def run_simulation(store: bool = True, mode_override: str | None = None) -> dict:
    """Run the full pipeline for all zones using live or demo inputs."""
    d = load_inputs(mode_override=mode_override)
    st = models.load("static")
    dy = models.load("dynamic")
    t = d["terrain"].copy()
    t["susceptibility"] = models.predict(st, t)

    rf = pd.DataFrame(
        [rainfall_features(g.sort_values("timestamp").rain_mm) for _, g in d["rain"].groupby("zone_id", sort=True)],
        index=sorted(d["rain"].zone_id.unique()),
    )
    t = t.join(rf, on="zone_id").merge(
        d["sat"][["zone_id", "deformation_mm", "coherence", "ndvi_change", "acquisition_date"]],
        on="zone_id",
        how="left",
    )
    t["dynamic_trigger"] = models.predict(dy, t)
    t["sar_signal"] = t.apply(sar_score, axis=1)

    run_id = uuid.uuid4().hex[:8]
    results = []

    for _, r in t.iterrows():
        fz = fuse(r.susceptibility, r.dynamic_trigger, r.sar_signal)
        factors = models.explain(dy, r, 3) + models.explain(st, r, 2)
        if r.sar_signal > 40:
            factors.append({
                "feature": "sar_signal",
                "label": f"InSAR deformation ({r.deformation_mm:.1f}mm)",
                "contribution": round(r.sar_signal / 100.0, 3),
            })
        factors = sorted(factors, key=lambda x: -x["contribution"])[:5]

        results.append({
            "zone_id": r.zone_id,
            "name": r["name"],
            "district": r.district,
            "state": r.state,
            "lat": r.lat,
            "lon": r.lon,
            "static_susceptibility": round(float(r.susceptibility), 1),
            "dynamic_trigger": round(float(r.dynamic_trigger), 1),
            "sar_signal": round(float(r.sar_signal), 1),
            "rainfall_24h": round(float(r.rainfall_24h), 1),
            "rainfall_72h": round(float(r.rainfall_72h), 1),
            "slope": round(float(r.slope), 1),
            "elevation": round(float(r.elevation)),
            "nearest_road_km": round(float(r.dist_road_km), 2),
            "top_factors": [f["label"] for f in factors],
            "data_mode": d["mode"],
            "sar_mode": "LIVE" if d["mode"] == "LIVE" else "DEMO",
            "updated": pd.Timestamp.now("UTC").isoformat(),
            "run_id": run_id,
            **fz,
        })

    if store:
        with Session() as s:
            for x in results:
                p = RiskPrediction(
                    zone_id=x["zone_id"],
                    run_id=run_id,
                    risk_score=x["risk_score"],
                    risk_level=x["risk_level"],
                    payload=x,
                    data_mode=x["data_mode"],
                )
                s.add(p)
                s.flush()
                x["prediction_id"] = p.id
                if should_alert(x["risk_level"]):
                    trig = x["top_factors"][0] if x["top_factors"] else "combined risk triggers"
                    s.add(
                        Alert(
                            zone_id=x["zone_id"],
                            prediction_id=p.id,
                            severity=x["risk_level"],
                            score=x["risk_score"],
                            trigger=trig,
                            message=build_message(x["name"], x["risk_score"], trig),
                        )
                    )
            s.commit()

    return {"run_id": run_id, "data_mode": d["mode"], "zones": results, "meta": d.get("meta", {})}
