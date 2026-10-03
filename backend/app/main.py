"""FastAPI application."""
from __future__ import annotations
import datetime as dt, logging
import jwt
import pandas as pd
from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from pydantic import BaseModel
from . import models
from .alerts import get_provider
from .config import DATA_MODE, DEMO_DIR, DISCLAIMER, JWT_SECRET, USERS
from .db import Alert, FieldFeedback, ModelVersion, RiskPrediction, Session, init_db
from .pipeline import run_simulation

logging.basicConfig(level=logging.INFO)
app = FastAPI(title="TerraGuardX API", description=DISCLAIMER, version="0.1.0")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])
bearer = HTTPBearer(auto_error=False)
init_db()


def user(role_in: tuple[str, ...]):
    """Dependency factory enforcing JWT + role."""
    def dep(c: HTTPAuthorizationCredentials | None = Depends(bearer)) -> dict:
        if not c:
            raise HTTPException(401, "Missing token")
        try:
            u = jwt.decode(c.credentials, JWT_SECRET, algorithms=["HS256"])
        except jwt.PyJWTError:
            raise HTTPException(401, "Invalid token")
        if u["role"] not in role_in:
            raise HTTPException(403, "Insufficient role")
        return u
    return dep


ANY = user(("ADMIN", "AUTHORITY", "VIEWER")); AUTH = user(("ADMIN", "AUTHORITY")); ADMIN = user(("ADMIN",))


class Login(BaseModel):
    username: str; password: str
class FeedbackIn(BaseModel):
    zone_id: str; actual_event: str  # CONFIRMED_LANDSLIDE | NO_LANDSLIDE | FALSE_ALARM | UNKNOWN
    prediction_id: int | None = None; severity: int | None = None; notes: str | None = None
    latitude: float | None = None; longitude: float | None = None; event_date: str | None = None
class AlertAction(BaseModel):
    alert_id: int; action: str = "send"  # send | acknowledge | resolve
    recipients: list[str] = ["+910000000000"]


def latest() -> list[dict]:
    with Session() as s:
        last = s.query(RiskPrediction).order_by(RiskPrediction.id.desc()).first()
        if not last:
            return []
        rows = s.query(RiskPrediction).filter_by(run_id=last.run_id).all()
        return [{**r.payload, "prediction_id": r.id} for r in rows]


@app.get("/api/health", tags=["system"])
def health():
    """Service health. Example: {"status":"ok","data_mode":"demo"}"""
    return {"status": "ok", "data_mode": DATA_MODE, "disclaimer": DISCLAIMER}


@app.post("/api/auth/login", tags=["auth"])
def login(b: Login):
    """Returns a JWT. Roles: ADMIN, AUTHORITY, VIEWER."""
    u = USERS.get(b.username)
    if not u or u[1] != b.password:
        raise HTTPException(401, "Bad credentials")
    tok = jwt.encode({"sub": b.username, "role": u[0], "exp": dt.datetime.utcnow() + dt.timedelta(hours=12)}, JWT_SECRET, algorithm="HS256")
    return {"access_token": tok, "role": u[0]}


@app.post("/api/prediction", tags=["risk"])
def prediction(_: dict = Depends(AUTH)):
    """Run the full simulation pipeline (features -> models -> fusion -> alerts) and store results."""
    return run_simulation()


@app.get("/api/risk", tags=["risk"])
def risk(_: dict = Depends(ANY)):
    """Latest risk predictions for all zones."""
    return {"zones": latest(), "disclaimer": DISCLAIMER}


@app.get("/api/risk/map", tags=["risk"])
def risk_map(_: dict = Depends(ANY)):
    """GeoJSON points of latest predictions."""
    return {"type": "FeatureCollection", "features": [{"type": "Feature", "properties": z, "geometry": {"type": "Point", "coordinates": [z["lon"], z["lat"]]}} for z in latest()]}


@app.get("/api/risk/{zone_id}", tags=["risk"])
def risk_zone(zone_id: str, _: dict = Depends(ANY)):
    """Latest prediction for one zone."""
    for z in latest():
        if z["zone_id"] == zone_id:
            return z
    raise HTTPException(404, "No prediction for zone")


@app.get("/api/zones", tags=["zones"])
def zones(_: dict = Depends(ANY)):
    """Zone list (synthetic demo geometry)."""
    return pd.read_csv(DEMO_DIR / "terrain.csv")[["zone_id", "name", "district", "state", "lat", "lon"]].to_dict("records")


@app.get("/api/zones/{zone_id}", tags=["zones"])
def zone(zone_id: str, _: dict = Depends(ANY)):
    d = pd.read_csv(DEMO_DIR / "terrain.csv"); d = d[d.zone_id == zone_id]
    if d.empty:
        raise HTTPException(404, "Unknown zone")
    return d.iloc[0].to_dict()


@app.get("/api/rainfall/{zone_id}", tags=["rainfall"])
def rainfall_zone(zone_id: str, _: dict = Depends(ANY)):
    """Hourly rainfall for a zone. data_mode is DEMO (synthetic)."""
    d = pd.read_csv(DEMO_DIR / "rainfall.csv"); d = d[d.zone_id == zone_id]
    return {"data_mode": "DEMO", "hourly": d[["timestamp", "rain_mm"]].to_dict("records")}


@app.get("/api/satellite", tags=["satellite"])
def satellite(_: dict = Depends(ANY)):
    """Sentinel-1 derived indicators. Mode is always DEMO unless a live adapter is configured."""
    return {"data_mode": "DEMO", "observations": pd.read_csv(DEMO_DIR / "satellite_features.csv").to_dict("records")}


@app.get("/api/landslides", tags=["events"])
def landslides(_: dict = Depends(ANY)):
    return {"data_mode": "DEMO", "events": pd.read_csv(DEMO_DIR / "landslides.csv").to_dict("records")}


@app.get("/api/exposure", tags=["exposure"])
def exposure(_: dict = Depends(ANY)):
    import json
    return {"villages": json.loads((DEMO_DIR / "villages.geojson").read_text()), "roads": json.loads((DEMO_DIR / "roads.geojson").read_text())}


@app.get("/api/alerts", tags=["alerts"])
def alerts(_: dict = Depends(ANY)):
    with Session() as s:
        return [{c.name: getattr(a, c.name) for c in Alert.__table__.columns} for a in s.query(Alert).order_by(Alert.id.desc()).limit(200)]


@app.post("/api/alerts/send", tags=["alerts"])
def alert_action(b: AlertAction, u: dict = Depends(AUTH)):
    """send (ADMIN only) / acknowledge / resolve."""
    with Session() as s:
        a = s.get(Alert, b.alert_id)
        if not a:
            raise HTTPException(404, "Alert not found")
        if b.action == "send":
            if u["role"] != "ADMIN":
                raise HTTPException(403, "Only ADMIN can send alerts")
            p = get_provider(); ok = all(p.send(r, a.message) for r in b.recipients)
            a.recipients = b.recipients; a.status = "SENT" if ok else "FAILED"
        elif b.action in ("acknowledge", "resolve"):
            a.status = b.action.upper().replace("ACKNOWLEDGE", "ACKNOWLEDGED").replace("RESOLVE", "RESOLVED") if b.action == "resolve" else "ACKNOWLEDGED"
        else:
            raise HTTPException(400, "Unknown action")
        s.commit()
        return {"id": a.id, "status": a.status}


@app.post("/api/feedback", tags=["feedback"])
def feedback(b: FeedbackIn, _: dict = Depends(AUTH)):
    if b.actual_event not in ("CONFIRMED_LANDSLIDE", "NO_LANDSLIDE", "FALSE_ALARM", "UNKNOWN"):
        raise HTTPException(422, "Invalid actual_event")
    with Session() as s:
        f = FieldFeedback(**b.model_dump()); s.add(f); s.commit()
        return {"id": f.id}


@app.get("/api/model/performance", tags=["model"])
def perf(_: dict = Depends(ANY)):
    return {k: models.load(k)["meta"] | {"feature_means": None, "feature_stds": None} for k in ("static", "dynamic")}


@app.get("/api/model/features", tags=["model"])
def feats(_: dict = Depends(ANY)):
    return {k: models.load(k)["meta"]["feature_importance"] for k in ("static", "dynamic")}


@app.get("/api/data-status", tags=["system"])
def data_status(_: dict = Depends(ANY)):
    """Honest data health: demo data is never reported as LIVE."""
    n = len(pd.read_csv(DEMO_DIR / "landslides.csv"))
    return {"rainfall": "DEMO", "dem": "AVAILABLE (synthetic terrain.csv)", "sar": "DEMO", "historical_inventory": "LIMITED" if n < 100 else "AVAILABLE",
            "exposure": "LIMITED (synthetic)", "requested_mode": DATA_MODE, "warnings": ["All data is synthetic DEMO data.", "Live adapters not configured."]}


@app.post("/api/admin/retrain", tags=["admin"])
def retrain(_: dict = Depends(ADMIN)):
    """Retrain static model with demo data + validated field feedback; saves a NEW version."""
    base = pd.read_csv(DEMO_DIR / "static_training.csv"); terr = pd.read_csv(DEMO_DIR / "terrain.csv")
    with Session() as s:
        fb = s.query(FieldFeedback).filter(FieldFeedback.validated == 1, FieldFeedback.actual_event.in_(["CONFIRMED_LANDSLIDE", "NO_LANDSLIDE", "FALSE_ALARM"])).all()
        extra = []
        for f in fb:
            t = terr[terr.zone_id == f.zone_id]
            if not t.empty:
                row = t.iloc[0].drop(["zone_id", "name", "district", "state"]).to_dict()
                row["occurrence"] = 1 if f.actual_event == "CONFIRMED_LANDSLIDE" else 0
                extra.append(row)
        df = pd.concat([base, pd.DataFrame(extra)], ignore_index=True) if extra else base
        meta = models.train("static", df)
        s.add(ModelVersion(kind="static", version=meta["version"], algorithm=meta["algorithm"], meta={k: meta[k] for k in ("metrics", "n_train", "trained_at")})); s.commit()
    return {"version": meta["version"], "feedback_records_used": len(extra), "metrics": meta["metrics"]}
