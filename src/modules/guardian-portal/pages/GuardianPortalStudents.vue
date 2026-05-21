<script setup>
// Keep the child list separate from the dashboard so guardians can open a
// compact list view without mixing in the per-child summary cards.
import { computed, onMounted } from 'vue'
import Button from 'primevue/button'
import Message from 'primevue/message'
import { useRouter } from 'vue-router'
import GuardianPortalLayout from '@/modules/guardian-portal/layouts/GuardianPortalLayout.vue'
import GuardianReadOnlyNotice from '@/modules/guardian-portal/components/GuardianReadOnlyNotice.vue'
import GuardianStudentCard from '@/modules/guardian-portal/components/GuardianStudentCard.vue'
import { useGuardianPortalAuth } from '@/modules/guardian-portal/composables/useGuardianPortalAuth'
import { useGuardianPortalStudents } from '@/modules/guardian-portal/composables/useGuardianPortalStudents'

defineOptions({
  name: 'GuardianPortalStudentsPage',
})

const router = useRouter()
const { t, loadProfile } = useGuardianPortalAuth()
const { items: students, loading, errorMessage, loadStudents } = useGuardianPortalStudents()

const totalStudents = computed(() => students.value.length)

async function openStudent(student) {
  await router.push({ name: 'guardian-portal-student-profile', params: { studentId: student.id } })
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

      <Message v-if="errorMessage" severity="error" :closable="false">
        {{ errorMessage }}
      </Message>

      <div class="flex flex-wrap items-center justify-between gap-3">
        <div class="text-sm text-slate-600">
          {{ t('guardianPortal.students.total', { count: totalStudents }) }}
        </div>
        <Button :label="t('guardianPortal.common.refresh')" severity="secondary" outlined :loading="loading" @click="loadStudents" />
      </div>

      <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <GuardianStudentCard
          v-for="student in students"
          :key="student.id"
          :student="student"
          :action-label="t('guardianPortal.common.viewChild')"
          @view="openStudent"
        />
      </div>

      <div v-if="!loading && !students.length" class="rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-center text-sm text-slate-500">
        {{ t('guardianPortal.common.emptyStudents') }}
      </div>
    </div>
  </GuardianPortalLayout>
</template>
