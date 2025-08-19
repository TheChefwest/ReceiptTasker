# database.py
import os
from pathlib import Path
from contextlib import contextmanager
from sqlmodel import SQLModel, Session, create_engine

# --- DB path setup (writable) ---
# Priority: DATABASE_URL > DB_PATH > DB_DIR/app.db > /app/data/app.db
DB_FILE_ENV = os.getenv("DB_PATH")
if DB_FILE_ENV:
    db_path = Path(DB_FILE_ENV)
    db_dir = db_path.parent
else:
    db_dir = Path(os.getenv("DB_DIR", "/app/data"))
    db_path = db_dir / "app.db"

db_dir.mkdir(parents=True, exist_ok=True)

DATABASE_URL = os.getenv("DATABASE_URL", f"sqlite:///{db_path}")

# SQLite + threads
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})

def init_db():
    SQLModel.metadata.create_all(engine)

def get_engine():
    return engine

def get_session():
    """
    FastAPI dependency-style generator. Example:
        def endpoint(session: Session = Depends(get_session)): ...
    """
    with Session(engine) as session:
        yield session

@contextmanager
def session_scope():
    """
    Non-FastAPI usage:
        with session_scope() as s:
            ...
    """
    with Session(engine) as session:
        yield session
