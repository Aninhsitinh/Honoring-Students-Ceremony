import axios from 'axios'
import { i18n } from '../i18n'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  timeout: 15000,
  withCredentials: true, // important for sending cookies
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

// Flag to prevent infinite loops
let isRefreshing = false
let failedQueue = []

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })
  failedQueue = []
}

// Response interceptor - handle 401
api.interceptors.response.use(
  (response) => {
    // Translate success message if present
    if (response.data && response.data.message && i18n.global.te(response.data.message)) {
      response.data.message = i18n.global.t(response.data.message)
    }
    return response
  },
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise(function(resolve, reject) {
          failedQueue.push({ resolve, reject })
        }).then(token => {
          originalRequest.headers['Authorization'] = 'Bearer ' + token
          return api(originalRequest)
        }).catch(err => {
          return Promise.reject(err)
        })
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        const { data } = await axios.post((import.meta.env.VITE_API_URL || 'http://localhost:3000/api') + '/auth/refresh', {}, { withCredentials: true })
        localStorage.setItem('admin_token', data.token)
        api.defaults.headers.common['Authorization'] = 'Bearer ' + data.token
        originalRequest.headers['Authorization'] = 'Bearer ' + data.token
        processQueue(null, data.token)
        return api(originalRequest)
      } catch (err) {
        processQueue(err, null)
        localStorage.removeItem('admin_token')
        localStorage.removeItem('admin_user')
        if (window.location.pathname.startsWith('/admin')) {
          window.location.href = '/admin/login'
        }
        return Promise.reject(err)
      } finally {
        isRefreshing = false
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
