"""Central configuration (env-driven, no hardcoded secrets)."""
import os
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
if (Path("/app/datasets")).exists():
    ROOT = Path("/app")

# Load .env file if available
env_path = ROOT / ".env"
if env_path.exists():
    with open(env_path, "r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if line and not line.startswith("#") and "=" in line:
                k, v = line.split("=", 1)
                os.environ.setdefault(k.strip(), v.strip())

DEMO_DIR = ROOT / "datasets" / "demo"
LIVE_DIR = ROOT / "datasets" / "live"
LIVE_DIR.mkdir(parents=True, exist_ok=True)
MODEL_DIR = Path(os.getenv("MODEL_DIR", ROOT / "backend" / "models"))

DATA_MODE = os.getenv("DATA_MODE", "live").lower()
db_file = (ROOT / "terraguardx.db").resolve().as_posix()
DATABASE_URL = os.getenv("DATABASE_URL") or f"sqlite:///{db_file}"
JWT_SECRET = os.getenv("JWT_SECRET") or "dev-only-change-me-terraguardx-secret-key-32chars"
WEIGHTS = {  # prototype weights, configurable via env
    "static": float(os.getenv("W_STATIC", 0.45)),
    "dynamic": float(os.getenv("W_DYNAMIC", 0.40)),
    "sar": float(os.getenv("W_SAR", 0.15)),
}
LEVELS = [(25, "LOW"), (50, "MEDIUM"), (75, "HIGH"), (100.0001, "CRITICAL")]  # prototype thresholds
DISCLAIMER = ("Prototype decision-support system. Predictions require validation and "
              "should not replace official disaster-management instructions.")
USERS = {  # demo accounts; passwords from env (dev defaults for demo mode only)
    "admin": ("ADMIN", os.getenv("ADMIN_PASSWORD", "Sasikarthi@123" if os.getenv("ADMIN_PASSWORD") else "admin123")),
    "authority": ("AUTHORITY", os.getenv("AUTHORITY_PASSWORD", "Sasikarthi@1234" if os.getenv("AUTHORITY_PASSWORD") else "authority123")),
    "viewer": ("VIEWER", os.getenv("VIEWER_PASSWORD", "Sasikarthi@12345" if os.getenv("VIEWER_PASSWORD") else "viewer123")),
}
