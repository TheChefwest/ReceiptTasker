# crud.py
from typing import List, Optional
from sqlmodel import select
from models import Task
from database import session_scope

def create_task(task: Task) -> Task:
    with session_scope() as s:
        s.add(task)
        s.commit()
        s.refresh(task)
        return task

def list_tasks() -> List[Task]:
    with session_scope() as s:
        return list(s.exec(select(Task)).all())

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
