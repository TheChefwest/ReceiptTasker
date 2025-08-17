from zoneinfo import ZoneInfo
from datetime import datetime
import os

TZ = os.getenv("TZ", "Europe/Amsterdam")

def now_tz() -> datetime:
    return datetime.now(ZoneInfo(TZ))