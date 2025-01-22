import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    role: 'admin',
    permissions: []
  }),

  actions: {
    setRole(role) {
      this.role = role
      // 根据角色设置权限
      switch (role) {
        case 'admin':
          this.permissions = ['read', 'write', 'delete', 'manage']
          break
        case 'inspector':
          this.permissions = ['read', 'write']
          break
        case 'mechanics':
          this.permissions = ['read', 'write']
          break
        default:
          this.permissions = ['read']
      }
    },

    hasPermission(permission) {
      return this.permissions.includes(permission)
    }
  }
})
