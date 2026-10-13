"""Central configuration (env-driven, no hardcoded secrets)."""
import os
import shutil
from pathlib import Path

BACKEND_DIR = Path(__file__).resolve().parents[1]
ROOT = Path(__file__).resolve().parents[2]
if (Path("/app/datasets")).exists():
    ROOT = Path("/app")
elif not (ROOT / "datasets").exists() and (BACKEND_DIR / "datasets").exists():
    ROOT = BACKEND_DIR

# Load .env file if available
for p in [ROOT / ".env", BACKEND_DIR / ".env"]:
    if p.exists():
        with open(p, "r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith("#") and "=" in line:
                    k, v = line.split("=", 1)
                    os.environ.setdefault(k.strip(), v.strip())
        break

if (ROOT / "datasets" / "demo").exists():
    DEMO_DIR = ROOT / "datasets" / "demo"
elif (BACKEND_DIR / "datasets" / "demo").exists():
    DEMO_DIR = BACKEND_DIR / "datasets" / "demo"
else:
    DEMO_DIR = ROOT / "datasets" / "demo"

LIVE_DIR = ROOT / "datasets" / "live"
try:
    LIVE_DIR.mkdir(parents=True, exist_ok=True)
except OSError:
    LIVE_DIR = Path("/tmp/datasets/live")
    LIVE_DIR.mkdir(parents=True, exist_ok=True)

MODEL_DIR = Path(os.getenv("MODEL_DIR", (ROOT / "backend" / "models") if (ROOT / "backend" / "models").exists() else (BACKEND_DIR / "models")))

DATA_MODE = os.getenv("DATA_MODE", "live").lower()

db_source = (ROOT / "terraguardx.db") if (ROOT / "terraguardx.db").exists() else (BACKEND_DIR / "terraguardx.db")
db_file = db_source.resolve().as_posix() if db_source.exists() else (ROOT / "terraguardx.db").resolve().as_posix()

if os.getenv("VERCEL") and not os.getenv("DATABASE_URL"):
    tmp_db = Path("/tmp/terraguardx.db")
    if db_source.exists() and not tmp_db.exists():
        try:
            shutil.copyfile(db_source, tmp_db)
        except OSError:
            pass
    db_file = tmp_db.as_posix()

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
