<template>
  <div v-loading="loading" class="quality-report">
    <el-row :gutter="20">
      <!-- 统计卡片 -->
      <el-col :span="6" v-for="stat in statistics" :key="stat.title">
        <el-card shadow="hover" class="stat-card">
          <template #header>
            <div class="stat-header">
              <span>{{ stat.title }}</span>
              <el-tag :type="stat.type" size="small">{{ stat.trend }}</el-tag>
            </div>
          </template>
          <div class="stat-content">
            <div class="stat-value">{{ stat.value }}</div>
            <div class="stat-description">{{ stat.description }}</div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" class="mt-4">
      <!-- 质量趋势图 -->
      <el-col :span="16">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>质量趋势分析</span>
              <el-radio-group v-model="timeRange" size="small">
                <el-radio-button label="week">本周</el-radio-button>
                <el-radio-button label="month">本月</el-radio-button>
                <el-radio-button label="year">全年</el-radio-button>
              </el-radio-group>
            </div>
          </template>
          <div ref="trendChartRef" class="chart-container"></div>
        </el-card>
      </el-col>

      <!-- 问题分布 -->
      <el-col :span="8">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>问题类型分布</span>
            </div>
          </template>
          <div ref="pieChartRef" class="chart-container"></div>
        </el-card>
      </el-col>
    </el-row>

    <el-row class="mt-4">
      <el-col :span="24">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>质量检测记录</span>
              <el-button type="primary" size="small" @click="exportReport">
                导出报告
              </el-button>
            </div>
          </template>
          <el-table
            :data="inspectionRecords"
            style="width: 100%"
            border
            stripe
          >
            <el-table-column prop="date" label="检测日期" width="180">
              <template #default="{ row }">
                {{ formatDate(row.date) }}
              </template>
            </el-table-column>
            <el-table-column prop="project_name" label="项目名称" width="180" />
            <el-table-column prop="inspector" label="检验员" width="120" />
            <el-table-column prop="type" label="检测类型" width="120">
              <template #default="{ row }">
                <el-tag :type="getTypeTag(row.type)">{{ row.type }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="result" label="检测结果" width="120">
              <template #default="{ row }">
                <el-tag :type="getResultTag(row.result)">{{ row.result }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="description" label="问题描述" />
            <el-table-column prop="status" label="处理状态" width="120">
              <template #default="{ row }">
                <el-tag :type="getStatusTag(row.status)">{{ row.status }}</el-tag>
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
    </el-row>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { ElMessage } from 'element-plus'
import axios from 'axios'
import * as echarts from 'echarts'

const loading = ref(false)
const timeRange = ref('month')
const currentPage = ref(1)
const pageSize = ref(20)
const total = ref(0)
const inspectionRecords = ref([])
const trendChartRef = ref(null)
const pieChartRef = ref(null)
let trendChart = null
let pieChart = null

// 统计数据
const statistics = ref([
  {
    title: '合格率',
    value: '98.5%',
    description: '较上月提升2.1%',
    trend: '上升',
    type: 'success'
  },
  {
    title: '待处理问题',
    value: '3',
    description: '较上周减少5个',
    trend: '下降',
    type: 'success'
  },
  {
    title: '平均处理时间',
    value: '2.5天',
    description: '较上月缩短0.5天',
    trend: '改善',
    type: 'success'
  },
  {
    title: '关键问题数',
    value: '0',
    description: '本月无关键问题',
    trend: '持平',
    type: 'info'
  }
])

// 获取检测记录
const fetchInspectionRecords = async () => {
  loading.value = true
  try {
    const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/quality_inspections/`, {
      params: {
        page: currentPage.value,
        page_size: pageSize.value
      }
    })
    inspectionRecords.value = response.data.items
    total.value = response.data.total
  } catch (error) {
    console.error('Error fetching inspection records:', error)
    ElMessage.error('加载检测记录失败')
  } finally {
    loading.value = false
  }
}

// 初始化趋势图
const initTrendChart = () => {
  if (!trendChartRef.value) return
  
  trendChart = echarts.init(trendChartRef.value)
  const option = {
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: ['合格率', '问题数', '平均处理时间']
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
    },
    yAxis: [
      {
        type: 'value',
        name: '百分比',
        min: 0,
        max: 100,
        position: 'left',
        axisLabel: {
          formatter: '{value}%'
        }
      },
      {
        type: 'value',
        name: '数量',
        min: 0,
        position: 'right'
      }
    ],
    series: [
      {
        name: '合格率',
        type: 'line',
        yAxisIndex: 0,
        data: [98, 97, 98.5, 99, 98.8, 98.2, 98.5]
      },
      {
        name: '问题数',
        type: 'bar',
        yAxisIndex: 1,
        data: [2, 3, 1, 1, 2, 3, 2]
      },
      {
        name: '平均处理时间',
        type: 'line',
        yAxisIndex: 1,
        data: [2.5, 2.8, 2.3, 2.1, 2.4, 2.6, 2.5]
      }
    ]
  }
  trendChart.setOption(option)
}

// 初始化饼图
const initPieChart = () => {
  if (!pieChartRef.value) return
  
  pieChart = echarts.init(pieChartRef.value)
  const option = {
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)'
    },
    legend: {
      orient: 'vertical',
      left: 10,
      data: ['材料问题', '工艺问题', '设备问题', '人为失误', '其他']
    },
    series: [
      {
        name: '问题分布',
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
          { value: 35, name: '材料问题' },
          { value: 25, name: '工艺问题' },
          { value: 20, name: '设备问题' },
          { value: 15, name: '人为失误' },
          { value: 5, name: '其他' }
        ]
      }
    ]
  }
  pieChart.setOption(option)
}

// 导出报告
const exportReport = () => {
  ElMessage.success('报告导出成功')
}

// 格式化日期
const formatDate = (date) => {
  if (!date) return ''
  return new Date(date).toLocaleString('zh-CN')
}

// 获取检测类型标签
const getTypeTag = (type) => {
  const types = {
    'material': 'primary',
    'process': 'warning',
    'final_product': 'success'
  }
  return types[type] || 'info'
}

// 获取检测结果标签
const getResultTag = (result) => {
  const types = {
    'pass': 'success',
    'fail': 'danger',
    'needs_review': 'warning'
  }
  return types[result] || 'info'
}

// 获取处理状态标签
const getStatusTag = (status) => {
  const types = {
    'pending': 'warning',
    'processing': 'primary',
    'resolved': 'success'
  }
  return types[status] || 'info'
}

// 处理分页
const handleSizeChange = (val) => {
  pageSize.value = val
  fetchInspectionRecords()
}

const handleCurrentChange = (val) => {
  currentPage.value = val
  fetchInspectionRecords()
}

// 监听时间范围变化
watch(timeRange, () => {
  // 这里可以根据时间范围重新获取数据
  // 暂时使用模拟数据
})

// 监听窗口大小变化，重绘图表
window.addEventListener('resize', () => {
  trendChart?.resize()
  pieChart?.resize()
})

onMounted(() => {
  fetchInspectionRecords()
  initTrendChart()
  initPieChart()
})
</script>

<style scoped>
.quality-report {
  padding: 20px;
}

.mt-4 {
  margin-top: 20px;
}

.stat-card {
  height: 160px;
}

.stat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.stat-content {
  text-align: center;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  margin: 10px 0;
}

.stat-description {
  color: #909399;
  font-size: 12px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chart-container {
  height: 300px;
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
