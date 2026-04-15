<template>
  <div class="mine-container">
    <!-- 用户信息区域 -->
    <div class="user-info-section">
      <div class="user-avatar">
        <van-icon name="user-o" size="64" color="#fff" />
      </div>
      <div class="user-details">
        <h2 class="user-name">用户</h2>
        <p class="user-phone">138****8888</p>
      </div>
    </div>

    <!-- 功能菜单区域 -->
    <div class="function-menu">
      <div class="menu-section">
        <div class="menu-item" @click="goToOrders">
          <van-icon name="orders-o" size="24" color="#1989fa" />
          <span>我的订单</span>
          <van-icon name="arrow" size="16" color="#999" />
        </div>
        <div class="menu-item" @click="goToFavorites">
          <van-icon name="star-o" size="24" color="#ffd100" />
          <span>我的收藏</span>
          <van-icon name="arrow" size="16" color="#999" />
        </div>
        <div class="menu-item" @click="goToAddress">
          <van-icon name="location-o" size="24" color="#4caf50" />
          <span>收货地址</span>
          <van-icon name="arrow" size="16" color="#999" />
        </div>
        <div class="menu-item" @click="goToCoupons">
          <van-icon name="coupon-o" size="24" color="#ff6b6b" />
          <span>我的优惠券</span>
          <van-icon name="arrow" size="16" color="#999" />
        </div>
      </div>

      <div class="menu-section">
        <div class="menu-item" @click="goToMerchant">
          <van-icon name="shop-o" size="24" color="#ff9800" />
          <span>入驻</span>
          <van-icon name="arrow" size="16" color="#999" />
        </div>
      </div>

      <div class="menu-section">
        <div class="menu-item" @click="goToSettings">
          <van-icon name="setting-o" size="24" color="#666" />
          <span>设置</span>
          <van-icon name="arrow" size="16" color="#999" />
        </div>
        <div class="menu-item" @click="goToHelp">
          <van-icon name="question-o" size="24" color="#666" />
          <span>帮助与反馈</span>
          <van-icon name="arrow" size="16" color="#999" />
        </div>
        <div class="menu-item" @click="goToAbout">
          <van-icon name="info-o" size="24" color="#666" />
          <span>关于我们</span>
          <van-icon name="arrow" size="16" color="#999" />
        </div>
      </div>
    </div>

    <!-- 退出登录按钮 -->
    <div class="logout-section">
      <van-button type="default" round block size="large" @click="handleLogout">
        退出登录
      </van-button>
    </div>

    <!-- 底部tab栏 -->
    <div class="bottom-tab-bar">
      <div class="tab-item" @click="goToHome">
        <van-icon name="home-o" size="24" />
        <span>首页</span>
      </div>
      <div class="tab-item active" @click="goToMine">
        <van-icon name="user-o" size="24" />
        <span>我的</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { showToast } from 'vant'

const router = useRouter()

// 跳转到首页
const goToHome = () => {
  router.push({ path: '/home' })
}

// 跳转到我的
const goToMine = () => {
  router.push({ path: '/mine' })
}

// 跳转到订单页面
const goToOrders = () => {
  showToast('跳转到订单页面')
}

// 跳转到收藏页面
const goToFavorites = () => {
  showToast('跳转到收藏页面')
}

// 跳转到地址页面
const goToAddress = () => {
  showToast('跳转到地址页面')
}

// 跳转到优惠券页面
const goToCoupons = () => {
  showToast('跳转到优惠券页面')
}

// 跳转到设置页面
const goToSettings = () => {
  showToast('跳转到设置页面')
}

// 跳转到帮助页面
const goToHelp = () => {
  showToast('跳转到帮助页面')
}

// 跳转到关于页面
const goToAbout = () => {
  showToast('跳转到关于页面')
}

// 跳转到入驻页面
const goToMerchant = () => {
  router.push({ path: '/merchant' })
}

// 退出登录
const handleLogout = () => {
  // 这里可以添加退出登录的逻辑
  showToast('退出登录成功')
  router.push({ path: '/login' })
}
</script>

<style scoped>
.mine-container {
  background-color: #f5f5f5;
  min-height: 100vh;
  padding-bottom: 60px;
}

/* 用户信息区域 */
.user-info-section {
  background-color: #1989fa;
  padding: 40px 20px;
  display: flex;
  align-items: center;
  color: #fff;
}

.user-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20px;
}

.user-details {
  flex: 1;
}

.user-name {
  font-size: 20px;
  font-weight: 600;
  margin: 0 0 8px 0;
}

.user-phone {
  font-size: 14px;
  margin: 0;
  opacity: 0.8;
}

/* 功能菜单区域 */
.function-menu {
  margin-top: 20px;
  background-color: #fff;
  border-radius: 8px;
  overflow: hidden;
  margin: 20px 10px;
}

.menu-section {
  border-bottom: 1px solid #f0f0f0;
}

.menu-section:last-child {
  border-bottom: none;
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;
  transition: all 0.3s ease;
}

.menu-item:last-child {
  border-bottom: none;
}

.menu-item:hover {
  background-color: #f5f5f5;
}

.menu-item span {
  flex: 1;
  margin-left: 16px;
  font-size: 16px;
  color: #333;
}

/* 退出登录按钮 */
.logout-section {
  margin: 40px 10px;
}

/* 底部tab栏 */
.bottom-tab-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 50px;
  background-color: #fff;
  display: flex;
  justify-content: space-around;
  align-items: center;
  border-top: 1px solid #f0f0f0;
  z-index: 9999;
}

.tab-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #666;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.tab-item.active {
  color: #1989fa;
}

.tab-item:hover {
  color: #1989fa;
}

.tab-item van-icon {
  margin-bottom: 4px;
}

@media (max-width: 768px) {
  .user-info-section {
    padding: 30px 15px;
  }
  
  .user-avatar {
    width: 70px;
    height: 70px;
  }
  
  .user-name {
    font-size: 18px;
  }
  
  .menu-item {
    padding: 14px 16px;
  }
  
  .menu-item span {
    font-size: 15px;
  }
}
</style>