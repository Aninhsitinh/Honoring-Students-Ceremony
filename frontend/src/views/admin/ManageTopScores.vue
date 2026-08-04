<template>
  <div class="manage-page">
    <div class="page-top">
      <select v-model="filterSemester" class="form-select" style="max-width: 200px;">
        <option value="">Tất cả kỳ học</option>
        <option v-for="sem in semesters" :key="sem.id" :value="sem.id">{{ sem.name }} {{ sem.year }}</option>
      </select>
      <button class="btn btn-primary" @click="openForm()">+ Thêm Điểm Cao</button>
    </div>

    <div class="data-table-wrap glass">
      <table class="data-table">
        <thead>
          <tr>
            <th>Sinh Viên</th>
            <th>MSSV</th>
            <th>Môn Học</th>
            <th>Điểm</th>
            <th>Kỳ Học</th>
            <th>Thao Tác</th>
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
                <button class="btn btn-secondary btn-sm" @click="openForm(ts)">Sửa</button>
                <button class="btn btn-danger btn-sm" @click="deleteScore(ts.id)">Xóa</button>
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
          <h3 class="modal-title gradient-text">{{ editingId ? 'Sửa Điểm Cao' : 'Thêm Điểm Cao' }}</h3>

          <form @submit.prevent="saveScore">
            <div class="form-group">
              <label class="form-label">Sinh viên *</label>
              <select v-model="form.student_id" class="form-select" required>
                <option v-for="s in allStudents" :key="s.id" :value="s.id">{{ s.full_name }} ({{ s.student_code }})</option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">Môn học *</label>
              <input v-model="form.subject_name" class="form-input" required placeholder="VD: Machine Learning" />
            </div>

            <div class="form-group">
              <label class="form-label">Điểm *</label>
              <input v-model.number="form.score" type="number" step="0.01" min="0" max="10" class="form-input" required />
            </div>

            <div class="form-group">
              <label class="form-label">Kỳ học *</label>
              <select v-model="form.semester_id" class="form-select" required>
                <option v-for="sem in semesters" :key="sem.id" :value="sem.id">{{ sem.name }} {{ sem.year }}</option>
              </select>
            </div>

            <div class="form-actions">
              <button type="button" class="btn btn-secondary" @click="showForm = false">Hủy</button>
              <button type="submit" class="btn btn-primary" :disabled="saving">{{ saving ? 'Đang lưu...' : 'Lưu' }}</button>
            </div>
          </form>
        </div>
      </div>
    </teleport>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import api from '../../api/axios'

const topScores = ref([])
const semesters = ref([])
const allStudents = ref([])
const filterSemester = ref('')
const showForm = ref(false)
const editingId = ref(null)
const saving = ref(false)

const form = ref({ student_id: '', subject_name: '', score: '', semester_id: '' })

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
  } catch (err) { alert(err.response?.data?.message || 'Lỗi') } finally { saving.value = false }
}

async function deleteScore(id) {
  if (!confirm('Xóa?')) return
  try { await api.delete(`/top-scores/${id}`); loadData() } catch { alert('Lỗi') }
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
