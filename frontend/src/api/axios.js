import axios from 'axios'
import { i18n } from '../i18n'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor - attach JWT token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response interceptor - handle 401
api.interceptors.response.use(
  (response) => {
    // Translate success message if present
    if (response.data && response.data.message && i18n.global.te(response.data.message)) {
      response.data.message = i18n.global.t(response.data.message)
    }
    return response
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('admin_token')
      localStorage.removeItem('admin_user')
      // Only redirect if on admin pages
      if (window.location.pathname.startsWith('/admin')) {
        window.location.href = '/admin/login'
      }
    }
    // Translate error message
    if (error.response?.data?.message && i18n.global.te(error.response.data.message)) {
      error.response.data.message = i18n.global.t(error.response.data.message)
    }
    return Promise.reject(error)
  }
)

export default api
