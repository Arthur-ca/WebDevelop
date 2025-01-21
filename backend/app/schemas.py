from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List

# Project Schemas
class ProjectBase(BaseModel):
    name: str
    customer: Optional[str] = None  # 客户名称
    type: Optional[str] = None      # 项目类型
    manager: Optional[str] = None   # 负责人
    description: Optional[str] = None
    status: str
    end_date: Optional[datetime] = None

class ProjectCreate(ProjectBase):
    pass

class Project(ProjectBase):
    id: int
    start_date: datetime
    
    class Config:
        from_attributes = True

# Task Schemas
class TaskBase(BaseModel):
    title: str
    description: Optional[str] = None
    status: str
    priority: int
    assigned_to: str
    due_date: Optional[datetime] = None

class TaskCreate(TaskBase):
    project_id: int

class Task(TaskBase):
    id: int
    project_id: int

    class Config:
        from_attributes = True

# Quality Inspection Schemas
class QualityInspectionBase(BaseModel):
    inspector: str
    category: str
    result: str
    notes: Optional[str] = None
    measurements: Optional[float] = None
    is_critical: bool = False

class QualityInspectionCreate(QualityInspectionBase):
    project_id: int

class QualityInspection(QualityInspectionBase):
    id: int
    project_id: int
    inspection_date: datetime

    class Config:
        from_attributes = True

# Response Schemas
class ProjectWithRelations(Project):
    tasks: List[Task] = []
    quality_inspections: List[QualityInspection] = []
