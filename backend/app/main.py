from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import List
from pydantic_settings import BaseSettings
from .database import init_db
from .schemas import TaskCreate, TaskRead, TaskUpdate, ImportPayload
from .models import Task
from .crud import create_task, list_tasks, get_task, update_task, delete_task
from .printing import ThermalPrinter
from .scheduling import schedule_task, start as start_scheduler
from .utils import now_tz

class Settings(BaseSettings):
    PRINTER_IP: str = "192.168.2.34"
    PRINTER_PORT: int = 9100

settings = Settings()
app = FastAPI(title="TaskPrinter API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Bootstrap
init_db()
start_scheduler()
printer = ThermalPrinter(settings.PRINTER_IP, settings.PRINTER_PORT)

@app.get("/health")
def health():
    return {"status": "ok", "now": now_tz().isoformat()}

@app.get("/tasks", response_model=List[TaskRead])
def api_list_tasks():
    return list_tasks()

@app.post("/tasks", response_model=TaskRead)
def api_create_task(payload: TaskCreate):
    t = Task(**payload.dict())
    t = create_task(t)
    # schedule if active
    schedule_task(t)
    return t

@app.get("/tasks/{task_id}", response_model=TaskRead)
def api_get_task(task_id: int):
    t = get_task(task_id)
    if not t:
        raise HTTPException(404, "Task not found")
    return t

@app.patch("/tasks/{task_id}", response_model=TaskRead)
def api_update_task(task_id: int, payload: TaskUpdate):
    t = get_task(task_id)
    if not t:
        raise HTTPException(404, "Task not found")
    updated = update_task(task_id, **{k: v for k, v in payload.dict().items() if v is not None})
    # reschedule
    schedule_task(updated)
    return updated

@app.delete("/tasks/{task_id}")
def api_delete_task(task_id: int):
    ok = delete_task(task_id)
    if not ok:
        raise HTTPException(404, "Task not found")
    return {"ok": True}

@app.post("/tasks/{task_id}/print")
def api_print_task(task_id: int):
    t = get_task(task_id)
    if not t:
        raise HTTPException(404, "Task not found")
    printer.print_task(t.title, t.description)
    return {"printed": True}

@app.post("/import")
def api_import(payload: ImportPayload):
    created = []
    for t in payload.tasks:
        obj = Task(**t.dict())
        created.append(create_task(obj))
    for t in created:
        schedule_task(t)
    return {"count": len(created)}