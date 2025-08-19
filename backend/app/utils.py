from zoneinfo import ZoneInfo
from datetime import datetime
import os

TZ = os.getenv("TZ", "Europe/Amsterdam")

def now_tz() -> datetime:
    return datetime.now(ZoneInfo(TZ))

def to_aware(dt: datetime) -> datetime:
    """Make any datetime timezone-aware in configured TZ."""
    if dt is None:
        return None
    tz = ZoneInfo(TZ)
    if dt.tzinfo is None:
        return dt.replace(tzinfo=tz)
    return dt.astimezone(tz)
