<template>
  <div class="project-input">
    <div class="header">
      <el-button type="primary" @click="dialogVisible = true">
        创建项目
      </el-button>
    </div>

    <!-- 项目列表表格 -->
    <el-table
      v-loading="loading"
      :data="projects"
      style="width: 100%"
      border
    >
      <el-table-column prop="id" label="项目编号" width="100" />
      <el-table-column prop="name" label="项目名称" width="150" />
      <el-table-column prop="customer" label="客户名称" width="150" />
      <el-table-column prop="type" label="项目类型" width="120" />
      <el-table-column prop="parts_count" label="零件数量" width="100" />
      <el-table-column prop="status" label="状态" width="100">
        <template #default="{ row }">
          <el-tag :type="getStatusType(row.status)">{{ row.status }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="progress" label="进度" width="200">
        <template #default="{ row }">
          <el-progress :percentage="row.progress || 0" />
        </template>
      </el-table-column>
      <el-table-column prop="start_date" label="创建时间" width="180">
        <template #default="{ row }">
          {{ formatDate(row.start_date) }}
        </template>
      </el-table-column>
      <el-table-column prop="end_date" label="截止日期" width="180">
        <template #default="{ row }">
          {{ formatDate(row.end_date) }}
        </template>
      </el-table-column>
      <el-table-column prop="manager" label="负责人" width="120" />
    </el-table>

    <!-- 创建项目对话框 -->
    <el-dialog
      v-model="dialogVisible"
      title="创建新项目"
      width="50%"
      :before-close="handleClose"
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="120px"
      >
        <el-form-item label="项目名称" prop="name">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="客户名称" prop="customer">
          <el-input v-model="form.customer" />
        </el-form-item>
        <el-form-item label="项目类型" prop="type">
          <el-select v-model="form.type" placeholder="请选择项目类型">
            <el-option label="维修" value="维修" />
            <el-option label="保养" value="保养" />
            <el-option label="改造" value="改造" />
          </el-select>
        </el-form-item>
        <el-form-item label="负责人" prop="manager">
          <el-input v-model="form.manager" />
        </el-form-item>
        <el-form-item label="创建时间" prop="start_date">
          <el-date-picker
            v-model="form.start_date"
            type="date"
            placeholder="选择创建时间"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>
        <el-form-item label="截止日期" prop="end_date">
          <el-date-picker
            v-model="form.end_date"
            type="date"
            placeholder="选择截止日期"
            value-format="YYYY-MM-DD"
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
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import axios from 'axios'

const loading = ref(false)
const dialogVisible = ref(false)
const projects = ref([])
const formRef = ref(null)

const form = ref({
  name: '',
  customer: '',
  type: '',
  manager: '',
  start_date: '',
  end_date: '',
  status: '运行中'
})

const rules = {
  name: [{ required: true, message: '请输入项目名称', trigger: 'blur' }],
  customer: [{ required: true, message: '请输入客户名称', trigger: 'blur' }],
  type: [{ required: true, message: '请选择项目类型', trigger: 'change' }],
  manager: [{ required: true, message: '请输入负责人', trigger: 'blur' }],
  start_date: [{ required: true, message: '请选择创建时间', trigger: 'change' }],
  end_date: [{ required: true, message: '请选择截止日期', trigger: 'change' }]
}

// 获取项目列表
const fetchProjects = async () => {
  loading.value = true
  try {
    const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/projects`)
    projects.value = response.data
  } catch (error) {
    console.error('Error fetching projects:', error)
    ElMessage.error('加载项目失败，请稍后重试')
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
        const response = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/projects/`,
          form.value
        )
        projects.value.push(response.data)
        ElMessage.success('项目创建成功')
        dialogVisible.value = false
        resetForm()
      } catch (error) {
        console.error('Error creating project:', error)
        ElMessage.error('创建项目失败，请稍后重试')
      }
    }
  })
}

// 重置表单
const resetForm = () => {
  if (formRef.value) {
    formRef.value.resetFields()
  }
  form.value = {
    name: '',
    customer: '',
    type: '',
    manager: '',
    start_date: '',
    end_date: '',
    status: '运行中'
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
  if (typeof date === 'string') {
    // 如果已经是YYYY-MM-DD格式，直接返回
    if (date.length === 10) return date
  }
  // 转换为YYYY-MM-DD格式
  const d = new Date(date)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

// 获取状态标签类型
const getStatusType = (status) => {
  const types = {
    '运行中': 'primary',
    '已完成': 'success',
    '已暂停': 'warning',
    '已取消': 'danger'
  }
  return types[status] || 'info'
}

onMounted(() => {
  fetchProjects()
})
</script>

<style scoped>
.project-input {
  padding: 20px;
}

.header {
  margin-bottom: 20px;
  text-align: right;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

:deep(.el-dialog__body) {
  padding: 20px 40px;
}
</style>
