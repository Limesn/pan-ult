import axios from 'axios'
import { mockAdapter } from '@/mock/adapter'

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'

// 由配置文件（.env / .env.development 等）控制是否启用模拟数据，
// 便于在没有可用后端接口时预览与测试前端
const isMockEnabled = import.meta.env.VITE_ENABLE_MOCK === 'true'

const request = axios.create({
  baseURL: apiBaseUrl,
  timeout: 20000,
  adapter: isMockEnabled ? mockAdapter : undefined
})

request.interceptors.request.use((config) => {
  const token = localStorage.getItem('pan_ult_token')

  if (token) {
    config.headers = config.headers || {}
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

request.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status
    if (status === 401 || status === 403) {
      localStorage.removeItem('pan_ult_token')
      window.location.href = '/login'
    }

    return Promise.reject(error)
  }
)

export default request
export { apiBaseUrl, isMockEnabled }
