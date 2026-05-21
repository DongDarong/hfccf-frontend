<script setup>
// Keep the guardian portal dashboard read-only and lightweight so it can act
// as the secure landing page for invited guardians without exposing admin UI.
import { computed, onMounted } from 'vue'
import Button from 'primevue/button'
import Message from 'primevue/message'
import { useRouter } from 'vue-router'
import GuardianPortalLayout from '@/modules/guardian-portal/layouts/GuardianPortalLayout.vue'
import GuardianReadOnlyNotice from '@/modules/guardian-portal/components/GuardianReadOnlyNotice.vue'
import GuardianStudentCard from '@/modules/guardian-portal/components/GuardianStudentCard.vue'
import GuardianSummaryCard from '@/modules/guardian-portal/components/GuardianSummaryCard.vue'
import { useGuardianPortalAuth } from '@/modules/guardian-portal/composables/useGuardianPortalAuth'
import { useGuardianPortalStudents } from '@/modules/guardian-portal/composables/useGuardianPortalStudents'

defineOptions({
  name: 'GuardianPortalDashboardPage',
})

const router = useRouter()
const { t, profile, loadProfile } = useGuardianPortalAuth()
const { items: students, loading, errorMessage, loadStudents } = useGuardianPortalStudents()

const visibleStudentsCount = computed(() => students.value.length)

function displayValue(value) {
  const text = String(value ?? '').trim()

  return text || t('guardianPortal.common.emptyValue')
}

async function navigateToStudents() {
  await router.push({ name: 'guardian-portal-students' })
}

onMounted(async () => {
  await loadProfile()
  await loadStudents()
})
</script>

<template>
  <GuardianPortalLayout>
    <div class="grid gap-5">
      <GuardianReadOnlyNotice>
        {{ t('guardianPortal.common.readOnlyNotice') }}
      </GuardianReadOnlyNotice>

      <div class="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <GuardianSummaryCard
          :title="t('guardianPortal.dashboard.title')"
          :subtitle="t('guardianPortal.dashboard.subtitle')"
        >
          <div class="grid gap-1 text-sm text-slate-700">
            <p>{{ t('guardianPortal.dashboard.childrenCount', { count: visibleStudentsCount }) }}</p>
            <p>{{ displayValue(profile?.guardian?.fullName) }}</p>
            <p>{{ displayValue(profile?.account?.email) }}</p>
          </div>
        </GuardianSummaryCard>

        <GuardianSummaryCard
          :title="t('guardianPortal.dashboard.summaryTitle')"
          :subtitle="t('guardianPortal.dashboard.summarySubtitle')"
        >
          <div class="grid gap-2 text-sm text-slate-700">
            <p>{{ t('guardianPortal.dashboard.accountStatus', { status: displayValue(profile?.account?.status) }) }}</p>
            <p>{{ t('guardianPortal.dashboard.lastLoginAt', { value: displayValue(profile?.account?.lastLoginAt) }) }}</p>
          </div>
        </GuardianSummaryCard>
      </div>

      <Message v-if="errorMessage" severity="error" :closable="false">
        {{ errorMessage }}
      </Message>

      <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <GuardianStudentCard
          v-for="student in students"
          :key="student.id"
          :student="student"
          :action-label="t('guardianPortal.dashboard.viewChild')"
          @view="router.push({ name: 'guardian-portal-student-profile', params: { studentId: student.id } })"
        />
      </div>

      <div v-if="!loading && !students.length" class="rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-center text-sm text-slate-500">
        {{ t('guardianPortal.common.emptyStudents') }}
      </div>

      <div class="flex flex-wrap gap-3">
        <Button
          :label="t('guardianPortal.dashboard.openChildren')"
          severity="secondary"
          outlined
          @click="navigateToStudents"
        />
      </div>
    </div>
  </GuardianPortalLayout>
</template>
