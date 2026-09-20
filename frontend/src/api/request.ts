import axios from 'axios'

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'

const request = axios.create({
  baseURL: apiBaseUrl,
  timeout: 20000
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
export { apiBaseUrl }
