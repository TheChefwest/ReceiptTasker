from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.date import DateTrigger
from dateutil.rrule import rrulestr, rrule
from dateutil.tz import gettz
from datetime import datetime
from typing import Optional
from models import Task
from crud import update_task, list_blackout_periods
from printing import ThermalPrinter
from utils import now_tz, TZ, to_aware

printer = ThermalPrinter()
scheduler = BackgroundScheduler(timezone=gettz(TZ))


def _next_occurrence(task: Task, after: Optional[datetime] = None) -> Optional[datetime]:
    base = to_aware(task.start_at)
    if after:
        cursor = to_aware(after)
    elif task.last_fired_at:
        # Add a small buffer to prevent duplicate scheduling due to timing issues
        cursor = to_aware(task.last_fired_at)
    else:
        cursor = now_tz()
    
    if not task.rrule:
        return base if base > now_tz() else None
    rule = rrulestr(task.rrule, dtstart=base)
    nxt = rule.after(cursor, inc=False)
    return nxt


def schedule_task(task: Task):
    if not task.is_active:
        return
    
    # Remove any existing jobs for this task to prevent duplicates
    job_id = f"task_{task.id}"
    existing_job = scheduler.get_job(job_id)
    if existing_job:
        scheduler.remove_job(job_id)
    
    next_run = _next_occurrence(task)
    if not next_run:
        return
    
    # schedule a one-shot job that will reschedule itself
    scheduler.add_job(_run_and_reschedule, DateTrigger(run_date=next_run), args=[task.id], id=job_id)


def _is_in_blackout_period(check_time: datetime) -> bool:
    """Check if the given datetime falls within any active blackout period"""
    blackout_periods = list_blackout_periods()
    for period in blackout_periods:
        if not period.is_active:
            continue
        start = to_aware(period.start_date)
        end = to_aware(period.end_date)
        if start <= check_time <= end:
            return True
    return False


def _run_and_reschedule(task_id: int):
    from crud import get_task  # local import to avoid cycles
    task = get_task(task_id)
    if not task or not task.is_active:
        return
    
    current_time = now_tz()
    
    # Check if we're in a blackout period
    if _is_in_blackout_period(current_time):
        # Skip printing but still update last_fired_at and reschedule
        update_task(task.id, last_fired_at=current_time)
        schedule_task(task)
        return
    
    if task.auto_print:
        printer.print_task(task.title, task.description)
    # update last fired
    update_task(task.id, last_fired_at=current_time)
    # schedule next
    schedule_task(task)


def start():
    if not scheduler.running:
        scheduler.start()