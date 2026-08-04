<template>
  <nav class="navbar-wrapper">
    <div class="navbar-pill">
      <router-link to="/" class="navbar-brand">
        <div class="brand-logo-circle">
          <img :src="logoSrc" alt="Logo" class="brand-logo" />
        </div>
        <span class="brand-text">GREENWICH VIETNAM</span>
      </router-link>
      
      <div class="navbar-links" :class="{ open: menuOpen }">
        <a href="#" class="nav-link" @click="menuOpen = false">ABOUT</a>
        <a href="#" class="nav-link" @click="menuOpen = false">PROGRAMS</a>
        <a href="#" class="nav-link" @click="menuOpen = false">FAQ</a>
        <a href="#" class="nav-link" @click="menuOpen = false">CONTACT</a>
      </div>
      
      <div class="navbar-actions">
        <button class="theme-toggle" @click="toggleTheme()" title="Toggle Theme">
          <span v-if="isDark" class="icon-moon">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
          </span>
          <span v-else class="icon-sun">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
          </span>
        </button>
        <button class="hamburger" @click="menuOpen = !menuOpen" :class="{ open: menuOpen }">
          <span></span><span></span><span></span>
        </button>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useDark, useToggle } from '@vueuse/core'
import logoLight from '../../assets/logo_light-Cvl1LvYU.png'
import logoDark from '../../assets/logo_dark-nY9adEwT.png'

const isDark = useDark({ valueDark: 'dark', valueLight: 'light' })
const toggleTheme = useToggle(isDark)
const logoSrc = computed(() => isDark.value ? logoDark : logoLight)
const menuOpen = ref(false)
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
  color: var(--color-text-primary);
  letter-spacing: 0.5px;
}

.navbar-links {
  display: flex;
  align-items: center;
  gap: var(--space-8);
}

.nav-link {
  color: var(--color-text-secondary);
  font-weight: 700;
  font-size: var(--text-sm);
  letter-spacing: 1px;
  transition: all var(--transition-fast);
  text-decoration: none;
}

.nav-link:hover {
  color: var(--color-text-primary);
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

@media (max-width: 860px) {
  .navbar-links {
    display: none;
  }

  .hamburger {
    display: flex;
  }
}
</style>
