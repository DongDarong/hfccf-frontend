import { beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises } from '@vue/test-utils'
import { mountWithPlugins } from '@/tests/helpers/mount'
import enPreschool from '@/i18n/en/preschool'
import StudentForm from '@/modules/preschool/admin/pages/students/StudentForm.vue'

const mockFetchPreschoolClasses = vi.fn()
const mockFetchPreschoolStudent = vi.fn()
const mockCreatePreschoolStudent = vi.fn()
const mockUpdatePreschoolStudent = vi.fn()
const mockFetchProvinces = vi.fn()
const mockFetchDistricts = vi.fn()
const mockFetchCommunes = vi.fn()
const mockFetchVillages = vi.fn()

vi.mock('@/modules/preschool/services/preschoolApi', () => ({
  fetchPreschoolClasses: (...args) => mockFetchPreschoolClasses(...args),
  fetchPreschoolStudent: (...args) => mockFetchPreschoolStudent(...args),
  createPreschoolStudent: (...args) => mockCreatePreschoolStudent(...args),
  updatePreschoolStudent: (...args) => mockUpdatePreschoolStudent(...args),
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
  return mountWithPlugins(StudentForm, {
    messages: {
      en: enPreschool,
    },
    global: {
      stubs: {
        MainLayout: { template: '<div><slot /></div>' },
        HeaderSection: {
          props: ['title', 'subtitle'],
          template: '<header><h1>{{ title }}</h1><p>{{ subtitle }}</p></header>',
        },
        AlertSuccess: {
          props: ['show'],
          template: '<div v-if="show" data-testid="alert-success-stub" />',
        },
        Button: {
          props: ['disabled', 'loading'],
          emits: ['click'],
          template: '<button :disabled="disabled || loading" @click="$emit(\'click\')"><slot /></button>',
        },
        MultiSelect: {
          props: ['modelValue', 'options'],
          template: '<div data-testid="multi-select-stub" />',
        },
      },
    },
  })
}

function getSelect(wrapper, index) {
  return wrapper.findAll('select').at(index)
}

beforeEach(() => {
  vi.clearAllMocks()

  mockFetchPreschoolClasses.mockResolvedValue({
    items: [
      {
        id: 'class-1',
        code: 'PS-01',
        name: 'Morning Stars',
      },
    ],
    pagination: { page: 1, perPage: 100, total: 1, totalPages: 1 },
  })

  mockFetchProvinces.mockResolvedValue([
    { code: '01', nameEn: 'Phnom Penh', nameKh: 'ភ្នំពេញ' },
    { code: '08', nameEn: 'Kandal', nameKh: 'កណ្ដាល' },
  ])

  mockFetchDistricts.mockImplementation((provinceCode) => {
    if (String(provinceCode) === '01') {
      return Promise.resolve([
        { code: '0102', nameEn: 'Dangkao', nameKh: 'ដង្កោ' },
        { code: '0103', nameEn: 'Sen Sok', nameKh: 'សែនសុខ' },
      ])
    }

    if (String(provinceCode) === '08') {
      return Promise.resolve([
        { code: '0801', nameEn: 'Khsach Kandal', nameKh: 'ខ្សាច់កណ្ដាល' },
      ])
    }

    return Promise.resolve([])
  })

  mockFetchCommunes.mockImplementation((districtCode) => {
    if (String(districtCode) === '0102') {
      return Promise.resolve([
        { code: '010201', nameEn: 'Prek Pra', nameKh: 'ព្រែកប្រា' },
        { code: '010202', nameEn: 'Prek Kampeus', nameKh: 'ព្រែកកំពឹស' },
      ])
    }

    if (String(districtCode) === '0801') {
      return Promise.resolve([
        { code: '080101', nameEn: 'Akreiy Ksatr', nameKh: 'អរិយក្សត្រ' },
      ])
    }

    return Promise.resolve([])
  })

  mockFetchVillages.mockImplementation((communeCode) => {
    if (String(communeCode) === '010201') {
      return Promise.resolve([
        { code: '01020101', nameEn: 'Village 1', nameKh: 'ភូមិ១' },
        { code: '01020102', nameEn: 'Village 2', nameKh: 'ភូមិ២' },
      ])
    }

    if (String(communeCode) === '080101') {
      return Promise.resolve([
        { code: '08010101', nameEn: 'Village A', nameKh: 'ភូមិអា' },
      ])
    }

    return Promise.resolve([])
  })

  mockFetchPreschoolStudent.mockResolvedValue(null)
  mockCreatePreschoolStudent.mockResolvedValue({ id: 'student-1' })
  mockUpdatePreschoolStudent.mockResolvedValue({ id: 'student-1' })
})

describe('StudentForm', () => {
  it('renders Khmer location labels and cascading selects', async () => {
    const wrapper = mountPage()

    await flushPromises()

    const selectGuardianType = getSelect(wrapper, 3)
    const selectProvince = getSelect(wrapper, 4)
    const selectDistrict = getSelect(wrapper, 5)
    const selectCommune = getSelect(wrapper, 6)
    const selectVillage = getSelect(wrapper, 7)

    expect(selectProvince.findAll('option').map((option) => option.text())).toContain('ភ្នំពេញ')
    expect(selectDistrict.attributes('disabled')).toBeDefined()
    expect(selectCommune.attributes('disabled')).toBeDefined()
    expect(selectVillage.attributes('disabled')).toBeDefined()

    await selectProvince.setValue('ភ្នំពេញ')
    await flushPromises()

    expect(mockFetchDistricts).toHaveBeenCalledWith('01')
    expect(selectDistrict.attributes('disabled')).toBeUndefined()
    expect(selectDistrict.findAll('option').map((option) => option.text())).toContain('ដង្កោ')

    await selectDistrict.setValue('ដង្កោ')
    await flushPromises()

    expect(mockFetchCommunes).toHaveBeenCalledWith('0102')
    expect(selectCommune.attributes('disabled')).toBeUndefined()
    expect(selectCommune.findAll('option').map((option) => option.text())).toContain('ព្រែកប្រា')

    await selectCommune.setValue('ព្រែកប្រា')
    await flushPromises()

    expect(mockFetchVillages).toHaveBeenCalledWith('010201')
    expect(selectVillage.attributes('disabled')).toBeUndefined()
    expect(selectVillage.findAll('option').map((option) => option.text())).toContain('ភូមិ១')
    expect(selectGuardianType.findAll('option').map((option) => option.text())).toContain('Father')
  })

  it('clears child location selections when a parent selection changes', async () => {
    const wrapper = mountPage()

    await flushPromises()

    const selectProvince = getSelect(wrapper, 4)
    const selectDistrict = getSelect(wrapper, 5)
    const selectCommune = getSelect(wrapper, 6)
    const selectVillage = getSelect(wrapper, 7)

    await selectProvince.setValue('ភ្នំពេញ')
    await flushPromises()
    await selectDistrict.setValue('ដង្កោ')
    await flushPromises()
    await selectCommune.setValue('ព្រែកប្រា')
    await flushPromises()
    await selectVillage.setValue('ភូមិ១')
    await flushPromises()

    expect(selectDistrict.element.value).toBe('ដង្កោ')
    expect(selectCommune.element.value).toBe('ព្រែកប្រា')
    expect(selectVillage.element.value).toBe('ភូមិ១')

    await selectProvince.setValue('កណ្ដាល')
    await flushPromises()

    expect(selectDistrict.element.value).toBe('')
    expect(selectCommune.element.value).toBe('')
    expect(selectVillage.element.value).toBe('')
  })

  it('submits guardian type and Khmer formatted address', async () => {
    const wrapper = mountPage()

    await flushPromises()

    const textInputs = wrapper.findAll('input[type="text"]')
    await textInputs.at(2).setValue('Sokha')
    await textInputs.at(3).setValue('012345678')

    const selectGuardianType = getSelect(wrapper, 3)
    const selectProvince = getSelect(wrapper, 4)
    const selectDistrict = getSelect(wrapper, 5)
    const selectCommune = getSelect(wrapper, 6)
    const selectVillage = getSelect(wrapper, 7)

    await selectGuardianType.setValue('mother')
    await selectProvince.setValue('ភ្នំពេញ')
    await flushPromises()
    await selectDistrict.setValue('ដង្កោ')
    await flushPromises()
    await selectCommune.setValue('ព្រែកប្រា')
    await flushPromises()
    await selectVillage.setValue('ភូមិ១')
    await flushPromises()

    await wrapper.find('form').trigger('submit.prevent')
    await flushPromises()

    expect(mockCreatePreschoolStudent).toHaveBeenCalledWith(expect.objectContaining({
      guardian_name: 'Sokha',
      guardian_phone: '012345678',
      guardian_type: 'mother',
      address: 'ភូមិ១, ព្រែកប្រា, ដង្កោ, ភ្នំពេញ',
    }))
  })

  it('requires guardian type when guardian contact is entered', async () => {
    const wrapper = mountPage()

    await flushPromises()

    await wrapper.findAll('input[type="text"]').at(2).setValue('Sokha')
    await wrapper.find('form').trigger('submit.prevent')
    await flushPromises()

    expect(mockCreatePreschoolStudent).not.toHaveBeenCalled()
    expect(wrapper.text()).toContain('Guardian type is required when guardian contact is provided.')
  })

  it('shows a location error when the location API fails', async () => {
    mockFetchProvinces.mockRejectedValue(new Error('boom'))

    const wrapper = mountPage()

    await flushPromises()
    await flushPromises()

    expect(mockFetchProvinces).toHaveBeenCalled()
    expect(wrapper.vm.locationErrorMessage).toBe('boom')
    expect(wrapper.findAll('.student-form-page__state--error').length).toBeGreaterThan(0)
  })

  it('loads existing guardian and Khmer location values safely in edit mode', async () => {
    mockFetchPreschoolStudent.mockResolvedValueOnce({
      id: 'student-1',
      studentCode: 'ST-1',
      guardianName: 'Sokha',
      guardianPhone: '012345678',
      guardianType: 'mother',
      province: 'ភ្នំពេញ',
      district: 'ដង្កោ',
      commune: 'ព្រែកប្រា',
      village: 'ភូមិ១',
      address: 'ភូមិ១, ព្រែកប្រា, ដង្កោ, ភ្នំពេញ',
      avatarUrl: 'https://example.test/avatar.jpg',
      classes: [{ id: 'class-1' }],
    })

    const wrapper = mountWithPlugins(StudentForm, {
      messages: {
        en: enPreschool,
      },
      routes: [
        {
          path: '/students/:id/edit',
          name: 'dashboard-preschool-admin-students-edit',
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
          AlertSuccess: {
            props: ['show'],
            template: '<div v-if="show" data-testid="alert-success-stub" />',
          },
          Button: {
            props: ['disabled', 'loading'],
            emits: ['click'],
            template: '<button :disabled="disabled || loading" @click="$emit(\'click\')"><slot /></button>',
          },
          MultiSelect: {
            props: ['modelValue', 'options'],
            template: '<div data-testid="multi-select-stub" />',
          },
        },
      },
    })

    await wrapper.vm.$router.push({ name: 'dashboard-preschool-admin-students-edit', params: { id: 'student-1' } })

    await flushPromises()
    await flushPromises()

    const selectGuardianType = getSelect(wrapper, 3)
    const selectProvince = getSelect(wrapper, 4)
    const selectDistrict = getSelect(wrapper, 5)
    const selectCommune = getSelect(wrapper, 6)
    const selectVillage = getSelect(wrapper, 7)

    expect(selectGuardianType.element.value).toBe('mother')
    expect(selectProvince.element.value).toBe('ភ្នំពេញ')
    expect(selectDistrict.element.value).toBe('ដង្កោ')
    expect(selectCommune.element.value).toBe('ព្រែកប្រា')
    expect(selectVillage.element.value).toBe('ភូមិ១')
    expect(wrapper.text()).not.toContain('Failed to load location data.')
  })
})
