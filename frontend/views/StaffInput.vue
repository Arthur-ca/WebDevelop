<template>
  <div v-loading="loading" class="staff-input">
    <el-row :gutter="20">
      <!-- 员工列表 -->
      <el-col :span="16">
        <el-card class="box-card">
          <template #header>
            <div class="card-header">
              <span>员工列表</span>
              <div class="header-operations">
                <el-input
                  v-model="searchQuery"
                  placeholder="搜索员工"
                  class="search-input"
                  clearable
                  @clear="handleSearch"
                  @input="handleSearch"
                >
                  <template #prefix>
                    <el-icon><Search /></el-icon>
                  </template>
                </el-input>
                <el-button type="primary" @click="handleAdd">
                  新增员工
                </el-button>
              </div>
            </div>
          </template>

          <el-table
            :data="filteredStaff"
            style="width: 100%"
            border
            stripe
          >
            <el-table-column type="expand">
              <template #default="props">
                <div class="staff-details">
                  <el-descriptions :column="2" border>
                    <el-descriptions-item label="技能证书">
                      {{ props.row.certificates || '无' }}
                    </el-descriptions-item>
                    <el-descriptions-item label="工作经验">
                      {{ props.row.experience || '0' }} 年
                    </el-descriptions-item>
                    <el-descriptions-item label="专业领域">
                      {{ props.row.expertise || '未指定' }}
                    </el-descriptions-item>
                    <el-descriptions-item label="入职时间">
                      {{ formatDate(props.row.join_date) }}
                    </el-descriptions-item>
                    <el-descriptions-item label="备注" :span="2">
                      {{ props.row.notes || '无' }}
                    </el-descriptions-item>
                  </el-descriptions>
                </div>
              </template>
            </el-table-column>
            
            <el-table-column prop="id" label="工号" width="100" />
            <el-table-column prop="name" label="姓名" width="120" />
            <el-table-column prop="department" label="部门" width="120" />
            <el-table-column prop="position" label="职位" width="120" />
            <el-table-column prop="phone" label="联系电话" width="150" />
            <el-table-column prop="status" label="状态" width="100">
              <template #default="{ row }">
                <el-tag :type="getStatusType(row.status)">
                  {{ getStatusLabel(row.status) }}
                </el-tag>
              </template>
            </el-table-column>
            
            <el-table-column label="操作" width="200" fixed="right">
              <template #default="{ row }">
                <el-button-group>
                  <el-button
                    size="small"
                    type="primary"
                    @click="handleEdit(row)"
                  >
                    编辑
                  </el-button>
                  <el-button
                    size="small"
                    type="danger"
                    @click="handleDelete(row)"
                  >
                    删除
                  </el-button>
                </el-button-group>
              </template>
            </el-table-column>
          </el-table>

          <div class="pagination-container">
            <el-pagination
              v-model:current-page="currentPage"
              v-model:page-size="pageSize"
              :page-sizes="[10, 20, 50, 100]"
              :total="total"
              layout="total, sizes, prev, pager, next"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
            />
          </div>
        </el-card>
      </el-col>

      <!-- 部门统计 -->
      <el-col :span="8">
        <el-card class="box-card">
          <template #header>
            <div class="card-header">
              <span>部门统计</span>
            </div>
          </template>
          <div ref="departmentChartRef" class="department-chart"></div>
        </el-card>

        <el-card class="box-card mt-4">
          <template #header>
            <div class="card-header">
              <span>员工状态统计</span>
            </div>
          </template>
          <div ref="statusChartRef" class="status-chart"></div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 员工表单对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="isEdit ? '编辑员工信息' : '新增员工'"
      width="50%"
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="姓名" prop="name">
          <el-input v-model="form.name" />
        </el-form-item>
        
        <el-form-item label="部门" prop="department">
          <el-select v-model="form.department" class="w-100">
            <el-option label="工程部" value="engineering" />
            <el-option label="质检部" value="quality" />
            <el-option label="生产部" value="production" />
            <el-option label="管理部" value="management" />
          </el-select>
        </el-form-item>
        
        <el-form-item label="职位" prop="position">
          <el-input v-model="form.position" />
        </el-form-item>
        
        <el-form-item label="联系电话" prop="phone">
          <el-input v-model="form.phone" />
        </el-form-item>
        
        <el-form-item label="技能证书" prop="certificates">
          <el-input v-model="form.certificates" type="textarea" :rows="2" />
        </el-form-item>
        
        <el-form-item label="工作经验" prop="experience">
          <el-input-number v-model="form.experience" :min="0" :max="50" />
        </el-form-item>
        
        <el-form-item label="专业领域" prop="expertise">
          <el-input v-model="form.expertise" />
        </el-form-item>
        
        <el-form-item label="入职时间" prop="join_date">
          <el-date-picker
            v-model="form.join_date"
            type="date"
            placeholder="选择入职日期"
            class="w-100"
          />
        </el-form-item>
        
        <el-form-item label="状态" prop="status">
          <el-select v-model="form.status" class="w-100">
            <el-option label="在职" value="active" />
            <el-option label="休假" value="vacation" />
            <el-option label="离职" value="resigned" />
          </el-select>
        </el-form-item>
        
        <el-form-item label="备注" prop="notes">
          <el-input v-model="form.notes" type="textarea" :rows="3" />
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
import { ref, onMounted, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search } from '@element-plus/icons-vue'
import * as echarts from 'echarts'
import axios from 'axios'

const loading = ref(false)
const dialogVisible = ref(false)
const isEdit = ref(false)
const currentPage = ref(1)
const pageSize = ref(20)
const total = ref(0)
const searchQuery = ref('')
const staffList = ref([])
const departmentChartRef = ref(null)
const statusChartRef = ref(null)
let departmentChart = null
let statusChart = null

const formRef = ref(null)
const form = ref({
  name: '',
  department: '',
  position: '',
  phone: '',
  certificates: '',
  experience: 0,
  expertise: '',
  join_date: '',
  status: 'active',
  notes: ''
})

const rules = {
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  department: [{ required: true, message: '请选择部门', trigger: 'change' }],
  position: [{ required: true, message: '请输入职位', trigger: 'blur' }],
  phone: [
    { required: true, message: '请输入联系电话', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' }
  ],
  status: [{ required: true, message: '请选择状态', trigger: 'change' }]
}

// 过滤后的员工列表
const filteredStaff = computed(() => {
  if (!searchQuery.value) return staffList.value
  
  const query = searchQuery.value.toLowerCase()
  return staffList.value.filter(staff => 
    staff.name.toLowerCase().includes(query) ||
    staff.department.toLowerCase().includes(query) ||
    staff.position.toLowerCase().includes(query)
  )
})

// 获取员工列表
const fetchStaffList = async () => {
  loading.value = true
  try {
    const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/staff/`, {
      params: {
        page: currentPage.value,
        page_size: pageSize.value
      }
    })
    staffList.value = response.data.items
    total.value = response.data.total
  } catch (error) {
    console.error('Error fetching staff list:', error)
    ElMessage.error('加载员工列表失败')
  } finally {
    loading.value = false
  }
}

// 初始化部门统计图表
const initDepartmentChart = () => {
  if (!departmentChartRef.value) return
  
  departmentChart = echarts.init(departmentChartRef.value)
  const option = {
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)'
    },
    legend: {
      orient: 'vertical',
      left: 10,
      data: ['工程部', '质检部', '生产部', '管理部']
    },
    series: [
      {
        name: '部门分布',
        type: 'pie',
        radius: ['50%', '70%'],
        avoidLabelOverlap: false,
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: '16',
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
        data: [
          { value: 30, name: '工程部' },
          { value: 20, name: '质检部' },
          { value: 35, name: '生产部' },
          { value: 15, name: '管理部' }
        ]
      }
    ]
  }
  departmentChart.setOption(option)
}

// 初始化状态统计图表
const initStatusChart = () => {
  if (!statusChartRef.value) return
  
  statusChart = echarts.init(statusChartRef.value)
  const option = {
    tooltip: {
      trigger: 'item'
    },
    legend: {
      bottom: '5%',
      left: 'center'
    },
    series: [
      {
        name: '员工状态',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: '16',
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
        data: [
          { value: 85, name: '在职' },
          { value: 10, name: '休假' },
          { value: 5, name: '离职' }
        ]
      }
    ]
  }
  statusChart.setOption(option)
}

// 处理搜索
const handleSearch = () => {
  // 搜索逻辑已通过计算属性实现
}

// 处理新增
const handleAdd = () => {
  isEdit.value = false
  resetForm()
  dialogVisible.value = true
}

// 处理编辑
const handleEdit = (row) => {
  isEdit.value = true
  form.value = { ...row }
  dialogVisible.value = true
}

// 处理删除
const handleDelete = (row) => {
  ElMessageBox.confirm(
    '确定要删除该员工信息吗？',
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(async () => {
    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/staff/${row.id}`)
      ElMessage.success('删除成功')
      fetchStaffList()
    } catch (error) {
      console.error('Error deleting staff:', error)
      ElMessage.error('删除失败')
    }
  })
}

// 提交表单
const submitForm = async () => {
  if (!formRef.value) return
  
  await formRef.value.validate(async (valid) => {
    if (valid) {
      try {
        if (isEdit.value) {
          await axios.put(`${import.meta.env.VITE_BACKEND_URL}/staff/${form.value.id}`, form.value)
          ElMessage.success('更新成功')
        } else {
          await axios.post(`${import.meta.env.VITE_BACKEND_URL}/staff/`, form.value)
          ElMessage.success('创建成功')
        }
        dialogVisible.value = false
        fetchStaffList()
      } catch (error) {
        console.error('Error submitting form:', error)
        ElMessage.error(isEdit.value ? '更新失败' : '创建失败')
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
    department: '',
    position: '',
    phone: '',
    certificates: '',
    experience: 0,
    expertise: '',
    join_date: '',
    status: 'active',
    notes: ''
  }
}

// 格式化日期
const formatDate = (date) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString('zh-CN')
}

// 获取状态类型
const getStatusType = (status) => {
  const types = {
    'active': 'success',
    'vacation': 'warning',
    'resigned': 'danger'
  }
  return types[status] || 'info'
}

// 获取状态标签
const getStatusLabel = (status) => {
  const labels = {
    'active': '在职',
    'vacation': '休假',
    'resigned': '离职'
  }
  return labels[status] || '未知'
}

// 处理分页
const handleSizeChange = (val) => {
  pageSize.value = val
  fetchStaffList()
}

const handleCurrentChange = (val) => {
  currentPage.value = val
  fetchStaffList()
}

// 监听窗口大小变化，重绘图表
window.addEventListener('resize', () => {
  departmentChart?.resize()
  statusChart?.resize()
})

onMounted(() => {
  fetchStaffList()
  initDepartmentChart()
  initStatusChart()
})
</script>

<style scoped>
.staff-input {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-operations {
  display: flex;
  gap: 10px;
}

.search-input {
  width: 200px;
}

.staff-details {
  padding: 20px;
}

.department-chart,
.status-chart {
  height: 300px;
}

.mt-4 {
  margin-top: 20px;
}

.w-100 {
  width: 100%;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

:deep(.el-card__header) {
  padding: 12px 20px;
}

:deep(.el-card__body) {
  padding: 20px;
}
</style>
