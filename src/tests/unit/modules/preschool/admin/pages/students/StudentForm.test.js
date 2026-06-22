import { beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises } from '@vue/test-utils'
import { mountWithPlugins } from '@/tests/helpers/mount'
import enPreschool from '@/i18n/en/preschool'
import StudentForm from '@/modules/preschool/admin/pages/students/StudentForm.vue'

const mockFetchPreschoolClasses = vi.fn()
const mockFetchPreschoolStudent = vi.fn()
const mockCreatePreschoolStudent = vi.fn()
const mockUpdatePreschoolStudent = vi.fn()

vi.mock('@/modules/preschool/services/preschoolApi', () => ({
  fetchPreschoolClasses: (...args) => mockFetchPreschoolClasses(...args),
  fetchPreschoolStudent: (...args) => mockFetchPreschoolStudent(...args),
  createPreschoolStudent: (...args) => mockCreatePreschoolStudent(...args),
  updatePreschoolStudent: (...args) => mockUpdatePreschoolStudent(...args),
}))

vi.mock('@/modules/preschool/services/cambodiaLocationService', () => ({
  getProvinceOptions: () => [
    { label: 'Phnom Penh', value: 'Phnom Penh' },
    { label: 'Kandal', value: 'Kandal' },
  ],
  getDistrictOptions: (province) =>
    province === 'Phnom Penh'
      ? [
          { label: 'Dangkao', value: 'Dangkao' },
          { label: 'Sen Sok', value: 'Sen Sok' },
        ]
      : province === 'Kandal'
        ? [{ label: 'Khsach Kandal', value: 'Khsach Kandal' }]
        : [],
  getCommuneOptions: (province, district) => {
    if (province === 'Phnom Penh' && district === 'Dangkao') {
      return [
        { label: 'Prek Pra', value: 'Prek Pra' },
        { label: 'Prek Kampeus', value: 'Prek Kampeus' },
      ]
    }

    if (province === 'Kandal' && district === 'Khsach Kandal') {
      return [{ label: 'Akreiy Ksatr', value: 'Akreiy Ksatr' }]
    }

    return []
  },
  getVillageOptions: (province, district, commune) => {
    if (province === 'Phnom Penh' && district === 'Dangkao' && commune === 'Prek Pra') {
      return [
        { label: 'Village 1', value: 'Village 1' },
        { label: 'Village 2', value: 'Village 2' },
      ]
    }

    if (province === 'Kandal' && district === 'Khsach Kandal' && commune === 'Akreiy Ksatr') {
      return [{ label: 'Village A', value: 'Village A' }]
    }

    return []
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

  mockFetchPreschoolStudent.mockResolvedValue(null)
  mockCreatePreschoolStudent.mockResolvedValue({
    id: 'student-1',
  })
  mockUpdatePreschoolStudent.mockResolvedValue({
    id: 'student-1',
  })
})

describe('StudentForm', () => {
  it('renders guardian type and cascading location selects', async () => {
    const wrapper = mountPage()

    await flushPromises()

    const selectGuardianType = getSelect(wrapper, 3)
    const selectProvince = getSelect(wrapper, 4)
    const selectDistrict = getSelect(wrapper, 5)
    const selectCommune = getSelect(wrapper, 6)
    const selectVillage = getSelect(wrapper, 7)

    expect(selectGuardianType.findAll('option').map((option) => option.text())).toContain('Father')
    expect(selectProvince.findAll('option').map((option) => option.text())).toContain('Phnom Penh')
    expect(selectDistrict.attributes('disabled')).toBeDefined()
    expect(selectCommune.attributes('disabled')).toBeDefined()
    expect(selectVillage.attributes('disabled')).toBeDefined()

    await selectProvince.setValue('Phnom Penh')
    await flushPromises()

    expect(selectDistrict.attributes('disabled')).toBeUndefined()
    expect(selectDistrict.findAll('option').map((option) => option.text())).toContain('Dangkao')

    await selectDistrict.setValue('Dangkao')
    await flushPromises()

    expect(selectCommune.attributes('disabled')).toBeUndefined()
    expect(selectCommune.findAll('option').map((option) => option.text())).toContain('Prek Pra')

    await selectCommune.setValue('Prek Pra')
    await flushPromises()

    expect(selectVillage.attributes('disabled')).toBeUndefined()
    expect(selectVillage.findAll('option').map((option) => option.text())).toContain('Village 1')
  })

  it('clears child location selections when a parent selection changes', async () => {
    const wrapper = mountPage()

    await flushPromises()

    const selectProvince = getSelect(wrapper, 4)
    const selectDistrict = getSelect(wrapper, 5)
    const selectCommune = getSelect(wrapper, 6)
    const selectVillage = getSelect(wrapper, 7)

    await selectProvince.setValue('Phnom Penh')
    await flushPromises()
    await selectDistrict.setValue('Dangkao')
    await flushPromises()
    await selectCommune.setValue('Prek Pra')
    await flushPromises()
    await selectVillage.setValue('Village 1')
    await flushPromises()

    expect(selectDistrict.element.value).toBe('Dangkao')
    expect(selectCommune.element.value).toBe('Prek Pra')
    expect(selectVillage.element.value).toBe('Village 1')

    await selectProvince.setValue('Kandal')
    await flushPromises()

    expect(selectDistrict.element.value).toBe('')
    expect(selectCommune.element.value).toBe('')
    expect(selectVillage.element.value).toBe('')
  })

  it('submits guardian type and a formatted address', async () => {
    const wrapper = mountPage()

    await flushPromises()

    const phoneInputs = wrapper.findAll('input[type="text"]')
    await phoneInputs.at(2).setValue('Sokha')
    await phoneInputs.at(3).setValue('012345678')

    const selectGuardianType = getSelect(wrapper, 3)
    const selectProvince = getSelect(wrapper, 4)
    const selectDistrict = getSelect(wrapper, 5)
    const selectCommune = getSelect(wrapper, 6)
    const selectVillage = getSelect(wrapper, 7)

    await selectGuardianType.setValue('mother')
    await selectProvince.setValue('Phnom Penh')
    await flushPromises()
    await selectDistrict.setValue('Dangkao')
    await flushPromises()
    await selectCommune.setValue('Prek Pra')
    await flushPromises()
    await selectVillage.setValue('Village 1')
    await flushPromises()

    await wrapper.find('form').trigger('submit.prevent')
    await flushPromises()

    expect(mockCreatePreschoolStudent).toHaveBeenCalledWith(expect.objectContaining({
      guardian_name: 'Sokha',
      guardian_phone: '012345678',
      guardian_type: 'mother',
      address: 'Village 1, Prek Pra, Dangkao, Phnom Penh',
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
})
