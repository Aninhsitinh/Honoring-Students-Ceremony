<template>
  <div class="manage-page">
    <div class="page-top">
      <div class="page-top-left">
        <select v-model="filterSemester" class="form-select" style="max-width: 200px;">
          <option v-for="sem in semesters" :key="sem.id" :value="sem.id">{{ tSem(sem.name, $t) }} {{ sem.year }}</option>
        </select>
      </div>
      <div class="page-top-right" style="display: flex; gap: var(--space-3); align-items: center;">
        <button class="btn btn-secondary" @click="exportExcel">
          <span class="icon" v-html="downloadIcon"></span> {{ $t('admin.export_excel') }}
        </button>
        <button class="btn btn-primary" @click="openForm()">+ {{ $t('admin.add_topscore') }}</button>
      </div>
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
            <td>{{ tSem(ts.semester_name, $t) }} {{ ts.semester_year }}</td>
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
          <button class="modal-close" @click="showForm = false" v-html="xIcon"></button>
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
              <select v-if="availableSubjects.length > 0" v-model="form.subject_name" class="form-select" required>
                <option value="" disabled>{{ $t('admin.select_subject') }}</option>
                <option v-for="sub in availableSubjects" :key="sub.id" :value="sub.code + ' ' + sub.name">{{ sub.code }} - {{ sub.name }}</option>
              </select>
              <input v-else v-model="form.subject_name" class="form-input" required :placeholder="$t('admin.type_subject')" />
            </div>

            <div class="form-group">
              <label class="form-label">{{ $t('home.score') }} *</label>
              <input v-model.number="form.score" type="number" step="0.01" min="0" max="100" class="form-input" required />
            </div>

            <div class="form-group">
              <label class="form-label">{{ $t('student.semester') }} *</label>
              <select v-model="form.semester_id" class="form-select" required>
                <option v-for="sem in semesters" :key="sem.id" :value="sem.id">{{ tSem(sem.name, $t) }} {{ sem.year }}</option>
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
import { ref, watch, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import api from '../../api/axios'
import { tSem } from '../../utils/translate'
import icons from '../../utils/icons'
import * as XLSX from 'xlsx'
import { toast } from '../../utils/toast'
import { useConfirm } from '../../utils/confirm'

const xIcon = icons.x
const downloadIcon = icons.download || '<svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>'
const { t: $t } = useI18n()
const { confirm } = useConfirm()
const router = useRouter()
const route = useRoute()
const topScores = ref([])
const semesters = ref([])
const allStudents = ref([])
const filterSemester = ref(route.query.semester || '')
const showForm = ref(false)
const editingId = ref(null)
const saving = ref(false)

const form = ref({ student_id: '', subject_name: '', score: '', semester_id: '' })

watch(filterSemester, (newVal) => {
  router.replace({ query: { ...route.query, semester: newVal || undefined } })
  loadData()
})

function exportExcel() {
  if (!topScores.value.length) {
    toast.error($t('admin.no_export_data'))
    return
  }
  const dataToExport = topScores.value.map(ts => ({
    'Họ và Tên': ts.full_name,
    'MSSV': ts.student_code,
    'Môn học': ts.subject_name,
    'Điểm': ts.score,
    'Kỳ học': ts.semester_name + ' ' + ts.semester_year,
  }))
  const ws = XLSX.utils.json_to_sheet(dataToExport)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, "Top_Scores")
  XLSX.writeFile(wb, "Danh_Sach_Thu_Khoa.xlsx")
}

const allSubjects = ref([])
const availableSubjects = ref([])

const selectedStudent = computed(() => allStudents.value.find(s => s.id === form.value.student_id))

watch(() => form.value.student_id, async (newVal) => {
  if (!newVal) {
    availableSubjects.value = []
    return
  }
  const student = allStudents.value.find(s => s.id === newVal)
  if (student && student.department) {
    const { data } = await api.get('/subjects', { params: { department: student.department } })
    availableSubjects.value = data
  } else {
    availableSubjects.value = []
  }
  // If editing, keep the current subject, else reset it
  if (!editingId.value) {
    form.value.subject_name = ''
  }
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
    // We also need to fetch subjects if editing, but the watcher on student_id handles it partially.
    // However, since we populate form.value at once, the watcher triggers.
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
  const ok = await confirm($t('admin.confirm_delete'), {
    title: $t('admin.delete') + ' điểm cao',
    confirmText: $t('admin.delete'),
    type: 'danger',
  })
  if (!ok) return
  try {
    await api.delete(`/top-scores/${id}`)
    toast.success($t('admin.delete_success') || 'Xóa thành công!')
    loadData()
  } catch {
    toast.error($t('admin.error_delete'))
  }
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
.modal-close { position: absolute; top: var(--space-4); right: var(--space-4); width: 36px; height: 36px; border-radius: 50%; background: var(--color-bg-card); color: var(--color-text-secondary); font-size: var(--text-lg); display: flex; align-items: center; justify-content: center; border: 1px solid var(--color-border); cursor: pointer; }
.modal-close:hover { background: var(--color-bg-card-hover); color: var(--color-text-primary); }
.modal-title { font-size: var(--text-xl); font-weight: 800; margin-bottom: var(--space-6); }
.form-actions { display: flex; justify-content: flex-end; gap: var(--space-3); margin-top: var(--space-6); }
</style>
