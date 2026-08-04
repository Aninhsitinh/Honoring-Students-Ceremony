<template>
  <aside class="admin-sidebar" :class="{ open: isOpen }">
    <div class="sidebar-header">
      <router-link to="/admin" class="sidebar-brand">
        <img :src="logoSrc" alt="Logo" class="brand-logo" />
        <span class="brand-text gradient-text">Admin Panel</span>
      </router-link>
    </div>

    <nav class="sidebar-nav">
      <router-link to="/admin" class="nav-item" exact-active-class="active" @click="close">
        <span class="nav-icon">📊</span>
        <span>Dashboard</span>
      </router-link>
      <router-link to="/admin/students" class="nav-item" active-class="active" @click="close">
        <span class="nav-icon">👨‍🎓</span>
        <span>Sinh Viên</span>
      </router-link>
      <router-link to="/admin/top-scores" class="nav-item" active-class="active" @click="close">
        <span class="nav-icon">⭐</span>
        <span>Điểm Cao</span>
      </router-link>
      <router-link to="/admin/posts" class="nav-item" active-class="active" @click="close">
        <span class="nav-icon">📝</span>
        <span>Bài Viết</span>
      </router-link>
      <router-link to="/admin/semesters" class="nav-item" active-class="active" @click="close">
        <span class="nav-icon">📅</span>
        <span>Kỳ Học</span>
      </router-link>
    </nav>

    <div class="sidebar-footer">
      <router-link to="/" class="nav-item" target="_blank">
        <span class="nav-icon">🌐</span>
        <span>Xem Trang Chủ</span>
      </router-link>
    </div>
  </aside>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useDark } from '@vueuse/core'
import logoLight from '../../assets/logo_light-Cvl1LvYU.png'
import logoDark from '../../assets/logo_dark-nY9adEwT.png'

const isDark = useDark({ valueDark: 'dark', valueLight: 'light' })
const logoSrc = computed(() => isDark.value ? logoDark : logoLight)

const isOpen = ref(false)

function close() {
  isOpen.value = false
  document.querySelector('.admin-sidebar')?.classList.remove('open')
}
</script>

<style scoped>
.admin-sidebar {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  width: var(--admin-sidebar-width);
  background: var(--admin-sidebar-bg);
  border-right: 1px solid var(--admin-border);
  display: flex;
  flex-direction: column;
  z-index: var(--z-sticky);
  transition: transform var(--transition-base);
}

.sidebar-header {
  padding: var(--space-6);
  border-bottom: 1px solid var(--admin-border);
}

.sidebar-brand {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  text-decoration: none;
}

.brand-logo {
  height: 32px;
  width: auto;
  object-fit: contain;
}

.brand-text {
  font-family: var(--font-heading);
  font-size: var(--text-lg);
  font-weight: 800;
}

.sidebar-nav {
  flex: 1;
  padding: var(--space-4) var(--space-3);
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.nav-item {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3) var(--space-4);
  border-radius: var(--radius-md);
  color: var(--color-text-secondary);
  text-decoration: none;
  font-size: var(--text-sm);
  font-weight: 500;
  transition: all var(--transition-fast);
}

.nav-item:hover {
  background: rgba(255, 255, 255, 0.05);
  color: var(--color-text-primary);
}

.nav-item.active {
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(99, 102, 241, 0.05));
  color: #818cf8;
  border: 1px solid rgba(99, 102, 241, 0.2);
}

.nav-icon {
  font-size: var(--text-lg);
  width: 28px;
  text-align: center;
}

.sidebar-footer {
  padding: var(--space-4) var(--space-3);
  border-top: 1px solid var(--admin-border);
}

@media (max-width: 768px) {
  .admin-sidebar {
    transform: translateX(-100%);
  }

  .admin-sidebar.open {
    transform: translateX(0);
  }
}
</style>
