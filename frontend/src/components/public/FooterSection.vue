<template>
  <footer class="footer">
    <div class="container footer-inner">
      <div class="footer-col brand-col">
        <div class="brand-logo-wrap">
          <img :src="logoSrc" alt="Greenwich Logo" class="footer-logo" />
          <span class="brand-text">Greenwich Vietnam</span>
        </div>
        <p class="address">
          20 Cong Hoa, Bay Hien, Tan Binh<br>
          District, Ho Chi Minh City
        </p>
        <div class="socials">
          <a href="#" class="social-btn facebook"><i class="fab fa-facebook-f">f</i></a>
          <a href="#" class="social-btn youtube"><i class="fab fa-youtube">▶</i></a>
          <a href="#" class="social-btn tiktok"><i class="fab fa-tiktok">d</i></a>
          <a href="#" class="social-btn instagram"><i class="fab fa-instagram">ig</i></a>
        </div>
      </div>
      
      <div class="footer-col links-col">
        <h4 class="col-title">QUICK LINKS</h4>
        <nav class="footer-nav">
          <a href="#">About</a>
          <a href="#">Programs</a>
          <a href="#">FAQ</a>
          <a href="#">Contact</a>
        </nav>
      </div>
      
      <div class="footer-col support-col">
        <h4 class="col-title">SUPPORT</h4>
        <nav class="footer-nav">
          <a href="#">FAQ</a>
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
        </nav>
      </div>

      <div class="footer-col location-col">
        <h4 class="col-title">LOCATION</h4>
        <div class="map-container">
          <img src="https://maps.googleapis.com/maps/api/staticmap?center=10.8016405,106.6565147&zoom=16&size=400x200&maptype=roadmap&markers=color:red%7C10.8016405,106.6565147&key=YOUR_API_KEY_HERE" alt="Map Location" class="map-image" onerror="this.src='https://via.placeholder.com/400x200?text=Map+Placeholder'" />
        </div>
      </div>
    </div>
    
    <div class="footer-bottom">
      <div class="container">
        <p>© 2026 FPT Greenwich Vietnam. All rights reserved.</p>
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
  grid-template-columns: 1.5fr 1fr 1fr 1.5fr;
  gap: var(--space-8);
  padding: var(--space-16) 0 var(--space-10);
}

.brand-col {
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
  height: 32px;
  width: auto;
}

.brand-text {
  font-family: var(--font-heading);
  font-weight: 700;
  font-size: var(--text-lg);
  color: var(--color-text-primary);
}

.address {
  font-size: var(--text-sm);
  line-height: 1.6;
  color: var(--color-text-secondary);
}

.socials {
  display: flex;
  gap: var(--space-3);
  margin-top: var(--space-2);
}

.social-btn {
  width: 32px;
  height: 32px;
  border-radius: var(--radius-sm);
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-secondary);
  text-decoration: none;
  font-size: var(--text-xs);
  font-weight: bold;
  transition: all var(--transition-fast);
}

.social-btn:hover {
  background: var(--color-bg-glass-strong);
  color: var(--color-text-primary);
}

.col-title {
  font-size: var(--text-sm);
  font-weight: 700;
  color: var(--color-text-primary);
  margin-bottom: var(--space-6);
  letter-spacing: 1px;
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

.map-container {
  border-radius: var(--radius-md);
  overflow: hidden;
  border: 1px solid var(--color-border);
  height: 120px;
  background: #e2e8f0;
}

.map-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
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
