import api from '../api/axios'

export const getImageUrl = (url) => {
  if (!url) return ''
  
  if (url.startsWith('http')) {
    // Cloudinary Image Optimization
    if (url.includes('res.cloudinary.com')) {
      const parts = url.split('/upload/')
      if (parts.length === 2) {
        // Insert optimization parameters: format auto, quality auto, max width 800px
        return `${parts[0]}/upload/f_auto,q_auto,w_800,c_limit/${parts[1]}`
      }
    }
    return url
  }

  const baseUrl = api.defaults.baseURL.replace(/\/api\/?$/, '')
  return `${baseUrl}${url}`
}
