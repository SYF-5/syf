<template>
  <div class="evaluation">
    <!-- 返回按钮 -->
    <div class="back-button" @click="goBack">
      <van-icon name="arrow-left" size="24" color="#fff" />
    </div>

    <div class="evaluation-header">
      <h1 class="title">菜品评价</h1>
    </div>

    <div class="evaluation-content">
      <!-- 菜品信息 -->
      <div class="dish-info">
        <img :src="dish.image" alt="菜品图片" />
        <div class="dish-details">
          <h2 class="dish-name">{{ dish.name }}</h2>
          <p class="dish-flavor">口味: {{ dish.flavor }}</p>
        </div>
      </div>

      <!-- 评分选择 -->
      <div class="rating-section">
        <h3 class="section-title">请为菜品评分</h3>
        <div class="star-rating">
          <van-icon
            v-for="(star, index) in 5"
            :key="index"
            :name="index < selectedRating ? 'star' : 'star-o'"
            :color="index < selectedRating ? '#ffd100' : '#ccc'"
            size="32"
            @click="selectRating(index + 1)"
          />
        </div>
        <p class="rating-text">{{ ratingText }}</p>
      </div>

      <!-- 评价内容 -->
      <div class="comment-section">
        <h3 class="section-title">评价内容</h3>
        <van-field
          v-model="comment"
          type="textarea"
          placeholder="请输入您的评价"
          rows="4"
        />
      </div>

      <!-- 提交按钮 -->
      <div class="submit-section">
        <van-button type="primary" round block size="large" @click="submitEvaluation" :disabled="selectedRating === 0">
          提交评价
        </van-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { showToast, showSuccessToast } from 'vant'

const route = useRoute()
const router = useRouter()
const restaurantId = route.params.restaurantId
const dishId = route.params.dishId

// 模拟菜品数据
const dish = ref({
  id: 1,
  image: 'https://img.yzcdn.cn/vant/cat.jpeg',
  name: '麻辣锅底',
  flavor: '麻辣鲜香',
  rating: 4.9,
  price: 88
})

const selectedRating = ref(0)
const comment = ref('')

const ratingTexts = ['很差', '较差', '一般', '较好', '很好']

const ratingText = ref('')

const selectRating = (rating) => {
  selectedRating.value = rating
  ratingText.value = ratingTexts[rating - 1]
}

const submitEvaluation = () => {
  if (selectedRating.value === 0) {
    showToast('请先为菜品评分')
    return
  }
  if (!comment.value) {
    showToast('请输入评价内容')
    return
  }

  // 模拟提交评价
  showSuccessToast('评价提交成功')
  setTimeout(() => {
    router.back()
  }, 1500)
}

const goBack = () => {
  router.back()
}

onMounted(() => {
  // 根据dishId获取菜品数据
  // 这里可以添加实际的API调用
})
</script>

<style scoped>
.evaluation {
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

.evaluation-header {
  display: flex;
  align-items: center;
  padding: 15px;
  background-color: #fff;
  border-bottom: 1px solid #f0f0f0;
}

.evaluation-header .van-icon {
  font-size: 24px;
  color: #333;
  margin-right: 15px;
}

.title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.evaluation-content {
  padding: 20px;
}

.dish-info {
  display: flex;
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.dish-info img {
  width: 100px;
  height: 100px;
  border-radius: 8px;
  object-fit: cover;
  margin-right: 20px;
}

.dish-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.dish-name {
  font-size: 20px;
  font-weight: 600;
  color: #333;
  margin: 0 0 10px 0;
}

.dish-flavor {
  font-size: 14px;
  color: #666;
  margin: 0;
}

.rating-section {
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0 0 15px 0;
}

.star-rating {
  display: flex;
  justify-content: center;
  margin-bottom: 15px;
}

.star-rating .van-icon {
  margin: 0 5px;
  cursor: pointer;
}

.rating-text {
  text-align: center;
  font-size: 14px;
  color: #666;
  margin: 0;
}

.comment-section {
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.submit-section {
  margin-top: 20px;
}
</style>