/*
import { defineStore } from 'pinia'
import { api } from '../axios'

interface User {
  id: number;
  name: string;
  email: string;
  roles: string[];
  permissions: string[];
  department_id: number;
}

interface AuthState {
  user: User | null
  token: string | null
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    token: localStorage.getItem('token'),
  }),
  actions: {
    async login(name: string, password: string) {
      try {
        const response = await api.post('/login', { name, password })

        this.token = response.data.token
        localStorage.setItem('token', this.token ?? '')
        await this.getUser()
      } catch (error) {
        throw error
      }
    },
    async getUser() {
      try {
        const response = await api.get('/user')
        if (response.data) {
          this.user = {
            id: response.data.id,
            name: response.data.name,
            email: response.data.email,
            roles: response.data.roles,
            department_id: response.data.department_id,
            permissions: response.data.permissions,
          }
        } else {
          this.user = null
        }
      } catch (error) {
        this.logout() // Logout if fetching user fails
        throw error
      }
    },
    async logout() {
      try {
        await api.post('/logout', { panel: true })
      } catch (error) {
        console.error('Error during logout:', error)
      } finally {
        this.token = null
        this.user = null
        localStorage.removeItem('token')
      }
    },
    hasPermission(permission: string) {
      return this.user?.permissions.includes(permission)
    },
  },
});
*/
