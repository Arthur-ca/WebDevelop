from .database import Base, engine
from .models import Project, Task, QualityInspection
import os

def init_db():
    print("Checking database...")
    try:
        # 只在表不存在时创建表
        Base.metadata.create_all(bind=engine, checkfirst=True)
        print("Database check completed successfully!")
    except Exception as e:
        print(f"Error checking database: {e}")
        raise
