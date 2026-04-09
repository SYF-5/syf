<template>
  <div class="login-container">
    <div class="header">
      <van-icon name="passed" size="80" color="#1989fa" />
      <h2 class="title">欢迎登录</h2>
    </div>



    <div class="form-container">
      <van-cell-group inset class="form-group">
        <van-field v-model="formData.account" name="account" label="账号" placeholder="请输入手机号" :rules="[
          { required: true, message: '请输入账号' },
          { validator: validateAccount, message: '请输入正确的手机号' }
        ]" />
        <van-field v-model="formData.password" type="password" name="password" label="密码" placeholder="请输入密码" :rules="[
          { required: true, message: '请输入密码' },
          { min: 6, message: '密码长度不能少于6位' }
        ]" />
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
        <van-button type="primary" round block size="large" class="login-btn" :disabled="!canLogin"
          @click="handleLogin">
          登录
        </van-button>
        <van-button round block size="large" class="register-btn" @click="handleRegister">
          注册
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
  agreed: false
})

const validateAccount = (value) => {
  if (value === 'admin') {
    return true
  }
  const phoneRegex = /^1[3-9]\d{9}$/
  return phoneRegex.test(value)
}

const canLogin = computed(() => {
  return formData.value.account && formData.value.password && formData.value.agreed && validateAccount(formData.value.account)
})



const handleLogin = async () => {
  if (!formData.value.account) {
    showToast('请输入账号')
    return
  }
  if (!formData.value.password) {
    showToast('请输入密码')
    return
  }
  if (!formData.value.agreed) {
    showToast('请先同意用户协议')
    return
  }

  const success = await userStore.login(formData.value.account, formData.value.password)
  if (success) {
    showSuccessToast('登录成功！')

    // 登录成功后跳转到首页
    setTimeout(() => {
      router.push('/home')
    }, 1500)
  } else {
    showToast('账号或密码错误')
  }
}

const handleRegister = () => {
  router.push('/register')
}

const showAgreement = () => {
  showToast('用户协议内容')
}
</script>

<style scoped>
.login-container {
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
  cursor: pointer;
}

.buttons {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.login-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
}

.register-btn {
  color: #1989fa;
  border-color: #1989fa;
}
</style>