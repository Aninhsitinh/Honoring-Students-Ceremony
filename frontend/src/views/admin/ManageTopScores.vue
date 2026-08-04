<template>
  <div class="manage-page">
    <div class="page-top">
      <select v-model="filterSemester" class="form-select" style="max-width: 200px;">
        <option value="">{{ $t('admin.all_semesters') }}</option>
        <option v-for="sem in semesters" :key="sem.id" :value="sem.id">{{ sem.name }} {{ sem.year }}</option>
      </select>
      <button class="btn btn-primary" @click="openForm()">+ {{ $t('admin.add_topscore') }}</button>
    </div>

    <div class="data-table-wrap glass">
      <table class="data-table">
        <thead>
          <tr>
            <th>{{ $t('hero.students') }}</th>
            <th>{{ $t('student.id') }}</th>
            <th>{{ $t('home.subject') }}</th>
            <th>{{ $t('home.score') }}</th>
            <th>{{ $t('student.semester') }}</th>
            <th>{{ $t('admin.actions') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="ts in topScores" :key="ts.id">
            <td>{{ ts.full_name }}</td>
            <td><span style="color: var(--color-text-accent); font-weight: 600;">{{ ts.student_code }}</span></td>
            <td>{{ ts.subject_name }}</td>
            <td><span class="score-cell">{{ ts.score }}</span></td>
            <td>{{ ts.semester_name }} {{ ts.semester_year }}</td>
            <td>
              <div class="actions">
                <button class="btn btn-secondary btn-sm" @click="openForm(ts)">{{ $t('admin.edit') }}</button>
                <button class="btn btn-danger btn-sm" @click="deleteScore(ts.id)">{{ $t('admin.delete') }}</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Form Modal -->
    <teleport to="body">
      <div v-if="showForm" class="modal-backdrop" @click.self="showForm = false">
        <div class="modal-content glass-strong animate-scale-in" style="max-width: 500px;">
          <button class="modal-close" @click="showForm = false">✕</button>
          <h3 class="modal-title gradient-text">{{ editingId ? $t('admin.edit_topscore') : $t('admin.add_topscore') }}</h3>

          <form @submit.prevent="saveScore">
            <div class="form-group">
              <label class="form-label">{{ $t('hero.students') }} *</label>
              <select v-model="form.student_id" class="form-select" required>
                <option v-for="s in allStudents" :key="s.id" :value="s.id">{{ s.full_name }} ({{ s.student_code }})</option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">{{ $t('home.subject') }} *</label>
              <select v-if="isITStudent" v-model="form.subject_name" class="form-select" required>
                <option value="" disabled>{{ $t('admin.select_subject') }}</option>
                <option v-for="sub in IT_SUBJECTS" :key="sub" :value="sub">{{ sub }}</option>
              </select>
              <select v-else-if="isAIDSStudent" v-model="form.subject_name" class="form-select" required>
                <option value="" disabled>{{ $t('admin.select_subject') }}</option>
                <option v-for="sub in AI_DS_SUBJECTS" :key="sub" :value="sub">{{ sub }}</option>
              </select>
              <select v-else-if="isAICyberStudent" v-model="form.subject_name" class="form-select" required>
                <option value="" disabled>{{ $t('admin.select_subject') }}</option>
                <option v-for="sub in AI_CYBER_SUBJECTS" :key="sub" :value="sub">{{ sub }}</option>
              </select>
              <input v-else v-model="form.subject_name" class="form-input" required :placeholder="$t('admin.type_subject')" />
            </div>

            <div class="form-group">
              <label class="form-label">{{ $t('home.score') }} *</label>
              <input v-model.number="form.score" type="number" step="0.01" min="0" max="10" class="form-input" required />
            </div>

            <div class="form-group">
              <label class="form-label">{{ $t('student.semester') }} *</label>
              <select v-model="form.semester_id" class="form-select" required>
                <option v-for="sem in semesters" :key="sem.id" :value="sem.id">{{ sem.name }} {{ sem.year }}</option>
              </select>
            </div>

            <div class="form-actions">
              <button type="button" class="btn btn-secondary" @click="showForm = false">{{ $t('admin.cancel') }}</button>
              <button type="submit" class="btn btn-primary" :disabled="saving">{{ saving ? $t('admin.saving') : $t('admin.save') }}</button>
            </div>
          </form>
        </div>
      </div>
    </teleport>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, computed } from 'vue'
import api from '../../api/axios'
import { useI18n } from 'vue-i18n'

const { t: $t } = useI18n()
const topScores = ref([])
const semesters = ref([])
const allStudents = ref([])
const filterSemester = ref('')
const showForm = ref(false)
const editingId = ref(null)
const saving = ref(false)

const form = ref({ student_id: '', subject_name: '', score: '', semester_id: '' })

const DEPARTMENTS = {
  GCS: [
    'Công nghệ thông tin',
    'Trí tuệ nhân tạo và Khoa học dữ liệu',
    'Trí tuệ nhân tạo và An ninh mạng'
  ]
}

const IT_SUBJECTS = [
  'COMP1753 Programming Foundations',
  'COMP1856 Software Engineering',
  'COMP1845 Systems Development',
  'MATH1179 Mathematics for Computer Science',
  'COMP1857 Introduction to Data Science',
  'COMP1752 Object Oriented Programming',
  'COMP1843 Principles of Security',
  'COMP1589 Computer Systems and Internet Technologies',
  'COMP1773 User Interface Design',
  'COMP1841 Web Programming 1',
  'COMP1770 Professional Project Management',
  'AIGW201 Introduction to Artificial Intelligence',
  'COMP1551 Application Development',
  'COMP1810 Data and Web Analytics',
  'COMP1807 Agile Development with SCRUM',
  'COMP1842 Web Programming 2',
  'COMP1844 Information Analysis and Visualisation',
  'AMD201 Advanced Microservices Development and Deployment',
  'COMP1858 Data Structures and Algorithms',
  'COMP1643 Information and Content Management',
  'COMP1649 Human Computer Interaction and Design',
  'COMP1787 Requirements Management',
  'COMP1786 Mobile Application Design and Development',
  'COMP1682 Final Year Projects',
  'OJT On the Job Training'
]

const AI_DS_SUBJECTS = [
  'COMP1753 Programming Foundations',
  'COMP1856 Software Engineering',
  'COMP1845 Systems Development',
  'MATH1179 Mathematics for Computer Science',
  'COMP1857 Introduction to Data Science',
  'COMP1752 Object Oriented Programming',
  'COMP1843 Principles of Security',
  'COMP1589 Computer Systems and Internet Technologies',
  'MACG101 Advanced math for Computer Science',
  'COMP1773 User Interface Design',
  'COMP1841 Web Programming 1',
  'COMP1770 Professional Project Management',
  'AIGW201 Introduction to Artificial Intelligence',
  'COMP1551 Application Development',
  'COMP1807 Agile Development with SCRUM',
  'COMP1891 Applications in AI and Data Science',
  'COMP1842 Web Programming 2',
  'COMP1858 Data Structures and Algorithms',
  'FCVG101 Fundamentals of Computer Vision',
  'COMP1682 Final Year Projects',
  'COMP1861 Machine Learning',
  'COMP1921 Advanced Topics in Data Science and AI',
  'DPLG101 Deep Learning',
  'COMP1787 Requirements Management',
  'COMP1649 Human Computer Interaction and Design',
  'OJT On the Job Training'
]

const AI_CYBER_SUBJECTS = [
  'COMP1753 Programming Foundations',
  'COMP1856 Software Engineering',
  'COMP1845 Systems Development',
  'MATH1179 Mathematics for Computer Science',
  'COMP1857 Introduction to Data Science',
  'COMP1752 Object Oriented Programming',
  'COMP1843 Principles of Security',
  'COMP1589 Computer Systems and Internet Technologies',
  'MACG101 Advanced math for Computer Science',
  'COMP1773 User Interface Design',
  'COMP1841 Web Programming 1',
  'COMP1770 Professional Project Management',
  'AIGW201 Introduction to Artificial Intelligence',
  'COMP1551 Application Development',
  'COMP1807 Agile Development with SCRUM',
  'COMP1891 Applications in AI and Data Science',
  'COMP1842 Web Programming 2',
  'COMP1806 Information Security',
  'FCVG101 Fundamentals of Computer Vision',
  'COMP1682 Final Year Projects',
  'COMP1664 Network Technology',
  'COMP1860 IT Security and Privacy Risk Management',
  'DPLG101 Deep Learning',
  'COMP1787 Requirements Management',
  'COMP1859 Information Retrieval',
  'OJT On the Job Training'
]

const selectedStudent = computed(() => allStudents.value.find(s => s.id === form.value.student_id))
const isITStudent = computed(() => {
  if (!selectedStudent.value) return false
  return selectedStudent.value.department === 'Công nghệ thông tin'
})
const isAIDSStudent = computed(() => {
  if (!selectedStudent.value) return false
  return selectedStudent.value.department === 'Trí tuệ nhân tạo và Khoa học dữ liệu'
})
const isAICyberStudent = computed(() => {
  if (!selectedStudent.value) return false
  return selectedStudent.value.department === 'Trí tuệ nhân tạo và An ninh mạng'
})

async function loadData() {
  const params = {}
  if (filterSemester.value) params.semester_id = filterSemester.value
  const { data } = await api.get('/top-scores', { params })
  topScores.value = data
}

async function loadSemesters() {
  const { data } = await api.get('/semesters')
  semesters.value = data
}

async function loadStudents() {
  const { data } = await api.get('/students', { params: { limit: 200 } })
  allStudents.value = data.students || []
}

function openForm(item = null) {
  if (item) {
    editingId.value = item.id
    form.value = { student_id: item.student_id, subject_name: item.subject_name, score: item.score, semester_id: item.semester_id }
  } else {
    editingId.value = null
    form.value = { student_id: allStudents.value[0]?.id || '', subject_name: '', score: '', semester_id: semesters.value[0]?.id || '' }
  }
  showForm.value = true
}

async function saveScore() {
  saving.value = true
  try {
    if (editingId.value) {
      await api.put(`/top-scores/${editingId.value}`, form.value)
    } else {
      await api.post('/top-scores', form.value)
    }
    showForm.value = false
    loadData()
  } catch (err) { alert(err.response?.data?.message || $t('admin.error_save')) } finally { saving.value = false }
}

async function deleteScore(id) {
  if (!confirm($t('admin.confirm_delete'))) return
  try { await api.delete(`/top-scores/${id}`); loadData() } catch { alert($t('admin.error_delete')) }
}

watch(filterSemester, loadData)
onMounted(() => { loadSemesters(); loadStudents(); loadData() })
</script>

<style scoped>
.manage-page { animation: fadeIn 0.3s ease; }
.page-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-6); flex-wrap: wrap; gap: var(--space-4); }
.data-table-wrap { border-radius: var(--radius-lg); overflow-x: auto; }
.data-table { width: 100%; border-collapse: collapse; min-width: 700px; }
.data-table th { text-align: left; padding: var(--space-4) var(--space-5); font-size: var(--text-xs); text-transform: uppercase; letter-spacing: 1px; color: var(--color-text-muted); border-bottom: 1px solid var(--color-border); }
.data-table td { padding: var(--space-3) var(--space-5); border-bottom: 1px solid rgba(255,255,255,0.03); font-size: var(--text-sm); color: var(--color-text-secondary); }
.data-table tr:hover td { background: rgba(255,255,255,0.02); }
.score-cell { background: var(--gradient-primary); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; font-weight: 800; font-size: var(--text-lg); }
.actions { display: flex; gap: var(--space-2); }
.modal-backdrop { position: fixed; inset: 0; background: rgba(0,0,0,0.7); backdrop-filter: blur(4px); z-index: var(--z-modal-backdrop); display: flex; align-items: center; justify-content: center; padding: var(--space-6); }
.modal-content { position: relative; width: 100%; max-height: 90vh; overflow-y: auto; border-radius: var(--radius-xl); padding: var(--space-8); }
.modal-close { position: absolute; top: var(--space-4); right: var(--space-4); width: 36px; height: 36px; border-radius: 50%; background: rgba(255,255,255,0.1); color: var(--color-text-secondary); font-size: var(--text-lg); display: flex; align-items: center; justify-content: center; border: none; cursor: pointer; }
.modal-title { font-size: var(--text-xl); font-weight: 800; margin-bottom: var(--space-6); }
.form-actions { display: flex; justify-content: flex-end; gap: var(--space-3); margin-top: var(--space-6); }
</style>
