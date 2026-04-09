<template>
  <div class="home-container">
    <div class="header">
      <van-icon name="arrow-left" size="24" color="#fff" @click="goBack" />
      <h1>用户首页</h1>
    </div>
    <div class="content">
      <van-icon name="user-o" size="120" color="#1989fa" />
      <h1>欢迎，用户！</h1>
      <p>您已成功登录用户账号</p>
      
      <van-button type="primary" round block size="large" class="logout-btn" @click="handleLogout">
        退出登录
      </van-button>
    </div>
    
    <!-- 分类tab栏 -->
    <div class="category-tabs">
      <van-tabs v-model:active="activeCategory" @change="handleCategoryChange">
        <van-tab title="全部" name="all"></van-tab>
        <van-tab title="火锅" name="1"></van-tab>
        <van-tab title="中餐" name="2"></van-tab>
        <van-tab title="西餐" name="3"></van-tab>
        <van-tab title="甜品" name="4"></van-tab>
        <van-tab title="饮品" name="5"></van-tab>
        <van-tab title="快餐" name="6"></van-tab>
      </van-tabs>
    </div>
    
    <!-- 餐厅列表 -->
    <div class="restaurant-list">
      <h2 class="section-title">附近餐厅</h2>
      <div class="restaurant-grid">
        <div class="restaurant-item" v-for="restaurant in filteredRestaurants" :key="restaurant.id">
          <img :src="restaurant.imageUrl || 'https://via.placeholder.com/300x200'" alt="餐厅图片" class="restaurant-image" />
          <div class="restaurant-info">
            <h3 class="restaurant-name">{{ restaurant.name }}</h3>
            <p class="restaurant-description">{{ restaurant.description }}</p>
            <div class="restaurant-details">
              <span class="avg-price">人均: ¥{{ restaurant.avgPrice }}</span>
              <span class="distance">距离: 1.2km</span>
              <span class="rating">评分: 4.5</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useUserStore } from '../stores/user'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'
import { ref, onMounted, computed } from 'vue'
import { getRestaurants } from '../api/restaurant'

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

// 餐厅数据
const restaurants = ref([])
const activeCategory = ref('all')

// 筛选后的餐厅
const filteredRestaurants = computed(() => {
  if (activeCategory.value === 'all') {
    return restaurants.value
  }
  return restaurants.value.filter(restaurant => {
    return restaurant.categoryCode && restaurant.categoryCode === parseInt(activeCategory.value)
  })
})

// 获取餐厅列表
const fetchRestaurants = async () => {
  try {
    const response = await getRestaurants()
    restaurants.value = response.data
  } catch (error) {
    console.error('获取餐厅列表失败:', error)
  }
}

// 分类切换
const handleCategoryChange = (name) => {
  activeCategory.value = name
}

onMounted(() => {
  fetchRestaurants()
})
</script>

<style scoped>
.home-container {
  min-height: 100vh;
  background-color: #f5f5f5;
  position: relative;
}

.header {
  background-color: #1989fa;
  color: #fff;
  padding: 20px;
  text-align: center;
}

.content {
  text-align: center;
  padding: 40px;
}

.content h1 {
  font-size: 24px;
  margin-bottom: 20px;
}

.content p {
  font-size: 16px;
  margin-bottom: 40px;
}

.logout-btn {
  width: 200px;
  margin: 0 auto;
}

.category-tabs {
  margin: 20px 0;
}

.category-tabs .van-tabs__nav {
  background-color: #fff;
  border-bottom: 1px solid #f0f0f0;
}

.category-tabs .van-tab {
  font-size: 16px;
  color: #666;
}

.category-tabs .van-tab--active {
  color: #1989fa;
}

.restaurant-list {
  padding: 20px;
}

.section-title {
  font-size: 20px;
  font-weight: 500;
  margin-bottom: 20px;
  color: #333;
}

.restaurant-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

.restaurant-item {
  background-color: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.restaurant-image {
  width: 100%;
  height: 180px;
  object-fit: cover;
}

.restaurant-info {
  padding: 16px;
}

.restaurant-name {
  font-size: 18px;
  font-weight: 500;
  margin-bottom: 8px;
  color: #333;
}

.restaurant-description {
  font-size: 14px;
  color: #666;
  margin-bottom: 12px;
  line-height: 1.5;
}

.restaurant-details {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  font-size: 12px;
}

.avg-price {
  color: #ff6b6b;
  font-weight: 500;
}

.distance {
  color: #666;
  font-weight: 500;
}

.rating {
  color: #ffd100;
  font-weight: 500;
}
</style>