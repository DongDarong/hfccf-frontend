<script setup>
import { computed } from 'vue'
import Message from 'primevue/message'
import GuardianPortalLayout from '@/modules/guardian-portal/layouts/GuardianPortalLayout.vue'
import GuardianReadOnlyNotice from '@/modules/guardian-portal/components/GuardianReadOnlyNotice.vue'
import GuardianSummaryCard from '@/modules/guardian-portal/components/GuardianSummaryCard.vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useGuardianStudentSummary } from '@/modules/guardian-portal/composables/useGuardianStudentSummary'

const route = useRoute()
const { t } = useI18n()
const studentId = computed(() => String(route.params.studentId || ''))
const { student, attendanceSummary, loading, errorMessage } = useGuardianStudentSummary(studentId)
</script>

<template>
  <GuardianPortalLayout>
    <div class="grid gap-5">
      <GuardianReadOnlyNotice>{{ t('guardianPortal.common.readOnlyNotice') }}</GuardianReadOnlyNotice>
      <Message v-if="errorMessage" severity="error" :closable="false">{{ errorMessage }}</Message>
      <GuardianSummaryCard :title="t('guardianPortal.attendance.title')" :subtitle="student?.fullName || t('guardianPortal.attendance.subtitle')">
        <div class="grid gap-2 text-sm text-slate-700">
          <p>{{ t('guardianPortal.attendance.total', { count: attendanceSummary?.attendanceCount || 0 }) }}</p>
          <p>{{ t('guardianPortal.attendance.present', { count: attendanceSummary?.presentCount || 0 }) }}</p>
          <p>{{ t('guardianPortal.attendance.absent', { count: attendanceSummary?.absentCount || 0 }) }}</p>
        </div>
      </GuardianSummaryCard>
      <div v-if="loading" class="rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-500">
        {{ t('guardianPortal.common.loading') }}
      </div>
    </div>
  </GuardianPortalLayout>
</template>
