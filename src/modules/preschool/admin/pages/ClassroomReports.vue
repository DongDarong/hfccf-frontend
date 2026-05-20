<script setup>
// Keep the classroom report page focused on class selection and loading so
// the detailed report table can remain a separate reusable component.
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import MainLayout from '@/layouts/MainLayout.vue'
import HeaderSection from '@/components/navigation/HeaderSection.vue'
import Button from '@/components/buttons/Button.vue'
import Dropdown from 'primevue/dropdown'
import { useLanguage } from '@/composables/useLanguage'
import { usePreschoolClassroomReports } from '@/modules/preschool/composables/usePreschoolClassroomReports'
import ReportPeriodSelector from '@/modules/preschool/shared/components/report/ReportPeriodSelector.vue'
import ClassroomProgressTable from '@/modules/preschool/shared/components/report/ClassroomProgressTable.vue'

defineOptions({
  name: 'PreschoolClassroomReportsPage',
})

const route = useRoute()
const router = useRouter()
const { t } = useLanguage()

const {
  classOptions,
  errorMessage,
  isTeacher,
  loadClassroomReport,
  loadLookupData,
  loading,
  reportBundle,
  reportPeriods,
  selectedClassId,
  selectedPeriodLabel,
  setSelectedClassId,
  setSelectedPeriodLabel,
} = usePreschoolClassroomReports()

async function applyReport() {
  await loadClassroomReport(selectedClassId.value, selectedPeriodLabel.value)
}

async function handleClassChange(classId) {
  setSelectedClassId(classId)
  setSelectedPeriodLabel('')
  await loadClassroomReport(classId)
}

function goBack() {
  router.push({
    name: isTeacher.value ? 'dashboard-preschool-teacher' : 'dashboard-preschool-admin-reports',
  })
}

onMounted(async () => {
  const classId = String(route.query.classId || '').trim()
  const periodLabel = String(route.query.period || '').trim()

  if (classId) {
    setSelectedClassId(classId)
  }

  if (periodLabel) {
    setSelectedPeriodLabel(periodLabel)
  }

  await loadLookupData()

  if (selectedClassId.value) {
    await loadClassroomReport(selectedClassId.value, selectedPeriodLabel.value)
  }
})
</script>

<template>
  <MainLayout>
    <section class="space-y-4">
      <HeaderSection
        :title="t('preschoolClassroomReportsPage.title')"
        :subtitle="t('preschoolClassroomReportsPage.subtitle')"
      />

      <div class="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto]">
        <div class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div class="grid gap-3 md:grid-cols-[minmax(0,1fr)_auto]">
            <label class="space-y-2 text-sm font-medium text-slate-700">
              <span>{{ t('preschoolClassroomReportsPage.filters.class') }}</span>
              <Dropdown
                :model-value="selectedClassId"
                :options="classOptions"
                option-label="label"
                option-value="value"
                class="w-full"
                :placeholder="t('preschoolClassroomReportsPage.placeholders.class')"
                @update:model-value="handleClassChange"
              />
            </label>

            <div class="flex items-end gap-2">
              <Button type="button" variant="ghost" size="md" rounded="xl" @click="goBack">
                {{ t('preschoolClassroomReportsPage.actions.back') }}
              </Button>
            </div>
          </div>
        </div>

        <ReportPeriodSelector
          :label="t('preschoolClassroomReportsPage.filters.period')"
          :periods="reportPeriods"
          :model-value="selectedPeriodLabel"
          :placeholder="t('preschoolClassroomReportsPage.placeholders.period')"
          :loading="loading"
          @update:model-value="setSelectedPeriodLabel"
          @refresh="applyReport"
        />
      </div>

      <div v-if="errorMessage" class="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
        {{ errorMessage }}
      </div>

      <ClassroomProgressTable :report="reportBundle.report" :loading="loading" />
    </section>
  </MainLayout>
</template>
