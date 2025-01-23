from sqlalchemy import Column, Integer, String, Float, Date, ForeignKey, Boolean, event
from sqlalchemy.orm import relationship
from datetime import date
from decimal import Decimal, ROUND_HALF_UP
from .database import Base

def round_decimal(number, places=4):
    """Round a number to a specified number of decimal places"""
    if number is None:
        return None
    return float(Decimal(str(number)).quantize(Decimal('0.0001'), rounding=ROUND_HALF_UP))

class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    customer = Column(String, nullable=True)  # 客户名称
    type = Column(String, nullable=True)      # 项目类型
    manager = Column(String, nullable=True)   # 负责人
    description = Column(String, nullable=True)
    start_date = Column(Date, default=date.today)
    end_date = Column(Date, nullable=True)
    status = Column(String)  # 'planning', 'in_progress', 'completed', 'on_hold'
    parts_quantity = Column(Integer, nullable=True)  # 零件数量
    
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
    due_date = Column(Date, nullable=True)
    
    project = relationship("Project", back_populates="tasks")

class QualityInspection(Base):
    __tablename__ = "quality_inspections"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id"))
    inspection_date = Column(Date, default=date.today)
    inspector = Column(String)
    part_number = Column(Integer)  # 零件编号
    
    # 直径测量值
    diameter_a1 = Column(Float)  # 外圆直径A1
    diameter_a2 = Column(Float)  # 外圆直径A2
    diameter_b1 = Column(Float)  # 外圆直径B1
    diameter_b2 = Column(Float)  # 外圆直径B2
    
    # 圆度和圆柱度
    roundness_a = Column(Float)  # 外圆圆度A
    roundness_b = Column(Float)  # 外圆圆度B
    cylindricity = Column(Float)  # 圆柱度
    
    result = Column(String)  # 'pass' or 'fail'
    
    project = relationship("Project", back_populates="quality_inspections")

    def __init__(self, **kwargs):
        # Round all float values before initialization
        float_fields = ['diameter_a1', 'diameter_a2', 'diameter_b1', 'diameter_b2',
                       'roundness_a', 'roundness_b', 'cylindricity']
        for field in float_fields:
            if field in kwargs:
                kwargs[field] = round_decimal(kwargs[field])
        super().__init__(**kwargs)

@event.listens_for(QualityInspection, 'before_update')
def round_floats_before_update(mapper, connection, target):
    """Round float values before update"""
    target.diameter_a1 = round_decimal(target.diameter_a1)
    target.diameter_a2 = round_decimal(target.diameter_a2)
    target.diameter_b1 = round_decimal(target.diameter_b1)
    target.diameter_b2 = round_decimal(target.diameter_b2)
    target.roundness_a = round_decimal(target.roundness_a)
    target.roundness_b = round_decimal(target.roundness_b)
    target.cylindricity = round_decimal(target.cylindricity)
