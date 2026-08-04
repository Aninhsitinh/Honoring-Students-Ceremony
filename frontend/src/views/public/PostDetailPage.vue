<template>
  <div class="post-detail-page">
    <div v-if="loading" class="loading-state">
      <div class="loader"></div>
    </div>

    <template v-else-if="post">
      <div class="post-hero" :style="{ backgroundImage: post.thumbnail_url ? `url(${apiBase}${post.thumbnail_url})` : 'none' }">
        <div class="post-hero-overlay">
          <div class="container">
            <button class="btn btn-secondary btn-sm" @click="$router.back()">
              ← {{ $t('post.back') }}
            </button>
            <div class="post-hero-content animate-fade-in-up">
              <div class="post-meta">
                <span v-if="post.semester_name" class="badge badge-gold">
                  {{ post.semester_name }} {{ post.semester_year }}
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
        <div class="post-body glass" v-html="post.content"></div>
      </article>
    </template>

    <div v-else class="empty-state">
      <span class="empty-icon">🔍</span>
      <p>{{ $t('error.post.not_found') }}</p>
      <router-link to="/tin-tuc" class="btn btn-secondary">← {{ $t('post.back') }}</router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import api from '../../api/axios'

const route = useRoute()
const post = ref(null)
const loading = ref(true)

const apiBase = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:3000'

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
    document.title = `${data.title} | Honoring Students`
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
  background: linear-gradient(to bottom, rgba(10, 10, 26, 0.3), rgba(10, 10, 26, 0.95));
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
  color: var(--color-text-muted);
  font-size: var(--text-sm);
}

.post-author {
  color: var(--color-text-secondary);
  font-size: var(--text-sm);
}

.post-title {
  font-size: var(--text-4xl);
  font-weight: 800;
  line-height: 1.3;
  max-width: 800px;
}

.post-body {
  margin: var(--space-10) auto;
  max-width: 800px;
  padding: var(--space-10);
  border-radius: var(--radius-xl);
  line-height: 1.9;
  font-size: var(--text-base);
  color: var(--color-text-secondary);
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
  margin: var(--space-4) 0;
  padding-left: var(--space-6);
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

@media (max-width: 768px) {
  .post-title { font-size: var(--text-2xl); }
  .post-body { padding: var(--space-5); margin: var(--space-6) auto; }
}
</style>
