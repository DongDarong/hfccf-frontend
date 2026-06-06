<script setup>
import { computed, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import MainLayout from '@/layouts/MainLayout.vue'
import HeaderSection from '@/components/navigation/HeaderSection.vue'
import Button from '@/components/buttons/Button.vue'
import Steps from 'primevue/steps'
import { useLanguage } from '@/composables/useLanguage'
import { useAssessmentWizard } from '../composables/useAssessmentWizard'
import { useToast } from 'primevue/usetoast'
import { useConfirm } from 'primevue/useconfirm'
import WizardStepForm from '../components/wizard/WizardStepForm.vue'
import WizardStepStudent from '../components/wizard/WizardStepStudent.vue'
import WizardStepAssessment from '../components/wizard/WizardStepAssessment.vue'
import WizardStepReview from '../components/wizard/WizardStepReview.vue'

defineOptions({ name: 'AssessmentWizardPage' })

const router  = useRouter()
const { t }   = useLanguage()
const toast   = useToast()
const confirm = useConfirm()
const { store } = useAssessmentWizard()

const stepItems = computed(() => [
  { label: t('assessmentWizard.steps.form') },
  { label: t('assessmentWizard.steps.student') },
  { label: t('assessmentWizard.steps.assessment') },
  { label: t('assessmentWizard.steps.review') },
])

async function submitAssessment() {
  confirm.require({
    message: t('assessmentWizard.confirmSubmit'),
    accept: async () => {
      await store.submit()
      toast.add({ severity: 'success', summary: t('assessmentWizard.submitSuccess'), life: 3000 })
      router.push({ name: 'assessment-submission-list' })
    },
  })
}

onUnmounted(() => store.reset())
</script>

<template>
  <MainLayout>
    <div class="flex flex-col gap-6">
      <HeaderSection :title="t('assessmentWizard.title')" />

      <Steps :model="stepItems" :active-step="store.currentStep" class="rounded-xl border border-slate-200 bg-white p-4 shadow-sm" />

      <div class="min-h-96 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <WizardStepForm       v-if="store.currentStep === 0" />
        <WizardStepStudent    v-else-if="store.currentStep === 1" />
        <WizardStepAssessment v-else-if="store.currentStep === 2" />
        <WizardStepReview     v-else-if="store.currentStep === 3" />
      </div>

      <div class="flex items-center justify-end gap-3 rounded-xl border border-slate-200 bg-white px-5 py-3.5 shadow-sm">
        <Button
          :label="t('assessmentWizard.navigation.back')"
          icon="pi pi-arrow-left"
          severity="secondary"
          :disabled="!store.canGoBack"
          @click="store.goBack()"
        />
        <Button
          :label="t('assessmentWizard.navigation.saveDraft')"
          icon="pi pi-save"
          severity="secondary"
          :loading="store.isSaving"
          @click="store.saveDraft()"
        />
        <Button
          v-if="!store.isLastStep"
          :label="t('assessmentWizard.navigation.next')"
          icon="pi pi-arrow-right"
          icon-pos="right"
          :disabled="!store.canGoNext"
          @click="store.goNext()"
        />
        <Button
          v-else
          :label="t('assessmentWizard.navigation.submit')"
          icon="pi pi-check"
          :loading="store.isSubmitting"
          @click="submitAssessment"
        />
      </div>
    </div>
  </MainLayout>
</template>
