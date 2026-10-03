import pandas as pd
from fastapi.testclient import TestClient
from app import models
from app.alerts import build_message, should_alert
from app.features import rainfall_features
from app.fusion import classify, fuse


def test_fusion_weights():
    r = fuse(100, 100, 100); assert r["risk_score"] == 100 and r["risk_level"] == "CRITICAL"
    assert fuse(80, 40, 20)["risk_score"] == round(.45 * 80 + .4 * 40 + .15 * 20, 1)


def test_fusion_missing_sar_and_clamp():
    r = fuse(150, -5, float("nan")); assert r["data_completeness"] < 1 and 0 <= r["risk_score"] <= 100


def test_levels():
    assert [classify(x) for x in (0, 25, 50, 75, 100)] == ["LOW", "MEDIUM", "HIGH", "CRITICAL", "CRITICAL"]


def test_rainfall_features():
    f = rainfall_features(pd.Series([1.0] * 168)); assert f["rainfall_24h"] == 24 and f["rainfall_7d"] == 168 and f["antecedent_rainfall"] == 96


def test_models_train_and_predict():
    m = models.train("static"); assert 0.5 < m["metrics"]["roc_auc"] <= 1
    b = models.load("static"); t = pd.read_csv(models.DEMO_DIR / "terrain.csv")
    p = models.predict(b, t); assert ((p >= 0) & (p <= 100)).all()


def test_alert_rules():
    assert should_alert("HIGH") and not should_alert("MEDIUM") and "TERRAGUARDX ALERT" in build_message("X", 80, "rain")


def test_api_flow():
    from app.main import app
    c = TestClient(app)
    assert c.get("/api/health").json()["status"] == "ok"
    assert c.get("/api/risk").status_code == 401
    assert c.post("/api/auth/login", json={"username": "admin", "password": "bad"}).status_code == 401
    tok = lambda u, p: {"Authorization": "Bearer " + c.post("/api/auth/login", json={"username": u, "password": p}).json()["access_token"]}
    ad = tok("admin", "admin123"); vw = tok("viewer", "viewer123")
    assert c.post("/api/prediction", headers=vw).status_code == 403
    run = c.post("/api/prediction", headers=ad).json(); assert len(run["zones"]) == 48 and run["data_mode"] == "DEMO"
    z = c.get("/api/risk", headers=vw).json()["zones"]; assert z[0]["top_factors"] is not None
    assert len({x["risk_score"] for x in z}) > 10  # computed, not constant
    al = c.get("/api/alerts", headers=vw).json()
    assert all(a["severity"] in ("HIGH", "CRITICAL") for a in al)
    if al:
        assert c.post("/api/alerts/send", headers=ad, json={"alert_id": al[0]["id"], "action": "send"}).json()["status"] == "SENT"
    assert c.post("/api/feedback", headers=tok("authority", "authority123"), json={"zone_id": "Z01", "actual_event": "CONFIRMED_LANDSLIDE"}).status_code == 200
    r = c.post("/api/admin/retrain", headers=ad).json(); assert r["feedback_records_used"] == 1 and r["version"] >= 2
    assert c.get("/api/data-status", headers=vw).json()["rainfall"] == "DEMO"
