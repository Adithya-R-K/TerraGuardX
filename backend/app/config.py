"""Central configuration (env-driven, no hardcoded secrets)."""
import os
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
if (Path("/app/datasets")).exists():
    ROOT = Path("/app")
DEMO_DIR = ROOT / "datasets" / "demo"
MODEL_DIR = Path(os.getenv("MODEL_DIR", ROOT / "backend" / "models"))
DATA_MODE = os.getenv("DATA_MODE", "demo").lower()
DATABASE_URL = os.getenv("DATABASE_URL") or "sqlite:///./terraguardx.db"
JWT_SECRET = os.getenv("JWT_SECRET") or "dev-only-change-me"
WEIGHTS = {  # prototype weights, configurable via env
    "static": float(os.getenv("W_STATIC", 0.45)),
    "dynamic": float(os.getenv("W_DYNAMIC", 0.40)),
    "sar": float(os.getenv("W_SAR", 0.15)),
}
LEVELS = [(25, "LOW"), (50, "MEDIUM"), (75, "HIGH"), (100.0001, "CRITICAL")]  # prototype thresholds
DISCLAIMER = ("Prototype decision-support system. Predictions require validation and "
              "should not replace official disaster-management instructions.")
USERS = {  # demo accounts; passwords from env (dev defaults for demo mode only)
    "admin": ("ADMIN", os.getenv("ADMIN_PASSWORD", "admin123")),
    "authority": ("AUTHORITY", os.getenv("AUTHORITY_PASSWORD", "authority123")),
    "viewer": ("VIEWER", os.getenv("VIEWER_PASSWORD", "viewer123")),
}
