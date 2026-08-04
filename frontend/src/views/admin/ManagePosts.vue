<template>
  <div class="manage-page">
    <div class="page-top">
      <div></div>
      <button class="btn btn-primary" @click="openForm()">+ Thêm Bài Viết</button>
    </div>

    <div class="data-table-wrap glass">
      <table class="data-table">
        <thead>
          <tr>
            <th>Tiêu đề</th>
            <th>Kỳ Học</th>
            <th>Trạng thái</th>
            <th>Ngày tạo</th>
            <th>Thao Tác</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="p in posts" :key="p.id">
            <td style="max-width: 300px;">
              <span class="post-title-cell">{{ p.title }}</span>
            </td>
            <td>{{ p.semester_name ? `${p.semester_name} ${p.semester_year}` : '—' }}</td>
            <td>
              <span class="badge" :class="p.is_published ? 'badge-green' : 'badge-purple'">
                {{ p.is_published ? 'Đã xuất bản' : 'Bản nháp' }}
              </span>
            </td>
            <td>{{ formatDate(p.created_at) }}</td>
            <td>
              <div class="actions">
                <button class="btn btn-secondary btn-sm" @click="openForm(p)">Sửa</button>
                <button class="btn btn-danger btn-sm" @click="deletePost(p.id)">Xóa</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Form Modal -->
    <teleport to="body">
      <div v-if="showForm" class="modal-backdrop" @click.self="showForm = false">
        <div class="modal-content glass-strong animate-scale-in" style="max-width: 700px;">
          <button class="modal-close" @click="showForm = false">✕</button>
          <h3 class="modal-title gradient-text">{{ editingId ? 'Sửa Bài Viết' : 'Thêm Bài Viết' }}</h3>

          <form @submit.prevent="savePost">
            <div class="form-group">
              <label class="form-label">Tiêu đề *</label>
              <input v-model="form.title" class="form-input" required />
            </div>

            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Kỳ học</label>
                <select v-model="form.semester_id" class="form-select">
                  <option value="">Không chọn</option>
                  <option v-for="sem in semesters" :key="sem.id" :value="sem.id">{{ sem.name }} {{ sem.year }}</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Trạng thái</label>
                <select v-model="form.is_published" class="form-select">
                  <option :value="false">Bản nháp</option>
                  <option :value="true">Xuất bản</option>
                </select>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Ảnh thumbnail</label>
              <input type="file" @change="handleFile" accept="image/*" class="form-input" />
            </div>

            <div class="form-group">
              <label class="form-label">Nội dung (HTML) *</label>
              <textarea v-model="form.content" class="form-textarea" rows="10" required
                placeholder="<h2>Tiêu đề</h2><p>Nội dung bài viết...</p>"></textarea>
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

const posts = ref([])
const semesters = ref([])
const showForm = ref(false)
const editingId = ref(null)
const saving = ref(false)
const thumbnailFile = ref(null)

const form = ref({ title: '', content: '', semester_id: '', is_published: false })

async function loadPosts() {
  const { data } = await api.get('/posts', { params: { limit: 100 } })
  posts.value = data.posts || []
}

async function loadSemesters() {
  const { data } = await api.get('/semesters')
  semesters.value = data
}

function formatDate(d) {
  if (!d) return ''
  return new Date(d).toLocaleDateString('vi-VN')
}

function openForm(post = null) {
  if (post) {
    editingId.value = post.id
    form.value = { title: post.title, content: post.content, semester_id: post.semester_id || '', is_published: post.is_published }
  } else {
    editingId.value = null
    form.value = { title: '', content: '', semester_id: '', is_published: false }
  }
  thumbnailFile.value = null
  showForm.value = true
}

function handleFile(e) { thumbnailFile.value = e.target.files[0] }

async function savePost() {
  saving.value = true
  try {
    const fd = new FormData()
    fd.append('title', form.value.title)
    fd.append('content', form.value.content)
    fd.append('is_published', form.value.is_published)
    if (form.value.semester_id) fd.append('semester_id', form.value.semester_id)
    if (thumbnailFile.value) fd.append('thumbnail', thumbnailFile.value)

    if (editingId.value) {
      await api.put(`/posts/${editingId.value}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } })
    } else {
      await api.post('/posts', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
    }
    showForm.value = false
    loadPosts()
  } catch (err) { alert(err.response?.data?.message || 'Lỗi') } finally { saving.value = false }
}

async function deletePost(id) {
  if (!confirm('Xóa bài viết?')) return
  try { await api.delete(`/posts/${id}`); loadPosts() } catch { alert('Lỗi') }
}

onMounted(() => { loadSemesters(); loadPosts() })
</script>

<style scoped>
.manage-page { animation: fadeIn 0.3s ease; }
.page-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-6); }
.data-table-wrap { border-radius: var(--radius-lg); overflow-x: auto; }
.data-table { width: 100%; border-collapse: collapse; min-width: 700px; }
.data-table th { text-align: left; padding: var(--space-4) var(--space-5); font-size: var(--text-xs); text-transform: uppercase; letter-spacing: 1px; color: var(--color-text-muted); border-bottom: 1px solid var(--color-border); }
.data-table td { padding: var(--space-3) var(--space-5); border-bottom: 1px solid rgba(255,255,255,0.03); font-size: var(--text-sm); color: var(--color-text-secondary); }
.data-table tr:hover td { background: rgba(255,255,255,0.02); }
.post-title-cell { font-weight: 600; color: var(--color-text-primary); }
.actions { display: flex; gap: var(--space-2); }
.modal-backdrop { position: fixed; inset: 0; background: rgba(0,0,0,0.7); backdrop-filter: blur(4px); z-index: var(--z-modal-backdrop); display: flex; align-items: center; justify-content: center; padding: var(--space-6); }
.modal-content { position: relative; width: 100%; max-height: 90vh; overflow-y: auto; border-radius: var(--radius-xl); padding: var(--space-8); }
.modal-close { position: absolute; top: var(--space-4); right: var(--space-4); width: 36px; height: 36px; border-radius: 50%; background: rgba(255,255,255,0.1); color: var(--color-text-secondary); font-size: var(--text-lg); display: flex; align-items: center; justify-content: center; border: none; cursor: pointer; }
.modal-title { font-size: var(--text-xl); font-weight: 800; margin-bottom: var(--space-6); }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-4); }
.form-actions { display: flex; justify-content: flex-end; gap: var(--space-3); margin-top: var(--space-6); }
</style>
