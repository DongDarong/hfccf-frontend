<script setup>
// Keep the student profile read-only and summary-driven so guardians can only
// inspect the linked child bundle that the backend authorizes for them.
import { computed } from 'vue'
import Button from 'primevue/button'
import Message from 'primevue/message'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import GuardianPortalLayout from '@/modules/guardian-portal/layouts/GuardianPortalLayout.vue'
import GuardianReadOnlyNotice from '@/modules/guardian-portal/components/GuardianReadOnlyNotice.vue'
import GuardianSummaryCard from '@/modules/guardian-portal/components/GuardianSummaryCard.vue'
import { useGuardianStudentSummary } from '@/modules/guardian-portal/composables/useGuardianStudentSummary'

defineOptions({
  name: 'GuardianStudentProfilePage',
})

const route = useRoute()
const router = useRouter()
const { t } = useI18n()

const studentId = computed(() => String(route.params.studentId || ''))
const {
  student,
  attendanceSummary,
  scheduleSummary,
  progressSummary,
  reportsSummary,
  loading,
  errorMessage,
} = useGuardianStudentSummary(studentId)

function formatBundle(value, emptyKey) {
  if (!value) return t(emptyKey)

  if (typeof value === 'string') return value

  return JSON.stringify(value, null, 2)
}

function goTo(routeName) {
  return router.push({ name: routeName, params: { studentId: studentId.value } })
}
</script>

<template>
  <GuardianPortalLayout>
    <div class="grid gap-5">
      <GuardianReadOnlyNotice>
        {{ t('guardianPortal.common.readOnlyNotice') }}
      </GuardianReadOnlyNotice>

      <Message v-if="errorMessage" severity="error" :closable="false">
        {{ errorMessage }}
      </Message>

      <GuardianSummaryCard
        :title="student?.fullName || t('guardianPortal.studentProfile.title')"
        :subtitle="student?.studentCode || t('guardianPortal.studentProfile.subtitle')"
      >
        <div class="grid gap-1 text-sm text-slate-700">
          <p>{{ student?.guardianName || t('guardianPortal.common.emptyValue') }}</p>
          <p>{{ student?.guardianPhone || t('guardianPortal.common.emptyValue') }}</p>
        </div>
      </GuardianSummaryCard>

      <div class="grid gap-4 lg:grid-cols-2">
        <GuardianSummaryCard :title="t('guardianPortal.studentProfile.attendanceTitle')" :subtitle="t('guardianPortal.studentProfile.attendanceSubtitle')">
          <pre class="overflow-auto rounded-xl bg-slate-50 p-3 text-xs text-slate-700">{{ formatBundle(attendanceSummary?.summary || attendanceSummary, 'guardianPortal.common.emptySummary') }}</pre>
        </GuardianSummaryCard>
        <GuardianSummaryCard :title="t('guardianPortal.studentProfile.scheduleTitle')" :subtitle="t('guardianPortal.studentProfile.scheduleSubtitle')">
          <pre class="overflow-auto rounded-xl bg-slate-50 p-3 text-xs text-slate-700">{{ formatBundle(scheduleSummary?.summary || scheduleSummary, 'guardianPortal.common.emptySummary') }}</pre>
        </GuardianSummaryCard>
        <GuardianSummaryCard :title="t('guardianPortal.studentProfile.progressTitle')" :subtitle="t('guardianPortal.studentProfile.progressSubtitle')">
          <pre class="overflow-auto rounded-xl bg-slate-50 p-3 text-xs text-slate-700">{{ formatBundle(progressSummary?.summary || progressSummary, 'guardianPortal.common.emptySummary') }}</pre>
        </GuardianSummaryCard>
        <GuardianSummaryCard :title="t('guardianPortal.studentProfile.reportsTitle')" :subtitle="t('guardianPortal.studentProfile.reportsSubtitle')">
          <pre class="overflow-auto rounded-xl bg-slate-50 p-3 text-xs text-slate-700">{{ formatBundle(reportsSummary?.summary || reportsSummary, 'guardianPortal.common.emptySummary') }}</pre>
        </GuardianSummaryCard>
      </div>

      <div class="flex flex-wrap gap-3">
        <Button :label="t('guardianPortal.studentProfile.openAttendance')" severity="secondary" outlined @click="goTo('guardian-portal-student-attendance')" />
        <Button :label="t('guardianPortal.studentProfile.openSchedule')" severity="secondary" outlined @click="goTo('guardian-portal-student-schedule')" />
        <Button :label="t('guardianPortal.studentProfile.openProgress')" severity="secondary" outlined @click="goTo('guardian-portal-student-progress')" />
        <Button :label="t('guardianPortal.studentProfile.openReports')" severity="secondary" outlined @click="goTo('guardian-portal-student-reports')" />
      </div>

      <div v-if="loading" class="rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-500">
        {{ t('guardianPortal.common.loading') }}
      </div>
    </div>
  </GuardianPortalLayout>
</template>
