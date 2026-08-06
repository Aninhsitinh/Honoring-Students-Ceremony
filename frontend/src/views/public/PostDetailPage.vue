<template>
  <div class="post-detail-page">
    <PostDetailSkeleton v-if="loading" />

    <template v-else-if="post">
      <div class="post-hero" 
           :style="{ backgroundImage: post.thumbnail_url ? `url(${getImageUrl(post.thumbnail_url)})` : 'none', cursor: post.thumbnail_url ? 'zoom-in' : 'default' }"
           @click="post.thumbnail_url ? showLightbox = true : null">
        <div class="post-hero-overlay" @click.stop="post.thumbnail_url ? showLightbox = true : null">
          <div class="container">
            <div class="post-hero-content animate-fade-in-up">
              <div class="post-meta">
                <span v-if="post.semester_name" class="badge badge-blue">
                  {{ tSem(post.semester_name, $t) }} {{ post.semester_year }}
                </span>
                <span class="post-date">{{ formatDate(post.published_at || post.created_at) }}</span>
                <span class="post-author" v-if="post.author_name">{{ $t('post.by') }} {{ post.author_name }}</span>
              </div>
              <h1 class="post-title">{{ post.title }}</h1>
            </div>
          </div>
        </div>
      </div>

      <article class="container">
        <div class="post-body glass" v-html="DOMPurify.sanitize(post.content)"></div>
      </article>
    </template>

    <div v-else class="empty-state">
      <span class="empty-icon" v-html="searchIcon"></span>
      <p>{{ $t('error.post.not_found') }}</p>
      <router-link to="/news-and-events" class="btn btn-secondary"><span class="icon" v-html="arrowLeftIcon"></span> {{ $t('post.back') }}</router-link>
    </div>

    <teleport to="body">
      <div v-if="showLightbox && post && post.thumbnail_url" class="lightbox-overlay" @click="showLightbox = false">
        <button class="lightbox-close" @click="showLightbox = false" v-html="xIcon"></button>
        <img :src="getImageUrl(post.thumbnail_url)" class="lightbox-img" @click.stop />
      </div>
    </teleport>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import PostDetailSkeleton from '../../components/public/PostDetailSkeleton.vue'
import { useRoute } from 'vue-router'
import api from '../../api/axios'
import { useI18n } from 'vue-i18n'
import DOMPurify from 'dompurify'
import { tSem } from '../../utils/translate'
import icons from '../../utils/icons'
import { getImageUrl } from '../../utils/image'
import { useHead } from '@unhead/vue'

const { t } = useI18n()
const arrowLeftIcon = icons.arrowLeft
const searchIcon = icons.search
const xIcon = icons.x
const route = useRoute()
const post = ref(null)
const loading = ref(true)
const showLightbox = ref(false)

function formatDate(dateStr) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('vi-VN', {
    day: '2-digit', month: 'long', year: 'numeric',
  })
}

onMounted(async () => {
  try {
    const { data } = await api.get(`/posts/slug/${route.params.slug}`)
    post.value = data
    useHead({
      title: `${data.title} | Greenwich Honoring Students`,
      meta: [
        { name: 'description', content: data.title },
        { property: 'og:title', content: data.title },
        { property: 'og:description', content: data.title },
        { property: 'og:image', content: data.thumbnail_url ? getImageUrl(data.thumbnail_url) : '' }
      ]
    })
  } catch (error) {
    console.error('Failed to load post:', error)
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.post-hero {
  min-height: 400px;
  background-size: cover;
  background-position: center;
  background-color: var(--color-bg-secondary);
  position: relative;
}

.post-hero-overlay {
  min-height: 400px;
  background: linear-gradient(to bottom, rgba(10, 10, 26, 0) 0%, rgba(10, 10, 26, 0.2) 50%, rgba(10, 10, 26, 0.85) 100%);
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: var(--space-8) 0;
  padding-top: 100px;
}

.back-link {
  display: inline-block;
  color: var(--color-text-secondary);
  font-size: var(--text-sm);
  margin-bottom: var(--space-6);
  text-decoration: none;
  transition: color var(--transition-fast);
}

.back-link:hover {
  color: var(--color-text-accent);
}

.post-meta {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  margin-bottom: var(--space-4);
  flex-wrap: wrap;
}

.post-date {
  color: var(--color-text-secondary);
  font-size: var(--text-sm);
}

.post-author {
  color: var(--color-text-secondary);
  font-size: var(--text-sm);
  opacity: 0.8;
}

.post-title {
  font-size: var(--text-4xl);
  font-weight: 800;
  line-height: 1.3;
  max-width: 800px;
  color: var(--color-text-white);
  text-shadow: 0 2px 4px rgba(0,0,0,0.5);
}

.post-body {
  margin: var(--space-10) auto;
  max-width: 800px;
  padding: var(--space-10);
  border-radius: var(--radius-xl);
  line-height: 1.9;
  font-size: 1.05rem;
  color: var(--color-text-primary);
}

/* Force rich text to adapt to dark/light mode */
:deep(.post-body *),
:deep(.post-body [style]) {
  color: inherit !important;
  background-color: transparent !important;
}

.post-body :deep(h2) {
  font-size: var(--text-2xl);
  font-weight: 700;
  color: var(--color-text-primary);
  margin: var(--space-8) 0 var(--space-4);
}

.post-body :deep(h3) {
  font-size: var(--text-xl);
  font-weight: 600;
  color: var(--color-text-primary);
  margin: var(--space-6) 0 var(--space-3);
}

.post-body :deep(p) {
  margin-bottom: var(--space-4);
}

.post-body :deep(ul), .post-body :deep(ol) {
  margin-left: var(--space-6);
  margin-bottom: var(--space-4);
}

.post-body :deep(img) {
  max-width: 100%;
  border-radius: var(--radius-md);
  margin: var(--space-6) 0;
}

/* Lightbox Styles */
.lightbox-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.9);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-4);
  backdrop-filter: blur(5px);
  cursor: zoom-out;
}

.lightbox-img {
  max-width: 90%;
  max-height: 90vh;
  object-fit: contain;
  border-radius: var(--radius-lg);
  box-shadow: 0 0 30px rgba(0,0,0,0.5);
  cursor: default;
}

.lightbox-close {
  position: absolute;
  top: var(--space-6);
  right: var(--space-6);
  background: transparent;
  color: #fff;
  border: none;
  font-size: 2rem;
  cursor: pointer;
  padding: var(--space-2);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s ease, opacity 0.2s ease;
  opacity: 0.7;
}

.lightbox-close:hover {
  transform: scale(1.1);
  opacity: 1;
}

.post-body :deep(li) {
  margin-bottom: var(--space-2);
  list-style: disc;
}

.post-body :deep(strong) {
  color: var(--color-text-primary);
}

.loading-state {
  display: flex;
  justify-content: center;
  padding: 200px 0;
}

.loader {
  width: 40px;
  height: 40px;
  border: 3px solid var(--color-border);
  border-top-color: var(--color-text-accent);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }

.empty-state {
  text-align: center;
  padding: 200px var(--space-6);
  color: var(--color-text-muted);
}

.empty-icon {
  font-size: 3rem;
  display: block;
  margin-bottom: var(--space-4);
}

</style>
