import { reactive } from 'vue'

/**
 * Global confirm dialog state.
 * Works like a Promise-based replacement for window.confirm().
 *
 * Usage:
 *   import { useConfirm } from '@/utils/confirm'
 *   const { confirm } = useConfirm()
 *   const ok = await confirm('Bạn có chắc chắn muốn xóa?')
 *   if (ok) { ... }
 */

export const confirmState = reactive({
  visible: false,
  title: '',
  message: '',
  confirmText: 'Xác nhận',
  cancelText: 'Hủy',
  type: 'danger', // 'danger' | 'warning' | 'info'
  resolve: null,
})

export function useConfirm() {
  function confirm(message, { title = 'Xác nhận thao tác', confirmText = 'Xác nhận', cancelText = 'Hủy', type = 'danger' } = {}) {
    return new Promise((resolve) => {
      confirmState.visible = true
      confirmState.title = title
      confirmState.message = message
      confirmState.confirmText = confirmText
      confirmState.cancelText = cancelText
      confirmState.type = type
      confirmState.resolve = resolve
    })
  }

  return { confirm }
}

// Internal: called by ConfirmDialog component
export function _resolve(value) {
  if (confirmState.resolve) {
    confirmState.resolve(value)
    confirmState.resolve = null
  }
  confirmState.visible = false
}
