import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '../api/axios'

export const useSemesterStore = defineStore('semester', () => {
  const semesters = ref([])
  const activeSemester = ref(null)
  const selectedSemester = ref(null)
  const loading = ref(false)

  async function fetchAll() {
    loading.value = true
    try {
      const { data } = await api.get('/semesters')
      semesters.value = data
      // Auto-select active semester
      const active = data.find(s => s.is_active)
      if (active && !selectedSemester.value) {
        selectedSemester.value = active
        activeSemester.value = active
      }
    } finally {
      loading.value = false
    }
  }

  function selectSemester(semester) {
    selectedSemester.value = semester
  }

  return { semesters, activeSemester, selectedSemester, loading, fetchAll, selectSemester }
})
