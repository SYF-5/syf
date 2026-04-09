<template>
  <div class="restaurant-detail" @scroll="handleScroll">
    <!-- 返回按钮 -->
    <div class="back-button" @click="goBack">
      <van-icon name="arrow-left" size="24" color="#fff" />
    </div>

    <!-- 顶部图片 -->
    <div class="top-image" :style="{ height: imageHeight + 'px' }">
      <img :src="restaurant.image" alt="门店图片" />
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
              <img :src="dish.image" alt="菜品图片" class="dish-image" />
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
                    <div class="rating-fill" :style="{ width: (restaurant.ratings.costPerformance / 5) * 100 + '%' }"></div>
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
                <span>13800138000</span>
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
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const restaurantId = route.params.id

// 返回上一页
const goBack = () => {
  router.back()
}
const activeTab = ref('dishes')
const imageHeight = ref(250)

// 处理滚动事件
const handleScroll = () => {
  // 可在此实现顶部图片动态缩放等交互效果
}

// 模拟门店数据
const restaurant = ref({
  id: 1,
  image: 'https://img.yzcdn.cn/vant/cat.jpeg',
  name: '海底捞火锅',
  desc: '正宗川味火锅，麻辣鲜香',
  rating: 4.8,
  price: 150,
  distance: 1.2,
  businessHours: '10:00-22:00',
  address: '北京市朝阳区建国路88号',
  ratings: { flavor: 4.7, environment: 4.6, service: 4.9, costPerformance: 4.5 },
  dishes: [
    { id: 1, image: 'https://img.yzcdn.cn/vant/cat.jpeg', name: '麻辣锅底', flavor: '麻辣鲜香', rating: 4.9, price: 88, comments: [
      { user: '张三', content: '非常好吃，麻辣够味', rating: 5, time: '2026-04-01' },
      { user: '李四', content: '味道不错，推荐', rating: 4, time: '2026-04-02' }
    ] },
    { id: 2, image: 'https://img.yzcdn.cn/vant/cat.jpeg', name: '精品肥牛', flavor: '鲜嫩多汁', rating: 4.8, price: 68, comments: [
      { user: '王五', content: '肉质鲜嫩，口感很好', rating: 5, time: '2026-04-01' }
    ] },
    { id: 3, image: 'https://img.yzcdn.cn/vant/cat.jpeg', name: '新鲜毛肚', flavor: '脆爽可口', rating: 4.7, price: 58, comments: [] },
    { id: 4, image: 'https://img.yzcdn.cn/vant/cat.jpeg', name: '手工虾滑', flavor: 'Q弹鲜美', rating: 4.6, price: 48, comments: [] }
  ],
  merchantComments: [
    { user: '赵六', content: '环境很好，服务周到', rating: 5, time: '2026-04-01' },
    { user: '孙七', content: '味道不错，性价比高', rating: 4, time: '2026-04-02' }
  ]
})

const goToDishDetail = (dishId) => {
  router.push({ path: `/dish/${restaurantId}/${dishId}` })
}


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

.rating, .price, .distance {
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


</style>