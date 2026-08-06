<template>
  <div class="manage-page">
    <div class="page-top">
      <div></div>
      <button class="btn btn-primary" @click="openForm()">+ {{ $t('admin.add_post') }}</button>
    </div>

    <div class="data-table-wrap glass">
      <table class="data-table">
        <thead>
          <tr>
            <th>{{ $t('admin.title') }}</th>
            <th>{{ $t('student.semester') }}</th>
            <th>{{ $t('admin.status') }}</th>
            <th>{{ $t('admin.date_posted') }}</th>
            <th>{{ $t('admin.actions') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="p in posts" :key="p.id">
            <td style="max-width: 300px;">
              <span class="post-title-cell">{{ p.title }}</span>
            </td>
            <td>{{ p.semester_name ? `${tSem(p.semester_name, $t)} ${p.semester_year}` : '—' }}</td>
            <td>
              <span class="badge" :class="p.is_published ? 'badge-green' : 'badge-purple'">
                {{ p.is_published ? $t('admin.published') : $t('admin.draft') }}
              </span>
            </td>
            <td>{{ formatDate(p.created_at) }}</td>
            <td>
              <div class="actions">
                <button class="btn btn-secondary btn-sm" @click="openForm(p)">{{ $t('admin.edit') }}</button>
                <button class="btn btn-danger btn-sm" @click="deletePost(p.id)">{{ $t('admin.delete') }}</button>
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
          <button class="modal-close" @click="showForm = false" v-html="xIcon"></button>
          <h3 class="modal-title gradient-text">{{ editingId ? $t('admin.edit_post') : $t('admin.add_post') }}</h3>

          <form @submit.prevent="savePost">
            <div class="form-group">
              <label class="form-label">{{ $t('admin.title') }} *</label>
              <input v-model="form.title" class="form-input" required />
            </div>

            <div class="form-row">
              <div class="form-group">
                <label class="form-label">{{ $t('student.semester') }}</label>
                <select v-model="form.semester_id" class="form-select">
                  <option value="">{{ $t('admin.none_selected') }}</option>
                  <option v-for="sem in semesters" :key="sem.id" :value="sem.id">{{ tSem(sem.name, $t) }} {{ sem.year }}</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">{{ $t('admin.status') }}</label>
                <select v-model="form.is_published" class="form-select">
                  <option :value="false">{{ $t('admin.draft') }}</option>
                  <option :value="true">{{ $t('admin.published') }}</option>
                </select>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">{{ $t('admin.cover_image') }}</label>
              <div v-if="previewImage || form.thumbnail_url" style="margin-bottom: 12px;">
                <img :src="previewImage || getImageUrl(form.thumbnail_url)" alt="Cover Preview" style="max-height: 120px; border-radius: var(--radius-md); border: 1px solid rgba(255,255,255,0.1); object-fit: cover;" />
              </div>
              <input type="file" @change="handleFile" accept="image/*" class="form-input" />
            </div>

            <div class="form-group quill-editor-wrapper">
              <label class="form-label">{{ $t('admin.content') }} *</label>
              <QuillEditor v-model:content="form.content" contentType="html" theme="snow" />
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
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import { tSem } from '../../utils/translate'
import icons from '../../utils/icons'
import { getImageUrl } from '../../utils/image'
import { toast } from '../../utils/toast'
import { useConfirm } from '../../utils/confirm'

const xIcon = icons.x
const { t: $t } = useI18n()
const { confirm } = useConfirm()
const posts = ref([])
const semesters = ref([])
const showForm = ref(false)
const editingId = ref(null)
const saving = ref(false)
const thumbnailFile = ref(null)
const previewImage = ref(null)

const form = ref({ title: '', content: '', semester_id: '', is_published: false, thumbnail_url: null })

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
    form.value = { title: post.title, content: post.content, semester_id: post.semester_id || '', is_published: post.is_published, thumbnail_url: post.thumbnail_url }
  } else {
    editingId.value = null
    form.value = { title: '', content: '', semester_id: '', is_published: false, thumbnail_url: null }
  }
  thumbnailFile.value = null
  previewImage.value = null
  showForm.value = true
}

function handleFile(e) {
  const file = e.target.files[0]
  thumbnailFile.value = file
  if (file) {
    previewImage.value = URL.createObjectURL(file)
  } else {
    previewImage.value = null
  }
}

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
  } catch (err) { alert(err.response?.data?.message || $t('admin.error_save')) } finally { saving.value = false }
}

async function deletePost(id) {
  const ok = await confirm($t('admin.confirm_delete'), {
    title: $t('admin.delete') + ' bài viết',
    confirmText: $t('admin.delete'),
    type: 'danger',
  })
  if (!ok) return
  try {
    await api.delete(`/posts/${id}`)
    toast.success($t('admin.delete_success') || 'Xóa thành công!')
    loadPosts()
  } catch {
    toast.error($t('admin.error_delete'))
  }
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
.modal-close { position: absolute; top: var(--space-4); right: var(--space-4); width: 36px; height: 36px; border-radius: 50%; background: var(--color-bg-card); color: var(--color-text-secondary); font-size: var(--text-lg); display: flex; align-items: center; justify-content: center; border: 1px solid var(--color-border); cursor: pointer; }
.modal-close:hover { background: var(--color-bg-card-hover); color: var(--color-text-primary); }
.modal-title { font-size: var(--text-xl); font-weight: 800; margin-bottom: var(--space-6); }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-4); }
.form-actions { display: flex; justify-content: flex-end; gap: var(--space-3); margin-top: var(--space-6); }

/* Quill Editor Dark Theme Overrides */
.quill-editor-wrapper {
  margin-bottom: var(--space-4);
}
:deep(.ql-toolbar.ql-snow) {
  border-color: rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.05);
  border-top-left-radius: var(--radius-md);
  border-top-right-radius: var(--radius-md);
}
:deep(.ql-container.ql-snow) {
  border-color: rgba(255, 255, 255, 0.2);
  background: rgba(0, 0, 0, 0.2);
  color: var(--color-text-primary);
  border-bottom-left-radius: var(--radius-md);
  border-bottom-right-radius: var(--radius-md);
  min-height: 250px;
  font-family: inherit;
  font-size: var(--text-sm);
}
:deep(.ql-toolbar.ql-snow .ql-stroke) { stroke: var(--color-text-primary); }
:deep(.ql-toolbar.ql-snow .ql-fill) { fill: var(--color-text-primary); }
:deep(.ql-toolbar.ql-snow .ql-picker) { color: var(--color-text-primary); }
:deep(.ql-snow .ql-picker-options) {
  background-color: var(--color-bg-primary);
  border-color: rgba(255,255,255,0.2);
}
:deep(.ql-snow .ql-picker-item:hover), :deep(.ql-snow .ql-picker-label:hover) {
  color: var(--color-primary);
}
</style>
