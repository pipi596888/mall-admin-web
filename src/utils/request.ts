import axios from 'axios'
import type { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import { message } from 'ant-design-vue'
import router from '@/router'
import type { ApiResponse } from '@/types/http'

const request = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 10000
})

request.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token')

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  }
)

request.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    const { data } = response

    if (data.code !== 200) {
      message.error(data.message || '请求失败')

      if (data.code === 401) {
        localStorage.removeItem('token')
        router.push('/login')
      }

      return Promise.reject(data)
    }

    return data
  },
  (error: AxiosError) => {
    const errorMessage = error.response?.data || error.message

    message.error(typeof errorMessage === 'string' ? errorMessage : '网络异常')

    return Promise.reject(error)
  }
)

export default request
