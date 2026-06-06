<script setup>
import { onMounted, ref } from 'vue'
import Select from 'primevue/select'
import Tag from 'primevue/tag'
import { useLanguage } from '@/composables/useLanguage'
import { assessmentFormApi } from '../../services/assessmentFormApi'
import { useAssessmentWizard } from '../../composables/useAssessmentWizard'

const { t } = useLanguage()
const { store, selectForm } = useAssessmentWizard()

const forms     = ref([])
const isLoading = ref(false)

async function load() {
  isLoading.value = true
  try {
    const res = await assessmentFormApi.list({ module: 'preschool', status: 'published' })
    forms.value = res.data.data
  } finally {
    isLoading.value = false
  }
}

onMounted(load)
</script>

<template>
  <div class="flex flex-col gap-5">
    <div>
      <h3 class="text-base font-semibold text-slate-800">{{ t('assessmentWizard.selectForm') }}</h3>
      <p class="mt-0.5 text-sm text-slate-400">{{ t('assessmentWizard.selectFormHint') }}</p>
    </div>

    <Select
      :model-value="store.selectedForm"
      :options="forms"
      option-label="name"
      :loading="isLoading"
      :placeholder="t('assessmentWizard.selectForm')"
      filter
      class="w-full"
      @update:model-value="selectForm"
    />

    <!-- Selected form preview -->
    <div v-if="store.selectedForm" class="flex items-start justify-between gap-3 rounded-xl border border-blue-200 bg-blue-50 p-4">
      <div class="min-w-0">
        <p class="font-medium text-slate-800">{{ store.selectedForm.name }}</p>
        <p v-if="store.selectedForm.description" class="mt-0.5 truncate text-xs text-slate-500">
          {{ store.selectedForm.description }}
        </p>
      </div>
      <Tag :value="t('formBuilder.statuses.published')" severity="success" class="shrink-0" />
    </div>

    <!-- No published forms -->
    <div v-else-if="!isLoading && !forms.length" class="rounded-xl border border-slate-200 bg-slate-50 py-10 text-center">
      <i class="pi pi-file-edit mb-2 block text-3xl text-slate-300" />
      <p class="text-sm text-slate-400">{{ t('assessmentWizard.noPublishedForms') }}</p>
    </div>
  </div>
</template>
