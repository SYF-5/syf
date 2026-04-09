<template>
  <div class="dish-detail">
    <!-- 返回按钮 -->
    <div class="back-button" @click="goBack">
      <van-icon name="arrow-left" size="24" color="#fff" />
    </div>

    <div class="dish-info">
      <img :src="getImageUrl(dish.image)" alt="菜品图片" @error="handleImageError" />
      <div class="dish-details">
        <h1 class="dish-name">{{ dish.name }}</h1>
        <div class="dish-rating">
          <van-icon name="star" color="#ffd100" size="16" />
          <span>{{ dish.rating }}</span>
        </div>
        <div class="dish-flavor">口味: {{ dish.flavor }}</div>
        <div class="dish-price">¥{{ dish.price }}</div>
      </div>
    </div>

    <div class="comments-section">
      <h2 class="section-title">用户评论</h2>
      <div class="comment-item" v-for="comment in dish.comments" :key="comment.time">
        <div class="comment-header">
          <span class="comment-user">{{ comment.user }}</span>
          <div class="comment-rating">
            <van-icon name="star" color="#ffd100" size="14" />
            <span>{{ comment.rating }}</span>
          </div>
        </div>
        <p class="comment-content">{{ comment.content }}</p>
        <span class="comment-time">{{ comment.time }}</span>
      </div>
      <div v-if="dish.comments.length === 0" class="no-comments">
        暂无评论，快来发表第一条评论吧！
      </div>
    </div>

    <div class="evaluation-section">
      <van-button type="primary" round block size="large" @click="goToEvaluation">
        评价菜品
      </van-button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getDishById } from '../api/dish'
import { showToast } from 'vant'

const route = useRoute()
const router = useRouter()
const restaurantId = route.params.restaurantId
const dishId = route.params.dishId

// 返回上一页
const goBack = () => {
  router.back()
}

const loading = ref(false)

// 菜品数据
const dish = ref({
  id: 1,
  image: '',
  name: '',
  flavor: '',
  rating: 4.5,
  price: 0,
  comments: []
})

// 图片处理
const placeholderImage = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"%3E%3Crect width="100" height="100" fill="%23f5f5f5"/%3E%3Ctext x="50" y="50" font-size="12" text-anchor="middle" dy=".3em" fill="%23999"%3E暂无图片%3C/text%3E%3C/svg%3E'

const getImageUrl = (url) => {
  if (!url) return placeholderImage
  if (url.startsWith('http://') || url.startsWith('https://')) return url
  return `https://th.bing.com/th/id/OIP.${url}`
}

const handleImageError = (e) => {
  if (e.target.src === placeholderImage) return
  e.target.src = placeholderImage
}

const fetchDishDetail = async () => {
  try {
    const result = await getDishById(dishId)
    console.log('获取到的菜品数据:', result)
    
    let dishData = null
    if (result && typeof result === 'object') {
      if (result.data) {
        dishData = result.data
      } else {
        dishData = result
      }
    }
    
    if (dishData) {
      dish.value = {
        id: dishData.id || dishId,
        image: dishData.imageUrl || '',
        name: dishData.name || '未知菜品',
        flavor: dishData.description || '暂无描述',
        rating: dishData.rating || 4.5,
        price: dishData.price || 0,
        comments: dishData.comments || []
      }

    } else {
      showToast('获取菜品详情失败')
    }
  } catch (error) {
    console.error('获取菜品详情失败:', error)
    showToast('获取菜品数据失败，请稍后重试')
  }
}

const goToEvaluation = () => {
  router.push({ path: `/evaluation/${restaurantId}/${dishId}` })
}

onMounted(() => {
  fetchDishDetail()
})
</script>

<style scoped>
.dish-detail {
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

.dish-info {
  background-color: #fff;
  padding: 20px;
  margin-bottom: 20px;
}

.dish-info img {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 20px;
}

.dish-details {
  display: flex;
  flex-direction: column;
}

.dish-name {
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin: 0 0 15px 0;
}

.dish-rating {
  font-size: 14px;
  color: #ffd100;
  margin-bottom: 10px;
}

.dish-flavor {
  font-size: 14px;
  color: #666;
  margin-bottom: 10px;
}

.dish-price {
  font-size: 18px;
  color: #ff6b6b;
  font-weight: 600;
  margin-bottom: 10px;
}

.comments-section {
  background-color: #fff;
  padding: 20px;
  margin-bottom: 20px;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0 0 20px 0;
}

.comment-item {
  border-bottom: 1px solid #f0f0f0;
  padding: 15px 0;
}

.comment-item:last-child {
  border-bottom: none;
}

.comment-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.comment-user {
  font-size: 14px;
  color: #333;
  font-weight: 600;
}

.comment-rating {
  font-size: 14px;
  color: #ffd100;
}

.comment-content {
  font-size: 14px;
  color: #666;
  line-height: 1.4;
  margin-bottom: 10px;
}

.comment-time {
  font-size: 12px;
  color: #999;
}

.no-comments {
  text-align: center;
  font-size: 14px;
  color: #999;
  padding: 20px;
}

.evaluation-section {
  padding: 20px;
}

.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 500px;
}
</style>