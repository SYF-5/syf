<template>
  <div class="home-container">
    <!-- 返回按钮 -->
    <div class="back-button" @click="goBack">
      <van-icon name="arrow-left" size="24" color="#fff" />
    </div>

    <van-nav-bar title="商家首页" />
    
    <div class="content">
      <van-icon name="shop-o" size="120" color="#1989fa" />
      <h1>欢迎，商家！</h1>
      <p>您已成功登录商家账号</p>
      
      <van-button type="primary" round block size="large" class="logout-btn" @click="handleLogout">
        退出登录
      </van-button>
    </div>
  </div>
</template>

<script setup>
import { useUserStore } from '../stores/user'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'

const userStore = useUserStore()
const router = useRouter()

// 返回上一页
const goBack = () => {
  router.back()
}

const handleLogout = () => {
  userStore.logout()
  showToast('退出登录成功')
  router.push('/login')
}
</script>

<style scoped>
.home-container {
  min-height: 100vh;
  background-color: #f5f5f5;
  position: relative;
}

.back-button {
  position: absolute;
  top: 20px;
  left: 20px;
  width: 40px;
  height: 40px;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 9999;
  transition: all 0.3s ease;
}

.back-button:hover {
  background-color: rgba(0, 0, 0, 0.7);
}

.content {
  text-align: center;
  padding: 40px 20px;
}

h1 {
  color: #323233;
  font-size: 28px;
  margin: 20px 0;
}

p {
  color: #646566;
  font-size: 16px;
  margin-bottom: 40px;
}

.logout-btn {
  width: 200px;
  margin: 0 auto;
}
</style>