<template>
  <div class="home-container">
    <!-- 顶部搜索栏 -->
    <div class="search-bar">
      <van-search v-model="searchValue" placeholder="搜索美食、商家" background="#fff" :show-action="false"
        @search="handleSearch" />
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
        <div v-for="tab in tabList" :key="tab.value" class="category-tab-item"
          :class="{ active: activeTab === tab.value }" @click="activeTab = tab.value">
          {{ tab.label }}
        </div>
      </div>
    </div>

    <!-- 餐厅列表 -->
    <div class="restaurant-list" v-if="!loading">
      <div class="restaurant-item" v-for="restaurant in filteredRestaurants" :key="restaurant.id"
        @click="goToRestaurantDetail(restaurant.id)">
        <img :src="getImageUrl(restaurant.imageUrl)" alt="门店图片" class="restaurant-image" @error="handleImageError" />
        <div class="restaurant-info">
          <h3 class="restaurant-name">{{ restaurant.name }}</h3>
          <p class="restaurant-desc">{{ restaurant.description || '暂无描述' }}</p>

          <!-- 地址信息 -->
          <div class="restaurant-address" v-if="restaurant.address">
            <van-icon name="location-o" size="14" color="#999" />
            <span>{{ restaurant.address }}</span>
          </div>

          <!-- 营业时间 -->
          <div class="restaurant-hours" v-if="restaurant.businessHours">
            <van-icon name="clock-o" size="14" color="#999" />
            <span>{{ restaurant.businessHours }}</span>
          </div>

          <!-- 联系电话 -->
          <div class="restaurant-phone" v-if="restaurant.phone">
            <van-icon name="phone-o" size="14" color="#999" />
            <span>{{ restaurant.phone }}</span>
          </div>

          <div class="restaurant-details">
            <div class="restaurant-rating">
              <van-icon name="star" color="#ffd100" size="16" />
              <span class="rating-text">{{ restaurant.rating || '4.5' }}</span>
            </div>
            <div class="restaurant-price">
              <span class="price-text">{{ formatPrice(restaurant.avgPrice) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 空状态 -->
      <div class="empty-state" v-if="filteredRestaurants.length === 0">
        <van-empty description="暂无餐厅数据" />
      </div>
    </div>

    <!-- 加载状态 -->
    <div class="loading-container" v-else>
      <van-loading type="spinner" size="40px" vertical>加载中...</van-loading>
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
import { showToast } from 'vant'

const searchValue = ref('')
const activeTab = ref('all')
const tabsRef = ref(null)
let scrollTimer = null
const router = useRouter()
const loading = ref(false)

const imageBaseURL = import.meta.env?.VITE_API_BASE_URL || ''

const swipes = ref([
  'https://img.yzcdn.cn/vant/cat.jpeg',
  'https://img.yzcdn.cn/vant/cat.jpeg',
  'https://img.yzcdn.cn/vant/cat.jpeg'
])

const restaurants = ref([])

const tabList = [
  { label: '全部', value: 'all', categoryCode: 0 },
  { label: '火锅', value: 'hotpot', categoryCode: 1 },
  { label: '中餐', value: 'chinese', categoryCode: 2 },
  { label: '西餐', value: 'western', categoryCode: 3 },
  { label: '甜品', value: 'dessert', categoryCode: 4 },
  { label: '饮品', value: 'drink', categoryCode: 5 },
  { label: '快餐', value: 'fastfood', categoryCode: 6 }
]

const buttons = ref([
  { icon: 'star-o', text: '排行榜' },
  { icon: 'map-o', text: '地图' },
  { icon: 'shop-o', text: '人气门店' },
  { icon: 'food-o', text: '热门美食' }
])

// 本地占位图（不依赖网络）
const placeholderImage = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"%3E%3Crect width="100" height="100" fill="%23f5f5f5"/%3E%3Ctext x="50" y="50" font-size="12" text-anchor="middle" dy=".3em" fill="%23999"%3E暂无图片%3C/text%3E%3C/svg%3E'

const getImageUrl = (url) => {
  if (!url) return placeholderImage

  // 如果地址包含 bing 代理，提取问号后面的真实图片地址
  if (url.includes('th.bing.com') && url.includes('?http')) {
    const realUrl = url.split('?')[1]
    if (realUrl && (realUrl.startsWith('http://') || realUrl.startsWith('https://'))) {
      return realUrl
    }
  }

  // 已经是 http 链接，直接返回
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url
  }

  // 相对路径，拼接后端地址
  if (imageBaseURL) {
    return `${imageBaseURL}${url}`
  }

  return placeholderImage
}

const handleImageError = (e) => {
  if (e.target.src === placeholderImage) return
  e.target.src = placeholderImage
}

const formatPrice = (price) => {
  if (price === null || price === undefined) return '价格待定'
  if (price === 0) return '免费'
  return `¥${price}`
}

const handleScroll = () => {
  if (tabsRef.value) {
    tabsRef.value.classList.add('scrolling')
    if (scrollTimer) clearTimeout(scrollTimer)
    scrollTimer = setTimeout(() => {
      if (tabsRef.value) tabsRef.value.classList.remove('scrolling')
    }, 3000)
  }
}

const handleSearch = () => {
  if (searchValue.value.trim()) {
    console.log(`搜索关键词: ${searchValue.value}`)
  }
}

const goToRestaurantDetail = (restaurantId) => {
  router.push({ path: `/restaurant/${restaurantId}` })
}

const goToHome = () => {
  router.push({ path: '/home' })
}

const goToMine = () => {
  router.push({ path: '/mine' })
}

const filteredRestaurants = computed(() => {
  let filtered = restaurants.value
  const currentTab = tabList.find(tab => tab.value === activeTab.value)
  if (currentTab && currentTab.categoryCode !== 0) {
    filtered = filtered.filter(r => r.categoryCode === currentTab.categoryCode)
  }
  if (searchValue.value.trim()) {
    const keyword = searchValue.value.trim().toLowerCase()
    filtered = filtered.filter(r =>
      r.name?.toLowerCase().includes(keyword) ||
      r.description?.toLowerCase().includes(keyword) ||
      r.address?.toLowerCase().includes(keyword)
    )
  }
  return filtered
})

const fetchRestaurants = async () => {
  try {
    // 注意：这里的 result 已经是后端返回的数据（可能是数组或对象）
    const result = await getRestaurants()
    console.log('getRestaurants 返回结果:', result)

    let restaurantData = null

    // 1. 如果 result 本身就是数组
    if (Array.isArray(result)) {
      restaurantData = result
    }
    // 2. 如果 result 是对象，尝试提取常见字段
    else if (result && typeof result === 'object') {
      if (Array.isArray(result.data)) {
        restaurantData = result.data
      } else if (Array.isArray(result.records)) {
        restaurantData = result.records
      } else if (Array.isArray(result.list)) {
        restaurantData = result.list
      } else {
        // 3. 尝试遍历对象，找到第一个数组属性
        for (const key in result) {
          if (Array.isArray(result[key])) {
            restaurantData = result[key]
            console.log(`从字段 "${key}" 提取到数组`)
            break
          }
        }
      }
    }

    if (restaurantData && restaurantData.length > 0) {
      restaurants.value = restaurantData.map(item => ({
        ...item,
        rating: item.rating || (4.0 + Math.random() * 1).toFixed(1)
      }))
      console.log('成功加载餐厅数据:', restaurants.value)

    } else if (restaurantData && restaurantData.length === 0) {
      restaurants.value = []

    } else {
      console.error('无法解析数据，原始返回值:', result)
      restaurants.value = []
      showToast('数据格式错误，请检查接口')
    }
  } catch (error) {
    console.error('获取餐厅列表失败:', error)
    showToast('获取餐厅数据失败，请稍后重试')
    restaurants.value = []
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
  padding-bottom: 60px;
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
  flex: 1;
  margin: 0 5px;
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

.tabs-container {
  display: flex;
  gap: 20px;
  padding-bottom: 10px;
  padding-left: 10px;
  padding-right: 10px;
}

.category-tab-item {
  padding: 8px 16px;
  font-size: 16px;
  color: #666;
  cursor: pointer;
  white-space: nowrap;
  border-bottom: 2px solid transparent;
  transition: all 0.3s;
}

.category-tab-item.active {
  color: #ff6b6b;
  border-bottom-color: #ff6b6b;
  font-weight: 500;
  animation: tabActive 0.3s ease;
}

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
  transition: transform 0.2s;
  cursor: pointer;
}

.restaurant-item:active {
  transform: scale(0.98);
}

.restaurant-image {
  width: 100px;
  height: 100px;
  border-radius: 8px;
  object-fit: cover;
  margin-right: 15px;
  background-color: #f5f5f5;
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
  margin: 0 0 4px 0;
}

.restaurant-desc {
  font-size: 14px;
  color: #666;
  margin: 0 0 6px 0;
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.restaurant-address,
.restaurant-hours,
.restaurant-phone {
  font-size: 12px;
  color: #999;
  margin-bottom: 4px;
  display: flex;
  align-items: center;
  gap: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.restaurant-address span,
.restaurant-hours span,
.restaurant-phone span {
  overflow: hidden;
  text-overflow: ellipsis;
}

.restaurant-details {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 6px;
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

.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;
}

.empty-state {
  padding: 40px 0;
}

::-webkit-scrollbar {
  width: 4px;
  height: 4px;
}

::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 2px;
}
</style>