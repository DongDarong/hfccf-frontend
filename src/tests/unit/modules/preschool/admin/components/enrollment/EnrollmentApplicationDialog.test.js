import { beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises } from '@vue/test-utils'
import { mountWithPlugins } from '@/tests/helpers/mount'
import enPreschool from '@/i18n/en/preschool'
import EnrollmentApplicationDialog from '@/modules/preschool/admin/components/enrollment/EnrollmentApplicationDialog.vue'

const mockFetchProvinces = vi.fn()
const mockFetchDistricts = vi.fn()
const mockFetchCommunes = vi.fn()
const mockFetchVillages = vi.fn()

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

function mountDialog(props = {}) {
  return mountWithPlugins(EnrollmentApplicationDialog, {
    messages: {
      en: enPreschool,
    },
    props: {
      visible: true,
      academicYears: [],
      terms: [],
      classes: [],
      loading: false,
      readonly: false,
      application: null,
      ...props,
    },
    global: {
      stubs: {
        Teleport: true,
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

async function fillGuardianFields(wrapper) {
  const textInputs = wrapper.findAll('input[type="text"]')
  await textInputs.at(6).setValue('Sokha')
  await textInputs.at(7).setValue('Brother')
  await textInputs.at(8).setValue('012345678')
  await wrapper.find('input[type="email"]').setValue('sokha@example.test')
}

beforeEach(() => {
  vi.clearAllMocks()

  mockFetchProvinces.mockResolvedValue([
    { code: '01', nameEn: 'Phnom Penh', nameKh: 'ភ្នំពេញ' },
    { code: '08', nameEn: 'Kandal', nameKh: 'កណ្តាល' },
  ])

  mockFetchDistricts.mockImplementation((provinceCode) => {
    if (String(provinceCode) === '01') {
      return Promise.resolve([
        { code: '0102', nameEn: 'Dangkao', nameKh: 'ដង្កោ' },
      ])
    }

    if (String(provinceCode) === '08') {
      return Promise.resolve([
        { code: '0801', nameEn: 'Khsach Kandal', nameKh: 'ខ្សាច់កណ្តាល' },
      ])
    }

    return Promise.resolve([])
  })

  mockFetchCommunes.mockImplementation((districtCode) => {
    if (String(districtCode) === '0102') {
      return Promise.resolve([
        { code: '010201', nameEn: 'Prek Pra', nameKh: 'ព្រែកប្រា' },
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
      ])
    }

    if (String(communeCode) === '080101') {
      return Promise.resolve([
        { code: '08010101', nameEn: 'Village A', nameKh: 'ភូមិអា' },
      ])
    }

    return Promise.resolve([])
  })
})

describe('EnrollmentApplicationDialog', () => {
  it('loads location options and cascades province to village', async () => {
    const wrapper = mountDialog()

    await flushAll()

    const provinceSelect = getSelect(wrapper, 4)
    expect(provinceSelect.findAll('option').map((option) => option.text())).toContain('ភ្នំពេញ')

    await provinceSelect.setValue('ភ្នំពេញ')
    await flushAll()

    expect(mockFetchDistricts).toHaveBeenCalledWith('01')
    expect(getSelect(wrapper, 5).findAll('option').map((option) => option.text())).toContain('ដង្កោ')

    await getSelect(wrapper, 5).setValue('ដង្កោ')
    await flushAll()

    expect(mockFetchCommunes).toHaveBeenCalledWith('0102')
    expect(getSelect(wrapper, 6).findAll('option').map((option) => option.text())).toContain('ព្រែកប្រា')

    await getSelect(wrapper, 6).setValue('ព្រែកប្រា')
    await flushAll()

    expect(mockFetchVillages).toHaveBeenCalledWith('010201')
    expect(getSelect(wrapper, 7).findAll('option').map((option) => option.text())).toContain('ភូមិ១')
  })

  it('clears child selections when a parent selection changes', async () => {
    const wrapper = mountDialog()

    await flushAll()

    const provinceSelect = getSelect(wrapper, 4)
    const districtSelect = getSelect(wrapper, 5)
    const communeSelect = getSelect(wrapper, 6)
    const villageSelect = getSelect(wrapper, 7)

    await provinceSelect.setValue('ភ្នំពេញ')
    await flushAll()
    await getSelect(wrapper, 5).setValue('ដង្កោ')
    await flushAll()
    await getSelect(wrapper, 6).setValue('ព្រែកប្រា')
    await flushAll()
    await getSelect(wrapper, 7).setValue('ភូមិ១')
    await flushAll()

    await provinceSelect.setValue('កណ្តាល')
    await flushAll()

    expect(districtSelect.element.value).toBe('')
    expect(communeSelect.element.value).toBe('')
    expect(villageSelect.element.value).toBe('')
  })

  it('generates a Khmer full address and emits a backend-safe payload', async () => {
    const wrapper = mountDialog()

    await flushAll()
    await fillGuardianFields(wrapper)

    const provinceSelect = getSelect(wrapper, 4)
    await provinceSelect.setValue('ភ្នំពេញ')
    await flushAll()
    await getSelect(wrapper, 5).setValue('ដង្កោ')
    await flushAll()
    await getSelect(wrapper, 6).setValue('ព្រែកប្រា')
    await flushAll()
    await getSelect(wrapper, 7).setValue('ភូមិ១')
    await flushAll()

    expect(wrapper.text()).toContain('ភូមិ១, ព្រែកប្រា, ដង្កោ, ភ្នំពេញ')

    await wrapper.find('button.enr-app-btn--save').trigger('click')
    await flushAll()

    const emitted = wrapper.emitted('save')
    expect(emitted).toHaveLength(1)
    expect(emitted[0][0]).toMatchObject({
      guardian_name: 'Sokha',
      guardian_relationship: 'Brother',
      guardian_phone: '012345678',
      guardian_email: 'sokha@example.test',
      guardian_address: 'ភូមិ១, ព្រែកប្រា, ដង្កោ, ភ្នំពេញ',
    })
    expect(emitted[0][0].province_code).toBeUndefined()
    expect(emitted[0][0].district_code).toBeUndefined()
    expect(emitted[0][0].commune_code).toBeUndefined()
    expect(emitted[0][0].village_code).toBeUndefined()
  })

  it('shows a validation message when the location hierarchy is incomplete', async () => {
    const wrapper = mountDialog()

    await flushAll()
    await fillGuardianFields(wrapper)

    await wrapper.find('button.enr-app-btn--save').trigger('click')
    await flushAll()

    expect(wrapper.text()).toContain('Guardian location is required.')
    expect(wrapper.emitted('save')).toBeFalsy()
  })

  it('hydrates edit mode from structured values and falls back to a legacy address', async () => {
    const wrapper = mountDialog({
      application: {
        guardianName: 'Sokha',
        guardianPhone: '012345678',
        guardianAddress: 'Legacy Address 12',
        guardianProvince: '01',
        guardianDistrict: '0102',
        guardianCommune: '010201',
        guardianVillage: '01020101',
      },
    })

    await flushAll()

    const provinceSelect = getSelect(wrapper, 4)
    const districtSelect = getSelect(wrapper, 5)
    const communeSelect = getSelect(wrapper, 6)
    const villageSelect = getSelect(wrapper, 7)

    expect(provinceSelect.element.value).toBe('ភ្នំពេញ')
    expect(districtSelect.element.value).toBe('ដង្កោ')
    expect(communeSelect.element.value).toBe('ព្រែកប្រា')
    expect(villageSelect.element.value).toBe('ភូមិ១')
    expect(wrapper.text()).toContain('ភូមិ១, ព្រែកប្រា, ដង្កោ, ភ្នំពេញ')

    const legacyWrapper = mountDialog({
      application: {
        guardianName: 'Sokha',
        guardianPhone: '012345678',
        guardianAddress: 'Legacy Address 12',
      },
    })

    await flushAll()

    expect(legacyWrapper.text()).toContain('Legacy Address 12')
  })

  it('shows a location load error when the API fails', async () => {
    mockFetchProvinces.mockRejectedValueOnce({})

    const wrapper = mountDialog()

    await flushAll()

    expect(wrapper.text()).toContain('Failed to load location data.')
  })
})
