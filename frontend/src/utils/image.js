import api from '../api/axios'

export const getImageUrl = (url) => {
  if (!url) return ''
  if (url.startsWith('http')) return url
  const baseUrl = api.defaults.baseURL.replace(/\/api\/?$/, '')
  return `${baseUrl}${url}`
}
