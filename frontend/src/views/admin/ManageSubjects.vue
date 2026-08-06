<template>
  <div class="manage-page">
    <div class="page-top">
      <div class="page-top-left">
        <select v-model="filterDepartment" class="form-select" style="max-width: 250px;">
          <option value="">{{ $t('admin.all_departments') }}</option>
          <optgroup v-for="(majors, prefix) in DEPARTMENTS" :key="prefix" :label="prefix">
            <option v-for="m in majors" :key="m" :value="m">{{ m }}</option>
          </optgroup>
        </select>
      </div>
      <div class="page-top-right" style="display: flex; gap: var(--space-3); align-items: center;">
        <input type="file" ref="fileInput" @change="handleImport" accept=".xlsx, .xls, .csv" style="display: none">
        <button class="btn btn-secondary" @click="triggerFileInput" :disabled="importing">
          <span class="icon" v-html="uploadIcon"></span> {{ importing ? 'Importing...' : 'Import Excel' }}
        </button>
        <button class="btn btn-primary" @click="openForm()">+ {{ $t('admin.add_subject') }}</button>
      </div>
    </div>

    <div class="data-table-wrap glass">
      <table class="data-table">
        <thead>
          <tr>
            <th>{{ $t('admin.subject_code') }}</th>
            <th>{{ $t('admin.subject_name') }}</th>
            <th>{{ $t('student.department') }}</th>
            <th>{{ $t('admin.actions') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="sub in filteredSubjects" :key="sub.id">
            <td><span class="code-cell">{{ sub.code }}</span></td>
            <td><strong>{{ sub.name }}</strong></td>
            <td>{{ sub.department }}</td>
            <td>
              <div class="actions">
                <button class="btn btn-secondary btn-sm" @click="openForm(sub)">{{ $t('admin.edit') }}</button>
                <button class="btn btn-danger btn-sm" @click="deleteSubject(sub.id)">{{ $t('admin.delete') }}</button>
              </div>
            </td>
          </tr>
          <tr v-if="filteredSubjects.length === 0">
            <td colspan="4" style="text-align: center; color: var(--color-text-muted);">{{ $t('admin.no_data') }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Form Modal -->
    <teleport to="body">
      <div v-if="showForm" class="modal-backdrop" @click.self="showForm = false">
        <div class="modal-content glass-strong animate-scale-in" style="max-width: 500px;">
          <button class="modal-close" @click="showForm = false" v-html="xIcon"></button>
          <h3 class="modal-title gradient-text">{{ editingId ? $t('admin.edit_subject') : $t('admin.add_subject') }}</h3>

          <form @submit.prevent="saveSubject">
            <div class="form-group">
              <label class="form-label">{{ $t('admin.subject_code') }} *</label>
              <input v-model="form.code" class="form-input" required :placeholder="$t('admin.eg_subject_code')" />
            </div>

            <div class="form-group">
              <label class="form-label">{{ $t('admin.subject_name') }} *</label>
              <input v-model="form.name" class="form-input" required :placeholder="$t('admin.eg_subject_name')" />
            </div>

            <div class="form-group">
              <label class="form-label">{{ $t('student.department') }} *</label>
              <select v-model="form.department" class="form-select" required>
                <optgroup v-for="(majors, prefix) in DEPARTMENTS" :key="prefix" :label="prefix">
                  <option v-for="m in majors" :key="m" :value="m">{{ m }}</option>
                </optgroup>
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
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import api from '../../api/axios'
import icons from '../../utils/icons'
import * as XLSX from 'xlsx'
import { toast } from '../../utils/toast'
import { useConfirm } from '../../utils/confirm'

const xIcon = icons.x
const uploadIcon = icons.upload
const { t: $t } = useI18n()
const { confirm } = useConfirm()

const subjects = ref([])
const filterDepartment = ref('')
const showForm = ref(false)
const editingId = ref(null)
const saving = ref(false)
const importing = ref(false)
const fileInput = ref(null)

const form = ref({ code: '', name: '', department: '' })

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

const filteredSubjects = computed(() => {
  if (!filterDepartment.value) return subjects.value
  return subjects.value.filter(s => s.department === filterDepartment.value)
})

async function loadSubjects() {
  const { data } = await api.get('/subjects')
  subjects.value = data
}

function openForm(item = null) {
  if (item) {
    editingId.value = item.id
    form.value = { code: item.code, name: item.name, department: item.department }
  } else {
    editingId.value = null
    form.value = { code: '', name: '', department: filterDepartment.value || '' }
  }
  showForm.value = true
}

async function saveSubject() {
  saving.value = true
  try {
    if (editingId.value) {
      await api.put(`/subjects/${editingId.value}`, form.value)
    } else {
      await api.post('/subjects', form.value)
    }
    showForm.value = false
    toast.success($t('admin.save_success') || 'Save successful!')
    loadSubjects()
  } catch (err) {
    toast.error(err.response?.data?.message || $t('admin.error_occurred'))
  } finally {
    saving.value = false
  }
}

async function deleteSubject(id) {
  const ok = await confirm($t('admin.delete_subject_confirm'), {
    title: $t('admin.delete') + ' môn học',
    confirmText: $t('admin.delete'),
    type: 'danger',
  })
  if (!ok) return
  try {
    await api.delete(`/subjects/${id}`)
    toast.success($t('admin.delete_success') || 'Xóa thành công!')
    loadSubjects()
  } catch (err) {
    toast.error($t('admin.error_occurred'))
  }
}

function triggerFileInput() {
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

    let successCount = 0
    let failCount = 0
    let skipCount = 0

    // Danh sách chuyên ngành chuẩn (dùng để normalize hoa/thường)
    const DEPARTMENT_CANONICAL = [
      'Công nghệ thông tin',
      'Trí tuệ nhân tạo và Khoa học dữ liệu',
      'Trí tuệ nhân tạo và An ninh mạng',
      'Quản trị Kinh doanh',
      'Quản trị Marketing',
      'Quản trị Sự kiện',
      'Quản trị Truyền thông',
      'Kinh doanh quốc tế',
      'Logistics và Quản trị Chuỗi cung ứng',
      'Thiết kế đồ họa & kỹ thuật số',
      'Truyền thông đa phương tiện',
    ]

    function normalizeDepartment(raw) {
      if (!raw) return null
      const trimmed = raw.toString().trim()
      // So sánh không phân biệt hoa/thường, bỏ dấu cách thừa
      const found = DEPARTMENT_CANONICAL.find(
        d => d.toLowerCase() === trimmed.toLowerCase()
      )
      return found || trimmed // fallback về giá trị gốc nếu không khớp
    }

    for (const row of json) {
      try {
        const code = (row['Mã môn'] || row['code'] || '').toString().trim()
        const name = (row['Tên môn'] || row['name'] || '').toString().trim()
        const rawDepartment = row['Chuyên ngành'] || row['department']
        const department = normalizeDepartment(rawDepartment)

        if (!code || !name || !department) {
          failCount++
          continue
        }

        try {
          await api.post('/subjects', { code, name, department })
          successCount++
        } catch (err) {
          // Nếu là lỗi trùng (409/400) thì tính là skip, không fail
          if (err.response?.status === 400 || err.response?.status === 409) {
            skipCount++
          } else {
            failCount++
          }
        }
      } catch (err) {
        failCount++
      }
    }

    const msg = skipCount > 0
      ? `Import xong! Thành công: ${successCount}. Bỏ qua (đã tồn tại): ${skipCount}. Lỗi: ${failCount}.`
      : `Import xong! Thành công: ${successCount}. Lỗi: ${failCount}.`
    toast.success(msg)
    loadSubjects()
  } catch (err) {
    toast.error('An error occurred while reading the Excel file.')
  } finally {
    importing.value = false
    event.target.value = '' // reset file input
  }
}

onMounted(loadSubjects)
</script>

<style scoped>
.manage-page { animation: fadeIn 0.3s ease; }
.page-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-6); flex-wrap: wrap; gap: var(--space-4); }

.data-table-wrap { border-radius: var(--radius-lg); overflow-x: auto; }
.data-table { width: 100%; border-collapse: collapse; min-width: 700px; }
.data-table th { text-align: left; padding: var(--space-4) var(--space-5); font-size: var(--text-xs); text-transform: uppercase; letter-spacing: 1px; color: var(--color-text-muted); border-bottom: 1px solid var(--color-border); }
.data-table td { padding: var(--space-3) var(--space-5); border-bottom: 1px solid rgba(255,255,255,0.03); font-size: var(--text-sm); color: var(--color-text-secondary); }
.data-table tr:hover td { background: rgba(255,255,255,0.02); }
.code-cell { background: var(--color-bg-tertiary); padding: 4px 8px; border-radius: 4px; font-family: monospace; font-size: 0.9em; border: 1px solid var(--color-border); }
.actions { display: flex; gap: var(--space-2); }

.modal-backdrop { position: fixed; inset: 0; background: rgba(0,0,0,0.7); backdrop-filter: blur(4px); z-index: var(--z-modal-backdrop); display: flex; align-items: center; justify-content: center; padding: var(--space-6); }
.modal-content { position: relative; width: 100%; max-height: 90vh; overflow-y: auto; border-radius: var(--radius-xl); padding: var(--space-8); }
.modal-close { position: absolute; top: var(--space-4); right: var(--space-4); width: 36px; height: 36px; border-radius: 50%; background: var(--color-bg-card); color: var(--color-text-secondary); font-size: var(--text-lg); display: flex; align-items: center; justify-content: center; border: 1px solid var(--color-border); cursor: pointer; }
.modal-close:hover { background: var(--color-bg-card-hover); color: var(--color-text-primary); }
.modal-title { font-size: var(--text-xl); font-weight: 800; margin-bottom: var(--space-6); }
.form-actions { display: flex; justify-content: flex-end; gap: var(--space-3); margin-top: var(--space-6); }
</style>
