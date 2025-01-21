from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime
from .database import Base

class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    description = Column(String)
    start_date = Column(DateTime, default=datetime.utcnow)
    end_date = Column(DateTime, nullable=True)
    status = Column(String)  # 'planning', 'in_progress', 'completed', 'on_hold'
    
    tasks = relationship("Task", back_populates="project")
    quality_inspections = relationship("QualityInspection", back_populates="project")

class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id"))
    title = Column(String, index=True)
    description = Column(String)
    status = Column(String)  # 'todo', 'in_progress', 'completed'
    priority = Column(Integer)  # 1 (highest) to 5 (lowest)
    assigned_to = Column(String)
    due_date = Column(DateTime, nullable=True)
    
    project = relationship("Project", back_populates="tasks")

class QualityInspection(Base):
    __tablename__ = "quality_inspections"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id"))
    inspection_date = Column(DateTime, default=datetime.utcnow)
    inspector = Column(String)
    category = Column(String)  # 'material', 'process', 'final_product'
    result = Column(String)  # 'pass', 'fail', 'needs_review'
    notes = Column(String)
    measurements = Column(Float, nullable=True)
    is_critical = Column(Boolean, default=False)
    
    project = relationship("Project", back_populates="quality_inspections")
