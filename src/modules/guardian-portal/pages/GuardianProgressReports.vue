<script setup>
// Keep the progress view read-only so guardians can inspect finalized
// assessment summaries without touching the underlying Preschool records.
import { computed } from 'vue'
import Message from 'primevue/message'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import GuardianPortalLayout from '@/modules/guardian-portal/layouts/GuardianPortalLayout.vue'
import GuardianReadOnlyNotice from '@/modules/guardian-portal/components/GuardianReadOnlyNotice.vue'
import GuardianSummaryCard from '@/modules/guardian-portal/components/GuardianSummaryCard.vue'
import { useGuardianStudentSummary } from '@/modules/guardian-portal/composables/useGuardianStudentSummary'

defineOptions({
  name: 'GuardianProgressReportsPage',
})

const route = useRoute()
const { t } = useI18n()
const studentId = computed(() => String(route.params.studentId || ''))
const { student, progressSummary, loading, errorMessage } = useGuardianStudentSummary(studentId)

function formatSummary(value) {
  if (!value) return t('guardianPortal.common.emptySummary')
  if (typeof value === 'string') return value
  return JSON.stringify(value, null, 2)
}
</script>

<template>
  <GuardianPortalLayout>
    <div class="grid gap-5">
      <GuardianReadOnlyNotice>{{ t('guardianPortal.common.readOnlyNotice') }}</GuardianReadOnlyNotice>
      <Message v-if="errorMessage" severity="error" :closable="false">{{ errorMessage }}</Message>
      <GuardianSummaryCard :title="t('guardianPortal.progress.title')" :subtitle="student?.fullName || t('guardianPortal.progress.subtitle')">
        <pre class="overflow-auto rounded-xl bg-slate-50 p-3 text-xs text-slate-700">{{ formatSummary(progressSummary?.summary || progressSummary) }}</pre>
      </GuardianSummaryCard>
      <div v-if="loading" class="rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-500">
        {{ t('guardianPortal.common.loading') }}
      </div>
    </div>
  </GuardianPortalLayout>
</template>
