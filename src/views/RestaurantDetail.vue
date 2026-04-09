<template>
  <div class="restaurant-detail" @scroll="handleScroll">
    <!-- 返回按钮 -->
    <div class="back-button" @click="goBack">
      <van-icon name="arrow-left" size="24" color="#fff" />
    </div>

    <!-- 顶部图片 -->
    <div class="top-image" :style="{ height: imageHeight + 'px' }">
      <img :src="getImageUrl(restaurant.image)" alt="门店图片" @error="handleImageError" />
    </div>

    <!-- 基本信息 -->
    <div class="restaurant-info">
      <h1 class="restaurant-name">{{ restaurant.name }}</h1>
      <div class="restaurant-details">
        <div class="rating">
          <van-icon name="star" color="#ffd100" size="16" />
          <span>{{ restaurant.rating }}</span>
        </div>
        <div class="price">人均 ¥{{ restaurant.price }}</div>
        <div class="distance">距离 {{ restaurant.distance }}km</div>
      </div>
      <p class="description">{{ restaurant.desc }}</p>
      <div class="business-hours">
        <van-icon name="clock-o" size="16" />
        <span>营业时间: {{ restaurant.businessHours }}</span>
      </div>
    </div>

    <!-- 标签页 -->
    <div class="tabs-container">
      <van-tabs v-model:active="activeTab" type="card">
        <van-tab title="推荐菜品" name="dishes">
          <!-- 菜品列表 -->
          <div class="dish-list">
            <div class="dish-item" v-for="dish in restaurant.dishes" :key="dish.id" @click="goToDishDetail(dish.id)">
              <img :src="getImageUrl(dish.image)" alt="菜品图片" class="dish-image" @error="handleImageError" />
              <div class="dish-info">
                <h3 class="dish-name">{{ dish.name }}</h3>
                <p class="dish-flavor">口味: {{ dish.flavor }}</p>
                <div class="dish-rating">
                  <van-icon name="star" color="#ffd100" size="14" />
                  <span>{{ dish.rating }}</span>
                </div>
                <div class="dish-price">¥{{ dish.price }}</div>
              </div>
            </div>
          </div>
        </van-tab>
        <van-tab title="商家详情" name="detail">
          <!-- 商家详情 -->
          <div class="merchant-detail">
            <!-- 评分分布 -->
            <div class="ratings-chart">
              <div class="rating-item">
                <div class="rating-label">口味</div>
                <div class="rating-bar-container">
                  <div class="rating-bar">
                    <div class="rating-fill" :style="{ width: (restaurant.ratings.flavor / 5) * 100 + '%' }"></div>
                  </div>
                  <span class="rating-value">{{ restaurant.ratings.flavor }}</span>
                </div>
              </div>
              <div class="rating-item">
                <div class="rating-label">环境</div>
                <div class="rating-bar-container">
                  <div class="rating-bar">
                    <div class="rating-fill" :style="{ width: (restaurant.ratings.environment / 5) * 100 + '%' }"></div>
                  </div>
                  <span class="rating-value">{{ restaurant.ratings.environment }}</span>
                </div>
              </div>
              <div class="rating-item">
                <div class="rating-label">服务</div>
                <div class="rating-bar-container">
                  <div class="rating-bar">
                    <div class="rating-fill" :style="{ width: (restaurant.ratings.service / 5) * 100 + '%' }"></div>
                  </div>
                  <span class="rating-value">{{ restaurant.ratings.service }}</span>
                </div>
              </div>
              <div class="rating-item">
                <div class="rating-label">性价比</div>
                <div class="rating-bar-container">
                  <div class="rating-bar">
                    <div class="rating-fill" :style="{ width: (restaurant.ratings.costPerformance / 5) * 100 + '%' }">
                    </div>
                  </div>
                  <span class="rating-value">{{ restaurant.ratings.costPerformance }}</span>
                </div>
              </div>
            </div>

            <!-- 联系信息 -->
            <div class="contact-info">
              <div class="contact-item">
                <van-icon name="location-o" size="16" />
                <span>{{ restaurant.address }}</span>
              </div>
              <div class="contact-item">
                <van-icon name="phone-o" size="16" />
                <span>{{ restaurant.phone }}</span>
              </div>
              <div class="contact-item">
                <van-icon name="clock-o" size="16" />
                <span>{{ restaurant.businessHours }}</span>
              </div>
            </div>
            <div class="merchant-comments">
              <h3 class="comments-title">商家评论</h3>
              <div class="comment-list">
                <div class="comment-item" v-for="comment in restaurant.merchantComments" :key="comment.time">
                  <div class="comment-header">
                    <div class="comment-avatar">
                      <van-icon name="user-o" size="24" color="#1989fa" />
                    </div>
                    <div class="comment-info">
                      <div class="comment-user">{{ comment.user }}</div>
                      <div class="comment-rating">
                        <van-icon name="star" color="#ffd100" size="14" />
                        <span>{{ comment.rating }}</span>
                      </div>
                    </div>
                  </div>
                  <p class="comment-content">{{ comment.content }}</p>
                  <span class="comment-time">{{ comment.time }}</span>
                </div>
              </div>
            </div>
          </div>
        </van-tab>
      </van-tabs>
    </div>

    <!-- 加载状态 -->
    <div class="loading-overlay" v-if="loading">
      <van-loading type="spinner" size="40px" vertical>加载中...</van-loading>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getRestaurantById } from '../api/restaurant'
import { showToast } from 'vant'

const route = useRoute()
const router = useRouter()
const restaurantId = route.params.id

const activeTab = ref('dishes')
const imageHeight = ref(250)
const loading = ref(true)

// 图片处理相关
const imageBaseURL = import.meta.env?.VITE_API_BASE_URL || ''
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

// 门店数据（从接口获取）
const restaurant = ref({
  id: '',
  image: '',
  name: '',
  desc: '',
  rating: 0,
  price: 0,
  distance: 0,
  businessHours: '',
  address: '',
  phone: '',
  ratings: { flavor: 0, environment: 0, service: 0, costPerformance: 0 },
  dishes: [],
  merchantComments: []
})

// 返回上一页
const goBack = () => {
  router.back()
}

// 处理滚动事件
const handleScroll = () => {
  // 可在此实现顶部图片动态缩放等交互效果
}

const goToDishDetail = (dishId) => {
  router.push({ path: `/dish/${restaurantId}/${dishId}` })
}

// 获取餐厅详情
const fetchRestaurantDetail = async () => {
  loading.value = true
  try {
    const result = await getRestaurantById(restaurantId)
    console.log('getRestaurantDetail 返回结果:', result)

    let detailData = null

    // 处理不同的返回格式
    if (result && typeof result === 'object') {
      if (result.data) {
        detailData = result.data
      } else if (result.record) {
        detailData = result.record
      } else if (result.detail) {
        detailData = result.detail
      } else {
        detailData = result
      }
    }

    if (detailData) {
      // 确保必要字段存在，并补充默认值
      restaurant.value = {
        id: detailData.id || restaurantId,
        image: detailData.image || detailData.imageUrl || '',
        name: detailData.name || '未知餐厅',
        desc: detailData.description || detailData.desc || '暂无描述',
        rating: detailData.rating || 4.5,
        price: detailData.avgPrice || detailData.price || 0,
        distance: detailData.distance || (Math.random() * 3).toFixed(1),
        businessHours: detailData.businessHours || '10:00-22:00',
        address: detailData.address || '地址待补充',
        phone: detailData.phone || '联系电话待补充',
        ratings: {
          flavor: detailData.ratings?.flavor || 4.5,
          environment: detailData.ratings?.environment || 4.5,
          service: detailData.ratings?.service || 4.5,
          costPerformance: detailData.ratings?.costPerformance || 4.5
        },
        dishes: detailData.dishes || [],
        merchantComments: detailData.merchantComments || detailData.comments || []
      }
      console.log('成功加载餐厅详情:', restaurant.value)
    } else {
      showToast('获取餐厅详情失败')
    }
  } catch (error) {
    console.error('获取餐厅详情失败:', error)
    showToast('获取餐厅数据失败，请稍后重试')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchRestaurantDetail()
})
</script>

<style scoped>
.restaurant-detail {
  background-color: #f5f5f5;
  min-height: 100vh;
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

.top-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.restaurant-info {
  background-color: #fff;
  padding: 20px;
  margin-bottom: 10px;
}

.restaurant-name {
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin: 0 0 15px 0;
}

.restaurant-details {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.rating,
.price,
.distance {
  font-size: 14px;
  color: #666;
}

.price {
  color: #ff6b6b;
  font-weight: 500;
}

.description {
  font-size: 14px;
  color: #666;
  line-height: 1.4;
  margin-bottom: 15px;
}

.business-hours {
  font-size: 14px;
  color: #666;
  display: flex;
  align-items: center;
}

.business-hours span {
  margin-left: 5px;
}

.dish-list {
  background-color: #fff;
  padding: 20px;
  margin-bottom: 10px;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0 0 15px 0;
}

.dish-item {
  display: flex;
  padding: 15px 0;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;
}

.dish-item:last-child {
  border-bottom: none;
}

.dish-image {
  width: 80px;
  height: 80px;
  border-radius: 8px;
  object-fit: cover;
  margin-right: 15px;
}

.dish-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.dish-name {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0 0 5px 0;
}

.dish-flavor {
  font-size: 14px;
  color: #666;
  margin: 0 0 5px 0;
}

.dish-rating {
  font-size: 14px;
  color: #ffd100;
  margin: 0 0 5px 0;
}

.dish-price {
  font-size: 14px;
  color: #ff6b6b;
  font-weight: 500;
}

.merchant-detail {
  padding: 20px;
}

.ratings-chart {
  margin-bottom: 20px;
}

.rating-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  padding: 10px 0;
  border-bottom: 1px solid #f0f0f0;
}

.rating-label {
  font-size: 16px;
  color: #333;
  font-weight: 500;
  width: 80px;
}

.rating-bar-container {
  flex: 1;
  display: flex;
  align-items: center;
  margin: 0 15px;
}

.rating-bar {
  flex: 1;
  height: 12px;
  background-color: #f0f0f0;
  border-radius: 6px;
  overflow: hidden;
}

.rating-fill {
  height: 100%;
  background-color: #ffd100;
  border-radius: 6px;
  transition: width 0.3s ease;
}

.rating-value {
  font-size: 16px;
  color: #ffd100;
  font-weight: 600;
  min-width: 40px;
  text-align: right;
}

.contact-info {
  background-color: #fff;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.contact-item {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  font-size: 14px;
  color: #666;
}

.contact-item:last-child {
  margin-bottom: 0;
}

.contact-item van-icon {
  margin-right: 10px;
  color: #1989fa;
}

.merchant-comments {
  margin-bottom: 20px;
}

.comments-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 15px;
  color: #333;
}

.comment-list {
  background-color: #fff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.comment-item {
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid #f0f0f0;
}

.comment-item:last-child {
  margin-bottom: 0;
  padding-bottom: 0;
  border-bottom: none;
}

.comment-header {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.comment-avatar {
  width: 40px;
  height: 40px;
  background-color: #f5f5f5;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 15px;
}

.comment-info {
  flex: 1;
}

.comment-user {
  font-size: 16px;
  font-weight: 500;
  color: #333;
  margin-bottom: 5px;
}

.comment-rating {
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #666;
}

.comment-rating van-icon {
  margin-right: 5px;
  color: #ffd100;
}

.comment-content {
  font-size: 14px;
  color: #666;
  line-height: 1.6;
  margin-bottom: 10px;
  padding: 15px;
  background-color: #f5f5f5;
  border-radius: 8px;
}

.comment-time {
  font-size: 12px;
  color: #999;
}

.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}
</style>