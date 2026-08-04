<template>
  <section class="hero">
    <div class="hero-overlay"></div>
    <div class="hero-content container">
      <div class="hero-badge animate-fade-in-down">
        <span class="badge badge-gold">{{ activeSemester?.name }} {{ activeSemester?.year }}</span>
      </div>
      <h1 class="hero-title animate-fade-in-up">
        <span class="hero-title-line">Lễ Vinh Danh</span>
        <span class="hero-title-accent gradient-text">Sinh Viên Xuất Sắc</span>
      </h1>
      <p class="hero-description animate-fade-in-up delay-200">
        Tôn vinh những sinh viên có thành tích học tập xuất sắc, đạt điểm cao nhất
        từng môn và có đóng góp nổi bật trong các hoạt động của trường.
      </p>
      <div class="hero-stats animate-fade-in-up delay-400">
        <div class="stat-item">
          <span class="stat-number">{{ studentCount }}+</span>
          <span class="stat-label">Sinh Viên</span>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-item">
          <span class="stat-number">{{ semesterCount }}</span>
          <span class="stat-label">Kỳ Học</span>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-item">
          <span class="stat-number">{{ subjectCount }}+</span>
          <span class="stat-label">Môn Học</span>
        </div>
      </div>
      <div class="hero-scroll animate-fade-in delay-600">
        <span>Khám phá thêm</span>
        <div class="scroll-indicator">
          <div class="scroll-dot"></div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { useSemesterStore } from '../../stores/semester'
import { useStudentStore } from '../../stores/student'

const semesterStore = useSemesterStore()
const studentStore = useStudentStore()

const activeSemester = computed(() => semesterStore.selectedSemester)
const studentCount = computed(() => studentStore.total || 0)
const semesterCount = computed(() => semesterStore.semesters.length)
const subjectCount = computed(() => 8)
</script>

<style scoped>
.hero {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--gradient-hero);
  overflow: hidden;
}

.hero-overlay {
  position: absolute;
  inset: 0;
  background-image: radial-gradient(circle at 15% 50%, rgba(45, 212, 191, 0.05) 0%, transparent 40%),
                    radial-gradient(circle at 85% 30%, rgba(14, 165, 233, 0.05) 0%, transparent 40%);
  z-index: 1;
}

.hero-content {
  position: relative;
  z-index: 2;
  text-align: center;
  padding: var(--space-24) var(--space-6);
}

.hero-badge {
  margin-bottom: var(--space-6);
}

.hero-title {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  margin-bottom: var(--space-6);
}

.hero-title-line {
  font-size: var(--text-3xl);
  font-weight: 400;
  color: var(--color-text-secondary);
  letter-spacing: 6px;
  text-transform: uppercase;
}

.hero-title-accent {
  font-size: var(--text-6xl);
  font-weight: 800;
  letter-spacing: -1px;
}

.hero-description {
  max-width: 650px;
  margin: 0 auto var(--space-10);
  color: var(--color-text-muted);
  font-size: var(--text-lg);
  line-height: 1.8;
}

.hero-stats {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-8);
  margin-bottom: var(--space-12);
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.stat-number {
  font-size: var(--text-4xl);
  font-weight: 700;
  font-family: var(--font-heading);
  color: var(--color-text-primary);
}

.stat-label {
  font-size: var(--text-sm);
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.stat-divider {
  width: 1px;
  height: 50px;
  background: var(--color-border);
}

.hero-scroll {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-3);
  color: var(--color-text-muted);
  font-size: var(--text-sm);
}

.scroll-indicator {
  width: 24px;
  height: 40px;
  border: 1.5px solid var(--color-border);
  border-radius: var(--radius-full);
  display: flex;
  justify-content: center;
  padding-top: 8px;
}

.scroll-dot {
  width: 4px;
  height: 8px;
  background: var(--color-text-accent);
  border-radius: var(--radius-full);
  animation: float 1.5s ease-in-out infinite;
}

@media (max-width: 768px) {
  .hero-title-line {
    font-size: var(--text-xl);
    letter-spacing: 4px;
  }

  .hero-title-accent {
    font-size: var(--text-4xl);
  }

  .hero-stats {
    gap: var(--space-4);
  }

  .stat-number {
    font-size: var(--text-2xl);
  }

  .hero-description {
    font-size: var(--text-base);
  }
}
</style>
