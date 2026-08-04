<template>
  <footer class="footer">
    <div class="container footer-inner">
      <div class="footer-brand">
        <div class="brand-logo-wrap">
          <img :src="logoSrc" alt="Logo" class="footer-logo" />
          <h3 class="gradient-text">Honoring Students</h3>
        </div>
        <p class="brand-desc">{{ $t('footer.description') }}</p>
      </div>
      
      <div class="footer-col footer-links">
        <h4 class="col-title">{{ $t('footer.links') }}</h4>
        <nav class="footer-nav">
          <router-link to="/">{{ $t('nav.home') }}</router-link>
          <router-link to="/tin-tuc">{{ $t('nav.news') }}</router-link>
        </nav>
      </div>
      
      <div class="footer-col footer-contact">
        <h4 class="col-title">{{ $t('footer.contact') }}</h4>
        <div class="contact-info">
          <p>📧 contact@honoring.edu.vn</p>
          <p>📞 028 1234 5678</p>
        </div>
      </div>
    </div>
    
    <div class="footer-bottom">
      <div class="container">
        <p>© {{ year }} Honoring Students. {{ $t('footer.rights') }}</p>
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
  background: var(--color-bg-primary); /* Uses #0b1120 in dark, #ffffff in light */
  border-top: 1px solid var(--color-border);
  color: var(--color-text-secondary);
  font-family: var(--font-body);
}

.footer-inner {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: var(--space-8);
  padding: var(--space-16) 0 var(--space-10);
}

.footer-brand {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.brand-logo-wrap {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.footer-logo {
  height: 36px;
  width: auto;
  object-fit: contain;
}

.brand-logo-wrap h3 {
  font-family: var(--font-heading);
  font-size: var(--text-xl);
  font-weight: 800;
  margin: 0;
}

.brand-desc {
  font-size: var(--text-sm);
  line-height: 1.6;
  color: var(--color-text-secondary);
}

.footer-col {
  display: flex;
  flex-direction: column;
}

.col-title {
  font-size: var(--text-sm);
  font-weight: 700;
  color: var(--color-text-primary);
  margin-bottom: var(--space-6);
  letter-spacing: 1px;
  text-transform: uppercase;
}

.footer-nav {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.footer-nav a {
  color: var(--color-text-secondary);
  text-decoration: none;
  font-size: var(--text-sm);
  transition: color var(--transition-fast);
}

.footer-nav a:hover {
  color: var(--color-text-primary);
}

.contact-info p {
  color: var(--color-text-secondary);
  font-size: var(--text-sm);
  margin-bottom: var(--space-4);
}

.footer-bottom {
  border-top: 1px solid var(--color-border);
  padding: var(--space-6) 0;
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
