<template>
  <div v-loading="loading" class="task-list">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span>项目任务</span>
          <el-button type="primary" @click="dialogVisible = true">
            新增任务
          </el-button>
        </div>
      </template>

      <!-- 任务看板 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <div class="task-column">
            <h3 class="task-column-title">
              待处理
              <el-tag type="danger" size="small" round>
                {{ todoTasks.length }}
              </el-tag>
            </h3>
            <draggable
              v-model="todoTasks"
              group="tasks"
              item-key="id"
              @end="handleDragEnd"
              class="task-list-group"
            >
              <template #item="{ element }">
                <div class="task-card">
                  <el-card :body-style="{ padding: '10px' }">
                    <div class="task-card-header">
                      <span class="task-title">{{ element.title }}</span>
                      <el-tag :type="getPriorityType(element.priority)" size="small">
                        {{ getPriorityLabel(element.priority) }}
                      </el-tag>
                    </div>
                    <div class="task-card-content">
                      <p v-if="element.description">{{ element.description }}</p>
                      <div class="task-info">
                        <el-avatar :size="24">{{ element.assigned_to.charAt(0) }}</el-avatar>
                        <span>{{ element.assigned_to }}</span>
                      </div>
                      <div v-if="element.due_date" class="task-due-date">
                        <el-icon><Calendar /></el-icon>
                        <span>{{ formatDate(element.due_date) }}</span>
                      </div>
                    </div>
                  </el-card>
                </div>
              </template>
            </draggable>
          </div>
        </el-col>

        <el-col :span="8">
          <div class="task-column">
            <h3 class="task-column-title">
              进行中
              <el-tag type="warning" size="small" round>
                {{ inProgressTasks.length }}
              </el-tag>
            </h3>
            <draggable
              v-model="inProgressTasks"
              group="tasks"
              item-key="id"
              @end="handleDragEnd"
              class="task-list-group"
            >
              <template #item="{ element }">
                <div class="task-card">
                  <el-card :body-style="{ padding: '10px' }">
                    <div class="task-card-header">
                      <span class="task-title">{{ element.title }}</span>
                      <el-tag :type="getPriorityType(element.priority)" size="small">
                        {{ getPriorityLabel(element.priority) }}
                      </el-tag>
                    </div>
                    <div class="task-card-content">
                      <p v-if="element.description">{{ element.description }}</p>
                      <div class="task-info">
                        <el-avatar :size="24">{{ element.assigned_to.charAt(0) }}</el-avatar>
                        <span>{{ element.assigned_to }}</span>
                      </div>
                      <div v-if="element.due_date" class="task-due-date">
                        <el-icon><Calendar /></el-icon>
                        <span>{{ formatDate(element.due_date) }}</span>
                      </div>
                    </div>
                  </el-card>
                </div>
              </template>
            </draggable>
          </div>
        </el-col>

        <el-col :span="8">
          <div class="task-column">
            <h3 class="task-column-title">
              已完成
              <el-tag type="success" size="small" round>
                {{ completedTasks.length }}
              </el-tag>
            </h3>
            <draggable
              v-model="completedTasks"
              group="tasks"
              item-key="id"
              @end="handleDragEnd"
              class="task-list-group"
            >
              <template #item="{ element }">
                <div class="task-card">
                  <el-card :body-style="{ padding: '10px' }">
                    <div class="task-card-header">
                      <span class="task-title">{{ element.title }}</span>
                      <el-tag :type="getPriorityType(element.priority)" size="small">
                        {{ getPriorityLabel(element.priority) }}
                      </el-tag>
                    </div>
                    <div class="task-card-content">
                      <p v-if="element.description">{{ element.description }}</p>
                      <div class="task-info">
                        <el-avatar :size="24">{{ element.assigned_to.charAt(0) }}</el-avatar>
                        <span>{{ element.assigned_to }}</span>
                      </div>
                      <div v-if="element.due_date" class="task-due-date">
                        <el-icon><Calendar /></el-icon>
                        <span>{{ formatDate(element.due_date) }}</span>
                      </div>
                    </div>
                  </el-card>
                </div>
              </template>
            </draggable>
          </div>
        </el-col>
      </el-row>
    </el-card>

    <!-- 新增任务对话框 -->
    <el-dialog
      v-model="dialogVisible"
      title="新增任务"
      width="50%"
      :before-close="handleClose"
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="任务标题" prop="title">
          <el-input v-model="form.title" />
        </el-form-item>
        
        <el-form-item label="描述" prop="description">
          <el-input
            v-model="form.description"
            type="textarea"
            :rows="3"
          />
        </el-form-item>
        
        <el-form-item label="状态" prop="status">
          <el-select v-model="form.status" placeholder="请选择状态" class="w-100">
            <el-option label="待处理" value="todo" />
            <el-option label="进行中" value="in_progress" />
            <el-option label="已完成" value="completed" />
          </el-select>
        </el-form-item>
        
        <el-form-item label="优先级" prop="priority">
          <el-select v-model="form.priority" placeholder="请选择优先级" class="w-100">
            <el-option label="最高" :value="1" />
            <el-option label="高" :value="2" />
            <el-option label="中" :value="3" />
            <el-option label="低" :value="4" />
            <el-option label="最低" :value="5" />
          </el-select>
        </el-form-item>
        
        <el-form-item label="负责人" prop="assigned_to">
          <el-input v-model="form.assigned_to" />
        </el-form-item>
        
        <el-form-item label="截止日期" prop="due_date">
          <el-date-picker
            v-model="form.due_date"
            type="date"
            placeholder="选择截止日期"
            class="w-100"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitForm">
            确认
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Calendar } from '@element-plus/icons-vue'
import draggable from 'vuedraggable'
import axios from 'axios'

const route = useRoute()
const loading = ref(false)
const dialogVisible = ref(false)
const tasks = ref([])
const formRef = ref(null)

const form = ref({
  title: '',
  description: '',
  status: 'todo',
  priority: 3,
  assigned_to: '',
  due_date: ''
})

const rules = {
  title: [{ required: true, message: '请输入任务标题', trigger: 'blur' }],
  status: [{ required: true, message: '请选择状态', trigger: 'change' }],
  priority: [{ required: true, message: '请选择优先级', trigger: 'change' }],
  assigned_to: [{ required: true, message: '请输入负责人', trigger: 'blur' }]
}

// 计算属性：按状态分类任务
const todoTasks = computed(() => tasks.value.filter(task => task.status === 'todo'))
const inProgressTasks = computed(() => tasks.value.filter(task => task.status === 'in_progress'))
const completedTasks = computed(() => tasks.value.filter(task => task.status === 'completed'))

// 获取任务列表
const fetchTasks = async () => {
  const projectId = route.query.projectId
  if (!projectId) {
    ElMessage.warning('请先选择一个项目')
    return
  }

  loading.value = true
  try {
    const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/tasks/?project_id=${projectId}`)
    tasks.value = response.data
  } catch (error) {
    console.error('Error fetching tasks:', error)
    ElMessage.error('加载任务失败，请稍后重试')
  } finally {
    loading.value = false
  }
}

// 提交表单
const submitForm = async () => {
  if (!formRef.value) return
  
  await formRef.value.validate(async (valid) => {
    if (valid) {
      try {
        const projectId = route.query.projectId
        const response = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/tasks/`,
          {
            ...form.value,
            project_id: projectId
          }
        )
        tasks.value.push(response.data)
        ElMessage.success('任务创建成功')
        dialogVisible.value = false
        resetForm()
      } catch (error) {
        console.error('Error creating task:', error)
        ElMessage.error('创建任务失败，请稍后重试')
      }
    }
  })
}

// 处理拖拽结束
const handleDragEnd = async (evt) => {
  const task = tasks.value.find(t => t.id === evt.item.__draggable_context.element.id)
  if (!task) return

  // 根据放置的列更新任务状态
  const newStatus = evt.to.parentElement.getAttribute('data-status')
  if (task.status === newStatus) return

  try {
    await axios.patch(`${import.meta.env.VITE_BACKEND_URL}/tasks/${task.id}`, {
      status: newStatus
    })
    task.status = newStatus
    ElMessage.success('任务状态更新成功')
  } catch (error) {
    console.error('Error updating task status:', error)
    ElMessage.error('更新任务状态失败')
    // 回滚状态
    fetchTasks()
  }
}

// 重置表单
const resetForm = () => {
  if (formRef.value) {
    formRef.value.resetFields()
  }
  form.value = {
    title: '',
    description: '',
    status: 'todo',
    priority: 3,
    assigned_to: '',
    due_date: ''
  }
}

// 关闭对话框
const handleClose = (done) => {
  resetForm()
  done()
}

// 格式化日期
const formatDate = (date) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString('zh-CN')
}

// 获取优先级标签类型
const getPriorityType = (priority) => {
  const types = {
    1: 'danger',
    2: 'warning',
    3: 'primary',
    4: 'info',
    5: 'info'
  }
  return types[priority] || 'info'
}

// 获取优先级标签文本
const getPriorityLabel = (priority) => {
  const labels = {
    1: '最高',
    2: '高',
    3: '中',
    4: '低',
    5: '最低'
  }
  return labels[priority] || '未知'
}

onMounted(() => {
  fetchTasks()
})
</script>

<style scoped>
.task-list {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.task-column {
  background-color: #f5f7fa;
  border-radius: 4px;
  padding: 16px;
  height: calc(100vh - 250px);
  overflow-y: auto;
}

.task-column-title {
  margin: 0 0 16px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.task-list-group {
  min-height: 100px;
}

.task-card {
  margin-bottom: 12px;
  cursor: move;
}

.task-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.task-title {
  font-weight: 500;
}

.task-card-content {
  font-size: 14px;
  
  p {
    margin: 8px 0;
    color: #606266;
  }
}

.task-info {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 8px 0;
}

.task-due-date {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #909399;
  font-size: 12px;
}

.w-100 {
  width: 100%;
}

:deep(.el-card__body) {
  padding: 16px;
}

:deep(.el-dialog__body) {
  padding: 20px 40px;
}
</style>
