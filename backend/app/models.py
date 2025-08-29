from typing import Optional
from datetime import datetime
from sqlmodel import SQLModel, Field

class Task(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    title: str
    description: str = ""
    # When to first run/print
    start_at: datetime
    # Optional end to recurrence
    until: Optional[datetime] = None
    # RFC 5545 RRULE string, e.g. "FREQ=DAILY;INTERVAL=1"; if empty => one-off
    rrule: str = ""
    # Whether to auto-print when due
    auto_print: bool = True
    # Whether task is active
    is_active: bool = True
    # Last time we printed this task (for recurrence progression)
    last_fired_at: Optional[datetime] = None

class BlackoutPeriod(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = ""  # Optional name for the blackout period (e.g. "Christmas Holiday")
    start_date: datetime
    end_date: datetime
    is_active: bool = True
    created_at: datetime = Field(default_factory=datetime.now)