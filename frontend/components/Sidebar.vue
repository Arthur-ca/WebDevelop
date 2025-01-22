<template>
  <el-menu
    :default-active="activeMenu"
    class="el-menu-vertical"
    :collapse="isCollapse"
    background-color="#304156"
    text-color="#fff"
    active-text-color="#409EFF"
    router
  >
    <el-menu-item index="/">
      <el-icon><HomeFilled /></el-icon>
      <template #title>首页</template>
    </el-menu-item>
    
    <el-menu-item 
      v-if="userStore.role === 'admin'"
      index="/project-input"
    >
      <el-icon><Document /></el-icon>
      <template #title>项目录入</template>
    </el-menu-item>
    
    <el-menu-item 
      v-if="['admin', 'inspector', 'mechanics'].includes(userStore.role)"
      index="/quality-inspection"
    >
      <el-icon><Check /></el-icon>
      <template #title>质量检测</template>
    </el-menu-item>
    
    <el-menu-item 
      v-if="['admin', 'inspector'].includes(userStore.role)"
      index="/quality-report"
    >
      <el-icon><DataLine /></el-icon>
      <template #title>质量报告</template>
    </el-menu-item>
    
    <el-menu-item 
      v-if="userStore.role === 'admin'"
      index="/staff-input"
    >
      <el-icon><User /></el-icon>
      <template #title>员工管理</template>
    </el-menu-item>
    
    <el-menu-item index="/task-list">
      <el-icon><List /></el-icon>
      <template #title>任务列表</template>
    </el-menu-item>
  </el-menu>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useUserStore } from '../stores/user'
import {
  HomeFilled,
  Document,
  Check,
  DataLine,
  User,
  List
} from '@element-plus/icons-vue'

const route = useRoute()
const userStore = useUserStore()
const isCollapse = ref(false)

const activeMenu = computed(() => route.path)
</script>

<style scoped>
.el-menu-vertical {
  height: 100%;
  border-right: none;
}

.el-menu-vertical:not(.el-menu--collapse) {
  width: 200px;
}
</style>
