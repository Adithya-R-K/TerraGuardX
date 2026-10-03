"""SQLAlchemy persistence (SQLite by default, PostgreSQL/PostGIS via DATABASE_URL)."""
from __future__ import annotations
import datetime as dt
from sqlalchemy import JSON, Column, DateTime, Float, Integer, String, Text, create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from .config import DATABASE_URL

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {})
Session = sessionmaker(bind=engine, expire_on_commit=False)
Base = declarative_base()
now = lambda: dt.datetime.utcnow()


class RiskPrediction(Base):
    __tablename__ = "risk_predictions"
    id = Column(Integer, primary_key=True); zone_id = Column(String, index=True); run_id = Column(String, index=True)
    created_at = Column(DateTime, default=now); risk_score = Column(Float); risk_level = Column(String)
    payload = Column(JSON); data_mode = Column(String)


class Alert(Base):
    __tablename__ = "alerts"
    id = Column(Integer, primary_key=True); zone_id = Column(String); prediction_id = Column(Integer)
    severity = Column(String); score = Column(Float); trigger = Column(String); message = Column(Text)
    recipients = Column(JSON, default=list); status = Column(String, default="PENDING")  # PENDING/SENT/ACKNOWLEDGED/RESOLVED
    created_at = Column(DateTime, default=now)


class FieldFeedback(Base):
    __tablename__ = "field_feedback"
    id = Column(Integer, primary_key=True); zone_id = Column(String); prediction_id = Column(Integer, nullable=True)
    actual_event = Column(String); severity = Column(Integer, nullable=True); notes = Column(Text, nullable=True)
    latitude = Column(Float, nullable=True); longitude = Column(Float, nullable=True); event_date = Column(String, nullable=True)
    photo_path = Column(String, nullable=True); validated = Column(Integer, default=1); created_at = Column(DateTime, default=now)


class ModelVersion(Base):
    __tablename__ = "model_versions"
    id = Column(Integer, primary_key=True); kind = Column(String); version = Column(Integer); algorithm = Column(String)
    meta = Column(JSON); created_at = Column(DateTime, default=now)


def init_db() -> None:
    Base.metadata.create_all(engine)
