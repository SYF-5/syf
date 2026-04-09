import axios from 'axios'

// 创建 axios 实例
const request = axios.create({
  baseURL: '/api',
  timeout: 10000
})

// 请求拦截器
request.interceptors.request.use(
  config => {
    // 从 localStorage 获取 token
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// 响应拦截器
request.interceptors.response.use(
  response => {
    // 只返回 text 的内容
    if (response.data && response.data.translations && response.data.translations[0] && response.data.translations[0].text) {
      return response.data.translations[0].text
    }
    return response.data
  },
  error => {
    // 处理响应错误
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // 未登录或 token 过期
          localStorage.removeItem('token')
          window.location.href = '/login'
          break
        case 403:
          // 权限不足
          console.error('权限不足')
          break
        case 500:
          // 服务器错误
          console.error('服务器错误')
          break
      }
    }
    return Promise.reject(error)
  }
)

export default request