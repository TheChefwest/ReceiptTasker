from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel, field_validator
from utils import to_aware

class TaskCreate(BaseModel):
    title: str
    description: Optional[str] = ""
    start_at: datetime
    until: Optional[datetime] = None
    rrule: Optional[str] = ""
    auto_print: Optional[bool] = True
    is_active: Optional[bool] = True

    @field_validator("start_at", "until", mode="before")
    @classmethod
    def _make_aware(cls, v):
        if v is None:
            return v
        if isinstance(v, str):
            # Let Pydantic parse first; it yields datetime (maybe naive)
            from datetime import datetime as _dt
            v = _dt.fromisoformat(v.replace("Z", "+00:00")) if "Z" in v else _dt.fromisoformat(v)
        return to_aware(v)

class TaskRead(BaseModel):
    id: int
    title: str
    description: str
    start_at: datetime
    until: Optional[datetime]
    rrule: str
    auto_print: bool
    is_active: bool
    last_fired_at: Optional[datetime]

class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    start_at: Optional[datetime] = None
    until: Optional[datetime] = None
    rrule: Optional[str] = None
    auto_print: Optional[bool] = None
    is_active: Optional[bool] = None

    @field_validator("start_at", "until", mode="before")
    @classmethod
    def _make_aware(cls, v):
        if v is None:
            return v
        from datetime import datetime as _dt
        if isinstance(v, str):
            v = _dt.fromisoformat(v.replace("Z", "+00:00")) if "Z" in v else _dt.fromisoformat(v)
        return to_aware(v)

class BlackoutPeriodCreate(BaseModel):
    name: Optional[str] = ""
    start_date: datetime
    end_date: datetime
    is_active: Optional[bool] = True

    @field_validator("start_date", "end_date", mode="before")
    @classmethod
    def _make_aware(cls, v):
        if v is None:
            return v
        if isinstance(v, str):
            from datetime import datetime as _dt
            v = _dt.fromisoformat(v.replace("Z", "+00:00")) if "Z" in v else _dt.fromisoformat(v)
        return to_aware(v)

class BlackoutPeriodRead(BaseModel):
    id: int
    name: str
    start_date: datetime
    end_date: datetime
    is_active: bool
    created_at: datetime

class BlackoutPeriodUpdate(BaseModel):
    name: Optional[str] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    is_active: Optional[bool] = None

    @field_validator("start_date", "end_date", mode="before")
    @classmethod
    def _make_aware(cls, v):
        if v is None:
            return v
        from datetime import datetime as _dt
        if isinstance(v, str):
            v = _dt.fromisoformat(v.replace("Z", "+00:00")) if "Z" in v else _dt.fromisoformat(v)
        return to_aware(v)

class ImportPayload(BaseModel):
    tasks: List[TaskCreate]
