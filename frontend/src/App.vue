<template>
  <router-view />
</template>

<script setup>
import { watch } from 'vue'
import { useSemesterStore } from './stores/semester'

const semesterStore = useSemesterStore()

watch(() => semesterStore.selectedSemester, (newSemester) => {
  if (newSemester && newSemester.theme_color) {
    document.documentElement.style.setProperty('--color-bg-primary', newSemester.theme_color)
  } else {
    // Reset to default if no theme color is set
    document.documentElement.style.removeProperty('--color-bg-primary')
  }
}, { immediate: true })
</script>
