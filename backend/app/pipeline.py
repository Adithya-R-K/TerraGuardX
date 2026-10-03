"""End-to-end pipeline: load data -> features -> models -> SAR -> fusion -> store -> alerts."""
from __future__ import annotations
import json, uuid
import numpy as np
import pandas as pd
from . import models
from .alerts import build_message, should_alert
from .config import DATA_MODE, DEMO_DIR
from .db import Alert, RiskPrediction, Session
from .features import rainfall_features
from .fusion import fuse, clamp


def load_inputs() -> dict:
    """Load zone inputs. LIVE mode requires adapters (see README); falls back to labelled DEMO."""
    mode = "DEMO"
    if DATA_MODE == "live":
        mode = "DEMO"  # no live adapter configured -> never pretend; stays DEMO and is labelled so
    return {"terrain": pd.read_csv(DEMO_DIR / "terrain.csv"), "rain": pd.read_csv(DEMO_DIR / "rainfall.csv"),
            "sat": pd.read_csv(DEMO_DIR / "satellite_features.csv"), "mode": mode}


def sar_score(r: pd.Series) -> float:
    """Normalise deformation, coherence loss and vegetation change to 0-100."""
    d = min(r.deformation_mm / 20, 1); c = 1 - r.coherence; v = min(max(-r.ndvi_change, 0) / .15, 1)
    return clamp(100 * (.6 * d + .25 * c + .15 * v))


def run_simulation(store: bool = True) -> dict:
    """Run the full pipeline for all zones. Everything is computed here, nothing hardcoded."""
    d = load_inputs(); st = models.load("static"); dy = models.load("dynamic")
    t = d["terrain"].copy()
    t["susceptibility"] = models.predict(st, t)
    rf = pd.DataFrame([rainfall_features(g.sort_values("timestamp").rain_mm) for _, g in d["rain"].groupby("zone_id", sort=True)],
                      index=sorted(d["rain"].zone_id.unique()))
    t = t.join(rf, on="zone_id").merge(d["sat"][["zone_id", "deformation_mm", "coherence", "ndvi_change", "acquisition_date"]], on="zone_id", how="left")
    t["dynamic_trigger"] = models.predict(dy, t)
    t["sar_signal"] = t.apply(sar_score, axis=1)
    run_id = uuid.uuid4().hex[:8]; results = []
    for _, r in t.iterrows():
        fz = fuse(r.susceptibility, r.dynamic_trigger, r.sar_signal)
        factors = models.explain(dy, r, 3) + models.explain(st, r, 2)
        if r.sar_signal > 50:
            factors.append({"feature": "sar_signal", "label": "SAR deformation signal", "contribution": round(r.sar_signal / 100, 3)})
        factors = sorted(factors, key=lambda x: -x["contribution"])[:5]
        results.append({"zone_id": r.zone_id, "name": r["name"], "district": r.district, "state": r.state, "lat": r.lat, "lon": r.lon,
                        "static_susceptibility": round(r.susceptibility, 1), "dynamic_trigger": round(r.dynamic_trigger, 1), "sar_signal": round(r.sar_signal, 1),
                        "rainfall_24h": round(r.rainfall_24h, 1), "rainfall_72h": round(r.rainfall_72h, 1), "slope": round(r.slope, 1), "elevation": round(r.elevation),
                        "nearest_road_km": round(r.dist_road_km, 2), "top_factors": [f["label"] for f in factors], "data_mode": d["mode"], "sar_mode": "DEMO",
                        "updated": pd.Timestamp.now("UTC").isoformat(), "run_id": run_id, **fz})
    if store:
        with Session() as s:
            for x in results:
                p = RiskPrediction(zone_id=x["zone_id"], run_id=run_id, risk_score=x["risk_score"], risk_level=x["risk_level"], payload=x, data_mode=x["data_mode"])
                s.add(p); s.flush(); x["prediction_id"] = p.id
                if should_alert(x["risk_level"]):
                    trig = x["top_factors"][0] if x["top_factors"] else "combined factors"
                    s.add(Alert(zone_id=x["zone_id"], prediction_id=p.id, severity=x["risk_level"], score=x["risk_score"], trigger=trig,
                                message=build_message(x["name"], x["risk_score"], trig)))
            s.commit()
    return {"run_id": run_id, "data_mode": d["mode"], "zones": results}
