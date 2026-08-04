<template>
  <div class="home-page">
    <HeroSection />

    <!-- Excellent Students Section -->
    <section class="section students-section">
      <div class="container">
        <h2 class="section-title">
          <span class="gradient-text">{{ $t('home.top_students') }}</span>
        </h2>
        <p class="section-subtitle">
          {{ $t('home.top_students_desc') }} - {{ selectedSemester?.name }} {{ selectedSemester?.year }}
        </p>

        <SearchBar v-model="searchQuery" />

        <div class="filter-tabs">
          <button
            class="filter-tab"
            :class="{ active: filterType === 'all' }"
            @click="filterType = 'all'"
          >{{ $t('home.view_all') }}</button>
          <button
            class="filter-tab"
            :class="{ active: filterType === 'excellent' }"
            @click="filterType = 'excellent'"
          >🏆 {{ $t('home.top_students') }}</button>
          <button
            class="filter-tab"
            :class="{ active: filterType === 'top_score' }"
            @click="filterType = 'top_score'"
          >⭐ {{ $t('home.highest_scores') }}</button>
        </div>

        <div v-if="loading" class="loading-state">
          <div class="loader"></div>
          <p>Loading...</p>
        </div>

        <div v-else-if="students.length" class="students-grid">
          <StudentCard
            v-for="(student, index) in students"
            :key="student.id"
            :student="student"
            :style="{ animationDelay: `${index * 0.1}s` }"
            class="animate-fade-in-up"
            @select="openModal(student)"
          />
        </div>

        <div v-else class="empty-state">
          <span class="empty-icon">📭</span>
          <p>{{ $t('home.no_students') }}</p>
        </div>
      </div>
    </section>

    <!-- Top Scores Section -->
    <section class="section top-scores-section">
      <div class="container">
        <h2 class="section-title">
          <span class="gradient-text">{{ $t('home.highest_scores') }}</span>
        </h2>
        <p class="section-subtitle">
          {{ $t('home.highest_scores_desc') }}
        </p>

        <div v-if="topScores.length" class="scores-table-wrap glass">
          <table class="scores-table">
            <thead>
              <tr>
                <th>{{ $t('home.subject') }}</th>
                <th>{{ $t('hero.students') }}</th>
                <th>ID</th>
                <th>Department</th>
                <th>{{ $t('home.score') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="ts in topScores" :key="ts.id" class="animate-fade-in-up">
                <td>
                  <span class="subject-name">{{ ts.subject_name }}</span>
                </td>
                <td>
                  <span class="student-name">{{ ts.full_name }}</span>
                </td>
                <td>
                  <span class="student-code-cell">{{ ts.student_code }}</span>
                </td>
                <td>
                  <span class="dept-cell">{{ ts.department }}</span>
                </td>
                <td>
                  <span class="score-badge">{{ ts.score }}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <!-- News Section -->
    <section class="section news-section" v-if="posts.length">
      <div class="container">
        <h2 class="section-title">
          <span class="gradient-text">{{ $t('home.latest_news') }}</span>
        </h2>
        <p class="section-subtitle">
          {{ $t('home.latest_news_desc') }}
        </p>

        <div class="posts-grid">
          <PostCard
            v-for="post in posts"
            :key="post.id"
            :post="post"
            class="animate-fade-in-up"
          />
        </div>

        <div class="view-all-wrap">
          <router-link to="/tin-tuc" class="btn btn-secondary">
            {{ $t('home.view_all') }} →
          </router-link>
        </div>
      </div>
    </section>

    <!-- Student Modal -->
    <StudentModal
      :visible="modalVisible"
      :student="modalStudent"
      @close="modalVisible = false"
    />
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useSemesterStore } from '../../stores/semester'
import { useStudentStore } from '../../stores/student'
import api from '../../api/axios'
import HeroSection from '../../components/public/HeroSection.vue'
import StudentCard from '../../components/public/StudentCard.vue'
import StudentModal from '../../components/public/StudentModal.vue'
import SearchBar from '../../components/public/SearchBar.vue'
import PostCard from '../../components/public/PostCard.vue'

const semesterStore = useSemesterStore()
const studentStore = useStudentStore()

const searchQuery = ref('')
const filterType = ref('all')
const topScores = ref([])
const posts = ref([])
const modalVisible = ref(false)
const modalStudent = ref({})

const students = computed(() => studentStore.students)
const loading = computed(() => studentStore.loading)
const selectedSemester = computed(() => semesterStore.selectedSemester)

async function loadData() {
  const semId = selectedSemester.value?.id
  if (!semId) return

  const params = { semester_id: semId }
  if (filterType.value !== 'all') params.achievement_type = filterType.value
  if (searchQuery.value) params.search = searchQuery.value

  studentStore.fetchStudents(params)

  // Load top scores
  try {
    const { data } = await api.get('/top-scores', { params: { semester_id: semId } })
    topScores.value = data
  } catch { topScores.value = [] }

  // Load posts
  try {
    const { data } = await api.get('/posts', { params: { semester_id: semId, is_published: true, limit: 3 } })
    posts.value = data.posts || []
  } catch { posts.value = [] }
}

async function openModal(student) {
  try {
    const data = await studentStore.fetchStudent(student.id)
    modalStudent.value = data
    modalVisible.value = true
  } catch {
    modalStudent.value = student
    modalVisible.value = true
  }
}

// Debounce search
let searchTimeout = null
watch(searchQuery, () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(loadData, 400)
})

watch([selectedSemester, filterType], loadData)

onMounted(() => {
  semesterStore.fetchAll().then(() => {
    if (selectedSemester.value) loadData()
  })
})
</script>

<style scoped>
.students-section {
  background: var(--gradient-section-alt);
}

.filter-tabs {
  display: flex;
  justify-content: center;
  gap: var(--space-3);
  margin: var(--space-8) 0;
}

.filter-tab {
  padding: var(--space-2) var(--space-5);
  border-radius: var(--radius-full);
  background: var(--color-bg-glass);
  border: 1px solid var(--color-border);
  color: var(--color-text-secondary);
  font-size: var(--text-sm);
  font-weight: 500;
  transition: all var(--transition-fast);
  cursor: pointer;
}

.filter-tab:hover {
  background: var(--color-bg-glass-strong);
}

.filter-tab.active {
  background: var(--gradient-primary);
  color: var(--color-bg-primary);
  border-color: transparent;
  font-weight: 700;
}

.students-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: var(--space-6);
  margin-top: var(--space-8);
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
  width: 40px;
  height: 40px;
  border: 3px solid var(--color-border);
  border-top-color: var(--color-text-accent);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

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

/* Top Scores */
.top-scores-section {
  background: var(--color-bg-primary);
}

.scores-table-wrap {
  border-radius: var(--radius-lg);
  overflow: hidden;
  margin-top: var(--space-8);
}

.scores-table {
  width: 100%;
  border-collapse: collapse;
}

.scores-table th {
  text-align: left;
  padding: var(--space-4) var(--space-5);
  font-size: var(--text-xs);
  text-transform: uppercase;
  letter-spacing: 1px;
  color: var(--color-text-muted);
  border-bottom: 1px solid var(--color-border);
}

.scores-table td {
  padding: var(--space-4) var(--space-5);
  border-bottom: 1px solid rgba(255, 255, 255, 0.03);
}

.scores-table tr:hover td {
  background: rgba(255, 215, 0, 0.03);
}

.subject-name {
  font-weight: 600;
  color: var(--color-text-primary);
}

.student-name {
  color: var(--color-text-primary);
  font-weight: 500;
}

.student-code-cell {
  color: var(--color-text-accent);
  font-size: var(--text-sm);
  font-weight: 600;
}

.dept-cell {
  color: var(--color-text-secondary);
  font-size: var(--text-sm);
}

.score-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 48px;
  padding: var(--space-1) var(--space-3);
  background: var(--gradient-primary);
  color: var(--color-bg-primary);
  font-weight: 800;
  font-size: var(--text-sm);
  border-radius: var(--radius-full);
}

/* News */
.news-section {
  background: var(--gradient-section-alt);
}

.posts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: var(--space-6);
  margin-top: var(--space-8);
}

.view-all-wrap {
  text-align: center;
  margin-top: var(--space-10);
}

@media (max-width: 768px) {
  .filter-tabs {
    flex-wrap: wrap;
  }

  .students-grid {
    grid-template-columns: 1fr;
  }

  .posts-grid {
    grid-template-columns: 1fr;
  }

  .scores-table-wrap {
    overflow-x: auto;
  }

  .scores-table {
    min-width: 600px;
  }
}
</style>
