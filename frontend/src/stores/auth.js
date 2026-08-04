import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '../api/axios'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('admin_token') || null)
  const user = ref(JSON.parse(localStorage.getItem('admin_user') || 'null'))
  const loading = ref(false)

  const isAuthenticated = computed(() => !!token.value)

  async function login(username, password) {
    loading.value = true
    try {
      const { data } = await api.post('/auth/login', { username, password })
      token.value = data.token
      user.value = data.user
      localStorage.setItem('admin_token', data.token)
      localStorage.setItem('admin_user', JSON.stringify(data.user))
      return data
    } finally {
      loading.value = false
    }
  }

  function logout() {
    token.value = null
    user.value = null
    localStorage.removeItem('admin_token')
    localStorage.removeItem('admin_user')
  }

  async function fetchMe() {
    try {
      const { data } = await api.get('/auth/me')
      user.value = data
      localStorage.setItem('admin_user', JSON.stringify(data))
    } catch {
      logout()
    }
  }

  return { token, user, loading, isAuthenticated, login, logout, fetchMe }
})
