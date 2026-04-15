<template>
  <div class="my-stores-container">
    <!-- 顶部导航栏 -->
    <div class="nav-bar">
      <div class="back-button" @click="goBack">
        <van-icon name="arrow-left" size="24" color="#333" />
      </div>
      <h1 class="nav-title">我的门店</h1>
      <div class="nav-right"></div>
    </div>

    <!-- 门店列表 -->
    <div class="stores-list" v-if="stores.length > 0">
      <div class="store-item" v-for="store in stores" :key="store.id" @click="goToStoreDetail(store.id)">
        <img :src="getImageUrl(store.imageUrl)" alt="门店图片" class="store-image" @error="handleImageError" />
        <div class="store-info">
          <h3 class="store-name">{{ store.name }}</h3>
          <p class="store-desc">{{ store.description || '暂无描述' }}</p>
          <div class="store-details">
            <div class="store-rating">
              <van-icon name="star" color="#ffd100" size="16" />
              <span class="rating-text">{{ store.rating || '4.5' }}</span>
            </div>
            <div class="store-price">
              <span class="price-text">{{ formatPrice(store.avgPrice) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 空状态 -->
    <div class="empty-state" v-else>
      <van-icon name="shop-o" size="80" color="#ccc" />
      <p class="empty-text">暂无门店，点击下方按钮添加</p>
    </div>

    <!-- 添加门店按钮 -->
    <div class="add-store-button">
      <van-button type="primary" round block size="large" @click="goToAddStore">
        <van-icon name="plus" size="20" />
        添加门店
      </van-button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'

const router = useRouter()

// 门店数据
const stores = ref([
  {
    id: 1,
    name: '老地方火锅',
    imageUrl: '',
    description: '正宗重庆牛油火锅，麻辣鲜香',
    avgPrice: 88,
    rating: 4.5
  },
  {
    id: 2,
    name: '江南小厨',
    imageUrl: '',
    description: '地道本帮菜，家常口味',
    avgPrice: 68,
    rating: 4.2
  }
])

// 本地占位图（不依赖网络）
const placeholderImage = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"%3E%3Crect width="100" height="100" fill="%23f5f5f5"/%3E%3Ctext x="50" y="50" font-size="12" text-anchor="middle" dy=".3em" fill="%23999"%3E暂无图片%3C/text%3E%3C/svg%3E'

// 图片处理
const getImageUrl = (url) => {
  if (!url) return placeholderImage
  if (url.startsWith('http://') || url.startsWith('https://')) return url
  return `https://th.bing.com/th/id/OIP.${url}`
}

const handleImageError = (e) => {
  if (e.target.src === placeholderImage) return
  e.target.src = placeholderImage
}

// 价格格式化
const formatPrice = (price) => {
  if (price === null || price === undefined) return '价格待定'
  if (price === 0) return '免费'
  return `¥${price}`
}

// 返回上一页
const goBack = () => {
  router.back()
}

// 跳转到门店详情
const goToStoreDetail = (storeId) => {
  router.push({ path: `/restaurant/${storeId}` })
}

// 跳转到添加门店
const goToAddStore = () => {
  router.push({ path: '/add-store' })
}

// 模拟获取门店数据
const fetchStores = async () => {
  try {
    // 这里可以添加从接口获取门店数据的逻辑
    console.log('获取门店数据成功')
  } catch (error) {
    console.error('获取门店数据失败:', error)
    showToast('获取门店数据失败，请稍后重试')
  }
}

onMounted(() => {
  fetchStores()
})
</script>

<style scoped>
.my-stores-container {
  background-color: #f5f5f5;
  min-height: 100vh;
  padding-bottom: 100px;
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

/* 门店列表 */
.stores-list {
  padding: 16px;
}

.store-item {
  background-color: #fff;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  cursor: pointer;
  transition: all 0.3s ease;
}

.store-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.store-image {
  width: 120px;
  height: 120px;
  object-fit: cover;
  flex-shrink: 0;
}

.store-info {
  flex: 1;
  padding: 16px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.store-name {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0 0 8px 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.store-desc {
  font-size: 14px;
  color: #666;
  margin: 0 0 12px 0;
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.store-details {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.store-rating {
  display: flex;
  align-items: center;
  color: #ffd100;
  font-size: 14px;
}

.rating-text {
  margin-left: 4px;
  font-weight: 500;
}

.store-price {
  font-size: 14px;
  color: #ff6b6b;
  font-weight: 500;
}

/* 空状态 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  text-align: center;
}

.empty-text {
  font-size: 16px;
  color: #999;
  margin-top: 20px;
  margin-bottom: 0;
}

/* 添加门店按钮 */
.add-store-button {
  position: fixed;
  bottom: 20px;
  left: 20px;
  right: 20px;
  z-index: 999;
}

@media (max-width: 768px) {
  .nav-bar {
    padding: 0 16px;
  }
  
  .stores-list {
    padding: 12px;
  }
  
  .store-item {
    flex-direction: column;
  }
  
  .store-image {
    width: 100%;
    height: 180px;
  }
  
  .store-info {
    padding: 12px;
  }
  
  .store-name {
    font-size: 16px;
  }
  
  .store-desc {
    font-size: 13px;
  }
  
  .add-store-button {
    left: 12px;
    right: 12px;
  }
}
</style>