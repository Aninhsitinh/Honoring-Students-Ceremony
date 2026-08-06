<template>
  <div class="manage-page">
    <div class="page-top">
      <div></div>
      <button class="btn btn-primary" @click="openForm()">+ {{ $t('admin.add_semester') }}</button>
    </div>

    <div class="semesters-grid">
      <div v-for="sem in semesters" :key="sem.id" class="semester-card glass">
        <div class="semester-header">
          <h3>{{ tSem(sem.name, $t) }}</h3>
          <span class="badge" :class="sem.is_active ? 'badge-green' : 'badge-purple'">
            {{ sem.is_active ? $t('admin.active_status') : $t('admin.closed_status') }}
          </span>
        </div>
        <div class="semester-meta">
          <span class="year">{{ sem.year }}</span>
          <span class="slug">{{ sem.slug }}</span>
        </div>
        <div class="semester-actions">
          <button class="btn btn-secondary btn-sm" @click="openForm(sem)">{{ $t('admin.edit') }}</button>
          <button class="btn btn-danger btn-sm" @click="deleteSemester(sem.id)">{{ $t('admin.delete') }}</button>
        </div>
      </div>
    </div>

    <!-- Form Modal -->
    <teleport to="body">
      <div v-if="showForm" class="modal-backdrop" @click.self="showForm = false">
        <div class="modal-content glass-strong animate-scale-in" style="max-width: 500px;">
          <button class="modal-close" @click="showForm = false" v-html="xIcon"></button>
          <h3 class="modal-title gradient-text">{{ editingId ? $t('admin.edit_semester') : $t('admin.add_semester') }}</h3>

          <form @submit.prevent="saveSemester">
            <div class="form-group">
              <label class="form-label">{{ $t('admin.sem_name') }} *</label>
              <select v-model="form.name" class="form-select" required>
                <option value="Kỳ Xuân">{{ $t('admin.sem_spring') }}</option>
                <option value="Kỳ Hè">{{ $t('admin.sem_summer') }}</option>
                <option value="Kỳ Thu">{{ $t('admin.sem_fall') }}</option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">{{ $t('admin.year') }} *</label>
              <input v-model.number="form.year" type="number" class="form-input" required min="2020" max="2030" />
            </div>



            <div class="form-group">
              <label class="form-label" style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
                <input type="checkbox" v-model="form.is_active" style="width: 18px; height: 18px;" />
                {{ $t('admin.activate') }}
              </label>
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
import { ref, onMounted } from 'vue'
import api from '../../api/axios'
import { useI18n } from 'vue-i18n'
import { tSem } from '../../utils/translate'
import icons from '../../utils/icons'
import { toast } from '../../utils/toast'
import { useConfirm } from '../../utils/confirm'

const xIcon = icons.x
const { t: $t } = useI18n()
const { confirm } = useConfirm()
const semesters = ref([])
const showForm = ref(false)
const editingId = ref(null)
const saving = ref(false)

const form = ref({ name: 'Kỳ Xuân', year: new Date().getFullYear(), is_active: false })

async function loadSemesters() {
  const { data } = await api.get('/semesters')
  semesters.value = data
}

function openForm(sem = null) {
  if (sem) {
    editingId.value = sem.id
    form.value = { name: sem.name, year: sem.year, is_active: sem.is_active }
  } else {
    editingId.value = null
    form.value = { name: 'Kỳ Xuân', year: new Date().getFullYear(), is_active: false }
  }
  showForm.value = true
}

async function saveSemester() {
  saving.value = true
  try {
    const formData = new FormData()
    formData.append('name', form.value.name)
    formData.append('year', form.value.year)
    formData.append('is_active', form.value.is_active)

    if (editingId.value) {
      await api.put(`/semesters/${editingId.value}`, formData)
    } else {
      await api.post('/semesters', formData)
    }
    showForm.value = false
    loadSemesters()
  } catch (err) { alert(err.response?.data?.message || $t('admin.error_save')) } finally { saving.value = false }
}

async function deleteSemester(id) {
  const ok = await confirm($t('admin.delete_sem_confirm'), {
    title: $t('admin.delete') + ' kỳ học',
    confirmText: $t('admin.delete'),
    type: 'danger',
  })
  if (!ok) return
  try {
    await api.delete(`/semesters/${id}`)
    toast.success($t('admin.delete_success') || 'Xóa thành công!')
    loadSemesters()
  } catch {
    toast.error($t('admin.error_delete'))
  }
}

onMounted(loadSemesters)
</script>

<style scoped>
.manage-page { animation: fadeIn 0.3s ease; }
.page-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-6); }

.semesters-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: var(--space-5);
}

.semester-card {
  padding: var(--space-6);
  border-radius: var(--radius-lg);
  transition: all var(--transition-base);
}

.semester-card:hover {
  border-color: var(--color-border-hover);
  transform: translateY(-2px);
}

.semester-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--space-3);
}

.semester-header h3 {
  font-size: var(--text-lg);
  font-weight: 700;
}

.semester-meta {
  display: flex;
  gap: var(--space-4);
  margin-bottom: var(--space-3);
}

.year {
  font-size: var(--text-2xl);
  font-weight: 800;
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.slug {
  color: var(--color-text-muted);
  font-size: var(--text-sm);
  align-self: flex-end;
}

.semester-actions {
  display: flex;
  gap: var(--space-2);
  margin-top: var(--space-4);
}

.semester-desc {
  color: var(--color-text-secondary);
  font-size: var(--text-sm);
  margin-bottom: var(--space-4);
  line-height: 1.6;
}

.semester-actions {
  display: flex;
  gap: var(--space-2);
}

.modal-backdrop { position: fixed; inset: 0; background: rgba(0,0,0,0.7); backdrop-filter: blur(4px); z-index: var(--z-modal-backdrop); display: flex; align-items: center; justify-content: center; padding: var(--space-6); }
.modal-content { position: relative; width: 100%; max-height: 90vh; overflow-y: auto; border-radius: var(--radius-xl); padding: var(--space-8); }
.modal-close { position: absolute; top: var(--space-4); right: var(--space-4); width: 36px; height: 36px; border-radius: 50%; background: var(--color-bg-card); color: var(--color-text-secondary); font-size: var(--text-lg); display: flex; align-items: center; justify-content: center; border: 1px solid var(--color-border); cursor: pointer; }
.modal-close:hover { background: var(--color-bg-card-hover); color: var(--color-text-primary); }
.modal-title { font-size: var(--text-xl); font-weight: 800; margin-bottom: var(--space-6); }
.form-actions { display: flex; justify-content: flex-end; gap: var(--space-3); margin-top: var(--space-6); }
</style>
