<script setup>
import { onUnmounted } from 'vue'
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

const router = useRouter()
const { t } = useLanguage()
const toast = useToast()
const confirm = useConfirm()
const { store } = useAssessmentWizard()

const stepItems = [
  { label: t('assessmentWizard.steps.form') },
  { label: t('assessmentWizard.steps.student') },
  { label: t('assessmentWizard.steps.assessment') },
  { label: t('assessmentWizard.steps.review') },
]

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
    <div class="assessment-wizard">
      <HeaderSection :title="t('assessmentWizard.title')" />

      <Steps :model="stepItems" :active-step="store.currentStep" class="assessment-wizard__steps" />

      <div class="assessment-wizard__body">
        <WizardStepForm v-if="store.currentStep === 0" />
        <WizardStepStudent v-else-if="store.currentStep === 1" />
        <WizardStepAssessment v-else-if="store.currentStep === 2" />
        <WizardStepReview v-else-if="store.currentStep === 3" />
      </div>

      <div class="assessment-wizard__footer">
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

<style scoped>
.assessment-wizard {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.assessment-wizard__body {
  background: var(--surface-card);
  border: 1px solid var(--surface-border);
  border-radius: 8px;
  padding: 1.5rem;
  min-height: 400px;
}

.assessment-wizard__footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
}
</style>
