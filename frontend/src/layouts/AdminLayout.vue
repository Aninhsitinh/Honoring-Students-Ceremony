<template>
  <div class="admin-layout">
    <AdminSidebar />
    <div class="admin-main">
      <header class="admin-header">
        <div class="admin-header-left">
          <button class="mobile-menu-btn" @click="toggleSidebar">
            <span></span><span></span><span></span>
          </button>
          <h2 class="page-title">{{ currentTitle }}</h2>
        </div>
        <div class="admin-header-right">
          <button class="lang-btn" @click="toggleLanguage">
            {{ currentLang === 'vi' ? 'EN' : 'VI' }}
          </button>
          <span class="admin-user">👤 {{ user?.username }}</span>
          <button class="btn btn-secondary btn-sm" @click="handleLogout">{{ $t('nav.logout') }}</button>
        </div>
      </header>
      <div class="admin-content">
        <router-view v-slot="{ Component }">
          <transition name="page" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '../stores/auth'
import AdminSidebar from '../components/admin/AdminSidebar.vue'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const { t: $t, locale } = useI18n()

const user = computed(() => authStore.user)
const currentTitle = computed(() => route.meta.title ? $t(route.meta.title) : $t('admin.dashboard'))
const currentLang = computed(() => locale.value)

function toggleLanguage() {
  locale.value = locale.value === 'vi' ? 'en' : 'vi'
  localStorage.setItem('lang', locale.value)
}

function toggleSidebar() {
  document.querySelector('.admin-sidebar')?.classList.toggle('open')
}

function handleLogout() {
  authStore.logout()
  router.push({ name: 'AdminLogin' })
}
</script>

<style scoped>
.admin-layout {
  display: flex;
  min-height: 100vh;
  background: var(--admin-bg);
}

.admin-main {
  flex: 1;
  margin-left: var(--admin-sidebar-width);
  display: flex;
  flex-direction: column;
}

.admin-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-4) var(--space-6);
  background: rgba(0, 0, 0, 0.3);
  border-bottom: 1px solid var(--admin-border);
  backdrop-filter: blur(10px);
  position: sticky;
  top: 0;
  z-index: var(--z-sticky);
}

.admin-header-left {
  display: flex;
  align-items: center;
  gap: var(--space-4);
}

.admin-header-right {
  display: flex;
  align-items: center;
  gap: var(--space-4);
}

.lang-btn {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: var(--color-text-primary);
  width: 32px;
  height: 32px;
  border-radius: 50%;
  font-size: var(--text-xs);
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: var(--transition-normal);
}

.lang-btn:hover {
  background: var(--color-primary);
  border-color: var(--color-primary);
  transform: translateY(-2px);
}

.page-title {
  font-size: var(--text-xl);
  font-weight: 600;
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.admin-user {
  color: var(--color-text-secondary);
  font-size: var(--text-sm);
}

.admin-content {
  flex: 1;
  padding: var(--space-6);
}

.mobile-menu-btn {
  display: none;
  flex-direction: column;
  gap: 4px;
  background: none;
  padding: var(--space-2);
}

.mobile-menu-btn span {
  display: block;
  width: 20px;
  height: 2px;
  background: var(--color-text-primary);
  border-radius: 2px;
  transition: var(--transition-fast);
}

@media (max-width: 768px) {
  .admin-main {
    margin-left: 0;
  }

  .mobile-menu-btn {
    display: flex;
  }

  .admin-content {
    padding: var(--space-4);
  }
}
</style>
