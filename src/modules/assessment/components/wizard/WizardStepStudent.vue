<script setup>
import { onMounted, ref } from 'vue'
import Select from 'primevue/select'
import { useLanguage } from '@/composables/useLanguage'
import { useAssessmentWizard } from '../../composables/useAssessmentWizard'
import http from '@/services/http'
import { normalizePerPage } from '@/services/api'

const { t } = useLanguage()
const { store, selectStudent } = useAssessmentWizard()

const students  = ref([])
const isLoading = ref(false)

async function load() {
  isLoading.value = true
  try {
    const res = await http.get('/preschool/students', {
      params: { per_page: normalizePerPage(200, 10, 100) },
    })
    students.value = res.data.data
  } finally {
    isLoading.value = false
  }
}

onMounted(load)
</script>

<template>
  <div class="flex flex-col gap-5">
    <div>
      <h3 class="text-base font-semibold text-slate-800">{{ t('assessmentWizard.selectStudent') }}</h3>
      <p class="mt-0.5 text-sm text-slate-400">{{ t('assessmentWizard.selectStudentHint') }}</p>
    </div>

    <Select
      :model-value="store.selectedStudent"
      :options="students"
      option-label="fullName"
      :loading="isLoading"
      :placeholder="t('assessmentWizard.selectStudent')"
      filter
      class="w-full"
      @update:model-value="selectStudent"
    />

    <!-- Selected student preview -->
    <div v-if="store.selectedStudent" class="flex items-center gap-4 rounded-xl border border-blue-200 bg-blue-50 p-4">
      <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-700">
        <i class="pi pi-user text-base" />
      </div>
      <div>
        <p class="font-medium text-slate-800">{{ store.selectedStudent.full_name ?? store.selectedStudent.fullName }}</p>
        <p class="text-xs text-slate-500">{{ store.selectedStudent.student_code }}</p>
      </div>
    </div>
  </div>
</template>
