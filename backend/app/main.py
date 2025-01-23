import sys
import os
from pathlib import Path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
sys.path.append(str(Path(__file__).resolve().parent.parent))

from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Optional

from app.database import Base, engine, get_db
from app.models import Project, Task, QualityInspection
from app.db_init import init_db

from app.schemas import (
    Project as ProjectSchema,
    ProjectCreate,
    ProjectWithRelations,
    Task as TaskSchema,
    TaskCreate,
    QualityInspection as QualityInspectionSchema,
    QualityInspectionCreate
)

app = FastAPI()

# Disable CORS. Do not remove this for full-stack development.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# Initialize database tables
init_db()

# Root endpoint
@app.get("/")
def read_root():
    return {"message": "Welcome to the WebDevelop API!"}

# Health check endpoint
@app.get("/healthz")
async def healthz():
    return {"status": "ok"}

# Project endpoints
@app.post("/projects/", response_model=ProjectSchema)
def create_project(project: ProjectCreate, db: Session = Depends(get_db)):
    db_project = Project(**project.model_dump())
    db.add(db_project)
    db.commit()
    db.refresh(db_project)
    return db_project

@app.get("/projects/", response_model=List[ProjectSchema])
def list_projects(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return db.query(Project).offset(skip).limit(limit).all()

@app.get("/projects/{project_id}", response_model=ProjectWithRelations)
def get_project(project_id: int, db: Session = Depends(get_db)):
    project = db.query(Project).filter(Project.id == project_id).first()
    if project is None:
        raise HTTPException(status_code=404, detail="Project not found")
    return project

# Task endpoints
@app.post("/tasks/", response_model=TaskSchema)
def create_task(task: TaskCreate, db: Session = Depends(get_db)):
    project = db.query(Project).filter(Project.id == task.project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    db_task = Task(**task.model_dump())
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task

@app.get("/tasks/", response_model=List[TaskSchema])
def list_tasks(project_id: Optional[int] = None, skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    query = db.query(Task)
    if project_id:
        query = query.filter(Task.project_id == project_id)
    return query.offset(skip).limit(limit).all()

# Quality Inspection endpoints
@app.post("/quality_inspections/", response_model=QualityInspectionSchema)
def create_quality_inspection(inspection: QualityInspectionCreate, db: Session = Depends(get_db)):
    project = db.query(Project).filter(Project.id == inspection.project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    # 计算圆度和圆柱度
    roundness_a = abs(inspection.diameter_a1 - inspection.diameter_a2)
    roundness_b = abs(inspection.diameter_b1 - inspection.diameter_b2)
    cylindricity = max(
        abs(inspection.diameter_a1 - inspection.diameter_b1),
        abs(inspection.diameter_a1 - inspection.diameter_b2),
        abs(inspection.diameter_a2 - inspection.diameter_b1),
        abs(inspection.diameter_a2 - inspection.diameter_b2)
    )
    
    # 创建新的质检记录
    db_inspection = QualityInspection(
        project_id=inspection.project_id,
        inspector=inspection.inspector,
        part_number=inspection.part_number,
        diameter_a1=inspection.diameter_a1,
        diameter_a2=inspection.diameter_a2,
        diameter_b1=inspection.diameter_b1,
        diameter_b2=inspection.diameter_b2,
        roundness_a=roundness_a,
        roundness_b=roundness_b,
        cylindricity=cylindricity,
        result=inspection.result
    )
    
    db.add(db_inspection)
    db.commit()
    db.refresh(db_inspection)
    return db_inspection

@app.put("/quality_inspections/{inspection_id}", response_model=QualityInspectionSchema)
def update_quality_inspection(
    inspection_id: int,
    inspection: QualityInspectionCreate,
    db: Session = Depends(get_db)
):
    db_inspection = db.query(QualityInspection).filter(QualityInspection.id == inspection_id).first()
    if not db_inspection:
        raise HTTPException(status_code=404, detail="Quality inspection not found")
    
    # 计算圆度和圆柱度
    roundness_a = abs(inspection.diameter_a1 - inspection.diameter_a2)
    roundness_b = abs(inspection.diameter_b1 - inspection.diameter_b2)
    cylindricity = max(
        abs(inspection.diameter_a1 - inspection.diameter_b1),
        abs(inspection.diameter_a1 - inspection.diameter_b2),
        abs(inspection.diameter_a2 - inspection.diameter_b1),
        abs(inspection.diameter_a2 - inspection.diameter_b2)
    )
    
    # 更新所有字段
    db_inspection.inspector = inspection.inspector
    db_inspection.part_number = inspection.part_number
    db_inspection.diameter_a1 = inspection.diameter_a1
    db_inspection.diameter_a2 = inspection.diameter_a2
    db_inspection.diameter_b1 = inspection.diameter_b1
    db_inspection.diameter_b2 = inspection.diameter_b2
    db_inspection.roundness_a = roundness_a
    db_inspection.roundness_b = roundness_b
    db_inspection.cylindricity = cylindricity
    db_inspection.result = inspection.result
    
    db.commit()
    db.refresh(db_inspection)
    return db_inspection

@app.get("/quality_inspections/", response_model=List[QualityInspectionSchema])
def list_quality_inspections(
    project_id: Optional[int] = None, 
    part_number: Optional[int] = None,
    skip: int = 0, 
    limit: int = 100, 
    db: Session = Depends(get_db)
):
    query = db.query(QualityInspection)
    if project_id:
        query = query.filter(QualityInspection.project_id == project_id)
    if part_number:
        query = query.filter(QualityInspection.part_number == part_number)
    return query.offset(skip).limit(limit).all()
