<script setup>
import RoleDashboardLayout from '@/modules/users/shared/dashboards/RoleDashboardLayout.vue'

const cards = [
  { title: 'Lessons today', value: 6, label: 'Across assigned groups', status: 'info' },
  { title: 'Tasks to grade', value: 21, label: 'Due in 48 hours', status: 'warning' },
  { title: 'Students needing support', value: 4, label: 'Intervention required', status: 'error' },
  { title: 'Completed lesson plans', value: 9, label: 'This week', status: 'success' },
]

const actions = [
  "Publish today's lesson summary",
  'Grade overdue assignments',
  'Schedule support sessions',
]
</script>

<template>
  <RoleDashboardLayout
    title="Teaching Workspace"
    subtitle="Lesson execution, student tasks, and classroom follow-up."
    :cards="cards"
    spotlight-title="Classroom execution"
    spotlight-text="Focus on task grading and support follow-ups for students flagged this week."
    :actions="actions"
  />
</template>



