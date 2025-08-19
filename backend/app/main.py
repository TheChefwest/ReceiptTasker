# main.py
from fastapi import FastAPI, HTTPException, APIRouter
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from typing import List, Optional
from pydantic_settings import BaseSettings
from datetime import datetime
import os
import socket

# ---- local modules (absolute imports) ----
from database import init_db
from schemas import TaskCreate, TaskRead, TaskUpdate, ImportPayload
from models import Task
from crud import create_task, list_tasks, get_task, update_task, delete_task
from printing import ThermalPrinter
from scheduling import schedule_task, start as start_scheduler
from utils import now_tz, to_aware

# =========================
# Settings
# =========================
class Settings(BaseSettings):
    PRINTER_IP: str = os.getenv("PRINTER_IP", "192.168.2.34")
    PRINTER_PORT: int = int(os.getenv("PRINTER_PORT", "9100"))
    TZ: str = os.getenv("TZ", "Europe/Amsterdam")

settings = Settings()

# =========================
# App & middleware
# =========================
app = FastAPI(title="TaskPrinter (UI + API)")

# If you keep everything same-origin (UI served by this app) CORS isn't strictly needed,
# but leaving it permissive avoids trouble if you later front this with a proxy.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # safe to tighten later
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =========================
# Bootstrap
# =========================
# Initialize DB, start scheduler, set up printer once on import
init_db()
start_scheduler()
printer = ThermalPrinter(settings.PRINTER_IP, settings.PRINTER_PORT)

# =========================
# API (prefixed at /api)
# =========================
API = APIRouter(prefix="/api")

@API.get("/health")
def health():
    return {
        "status": "ok",
        "now": now_tz().isoformat(),
        "printer": {"ip": settings.PRINTER_IP, "port": settings.PRINTER_PORT},
    }

@API.get("/tasks", response_model=List[TaskRead])
def api_list_tasks():
    return list_tasks()

@API.post("/tasks", response_model=TaskRead)
def api_create_task(payload: TaskCreate):
    # coerce datetimes to timezone-aware
    t = Task(**payload.dict())
    t.start_at = to_aware(t.start_at)
    if t.until:
        t.until = to_aware(t.until)
    t = create_task(t)
    schedule_task(t)
    return t

@API.get("/tasks/{task_id}", response_model=TaskRead)
def api_get_task(task_id: int):
    t = get_task(task_id)
    if not t:
        raise HTTPException(404, "Task not found")
    return t

@API.patch("/tasks/{task_id}", response_model=TaskRead)
def api_update_task(task_id: int, payload: TaskUpdate):
    data = {k: v for k, v in payload.dict().items() if v is not None}
    if "start_at" in data and data["start_at"] is not None:
        data["start_at"] = to_aware(data["start_at"])
    if "until" in data and data["until"] is not None:
        data["until"] = to_aware(data["until"])
    updated = update_task(task_id, **data)
    if not updated:
        raise HTTPException(404, "Task not found")
    schedule_task(updated)
    return updated

@API.delete("/tasks/{task_id}")
def api_delete_task(task_id: int):
    ok = delete_task(task_id)
    if not ok:
        raise HTTPException(404, "Task not found")
    return {"ok": True}

@API.post("/tasks/{task_id}/print")
def api_print_task(task_id: int):
    t = get_task(task_id)
    if not t:
        raise HTTPException(404, "Task not found")
    printer.print_task(t.title, t.description)
    return {"printed": True}

@API.post("/import")
def api_import(payload: ImportPayload):
    created = []
    for t in payload.tasks:
        obj = Task(**t.dict())
        obj.start_at = to_aware(obj.start_at)
        if obj.until:
            obj.until = to_aware(obj.until)
        created.append(create_task(obj))
    for t in created:
        schedule_task(t)
    return {"count": len(created)}

@API.get("/print-test")
def api_print_test():
    """
    Sends a minimal ESC/POS test to the configured printer via raw TCP 9100.
    Useful to verify container->printer connectivity without creating a task.
    """
    host, port = settings.PRINTER_IP, settings.PRINTER_PORT
    ESC, GS = b"\x1b", b"\x1d"
    msg = [
        ESC + b"@",                    # init
        ESC + b"a\x01", b"*** TaskPrinter TEST ***\n",
        ESC + b"a\x00", b"Printed via /api/print-test\n\n\n",
        GS + b"V\x00",                 # full cut
    ]
    with socket.create_connection((host, port), timeout=5) as s:
        for part in msg:
            s.sendall(part)
    return {"message": "Test print sent", "target": f"{host}:{port}"}

# Register API router
app.include_router(API)

# =========================
# Static frontend (served at /)
# =========================
# The Dockerfile should copy the built frontend into /app/static
# e.g. COPY --from=frontend /app/dist /app/static
app.mount("/", StaticFiles(directory="static", html=True), name="static")
