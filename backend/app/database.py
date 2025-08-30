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
    # Run migrations
    migrate_db()

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

def migrate_db():
    """Run database migrations"""
    from sqlalchemy import text
    
    with Session(engine) as session:
        # Check if category column exists in task table
        try:
            # Try to select category - if it fails, the column doesn't exist
            session.exec(text("SELECT category FROM task LIMIT 1"))
        except Exception:
            # Add category column with default value
            try:
                session.exec(text("ALTER TABLE task ADD COLUMN category VARCHAR DEFAULT 'other'"))
                session.commit()
                print("✅ Added category column to task table")
            except Exception as e:
                print(f"Migration error: {e}")
                session.rollback()
