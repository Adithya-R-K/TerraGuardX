"""Risk fusion engine: combines static, dynamic and SAR scores (all 0-100)."""
from __future__ import annotations
import math
from .config import WEIGHTS, LEVELS


def clamp(v: float) -> float:
    return max(0.0, min(100.0, float(v)))


def classify(score: float) -> str:
    """Map a 0-100 score to a prototype risk level."""
    for upper, name in LEVELS:
        if score < upper:
            return name
    return "CRITICAL"


def fuse(static: float, dynamic: float, sar: float | None, weights: dict | None = None) -> dict:
    """Weighted fusion. If SAR is missing its weight is redistributed."""
    w = dict(weights or WEIGHTS)
    vals = {"static": clamp(static), "dynamic": clamp(dynamic),
            "sar": None if sar is None or math.isnan(sar) else clamp(sar)}
    if vals["sar"] is None:
        w.pop("sar"); vals.pop("sar")
    tot = sum(w.values())
    score = sum(w[k] / tot * vals[k] for k in vals)
    c = list(vals.values()); m = sum(c) / len(c)
    spread = (sum((x - m) ** 2 for x in c) / len(c)) ** 0.5
    completeness = len(vals) / 3
    conf = round(max(0.0, min(1.0, 1 - spread / 100)) * (0.5 + 0.5 * completeness), 2)
    return {"risk_score": round(score, 1), "risk_level": classify(score),
            "model_confidence": conf, "data_completeness": round(completeness, 2)}
