from typing import List, Optional
from sqlmodel import select
from .models import Task
from .database import get_session

def create_task(task: Task) -> Task:
    with get_session() as s:
        s.add(task)
        s.commit()
        s.refresh(task)
        return task

def get_task(task_id: int) -> Optional[Task]:
    with get_session() as s:
        return s.get(Task, task_id)

def list_tasks() -> List[Task]:
    with get_session() as s:
        return list(s.exec(select(Task)))

def update_task(task_id: int, **fields) -> Optional[Task]:
    with get_session() as s:
        t = s.get(Task, task_id)
        if not t:
            return None
        for k, v in fields.items():
            if v is not None:
                setattr(t, k, v)
        s.add(t)
        s.commit()
        s.refresh(t)
        return t

def delete_task(task_id: int) -> bool:
    with get_session() as s:
        t = s.get(Task, task_id)
        if not t:
            return False
        s.delete(t)
        s.commit()
        return True