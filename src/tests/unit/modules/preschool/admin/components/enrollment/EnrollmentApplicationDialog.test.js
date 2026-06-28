import { beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises } from '@vue/test-utils'
import { mountWithPlugins } from '@/tests/helpers/mount'
import enPreschool from '@/i18n/en/preschool'
import EnrollmentApplicationForm from '@/modules/preschool/admin/components/enrollment/EnrollmentApplicationForm.vue'
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

async function selectRenderedOption(wrapper, index, optionIndex = 1) {
  const select = getSelect(wrapper, index)
  const option = select.findAll('option').at(optionIndex)
  await select.setValue(option.element.value)
}

async function flushAll() {
  await flushPromises()
  await flushPromises()
}

async function fillGuardianFields(wrapper, guardianType = 'father') {
  const textInputs = wrapper.findAll('input[type="text"]')
  await textInputs.at(6).setValue('Sokha')
  await wrapper.findAll('select').at(4).setValue(guardianType)
  await textInputs.at(7).setValue('012345678')
  await wrapper.find('input[type="email"]').setValue('sokha@example.test')
}

beforeEach(() => {
  vi.clearAllMocks()

  mockFetchProvinces.mockResolvedValue([
    { code: '01', nameEn: 'Phnom Penh', nameKh: 'áž—áŸ’áž“áŸ†áž–áŸáž‰' },
    { code: '08', nameEn: 'Kandal', nameKh: 'áž€ážŽáŸ’ážáž¶áž›' },
  ])

  mockFetchDistricts.mockImplementation((provinceCode) => {
    if (String(provinceCode) === '01') {
      return Promise.resolve([
        { code: '0102', nameEn: 'Dangkao', nameKh: 'ážŠáž„áŸ’áž€áŸ„' },
      ])
    }

    if (String(provinceCode) === '08') {
      return Promise.resolve([
        { code: '0801', nameEn: 'Khsach Kandal', nameKh: 'ážáŸ’ážŸáž¶áž…áŸ‹áž€ážŽáŸ’ážáž¶áž›' },
      ])
    }

    return Promise.resolve([])
  })

  mockFetchCommunes.mockImplementation((districtCode) => {
    if (String(districtCode) === '0102') {
      return Promise.resolve([
        { code: '010201', nameEn: 'Prek Pra', nameKh: 'áž–áŸ’ážšáŸ‚áž€áž”áŸ’ážšáž¶' },
      ])
    }

    if (String(districtCode) === '0801') {
      return Promise.resolve([
        { code: '080101', nameEn: 'Akreiy Ksatr', nameKh: 'áž¢ážšáž·áž™áž€áŸ’ážŸážáŸ’ážš' },
      ])
    }

    return Promise.resolve([])
  })

  mockFetchVillages.mockImplementation((communeCode) => {
    if (String(communeCode) === '010201') {
      return Promise.resolve([
        { code: '01020101', nameEn: 'Village 1', nameKh: 'áž—áž¼áž˜áž·áŸ¡' },
      ])
    }

    if (String(communeCode) === '080101') {
      return Promise.resolve([
        { code: '08010101', nameEn: 'Village A', nameKh: 'áž—áž¼áž˜áž·áž¢áž¶' },
      ])
    }

    return Promise.resolve([])
  })
})

describe('EnrollmentApplicationDialog', () => {
  it('hides the other guardian type detail field by default', async () => {
    const wrapper = mountDialog()

    await flushAll()

    expect(wrapper.text()).not.toContain('Other Guardian Type')
    expect(wrapper.text()).not.toContain('Enter guardian type, e.g. Aunt, Uncle')
  })

  it('shows and clears the other guardian type detail field', async () => {
    const wrapper = mountDialog()

    await flushAll()

    await getSelect(wrapper, 4).setValue('other')
    await flushAll()

    expect(wrapper.text()).toContain('Other Guardian Type')

    const detailInput = wrapper.find('input[placeholder="Enter guardian type, e.g. Aunt, Uncle"]')
    await detailInput.setValue('Aunt')
    expect(detailInput.element.value).toBe('Aunt')

    await getSelect(wrapper, 4).setValue('father')
    await flushAll()

    expect(wrapper.text()).not.toContain('Other Guardian Type')
    await getSelect(wrapper, 4).setValue('other')
    await flushAll()
    expect(wrapper.find('input[placeholder="Enter guardian type, e.g. Aunt, Uncle"]').element.value).toBe('')
  })

  it('loads location options and cascades province to village', async () => {
    const wrapper = mountDialog()

    await flushAll()

    const provinceSelect = getSelect(wrapper, 5)
    expect(provinceSelect.findAll('option').map((option) => option.text())).toContain('áž—áŸ’áž“áŸ†áž–áŸáž‰')

    await provinceSelect.setValue(provinceSelect.findAll('option').at(1).element.value)
    await flushAll()

    expect(mockFetchDistricts).toHaveBeenCalledWith('01')
    expect(getSelect(wrapper, 6).findAll('option').map((option) => option.text())).toContain('ážŠáž„áŸ’áž€áŸ„')

    await selectRenderedOption(wrapper, 6)
    await flushAll()

    expect(mockFetchCommunes).toHaveBeenCalledWith('0102')
    expect(getSelect(wrapper, 7).findAll('option').map((option) => option.text())).toContain('áž–áŸ’ážšáŸ‚áž€áž”áŸ’ážšáž¶')

    await selectRenderedOption(wrapper, 7)
    await flushAll()

    expect(mockFetchVillages).toHaveBeenCalledWith('010201')
    expect(getSelect(wrapper, 8).findAll('option').map((option) => option.text())).toContain('áž—áž¼áž˜áž·áŸ¡')
  })

  it('clears child selections when a parent selection changes', async () => {
    const wrapper = mountDialog()

    await flushAll()

    const provinceSelect = getSelect(wrapper, 5)
    const districtSelect = getSelect(wrapper, 6)
    const communeSelect = getSelect(wrapper, 7)
    const villageSelect = getSelect(wrapper, 8)

    await provinceSelect.setValue(provinceSelect.findAll('option').at(2).element.value)
    await flushAll()
    await selectRenderedOption(wrapper, 6)
    await flushAll()
    await selectRenderedOption(wrapper, 7)
    await flushAll()
    await selectRenderedOption(wrapper, 8)
    await flushAll()

    await provinceSelect.setValue(provinceSelect.findAll('option').at(1).element.value)
    await flushAll()

    expect(districtSelect.element.value).toBe('')
    expect(communeSelect.element.value).toBe('')
    expect(villageSelect.element.value).toBe('')
  })

  it('generates a Khmer full address and emits a backend-safe payload', async () => {
    const wrapper = mountDialog()

    await flushAll()
    await fillGuardianFields(wrapper)

    const provinceSelect = getSelect(wrapper, 5)
    await provinceSelect.setValue(provinceSelect.findAll('option').at(1).element.value)
    await flushAll()
    await selectRenderedOption(wrapper, 6)
    await flushAll()
    await selectRenderedOption(wrapper, 7)
    await flushAll()
    await selectRenderedOption(wrapper, 8)
    await flushAll()

    expect(wrapper.text()).toContain('Guardian Type')
    expect(wrapper.text()).toContain('Village:')
    expect(wrapper.text()).toContain('Commune/Ward:')
    expect(wrapper.text()).toContain('District/Khan:')
    expect(wrapper.text()).toContain('Province/Capital:')

    await wrapper.find('form').trigger('submit.prevent')
    await flushAll()

    const emitted = wrapper.emitted('save')
    expect(emitted).toHaveLength(1)
    expect(emitted[0][0]).toMatchObject({
      guardian_name: 'Sokha',
      guardian_relationship: 'father',
      guardian_phone: '012345678',
      guardian_email: 'sokha@example.test',
      guardian_address: 'áž—áž¼áž˜áž·áŸ¡, áž–áŸ’ážšáŸ‚áž€áž”áŸ’ážšáž¶, ážŠáž„áŸ’áž€áŸ„, áž—áŸ’áž“áŸ†áž–áŸáž‰',
    })
    expect(emitted[0][0].province_code).toBeUndefined()
    expect(emitted[0][0].district_code).toBeUndefined()
    expect(emitted[0][0].commune_code).toBeUndefined()
    expect(emitted[0][0].village_code).toBeUndefined()
  })

  it('requires a detail value when other guardian type is selected', async () => {
    const wrapper = mountDialog()

    await flushAll()
    await fillGuardianFields(wrapper, 'other')
    await wrapper.find('form').trigger('submit.prevent')
    await flushAll()

    expect(wrapper.text()).toContain('Please specify the guardian type.')
    expect(wrapper.emitted('save')).toBeFalsy()
  })

  it('submits the custom relationship when other guardian type detail is filled', async () => {
    const wrapper = mountDialog()

    await flushAll()
    await fillGuardianFields(wrapper, 'other')
    await getSelect(wrapper, 4).setValue('other')
    await flushAll()

    await selectRenderedOption(wrapper, 5)
    await flushAll()
    await selectRenderedOption(wrapper, 6)
    await flushAll()
    await selectRenderedOption(wrapper, 7)
    await flushAll()
    await selectRenderedOption(wrapper, 8)
    await flushAll()

    const detailInput = wrapper.find('input[placeholder="Enter guardian type, e.g. Aunt, Uncle"]')
    await detailInput.setValue('Aunt')
    await flushAll()

    const formWrapper = wrapper.findComponent(EnrollmentApplicationForm)
    formWrapper.vm.form.guardian_relationship_detail = 'Aunt'
    await flushAll()

    formWrapper.vm.$.setupState.save()
    await flushAll()

    const emitted = wrapper.emitted('save')
    expect(emitted).toHaveLength(1)
    expect(emitted[0][0].guardian_relationship).toBe('Aunt')
  })

  it('shows a validation message when the location hierarchy is incomplete', async () => {
    const wrapper = mountDialog()

    await flushAll()
    await fillGuardianFields(wrapper)

    await wrapper.find('form').trigger('submit.prevent')
    await flushAll()
    await wrapper.vm.$nextTick()
    await flushPromises()

    expect(wrapper.text()).toContain('Province is required.')
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
        guardianRelationship: 'father',
      },
    })

    await flushAll()

    const provinceSelect = getSelect(wrapper, 5)
    const districtSelect = getSelect(wrapper, 6)
    const communeSelect = getSelect(wrapper, 7)
    const villageSelect = getSelect(wrapper, 8)

    expect(provinceSelect.element.value).toBe('áž—áŸ’áž“áŸ†áž–áŸáž‰')
    expect(districtSelect.element.value).toBe('ážŠáž„áŸ’áž€áŸ„')
    expect(communeSelect.element.value).toBe('áž–áŸ’ážšáŸ‚áž€áž”áŸ’ážšáž¶')
    expect(villageSelect.element.value).toBe('áž—áž¼áž˜áž·áŸ¡')
    expect(wrapper.text()).toContain('Village:')
    expect(wrapper.text()).toContain('Commune/Ward:')
    expect(wrapper.text()).toContain('District/Khan:')
    expect(wrapper.text()).toContain('Province/Capital:')

    const legacyWrapper = mountDialog({
      application: {
        guardianName: 'Sokha',
        guardianPhone: '012345678',
        guardianAddress: 'Legacy Address 12',
        guardianRelationship: 'áž˜áž¸áž„',
      },
    })

    await flushAll()

    expect(legacyWrapper.text()).toContain('Legacy Address 12')
    expect(legacyWrapper.findAll('select').at(4).element.value).toBe('other')
    expect(legacyWrapper.find('input[placeholder="Enter guardian type, e.g. Aunt, Uncle"]').element.value).toBe('áž˜áž¸áž„')
  })

  it('shows a location load error when the API fails', async () => {
    mockFetchProvinces.mockRejectedValueOnce({})

    const wrapper = mountDialog()

    await flushAll()

    expect(wrapper.text()).toContain('Failed to load location data.')
  })
})
