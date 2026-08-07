<template>
  <div class="manage-page">
    <div class="page-top">
      <div class="page-top-left">
        <select v-model="filterSemester" class="form-select" style="max-width: 200px;">
          <option value="">{{ $t('admin.all_semesters') }}</option>
          <option v-for="sem in semesters" :key="sem.id" :value="sem.id">{{ tSem(sem.name, $t) }} {{ sem.year }}</option>
        </select>
      </div>
      <div class="page-top-right" style="display: flex; gap: var(--space-3); align-items: center;">
        <button class="btn btn-danger" v-if="selectedIds.length > 0" @click="bulkDelete">
          <span class="icon" v-html="trashIcon"></span> {{ $t('admin.delete') }} ({{ selectedIds.length }})
        </button>
        <button class="btn btn-secondary" @click="exportExcel">
          <span class="icon" v-html="downloadIcon"></span> {{ $t('admin.export_excel') }}
        </button>
        <input type="file" ref="fileInput" @change="handleImport" accept=".xlsx, .xls, .csv" style="display: none">
        <button class="btn btn-secondary" @click="triggerFileInput" :disabled="importing">
          <span class="icon" v-html="uploadIcon"></span>
          <span v-if="!importing">{{ $t('admin.import_excel') }}</span>
          <span v-else>{{ importProgress.done }}/{{ importProgress.total }} {{ $t('admin.importing') }}</span>
        </button>
        <button class="btn btn-primary" @click="openForm()">+ {{ $t('admin.add_student') }}</button>
      </div>
    </div>

    <!-- Import progress bar -->
    <div v-if="importing" class="import-progress-bar-wrap">
      <div
        class="import-progress-bar"
        :style="{ width: importProgress.total ? (importProgress.done / importProgress.total * 100) + '%' : '0%' }"
      ></div>
    </div>
    <div class="data-table-wrap glass">
      <table class="data-table">
        <thead>
          <tr>
            <th style="width: 50px; text-align: center;">
              <input type="checkbox" :checked="allSelected" @change="toggleAll">
            </th>
            <th>{{ $t('hero.students') }}</th>
            <th>{{ $t('student.id') }}</th>
            <th>{{ $t('student.department') }}</th>
            <th>{{ $t('admin.student_type') }}</th>
            <th>{{ $t('student.semester') }}</th>
            <th>{{ $t('admin.actions') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="s in students" :key="s.id">
            <td style="text-align: center;">
              <input type="checkbox" :value="s.id" v-model="selectedIds">
            </td>
            <td>
              <div class="cell-user">
                <div class="cell-avatar">{{ s.full_name?.charAt(0) }}</div>
                <span>{{ s.full_name }}</span>
              </div>
            </td>
            <td><span class="code-cell">{{ s.student_code }}</span></td>
            <td>{{ s.department }}</td>
            <td>
              <span class="badge" :class="s.achievement_type === 'excellent' ? 'badge-gold' : 'badge-blue'">
                {{ s.achievement_type === 'excellent' ? $t('admin.type_excellent') : $t('admin.type_topscore') }}
              </span>
            </td>
            <td>{{ tSem(s.semester_name, $t) }} {{ s.semester_year }}</td>
            <td>
              <div class="actions">
                <button class="btn btn-secondary btn-sm" @click="openForm(s)">{{ $t('admin.edit') }}</button>
                <button class="btn btn-danger btn-sm" @click="deleteStudent(s.id)">{{ $t('admin.delete') }}</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Form Modal -->
    <teleport to="body">
      <div v-if="showForm" class="modal-backdrop" @click.self="showForm = false">
        <div class="modal-content glass-strong animate-scale-in" style="max-width: 600px;">
          <button class="modal-close" @click="showForm = false" v-html="xIcon"></button>
          <h3 class="modal-title gradient-text">{{ editingId ? $t('admin.edit_student') : $t('admin.add_student') }}</h3>

          <form @submit.prevent="saveStudent">
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">{{ $t('admin.full_name') }}</label>
                <input v-model="form.full_name" class="form-input" required />
              </div>
              <div class="form-group">
                <label class="form-label">{{ $t('student.id') }}</label>
                <input v-model="form.student_code" class="form-input" />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label class="form-label">{{ $t('student.department') }}</label>
                <select v-model="form.department" class="form-select" required>
                  <option value="" disabled>{{ $t('admin.select_department') }}</option>
                  <optgroup :label="$t('admin.tech_dept')">
                    <option value="Công nghệ thông tin">Công nghệ thông tin</option>
                    <option value="Trí tuệ nhân tạo và Khoa học dữ liệu">Trí tuệ nhân tạo và Khoa học dữ liệu</option>
                    <option value="Trí tuệ nhân tạo và An ninh mạng">Trí tuệ nhân tạo và An ninh mạng</option>
                  </optgroup>
                  <optgroup :label="$t('admin.biz_dept')">
                    <option value="Quản trị Kinh doanh">Quản trị Kinh doanh</option>
                    <option value="Quản trị Marketing">Quản trị Marketing</option>
                    <option value="Quản trị Sự kiện">Quản trị Sự kiện</option>
                    <option value="Quản trị Truyền thông">Quản trị Truyền thông</option>
                    <option value="Kinh doanh quốc tế">Kinh doanh quốc tế</option>
                    <option value="Logistics và Quản trị Chuỗi cung ứng">Logistics và Quản trị Chuỗi cung ứng</option>
                  </optgroup>
                  <optgroup :label="$t('admin.design_dept')">
                    <option value="Thiết kế đồ họa & kỹ thuật số">Thiết kế đồ họa & kỹ thuật số</option>
                    <option value="Truyền thông đa phương tiện">Truyền thông đa phương tiện</option>
                  </optgroup>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">{{ $t('admin.student_type') }}</label>
                <select v-model="form.achievement_type" class="form-select">
                  <option value="excellent">{{ $t('admin.type_excellent') }}</option>
                  <option value="top_score">{{ $t('admin.type_topscore') }}</option>
                </select>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label class="form-label">{{ $t('student.semester') }} *</label>
                <select v-model="form.semester_id" class="form-select" required>
                  <option v-for="sem in semesters" :key="sem.id" :value="sem.id">{{ tSem(sem.name, $t) }} {{ sem.year }}</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">{{ $t('admin.sort_order') }}</label>
                <input v-model.number="form.sort_order" type="number" class="form-input" />
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">{{ $t('admin.avatar') }}</label>
              <input type="file" @change="handleFile" accept="image/*" class="form-input" />
            </div>

            <div class="form-group">
              <label class="form-label">{{ $t('admin.desc_achievement') }}</label>
              <textarea v-model="form.description" class="form-textarea" rows="4"></textarea>
            </div>

            <div class="form-actions">
              <button type="button" class="btn btn-secondary" @click="showForm = false">{{ $t('admin.cancel') }}</button>
              <button type="submit" class="btn btn-primary" :disabled="saving">
                {{ saving ? $t('admin.saving') : $t('admin.save') }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </teleport>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import api from '../../api/axios'
import { useAuthStore } from '../../stores/auth'
import { tSem } from '../../utils/translate'
import icons from '../../utils/icons'
import * as XLSX from 'xlsx'
import { toast } from '../../utils/toast'
import { useConfirm } from '../../utils/confirm'

const xIcon = icons.x
const uploadIcon = icons.upload
const downloadIcon = icons.download || '<svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>'
const trashIcon = icons.trash || '<svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>'
const { t } = useI18n()
const { confirm } = useConfirm()
const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const students = ref([])
const semesters = ref([])
const filterSemester = ref(route.query.semester || '')
const showForm = ref(false)
const editingId = ref(null)
const saving = ref(false)
const importing = ref(false)
const importProgress = ref({ done: 0, total: 0 })
const avatarFile = ref(null)
const fileInput = ref(null)

const selectedIds = ref([])
const allSelected = computed(() => {
  return students.value.length > 0 && selectedIds.value.length === students.value.length
})

function toggleAll() {
  if (allSelected.value) {
    selectedIds.value = []
  } else {
    selectedIds.value = students.value.map(s => s.id)
  }
}

async function bulkDelete() {
  if (selectedIds.value.length === 0) return
  if (await confirm(t('admin.delete_students_confirm', { count: selectedIds.value.length }))) {
    try {
      await api.post('/students/bulk-delete', { ids: selectedIds.value })
      toast.success(t('admin.delete_success'))
      selectedIds.value = []
      loadStudents()
    } catch (e) {
      toast.error(t('admin.error_delete'))
    }
  }
}

function exportExcel() {
  if (!students.value.length) {
    toast.error(t('admin.no_export_data'))
    return
  }
  const dataToExport = students.value.map(s => ({
    'Họ và Tên': s.full_name,
    'MSSV': s.student_code,
    'Chuyên ngành': s.department,
    'Thành tích': s.achievement_type === 'excellent' ? 'Sinh viên xuất sắc' : 'Thủ khoa',
    'Kỳ học': s.semester_name + ' ' + s.semester_year,
  }))
  const ws = XLSX.utils.json_to_sheet(dataToExport)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, "Students")
  XLSX.writeFile(wb, "Danh_Sach_Sinh_Vien.xlsx")
}

const form = ref({
  full_name: '', student_code: '', department: '', description: '',
  achievement_type: 'excellent', semester_id: '', sort_order: 0,
})

const DEPARTMENTS = {
  GCS: [
    'Công nghệ thông tin',
    'Trí tuệ nhân tạo và Khoa học dữ liệu',
    'Trí tuệ nhân tạo và An ninh mạng'
  ],
  GBS: [
    'Quản trị Kinh doanh',
    'Quản trị Marketing',
    'Quản trị Sự kiện',
    'Quản trị Truyền thông',
    'Kinh doanh quốc tế',
    'Logistics và Quản trị Chuỗi cung ứng'
  ],
  GDS: [
    'Thiết kế đồ họa & kỹ thuật số',
    'Truyền thông đa phương tiện'
  ]
}

function validateStudentCode(code, department) {
  if (!code || !department) return false
  let expectedPrefix = null
  for (const [prefix, majors] of Object.entries(DEPARTMENTS)) {
    if (majors.includes(department)) {
      expectedPrefix = prefix
      break
    }
  }
  if (!expectedPrefix) return false

  const regex = new RegExp(`^${expectedPrefix}\\d{6}$`)
  return regex.test(code)
}

async function loadStudents() {
  const params = {}
  if (filterSemester.value) params.semester_id = filterSemester.value
  if (authStore.user?.campus && authStore.user.campus !== 'ALL') params.campus = authStore.user.campus
  const { data } = await api.get('/students', { params })
  students.value = data.students || []
}

async function loadSemesters() {
  const params = {}
  if (authStore.user?.campus && authStore.user.campus !== 'ALL') params.campus = authStore.user.campus
  const { data } = await api.get('/semesters', { params })
  semesters.value = data
  if (!filterSemester.value && data.length > 0) {
    // If no filter in URL, don't force select, let it show "All" or keep default.
  }
}

watch(filterSemester, (newVal) => {
  router.replace({ query: { ...route.query, semester: newVal || undefined } })
  loadStudents()
})

function openForm(student = null) {
  if (student) {
    editingId.value = student.id
    form.value = { ...student }
  } else {
    editingId.value = null
    form.value = {
      full_name: '', student_code: '', department: '', description: '',
      achievement_type: 'excellent', semester_id: semesters.value[0]?.id || '', sort_order: 0,
    }
  }
  avatarFile.value = null
  showForm.value = true
}

function handleFile(e) {
  avatarFile.value = e.target.files[0]
}

async function saveStudent() {
  if (!validateStudentCode(form.value.student_code, form.value.department)) {
    toast.error(t('error.student.invalid_code'))
    return
  }

  saving.value = true
  try {
    const fd = new FormData()
    Object.keys(form.value).forEach(key => {
      if (form.value[key] !== null && form.value[key] !== undefined) fd.append(key, form.value[key])
    })
    if (avatarFile.value) fd.append('avatar', avatarFile.value)

    if (editingId.value) {
      await api.put(`/students/${editingId.value}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } })
    } else {
      await api.post('/students', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
    }
    showForm.value = false
    toast.success(t('admin.save_success') || 'Save successful!')
    loadStudents()
  } catch (err) {
    toast.error(err.response?.data?.message || t('admin.error_save'))
  } finally {
    saving.value = false
  }
}

async function deleteStudent(id) {
  const ok = await confirm(t('admin.confirm_delete'), {
    title: t('admin.delete_student') || 'Xóa sinh viên',
    confirmText: t('admin.delete') || 'Xóa',
    type: 'danger',
  })
  if (!ok) return
  try {
    await api.delete(`/students/${id}`)
    toast.success(t('admin.delete_success') || 'Delete successful!')
    loadStudents()
  } catch (err) {
    toast.error(t('admin.error_delete'))
  }
}

function triggerFileInput() {
  if (!filterSemester.value) {
    toast.warning('Please select a specific semester from the filter before importing!')
    return
  }
  if (fileInput.value) fileInput.value.click()
}

async function handleImport(event) {
  const file = event.target.files[0]
  if (!file) return

  importing.value = true
  try {
    const data = await file.arrayBuffer()
    const workbook = XLSX.read(data)
    const sheetName = workbook.SheetNames[0]
    const worksheet = workbook.Sheets[sheetName]
    const json = XLSX.utils.sheet_to_json(worksheet)

    if (json.length === 0) {
      toast.warning('Excel file is empty!')
      return
    }

    const semesterId = filterSemester.value
    const studentsToImport = []

    for (const row of json) {
      const fullName = (row['Họ và tên'] || row['full_name'] || '').toString().trim()
      const studentCode = (row['Mã sinh viên'] || row['student_code'] || '').toString().trim()
      let department = (row['Chuyên ngành'] || row['department'] || '').toString().trim()
      let achievementType = (row['Loại danh hiệu'] || row['achievement_type'] || 'excellent').toString().trim()
      const description = (row['Mô tả'] || row['description'] || '').toString().trim()
      const subjectName = (row['Môn học'] || row['subject_name'] || '').toString().trim()
      const score = row['Điểm'] || row['score']

      if (!department && studentCode) {
        const prefix = studentCode.substring(0, 3).toUpperCase();
        if (prefix === 'GCS') department = 'Công nghệ thông tin';
        else if (prefix === 'GBS') department = 'Quản trị Kinh doanh';
        else if (prefix === 'GDS') department = 'Thiết kế đồ họa & kỹ thuật số';
      }

      if (!fullName || !studentCode || !department) continue

      if (achievementType.toLowerCase() === 'top score' || achievementType.toLowerCase() === 'top_score') {
        achievementType = 'top_score'
      } else {
        achievementType = 'excellent'
      }

      studentsToImport.push({
        full_name: fullName,
        student_code: studentCode,
        department,
        achievement_type: achievementType,
        description,
        semester_id: semesterId,
        subject_name: subjectName,
        score
      })
    }

    if (studentsToImport.length === 0) {
      toast.warning('No valid data found in Excel file.')
      return
    }

    importProgress.value = { done: 0, total: studentsToImport.length }
    
    // bulk import API call
    try {
      const res = await api.post('/students/import', { students: studentsToImport })
      importProgress.value.done = studentsToImport.length
      toast.success(`Import xong! Thành công: ${res.data.imported}.`)
      loadStudents()
    } catch (err) {
      toast.error('Có lỗi xảy ra khi gọi API Import.')
    }
  } catch (err) {
    toast.error($t('admin.excel_error') || 'An error occurred while reading the Excel file.')
  } finally {
    importing.value = false
    event.target.value = '' // reset file input
  }
}

watch(filterSemester, loadStudents)
onMounted(() => { loadSemesters(); loadStudents() })
</script>

<style scoped>
.manage-page { animation: fadeIn 0.3s ease; }

.page-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-6);
  flex-wrap: wrap;
  gap: var(--space-4);
}

.data-table-wrap {
  border-radius: var(--radius-lg);
  overflow-x: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 700px;
}

.data-table th {
  text-align: left;
  padding: var(--space-4) var(--space-5);
  font-size: var(--text-xs);
  text-transform: uppercase;
  letter-spacing: 1px;
  color: var(--color-text-muted);
  border-bottom: 1px solid var(--color-border);
  white-space: nowrap;
}

.data-table td {
  padding: var(--space-3) var(--space-5);
  border-bottom: 1px solid rgba(255,255,255,0.03);
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
}

.data-table tr:hover td {
  background: rgba(255,255,255,0.02);
}

.cell-user {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.cell-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--gradient-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: var(--text-sm);
  color: var(--color-bg-primary);
  flex-shrink: 0;
}

.code-cell {
  color: var(--color-text-accent);
  font-weight: 600;
}

.actions {
  display: flex;
  gap: var(--space-2);
}

/* Modal styles */
.modal-backdrop {
  position: fixed; inset: 0;
  background: rgba(0,0,0,0.7);
  backdrop-filter: blur(4px);
  z-index: var(--z-modal-backdrop);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-6);
}

.modal-content {
  position: relative;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  border-radius: var(--radius-xl);
  padding: var(--space-8);
  background: var(--color-bg-card);
}

.modal-close {
  position: absolute; top: var(--space-4); right: var(--space-4);
  width: 36px; height: 36px; border-radius: 50%;
  background: var(--color-bg-card);
  color: var(--color-text-secondary);
  font-size: var(--text-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--color-border);
  cursor: pointer;
}
.modal-close:hover { background: var(--color-bg-card-hover); color: var(--color-text-primary); }

.modal-title {
  font-size: var(--text-xl);
  font-weight: 800;
  margin-bottom: var(--space-6);
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-4);
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--space-3);
  margin-top: var(--space-6);
}

/* Import progress bar */
.import-progress-bar-wrap {
  height: 4px;
  background: var(--color-border);
  border-radius: var(--radius-full);
  overflow: hidden;
  margin-bottom: var(--space-4);
}

.import-progress-bar {
  height: 100%;
  background: var(--gradient-primary);
  border-radius: var(--radius-full);
  transition: width 0.2s ease;
}
</style>
