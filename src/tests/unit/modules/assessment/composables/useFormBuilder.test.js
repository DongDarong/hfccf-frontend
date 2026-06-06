import { beforeEach, describe, expect, it, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useFormBuilder } from '@/modules/assessment/composables/useFormBuilder'
import { useFormBuilderStore } from '@/modules/assessment/stores/useFormBuilderStore'

vi.mock('@/modules/assessment/services/assessmentFormApi', () => ({
  assessmentFormApi: {
    get: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    publish: vi.fn(),
    listSections: vi.fn(),
    createSection: vi.fn(),
    updateSection: vi.fn(),
    deleteSection: vi.fn(),
  },
}))

vi.mock('@/modules/assessment/services/assessmentQuestionTypeApi', () => ({
  assessmentQuestionTypeApi: {
    list: vi.fn(),
  },
}))

beforeEach(() => {
  setActivePinia(createPinia())
  vi.clearAllMocks()
})

describe('useFormBuilder', () => {
  // canPublish
  it('canPublish is false when template is draft but has no sections', () => {
    const { canPublish } = useFormBuilder()
    expect(canPublish.value).toBe(false)
  })

  it('canPublish is true when template is draft and has sections', () => {
    const { canPublish } = useFormBuilder()
    const store = useFormBuilderStore()
    store.sections.push({ id: 1, title: 'Section 1', order: 1 })
    expect(canPublish.value).toBe(true)
  })

  it('canPublish is false when template is published even with sections', () => {
    const { canPublish } = useFormBuilder()
    const store = useFormBuilderStore()
    store.template = { ...store.template, status: 'published' }
    store.sections.push({ id: 1, title: 'Section 1', order: 1 })
    expect(canPublish.value).toBe(false)
  })

  it('canPublish is false when template is archived', () => {
    const { canPublish } = useFormBuilder()
    const store = useFormBuilderStore()
    store.template = { ...store.template, status: 'archived' }
    store.sections.push({ id: 1, title: 'Section 1', order: 1 })
    expect(canPublish.value).toBe(false)
  })

  // getQuestionsForSection
  it('getQuestionsForSection returns questions matching sectionId', () => {
    const { getQuestionsForSection } = useFormBuilder()
    const store = useFormBuilderStore()
    store.template = {
      ...store.template,
      questions: [
        { id: 1, question_text: 'Q1', section_id: 10 },
        { id: 2, question_text: 'Q2', section_id: 10 },
        { id: 3, question_text: 'Q3', section_id: 20 },
      ],
    }
    const result = getQuestionsForSection(10)
    expect(result).toHaveLength(2)
    expect(result.map((q) => q.id)).toEqual([1, 2])
  })

  it('getQuestionsForSection returns empty array when no match', () => {
    const { getQuestionsForSection } = useFormBuilder()
    const store = useFormBuilderStore()
    store.template = { ...store.template, questions: [{ id: 1, section_id: 10 }] }
    expect(getQuestionsForSection(99)).toEqual([])
  })

  it('getQuestionsForSection returns empty array when template has no questions', () => {
    const { getQuestionsForSection } = useFormBuilder()
    expect(getQuestionsForSection(10)).toEqual([])
  })

  // findQuestionType
  it('findQuestionType returns matching type by key', () => {
    const { findQuestionType } = useFormBuilder()
    const store = useFormBuilderStore()
    store.questionTypes = [
      { id: 1, key: 'short_text', label: 'Short Text' },
      { id: 2, key: 'radio', label: 'Single Choice' },
    ]
    expect(findQuestionType('radio')).toEqual({ id: 2, key: 'radio', label: 'Single Choice' })
  })

  it('findQuestionType returns undefined for unknown key', () => {
    const { findQuestionType } = useFormBuilder()
    const store = useFormBuilderStore()
    store.questionTypes = [{ id: 1, key: 'short_text', label: 'Short Text' }]
    expect(findQuestionType('nonexistent')).toBeUndefined()
  })

  it('findQuestionType returns undefined when questionTypes is empty', () => {
    const { findQuestionType } = useFormBuilder()
    expect(findQuestionType('short_text')).toBeUndefined()
  })

  // store exposure
  it('exposes the store directly', () => {
    const { store } = useFormBuilder()
    expect(store).toBe(useFormBuilderStore())
  })
})
