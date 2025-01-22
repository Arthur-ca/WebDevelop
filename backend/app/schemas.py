from pydantic import BaseModel
from datetime import date
from typing import Optional, List

# Project Schemas
class ProjectBase(BaseModel):
    name: str
    customer: Optional[str] = None  # 客户名称
    type: Optional[str] = None      # 项目类型
    manager: Optional[str] = None   # 负责人
    description: Optional[str] = None
    status: str
    end_date: Optional[date] = None
    parts_quantity: Optional[int] = None  # 零件数量

class ProjectCreate(ProjectBase):
    pass

class Project(ProjectBase):
    id: int
    start_date: date
    
    class Config:
        from_attributes = True

# Task Schemas
class TaskBase(BaseModel):
    title: str
    description: Optional[str] = None
    status: str
    priority: int
    assigned_to: str
    due_date: Optional[date] = None

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
    category: str  # 'dimension', 'external_diameter_a', 'external_diameter_b'
    result: str    # 'pass', 'fail'
    measurement: Optional[float] = None
    part_number: Optional[int] = None

class QualityInspectionCreate(QualityInspectionBase):
    project_id: int

class QualityInspection(QualityInspectionBase):
    id: int
    project_id: int
    inspection_date: date

    class Config:
        from_attributes = True

# Response Schemas
class ProjectWithRelations(Project):
    tasks: List[Task] = []
    quality_inspections: List[QualityInspection] = []
