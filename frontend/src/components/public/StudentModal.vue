<template>
  <teleport to="body">
    <transition name="modal">
      <div v-if="visible" class="modal-backdrop" @click.self="$emit('close')">
        <div class="modal-content glass-strong animate-scale-in">
          <button class="modal-close" @click="$emit('close')">✕</button>

          <div class="modal-layout">
            <div class="modal-avatar-section">
              <div class="modal-avatar" :style="{ backgroundImage: student.avatar_url ? `url(${apiBase}${student.avatar_url})` : 'none' }">
                <div v-if="!student.avatar_url" class="modal-avatar-placeholder">
                  {{ student.full_name?.charAt(0) }}
                </div>
              </div>
            </div>

            <div class="modal-info-section">
              <div class="modal-badge">
                <span class="badge" :class="student.achievement_type === 'excellent' ? 'badge-gold' : 'badge-blue'">
                  {{ student.achievement_type === 'excellent' ? '🏆 Sinh Viên Xuất Sắc' : '⭐ Điểm Cao' }}
                </span>
              </div>

              <h2 class="modal-name">{{ student.full_name }}</h2>

              <div class="modal-meta">
                <div class="meta-item">
                  <span class="meta-label">MSSV</span>
                  <span class="meta-value">{{ student.student_code }}</span>
                </div>
                <div class="meta-item">
                  <span class="meta-label">Khoa</span>
                  <span class="meta-value">{{ student.department }}</span>
                </div>
                <div class="meta-item">
                  <span class="meta-label">Kỳ học</span>
                  <span class="meta-value">{{ student.semester_name }} {{ student.semester_year }}</span>
                </div>
              </div>

              <div class="modal-description">
                <h4>Thành Tích</h4>
                <p>{{ student.description }}</p>
              </div>

              <div v-if="student.top_scores?.length" class="modal-scores">
                <h4>Điểm Cao Các Môn</h4>
                <div class="score-list">
                  <div v-for="ts in student.top_scores" :key="ts.id" class="score-item">
                    <span class="score-subject">{{ ts.subject_name }}</span>
                    <span class="score-value">{{ ts.score }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script setup>
defineProps({
  visible: Boolean,
  student: { type: Object, default: () => ({}) },
})
defineEmits(['close'])

const apiBase = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:3000'
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(4px);
  z-index: var(--z-modal-backdrop);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-6);
}

.modal-content {
  position: relative;
  max-width: 800px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  border-radius: var(--radius-xl);
  padding: var(--space-8);
}

.modal-close {
  position: absolute;
  top: var(--space-4);
  right: var(--space-4);
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  color: var(--color-text-secondary);
  font-size: var(--text-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-fast);
  border: none;
  cursor: pointer;
}

.modal-close:hover {
  background: rgba(255, 255, 255, 0.2);
  color: var(--color-text-white);
}

.modal-layout {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: var(--space-8);
}

.modal-avatar {
  width: 100%;
  aspect-ratio: 2/3;
  border-radius: var(--radius-lg);
  background-size: cover;
  background-position: center;
  overflow: hidden;
}

.modal-avatar-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--gradient-primary);
  font-size: 5rem;
  font-weight: 800;
  color: var(--color-bg-primary);
}

.modal-badge {
  margin-bottom: var(--space-4);
}

.modal-name {
  font-size: var(--text-3xl);
  font-weight: 800;
  margin-bottom: var(--space-5);
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.modal-meta {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-4);
  margin-bottom: var(--space-6);
}

.meta-item {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.meta-label {
  font-size: var(--text-xs);
  text-transform: uppercase;
  letter-spacing: 1px;
  color: var(--color-text-muted);
}

.meta-value {
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--color-text-primary);
}

.modal-description h4,
.modal-scores h4 {
  font-size: var(--text-base);
  color: var(--color-text-accent);
  margin-bottom: var(--space-3);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.modal-description p {
  color: var(--color-text-secondary);
  line-height: 1.8;
  margin-bottom: var(--space-6);
}

.score-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.score-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-3) var(--space-4);
  background: rgba(255, 255, 255, 0.03);
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border);
}

.score-subject {
  color: var(--color-text-secondary);
  font-size: var(--text-sm);
}

.score-value {
  font-weight: 700;
  color: var(--color-text-accent);
  font-size: var(--text-lg);
}

/* Modal transitions */
.modal-enter-active { transition: all 0.3s ease; }
.modal-leave-active { transition: all 0.2s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
.modal-enter-from .modal-content { transform: scale(0.9); }

@media (max-width: 768px) {
  .modal-layout {
    grid-template-columns: 1fr;
  }

  .modal-avatar {
    aspect-ratio: 1;
    max-height: 250px;
  }

  .modal-content {
    padding: var(--space-5);
  }

  .modal-name {
    font-size: var(--text-2xl);
  }
}
</style>
