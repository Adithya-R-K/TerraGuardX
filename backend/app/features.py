"""Rainfall feature engineering."""
from __future__ import annotations
import pandas as pd

WINDOWS = {"rainfall_1h": 1, "rainfall_3h": 3, "rainfall_6h": 6, "rainfall_12h": 12,
           "rainfall_24h": 24, "rainfall_48h": 48, "rainfall_72h": 72, "rainfall_7d": 168}


def rainfall_features(hourly: pd.Series) -> dict:
    """hourly: mm per hour, chronological (latest last). Returns accumulation features."""
    h = hourly.astype(float).fillna(0.0).reset_index(drop=True)
    f = {k: float(h.tail(n).sum()) for k, n in WINDOWS.items()}
    f["rainfall_intensity"] = float(h.tail(6).max()) if len(h) else 0.0  # peak mm/h over last 6h
    f["antecedent_rainfall"] = max(0.0, f["rainfall_7d"] - f["rainfall_72h"])
    return f
