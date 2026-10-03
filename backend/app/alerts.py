"""Alert generation + SMS provider interface (mock works without credentials)."""
from __future__ import annotations
import os
from abc import ABC, abstractmethod
import logging
log = logging.getLogger("terraguardx.alerts")


class SMSProvider(ABC):
    @abstractmethod
    def send(self, to: str, body: str) -> bool: ...


class MockSMSProvider(SMSProvider):
    sent: list = []
    def send(self, to: str, body: str) -> bool:
        self.sent.append((to, body)); log.info("MOCK SMS to %s: %s", to, body); return True


class TwilioSMSProvider(SMSProvider):  # optional; needs TWILIO_* env vars + `pip install twilio`
    def send(self, to: str, body: str) -> bool:
        from twilio.rest import Client
        Client(os.environ["TWILIO_ACCOUNT_SID"], os.environ["TWILIO_AUTH_TOKEN"]).messages.create(to=to, from_=os.environ["TWILIO_PHONE_NUMBER"], body=body)
        return True


def get_provider() -> SMSProvider:
    return TwilioSMSProvider() if os.getenv("TWILIO_ACCOUNT_SID") else MockSMSProvider()


def should_alert(level: str) -> bool:
    return level in ("HIGH", "CRITICAL")


def build_message(location: str, score: float, trigger: str) -> str:
    return (f"TERRAGUARDX ALERT:\n{'High' if score < 75 else 'Critical'} landslide risk detected near {location}.\n"
            f"Risk score: {score:.0f}/100.\nPrimary trigger: {trigger}.\nPlease follow instructions from local authorities.")
