<template>
  <div v-loading="loading" class="quality-inspection">
    <el-row :gutter="20" class="mb-4">
      <!-- 项目基本信息 -->
      <el-col :span="24">
        <el-card class="box-card">
          <template #header>
            <div class="card-header">
              <span>项目基本信息</span>
            </div>
          </template>
          <el-descriptions :column="3" border>
            <el-descriptions-item label="项目名称">{{ project?.name }}</el-descriptions-item>
            <el-descriptions-item label="状态">
              <el-tag :type="getStatusType(project?.status)">{{ project?.status }}</el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="描述">{{ project?.description }}</el-descriptions-item>
            <el-descriptions-item label="开始时间">
              {{ formatDate(project?.start_date) }}
            </el-descriptions-item>
            <el-descriptions-item label="结束时间">
              {{ formatDate(project?.end_date) }}
            </el-descriptions-item>
          </el-descriptions>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <!-- 质量检测表单 -->
      <el-col :span="12">
        <el-card class="box-card">
          <template #header>
            <div class="card-header">
              <span>新增质量检测</span>
            </div>
          </template>
          <el-form
            ref="formRef"
            :model="form"
            :rules="rules"
            label-width="100px"
          >
            <el-form-item label="检验员" prop="inspector">
              <el-input v-model="form.inspector" />
            </el-form-item>
            
            <el-form-item label="检测类型" prop="category">
              <el-select v-model="form.category" placeholder="请选择检测类型" class="w-100">
                <el-option label="材料检测" value="material" />
                <el-option label="过程检测" value="process" />
                <el-option label="成品检测" value="final_product" />
              </el-select>
            </el-form-item>
            
            <el-form-item label="检测结果" prop="result">
              <el-select v-model="form.result" placeholder="请选择检测结果" class="w-100">
                <el-option label="合格" value="pass" />
                <el-option label="不合格" value="fail" />
                <el-option label="需复检" value="needs_review" />
              </el-select>
            </el-form-item>
            
            <el-form-item label="测量值" prop="measurements">
              <el-input-number 
                v-model="form.measurements"
                :precision="2"
                :step="0.1"
                class="w-100"
              />
            </el-form-item>
            
            <el-form-item label="备注" prop="notes">
              <el-input
                v-model="form.notes"
                type="textarea"
                :rows="3"
              />
            </el-form-item>
            
            <el-form-item>
              <el-checkbox v-model="form.is_critical">关键检测项</el-checkbox>
            </el-form-item>
            
            <el-form-item>
              <el-button type="primary" @click="submitForm">
                提交检测记录
              </el-button>
              <el-button @click="resetForm">重置</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>

      <!-- 质量检测记录 -->
      <el-col :span="12">
        <el-card class="box-card">
          <template #header>
            <div class="card-header">
              <span>质量检测记录</span>
            </div>
          </template>
          <el-timeline>
            <el-timeline-item
              v-for="inspection in inspections"
              :key="inspection.id"
              :type="getTimelineType(inspection.result)"
              :timestamp="formatDate(inspection.inspection_date)"
            >
              <el-card class="inspection-card">
                <template #header>
                  <div class="inspection-header">
                    <span>检验员：{{ inspection.inspector }}</span>
                    <el-tag 
                      :type="getResultType(inspection.result)"
                      size="small"
                    >
                      {{ inspection.result }}
                    </el-tag>
                  </div>
                </template>
                <div class="inspection-content">
                  <p><strong>类型：</strong>{{ inspection.category }}</p>
                  <p v-if="inspection.measurements">
                    <strong>测量值：</strong>{{ inspection.measurements }}
                  </p>
                  <p v-if="inspection.notes">
                    <strong>备注：</strong>{{ inspection.notes }}
                  </p>
                  <el-tag 
                    v-if="inspection.is_critical"
                    type="danger"
                    size="small"
                  >
                    关键检测项
                  </el-tag>
                </div>
              </el-card>
            </el-timeline-item>
          </el-timeline>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import axios from 'axios'

const route = useRoute()
const loading = ref(false)
const project = ref(null)
const inspections = ref([])
const formRef = ref(null)

const form = ref({
  inspector: '',
  category: '',
  result: '',
  measurements: null,
  notes: '',
  is_critical: false
})

const rules = {
  inspector: [{ required: true, message: '请输入检验员姓名', trigger: 'blur' }],
  category: [{ required: true, message: '请选择检测类型', trigger: 'change' }],
  result: [{ required: true, message: '请选择检测结果', trigger: 'change' }]
}

// 获取项目和检测数据
const fetchData = async () => {
  const projectId = route.query.projectId
  if (!projectId) {
    ElMessage.warning('请先选择一个项目')
    return
  }

  loading.value = true
  try {
    const [projectRes, inspectionsRes] = await Promise.all([
      axios.get(`${import.meta.env.VITE_BACKEND_URL}/projects/${projectId}`),
      axios.get(`${import.meta.env.VITE_BACKEND_URL}/quality_inspections/?project_id=${projectId}`)
    ])
    project.value = projectRes.data
    inspections.value = inspectionsRes.data
  } catch (error) {
    console.error('Error fetching data:', error)
    ElMessage.error('加载数据失败，请稍后重试')
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
          `${import.meta.env.VITE_BACKEND_URL}/quality_inspections/`,
          {
            ...form.value,
            project_id: projectId
          }
        )
        inspections.value.unshift(response.data)
        ElMessage.success('检测记录提交成功')
        resetForm()
      } catch (error) {
        console.error('Error creating inspection:', error)
        ElMessage.error('提交失败，请稍后重试')
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
    inspector: '',
    category: '',
    result: '',
    measurements: null,
    notes: '',
    is_critical: false
  }
}

// 格式化日期
const formatDate = (date) => {
  if (!date) return '未设置'
  return new Date(date).toLocaleString('zh-CN')
}

// 获取状态类型
const getStatusType = (status) => {
  const types = {
    '运行中': 'primary',
    '已完成': 'success',
    '已暂停': 'warning',
    '已取消': 'danger'
  }
  return types[status] || 'info'
}

// 获取检测结果类型
const getResultType = (result) => {
  const types = {
    'pass': 'success',
    'fail': 'danger',
    'needs_review': 'warning'
  }
  return types[result] || 'info'
}

// 获取时间线类型
const getTimelineType = (result) => {
  const types = {
    'pass': 'success',
    'fail': 'danger',
    'needs_review': 'warning'
  }
  return types[result] || 'primary'
}

onMounted(() => {
  fetchData()
})
</script>

<style scoped>
.quality-inspection {
  padding: 20px;
}

.mb-4 {
  margin-bottom: 20px;
}

.w-100 {
  width: 100%;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.inspection-card {
  margin-bottom: 10px;
}

.inspection-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.inspection-content {
  font-size: 14px;
  
  p {
    margin: 5px 0;
  }
}

:deep(.el-timeline-item__node) {
  width: 12px;
  height: 12px;
}

:deep(.el-card__header) {
  padding: 10px 20px;
}

:deep(.el-timeline-item__content) {
  margin-left: 25px;
}
</style>
