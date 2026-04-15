<template>
  <div class="merchant-container">
    <!-- 顶部导航栏 -->
    <div class="nav-bar">
      <div class="back-button" @click="goBack">
        <van-icon name="arrow-left" size="24" color="#333" />
      </div>
      <h1 class="nav-title">入驻管理</h1>
      <div class="nav-right"></div>
    </div>

    <!-- 功能选项 -->
    <div class="function-options">
      <div class="option-item" @click="goToMyStores">
        <div class="option-icon">
          <van-icon name="shop-o" size="48" color="#1989fa" />
        </div>
        <h3 class="option-title">我的门店</h3>
        <p class="option-desc">管理我的门店信息</p>
      </div>
      <div class="option-item" @click="goToAddDish">
        <div class="option-icon">
          <van-icon name="food-o" size="48" color="#ff6b6b" />
        </div>
        <h3 class="option-title">上架菜品</h3>
        <p class="option-desc">为门店添加新菜品</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { showToast } from 'vant'

const router = useRouter()

// 返回上一页
const goBack = () => {
  router.back()
}

// 跳转到我的门店
const goToMyStores = () => {
  router.push({ path: '/my-stores' })
}

// 跳转到上架菜品
const goToAddDish = () => {
  showToast('跳转到上架菜品页面')
}
</script>

<style scoped>
.merchant-container {
  background-color: #f5f5f5;
  min-height: 100vh;
  padding-bottom: 20px;
}

/* 顶部导航栏 */
.nav-bar {
  background-color: #fff;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 999;
}

.back-button {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.back-button:hover {
  background-color: #f5f5f5;
}

.nav-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.nav-right {
  width: 40px;
}

/* 功能选项 */
.function-options {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.option-item {
  background-color: #fff;
  border-radius: 12px;
  padding: 24px;
  display: flex;
  align-items: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.3s ease;
}

.option-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.option-icon {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: #f0f9ff;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20px;
  flex-shrink: 0;
}

.option-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0 0 8px 0;
}

.option-desc {
  font-size: 14px;
  color: #666;
  margin: 0;
}

@media (max-width: 768px) {
  .nav-bar {
    padding: 0 16px;
  }
  
  .function-options {
    padding: 16px;
  }
  
  .option-item {
    padding: 20px;
  }
  
  .option-icon {
    width: 64px;
    height: 64px;
    margin-right: 16px;
  }
  
  .option-icon van-icon {
    size: 36px;
  }
  
  .option-title {
    font-size: 16px;
  }
  
  .option-desc {
    font-size: 13px;
  }
}
</style>