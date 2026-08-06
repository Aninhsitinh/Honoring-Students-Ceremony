<template>
  <transition name="toast-fade">
    <div v-if="toastState.visible" class="toast-notification" :class="toastState.type">
      <span class="icon" v-html="icon"></span>
      <span class="message">{{ toastState.message }}</span>
      <button class="close-btn" @click="toastState.visible = false" v-html="xIcon"></button>
    </div>
  </transition>
</template>

<script setup>
import { computed } from 'vue'
import { toastState } from '../../utils/toast'
import icons from '../../utils/icons'

const xIcon = icons.x

const icon = computed(() => {
  switch (toastState.type) {
    case 'success': return icons.checkCircle
    case 'error': return icons.alertCircle
    case 'warning': return icons.alertCircle
    default: return icons.info || icons.checkCircle
  }
})
</script>

<style scoped>
.toast-notification {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 99999;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 20px;
  border-radius: 8px;
  color: #fff;
  font-weight: 500;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  min-width: 300px;
  max-width: 400px;
}

.toast-notification.success { background: #10B981; }
.toast-notification.error { background: #EF4444; }
.toast-notification.warning { background: #F59E0B; }
.toast-notification.info { background: #3B82F6; }

.message { flex: 1; }

.close-btn {
  background: none;
  border: none;
  color: rgba(255,255,255,0.7);
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}
.close-btn:hover { color: #fff; }

.toast-fade-enter-active,
.toast-fade-leave-active {
  transition: all 0.3s ease;
}
.toast-fade-enter-from,
.toast-fade-leave-to {
  opacity: 0;
  transform: translateY(-20px) translateX(20px);
}
</style>
