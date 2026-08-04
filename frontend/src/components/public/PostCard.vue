<template>
  <router-link :to="`/tin-tuc/${post.slug}`" class="post-card card">
    <div class="post-thumbnail" :style="{ backgroundImage: post.thumbnail_url ? `url(${apiBase}${post.thumbnail_url})` : 'none' }">
      <div v-if="!post.thumbnail_url" class="post-thumb-placeholder">📰</div>
    </div>
    <div class="post-body">
      <div class="post-meta">
        <span class="post-date">{{ formatDate(post.published_at || post.created_at) }}</span>
        <span v-if="post.semester_name" class="badge badge-purple" style="font-size: 0.65rem;">
          {{ post.semester_name }} {{ post.semester_year }}
        </span>
      </div>
      <h3 class="post-title">{{ post.title }}</h3>
      <p class="post-excerpt">{{ excerpt }}</p>
    </div>
  </router-link>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  post: { type: Object, required: true },
})

const apiBase = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:3000'

const excerpt = computed(() => {
  const text = props.post.content?.replace(/<[^>]+>/g, '') || ''
  return text.length > 100 ? text.substring(0, 100) + '...' : text
})

function formatDate(dateStr) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}
</script>

<style scoped>
.post-card {
  display: block;
  text-decoration: none;
  color: inherit;
  overflow: hidden;
  transition: all var(--transition-base);
}

.post-card:hover {
  transform: translateY(-6px);
  box-shadow: var(--shadow-md);
}

.post-thumbnail {
  height: 200px;
  background-size: cover;
  background-position: center;
  position: relative;
}

.post-thumb-placeholder {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--gradient-secondary);
  font-size: 3rem;
}

.post-body {
  padding: var(--space-5);
}

.post-meta {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  margin-bottom: var(--space-3);
}

.post-date {
  font-size: var(--text-xs);
  color: var(--color-text-muted);
}

.post-title {
  font-size: var(--text-lg);
  font-weight: 600;
  margin-bottom: var(--space-2);
  color: var(--color-text-white);
  line-height: 1.4;
  transition: color var(--transition-fast);
}

.post-card:hover .post-title {
  color: var(--color-text-accent);
}

.post-excerpt {
  font-size: var(--text-sm);
  color: var(--color-text-muted);
  line-height: 1.6;
}
</style>
