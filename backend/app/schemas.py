from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel

class TaskCreate(BaseModel):
    title: str
    description: Optional[str] = ""
    start_at: datetime
    until: Optional[datetime] = None
    rrule: Optional[str] = ""
    auto_print: Optional[bool] = True
    is_active: Optional[bool] = True

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

class ImportPayload(BaseModel):
    tasks: List[TaskCreate]