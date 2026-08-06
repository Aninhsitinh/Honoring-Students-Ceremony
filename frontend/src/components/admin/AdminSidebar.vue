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
        <span class="nav-icon" v-html="chartBarIcon"></span>
        <span>{{ $t('admin.dashboard') }}</span>
      </router-link>
      <router-link to="/admin/students" class="nav-item" active-class="active" @click="close">
        <span class="nav-icon" v-html="graduationCapIcon"></span>
        <span>{{ $t('admin.manage_students') }}</span>
      </router-link>
      <router-link to="/admin/top-scores" class="nav-item" active-class="active" @click="close">
        <span class="nav-icon" v-html="starIcon"></span>
        <span>{{ $t('admin.manage_scores') }}</span>
      </router-link>
      <router-link to="/admin/posts" class="nav-item" active-class="active" @click="close">
        <span class="nav-icon" v-html="fileTextIcon"></span>
        <span>{{ $t('admin.manage_posts') }}</span>
      </router-link>
      <router-link to="/admin/semesters" class="nav-item" active-class="active" @click="close">
        <span class="nav-icon" v-html="calendarIcon"></span>
        <span>{{ $t('admin.manage_semesters') }}</span>
      </router-link>
      <router-link to="/admin/subjects" class="nav-item" active-class="active" @click="close">
        <span class="nav-icon" v-html="clipboardIcon"></span>
        <span>{{ $t('admin.manage_subjects') || 'Manage Subjects' }}</span>
      </router-link>
    </nav>

    <div class="sidebar-footer">
      <div class="admin-user-info">
        <span class="nav-icon" v-html="userIcon"></span>
        <span class="user-name">{{ user?.username }}</span>
      </div>
      <button class="btn btn-secondary btn-sm logout-btn" @click="handleLogout">
        {{ $t('nav.logout') }}
      </button>
    </div>
  </aside>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'
import { useDark } from '@vueuse/core'
import icons from '../../utils/icons'
import logoLight from '../../assets/logo_light-Cvl1LvYU.png'
import logoDark from '../../assets/logo_dark-nY9adEwT.png'

const authStore = useAuthStore()
const router = useRouter()
const user = computed(() => authStore.user)
const userIcon = icons.user

const isDark = useDark({ valueDark: 'dark', valueLight: 'light' })
const logoSrc = computed(() => isDark.value ? logoDark : logoLight)

const chartBarIcon = icons.chartBar
const graduationCapIcon = icons.graduationCap
const starIcon = icons.star
const fileTextIcon = icons.fileText
const calendarIcon = icons.calendar
const globeIcon = icons.globe
const clipboardIcon = icons.clipboard

const isOpen = ref(false)

function close() {
  isOpen.value = false
  document.querySelector('.admin-sidebar')?.classList.remove('open')
}

function handleLogout() {
  authStore.logout()
  router.push({ name: 'AdminLogin' })
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
  background: rgba(0, 94, 184, 0.15);
  color: #3ABFF0;
  border: none;
  border-left: 3px solid #3ADDC2;
}

.nav-icon {
  font-size: var(--text-lg);
  width: 28px;
  text-align: center;
}

.sidebar-footer {
  padding: var(--space-4) var(--space-3);
  border-top: 1px solid var(--admin-border);
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.admin-user-info {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  color: var(--color-text-primary);
  font-weight: 600;
  padding: 0 var(--space-2);
}

.user-name {
  font-size: var(--text-base);
}

.logout-btn {
  width: 100%;
}

</style>
