import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const useCampusStore = defineStore('campus', () => {
  // Try to get from localStorage, default to HN
  const currentCampus = ref(localStorage.getItem('campus') || 'HN')

  // Available campuses
  const campuses = [
    { code: 'HN', name: 'Hà Nội' },
    { code: 'DN', name: 'Đà Nẵng' },
    { code: 'CT', name: 'Cần Thơ' },
    { code: 'HCM', name: 'Hồ Chí Minh' }
  ]

  // Persist to localStorage whenever it changes
  function setCampus(campusCode) {
    if (campuses.some(c => c.code === campusCode)) {
      currentCampus.value = campusCode
      localStorage.setItem('campus', campusCode)
    }
  }

  return {
    currentCampus,
    campuses,
    setCampus
  }
})
