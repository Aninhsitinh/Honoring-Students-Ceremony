<template>
  <div class="manage-page">
    <div class="page-top">
      <div></div>
      <button class="btn btn-primary" @click="openForm()">+ {{ $t('admin.add_semester') }}</button>
    </div>

    <div class="semesters-grid">
      <div v-for="sem in semesters" :key="sem.id" class="semester-card glass">
        <div class="semester-header">
          <h3>{{ sem.name }}</h3>
          <span class="badge" :class="sem.is_active ? 'badge-green' : 'badge-purple'">
            {{ sem.is_active ? $t('admin.active_status') : $t('admin.closed_status') }}
          </span>
        </div>
        <div class="semester-meta">
          <span class="year">{{ sem.year }}</span>
          <span class="slug">{{ sem.slug }}</span>
        </div>
        <div class="theme-preview" v-if="sem.theme_color">
          {{ $t('admin.color_bg') }} <span class="color-swatch" :style="{ backgroundColor: sem.theme_color }"></span>
        </div>
        <p class="semester-desc">{{ sem.description || $t('admin.no_desc') }}</p>
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
          <button class="modal-close" @click="showForm = false">✕</button>
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
              <label class="form-label">{{ $t('admin.theme_color') }}</label>
              <input v-model="form.theme_color" type="color" class="form-color-picker" />
            </div>

            <div class="form-group">
              <label class="form-label">{{ $t('admin.bg_image') }}</label>
              <input type="file" @change="handleFileUpload" class="form-input" accept="image/*" />
            </div>

            <div class="form-group">
              <label class="form-label">{{ $t('admin.desc') }}</label>
              <textarea v-model="form.description" class="form-textarea" rows="3"></textarea>
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

const { t: $t } = useI18n()
const semesters = ref([])
const showForm = ref(false)
const editingId = ref(null)
const saving = ref(false)

const form = ref({ name: 'Kỳ Xuân', year: new Date().getFullYear(), description: '', is_active: false, theme_color: '#0b1120' })
const selectedFile = ref(null)

async function loadSemesters() {
  const { data } = await api.get('/semesters')
  semesters.value = data
}

function handleFileUpload(e) {
  selectedFile.value = e.target.files[0]
}

function openForm(sem = null) {
  selectedFile.value = null
  if (sem) {
    editingId.value = sem.id
    form.value = { name: sem.name, year: sem.year, description: sem.description, is_active: sem.is_active, theme_color: sem.theme_color || '#0b1120' }
  } else {
    editingId.value = null
    form.value = { name: 'Kỳ Xuân', year: new Date().getFullYear(), description: '', is_active: false, theme_color: '#0b1120' }
  }
  showForm.value = true
}

async function saveSemester() {
  saving.value = true
  try {
    const formData = new FormData()
    formData.append('name', form.value.name)
    formData.append('year', form.value.year)
    formData.append('description', form.value.description)
    formData.append('is_active', form.value.is_active)
    formData.append('theme_color', form.value.theme_color)
    if (selectedFile.value) {
      formData.append('bg_image', selectedFile.value)
    }

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
  if (!confirm($t('admin.delete_sem_confirm'))) return
  try { await api.delete(`/semesters/${id}`); loadSemesters() } catch { alert($t('admin.error_delete')) }
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
.modal-close { position: absolute; top: var(--space-4); right: var(--space-4); width: 36px; height: 36px; border-radius: 50%; background: rgba(255,255,255,0.1); color: var(--color-text-secondary); font-size: var(--text-lg); display: flex; align-items: center; justify-content: center; border: none; cursor: pointer; }
.modal-title { font-size: var(--text-xl); font-weight: 800; margin-bottom: var(--space-6); }
.form-actions { display: flex; justify-content: flex-end; gap: var(--space-3); margin-top: var(--space-6); }
</style>
