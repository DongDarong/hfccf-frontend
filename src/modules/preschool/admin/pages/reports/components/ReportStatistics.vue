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
  <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
    <h3 class="mb-6 text-sm font-bold uppercase tracking-wide text-slate-900">
      📊 Statistics
    </h3>

    <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
      <div
        v-for="stat in stats"
        :key="stat.label"
        :class="[
          'rounded-xl border p-3 transition-all',
          colorMap[stat.color],
        ]"
      >
        <div class="flex items-center gap-2">
          <div :class="[
            'text-lg flex-shrink-0',
            {
              'text-emerald-600': stat.color === 'emerald',
              'text-rose-600': stat.color === 'rose',
              'text-amber-600': stat.color === 'amber',
              'text-blue-600': stat.color === 'blue',
            }
          ]">
            <i :class="`pi ${stat.icon}`" />
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-xs font-semibold text-slate-600 truncate">
              {{ stat.label }}
            </p>
            <p class="text-sm font-bold text-slate-900">
              {{ stat.value() }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
