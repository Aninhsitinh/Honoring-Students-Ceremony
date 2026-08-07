import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '../api/axios'

export const useSemesterStore = defineStore('semester', () => {
  const semesters = ref([])
  const activeSemester = ref(null)
  const selectedSemester = ref(null)
  const loading = ref(false)

  async function fetchAll(autoSelect = true) {
    loading.value = true
    try {
      const campus = localStorage.getItem('campus') || 'HN'
      const { data } = await api.get(`/semesters?campus=${campus}`)
      semesters.value = data
      
      const active = data.find(s => s.is_active)
      if (active) {
        activeSemester.value = active
      } else {
        activeSemester.value = null
      }

      if (autoSelect) {
        if (active) {
          selectedSemester.value = active
        } else if (data.length > 0) {
          selectedSemester.value = data[0]
        } else {
          selectedSemester.value = null
        }
      } else {
        selectedSemester.value = null
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
