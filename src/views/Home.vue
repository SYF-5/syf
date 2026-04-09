<template>
  <div class="home-container">
    <!-- 顶部搜索栏 -->
    <div class="search-bar">
      <van-search
        v-model="searchValue"
        placeholder="搜索美食、商家"
        background="#fff"
        :show-action="false"
      />
    </div>

    <!-- 轮播图 -->
    <div class="carousel">
      <van-swipe :autoplay="3000" indicator-color="white" indicator-size="12px">
        <van-swipe-item v-for="(item, index) in swipes" :key="index">
          <img :src="item" alt="轮播图" class="carousel-img" />
        </van-swipe-item>
      </van-swipe>
    </div>

    <!-- 功能按钮区 -->
    <div class="function-buttons">
      <div class="button-item" v-for="(item, index) in buttons" :key="index">
        <van-icon :name="item.icon" size="48" color="#1989fa" />
        <span class="button-text">{{ item.text }}</span>
      </div>
    </div>

    <!-- 横向滑动tab栏 -->
    <div class="category-tabs" ref="tabsRef" @scroll="handleScroll">
      <div class="tabs-container">
        <div class="category-tab-item" :class="{ active: activeTab === 'all' }" @click="activeTab = 'all'">全部</div>
        <div class="category-tab-item" :class="{ active: activeTab === 'hotpot' }" @click="activeTab = 'hotpot'">火锅</div>
        <div class="category-tab-item" :class="{ active: activeTab === 'chinese' }" @click="activeTab = 'chinese'">中餐</div>
        <div class="category-tab-item" :class="{ active: activeTab === 'western' }" @click="activeTab = 'western'">西餐</div>
        <div class="category-tab-item" :class="{ active: activeTab === 'dessert' }" @click="activeTab = 'dessert'">甜品</div>
        <div class="category-tab-item" :class="{ active: activeTab === 'drink' }" @click="activeTab = 'drink'">饮品</div>
        <div class="category-tab-item" :class="{ active: activeTab === 'fastfood' }" @click="activeTab = 'fastfood'">快餐</div>
      </div>
    </div>

    <!-- 餐厅列表 -->
    <div class="restaurant-list">
      <div class="restaurant-item" v-for="restaurant in filteredRestaurants" :key="restaurant.id" @click="goToRestaurantDetail(restaurant.id)">
        <img :src="restaurant.imageUrl || 'https://via.placeholder.com/100x100'" alt="门店图片" class="restaurant-image" />
        <div class="restaurant-info">
          <h3 class="restaurant-name">{{ restaurant.name }}</h3>
          <p class="restaurant-desc">{{ restaurant.description }}</p>
          <div class="restaurant-details">
            <div class="restaurant-rating">
              <van-icon name="star" color="#ffd100" size="16" />
              <span class="rating-text">4.5</span>
            </div>
            <div class="restaurant-price">
              <span class="price-text">人均 ¥{{ restaurant.avgPrice || 0 }}</span>
            </div>
            <div class="restaurant-distance">
              <span class="distance-text">距离 1.2km</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 底部tab栏 -->
    <div class="bottom-tab-bar">
      <div class="tab-item active" @click="goToHome">
        <van-icon name="home-o" size="24" />
        <span>首页</span>
      </div>
      <div class="tab-item" @click="goToMine">
        <van-icon name="user-o" size="24" />
        <span>我的</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getRestaurants } from '../api/restaurant'

const searchValue = ref('')
const activeTab = ref('all')
const tabsRef = ref(null)
let scrollTimer = null
const router = useRouter()

// 轮播图数据（使用占位图）
const swipes = ref([
  'https://img.yzcdn.cn/vant/cat.jpeg',
  'https://img.yzcdn.cn/vant/cat.jpeg',
  'https://img.yzcdn.cn/vant/cat.jpeg'
])

// 餐厅数据
const restaurants = ref([])

// 处理滚动事件
const handleScroll = () => {
  if (tabsRef.value) {
    tabsRef.value.classList.add('scrolling')
    
    // 3秒后隐藏滚动条
    if (scrollTimer) {
      clearTimeout(scrollTimer)
    }
    scrollTimer = setTimeout(() => {
      if (tabsRef.value) {
        tabsRef.value.classList.remove('scrolling')
      }
    }, 3000)
  }
}

// 跳转到门店详情
const goToRestaurantDetail = (restaurantId) => {
  router.push({ path: `/restaurant/${restaurantId}` })
}

// 底部tab跳转
const goToHome = () => {
  router.push({ path: '/home' })
}

const goToMine = () => {
  router.push({ path: '/mine' })
}

// 功能按钮数据
const buttons = ref([
  { icon: 'star-o', text: '排行榜' },
  { icon: 'map-o', text: '地图' },
  { icon: 'shop-o', text: '人气门店' },
  { icon: 'food-o', text: '热门美食' }
])

// 分类映射
const categoryMap = {
  all: 0,
  hotpot: 1,
  chinese: 2,
  western: 3,
  dessert: 4,
  drink: 5,
  fastfood: 6
}

// 过滤餐厅数据
const filteredRestaurants = computed(() => {
  const currentCategory = categoryMap[activeTab.value]
  if (currentCategory === 0) {
    return restaurants.value
  }
  return restaurants.value.filter(restaurant => restaurant.categoryCode === currentCategory)
})

// 获取餐厅列表
const fetchRestaurants = async () => {
  try {
    const response = await getRestaurants()
    console.log('获取到的餐厅数据:', response.data)
    restaurants.value = response.data
  } catch (error) {
    console.error('获取餐厅列表失败:', error)
  }
}

onMounted(() => {
  fetchRestaurants()
})
</script>

<style scoped>
.home-container {
  background-color: #f5f5f5;
  min-height: 100vh;
}

.search-bar {
  background-color: #fff;
  padding: 10px;
}

.carousel {
  margin: 10px;
  border-radius: 8px;
  overflow: hidden;
}

.carousel-img {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.function-buttons {
  display: flex;
  justify-content: space-around;
  padding: 20px 0;
  margin: 10px;
}

.button-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  background-color: #fff;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.button-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.button-text {
  margin-top: 8px;
  font-size: 14px;
  color: #333;
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

/* 滑动切换栏容器 */
.category-tabs {
  margin-bottom: 25px;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.category-tabs::-webkit-scrollbar {
  display: none;
}

.category-tabs.scrolling {
  scrollbar-width: thin;
  -ms-overflow-style: auto;
}

.category-tabs.scrolling::-webkit-scrollbar {
  display: block;
  width: 6px;
}

.category-tabs.scrolling::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 3px;
}

/* 选项卡容器（水平排列） */
.tabs-container {
  display: flex;
  gap: 20px;
  padding-bottom: 10px;
}

/* 单个选项卡样式 */
.category-tab-item {
  padding: 8px 16px;
  font-size: 16px;
  color: #666;
  cursor: pointer;
  white-space: nowrap;
  border-bottom: 2px solid transparent;
  transition: all 0.3s;
}

/* 激活状态选项卡 */
.category-tab-item.active {
  color: #ff6b6b;
  border-bottom-color: #ff6b6b;
  font-weight: 500;
  animation: tabActive 0.3s ease;
}

/* 选项卡切换动画 */
@keyframes tabActive {
  0% {
    transform: translateY(2px);
    opacity: 0.8;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
}

/* 移动端适配 */
@media (max-width: 768px) {
  .category-tabs {
    margin-bottom: 20px;
  }

  .tabs-container {
    gap: 15px;
  }

  .tab-item {
    padding: 6px 12px;
    font-size: 14px;
  }
}

/* 餐厅列表样式 */
.restaurant-list {
  margin: 10px;
}

.restaurant-item {
  display: flex;
  background-color: #fff;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.restaurant-image {
  width: 100px;
  height: 100px;
  border-radius: 8px;
  object-fit: cover;
  margin-right: 15px;
}

.restaurant-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.restaurant-name {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.restaurant-desc {
  font-size: 14px;
  color: #666;
  margin: 5px 0;
  line-height: 1.4;
}

.restaurant-details {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.restaurant-rating {
  display: flex;
  align-items: center;
  color: #ffd100;
  font-size: 14px;
}

.rating-text {
  margin-left: 5px;
  color: #666;
}

.restaurant-price {
  font-size: 14px;
  color: #ff6b6b;
  font-weight: 500;
}

.restaurant-distance {
  font-size: 14px;
  color: #666;
}
</style>