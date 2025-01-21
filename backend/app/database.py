from sqlalchemy import create_engine, event
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy.pool import StaticPool
from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

# Create SQLite in-memory database with a single connection
SQLALCHEMY_DATABASE_URL = "sqlite:///./app.db"

# Create engine with StaticPool to maintain a single connection
engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    # poolclass=StaticPool,  # Use StaticPool for single connection
    echo=True  # Enable SQL logging
)

# Create the declarative base
Base = declarative_base()

# Create and initialize the database session
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
# db = SessionLocal()

# # Create tables immediately
# from . import models  # Import models to register them with Base
# Base.metadata.create_all(bind=engine)

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
