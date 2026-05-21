<script setup>
// Keep duplicate guardian review separate so staff can inspect candidate
// records without the page having to know the backend grouping details.
import { computed } from 'vue'
import { useLanguage } from '@/composables/useLanguage'
import GuardianStatusBadge from './GuardianStatusBadge.vue'
import GuardianConsistencySeverityBadge from './GuardianConsistencySeverityBadge.vue'

defineOptions({
  name: 'GuardianDuplicateWarning',
})

const { t } = useLanguage()

const props = defineProps({
  group: {
    type: Object,
    default: () => ({}),
  },
  index: {
    type: Number,
    default: 1,
  },
})

const signalLabels = computed(() => ({
  same_phone: t('preschoolGuardianIntegrityPage.signalLabels.samePhone'),
  same_email: t('preschoolGuardianIntegrityPage.signalLabels.sameEmail'),
  same_name_phone: t('preschoolGuardianIntegrityPage.signalLabels.sameNamePhone'),
  same_name_relationship_type: t('preschoolGuardianIntegrityPage.signalLabels.sameNameRelationshipType'),
}))

function formatGuardian(guardian) {
  if (!guardian) return ''
  return `${guardian.fullName || '-'}${guardian.phone ? ` (${guardian.phone})` : ''}`
}
</script>

<template>
  <article class="rounded-2xl border border-amber-200 bg-amber-50 p-4 shadow-sm">
    <div class="flex flex-wrap items-start justify-between gap-3">
      <div>
        <p class="text-xs font-semibold uppercase tracking-wide text-amber-700">
          {{ t('preschoolGuardianIntegrityPage.duplicateGroup.title', { index: props.index }) }}
        </p>
        <h3 class="mt-1 text-lg font-semibold text-amber-950">
          {{ t('preschoolGuardianIntegrityPage.duplicateGroup.heading') }}
        </h3>
        <p class="mt-1 text-sm text-amber-900">
          {{ t('preschoolGuardianIntegrityPage.duplicateGroup.message') }}
        </p>
      </div>
      <GuardianConsistencySeverityBadge :severity="group.severity" />
    </div>

    <div class="mt-4 flex flex-wrap gap-2">
      <span
        v-for="signal in props.group.signals"
        :key="signal"
        class="inline-flex items-center rounded-full border border-amber-200 bg-white px-2.5 py-1 text-xs font-semibold text-amber-700"
      >
        {{ signalLabels[signal] || signal }}
      </span>
    </div>

    <div class="mt-4 grid gap-3 md:grid-cols-2">
      <div
        v-for="guardian in props.group.guardians"
        :key="guardian.id"
        class="rounded-xl border border-white/70 bg-white/90 px-4 py-3 text-sm text-slate-700 shadow-sm"
      >
        <div class="flex items-start justify-between gap-2">
          <p class="font-semibold text-slate-900">{{ formatGuardian(guardian) }}</p>
          <GuardianStatusBadge :status="guardian.status" />
        </div>
        <p class="mt-2 text-xs text-slate-500">
          {{ t('preschoolGuardianIntegrityPage.labels.relationshipsCount') }}: {{ guardian.relationshipsCount ?? 0 }}
        </p>
        <p class="text-xs text-slate-500">
          {{ t('preschoolGuardianIntegrityPage.labels.activeRelationshipsCount') }}: {{ guardian.activeRelationshipsCount ?? 0 }}
        </p>
      </div>
    </div>
  </article>
</template>
