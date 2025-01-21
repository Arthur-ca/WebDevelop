# Production Management API

A FastAPI-based backend for the production management system with support for projects, tasks, and quality inspections.

## Prerequisites

1. Python 3.12 or higher
2. Poetry (Python package manager)

## Local Setup Instructions

1. Install Poetry (if not already installed):
   ```bash
   curl -sSL https://install.python-poetry.org | python3 -
   ```

2. Extract the backend files:
   ```bash
   tar -xzf backend.tar.gz
   cd production_management_api
   ```

3. Install dependencies:
   ```bash
   poetry install
   ```

4. Start the development server:
   ```bash
   poetry run fastapi dev app/main.py
   ```

The API will be available at http://localhost:8000

## Available Endpoints

### Projects
- `POST /projects/` - Create a new project
  ```json
  {
    "name": "Project Name",
    "description": "Project Description",
    "status": "planning"
  }
  ```
- `GET /projects/` - List all projects

### Tasks
- `POST /tasks/` - Create a new task
  ```json
  {
    "title": "Task Title",
    "description": "Task Description",
    "status": "todo",
    "priority": 1,
    "assigned_to": "John Doe",
    "project_id": 1
  }
  ```
- `GET /tasks/` - List all tasks

### Quality Inspections
- `POST /quality-inspections/` - Create a new quality inspection
  ```json
  {
    "inspector": "John Doe",
    "category": "process",
    "result": "pass",
    "project_id": 1,
    "is_critical": false
  }
  ```
- `GET /quality-inspections/` - List all quality inspections

## Important Notes

- This is a development setup using an in-memory SQLite database
- Data will be reset when the server restarts
- For production use, you would need to switch to a persistent database
