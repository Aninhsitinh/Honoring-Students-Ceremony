/**
 * useRealtimeUpdates composable
 * Connects to the backend SSE stream and triggers callbacks when data changes.
 * Automatically reconnects if the connection drops.
 */
import { onMounted, onUnmounted } from 'vue'
import { useStudentStore } from '../stores/student'
import { useSemesterStore } from '../stores/semester'

const BASE_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:3000'

export function useRealtimeUpdates({ onStudentsUpdated, onTopScoresUpdated } = {}) {
  let es = null
  let reconnectTimer = null
  const studentStore = useStudentStore()
  const semesterStore = useSemesterStore()

  function connect() {
    if (es) es.close()

    es = new EventSource(`${BASE_URL}/api/events`)

    es.addEventListener('students_updated', () => {
      // Re-fetch students for the current semester
      const semId = semesterStore.selectedSemester?.id
      studentStore.fetchStudents({ semester_id: semId })
      if (onStudentsUpdated) onStudentsUpdated()
    })

    es.addEventListener('top_scores_updated', () => {
      if (onTopScoresUpdated) onTopScoresUpdated()
    })

    es.onerror = () => {
      es.close()
      // Reconnect after 5s
      clearTimeout(reconnectTimer)
      reconnectTimer = setTimeout(connect, 5000)
    }
  }

  onMounted(connect)

  onUnmounted(() => {
    clearTimeout(reconnectTimer)
    if (es) es.close()
    es = null
  })
}
