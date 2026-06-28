import { beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises } from '@vue/test-utils'
import { mountWithPlugins } from '@/tests/helpers/mount'
import enPreschool from '@/i18n/en/preschool'
import CreateEnrollmentApplication from '@/modules/preschool/admin/pages/enrollment/CreateEnrollmentApplication.vue'
import { preschoolRoutes } from '@/modules/preschool/routes'

const mockCreateEnrollment = vi.fn()
const mockFetchAcademicLifecycle = vi.fn()
const mockHttpGet = vi.fn()
const mockFetchProvinces = vi.fn()
const mockFetchDistricts = vi.fn()
const mockFetchCommunes = vi.fn()
const mockFetchVillages = vi.fn()
const mockToastAdd = vi.fn()

vi.mock('primevue/usetoast', () => ({
  useToast: () => ({
    add: mockToastAdd,
  }),
}))

vi.mock('@/modules/preschool/services/api/preschoolEnrollmentApi', () => ({
  createEnrollment: (...args) => mockCreateEnrollment(...args),
}))

vi.mock('@/modules/preschool/services/api/preschoolAcademicLifecycleApi', () => ({
  fetchAcademicLifecycle: (...args) => mockFetchAcademicLifecycle(...args),
}))

vi.mock('@/services/http', () => ({
  default: {
    get: (...args) => mockHttpGet(...args),
  },
}))

vi.mock('@/services/api', () => ({
  unwrapApiData: (response) => response?.data ?? response,
}))

vi.mock('@/modules/preschool/services/cambodiaLocationService', () => ({
  fetchProvinces: (...args) => mockFetchProvinces(...args),
  fetchDistricts: (...args) => mockFetchDistricts(...args),
  fetchCommunes: (...args) => mockFetchCommunes(...args),
  fetchVillages: (...args) => mockFetchVillages(...args),
  getLocationDisplayName: (item = {}, locale = 'kh') => {
    if (String(locale).toLowerCase() === 'en') {
      return String(item.nameEn || item.name_en || item.nameKh || item.name_kh || item.code || '').trim()
    }

    return String(item.nameKh || item.name_kh || item.nameEn || item.name_en || item.code || '').trim()
  },
  buildLocationAddress: (source = {}) => {
    const parts = [source.village, source.commune, source.district, source.province].filter(Boolean)
    return parts.length ? parts.join(', ') : String(source.address || '').trim()
  },
}))

function mountPage() {
  return mountWithPlugins(CreateEnrollmentApplication, {
    messages: {
      en: enPreschool,
    },
    routes: [
      {
        path: '/module/preschool-admin/enrollments',
        name: 'dashboard-preschool-admin-enrollments',
        component: { template: '<div />' },
      },
      {
        path: '/module/preschool-admin/enrollments/create',
        name: 'dashboard-preschool-admin-enrollments-create',
        component: { template: '<div />' },
      },
    ],
    global: {
      stubs: {
        MainLayout: { template: '<div><slot /></div>' },
        HeaderSection: {
          props: ['title', 'subtitle'],
          template: '<header><h1>{{ title }}</h1><p>{{ subtitle }}</p></header>',
        },
        Button: {
          emits: ['click'],
          template: '<button @click="$emit(\'click\')"><slot /></button>',
        },
        Toast: { template: '<div data-testid="toast-stub" />' },
      },
    },
  })
}

function getSelect(wrapper, index) {
  return wrapper.findAll('select').at(index)
}

async function flushAll() {
  await flushPromises()
  await flushPromises()
}

beforeEach(() => {
  vi.clearAllMocks()
  mockToastAdd.mockClear()

  mockCreateEnrollment.mockResolvedValue({ id: 'enrollment-1' })
  mockFetchAcademicLifecycle.mockResolvedValue({
    academicYears: [
      { id: 'ay-1', label: '2026-2027' },
    ],
    terms: [
      { id: 'term-1', name: 'Term 1' },
    ],
  })
  mockHttpGet.mockResolvedValue({
    data: [
      { id: 'class-1', name: 'Morning Stars' },
    ],
  })
  mockFetchProvinces.mockResolvedValue([
    { code: '01', nameEn: 'Phnom Penh', nameKh: 'ភ្នំពេញ' },
  ])
  mockFetchDistricts.mockResolvedValue([
    { code: '0101', nameEn: 'Chamkarmon', nameKh: 'ចំការមន' },
  ])
  mockFetchCommunes.mockResolvedValue([
    { code: '010101', nameEn: 'Tonle Bassac', nameKh: 'ទន្លេបាសាក់' },
  ])
  mockFetchVillages.mockResolvedValue([
    { code: '01010101', nameEn: 'Village 1', nameKh: 'ភូមិ១' },
  ])
})

describe('CreateEnrollmentApplication', () => {
  it('registers the create enrollment route', () => {
    expect(
      preschoolRoutes.some((route) => route.name === 'dashboard-preschool-admin-enrollments-create'),
    ).toBe(true)
  })

  it('renders the create page shell and guardian location fields', async () => {
    const wrapper = mountPage()

    await flushAll()

    expect(wrapper.text()).toContain('New Enrollment Application')
    expect(wrapper.text()).toContain('Create a new preschool enrollment application.')
    expect(wrapper.text()).toContain('Student Information')
    expect(wrapper.text()).toContain('Enrollment Request')
    expect(wrapper.text()).toContain('Guardian Information')
    expect(wrapper.text()).toContain('Guardian Type')
    expect(wrapper.text()).not.toContain('Other Guardian Type')
    expect(wrapper.text()).toContain('Guardian Location')
    expect(wrapper.text()).toContain('Village:')
    expect(wrapper.text()).toContain('Commune/Ward:')
    expect(wrapper.text()).toContain('District/Khan:')
    expect(wrapper.text()).toContain('Province/Capital:')
    expect(wrapper.text()).toContain('Authorization')
    expect(wrapper.text()).toContain('Back to Enrollments')

    const provinceSelect = getSelect(wrapper, 5)
    expect(provinceSelect.findAll('option').map((option) => option.text())).toContain('ភ្នំពេញ')
  })

  it('submits the same guardian location payload as the old modal flow', async () => {
    const wrapper = mountPage()

    await flushAll()

    const textInputs = wrapper.findAll('input[type="text"]')
    await textInputs.at(6).setValue('Sokha')
    await wrapper.findAll('select').at(4).setValue('father')
    await textInputs.at(7).setValue('012345678')
    await wrapper.find('input[type="email"]').setValue('sokha@example.test')

    await getSelect(wrapper, 5).setValue('ភ្នំពេញ')
    await flushAll()
    await getSelect(wrapper, 6).setValue('ចំការមន')
    await flushAll()
    await getSelect(wrapper, 7).setValue('ទន្លេបាសាក់')
    await flushAll()
    await getSelect(wrapper, 8).setValue('ភូមិ១')
    await flushAll()

    await wrapper.find('form').trigger('submit.prevent')
    await flushAll()

    expect(mockCreateEnrollment).toHaveBeenCalledWith(expect.objectContaining({
      guardian_name: 'Sokha',
      guardian_relationship: 'father',
      guardian_phone: '012345678',
      guardian_email: 'sokha@example.test',
      guardian_address: 'ភូមិ១, ទន្លេបាសាក់, ចំការមន, ភ្នំពេញ',
    }))
    expect(mockCreateEnrollment.mock.calls[0][0].province_code).toBeUndefined()
    expect(mockCreateEnrollment.mock.calls[0][0].district_code).toBeUndefined()
    expect(mockCreateEnrollment.mock.calls[0][0].commune_code).toBeUndefined()
    expect(mockCreateEnrollment.mock.calls[0][0].village_code).toBeUndefined()
    expect(wrapper.vm.$router.currentRoute.value.name).toBe('dashboard-preschool-admin-enrollments')
  })

  it('submits a custom relationship when other guardian type is selected', async () => {
    const wrapper = mountPage()

    await flushAll()

    const textInputs = wrapper.findAll('input[type="text"]')
    await textInputs.at(6).setValue('Sokha')
    await wrapper.findAll('select').at(4).setValue('other')
    await flushAll()

    await wrapper.find('input[placeholder="Enter guardian type, e.g. Aunt, Uncle"]').setValue('Uncle')
    await textInputs.at(7).setValue('012345678')
    await wrapper.find('input[type="email"]').setValue('sokha@example.test')

    await getSelect(wrapper, 5).setValue('ភ្នំពេញ')
    await flushAll()
    await getSelect(wrapper, 6).setValue('ចំការមន')
    await flushAll()
    await getSelect(wrapper, 7).setValue('ទន្លេបាសាក់')
    await flushAll()
    await getSelect(wrapper, 8).setValue('ភូមិ១')
    await flushAll()

    await wrapper.find('form').trigger('submit.prevent')
    await flushAll()

    expect(mockCreateEnrollment).toHaveBeenCalledWith(expect.objectContaining({
      guardian_relationship: 'Uncle',
    }))
  })

  it('shows the other guardian type detail field when selected', async () => {
    const wrapper = mountPage()

    await flushAll()

    await wrapper.findAll('select').at(4).setValue('other')
    await flushAll()

    expect(wrapper.text()).toContain('Other Guardian Type')
    expect(wrapper.find('input[placeholder="Enter guardian type, e.g. Aunt, Uncle"]').exists()).toBe(true)
  })

  it('navigates back when cancel is clicked', async () => {
    const wrapper = mountPage()

    await flushAll()

    await wrapper.find('button.enr-app-btn--cancel').trigger('click')
    await flushAll()

    expect(wrapper.vm.$router.currentRoute.value.name).toBe('dashboard-preschool-admin-enrollments')
  })
})
