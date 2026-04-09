import { defineStore } from 'pinia'
import { ref } from 'vue'
import { login as loginApi, register as registerApi } from '../api/auth'

export const useUserStore = defineStore('user', () => {
  const userType = ref('user')
  const isLoggedIn = ref(false)
  const userInfo = ref(null)

  const setUserType = (type) => {
    userType.value = type
  }

  const login = async (username, password) => {
    try {
      const role = userType.value === 'user' ? 1 : 2
      const response = await loginApi({ username, password, role })
      if (response.code === 200) {
        isLoggedIn.value = true
        userInfo.value = response.data
        localStorage.setItem('token', response.data.token)
        return true
      } else {
        return false
      }
    } catch (error) {
      console.error('登录失败:', error)
      return false
    }
  }

  const register = async (username, password, role) => {
    try {
      const response = await registerApi({ username, password, role })
      if (response.code === 200) {
        return true
      } else {
        return false
      }
    } catch (error) {
      console.error('注册失败:', error)
      return false
    }
  }

  const logout = () => {
    isLoggedIn.value = false
    userInfo.value = null
    localStorage.removeItem('token')
  }

  return {
    userType,
    isLoggedIn,
    userInfo,
    setUserType,
    login,
    register,
    logout
  }
})