<script setup>
import { computed } from 'vue'
import { useLanguage } from '@/composables/useLanguage'

defineProps({
  students: {
    type: Array,
    default: () => [],
  },
  attendanceRecords: {
    type: Array,
    default: () => [],
  },
  classLabel: {
    type: String,
    default: '',
  },
})

const { t } = useLanguage()

const statistics = computed(() => {
  const totalStudents = props.students.length
  const totalRecords = props.attendanceRecords.length

  const presentCount = props.attendanceRecords.filter(r => r.status === 'present').length
  const absentCount = props.attendanceRecords.filter(r => r.status === 'absent').length
  const lateCount = props.attendanceRecords.filter(r => r.status === 'late').length
  const excusedCount = props.attendanceRecords.filter(r => r.status === 'excused').length

  const presentPercentage = totalRecords > 0 ? Math.round((presentCount / totalRecords) * 100) : 0
  const absentPercentage = totalRecords > 0 ? Math.round((absentCount / totalRecords) * 100) : 0
  const latePercentage = totalRecords > 0 ? Math.round((lateCount / totalRecords) * 100) : 0
  const excusedPercentage = totalRecords > 0 ? Math.round((excusedCount / totalRecords) * 100) : 0

  return {
    totalStudents,
    totalRecords,
    presentCount,
    absentCount,
    lateCount,
    excusedCount,
    presentPercentage,
    absentPercentage,
    latePercentage,
    excusedPercentage,
  }
})

const stats = [
  {
    icon: 'pi-users',
    label: 'Total Students',
    value: () => statistics.value.totalStudents,
    color: 'blue',
  },
  {
    icon: 'pi-check-circle',
    label: 'Present',
    value: () => `${statistics.value.presentCount} (${statistics.value.presentPercentage}%)`,
    color: 'emerald',
  },
  {
    icon: 'pi-times-circle',
    label: 'Absent',
    value: () => `${statistics.value.absentCount} (${statistics.value.absentPercentage}%)`,
    color: 'rose',
  },
  {
    icon: 'pi-clock',
    label: 'Late',
    value: () => `${statistics.value.lateCount} (${statistics.value.latePercentage}%)`,
    color: 'amber',
  },
  {
    icon: 'pi-shield',
    label: 'Excused',
    value: () => `${statistics.value.excusedCount} (${statistics.value.excusedPercentage}%)`,
    color: 'blue',
  },
]

const colorMap = {
  blue: 'bg-blue-50 text-blue-700 border-blue-200',
  emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  rose: 'bg-rose-50 text-rose-700 border-rose-200',
  amber: 'bg-amber-50 text-amber-700 border-amber-200',
}
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <div>
        <h3 class="text-sm font-semibold uppercase tracking-wide text-slate-500">
          {{ t('preschoolReportsPage.statistics') || 'Report Statistics' }}
        </h3>
        <p class="mt-1 text-sm text-slate-600">{{ classLabel }}</p>
      </div>
    </div>

    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
      <div
        v-for="stat in stats"
        :key="stat.label"
        :class="[
          'rounded-xl border-2 p-4 transition-all',
          colorMap[stat.color],
        ]"
      >
        <div class="flex items-center gap-3">
          <div class="text-2xl opacity-80">
            <i :class="`pi ${stat.icon}`" />
          </div>
          <div class="flex-1">
            <p class="text-xs font-semibold uppercase tracking-wide opacity-75">
              {{ stat.label }}
            </p>
            <p class="mt-1 text-lg font-bold">
              {{ stat.value() }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
