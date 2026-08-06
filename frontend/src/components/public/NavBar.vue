<template>
  <nav class="navbar-wrapper">
    <div class="navbar-pill">
      <router-link to="/" class="navbar-brand">
        <div class="brand-logo-circle">
          <img :src="logoSrc" alt="Logo" class="brand-logo" />
        </div>
        <span class="brand-text gradient-text">Greenwich Honoring Students</span>
      </router-link>
      
      <div class="navbar-links" :class="{ open: menuOpen }">
        <router-link to="/" class="nav-link" @click="menuOpen = false">
          <span class="nav-icon" v-html="icons.home"></span>
          <span class="nav-text">{{ $t('nav.home') }}</span>
        </router-link>
        <router-link to="/news-and-events" class="nav-link" @click="menuOpen = false">
          <span class="nav-icon" v-html="icons.newspaper"></span>
          <span class="nav-text">{{ $t('nav.news') }}</span>
        </router-link>
        <div class="nav-link semester-selector">
          <button class="semester-btn" @click.stop="showSemesters = !showSemesters">
            <span class="nav-icon" v-html="icons.calendar"></span>
            <span class="nav-text">{{ $t('nav.semesters') }} ▾</span>
          </button>
          <div class="semester-dropdown" v-show="showSemesters">
            <button
              v-for="sem in semesters"
              :key="sem.id"
              class="semester-option"
              :class="{ active: selectedSemester?.id === sem.id }"
              @click="selectSem(sem)"
            >
              {{ tSem(sem.name, $t) }} {{ sem.year }}
              <span v-if="sem.is_active" class="badge badge-gold" style="margin-left: 8px;">{{ $t('admin.active') }}</span>
            </button>
          </div>
        </div>
        <div class="nav-link semester-selector">
          <button class="semester-btn" @click.stop="showGraduation = !showGraduation; showSemesters = false">
            <span class="nav-icon" v-html="icons.graduationCap"></span>
            <span class="nav-text">{{ $t('nav.graduation') }} ▾</span>
          </button>
          <div class="semester-dropdown" v-show="showGraduation">
            <a href="https://greenwich-ceremony-hrae.vercel.app/" target="_blank" class="semester-option">
              Graduation 2026
            </a>
          </div>
        </div>
      </div>
      
      <div class="navbar-actions">
        <button class="theme-toggle" @click="toggleLanguage" title="Switch Language" style="font-weight: bold; font-size: 14px;">
          {{ locale === 'en' ? 'EN' : 'VI' }}
        </button>
        <button class="theme-toggle" @click="toggleTheme()" title="Toggle Theme">
          <span v-if="isDark" class="icon-moon" v-html="moonIcon"></span>
          <span v-else class="icon-sun" v-html="sunIcon"></span>
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
import { useI18n } from 'vue-i18n'
import { useSemesterStore } from '../../stores/semester'
import { tSem } from '../../utils/translate'
import { useDark, useToggle } from '@vueuse/core'
import icons from '../../utils/icons'
import logoLight from '../../assets/logo_light-Cvl1LvYU.png'
import logoDark from '../../assets/logo_dark-nY9adEwT.png'

const moonIcon = icons.moon
const sunIcon = icons.sun

const isDark = useDark({ valueDark: 'dark', valueLight: 'light' })
const toggleTheme = useToggle(isDark)
const logoSrc = computed(() => isDark.value ? logoDark : logoLight)
const menuOpen = ref(false)

const { locale } = useI18n()

function toggleLanguage() {
  locale.value = locale.value === 'en' ? 'vi' : 'en'
  localStorage.setItem('lang', locale.value)
}

const semesterStore = useSemesterStore()
const showSemesters = ref(false)
const showGraduation = ref(false)

const semesters = computed(() => semesterStore.semesters)
const selectedSemester = computed(() => semesterStore.selectedSemester)

function selectSem(sem) {
  semesterStore.selectSemester(sem)
  showSemesters.value = false
}

function closeDropdown(e) {
  if (!e.target.closest('.semester-selector')) {
    showSemesters.value = false
    showGraduation.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', closeDropdown)
  semesterStore.fetchAll()
})

onUnmounted(() => {
  document.removeEventListener('click', closeDropdown)
})
</script>

<style scoped>
.navbar-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: var(--z-sticky);
  padding: var(--space-4) var(--space-6);
  display: flex;
  justify-content: center;
  pointer-events: none;
}

.navbar-pill {
  pointer-events: auto;
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  box-shadow: var(--shadow-md);
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-2) var(--space-6);
  width: 100%;
  max-width: 1100px;
  height: 64px;
}

.navbar-brand {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  text-decoration: none;
}

.brand-logo-circle {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 1px solid var(--color-border);
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-bg-card);
}

.brand-logo {
  height: 24px;
  width: auto;
  object-fit: contain;
}

.brand-text {
  font-family: var(--font-heading);
  font-size: var(--text-base);
  font-weight: 800;
  letter-spacing: 0.5px;
}

.navbar-links {
  display: flex;
  align-items: center;
  gap: var(--space-4);
}

.nav-link {
  color: var(--color-text-secondary);
  font-weight: 600;
  font-size: var(--text-sm);
  letter-spacing: 0.5px;
  transition: all var(--transition-fast);
  text-decoration: none;
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius-md);
}

.nav-link:hover,
.nav-link.router-link-exact-active {
  color: var(--color-text-primary);
  background: var(--color-bg-glass);
}

.semester-selector {
  position: relative;
}

.semester-btn {
  background: transparent;
  border: none;
  color: inherit;
  font-family: inherit;
  font-size: inherit;
  font-weight: inherit;
  cursor: pointer;
  padding: 0;
}

.semester-dropdown {
  position: absolute;
  top: calc(100% + 12px);
  left: 50%;
  transform: translateX(-50%);
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
  text-decoration: none;
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
  background: transparent;
  border: none;
  color: var(--color-text-secondary);
  width: 36px;
  height: 36px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-fast);
}

.theme-toggle:hover {
  color: var(--color-text-primary);
}

.hamburger {
  display: none;
  flex-direction: column;
  gap: 5px;
  background: none;
  padding: var(--space-2);
  cursor: pointer;
  border: none;
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

</style>
