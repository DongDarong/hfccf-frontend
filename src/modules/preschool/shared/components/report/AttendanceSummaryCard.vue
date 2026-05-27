<script setup>
// Keep attendance rollups separate because report pages need a compact summary
// without knowing how the backend groups present, late, absent, and excused.
import { useLanguage } from '@/composables/useLanguage'

defineProps({
  summary: {
    type: Object,
    default: () => ({}),
  },
})

const { t } = useLanguage()
</script>

<template>
  <article class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
    <div class="flex items-center justify-between gap-3">
      <h3 class="text-sm font-semibold text-slate-900">{{ t('preschoolReportsShared.attendanceTitle') }}</h3>
      <span class="text-xs text-slate-500">{{ t('preschoolReportsShared.attendanceSubtext') }}</span>
    </div>

    <dl class="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
      <div class="rounded-xl bg-slate-50 p-3">
        <dt class="text-xs uppercase tracking-wide text-slate-500">{{ t('preschoolReportsShared.attendance.total') }}</dt>
        <dd class="mt-1 text-xl font-semibold text-slate-900">{{ summary.attendanceCount ?? 0 }}</dd>
      </div>
      <div class="rounded-xl bg-emerald-50 p-3">
        <dt class="text-xs uppercase tracking-wide text-emerald-700">{{ t('preschoolReportsShared.attendance.present') }}</dt>
        <dd class="mt-1 text-xl font-semibold text-emerald-900">{{ summary.presentCount ?? 0 }}</dd>
      </div>
      <div class="rounded-xl bg-amber-50 p-3">
        <dt class="text-xs uppercase tracking-wide text-amber-700">{{ t('preschoolReportsShared.attendance.late') }}</dt>
        <dd class="mt-1 text-xl font-semibold text-amber-900">{{ summary.lateCount ?? 0 }}</dd>
      </div>
      <div class="rounded-xl bg-rose-50 p-3">
        <dt class="text-xs uppercase tracking-wide text-rose-700">{{ t('preschoolReportsShared.attendance.absent') }}</dt>
        <dd class="mt-1 text-xl font-semibold text-rose-900">{{ summary.absentCount ?? 0 }}</dd>
      </div>
      <div class="rounded-xl bg-blue-50 p-3">
        <dt class="text-xs uppercase tracking-wide text-blue-700">{{ t('preschoolReportsShared.attendance.excused') }}</dt>
        <dd class="mt-1 text-xl font-semibold text-blue-900">{{ summary.excusedCount ?? 0 }}</dd>
      </div>
    </dl>

    <p v-if="summary.latestAttendanceDate" class="mt-3 text-xs text-slate-500">
      {{ t('preschoolReportsShared.attendance.latest', { date: summary.latestAttendanceDate }) }}
    </p>
  </article>
</template>
