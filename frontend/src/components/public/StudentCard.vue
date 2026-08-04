<template>
  <div class="student-card card" @click="$emit('select', student)">
    <div class="card-image-wrap">
      <div class="card-image" :style="{ backgroundImage: student.avatar_url ? `url(${apiBase}${student.avatar_url})` : 'none' }">
        <div v-if="!student.avatar_url" class="card-avatar-placeholder">
          {{ student.full_name?.charAt(0) }}
        </div>
      </div>
      <div class="card-badge">
        <span class="badge" :class="badgeClass">{{ badgeText }}</span>
      </div>
      <div class="card-overlay">
        <span class="view-detail">{{ $t('student.view_detail') }} →</span>
      </div>
    </div>
    <div class="card-body">
      <h3 class="card-name">{{ student.full_name }}</h3>
      <p class="card-code">{{ student.student_code }}</p>
      <p class="card-dept">{{ student.department }}</p>
      <p class="card-desc">{{ truncatedDesc }}</p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  student: { type: Object, required: true },
})

defineEmits(['select'])

const apiBase = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:3000'

const truncatedDesc = computed(() => {
  if (!props.student.description) return ''
  return props.student.description.length > 120
    ? props.student.description.substring(0, 120) + '...'
    : props.student.description
})

const badgeClass = computed(() => {
  return props.student.achievement_type === 'excellent' ? 'badge-gold' : 'badge-blue'
})

const badgeText = computed(() => {
  return props.student.achievement_type === 'excellent' ? '🏆' : '⭐'
})
</script>

<style scoped>
.student-card {
  cursor: pointer;
  overflow: hidden;
  transition: all var(--transition-base);
}

.student-card:hover {
  transform: translateY(-8px);
  box-shadow: var(--shadow-lg);
}

.card-image-wrap {
  position: relative;
  height: 280px;
  overflow: hidden;
}

.card-image {
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  transition: transform var(--transition-slow);
}

.student-card:hover .card-image {
  transform: scale(1.08);
}

.card-avatar-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--gradient-primary);
  font-size: 4rem;
  font-weight: 800;
  color: var(--color-bg-primary);
}

.card-badge {
  position: absolute;
  top: var(--space-3);
  right: var(--space-3);
  z-index: 2;
}

.card-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(10, 10, 26, 0.9) 0%, transparent 50%);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding-bottom: var(--space-4);
  opacity: 0;
  transition: opacity var(--transition-base);
}

.student-card:hover .card-overlay {
  opacity: 1;
}

.view-detail {
  color: var(--color-text-accent);
  font-weight: 500;
  font-size: var(--text-sm);
}

.card-body {
  padding: var(--space-5);
}

.card-name {
  font-size: var(--text-lg);
  font-weight: 600;
  margin-bottom: var(--space-1);
  color: var(--color-text-white);
}

.card-code {
  font-size: var(--text-sm);
  color: var(--color-text-accent);
  font-weight: 500;
  margin-bottom: var(--space-1);
}

.card-dept {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  margin-bottom: var(--space-3);
}

.card-desc {
  font-size: var(--text-sm);
  color: var(--color-text-muted);
  line-height: 1.6;
}
</style>
