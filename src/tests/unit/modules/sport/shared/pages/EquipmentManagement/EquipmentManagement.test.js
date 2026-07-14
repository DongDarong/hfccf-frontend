import { createPinia } from 'pinia'
import { createI18n } from 'vue-i18n'
import { flushPromises, mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { reactive } from 'vue'
import EquipmentManagement from '@/modules/sport/shared/pages/EquipmentManagement/EquipmentManagement.vue'
import enCommon from '@/i18n/en/common.js'
import enSport from '@/i18n/en/sport/index.js'
import khCommon from '@/i18n/kh/common.js'
import khSport from '@/i18n/kh/sport/index.js'

const routeState = reactive({ name: 'dashboard-sport-admin-equipment' })
const toastAdd = vi.fn()

const {
  fetchCoachTeams,
  fetchCoachEquipmentItems,
  fetchCoachEquipmentRequests,
  fetchSportEquipmentItems,
  fetchSportEquipmentRequests,
} = vi.hoisted(() => ({
  fetchCoachTeams: vi.fn(),
  fetchCoachEquipmentItems: vi.fn(),
  fetchCoachEquipmentRequests: vi.fn(),
  fetchSportEquipmentItems: vi.fn(),
  fetchSportEquipmentRequests: vi.fn(),
}))

vi.mock('vue-router', async () => {
  const actual = await vi.importActual('vue-router')

  return {
    ...actual,
    useRoute: () => routeState,
  }
})

vi.mock('primevue/usetoast', () => ({
  useToast: () => ({ add: toastAdd }),
}))

vi.mock('@/modules/sport/services/api/sportCoachTeamsApi', () => ({
  fetchCoachTeams,
}))

vi.mock('@/modules/sport/services/sportApi', () => ({
  approveSportEquipmentRequest: vi.fn(),
  createCoachEquipmentRequest: vi.fn(),
  createSportEquipmentItem: vi.fn(),
  fetchCoachEquipmentItems,
  fetchCoachEquipmentRequests,
  fetchSportEquipmentItems,
  fetchSportEquipmentRequests,
  issueSportEquipmentRequest: vi.fn(),
  rejectSportEquipmentRequest: vi.fn(),
  returnSportEquipmentRequest: vi.fn(),
  updateSportEquipmentItem: vi.fn(),
}))

const baseStubs = {
  MainLayout: { template: '<div><slot /></div>' },
  HeaderSection: { props: ['title', 'subtitle'], template: '<div><h1 data-test="title">{{ title }}</h1><p>{{ subtitle }}</p></div>' },
  Button: {
    props: ['label', 'disabled', 'loading'],
    emits: ['click'],
    template: '<button type="button" :disabled="disabled || loading" @click="$emit(\'click\')">{{ label }}</button>',
  },
  StatsCards: { props: ['cards'], template: '<div data-test="stats-cards" />' },
  Pagination: { template: '<div data-test="pagination" />' },
  StatusBadge: { props: ['label'], template: '<span>{{ label }}</span>' },
  Toast: { template: '<div data-test="toast" />' },
  Card: { template: '<section><slot name="title" /><slot name="content" /><slot /></section>' },
  DataTable: { props: ['value'], template: '<div data-test="datatable"><slot /></div>' },
  Column: { template: '<div><slot /></div>' },
  Dialog: { props: ['visible'], template: '<div v-if="visible"><slot /><slot name="footer" /></div>' },
  Dropdown: { props: ['modelValue', 'options'], emits: ['update:modelValue'], template: '<select />' },
  InputText: { props: ['modelValue'], emits: ['update:modelValue'], template: '<input />' },
  InputNumber: { props: ['modelValue'], emits: ['update:modelValue'], template: '<input type="number" />' },
  Textarea: { props: ['modelValue'], emits: ['update:modelValue'], template: '<textarea />' },
}

function mountPage(locale = 'en') {
  const i18n = createI18n({
    legacy: false,
    locale,
    fallbackLocale: 'en',
    messages: {
      en: { ...enCommon, ...enSport },
      kh: { ...khCommon, ...khSport },
    },
    missingWarn: false,
    fallbackWarn: false,
  })

  return mount(EquipmentManagement, {
    global: {
      plugins: [i18n, createPinia()],
      stubs: baseStubs,
    },
  })
}

beforeEach(() => {
  vi.clearAllMocks()
  routeState.name = 'dashboard-sport-admin-equipment'

  fetchCoachTeams.mockResolvedValue({
    items: [{ id: 'team-1', name: 'Team One', status: 'active' }],
    pagination: { page: 1, perPage: 100, total: 1, totalPages: 1 },
  })

  fetchSportEquipmentItems.mockResolvedValue({
    items: [
      {
        id: 'item-1',
        equipmentCode: 'EQ-001',
        name: 'Training Cones',
        category: 'Field',
        unit: 'set',
        totalQuantity: 10,
        availableQuantity: 4,
        minimumStockLevel: 5,
        status: 'active',
        isLowStock: true,
      },
    ],
    pagination: { page: 1, perPage: 10, total: 1, totalPages: 1 },
    summary: { totalActiveItems: 1, availableItems: 1, lowStockItems: 1, outOfStockItems: 0 },
  })

  fetchSportEquipmentRequests.mockResolvedValue({
    items: [],
    pagination: { page: 1, perPage: 10, total: 0, totalPages: 1 },
    summary: { totalRequests: 0, pendingRequests: 0, approvedRequests: 0, issuedRequests: 0, returnedRequests: 0 },
  })

  fetchCoachEquipmentItems.mockResolvedValue({
    items: [
      {
        id: 'item-2',
        equipmentCode: 'EQ-002',
        name: 'Match Balls',
        category: 'Ball',
        unit: 'pc',
        totalQuantity: 6,
        availableQuantity: 6,
        minimumStockLevel: 2,
        status: 'active',
      },
    ],
    pagination: { page: 1, perPage: 10, total: 1, totalPages: 1 },
    summary: { totalActiveItems: 1, availableItems: 1, lowStockItems: 0, outOfStockItems: 0 },
  })

  fetchCoachEquipmentRequests.mockResolvedValue({
    items: [],
    pagination: { page: 1, perPage: 10, total: 0, totalPages: 1 },
    summary: { totalRequests: 0, pendingRequests: 0, approvedRequests: 0, issuedRequests: 0, returnedRequests: 0 },
  })
})

describe('EquipmentManagement page', () => {
  it('loads the admin inventory entry point and uses the equipment workflow', async () => {
    const wrapper = mountPage('en')
    await flushPromises()

    expect(fetchSportEquipmentItems).toHaveBeenCalled()
    expect(fetchSportEquipmentRequests).not.toHaveBeenCalled()
    expect(wrapper.text()).toContain('Training Equipment Management')
    expect(wrapper.text()).toContain('Inventory')
    expect(wrapper.text()).toContain('Requests')
    expect(wrapper.text()).toContain('Add Equipment')

    await wrapper.findAll('button').find((button) => button.text() === 'Requests')?.trigger('click')
    await flushPromises()

    expect(fetchSportEquipmentRequests).toHaveBeenCalled()
  })

  it('loads the coach entry point and keeps admin actions hidden', async () => {
    routeState.name = 'dashboard-sport-coach-equipment'
    const wrapper = mountPage('en')
    await flushPromises()

    expect(fetchCoachTeams).toHaveBeenCalled()
    expect(fetchCoachEquipmentItems).toHaveBeenCalled()
    expect(fetchSportEquipmentItems).not.toHaveBeenCalled()
    expect(wrapper.text()).toContain('Equipment Requests')
    expect(wrapper.text()).toContain('Available Equipment')
    expect(wrapper.text()).toContain('My Requests')
    expect(wrapper.text()).not.toContain('Add Equipment')

    await wrapper.findAll('button').find((button) => button.text() === 'My Requests')?.trigger('click')
    await flushPromises()

    expect(fetchCoachEquipmentRequests).toHaveBeenCalled()
  })

  it('renders Khmer labels without raw translation keys', async () => {
    routeState.name = 'dashboard-sport-coach-equipment'
    const wrapper = mountPage('kh')
    await flushPromises()

    expect(wrapper.text()).toContain('សំណើឧបករណ៍')
    expect(wrapper.text()).toContain('ឧបករណ៍មាន')
    expect(wrapper.text()).toContain('សំណើរបស់ខ្ញុំ')
    expect(wrapper.text()).not.toContain('sportEquipment.')
  })
})
