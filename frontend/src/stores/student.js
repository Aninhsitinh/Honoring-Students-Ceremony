import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '../api/axios'

export const useStudentStore = defineStore('student', () => {
  const students = ref([])
  const total = ref(0)
  const loading = ref(false)
  const selectedStudent = ref(null)

  async function fetchStudents({ semester_id, achievement_type, search, limit = 50, offset = 0 } = {}) {
    loading.value = true
    try {
      const params = {}
      if (semester_id) params.semester_id = semester_id
      if (achievement_type) params.achievement_type = achievement_type
      if (search) params.search = search
      params.limit = limit
      params.offset = offset

      const { data } = await api.get('/students', { params })
      students.value = data.students
      total.value = data.total
    } finally {
      loading.value = false
    }
  }

  async function fetchStudent(id) {
    const { data } = await api.get(`/students/${id}`)
    selectedStudent.value = data
    return data
  }

  return { students, total, loading, selectedStudent, fetchStudents, fetchStudent }
})
