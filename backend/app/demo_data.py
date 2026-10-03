"""Deterministic SYNTHETIC demo data generator. Nothing here is a real measurement."""
from __future__ import annotations
import json
import numpy as np
import pandas as pd
from .config import DEMO_DIR

PLACES = [  # (name, district, state, lat, lon)
    ("Kohima", "Kohima", "Nagaland", 25.67, 94.11), ("Shillong", "East Khasi Hills", "Meghalaya", 25.57, 91.88),
    ("Aizawl", "Aizawl", "Mizoram", 23.73, 92.72), ("Gangtok", "Gangtok", "Sikkim", 27.33, 88.61),
    ("Itanagar", "Papum Pare", "Arunachal Pradesh", 27.08, 93.61), ("Imphal", "Imphal West", "Manipur", 24.82, 93.94),
    ("Guwahati", "Kamrup Metro", "Assam", 26.14, 91.74), ("Tawang", "Tawang", "Arunachal Pradesh", 27.59, 91.86),
    ("Churachandpur", "Churachandpur", "Manipur", 24.33, 93.68), ("Dimapur Hills", "Dimapur", "Nagaland", 25.9, 93.73),
    ("Cherrapunji", "East Khasi Hills", "Meghalaya", 25.27, 91.72), ("Lunglei", "Lunglei", "Mizoram", 22.89, 92.73),
]


def latent(slope, ndvi, rugged, road, dens):
    """Hidden synthetic rule used ONLY to create demo labels."""
    return 0.07 * slope - 2.5 * ndvi + 1.5 * rugged - 0.15 * road + 3 * dens - 1.5


def terrain_frame(rng, n, centers=None) -> pd.DataFrame:
    rows = []
    for i in range(n):
        if centers is None:
            lat, lon = rng.uniform(22.5, 27.8), rng.uniform(88.5, 95)
        else:
            c = centers[i % len(centers)]
            lat, lon = c[3] + rng.normal(0, .08), c[4] + rng.normal(0, .08)
        slope = float(np.clip(rng.gamma(3, 6), 0, 70))
        rows.append(dict(lat=lat, lon=lon, elevation=float(rng.uniform(100, 3200)), slope=slope,
                         aspect=float(rng.uniform(0, 360)), curvature=float(rng.normal(0, 1)),
                         ruggedness=float(np.clip(slope / 50 + rng.normal(0, .15), 0, 1.5)),
                         soil_code=int(rng.integers(0, 4)), geology_code=int(rng.integers(0, 4)),
                         ndvi=float(np.clip(rng.normal(.6, .18), 0, 1)),
                         dist_road_km=float(rng.exponential(2)), ls_density=float(np.clip(rng.exponential(.1), 0, 1))))
    return pd.DataFrame(rows)


def generate(seed: int = 42) -> None:
    """Write all synthetic demo datasets to datasets/demo/."""
    rng = np.random.default_rng(seed)
    DEMO_DIR.mkdir(parents=True, exist_ok=True)
    tr = terrain_frame(rng, 2500)
    z = latent(tr.slope, tr.ndvi, tr.ruggedness, tr.dist_road_km, tr.ls_density) + rng.normal(0, .6, len(tr))
    tr["occurrence"] = (rng.random(len(tr)) < 1 / (1 + np.exp(-z))).astype(int)
    tr.to_csv(DEMO_DIR / "static_training.csv", index=False)
    n = 3000
    d = pd.DataFrame({"rainfall_24h": rng.gamma(2, 25, n), "slope": rng.uniform(2, 60, n),
                      "susceptibility": rng.uniform(0, 100, n), "antecedent_rainfall": rng.gamma(2, 40, n)})
    d["rainfall_1h"] = d.rainfall_24h * rng.uniform(.02, .3, n)
    d["rainfall_3h"] = d.rainfall_24h * rng.uniform(.1, .6, n)
    d["rainfall_6h"] = np.maximum(d.rainfall_3h, d.rainfall_24h * rng.uniform(.2, .8, n))
    d["rainfall_12h"] = np.maximum(d.rainfall_6h, d.rainfall_24h * rng.uniform(.4, 1, n))
    d["rainfall_48h"] = d.rainfall_24h * rng.uniform(1, 1.8, n)
    d["rainfall_72h"] = d.rainfall_48h * rng.uniform(1, 1.4, n)
    d["rainfall_7d"] = d.rainfall_72h + d.antecedent_rainfall
    d["rainfall_intensity"] = d.rainfall_6h / 6
    zz = .03 * d.rainfall_24h + .008 * d.antecedent_rainfall + .02 * d.slope + .02 * d.susceptibility - 4.5 + rng.normal(0, .7, n)
    d["trigger"] = (rng.random(n) < 1 / (1 + np.exp(-zz))).astype(int)
    d.to_csv(DEMO_DIR / "dynamic_training.csv", index=False)

    feats, rain, sat, vill, slides = [], [], [], [], []
    t = pd.date_range(end=pd.Timestamp.now("UTC").floor("h").tz_localize(None), periods=168, freq="h")
    zt = terrain_frame(rng, len(PLACES) * 4, PLACES)
    for i, r in zt.iterrows():
        p = PLACES[i % len(PLACES)]; zid = f"Z{i+1:02d}"
        feats.append({"zone_id": zid, "name": f"{p[0]} Sector {i//len(PLACES)+1}", "district": p[1], "state": p[2], **r.to_dict()})
        wet = rng.uniform(.3, 1.6)
        h = rng.gamma(.4, 1.2 * wet, 168) * (rng.random(168) < .45)
        if rng.random() < .45:  # synthetic storm in the last ~30h
            s = rng.integers(130, 150); h[s:s + 14] += rng.gamma(4, 4 * wet, 14)
        rain += [(zid, ts.isoformat(), round(float(v), 2)) for ts, v in zip(t, h)]
        lt = latent(r.slope, r.ndvi, r.ruggedness, r.dist_road_km, r.ls_density)
        sat.append({"zone_id": zid, "sar_backscatter_db": round(float(rng.normal(-12, 2)), 2),
                    "coherence": round(float(np.clip(rng.normal(.6 - .05 * lt, .1), 0, 1)), 3),
                    "deformation_mm": round(float(max(0, rng.normal(3 + 4 * lt, 3))), 2),
                    "ndvi_change": round(float(rng.normal(-.03, .05)), 3), "acquisition_date": str(t[-1].date()), "mode": "DEMO"})
        vill.append({"type": "Feature", "properties": {"name": f"Village-{zid}", "zone_id": zid, "population": int(rng.integers(150, 4000))},
                     "geometry": {"type": "Point", "coordinates": [r.lon + .01, r.lat + .01]}})
        if rng.random() < .3 + .4 / (1 + np.exp(-lt)):
            slides.append({"latitude": r.lat, "longitude": r.lon, "date": "2020-07-15", "severity": int(rng.integers(1, 4)), "source": "SYNTHETIC", "occurrence": 1})
    f = pd.DataFrame(feats)
    f.to_csv(DEMO_DIR / "terrain.csv", index=False)
    pd.DataFrame(rain, columns=["zone_id", "timestamp", "rain_mm"]).to_csv(DEMO_DIR / "rainfall.csv", index=False)
    pd.DataFrame(sat).to_csv(DEMO_DIR / "satellite_features.csv", index=False)
    pd.DataFrame(slides).to_csv(DEMO_DIR / "landslides.csv", index=False)
    zones = [{"type": "Feature", "properties": {k: x[k] for k in ("zone_id", "name", "district", "state")},
              "geometry": {"type": "Polygon", "coordinates": [[[x.lon - .03, x.lat - .03], [x.lon + .03, x.lat - .03], [x.lon + .03, x.lat + .03], [x.lon - .03, x.lat + .03], [x.lon - .03, x.lat - .03]]]}} for _, x in f.iterrows()]
    roads = [{"type": "Feature", "properties": {"name": f"Road-{x.zone_id}", "zone_id": x.zone_id},
              "geometry": {"type": "LineString", "coordinates": [[x.lon - .05, x.lat + .02], [x.lon, x.lat], [x.lon + .05, x.lat - .02]]}} for _, x in f.iterrows()]
    for name, fs in (("zones", zones), ("villages", vill), ("roads", roads)):
        (DEMO_DIR / f"{name}.geojson").write_text(json.dumps({"type": "FeatureCollection", "features": fs, "properties": {"data_mode": "DEMO", "note": "synthetic"}}))
