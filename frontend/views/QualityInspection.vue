<template>
  <div v-loading="loading" class="quality-inspection">
    <!-- 左侧项目列表 -->
    <div class="project-list">
      <div class="search-box">
        <el-input
          v-model="searchQuery"
          placeholder="搜索项目"
          prefix-icon="el-icon-search"
        />
      </div>
      <div class="project-items">
        <div
          v-for="item in projects"
          :key="item.id"
          :class="['project-item', { active: currentProject?.id === item.id }]"
          @click="selectProject(item)"
        >
          <div class="project-item-header">
            <span class="name">{{ item.name }}</span>
            <el-tag :type="getStatusType(item.status)" size="small">
              {{ item.status }}
            </el-tag>
          </div>
          <div class="project-item-date">{{ formatDate(item.start_date) }}</div>
        </div>
      </div>
    </div>

    <!-- 右侧内容区 -->
    <div v-if="currentProject" class="content-area">
      <!-- 项目基本信息 -->
      <div class="project-header">
        <h2>{{ currentProject?.name }}</h2>
        <div class="project-info">
          <div class="info-item">
            <span class="label">开始时间:</span>
            <span>{{ formatDate(currentProject?.start_date) }}</span>
          </div>
          <div class="info-item">
            <span class="label">结束时间:</span>
            <span>{{ formatDate(currentProject?.end_date) }}</span>
          </div>
          <div class="info-item">
            <span class="label">零件数量:</span>
            <span>{{ currentProject?.parts_quantity }}</span>
          </div>
          <div class="info-item">
            <span class="label">零件编号:</span>
            <el-select v-model="form.part_number" placeholder="请选择零件编号" style="width: 120px">
              <el-option
                v-for="i in currentProject?.parts_quantity"
                :key="i"
                :label="`#${String(i).padStart(3, '0')}`"
                :value="i"
              />
            </el-select>
          </div>
          <el-tag :type="getStatusType(currentProject?.status)" class="status-tag">
            {{ currentProject?.status }}
          </el-tag>
        </div>
      </div>

      <div class="main-content">
        <!-- 左侧内容区 -->
        <div class="left-section">
          <!-- 工程图纸 -->
          <div class="blueprint-section">
            <div class="section-header">
              <h3>工程图纸</h3>
            </div>
            <div class="blueprint-content">
              <img src="/images/spool.jpg" alt="工程图纸" class="blueprint-image" />
            </div>
          </div>
            
        <!-- 检测信息表单 -->
        <div class="inspection-form">
          <div class="section-header">
            <h3>检测信息</h3>
            <div v-if="existingInspection" class="existing-inspection-notice">
              <el-alert
                :title="isAdmin ? '已加载现有记录，您可以进行修改' : '该零件已有质检记录，仅管理员可修改'"
                type="info"
                :closable="false"
                show-icon
              />
            </div>
          </div>
          <el-form
            ref="formRef"
            :model="form"
            :rules="rules"
            label-width="100px"
            class="inspection-form-content"
          >
            <el-form-item label="检测员" prop="inspector">
              <el-input 
                v-model="form.inspector" 
                placeholder="请输入检测员姓名"
                :disabled="!form.part_number || (existingInspection && !isAdmin)"
                :class="{ 'input-disabled': !form.part_number || (existingInspection && !isAdmin) }"
              />
            </el-form-item>

            <el-form-item label="检测类型" prop="category">
              <el-select 
                v-model="form.category" 
                placeholder="请选择检测类型" 
                class="w-100"
                :disabled="!form.part_number || (existingInspection && !isAdmin)"
                :class="{ 'input-disabled': !form.part_number || (existingInspection && !isAdmin) }"
              >
                <el-option label="圆周度" value="dimension" />
                <el-option label="外圆直径A" value="external_diameter_a" />
                <el-option label="外圆直径B" value="external_diameter_b" />
              </el-select>
            </el-form-item>
          
            <el-form-item label="检测结果" prop="result">
              <el-select 
                v-model="form.result" 
                placeholder="请选择检测结果" 
                class="w-100"
                :disabled="!form.part_number || (existingInspection && !isAdmin)"
                :class="{ 'input-disabled': !form.part_number || (existingInspection && !isAdmin) }"
              >
                <el-option label="合格" value="pass" />
                <el-option label="不合格" value="fail" />
              </el-select>
            </el-form-item>
          
            <el-form-item label="测量值" prop="measurement">
              <div class="measurement-input">
                <el-input 
                  v-model="form.measurement" 
                  placeholder="请输入测量值"
                  :disabled="!form.part_number || (existingInspection && !isAdmin)"
                  :class="{ 'input-disabled': !form.part_number || (existingInspection && !isAdmin) }"
                >
                  <template #append>mm</template>
                </el-input>
              </div>
            </el-form-item>
          
            <el-form-item>
              <el-button 
                type="primary" 
                @click="submitForm" 
                class="submit-btn"
                :disabled="!form.part_number || (existingInspection && !isAdmin)"
              >
                {{ existingInspection && isAdmin ? '更新记录' : '提交记录' }}
              </el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import axios from 'axios'
import { useUserStore } from '@/stores/user'

const route = useRoute()
const userStore = useUserStore()
const loading = ref(false)
const searchQuery = ref('')
const currentProject = ref(null)
const projects = ref([])
const inspectionRecords = ref([])
const existingInspection = ref(null)
const formRef = ref(null)
const isAdmin = computed(() => userStore.role === 'admin')

const form = ref({
  inspector: '',
  category: '',
  result: '',
  measurement: '',
  part_number: null
})

const rules = {
  inspector: [{ required: true, message: '请输入检测员姓名', trigger: 'blur' }],
  category: [{ required: true, message: '请选择检测类型', trigger: 'change' }],
  result: [{ required: true, message: '请选择检测结果', trigger: 'change' }],
  measurement: [{ required: true, message: '请输入测量值', trigger: 'blur' }],
  part_number: [{ required: true, message: '请选择零件编号', trigger: 'change' }]
}

// 监听零件编号变化
watch(() => form.value.part_number, async (newValue) => {
  if (newValue && currentProject.value) {
    await checkExistingInspection(currentProject.value.id, newValue)
  }
})

// 检查是否存在质检记录
const checkExistingInspection = async (projectId, partNumber) => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/quality_inspections/`, {
      params: {
        project_id: projectId,
        part_number: partNumber
      }
    })
    if (response.data && response.data.length > 0) {
      const record = response.data[0]
      // 如果存在记录，设置existingInspection，但管理员可以编辑
      existingInspection.value = record
      // 填充表单数据
      form.value = {
        ...form.value,
        inspector: record.inspector,
        category: record.category,
        result: record.result,
        measurement: record.measurement
      }
      
      // 根据角色显示不同的消息
      if (isAdmin.value) {
        ElMessage.info('已加载现有记录，您可以进行修改')
      } else {
        ElMessage.info('该零件已有质检记录，仅管理员可修改')
      }
    } else {
      // 如果不存在记录，清空表单并允许编辑
      existingInspection.value = null
      // 重置表单，但保留零件编号
      const currentPartNumber = form.value.part_number
      resetForm()
      form.value.part_number = currentPartNumber
    }
  } catch (error) {
    console.error('Error checking existing inspection:', error)
    ElMessage.error('检查质检记录时出错')
  }
}

// 选择项目
const selectProject = (project) => {
  currentProject.value = project
  form.value.part_number = null  // 重置零件编号
  existingInspection.value = null  // 重置已存在的检测记录
  resetForm()
}

// 提交表单
const submitForm = async () => {
  await formRef.value?.validate(async (valid) => {
    if (valid) {
      try {
        let response
        const formData = {
          ...form.value,
          project_id: currentProject.value.id
        }

        if (existingInspection.value && isAdmin.value) {
          // 管理员更新现有记录
          response = await axios.put(
            `${import.meta.env.VITE_BACKEND_URL}/quality_inspections/${existingInspection.value.id}`,
            formData
          )
          ElMessage.success('质检记录已更新')
        } else {
          // 创建新记录
          response = await axios.post(
            `${import.meta.env.VITE_BACKEND_URL}/quality_inspections/`,
            formData
          )
          ElMessage.success('质检记录已提交')
        }

        // 重新获取最新记录
        await checkExistingInspection(currentProject.value.id, form.value.part_number)
      } catch (error) {
        console.error('Error submitting form:', error)
        ElMessage.error('提交质检记录时出错')
      }
    }
  })
}

// 重置表单
const resetForm = () => {
  form.value = {
    inspector: '',
    category: '',
    result: '',
    measurement: '',
    part_number: null
  }
}

// 获取项目列表
const fetchProjects = async () => {
  loading.value = true
  try {
    const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/projects/`)
    projects.value = response.data
    if (projects.value.length > 0) {
      selectProject(projects.value[0])
    }
  } catch (error) {
    console.error('Error fetching projects:', error)
    ElMessage.error('加载项目列表失败')
  } finally {
    loading.value = false
  }
}

// 格式化日期
const formatDate = (date) => {
  if (!date) return '未设置'
  return new Date(date).toLocaleDateString('zh-CN')
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

onMounted(async () => {
  await fetchProjects()
})
</script>

<style scoped>
.quality-inspection {
  display: flex;
  height: 100vh;
  background-color: #f5f7fa;
}

.project-list {
  width: 280px;
  background: #fff;
  border-right: 1px solid #e4e7ed;
  display: flex;
  flex-direction: column;
}

.search-box {
  padding: 16px;
  border-bottom: 1px solid #e4e7ed;
}

.project-items {
  flex: 1;
  overflow-y: auto;
  padding: 8px;
}

.project-item {
  padding: 12px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
  margin-bottom: 8px;
}

.project-item:hover {
  background-color: #f5f7fa;
}

.project-item.active {
  background-color: #ecf5ff;
}

.project-item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.project-item-date {
  font-size: 12px;
  color: #909399;
}

.content-area {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
}

.project-header {
  margin-bottom: 20px;
  padding: 16px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
}

.project-info {
  display: flex;
  align-items: center;
  gap: 24px;
  margin-top: 12px;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.label {
  color: #606266;
}

.status-tag {
  margin-left: auto;
}

.main-content {
  display: flex;
  gap: 20px;
  height: calc(100% - 100px);
}

.left-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.right-section {
  width: 300px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
}

.blueprint-section,
.inspection-form {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
}

.section-header {
  padding: 16px;
  border-bottom: 1px solid #ebeef5;
}

.section-header h3 {
  margin: 0;
  font-size: 16px;
  color: #303133;
}

.blueprint-content {
  padding: 20px;
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.blueprint-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.inspection-form-content {
  padding: 20px;
}

.measurement-input {
  display: flex;
  align-items: center;
}

.w-100 {
  width: 100%;
}

.submit-btn {
  width: 120px;
  margin: 0 auto;
  display: block;
}

.inspection-records {
  padding: 20px;
  height: calc(100% - 53px);
  overflow-y: auto;
}

.record-content {
  display: flex;
  align-items: center;
  gap: 12px;
}

.record-type {
  font-weight: 500;
}

.record-inspector {
  color: #606266;
  font-size: 13px;
}
</style>
