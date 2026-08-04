<template>
  <div class="dashboard">
    <div class="stats-grid">
      <div class="stat-card glass" v-for="stat in stats" :key="stat.label">
        <span class="stat-icon">{{ stat.icon }}</span>
        <div class="stat-info">
          <span class="stat-value">{{ stat.value }}</span>
          <span class="stat-label">{{ stat.label }}</span>
        </div>
      </div>
    </div>

    <div class="dashboard-grid">
      <div class="dashboard-card glass">
        <h3>Sinh Viên Mới Nhất</h3>
        <div class="recent-list">
          <div v-for="s in recentStudents" :key="s.id" class="recent-item">
            <div class="recent-avatar">{{ s.full_name?.charAt(0) }}</div>
            <div class="recent-info">
              <span class="recent-name">{{ s.full_name }}</span>
              <span class="recent-meta">{{ s.department }} · {{ s.student_code }}</span>
            </div>
            <span class="badge" :class="s.achievement_type === 'excellent' ? 'badge-gold' : 'badge-blue'" style="font-size: 0.6rem;">
              {{ s.achievement_type === 'excellent' ? 'Xuất Sắc' : 'Điểm Cao' }}
            </span>
          </div>
        </div>
      </div>

      <div class="dashboard-card glass">
        <h3>Bài Viết Gần Đây</h3>
        <div class="recent-list">
          <div v-for="p in recentPosts" :key="p.id" class="recent-item">
            <div class="recent-avatar post-avatar">📝</div>
            <div class="recent-info">
              <span class="recent-name">{{ p.title }}</span>
              <span class="recent-meta">
                {{ p.is_published ? '✅ Đã xuất bản' : '📋 Bản nháp' }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '../../api/axios'

const stats = ref([
  { icon: '👨‍🎓', label: 'Sinh Viên', value: 0 },
  { icon: '📅', label: 'Kỳ Học', value: 0 },
  { icon: '📝', label: 'Bài Viết', value: 0 },
  { icon: '⭐', label: 'Điểm Cao', value: 0 },
])

const recentStudents = ref([])
const recentPosts = ref([])

onMounted(async () => {
  try {
    const [studentsRes, semestersRes, postsRes, scoresRes] = await Promise.all([
      api.get('/students', { params: { limit: 5 } }),
      api.get('/semesters'),
      api.get('/posts', { params: { limit: 5 } }),
      api.get('/top-scores'),
    ])

    stats.value[0].value = studentsRes.data.total || 0
    stats.value[1].value = semestersRes.data.length || 0
    stats.value[2].value = postsRes.data.total || 0
    stats.value[3].value = scoresRes.data.length || 0

    recentStudents.value = studentsRes.data.students || []
    recentPosts.value = postsRes.data.posts || []
  } catch (error) {
    console.error('Dashboard load error:', error)
  }
})
</script>

<style scoped>
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: var(--space-5);
  margin-bottom: var(--space-8);
}

.stat-card {
  padding: var(--space-6);
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  gap: var(--space-4);
  transition: all var(--transition-base);
}

.stat-card:hover {
  transform: translateY(-2px);
  border-color: var(--color-border-hover);
}

.stat-icon {
  font-size: 2.5rem;
}

.stat-value {
  display: block;
  font-size: var(--text-3xl);
  font-weight: 800;
  font-family: var(--font-heading);
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.stat-label {
  font-size: var(--text-sm);
  color: var(--color-text-muted);
}

.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: var(--space-6);
}

.dashboard-card {
  padding: var(--space-6);
  border-radius: var(--radius-lg);
}

.dashboard-card h3 {
  font-size: var(--text-lg);
  font-weight: 700;
  margin-bottom: var(--space-5);
  color: var(--color-text-primary);
}

.recent-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.recent-item {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3);
  border-radius: var(--radius-md);
  transition: background var(--transition-fast);
}

.recent-item:hover {
  background: rgba(255, 255, 255, 0.03);
}

.recent-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--gradient-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  color: var(--color-bg-primary);
  flex-shrink: 0;
}

.post-avatar {
  background: var(--gradient-secondary);
  font-size: var(--text-lg);
}

.recent-info {
  flex: 1;
  min-width: 0;
}

.recent-name {
  display: block;
  font-weight: 600;
  font-size: var(--text-sm);
  color: var(--color-text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.recent-meta {
  font-size: var(--text-xs);
  color: var(--color-text-muted);
}

@media (max-width: 768px) {
  .dashboard-grid {
    grid-template-columns: 1fr;
  }
}
</style>
