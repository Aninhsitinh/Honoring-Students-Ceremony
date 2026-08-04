<template>
  <div class="manage-page">
    <div class="page-top">
      <div class="page-top-left">
        <select v-model="filterSemester" class="form-select" style="max-width: 200px;">
          <option value="">{{ $t('admin.all_semesters') }}</option>
          <option v-for="sem in semesters" :key="sem.id" :value="sem.id">{{ sem.name }} {{ sem.year }}</option>
        </select>
      </div>
      <button class="btn btn-primary" @click="openForm()">+ {{ $t('admin.add_student') }}</button>
    </div>

    <div class="data-table-wrap glass">
      <table class="data-table">
        <thead>
          <tr>
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
            <td>{{ s.semester_name }} {{ s.semester_year }}</td>
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
          <button class="modal-close" @click="showForm = false">✕</button>
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
                  <option v-for="sem in semesters" :key="sem.id" :value="sem.id">{{ sem.name }} {{ sem.year }}</option>
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
import { ref, watch, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import api from '../../api/axios'

const { t } = useI18n()
const students = ref([])
const semesters = ref([])
const filterSemester = ref('')
const showForm = ref(false)
const editingId = ref(null)
const saving = ref(false)
const avatarFile = ref(null)

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
  const { data } = await api.get('/students', { params })
  students.value = data.students || []
}

async function loadSemesters() {
  const { data } = await api.get('/semesters')
  semesters.value = data
}

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
    alert(t('error.student.invalid_code'))
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
    loadStudents()
  } catch (err) {
    alert(err.response?.data?.message || t('admin.error_save'))
  } finally {
    saving.value = false
  }
}

async function deleteStudent(id) {
  if (!confirm(t('admin.confirm_delete'))) return
  try {
    await api.delete(`/students/${id}`)
    loadStudents()
  } catch (err) {
    alert(t('admin.error_delete'))
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
}

.modal-close {
  position: absolute; top: var(--space-4); right: var(--space-4);
  width: 36px; height: 36px; border-radius: 50%;
  background: rgba(255,255,255,0.1); color: var(--color-text-secondary);
  font-size: var(--text-lg); display: flex; align-items: center; justify-content: center;
  transition: all var(--transition-fast); border: none; cursor: pointer;
}

.modal-close:hover { background: rgba(255,255,255,0.2); }

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

@media (max-width: 768px) {
  .form-row { grid-template-columns: 1fr; }
}
</style>
