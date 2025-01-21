# 全栈项目部署指南 / Full-Stack Project Deployment Guide

## 中文说明

### 系统要求
- Node.js 16+
- Python 3.12+
- Poetry (Python包管理器)

### 后端设置
1. 安装 Poetry (如果还未安装):
   ```bash
   curl -sSL https://install.python-poetry.org | python3 -
   ```

2. 安装依赖：
   ```bash
   poetry install
   ```

3. 启动服务器：
   ```bash
   poetry run uvicorn app.main:app --reload --port 8000
   ```

4. 配置环境变量：
   在 frontend/.env 文件中设置后端URL：
   ```
   VITE_BACKEND_URL=https://user:09c6ddbb08a546e22909d24612de0cc5@github-web-repo-tunnel-5rkrjk7a.devinapps.com
   ```

### 前端设置
1. 进入前端目录：
   ```bash
   cd ../frontend
   ```

2. 安装依赖：
   ```bash
   npm install
   ```

3. 启动开发服务器：
   ```bash
   npm run dev
   ```

### 注意事项
- 后端使用内存数据库，重启服务器数据会重置
- 确保环境变量正确配置
- 所有文本输入支持中文字符

## English Instructions

### Requirements
- Node.js 16+
- Python 3.12+
- Poetry (Python package manager)

### Backend Setup
1. Install Poetry (if not already installed):
   ```bash
   curl -sSL https://install.python-poetry.org | python3 -
   ```

2. Install dependencies:
   ```bash
   poetry install
   ```

3. Start the server:
   ```bash
   poetry run uvicorn app.main:app --reload --port 8000
   ```

4. Configure environment:
   Set the backend URL in frontend/.env:
   ```
   VITE_BACKEND_URL=https://user:09c6ddbb08a546e22909d24612de0cc5@github-web-repo-tunnel-5rkrjk7a.devinapps.com
   ```

### Frontend Setup
1. Navigate to frontend directory:
   ```bash
   cd ../frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start development server:
   ```bash
   npm run dev
   ```

### Important Notes
- Backend uses in-memory database; data resets on server restart
- Ensure environment variables are properly configured
- Full Chinese character support for all text inputs

## Testing
1. Create a project with Chinese characters
2. Add quality inspections
3. Create and manage tasks
4. Test role switching functionality

如有任何问题，请随时询问。/ Feel free to ask if you have any questions.

ATTACHMENT:"https://app.devin.ai/attachments/50ca3f34-13ad-4f72-b0ff-a3a594b89ff1/project_package.zip"
