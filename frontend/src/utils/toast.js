import { reactive } from 'vue'

export const toastState = reactive({
  visible: false,
  message: '',
  type: 'success', // 'success', 'error', 'info', 'warning'
})

let timeoutId = null

export const toast = {
  show(message, type = 'success', duration = 3000) {
    toastState.message = message
    toastState.type = type
    toastState.visible = true
    
    if (timeoutId) clearTimeout(timeoutId)
    timeoutId = setTimeout(() => {
      toastState.visible = false
    }, duration)
  },
  success(msg) { this.show(msg, 'success') },
  error(msg) { this.show(msg, 'error') },
  info(msg) { this.show(msg, 'info') },
  warning(msg) { this.show(msg, 'warning') }
}
