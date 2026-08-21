from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
import os

# load .env so os.getenv() can read it
load_dotenv()

#connection string from .env - never hardcode secrets
DATABASE_URL: str | None = os.getenv("DATABASE_URL")

#engine = the connection pool
engine: Engine = create_engine(DATABASE_URL)

#SessionLocal = a factory forr DB sessions
SessionLocal: sessionmaker[Session] = sessionmaker(bind=engine, autoflush=False)

#Base = all ORM models inherit from this
Base = declarative_base()

#create all tables
def init_db() -> None:
    """Create all SQLAlchemy tables for the configured database."""
    Base.metadata.create_all(bind=engine)
    print("Successfully Done!")