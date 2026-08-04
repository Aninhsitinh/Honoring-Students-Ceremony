<template>
  <div class="login-page">
    <div class="login-container animate-scale-in">
      <div class="login-header">
        <span class="login-icon">🔐</span>
        <h1 class="gradient-text">{{ $t('admin.login_title') }}</h1>
        <p>{{ $t('admin.login_desc') }}</p>
      </div>

      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <label class="form-label">{{ $t('admin.username') }}</label>
          <input
            v-model="username"
            type="text"
            class="form-input"
            :placeholder="$t('admin.username_placeholder')"
            required
            autocomplete="username"
          />
        </div>

        <div class="form-group">
          <label class="form-label">{{ $t('admin.password') }}</label>
          <input
            v-model="password"
            type="password"
            class="form-input"
            :placeholder="$t('admin.password_placeholder')"
            required
            autocomplete="current-password"
          />
        </div>

        <div v-if="error" class="error-message">{{ error }}</div>

        <button type="submit" class="btn btn-primary btn-lg" :disabled="loading" style="width: 100%;">
          {{ loading ? $t('admin.logging_in') : $t('admin.login_btn') }}
        </button>
      </form>

      <router-link to="/" class="back-home">← {{ $t('admin.back_home') }}</router-link>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const username = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

async function handleLogin() {
  error.value = ''
  loading.value = true
  try {
    await authStore.login(username.value, password.value)
    router.push({ name: 'Dashboard' })
  } catch (err) {
    error.value = err.response?.data?.message || 'Login failed'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--gradient-hero);
  padding: var(--space-6);
}

.login-container {
  width: 100%;
  max-width: 420px;
  background: var(--color-bg-glass-strong);
  backdrop-filter: blur(20px);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  padding: var(--space-10);
}

.login-header {
  text-align: center;
  margin-bottom: var(--space-8);
}

.login-icon {
  font-size: 3rem;
  display: block;
  margin-bottom: var(--space-4);
}

.login-header h1 {
  font-size: var(--text-2xl);
  font-weight: 800;
  margin-bottom: var(--space-2);
}

.login-header p {
  color: var(--color-text-muted);
  font-size: var(--text-sm);
}

.error-message {
  padding: var(--space-3) var(--space-4);
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: var(--radius-md);
  color: #f87171;
  font-size: var(--text-sm);
  margin-bottom: var(--space-4);
}

.back-home {
  display: block;
  text-align: center;
  margin-top: var(--space-6);
  color: var(--color-text-muted);
  font-size: var(--text-sm);
  text-decoration: none;
}

.back-home:hover {
  color: var(--color-text-accent);
}
</style>
