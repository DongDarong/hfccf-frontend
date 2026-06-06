import { beforeEach, describe, expect, it, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useDsamWizardStore } from '@/modules/dsam/stores/useDsamWizardStore'

const mockCreate = vi.fn()
const mockGet    = vi.fn()
const mockSave   = vi.fn()
const mockSubmit = vi.fn()

vi.mock('@/modules/dsam/services/dsamSubmissionApi', () => ({
  dsamSubmissionApi: {
    create: (...a) => mockCreate(...a),
    get:    (...a) => mockGet(...a),
    save:   (...a) => mockSave(...a),
    submit: (...a) => mockSubmit(...a),
  },
}))

function okData(data) {
  return { data: { data } }
}

function makeSubmission(overrides = {}) {
  return {
    id: 'sub-1',
    status: 'draft',
    answers: [],
    draft_data: null,
    form_template: {
      sections: [
        { id: 1, title: 'Section 1', questions: [] },
        { id: 2, title: 'Section 2', questions: [] },
        { id: 3, title: 'Section 3', questions: [] },
      ],
    },
    ...overrides,
  }
}

beforeEach(() => {
  setActivePinia(createPinia())
  vi.clearAllMocks()
})

describe('useDsamWizardStore', () => {
  it('initialises with empty state', () => {
    const store = useDsamWizardStore()
    expect(store.submission).toBeNull()
    expect(store.answers).toEqual({})
    expect(store.currentStep).toBe(0)
    expect(store.isLoading).toBe(false)
    expect(store.isSaving).toBe(false)
    expect(store.isSubmitting).toBe(false)
  })

  // start
  it('start creates submission and loads it', async () => {
    const sub = makeSubmission()
    mockCreate.mockResolvedValueOnce(okData({ id: 'sub-1' }))
    mockGet.mockResolvedValueOnce(okData(sub))
    const store = useDsamWizardStore()
    await store.start(1, 5, 3)
    expect(mockCreate).toHaveBeenCalledWith({
      form_template_id: 1,
      student_id: 5,
      academic_year_id: 3,
    })
    expect(store.submission?.id).toBe('sub-1')
    expect(store.isLoading).toBe(false)
  })

  it('start sets error on failure', async () => {
    const err = new Error('Network error')
    mockCreate.mockRejectedValueOnce(err)
    const store = useDsamWizardStore()
    await store.start(1, 5, 3)
    expect(store.error).toBe(err)
    expect(store.isLoading).toBe(false)
  })

  // resume
  it('resume loads submission by id', async () => {
    const sub = makeSubmission()
    mockGet.mockResolvedValueOnce(okData(sub))
    const store = useDsamWizardStore()
    await store.resume('sub-1')
    expect(mockGet).toHaveBeenCalledWith('sub-1')
    expect(store.submission?.id).toBe('sub-1')
  })

  it('resume restores step from draft_data', async () => {
    const sub = makeSubmission({ draft_data: { current_step: 2 } })
    mockGet.mockResolvedValueOnce(okData(sub))
    const store = useDsamWizardStore()
    await store.resume('sub-1')
    expect(store.currentStep).toBe(2)
  })

  // answer hydration
  it('resume hydrates answers from server', async () => {
    const sub = makeSubmission({
      answers: [
        { question_id: 10, text_value: 'Yes', number_value: null, date_value: null, json_value: null, file_path: null },
      ],
    })
    mockGet.mockResolvedValueOnce(okData(sub))
    const store = useDsamWizardStore()
    await store.resume('sub-1')
    expect(store.answers[10]?.text_value).toBe('Yes')
  })

  // computed
  it('sections returns form template sections', async () => {
    const sub = makeSubmission()
    mockGet.mockResolvedValueOnce(okData(sub))
    const store = useDsamWizardStore()
    await store.resume('sub-1')
    expect(store.sections).toHaveLength(3)
    expect(store.totalSteps).toBe(3)
  })

  it('currentSection returns section at currentStep', async () => {
    const sub = makeSubmission()
    mockGet.mockResolvedValueOnce(okData(sub))
    const store = useDsamWizardStore()
    await store.resume('sub-1')
    expect(store.currentSection?.id).toBe(1)
    store.goToStep(1)
    expect(store.currentSection?.id).toBe(2)
  })

  it('isLastStep is true on final step', async () => {
    const sub = makeSubmission()
    mockGet.mockResolvedValueOnce(okData(sub))
    const store = useDsamWizardStore()
    await store.resume('sub-1')
    expect(store.isLastStep).toBe(false)
    store.goToStep(2)
    expect(store.isLastStep).toBe(true)
  })

  it('progressPct reflects step progress', async () => {
    const sub = makeSubmission()
    mockGet.mockResolvedValueOnce(okData(sub))
    const store = useDsamWizardStore()
    await store.resume('sub-1')
    expect(store.progressPct).toBe(0)
    store.goToStep(1)
    expect(store.progressPct).toBe(33)
  })

  // navigation
  it('prev decrements step', async () => {
    const sub = makeSubmission()
    mockGet.mockResolvedValueOnce(okData(sub))
    const store = useDsamWizardStore()
    await store.resume('sub-1')
    store.goToStep(2)
    store.prev()
    expect(store.currentStep).toBe(1)
  })

  it('prev does not go below 0', async () => {
    const sub = makeSubmission()
    mockGet.mockResolvedValueOnce(okData(sub))
    const store = useDsamWizardStore()
    await store.resume('sub-1')
    store.prev()
    expect(store.currentStep).toBe(0)
  })

  it('goToStep clamps to valid range', async () => {
    const sub = makeSubmission()
    mockGet.mockResolvedValueOnce(okData(sub))
    const store = useDsamWizardStore()
    await store.resume('sub-1')
    store.goToStep(100)
    expect(store.currentStep).toBe(2)
    store.goToStep(-5)
    expect(store.currentStep).toBe(0)
  })

  it('next saves draft and increments step', async () => {
    const sub = makeSubmission()
    mockGet.mockResolvedValueOnce(okData(sub))
    mockSave.mockResolvedValueOnce(okData(sub))
    const store = useDsamWizardStore()
    await store.resume('sub-1')
    await store.next()
    expect(mockSave).toHaveBeenCalled()
    expect(store.currentStep).toBe(1)
  })

  it('next does not advance past last step', async () => {
    const sub = makeSubmission()
    mockGet.mockResolvedValueOnce(okData(sub))
    mockSave.mockResolvedValue(okData(sub))
    const store = useDsamWizardStore()
    await store.resume('sub-1')
    store.goToStep(2)
    await store.next()
    expect(store.currentStep).toBe(2)
  })

  // setAnswer
  it('setAnswer stores answer by questionId', () => {
    const store = useDsamWizardStore()
    store.setAnswer(42, { text_value: 'Hello' })
    expect(store.answers[42]).toEqual({ text_value: 'Hello' })
  })

  // saveDraft
  it('saveDraft posts answers payload', async () => {
    const sub = makeSubmission()
    mockGet.mockResolvedValueOnce(okData(sub))
    mockSave.mockResolvedValueOnce(okData(sub))
    const store = useDsamWizardStore()
    await store.resume('sub-1')
    store.setAnswer(10, { text_value: 'Yes' })
    await store.saveDraft()
    expect(mockSave).toHaveBeenCalledWith(
      'sub-1',
      expect.objectContaining({
        answers: expect.arrayContaining([
          expect.objectContaining({ question_id: 10, text_value: 'Yes' }),
        ]),
      }),
    )
    expect(store.lastSavedAt).not.toBeNull()
  })

  it('saveDraft is a no-op when no submission', async () => {
    const store = useDsamWizardStore()
    await store.saveDraft()
    expect(mockSave).not.toHaveBeenCalled()
  })

  // submit
  it('submit saves draft and calls submit endpoint', async () => {
    const sub = makeSubmission()
    mockGet.mockResolvedValueOnce(okData(sub))
    mockSave.mockResolvedValueOnce(okData(sub))
    mockSubmit.mockResolvedValueOnce(okData({ ...sub, status: 'submitted' }))
    const store = useDsamWizardStore()
    await store.resume('sub-1')
    const result = await store.submit()
    expect(result).toBe(true)
    expect(mockSubmit).toHaveBeenCalledWith('sub-1')
    expect(store.submission?.status).toBe('submitted')
    expect(store.isSubmitting).toBe(false)
  })

  it('submit returns false on error', async () => {
    const sub = makeSubmission()
    mockGet.mockResolvedValueOnce(okData(sub))
    mockSave.mockResolvedValueOnce(okData(sub))
    mockSubmit.mockRejectedValueOnce(new Error('Submit failed'))
    const store = useDsamWizardStore()
    await store.resume('sub-1')
    const result = await store.submit()
    expect(result).toBe(false)
    expect(store.error).toBeTruthy()
  })

  it('submit is a no-op when no submission', async () => {
    const store = useDsamWizardStore()
    const result = await store.submit()
    expect(result).toBeUndefined()
    expect(mockSubmit).not.toHaveBeenCalled()
  })

  // reset
  it('reset clears all state', async () => {
    const sub = makeSubmission()
    mockGet.mockResolvedValueOnce(okData(sub))
    const store = useDsamWizardStore()
    await store.resume('sub-1')
    store.setAnswer(10, { text_value: 'test' })
    store.reset()
    expect(store.submission).toBeNull()
    expect(store.answers).toEqual({})
    expect(store.currentStep).toBe(0)
    expect(store.lastSavedAt).toBeNull()
    expect(store.error).toBeNull()
  })
})
