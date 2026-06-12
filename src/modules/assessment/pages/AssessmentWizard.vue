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

      <div class="wizard-guidance">
        <p class="wizard-guidance__step">
          <span class="wizard-guidance__icon">📋</span>
          <strong>Step 1 — Form:</strong> Select or create the assessment form
        </p>
        <p class="wizard-guidance__step">
          <span class="wizard-guidance__icon">👤</span>
          <strong>Step 2 — Student:</strong> Choose the student taking the assessment
        </p>
        <p class="wizard-guidance__step">
          <span class="wizard-guidance__icon">📝</span>
          <strong>Step 3 — Assessment:</strong> Complete the form responses
        </p>
        <p class="wizard-guidance__step">
          <span class="wizard-guidance__icon">✅</span>
          <strong>Step 4 — Review:</strong> Verify all information before submitting
        </p>
      </div>

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

.wizard-guidance {
  border-radius: 1rem;
  border: 1px solid #e0e7ff;
  background: #f0f4ff;
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.wizard-guidance__step {
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.95rem;
  color: #1e40af;
}

.wizard-guidance__icon {
  font-size: 1.25rem;
  flex-shrink: 0;
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

@media (max-width: 768px) {
  .wizard-guidance {
    gap: 0.5rem;
    padding: 1rem;
  }

  .wizard-guidance__step {
    font-size: 0.9rem;
  }

  .assessment-wizard__footer {
    flex-wrap: wrap;
  }
}
</style>
