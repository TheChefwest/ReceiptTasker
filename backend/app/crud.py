# crud.py
from typing import List, Optional
from sqlmodel import select, or_
from models import Task, BlackoutPeriod
from database import session_scope

def create_task(task: Task) -> Task:
    with session_scope() as s:
        s.add(task)
        s.commit()
        s.refresh(task)
        return task

def list_tasks(search: Optional[str] = None, category: Optional[str] = None) -> List[Task]:
    with session_scope() as s:
        query = select(Task)
        
        # Add search filter
        if search:
            search_term = f"%{search}%"
            query = query.where(
                or_(
                    Task.title.ilike(search_term),
                    Task.description.ilike(search_term)
                )
            )
        
        # Add category filter
        if category and category != "all":
            query = query.where(Task.category == category)
            
        return list(s.exec(query).all())

def get_task(task_id: int) -> Optional[Task]:
    with session_scope() as s:
        return s.get(Task, task_id)

def update_task(task_id: int, **data) -> Optional[Task]:
    with session_scope() as s:
        obj = s.get(Task, task_id)
        if not obj:
            return None
        for k, v in data.items():
            setattr(obj, k, v)
        s.add(obj)
        s.commit()
        s.refresh(obj)
        return obj

def delete_task(task_id: int) -> bool:
    with session_scope() as s:
        obj = s.get(Task, task_id)
        if not obj:
            return False
        s.delete(obj)
        s.commit()
        return True

def create_blackout_period(blackout: BlackoutPeriod) -> BlackoutPeriod:
    with session_scope() as s:
        s.add(blackout)
        s.commit()
        s.refresh(blackout)
        return blackout

def list_blackout_periods() -> List[BlackoutPeriod]:
    with session_scope() as s:
        return list(s.exec(select(BlackoutPeriod)).all())

def get_blackout_period(blackout_id: int) -> Optional[BlackoutPeriod]:
    with session_scope() as s:
        return s.get(BlackoutPeriod, blackout_id)

def update_blackout_period(blackout_id: int, **data) -> Optional[BlackoutPeriod]:
    with session_scope() as s:
        obj = s.get(BlackoutPeriod, blackout_id)
        if not obj:
            return None
        for k, v in data.items():
            setattr(obj, k, v)
        s.add(obj)
        s.commit()
        s.refresh(obj)
        return obj

def delete_blackout_period(blackout_id: int) -> bool:
    with session_scope() as s:
        obj = s.get(BlackoutPeriod, blackout_id)
        if not obj:
            return False
        s.delete(obj)
        s.commit()
        return True
