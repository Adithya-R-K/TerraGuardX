"""Static susceptibility + dynamic trigger models (train / load / predict / explain). Versioned."""
from __future__ import annotations
import json, time
import joblib
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.impute import SimpleImputer
from sklearn.metrics import (accuracy_score, confusion_matrix, f1_score, precision_score, recall_score, roc_auc_score)
from sklearn.model_selection import GroupShuffleSplit
from sklearn.pipeline import Pipeline
from .config import DEMO_DIR, MODEL_DIR

try:
    from xgboost import XGBClassifier
except Exception:  # pragma: no cover
    XGBClassifier = None

STATIC_FEATURES = ["elevation", "slope", "aspect", "curvature", "ruggedness", "soil_code", "geology_code", "ndvi", "dist_road_km", "ls_density"]
DYNAMIC_FEATURES = ["rainfall_1h", "rainfall_3h", "rainfall_6h", "rainfall_12h", "rainfall_24h", "rainfall_48h", "rainfall_72h",
                    "rainfall_7d", "rainfall_intensity", "antecedent_rainfall", "slope", "susceptibility"]
LABELS = {"static": "occurrence", "dynamic": "trigger"}
NICE = {"rainfall_24h": "High 24-hour rainfall", "rainfall_72h": "High 72-hour rainfall", "slope": "Steep slope",
        "susceptibility": "High static susceptibility", "antecedent_rainfall": "Elevated antecedent rainfall",
        "ndvi": "Low vegetation (NDVI)", "ruggedness": "Rugged terrain", "dist_road_km": "Proximity to roads",
        "ls_density": "Historical landslide density", "rainfall_intensity": "High rainfall intensity"}


def _candidates():
    c = {"random_forest": RandomForestClassifier(n_estimators=150, min_samples_leaf=3, random_state=0, n_jobs=-1)}
    if XGBClassifier:
        c["xgboost"] = XGBClassifier(n_estimators=150, max_depth=4, learning_rate=.08, eval_metric="logloss", random_state=0)
    return c


def _next_version(kind: str) -> int:
    MODEL_DIR.mkdir(parents=True, exist_ok=True)
    v = [int(p.stem.split("_v")[-1]) for p in MODEL_DIR.glob(f"{kind}_v*.joblib")]
    return max(v, default=0) + 1


def train(kind: str, df: pd.DataFrame | None = None) -> dict:
    """Train RF + XGBoost, select by validation ROC-AUC, save new version (never overwrites)."""
    feats = STATIC_FEATURES if kind == "static" else DYNAMIC_FEATURES
    if df is None:
        df = pd.read_csv(DEMO_DIR / ("static_training.csv" if kind == "static" else "dynamic_training.csv"))
    df = df.dropna(subset=[LABELS[kind]]).drop_duplicates()
    y = df[LABELS[kind]].astype(int)
    # spatial split for static (longitude/latitude blocks); random groups for dynamic
    groups = (np.floor(df.lon * 2) * 100 + np.floor(df.lat * 2)).astype(int) if kind == "static" and "lon" in df else np.arange(len(df)) // 20
    tr, te = next(GroupShuffleSplit(n_splits=1, test_size=.25, random_state=1).split(df, y, groups))
    tr_idx, va_idx = next(GroupShuffleSplit(n_splits=1, test_size=.2, random_state=2).split(tr, y.iloc[tr], groups[tr]))
    tr_i, va_i = tr[tr_idx], tr[va_idx]
    X = df[feats]; best = None
    for name, est in _candidates().items():
        pipe = Pipeline([("imp", SimpleImputer(strategy="median")), ("clf", est)]).fit(X.iloc[tr_i], y.iloc[tr_i])
        auc = roc_auc_score(y.iloc[va_i], pipe.predict_proba(X.iloc[va_i])[:, 1])
        if best is None or auc > best[2]:
            best = (name, pipe, auc)
    name, pipe, val_auc = best
    pred = pipe.predict(X.iloc[te]); prob = pipe.predict_proba(X.iloc[te])[:, 1]
    cm = confusion_matrix(y.iloc[te], pred, labels=[0, 1]); tn, fp, fn, tp = cm.ravel()
    imp = pipe.named_steps["clf"].feature_importances_
    meta = {"kind": kind, "version": _next_version(kind), "algorithm": name, "trained_at": time.strftime("%Y-%m-%dT%H:%M:%S"),
            "n_train": int(len(tr_i)), "n_val": int(len(va_i)), "n_test": int(len(te)), "val_roc_auc": round(val_auc, 3),
            "metrics": {"accuracy": accuracy_score(y.iloc[te], pred), "precision": precision_score(y.iloc[te], pred, zero_division=0),
                        "recall": recall_score(y.iloc[te], pred, zero_division=0), "f1": f1_score(y.iloc[te], pred, zero_division=0),
                        "roc_auc": roc_auc_score(y.iloc[te], prob), "false_positive_rate": fp / max(fp + tn, 1),
                        "false_negative_rate": fn / max(fn + tp, 1), "confusion_matrix": cm.tolist()},
            "feature_importance": dict(sorted(zip(feats, map(float, imp)), key=lambda kv: -kv[1])),
            "feature_means": X.mean().to_dict(), "feature_stds": X.std().replace(0, 1).to_dict(),
            "note": "Metrics from SYNTHETIC demo data unless trained on validated records; not scientific validation."}
    meta["metrics"] = {k: (round(float(v), 3) if k != "confusion_matrix" else v) for k, v in meta["metrics"].items()}
    joblib.dump({"pipeline": pipe, "meta": meta, "features": feats}, MODEL_DIR / f"{kind}_v{meta['version']}.joblib")
    (MODEL_DIR / f"{kind}_v{meta['version']}.json").write_text(json.dumps(meta, indent=2))
    return meta


def load(kind: str) -> dict:
    """Load latest version of a model, training one if none exists."""
    files = sorted(MODEL_DIR.glob(f"{kind}_v*.joblib"), key=lambda p: int(p.stem.split("_v")[-1]))
    if not files:
        train(kind)
        return load(kind)
    return joblib.load(files[-1])


def predict(bundle: dict, rows: pd.DataFrame) -> np.ndarray:
    """Return probability*100 for each row."""
    return bundle["pipeline"].predict_proba(rows[bundle["features"]])[:, 1] * 100


def explain(bundle: dict, row: pd.Series, top: int = 3) -> list[dict]:
    """Top contributing features = global importance x standardized deviation above training mean."""
    m = bundle["meta"]; out = []
    for f, imp in m["feature_importance"].items():
        z = (float(row.get(f, 0)) - m["feature_means"][f]) / m["feature_stds"][f]
        if f == "ndvi" or f == "dist_road_km":
            z = -z
        out.append((imp * z, f))
    out.sort(reverse=True)
    return [{"feature": f, "label": NICE.get(f, f), "contribution": round(c, 3)} for c, f in out[:top] if c > 0]
