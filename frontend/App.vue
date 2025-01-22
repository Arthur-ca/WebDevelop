<template>
  <el-container class="layout-container">
    <el-aside width="200px">
      <sidebar />
    </el-aside>
    <el-container>
      <el-header>
        <el-button @click="switchRole">
          切换角色（当前：{{ userRole }}）
        </el-button>
      </el-header>
      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { ref } from 'vue'
import { useUserStore } from './stores/user'
import Sidebar from './components/Sidebar.vue'

const userStore = useUserStore()
const roles = ['admin', 'inspector', 'mechanics']
const userRole = ref('admin')

const switchRole = () => {
  const currentIndex = roles.indexOf(userRole.value)
  const nextIndex = (currentIndex + 1) % roles.length
  userRole.value = roles[nextIndex]
  userStore.setRole(userRole.value)
}
</script>

<style scoped>
.layout-container {
  height: 100vh;
}

.el-header {
  background-color: #fff;
  border-bottom: 1px solid #dcdfe6;
  display: flex;
  align-items: center;
  padding: 0 20px;
}

.el-aside {
  background-color: #304156;
  color: #fff;
}

.el-main {
  background-color: #f0f2f5;
  padding: 20px;
}
</style>
