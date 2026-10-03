import os, sys, tempfile
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "backend"))
_t = tempfile.mkdtemp()
os.environ["DATABASE_URL"] = f"sqlite:///{_t}/t.db"
os.environ["MODEL_DIR"] = f"{_t}/models"
from app import demo_data
demo_data.generate()
