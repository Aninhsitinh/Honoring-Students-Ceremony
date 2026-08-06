<template>
  <teleport to="body">
    <transition name="confirm-fade">
      <div v-if="confirmState.visible" class="confirm-backdrop" @click.self="_resolve(false)">
        <div class="confirm-dialog animate-scale-in" role="dialog" aria-modal="true">
          <!-- Icon -->
          <div class="confirm-icon-wrap" :class="confirmState.type">
            <span class="confirm-icon" v-html="icon"></span>
          </div>

          <!-- Content -->
          <div class="confirm-body">
            <h3 class="confirm-title">{{ confirmState.title }}</h3>
            <p class="confirm-message">{{ confirmState.message }}</p>
          </div>

          <!-- Actions -->
          <div class="confirm-actions">
            <button class="btn btn-secondary" @click="_resolve(false)">
              {{ confirmState.cancelText }}
            </button>
            <button class="btn" :class="confirmBtnClass" @click="_resolve(true)">
              {{ confirmState.confirmText }}
            </button>
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script setup>
import { computed } from 'vue'
import { confirmState, _resolve } from '../../utils/confirm'
import icons from '../../utils/icons'

const icon = computed(() => {
  switch (confirmState.type) {
    case 'danger': return icons.alertCircle
    case 'warning': return icons.alertCircle
    default: return icons.info || icons.checkCircle
  }
})

const confirmBtnClass = computed(() => {
  switch (confirmState.type) {
    case 'danger': return 'btn-danger'
    case 'warning': return 'btn-warning'
    default: return 'btn-primary'
  }
})
</script>

<style scoped>
.confirm-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.65);
  backdrop-filter: blur(6px);
  z-index: 99999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.confirm-dialog {
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  border-radius: 1.25rem;
  padding: 2rem;
  width: 100%;
  max-width: 420px;
  text-align: center;
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.4);
}

/* Icon */
.confirm-icon-wrap {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.25rem;
}

.confirm-icon-wrap.danger {
  background: rgba(220, 38, 38, 0.12);
  color: #ef4444;
}

.confirm-icon-wrap.warning {
  background: rgba(245, 158, 11, 0.12);
  color: #f59e0b;
}

.confirm-icon-wrap.info {
  background: rgba(58, 191, 240, 0.12);
  color: #3abff0;
}

.confirm-icon {
  display: flex;
  align-items: center;
  justify-content: center;
}

:deep(.confirm-icon svg) {
  width: 32px;
  height: 32px;
}

/* Body */
.confirm-body {
  margin-bottom: 1.75rem;
}

.confirm-title {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--color-text-primary);
  margin-bottom: 0.5rem;
}

.confirm-message {
  font-size: 0.9375rem;
  color: var(--color-text-secondary);
  line-height: 1.6;
}

/* Actions */
.confirm-actions {
  display: flex;
  gap: 0.75rem;
  justify-content: center;
}

.confirm-actions .btn {
  flex: 1;
  max-width: 160px;
}

/* btn-warning variant */
.btn-warning {
  background: linear-gradient(135deg, #f59e0b, #d97706);
  color: #fff;
}

.btn-warning:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
}

/* Transition */
.confirm-fade-enter-active,
.confirm-fade-leave-active {
  transition: opacity 0.2s ease;
}
.confirm-fade-enter-from,
.confirm-fade-leave-to {
  opacity: 0;
}
</style>
