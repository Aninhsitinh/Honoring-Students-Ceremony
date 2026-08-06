<template>
  <footer class="footer">
    <div class="container footer-inner">
      <div class="footer-brand">
        <div class="brand-logo-wrap">
          <img :src="logoSrc" alt="Logo" class="footer-logo" />
          <h3 class="gradient-text">Greenwich Honoring Students</h3>
        </div>
        <p class="brand-desc">{{ $t('footer.description') }}</p>
      </div>
      
      <div class="footer-col footer-links">
        <h4 class="col-title">{{ $t('footer.links') }}</h4>
        <nav class="footer-nav">
          <router-link to="/">{{ $t('nav.home') }}</router-link>
          <router-link to="/news-and-events">{{ $t('nav.news') }}</router-link>
        </nav>
      </div>
      
      <div class="footer-col footer-contact">
        <h4 class="col-title">{{ $t('footer.contact') }}</h4>
        <div class="contact-info">
          <p><span class="icon" v-html="mailIcon"></span> contact@honoring.edu.vn</p>
          <p><span class="icon" v-html="phoneIcon"></span> 028 1234 5678</p>
        </div>
      </div>

      <div class="footer-col footer-social">
        <h4 class="col-title">{{ $t('footer.follow_us') || 'Kết nối với chúng tôi' }}</h4>
        <div class="social-icons">
          <a href="https://www.youtube.com/@GREENWICHVIETNAM" target="_blank" rel="noopener" class="social-link">
            <img :src="ytIcon" alt="YouTube" />
          </a>
          <a href="https://www.facebook.com/GreenwichVietnam/" target="_blank" rel="noopener" class="social-link">
            <img :src="fbIcon" alt="Facebook" />
          </a> 
          <a href="https://www.instagram.com/universityofgreenwichvn/" target="_blank" rel="noopener" class="social-link">
            <img :src="igIcon" alt="Instagram" />
          </a>
          <a href="https://www.tiktok.com/@greenwichvietnam" target="_blank" rel="noopener" class="social-link">
            <img :src="ttIcon" alt="TikTok" />
          </a>
        </div>
      </div>
    </div>
    
    <div class="footer-bottom">
      <div class="container">
        <p>© {{ year }} Greenwich Honoring Students. {{ $t('footer.rights') }}</p>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { computed } from 'vue'
import { useDark } from '@vueuse/core'
import icons from '../../utils/icons'
import logoLight from '../../assets/logo_light-Cvl1LvYU.png'
import logoDark from '../../assets/logo_dark-nY9adEwT.png'

import ytIcon from '../../assets/5295-youtube-i_102568.webp'
import fbIcon from '../../assets/images.png'
import igIcon from '../../assets/images.jpg'
import ttIcon from '../../assets/tai-xuong-mien-phi-logo-tiktok-bieu-tuong-mien-phi-diem-danh-dau-tiktok-tiktok-moi-nhat_999008-1829.avif'

const isDark = useDark({ valueDark: 'dark', valueLight: 'light' })
const logoSrc = computed(() => isDark.value ? logoDark : logoLight)
const year = new Date().getFullYear()
const mailIcon = icons.mail
const phoneIcon = icons.phone
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
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: var(--space-8);
  padding-top: var(--space-16);
  padding-bottom: var(--space-10);
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

.social-icons {
  display: flex;
  gap: var(--space-4);
  align-items: center;
}

.social-link {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.05);
  transition: all var(--transition-fast);
  overflow: hidden;
}

.social-link img {
  width: 24px;
  height: 24px;
  object-fit: cover;
}

.social-link:hover {
  transform: translateY(-3px);
  background: rgba(255, 255, 255, 0.1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
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

</style>
