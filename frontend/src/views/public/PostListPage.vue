<template>
  <div class="posts-page">
    <div class="page-header">
      <div class="container">
        <h1 class="page-title gradient-text animate-fade-in-down">{{ $t('post.news_events') }}</h1>
        <p class="page-desc animate-fade-in-up delay-200">
          {{ $t('post.page_desc') }}
        </p>
      </div>
    </div>

    <div class="container posts-content">
      <!-- Skeleton while loading -->
      <div v-if="loading" class="posts-grid">
        <PostCardSkeleton v-for="n in 6" :key="n" />
      </div>

      <div v-else-if="posts.length" class="posts-grid">
        <PostCard
          v-for="(post, index) in posts"
          :key="post.id"
          :post="post"
          :style="{ animationDelay: `${index * 0.1}s` }"
          class="animate-fade-in-up"
        />
      </div>

      <div v-else class="empty-state">
        <span class="empty-icon">📰</span>
        <p>{{ $t('post.no_news') }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import api from '../../api/axios'
import PostCard from '../../components/public/PostCard.vue'
import PostCardSkeleton from '../../components/public/PostCardSkeleton.vue'
import { useCampusStore } from '../../stores/campus'

const campusStore = useCampusStore()
const currentCampus = computed(() => campusStore.currentCampus)

const posts = ref([])
const loading = ref(false)

async function fetchPosts() {
  let timeout = setTimeout(() => { loading.value = true }, 200)
  try {
    const { data } = await api.get('/posts', { 
      params: { 
        is_published: true, 
        limit: 50,
        campus: currentCampus.value
      } 
    })
    posts.value = data.posts || []
  } catch (error) {
    console.error('Failed to load posts:', error)
  } finally {
    clearTimeout(timeout)
    loading.value = false
  }
}

watch(currentCampus, fetchPosts)

onMounted(() => {
  fetchPosts()
})
</script>

<style scoped>
.page-header {
  padding: calc(80px + var(--space-16)) 0 var(--space-12);
  text-align: center;
  background: var(--gradient-hero);
}

.page-title {
  font-size: var(--text-5xl);
  font-weight: 900;
  margin-bottom: var(--space-4);
}

.page-desc {
  color: var(--color-text-secondary);
  font-size: var(--text-lg);
  max-width: 600px;
  margin: 0 auto;
}

.posts-content {
  padding: var(--space-12) 0;
}

.posts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: var(--space-6);
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-4);
  padding: var(--space-16) 0;
  color: var(--color-text-muted);
}

.loader {
  width: 50px;
  height: 50px;
  border: 4px solid var(--color-border);
  border-top-color: #3ADDC2;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }

.empty-state {
  text-align: center;
  padding: var(--space-16) 0;
  color: var(--color-text-muted);
}

.empty-icon {
  font-size: 3rem;
  display: block;
  margin-bottom: var(--space-4);
}

</style>
