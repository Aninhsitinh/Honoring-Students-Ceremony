<template>
  <footer class="footer">
    <div class="container footer-inner">
      <div class="footer-brand">
        <img :src="logoSrc" alt="Logo" class="footer-logo" />
        <h3 class="gradient-text">Honoring Students</h3>
        <p>Vinh danh sinh viên xuất sắc qua từng kỳ học.</p>
      </div>
      <div class="footer-links">
        <h4>Liên Kết</h4>
        <router-link to="/">Trang Chủ</router-link>
        <router-link to="/tin-tuc">Tin Tức</router-link>
      </div>
      <div class="footer-contact">
        <h4>Liên Hệ</h4>
        <p>📧 contact@honoring.edu.vn</p>
        <p>📞 028 1234 5678</p>
      </div>
    </div>
    <div class="footer-bottom">
      <div class="container">
        <p>© {{ year }} Honoring Students. All rights reserved.</p>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { computed } from 'vue'
import { useDark } from '@vueuse/core'
import logoLight from '../../assets/logo_light-Cvl1LvYU.png'
import logoDark from '../../assets/logo_dark-nY9adEwT.png'

const isDark = useDark({ valueDark: 'dark', valueLight: 'light' })
const logoSrc = computed(() => isDark.value ? logoDark : logoLight)
const year = new Date().getFullYear()
</script>

<style scoped>
.footer {
  background: var(--color-bg-secondary);
  border-top: 1px solid var(--color-border);
  margin-top: var(--space-16);
}

.footer-inner {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: var(--space-10);
  padding: var(--space-16) 0 var(--space-10);
}

.footer-brand {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.footer-logo {
  height: 48px;
  width: auto;
  object-fit: contain;
}

.footer-brand h3 {
  font-size: var(--text-xl);
  font-weight: 800;
}

.footer-brand p {
  color: var(--color-text-muted);
  font-size: var(--text-sm);
}

.footer-links h4,
.footer-contact h4 {
  color: var(--color-text-primary);
  font-size: var(--text-sm);
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: var(--space-4);
}

.footer-links a {
  display: block;
  color: var(--color-text-muted);
  font-size: var(--text-sm);
  margin-bottom: var(--space-2);
  transition: color var(--transition-fast);
  text-decoration: none;
}

.footer-links a:hover {
  color: var(--color-text-accent);
}

.footer-contact p {
  color: var(--color-text-muted);
  font-size: var(--text-sm);
  margin-bottom: var(--space-2);
}

.footer-bottom {
  border-top: 1px solid var(--color-border);
  padding: var(--space-4) 0;
  text-align: center;
}

.footer-bottom p {
  font-size: var(--text-xs);
  color: var(--color-text-muted);
}

@media (max-width: 768px) {
  .footer-inner {
    grid-template-columns: 1fr;
    gap: var(--space-8);
  }
}
</style>
