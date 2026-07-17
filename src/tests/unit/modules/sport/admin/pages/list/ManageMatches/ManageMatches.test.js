import { flushPromises, mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import ManageMatches from '@/modules/sport/admin/pages/list/ManageMatches/ManageMatches.vue'

const fetchSportMatches = vi.fn()
const deleteSportMatch = vi.fn()
const push = vi.fn()
const t = vi.fn((key) => key)

vi.mock('@/modules/sport/services/sportApi', () => ({
  fetchSportMatches: (...args) => fetchSportMatches(...args),
  deleteSportMatch: (...args) => deleteSportMatch(...args),
}))

vi.mock('@/composables/useLanguage', () => ({
  useLanguage: () => ({
    t,
    language: { value: 'en' },
  }),
}))

vi.mock('vue-router', () => ({
  useRouter: () => ({ push }),
}))

const commonStubs = {
  MainLayout: { template: '<div><slot /></div>' },
  HeaderSection: { template: '<div data-test="header"><slot /></div>' },
  AlertSuccess: { props: ['show', 'message'], template: '<div v-if="show" data-test="delete-success">{{ message }}</div>' },
  AlertError: { props: ['show', 'message'], template: '<div v-if="show" data-test="alert-error">{{ message }}</div>' },
  AlertQuestion: {
    props: ['show'],
    template: '<div v-if="show" data-test="delete-confirm"><button data-test="confirm" @click="$emit(\'confirm\')">confirm</button><button data-test="cancel" @click="$emit(\'cancel\')">cancel</button></div>',
  },
  MatchesSearchFilterBar: { template: '<div data-test="filters" />' },
  MatchesSummaryCards: { template: '<div data-test="summary" />' },
  PlayerInfoToolbar: { template: '<div><slot name="actions" /></div>' },
  Pagination: { template: '<div data-test="pagination" />' },
  Button: { template: '<button><slot /></button>' },
  MatchesTable: {
    props: ['matches'],
    template: '<div><span data-test="matches-count">{{ matches.length }}</span><button data-test="delete-row" @click="$emit(\'delete\', matches[0])">delete</button></div>',
  },
}

describe('ManageMatches', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    fetchSportMatches.mockResolvedValue({
      items: [{ id: 'm1', homeTeam: 'Home FC', awayTeam: 'Away FC', schedule: '2026-05-14T15:00:00.000Z' }],
    })
  })

  it('does not show a false success when delete fails', async () => {
    deleteSportMatch.mockRejectedValueOnce(new Error('Delete failed'))

    const wrapper = mount(ManageMatches, {
      global: {
        stubs: commonStubs,
      },
    })

    await flushPromises()

    expect(wrapper.find('[data-test="matches-count"]').text()).toBe('1')

    await wrapper.find('[data-test="delete-row"]').trigger('click')
    await wrapper.find('[data-test="confirm"]').trigger('click')
    await flushPromises()

    expect(deleteSportMatch).toHaveBeenCalledWith('m1')
    expect(wrapper.find('[data-test="matches-count"]').text()).toBe('1')
    expect(wrapper.find('[data-test="delete-success"]').exists()).toBe(false)
    expect(wrapper.find('[data-test="alert-error"]').exists()).toBe(true)
  })

  it('shows a load error when the matches endpoint fails', async () => {
    fetchSportMatches.mockRejectedValueOnce(new Error('Load failed'))

    const wrapper = mount(ManageMatches, {
      global: {
        stubs: commonStubs,
      },
    })

    await flushPromises()

    expect(wrapper.find('[data-test="matches-count"]').text()).toBe('0')
    expect(wrapper.find('[data-test="alert-error"]').exists()).toBe(true)
    expect(wrapper.find('[data-test="delete-success"]').exists()).toBe(false)
    expect(wrapper.find('[data-test="filters"]').exists()).toBe(true)
    expect(wrapper.text()).toContain('common.errorTryAgain')
  })
})
