<template>
  <div class="register-container">
    <div class="header">
      <van-icon name="passed" size="80" color="#1989fa" />
      <h2 class="title">欢迎注册</h2>
    </div>

    

    <div class="form-container">
      <van-cell-group inset class="form-group">
        <van-field
          v-model="formData.account"
          name="account"
          label="账号"
          placeholder="请输入手机号"
          :rules="[
            { required: true, message: '请输入账号' },
            { validator: validateAccount, message: '请输入正确的手机号' }
          ]"
        />
        <van-field
          v-model="formData.password"
          type="password"
          name="password"
          label="密码"
          placeholder="请输入密码（至少6位）"
          :rules="[
            { required: true, message: '请输入密码' },
            { min: 6, message: '密码长度不能少于6位' }
          ]"
        />
        <van-field
          v-model="formData.confirmPassword"
          type="password"
          name="confirmPassword"
          label="确认密码"
          placeholder="请再次输入密码"
          :rules="[
            { required: true, message: '请确认密码' },
            { validator: validateConfirmPassword, message: '两次输入的密码不一致' }
          ]"
        />
      </van-cell-group>

      <div class="agreement">
        <van-checkbox v-model="formData.agreed" shape="square">
          我已阅读并同意
          <span class="link" @click="showAgreement">《用户协议》</span>
          和
          <span class="link" @click="showAgreement">《隐私政策》</span>
        </van-checkbox>
      </div>

      <div class="buttons">
        <van-button
          type="primary"
          round
          block
          size="large"
          class="register-btn"
          @click="handleRegister"
        >
          注册
        </van-button>
        <van-button
          round
          block
          size="large"
          class="login-btn"
          @click="handleLogin"
        >
          已有账号？立即登录
        </van-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useUserStore } from '../stores/user'
import { useRouter } from 'vue-router'
import { showToast, showSuccessToast } from 'vant'

const userStore = useUserStore()
const router = useRouter()


const formData = ref({
  account: '',
  password: '',
  confirmPassword: '',
  agreed: false
})

const validateAccount = (value) => {
  const phoneRegex = /^1[3-9]\d{9}$/
  return phoneRegex.test(value)
}

const validateConfirmPassword = (value) => {
  return value === formData.value.password
}

const canRegister = computed(() => {
  return true
})



const handleRegister = async () => {
  if (!formData.value.account) {
    showToast('请输入账号')
    return
  }
  if (!formData.value.password) {
    showToast('请输入密码')
    return
  }
  if (!formData.value.confirmPassword) {
    showToast('请确认密码')
    return
  }
  if (formData.value.password !== formData.value.confirmPassword) {
    showToast('两次输入的密码不一致')
    return
  }
  if (!formData.value.agreed) {
    showToast('请先同意用户协议')
    return
  }

  const role = 1
  const success = await userStore.register(formData.value.account, formData.value.password, role)
  if (success) {
    showSuccessToast('注册成功！')
    setTimeout(() => {
      router.push('/login')
    }, 1500)
  } else {
    showToast('注册失败，请重试')
  }
}

const handleLogin = () => {
  router.push('/login')
}

const showAgreement = () => {
  showToast('用户协议内容')
}
</script>

<style scoped>
.register-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 40px 20px;
  display: flex;
  flex-direction: column;
}

.header {
  text-align: center;
  margin-bottom: 30px;
}

.title {
  color: white;
  font-size: 28px;
  margin-top: 20px;
  font-weight: 500;
}



.form-container {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  padding: 20px;
}

.form-group {
  margin-bottom: 20px;
}

.agreement {
  padding: 10px 0 20px;
  font-size: 14px;
}

.link {
  color: #1989fa;
  text-decoration: underline;
}

.buttons {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.register-btn {
  background: #1989fa;
  color: white;
}

.login-btn {
  background: white;
  color: #1989fa;
  border: 1px solid #1989fa;
}
</style>