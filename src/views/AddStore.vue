<template>
  <div class="add-store-container">
    <!-- 顶部导航栏 -->
    <div class="nav-bar">
      <div class="back-button" @click="goBack">
        <van-icon name="arrow-left" size="24" color="#333" />
      </div>
      <h1 class="nav-title">添加门店</h1>
      <div class="nav-right">
        <div class="save-button" @click="handleSave">
          <span>保存</span>
        </div>
      </div>
    </div>

    <!-- 表单内容 -->
    <div class="form-container">
      <!-- 门店图片 -->
      <div class="form-item">
        <label class="form-label">门店图片</label>
        <div class="image-upload">
          <div class="upload-area" @click="triggerImageUpload">
            <img v-if="formData.imageUrl" :src="formData.imageUrl" alt="门店图片" class="uploaded-image" />
            <div v-else class="upload-placeholder">
              <van-icon name="photograph" size="48" color="#ccc" />
              <span>点击上传图片</span>
            </div>
          </div>
          <input ref="fileInput" type="file" accept="image/*" style="display: none" @change="handleFileChange" />
        </div>
      </div>

      <!-- 门店名称 -->
      <div class="form-item">
        <label class="form-label">门店名称</label>
        <van-field v-model="formData.name" placeholder="请输入门店名称" clearable />
      </div>

      <!-- 门店描述 -->
      <div class="form-item">
        <label class="form-label">门店描述</label>
        <van-field v-model="formData.description" type="textarea" placeholder="请输入门店描述" :rows="3" maxlength="200"
          show-word-limit />
      </div>

      <!-- 人均价格 -->
      <div class="form-item">
        <label class="form-label">人均价格</label>
        <van-field v-model="formData.avgPrice" type="number" placeholder="请输入人均价格" clearable>
          <template #right-icon>
            <span style="color: #999">元</span>
          </template>
        </van-field>
      </div>

      <!-- 营业时间 -->
      <div class="form-item">
        <label class="form-label">营业时间</label>
        <van-field v-model="formData.businessHours" placeholder="例如：10:00-22:00" clearable />
      </div>

      <!-- 联系电话 -->
      <div class="form-item">
        <label class="form-label">联系电话</label>
        <van-field v-model="formData.phone" type="tel" placeholder="请输入联系电话" clearable />
      </div>

      <!-- 地址 -->
      <div class="form-item">
        <label class="form-label">地址</label>
        <van-field v-model="formData.address" type="textarea" placeholder="请输入门店地址" :rows="2" clearable />
      </div>

      <!-- 门店分类 -->
      <div class="form-item">
        <label class="form-label">门店分类</label>
        <van-field v-model="selectedCategoryName" readonly is-link placeholder="请选择门店分类"
          @click="showCategoryPicker = true" />
      </div>
    </div>

    <!-- 分类选择弹窗 -->
    <van-popup v-model:show="showCategoryPicker" round position="bottom">
      <van-picker :columns="categoryOptions" :default-index="selectedIndex" @confirm="onCategoryConfirm"
        @cancel="showCategoryPicker = false" />
    </van-popup>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter, onBeforeRouteLeave } from 'vue-router'   // ✅ 关键修改
import { showToast, showConfirmDialog, showLoadingToast, closeToast } from 'vant'

const router = useRouter()

// 表单数据
const formData = ref({
  name: '',
  imageUrl: '',
  description: '',
  avgPrice: null,
  businessHours: '',
  phone: '',
  address: '',
  categoryCode: null
})

// 原始数据快照
const originalData = ref({ ...formData.value })

// 分类选项
const categoryOptions = [
  { text: '火锅', value: 1 },
  { text: '中餐', value: 2 },
  { text: '西餐', value: 3 },
  { text: '甜品', value: 4 },
  { text: '饮品', value: 5 },
  { text: '快餐', value: 6 }
]

// UI 状态
const showCategoryPicker = ref(false)
const fileInput = ref(null)
const isSaving = ref(false)

// 当前选中的分类名称
const selectedCategoryName = computed(() => {
  if (!formData.value.categoryCode) return ''
  const category = categoryOptions.find(item => item.value === formData.value.categoryCode)
  return category ? category.text : ''
})

// 当前选中分类的索引
const selectedIndex = computed(() => {
  if (!formData.value.categoryCode) return 0
  const index = categoryOptions.findIndex(item => item.value === formData.value.categoryCode)
  return index !== -1 ? index : 0
})

// 判断表单是否被修改
const isFormModified = computed(() => {
  return JSON.stringify(formData.value) !== JSON.stringify(originalData.value)
})

// 图片上传
const triggerImageUpload = () => {
  fileInput.value?.click()
}

const handleFileChange = async (event) => {
  const file = event.target.files[0]
  if (!file) return

  if (!file.type.startsWith('image/')) {
    showToast('请上传图片文件')
    return
  }
  if (file.size > 5 * 1024 * 1024) {
    showToast('图片大小不能超过 5MB')
    return
  }

  // 本地预览
  const reader = new FileReader()
  reader.onload = (e) => {
    formData.value.imageUrl = e.target.result
  }
  reader.readAsDataURL(file)

  // 模拟上传
  const toast = showLoadingToast({ message: '上传中...', forbidClick: true })
  try {
    await new Promise(resolve => setTimeout(resolve, 800))
    closeToast()
    showToast('上传成功')
  } catch (error) {
    closeToast()
    showToast('上传失败，请重试')
    formData.value.imageUrl = ''
  } finally {
    event.target.value = ''
  }
}

// 分类选择确认
const onCategoryConfirm = ({ selectedOptions }) => {
  const selected = selectedOptions[0]
  formData.value.categoryCode = selected.value
  showCategoryPicker.value = false
}

// 表单验证
const validateForm = () => {
  if (!formData.value.name?.trim()) {
    showToast('请输入门店名称')
    return false
  }
  if (!formData.value.description?.trim()) {
    showToast('请输入门店描述')
    return false
  }
  const price = parseFloat(formData.value.avgPrice)
  if (isNaN(price) || price <= 0) {
    showToast('请输入有效的人均价格')
    return false
  }
  if (!formData.value.businessHours?.trim()) {
    showToast('请输入营业时间')
    return false
  }
  const phoneReg = /^1[3-9]\d{9}$|^0\d{2,3}-?\d{7,8}$/
  if (!formData.value.phone?.trim()) {
    showToast('请输入联系电话')
    return false
  }
  if (!phoneReg.test(formData.value.phone.trim())) {
    showToast('请输入正确的联系电话')
    return false
  }
  if (!formData.value.address?.trim()) {
    showToast('请输入门店地址')
    return false
  }
  if (!formData.value.categoryCode) {
    showToast('请选择门店分类')
    return false
  }
  return true
}

// 保存门店
const handleSave = async () => {
  if (!validateForm()) return
  if (isSaving.value) return

  try {
    await showConfirmDialog({
      title: '确认保存',
      message: '确定要保存门店信息吗？',
      confirmButtonText: '确定',
      cancelButtonText: '取消'
    })

    isSaving.value = true
    const toast = showLoadingToast({ message: '保存中...', forbidClick: true })

    await new Promise(resolve => setTimeout(resolve, 1000))

    closeToast()
    showToast('保存成功')
    originalData.value = { ...formData.value }
    router.push('/my-stores')
  } catch (error) {
    if (error !== 'cancel') {
      closeToast()
      showToast('保存失败，请重试')
    }
  } finally {
    isSaving.value = false
  }
}

// 返回拦截
const goBack = () => {
  if (isFormModified.value) {
    showConfirmDialog({
      title: '提示',
      message: '信息未保存，确定要离开吗？',
      confirmButtonText: '离开',
      cancelButtonText: '继续编辑'
    }).then(() => {
      router.back()
    }).catch(() => { })
  } else {
    router.back()
  }
}

// 路由离开守卫
onBeforeRouteLeave((to, from, next) => {
  if (isFormModified.value) {
    showConfirmDialog({
      title: '提示',
      message: '信息未保存，确定要离开吗？',
      confirmButtonText: '离开',
      cancelButtonText: '继续编辑'
    }).then(() => {
      next()
    }).catch(() => {
      next(false)
    })
  } else {
    next()
  }
})
</script>

<style scoped>
.add-store-container {
  background-color: #f5f5f5;
  min-height: 100vh;
  padding-bottom: 20px;
}

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

.back-button:active {
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
  text-align: right;
}

.save-button {
  cursor: pointer;
  color: #1989fa;
  font-weight: 500;
  padding: 8px 12px;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.save-button:active {
  background-color: #f0f9ff;
}

.form-container {
  background-color: #fff;
  margin: 16px;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.form-item {
  margin-bottom: 24px;
}

.form-label {
  display: block;
  font-size: 16px;
  font-weight: 500;
  color: #333;
  margin-bottom: 8px;
}

.image-upload {
  margin-bottom: 16px;
}

.upload-area {
  width: 100%;
  height: 180px;
  border: 1px dashed #d9d9d9;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  overflow: hidden;
  background-color: #fafafa;
}

.upload-area:active {
  border-color: #1989fa;
  background-color: #f0f9ff;
}

.upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #999;
}

.upload-placeholder span {
  margin-top: 12px;
  font-size: 14px;
}

.uploaded-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

@media (max-width: 768px) {
  .nav-bar {
    padding: 0 16px;
  }

  .form-container {
    margin: 12px;
    padding: 16px;
  }

  .form-item {
    margin-bottom: 20px;
  }

  .form-label {
    font-size: 15px;
  }

  .upload-area {
    height: 150px;
  }
}
</style>