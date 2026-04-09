import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createRouter, createWebHashHistory } from 'vue-router'
import 'vant/lib/index.css'
import './style.css'
import App from './App.vue'
import Login from './views/Login.vue'
import Register from './views/Register.vue'
import Home from './views/Home.vue'
import RestaurantDetail from './views/RestaurantDetail.vue'
import DishDetail from './views/DishDetail.vue'
import Evaluation from './views/Evaluation.vue'
import UserHome from './views/UserHome.vue'
import MerchantHome from './views/MerchantHome.vue'

const app = createApp(App)
const pinia = createPinia()

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  { path: '/register', component: Register },
  { path: '/home', component: Home },
  { path: '/restaurant/:id', component: RestaurantDetail },
  { path: '/dish/:restaurantId/:dishId', component: DishDetail },
  { path: '/evaluation/:restaurantId/:dishId', component: Evaluation },
  { path: '/user-home', component: UserHome },
  { path: '/merchant-home', component: MerchantHome }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

app.use(pinia)
app.use(router)
app.mount('#app')
