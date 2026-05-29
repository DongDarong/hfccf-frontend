<script setup>
defineProps({
  context: {
    type: Object,
    default: () => ({}),
  },
  academicContext: {
    type: Object,
    default: () => ({}),
  },
  references: {
    type: Object,
    default: () => ({}),
  },
})

function formatCollection(items = [], formatter = (item) => item?.label || item?.name || item?.code || `#${item?.id ?? '-'}`) {
  return Array.isArray(items) ? items.map((item) => formatter(item)) : []
}
</script>

<template>
  <div class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
    <div class="grid gap-4 lg:grid-cols-3">
      <div class="rounded-xl border border-slate-200 bg-slate-50 p-4">
        <h3 class="text-sm font-semibold text-slate-900">Historical Context</h3>
        <dl class="mt-3 space-y-2 text-sm text-slate-600">
          <div class="flex items-center justify-between gap-3">
            <dt>Academic year</dt>
            <dd class="font-medium text-slate-900">{{ context.academicYearId || '-' }}</dd>
          </div>
          <div class="flex items-center justify-between gap-3">
            <dt>Term</dt>
            <dd class="font-medium text-slate-900">{{ context.termId || '-' }}</dd>
          </div>
          <div class="flex items-center justify-between gap-3">
            <dt>Report period</dt>
            <dd class="font-medium text-slate-900">{{ context.reportPeriodId || '-' }}</dd>
          </div>
          <div class="flex items-center justify-between gap-3">
            <dt>Class</dt>
            <dd class="font-medium text-slate-900">{{ context.classId || '-' }}</dd>
          </div>
          <div class="flex items-center justify-between gap-3">
            <dt>Student</dt>
            <dd class="font-medium text-slate-900">{{ context.studentId || '-' }}</dd>
          </div>
        </dl>
      </div>

      <div class="rounded-xl border border-slate-200 bg-slate-50 p-4">
        <h3 class="text-sm font-semibold text-slate-900">Academic Context</h3>
        <div class="mt-3 space-y-3 text-sm text-slate-600">
          <div>
            <p class="text-xs uppercase tracking-wide text-slate-500">Academic years</p>
            <p class="mt-1">{{ formatCollection(academicContext.academicYears).join(', ') || '-' }}</p>
          </div>
          <div>
            <p class="text-xs uppercase tracking-wide text-slate-500">Terms</p>
            <p class="mt-1">{{ formatCollection(academicContext.terms).join(', ') || '-' }}</p>
          </div>
          <div>
            <p class="text-xs uppercase tracking-wide text-slate-500">Report periods</p>
            <p class="mt-1">{{ formatCollection(academicContext.reportPeriods).join(', ') || '-' }}</p>
          </div>
        </div>
      </div>

      <div class="rounded-xl border border-slate-200 bg-slate-50 p-4">
        <h3 class="text-sm font-semibold text-slate-900">References</h3>
        <div class="mt-3 space-y-3 text-sm text-slate-600">
          <div>
            <p class="text-xs uppercase tracking-wide text-slate-500">Snapshots</p>
            <p class="mt-1">{{ (references.snapshotIds || []).join(', ') || '-' }}</p>
          </div>
          <div>
            <p class="text-xs uppercase tracking-wide text-slate-500">Exports</p>
            <p class="mt-1">{{ (references.exportIds || []).join(', ') || '-' }}</p>
          </div>
          <div>
            <p class="text-xs uppercase tracking-wide text-slate-500">Audits</p>
            <p class="mt-1">{{ (references.auditIds || []).join(', ') || '-' }}</p>
          </div>
          <div>
            <p class="text-xs uppercase tracking-wide text-slate-500">Assignments</p>
            <p class="mt-1">{{ (references.assignmentIds || []).join(', ') || '-' }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
