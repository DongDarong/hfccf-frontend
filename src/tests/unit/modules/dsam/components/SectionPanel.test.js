import { beforeEach, describe, expect, it, vi } from 'vitest'
import { reactive } from 'vue'
import { mountWithPlugins } from '../../../../helpers/mount'
import SectionPanel from '@/modules/dsam/components/form-builder/SectionPanel.vue'

const mockStore = reactive({
  sections: [],
  activeSectionId: null,
  isPublished: false,
  addSection: vi.fn(),
  setActiveSection: vi.fn(),
})

vi.mock('@/modules/dsam/stores/useDsamFormBuilderStore', () => ({
  useDsamFormBuilderStore: () => mockStore,
}))

const messages = {
  en: {
    dsamForms: {
      builder: {
        sectionsPanelTitle:      'Sections',
        addSection:              'Add section',
        sectionTitlePlaceholder: 'Section title',
        noSectionsYet:           'No sections yet',
        add:                     'Add',
      },
    },
    common: { cancel: 'Cancel' },
  },
}

function mount() {
  return mountWithPlugins(SectionPanel, { messages })
}

beforeEach(() => {
  mockStore.sections = []
  mockStore.activeSectionId = null
  mockStore.isPublished = false
  vi.clearAllMocks()
  mockStore.addSection.mockResolvedValue(undefined)
})

describe('SectionPanel', () => {
  it('renders the panel title', () => {
    const wrapper = mount()
    expect(wrapper.text()).toContain('Sections')
  })

  it('shows empty state when no sections', () => {
    const wrapper = mount()
    expect(wrapper.text()).toContain('No sections yet')
  })

  it('renders section list when sections exist', () => {
    mockStore.sections = [
      { id: 1, title: 'Intro', questions: [] },
      { id: 2, title: 'Motor Skills', questions: [{ id: 10 }] },
    ]
    const wrapper = mount()
    expect(wrapper.text()).toContain('Intro')
    expect(wrapper.text()).toContain('Motor Skills')
  })

  it('shows question count per section', () => {
    mockStore.sections = [{ id: 1, title: 'Sec', questions: [{ id: 10 }, { id: 11 }] }]
    const wrapper = mount()
    expect(wrapper.text()).toContain('2')
  })

  it('shows add button when not published', () => {
    mockStore.isPublished = false
    const wrapper = mount()
    expect(wrapper.find('button[title="Add section"]').exists()).toBe(true)
  })

  it('hides add button when published', () => {
    mockStore.isPublished = true
    const wrapper = mount()
    expect(wrapper.find('button[title="Add section"]').exists()).toBe(false)
  })

  it('shows add form when add button clicked', async () => {
    const wrapper = mount()
    await wrapper.find('button[title="Add section"]').trigger('click')
    expect(wrapper.find('input').exists()).toBe(true)
    expect(wrapper.text()).toContain('Add')
    expect(wrapper.text()).toContain('Cancel')
  })

  it('hides add form when cancel clicked', async () => {
    const wrapper = mount()
    await wrapper.find('button[title="Add section"]').trigger('click')
    const buttons = wrapper.findAll('button')
    const cancelBtn = buttons.find(b => b.text() === 'Cancel')
    await cancelBtn.trigger('click')
    expect(wrapper.find('input').exists()).toBe(false)
  })

  it('calls addSection with trimmed title and hides form', async () => {
    const wrapper = mount()
    await wrapper.find('button[title="Add section"]').trigger('click')
    await wrapper.find('input').setValue('New Section')
    const buttons = wrapper.findAll('button')
    const addBtn = buttons.find(b => b.text() === 'Add')
    await addBtn.trigger('click')
    expect(mockStore.addSection).toHaveBeenCalledWith({
      title: 'New Section',
      scoring_weight: 1,
    })
  })

  it('does not call addSection when title is empty', async () => {
    const wrapper = mount()
    await wrapper.find('button[title="Add section"]').trigger('click')
    const buttons = wrapper.findAll('button')
    const addBtn = buttons.find(b => b.text() === 'Add')
    await addBtn.trigger('click')
    expect(mockStore.addSection).not.toHaveBeenCalled()
  })

  it('calls addSection on enter key', async () => {
    const wrapper = mount()
    await wrapper.find('button[title="Add section"]').trigger('click')
    const input = wrapper.find('input')
    await input.setValue('Via Enter')
    await input.trigger('keyup.enter')
    expect(mockStore.addSection).toHaveBeenCalledWith({
      title: 'Via Enter',
      scoring_weight: 1,
    })
  })

  it('calls setActiveSection when section clicked', async () => {
    mockStore.sections = [{ id: 5, title: 'Click Me', questions: [] }]
    const wrapper = mount()
    await wrapper.find('li').trigger('click')
    expect(mockStore.setActiveSection).toHaveBeenCalledWith(5)
  })

  it('applies active styles to the active section', () => {
    mockStore.sections = [
      { id: 1, title: 'Active',   questions: [] },
      { id: 2, title: 'Inactive', questions: [] },
    ]
    mockStore.activeSectionId = 1
    const wrapper = mount()
    const items = wrapper.findAll('li')
    expect(items[0].classes()).toContain('bg-blue-50')
    expect(items[1].classes()).not.toContain('bg-blue-50')
  })
})
