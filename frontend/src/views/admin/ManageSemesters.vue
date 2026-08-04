<template>
  <div class="manage-page">
    <div class="page-top">
      <div></div>
      <button class="btn btn-primary" @click="openForm()">+ Thêm Kỳ Học</button>
    </div>

    <div class="semesters-grid">
      <div v-for="sem in semesters" :key="sem.id" class="semester-card glass">
        <div class="semester-header">
          <h3>{{ sem.name }}</h3>
          <span class="badge" :class="sem.is_active ? 'badge-green' : 'badge-purple'">
            {{ sem.is_active ? 'Đang hoạt động' : 'Không hoạt động' }}
          </span>
        </div>
        <div class="semester-meta">
          <span class="year">{{ sem.year }}</span>
          <span class="slug">{{ sem.slug }}</span>
        </div>
        <p class="semester-desc">{{ sem.description || 'Chưa có mô tả' }}</p>
        <div class="semester-actions">
          <button class="btn btn-secondary btn-sm" @click="openForm(sem)">Sửa</button>
          <button class="btn btn-danger btn-sm" @click="deleteSemester(sem.id)">Xóa</button>
        </div>
      </div>
    </div>

    <!-- Form Modal -->
    <teleport to="body">
      <div v-if="showForm" class="modal-backdrop" @click.self="showForm = false">
        <div class="modal-content glass-strong animate-scale-in" style="max-width: 500px;">
          <button class="modal-close" @click="showForm = false">✕</button>
          <h3 class="modal-title gradient-text">{{ editingId ? 'Sửa Kỳ Học' : 'Thêm Kỳ Học' }}</h3>

          <form @submit.prevent="saveSemester">
            <div class="form-group">
              <label class="form-label">Tên kỳ học *</label>
              <select v-model="form.name" class="form-select" required>
                <option value="Kỳ Xuân">Kỳ Xuân</option>
                <option value="Kỳ Hè">Kỳ Hè</option>
                <option value="Kỳ Thu">Kỳ Thu</option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">Năm *</label>
              <input v-model.number="form.year" type="number" class="form-input" required min="2020" max="2030" />
            </div>

            <div class="form-group">
              <label class="form-label">Mô tả</label>
              <textarea v-model="form.description" class="form-textarea" rows="3"></textarea>
            </div>

            <div class="form-group">
              <label class="form-label" style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
                <input type="checkbox" v-model="form.is_active" style="width: 18px; height: 18px;" />
                Đặt làm kỳ học đang hoạt động
              </label>
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
import { ref, onMounted } from 'vue'
import api from '../../api/axios'

const semesters = ref([])
const showForm = ref(false)
const editingId = ref(null)
const saving = ref(false)

const form = ref({ name: 'Kỳ Xuân', year: new Date().getFullYear(), description: '', is_active: false })

async function loadSemesters() {
  const { data } = await api.get('/semesters')
  semesters.value = data
}

function openForm(sem = null) {
  if (sem) {
    editingId.value = sem.id
    form.value = { name: sem.name, year: sem.year, description: sem.description, is_active: sem.is_active }
  } else {
    editingId.value = null
    form.value = { name: 'Kỳ Xuân', year: new Date().getFullYear(), description: '', is_active: false }
  }
  showForm.value = true
}

async function saveSemester() {
  saving.value = true
  try {
    if (editingId.value) {
      await api.put(`/semesters/${editingId.value}`, form.value)
    } else {
      await api.post('/semesters', form.value)
    }
    showForm.value = false
    loadSemesters()
  } catch (err) { alert(err.response?.data?.message || 'Lỗi') } finally { saving.value = false }
}

async function deleteSemester(id) {
  if (!confirm('Xóa kỳ học này sẽ xóa tất cả sinh viên và điểm cao liên quan. Tiếp tục?')) return
  try { await api.delete(`/semesters/${id}`); loadSemesters() } catch { alert('Lỗi') }
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
