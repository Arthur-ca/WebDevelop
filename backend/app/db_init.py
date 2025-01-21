from .database import Base, engine
from .models import Project, Task, QualityInspection

def init_db():
    print("Initializing database tables...")
    try:
        Base.metadata.drop_all(bind=engine)  # Clear existing tables
        Base.metadata.create_all(bind=engine)  # Create all tables fresh
        print("Database tables created successfully!")
    except Exception as e:
        print(f"Error creating database tables: {e}")
        raise
