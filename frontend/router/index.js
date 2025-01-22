import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '../stores/user'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/Home.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/project-input',
      name: 'project-input',
      component: () => import('../views/ProjectInput.vue'),
      meta: { requiresAuth: true, roles: ['admin'] }
    },
    {
      path: '/quality-inspection',
      name: 'quality-inspection',
      component: () => import('../views/QualityInspection.vue'),
      meta: { requiresAuth: true, roles: ['admin', 'inspector'] }
    },
    {
      path: '/quality-report',
      name: 'quality-report',
      component: () => import('../views/QualityReport.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/staff-input',
      name: 'staff-input',
      component: () => import('../views/StaffInput.vue'),
      meta: { requiresAuth: true, roles: ['admin'] }
    },
    {
      path: '/task-list',
      name: 'task-list',
      component: () => import('../views/TaskList.vue'),
      meta: { requiresAuth: true }
    }
  ]
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const userStore = useUserStore()
  
  if (to.meta.requiresAuth) {
    if (to.meta.roles && !to.meta.roles.includes(userStore.role)) {
      next({ name: 'home' })
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router
