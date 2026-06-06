import { beforeEach, describe, expect, it, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAssessmentWizard } from '@/modules/assessment/composables/useAssessmentWizard'
import { useWizardStore } from '@/modules/assessment/stores/useWizardStore'

vi.mock('@/modules/assessment/services/assessmentSubmissionApi', () => ({
  assessmentSubmissionApi: {
    create: vi.fn(),
    update: vi.fn(),
    submit: vi.fn(),
  },
}))

beforeEach(() => {
  setActivePinia(createPinia())
  vi.clearAllMocks()
})

// totalSteps is 4 in the wizard store (steps: form, student, assessment, review)

describe('useAssessmentWizard', () => {
  it('progressPercent is 25 at step 0', () => {
    const { progressPercent } = useAssessmentWizard()
    expect(progressPercent.value).toBe(25)
  })

  it('progressPercent is 50 at step 1', () => {
    const { store, progressPercent } = useAssessmentWizard()
    store.goToStep(1)
    expect(progressPercent.value).toBe(50)
  })

  it('progressPercent is 75 at step 2', () => {
    const { store, progressPercent } = useAssessmentWizard()
    store.goToStep(2)
    expect(progressPercent.value).toBe(75)
  })

  it('progressPercent is 100 at last step', () => {
    const { store, progressPercent } = useAssessmentWizard()
    store.goToStep(3)
    expect(progressPercent.value).toBe(100)
  })

  it('answeredCount is 0 with no answers', () => {
    const { answeredCount } = useAssessmentWizard()
    expect(answeredCount.value).toBe(0)
  })

  it('answeredCount reflects answers set on the store', () => {
    const { store, answeredCount } = useAssessmentWizard()
    store.setAnswer(1, 'Yes')
    store.setAnswer(2, 'No')
    expect(answeredCount.value).toBe(2)
  })

  it('selectForm sets selectedForm on the store', () => {
    const { selectForm } = useAssessmentWizard()
    const store = useWizardStore()
    selectForm({ id: 10, name: 'DSAM Form' })
    expect(store.selectedForm).toEqual({ id: 10, name: 'DSAM Form' })
  })

  it('selectStudent sets selectedStudent on the store', () => {
    const { selectStudent } = useAssessmentWizard()
    const store = useWizardStore()
    selectStudent({ id: 5, name: 'Alice' })
    expect(store.selectedStudent).toEqual({ id: 5, name: 'Alice' })
  })

  it('exposes the store directly', () => {
    const { store } = useAssessmentWizard()
    expect(store).toBe(useWizardStore())
  })
})
