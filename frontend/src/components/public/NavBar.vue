<template>
  <nav class="navbar" :class="{ scrolled: isScrolled }">
    <div class="container navbar-inner">
      <router-link to="/" class="navbar-brand">
        <img :src="logoSrc" alt="Logo" class="brand-logo" />
        <span class="brand-text gradient-text">Honoring Students</span>
      </router-link>
      <div class="navbar-links" :class="{ open: menuOpen }">
        <router-link to="/" class="nav-link" @click="menuOpen = false">Home</router-link>
        <router-link to="/tin-tuc" class="nav-link" @click="menuOpen = false">News</router-link>
        <div class="nav-link semester-selector">
          <button class="semester-btn" @click.stop="showSemesters = !showSemesters">
            Tôn Vinh Sinh Viên ▾
          </button>
          <div class="semester-dropdown" v-show="showSemesters">
            <button
              v-for="sem in semesters"
              :key="sem.id"
              class="semester-option"
              :class="{ active: selectedSemester?.id === sem.id }"
              @click="selectSem(sem)"
            >
              {{ sem.name }} {{ sem.year }}
              <span v-if="sem.is_active" class="badge badge-gold" style="margin-left: 8px;">Active</span>
            </button>
          </div>
        </div>
        <div class="nav-link semester-selector">
          <button class="semester-btn" @click.stop="showGraduation = !showGraduation; showSemesters = false">
            Graduation ▾
          </button>
          <div class="semester-dropdown" v-show="showGraduation">
            <a href="https://greenwich-ceremony-hrae.vercel.app/" target="_blank" class="semester-option">
              Graduation 2026
            </a>
          </div>
        </div>
      </div>
      <div class="navbar-actions">
        <button class="theme-toggle" @click="toggleTheme()" title="Đổi giao diện">
          {{ isDark ? '☀️' : '🌙' }}
        </button>
        <button class="hamburger" @click="menuOpen = !menuOpen" :class="{ open: menuOpen }">
          <span></span><span></span><span></span>
        </button>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useSemesterStore } from '../../stores/semester'
import { useDark, useToggle } from '@vueuse/core'
import logoLight from '../../assets/logo_light-Cvl1LvYU.png'
import logoDark from '../../assets/logo_dark-nY9adEwT.png'

const isDark = useDark({ valueDark: 'dark', valueLight: 'light' })
const toggleTheme = useToggle(isDark)
const logoSrc = computed(() => isDark.value ? logoDark : logoLight)

const semesterStore = useSemesterStore()
const isScrolled = ref(false)
const menuOpen = ref(false)
const showSemesters = ref(false)
const showGraduation = ref(false)

const semesters = computed(() => semesterStore.semesters)
const selectedSemester = computed(() => semesterStore.selectedSemester)

function selectSem(sem) {
  semesterStore.selectSemester(sem)
  showSemesters.value = false
}

function handleScroll() {
  isScrolled.value = window.scrollY > 50
}

function closeDropdown(e) {
  if (!e.target.closest('.semester-selector')) {
    showSemesters.value = false
    showGraduation.value = false
  }
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  document.addEventListener('click', closeDropdown)
  semesterStore.fetchAll()
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  document.removeEventListener('click', closeDropdown)
})
</script>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: var(--z-sticky);
  padding: var(--space-4) 0;
  transition: all var(--transition-base);
}

.navbar.scrolled {
  background: rgba(10, 10, 26, 0.9);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--color-border);
  padding: var(--space-3) 0;
}

.navbar-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
}

.navbar-brand {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  text-decoration: none;
}

.brand-logo {
  height: 36px;
  width: auto;
  object-fit: contain;
  transition: transform var(--transition-base);
}

.brand-logo:hover {
  transform: scale(1.05);
}

.brand-text {
  font-family: var(--font-heading);
  font-size: var(--text-xl);
  font-weight: 800;
  letter-spacing: -0.5px;
}

.navbar-links {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

@media (min-width: 769px) {
  .navbar-links {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
  }
}

.nav-link {
  padding: var(--space-2) var(--space-4);
  color: var(--color-text-secondary);
  font-weight: 500;
  font-size: var(--text-sm);
  border-radius: var(--radius-md);
  transition: all var(--transition-fast);
  text-decoration: none;
}

.nav-link:hover,
.nav-link.router-link-exact-active {
  color: var(--color-text-accent);
  background: var(--color-bg-glass);
}

.semester-selector {
  position: relative;
}

.semester-btn {
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  color: var(--color-text-accent);
  padding: var(--space-2) var(--space-4);
  border-radius: var(--radius-full);
  font-size: var(--text-sm);
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.semester-btn:hover {
  background: var(--color-bg-card-hover);
  border-color: var(--color-border-hover);
}

.semester-dropdown {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: var(--space-2);
  min-width: 200px;
  box-shadow: var(--shadow-lg);
  animation: fadeInDown 0.2s ease;
}

.semester-option {
  display: flex;
  align-items: center;
  width: 100%;
  padding: var(--space-2) var(--space-3);
  background: none;
  border: none;
  color: var(--color-text-secondary);
  font-size: var(--text-sm);
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.semester-option:hover,
.semester-option.active {
  background: var(--color-bg-glass);
  color: var(--color-text-accent);
}

.navbar-actions {
  display: flex;
  align-items: center;
  gap: var(--space-4);
}

.theme-toggle {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid var(--color-border);
  border-radius: 50%;
  width: 36px;
  height: 36px;
  font-size: var(--text-lg);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-fast);
}

.theme-toggle:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: scale(1.05);
}

.hamburger {
  display: none;
  flex-direction: column;
  gap: 5px;
  background: none;
  padding: var(--space-2);
}

.hamburger span {
  display: block;
  width: 24px;
  height: 2px;
  background: var(--color-text-primary);
  border-radius: 2px;
  transition: all var(--transition-fast);
}

.hamburger.open span:nth-child(1) {
  transform: rotate(45deg) translate(5px, 5px);
}
.hamburger.open span:nth-child(2) {
  opacity: 0;
}
.hamburger.open span:nth-child(3) {
  transform: rotate(-45deg) translate(5px, -5px);
}

@media (max-width: 768px) {
  .hamburger {
    display: flex;
  }

  .navbar-links {
    display: none;
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: rgba(10, 10, 26, 0.95);
    backdrop-filter: blur(20px);
    flex-direction: column;
    padding: var(--space-4);
    border-bottom: 1px solid var(--color-border);
  }

  .navbar-links.open {
    display: flex;
  }

  .semester-dropdown {
    position: static;
    margin-top: var(--space-2);
  }
}
</style>
