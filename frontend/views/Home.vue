<template>
  <div class="home">
    <el-row :gutter="20">
      <el-col :span="8">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>项目概览</span>
            </div>
          </template>
          <div class="card-content">
            <div class="stat-item">
              <div class="stat-label">进行中的项目</div>
              <div class="stat-value">{{ stats.activeProjects }}</div>
            </div>
            <div class="stat-item">
              <div class="stat-label">待质检项目</div>
              <div class="stat-value">{{ stats.pendingInspections }}</div>
            </div>
            <div class="stat-item">
              <div class="stat-label">本月完成项目</div>
              <div class="stat-value">{{ stats.completedProjects }}</div>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :span="8">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>质量状况</span>
            </div>
          </template>
          <div class="card-content">
            <div class="stat-item">
              <div class="stat-label">合格率</div>
              <div class="stat-value">{{ stats.qualityRate }}%</div>
            </div>
            <div class="stat-item">
              <div class="stat-label">待处理问题</div>
              <div class="stat-value">{{ stats.pendingIssues }}</div>
            </div>
            <div class="stat-item">
              <div class="stat-label">平均处理时间</div>
              <div class="stat-value">{{ stats.avgHandleTime }}天</div>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :span="8">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>人员状态</span>
            </div>
          </template>
          <div class="card-content">
            <div class="stat-item">
              <div class="stat-label">在岗人数</div>
              <div class="stat-value">{{ stats.activeStaff }}</div>
            </div>
            <div class="stat-item">
              <div class="stat-label">出勤率</div>
              <div class="stat-value">{{ stats.attendanceRate }}%</div>
            </div>
            <div class="stat-item">
              <div class="stat-label">任务完成率</div>
              <div class="stat-value">{{ stats.taskCompletionRate }}%</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" class="mt-4">
      <el-col :span="16">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>最近任务</span>
              <el-button type="text" @click="viewAllTasks">查看全部</el-button>
            </div>
          </template>
          <el-table :data="recentTasks" style="width: 100%">
            <el-table-column prop="name" label="任务名称" />
            <el-table-column prop="project" label="所属项目" />
            <el-table-column prop="assignee" label="负责人" />
            <el-table-column prop="deadline" label="截止日期">
              <template #default="{ row }">
                {{ formatDate(row.deadline) }}
              </template>
            </el-table-column>
            <el-table-column prop="status" label="状态">
              <template #default="{ row }">
                <el-tag :type="getStatusType(row.status)">
                  {{ row.status }}
                </el-tag>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>

      <el-col :span="8">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>待办事项</span>
              <el-button type="text" @click="addTodo">添加</el-button>
            </div>
          </template>
          <el-timeline>
            <el-timeline-item v-for="(todo, index) in todos" :key="index" :type="todo.type" :timestamp="todo.timestamp">
              {{ todo.content }}
            </el-timeline-item>
          </el-timeline>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 模拟数据
const stats = ref({
  activeProjects: 12,
  pendingInspections: 5,
  completedProjects: 8,
  qualityRate: 98.5,
  pendingIssues: 3,
  avgHandleTime: 2.5,
  activeStaff: 45,
  attendanceRate: 96.8,
  taskCompletionRate: 92.5
})

const recentTasks = ref([
  {
    name: '质量检测报告审核',
    project: '工程项目A',
    assignee: '张工',
    deadline: '2025-01-25',
    status: '进行中'
  },
  {
    name: '设备维护检查',
    project: '工程项目B',
    assignee: '李工',
    deadline: '2025-01-23',
    status: '待处理'
  },
  {
    name: '安全培训',
    project: '工程项目C',
    assignee: '王工',
    deadline: '2025-01-24',
    status: '已完成'
  }
])

const todos = ref([
  {
    content: '审核质量检测报告',
    timestamp: '2025-01-22 14:00',
    type: 'primary'
  },
  {
    content: '设备维护例行检查',
    timestamp: '2025-01-22 16:00',
    type: 'warning'
  },
  {
    content: '项目进度评估会议',
    timestamp: '2025-01-23 10:00',
    type: 'success'
  }
])

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('zh-CN')
}

const getStatusType = (status) => {
  const types = {
    '进行中': 'primary',
    '待处理': 'warning',
    '已完成': 'success'
  }
  return types[status] || 'info'
}

const viewAllTasks = () => {
  router.push('/task-list')
}

const addTodo = () => {
  // 实现添加待办事项的逻辑
}
</script>

<style scoped>
.home {
  padding: 20px;
}

.mt-4 {
  margin-top: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-content {
  padding: 10px 0;
}

.stat-item {
  margin-bottom: 15px;
  text-align: center;
}

.stat-label {
  color: #909399;
  font-size: 14px;
  margin-bottom: 5px;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  color: #303133;
}

:deep(.el-card__header) {
  padding: 12px 20px;
}

:deep(.el-card__body) {
  padding: 20px;
}
</style>
