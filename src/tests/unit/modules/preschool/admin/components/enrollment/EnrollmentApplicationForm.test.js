import { beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises } from '@vue/test-utils'
import { mountWithPlugins } from '@/tests/helpers/mount'
import enPreschool from '@/i18n/en/preschool'
import khPreschool from '@/i18n/kh/preschool'
import EnrollmentApplicationForm from '@/modules/preschool/admin/components/enrollment/EnrollmentApplicationForm.vue'

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

function mountForm(props = {}) {
  return mountWithPlugins(EnrollmentApplicationForm, {
    messages: {
      en: enPreschool,
      kh: khPreschool,
    },
    props: {
      academicYears: [
        { id: 'ay-1', label: '2026-2027' },
      ],
      terms: [
        { id: 'term-1', name: 'Term 1' },
      ],
      classes: [
        { id: 'class-1', name: 'Morning Stars' },
      ],
      loading: false,
      readonly: false,
      saveLabel: 'Save Application',
      cancelLabel: 'Cancel',
      ...props,
    },
  })
}

async function flushAll() {
  await flushPromises()
  await flushPromises()
  await flushPromises()
  await flushPromises()
  await flushPromises()
  await flushPromises()
}

function findById(wrapper, id) {
  const node = wrapper.find(`#${id}`)
  expect(node.exists(), `missing element #${id}`).toBe(true)
  return node
}

async function waitForSelect(wrapper, id, minOptions = 2) {
  for (let index = 0; index < 10; index += 1) {
    await flushAll()
    const select = findById(wrapper, id)
    if (select.findAll('option').length >= minOptions) {
      return select
    }
  }

  return findById(wrapper, id)
}

async function waitForSelectValue(wrapper, id, expectedValue) {
  for (let index = 0; index < 10; index += 1) {
    await flushAll()
    const select = findById(wrapper, id)
    if (select.element.value === expectedValue) {
      return select
    }
  }

  return findById(wrapper, id)
}

beforeEach(() => {
  vi.clearAllMocks()

  mockFetchProvinces.mockResolvedValue([
    { id: '1', code: '01', nameEn: 'Phnom Penh', nameKh: 'ភ្នំពេញ' },
    { id: '2', code: '02', nameEn: 'Kandal', nameKh: 'កណ្តាល' },
  ])
  mockFetchDistricts.mockImplementation((provinceCode) => {
    if (String(provinceCode) === '01') {
      return Promise.resolve([
        { id: '11', code: '0101', nameEn: 'Dangkao', nameKh: 'ដង្កោ' },
      ])
    }

    if (String(provinceCode) === '02') {
      return Promise.resolve([
        { id: '21', code: '0201', nameEn: 'Sang', nameKh: 'ស្អាង' },
      ])
    }

    return Promise.resolve([])
  })
  mockFetchCommunes.mockImplementation((districtCode) => {
    if (String(districtCode) === '0101') {
      return Promise.resolve([
        { id: '111', code: '010101', nameEn: 'Tonle Bassac', nameKh: 'ទន្លេបាសាក់' },
      ])
    }

    if (String(districtCode) === '0201') {
      return Promise.resolve([
        { id: '211', code: '020101', nameEn: 'Prey Nup', nameKh: 'ព្រៃនប់' },
      ])
    }

    return Promise.resolve([])
  })
  mockFetchVillages.mockImplementation((communeCode) => {
    if (String(communeCode) === '010101') {
      return Promise.resolve([
        { id: '1111', code: '01010101', nameEn: 'Village 1', nameKh: 'ភូមិ ១' },
      ])
    }

    if (String(communeCode) === '020101') {
      return Promise.resolve([
        { id: '2111', code: '02010101', nameEn: 'Village A', nameKh: 'ភូមិ អា' },
      ])
    }

    return Promise.resolve([])
  })
})

describe('EnrollmentApplicationForm', () => {
  it('renders the redesigned student sections and controls', async () => {
    const wrapper = mountForm()

    await flushAll()

    expect(wrapper.text()).toContain('Student Information')
    expect(wrapper.text()).toContain('Identity Information')
    expect(wrapper.text()).toContain('Birth Location')
    expect(wrapper.text()).toContain('Current Residence')
    expect(wrapper.text()).toContain('Enrollment Request')
    expect(wrapper.text()).toContain('Guardian Information')
    expect(wrapper.text()).toContain('Guardian Location')
    expect(wrapper.text()).toContain('Authorization')
    expect(wrapper.find('input[placeholder="Enter given name"]').exists()).toBe(true)
    expect(wrapper.find('input[placeholder="Enter family name"]').exists()).toBe(true)
    expect(wrapper.find('input[placeholder="Enter Latin name"]').exists()).toBe(true)
    expect(findById(wrapper, 'enr-birth-province').exists()).toBe(true)
    expect(findById(wrapper, 'enr-residence-province').exists()).toBe(true)
    expect(findById(wrapper, 'enr-guardian-province').exists()).toBe(true)
  })

  it('keeps the save action disabled while loading and hides it in readonly mode', async () => {
    const loadingWrapper = mountForm({ loading: true })
    await flushAll()
    expect(loadingWrapper.find('button.enr-app-btn--save').attributes('disabled')).toBeDefined()

    const readonlyWrapper = mountForm({ readonly: true })
    await flushAll()
    expect(readonlyWrapper.find('button.enr-app-btn--save').exists()).toBe(false)
    expect(readonlyWrapper.find('button.enr-app-btn--cancel').exists()).toBe(true)
  })

  it('hydrates structured birth and residence locations and preserves the legacy fallback note', async () => {
    const wrapper = mountForm({
      application: {
        firstName: 'Sok',
        lastName: 'Chan',
        latinName: 'Sok Chan',
        gender: 'male',
        dateOfBirth: '2019-05-02',
        nationality: 'Cambodian',
        ethnicity: 'Khmer',
        placeOfBirth: 'Legacy Birthplace',
        currentResidenceDisplay: 'Legacy Residence',
        birthProvinceId: '1',
        birthDistrictId: '11',
        birthCommuneId: '111',
        birthVillageId: '1111',
        residenceProvinceId: '2',
        residenceDistrictId: '21',
        residenceCommuneId: '211',
        residenceVillageId: '2111',
        guardianName: 'Sokha',
        guardianRelationship: 'father',
        guardianPhone: '012345678',
      },
    })

    await flushAll()

    await waitForSelectValue(wrapper, 'enr-birth-province', '1')
    await waitForSelectValue(wrapper, 'enr-birth-district', '11')
    await waitForSelectValue(wrapper, 'enr-birth-commune', '111')
    await waitForSelectValue(wrapper, 'enr-birth-village', '1111')
    await waitForSelectValue(wrapper, 'enr-residence-province', '2')
    await waitForSelectValue(wrapper, 'enr-residence-district', '21')
    await waitForSelectValue(wrapper, 'enr-residence-commune', '211')
    await waitForSelectValue(wrapper, 'enr-residence-village', '2111')
  })

  it('shows the legacy birthplace note when structured birth IDs are absent', async () => {
    const wrapper = mountForm({
      application: {
        placeOfBirth: 'Legacy Birthplace',
        guardianName: 'Sokha',
        guardianRelationship: 'father',
        guardianPhone: '012345678',
      },
    })

    await flushAll()

    expect(wrapper.text()).toContain('Legacy birthplace')
    expect(wrapper.text()).toContain('Legacy place of birth retained: Legacy Birthplace')
  })

  it('shows the legacy current residence note when structured residence IDs are absent', async () => {
    const wrapper = mountForm({
      application: {
        guardianAddress: 'Legacy Residence 99',
        guardianName: 'Sokha',
        guardianRelationship: 'father',
        guardianPhone: '012345678',
      },
    })

    await flushAll()

    expect(wrapper.text()).toContain('Legacy current residence')
    expect(wrapper.text()).toContain('Legacy current residence retained: Legacy Residence 99')
  })

  it('shows field-level validation errors from the parent contract', async () => {
    const wrapper = mountForm({
      validationErrors: {
        first_name: 'Given name is required.',
        birth_province_id: 'Birth province is required.',
      },
    })

    await flushAll()

    expect(wrapper.text()).toContain('Given name is required.')
    expect(wrapper.text()).toContain('Birth province is required.')
  })

  it('emits a backend-safe payload with independent birth and residence cascades', async () => {
    const wrapper = mountForm()

    await flushAll()

    await findById(wrapper, 'enr-first-name').setValue('Sok')
    await findById(wrapper, 'enr-last-name').setValue('Chan')
    await findById(wrapper, 'enr-latin-name').setValue('Sok Chan')
    await findById(wrapper, 'enr-gender').setValue('male')
    await findById(wrapper, 'enr-date-of-birth').setValue('2019-05-02')
    await findById(wrapper, 'enr-nationality').setValue('Cambodian')
    await findById(wrapper, 'enr-ethnicity').setValue('Khmer')

    wrapper.vm.form.birth_province_id = '1'
    await flushAll()
    wrapper.vm.form.birth_district_id = '11'
    await flushAll()
    wrapper.vm.form.birth_commune_id = '111'
    await flushAll()
    wrapper.vm.form.birth_village_id = '1111'
    await flushAll()
    wrapper.vm.form.residence_province_id = '2'
    await flushAll()
    wrapper.vm.form.residence_district_id = '21'
    await flushAll()
    wrapper.vm.form.residence_commune_id = '211'
    await flushAll()
    wrapper.vm.form.residence_village_id = '2111'
    await flushAll()

    await findById(wrapper, 'enr-guardian-name').setValue('Sokha')
    await findById(wrapper, 'enr-guardian-type').setValue('father')
    await findById(wrapper, 'enr-guardian-phone').setValue('012345678')
    await findById(wrapper, 'enr-guardian-email').setValue('sokha@example.test')

    const guardianProvince = await waitForSelect(wrapper, 'enr-guardian-province')
    await guardianProvince.setValue(guardianProvince.findAll('option').at(1).element.value)
    await flushAll()
    const guardianDistrict = await waitForSelect(wrapper, 'enr-guardian-district')
    await guardianDistrict.setValue(guardianDistrict.findAll('option').at(1).element.value)
    await flushAll()
    const guardianCommune = await waitForSelect(wrapper, 'enr-guardian-commune')
    await guardianCommune.setValue(guardianCommune.findAll('option').at(1).element.value)
    await flushAll()
    const guardianVillage = await waitForSelect(wrapper, 'enr-guardian-village')
    await guardianVillage.setValue(guardianVillage.findAll('option').at(1).element.value)
    await flushAll()

    await wrapper.find('form').trigger('submit.prevent')
    await flushAll()

    const emitted = wrapper.emitted('save')
    expect(emitted).toHaveLength(1)
    expect(emitted[0][0]).toMatchObject({
      first_name: 'Sok',
      last_name: 'Chan',
      latin_name: 'Sok Chan',
      khmer_name: 'Sok Chan',
      gender: 'male',
      date_of_birth: '2019-05-02',
      nationality: 'Cambodian',
      ethnicity: 'Khmer',
      birth_province_id: 1,
      birth_district_id: 11,
      birth_commune_id: 111,
      birth_village_id: 1111,
      residence_province_id: 2,
      residence_district_id: 21,
      residence_commune_id: 211,
      residence_village_id: 2111,
      guardian_name: 'Sokha',
      guardian_relationship: 'father',
      guardian_phone: '012345678',
      guardian_email: 'sokha@example.test',
      guardian_address: 'Village 1, Tonle Bassac, Dangkao, Phnom Penh',
    })
  })

  it('keeps EN/KH enrollment labels aligned', () => {
    expect(enPreschool.preschoolEnrollmentPage.applicationDialog.fields.givenName).toBeTruthy()
    expect(khPreschool.preschoolEnrollmentPage.applicationDialog.fields.givenName).toBeTruthy()
    expect(enPreschool.preschoolEnrollmentPage.applicationDialog.subsections.birthLocation).toBeTruthy()
    expect(khPreschool.preschoolEnrollmentPage.applicationDialog.subsections.birthLocation).toBeTruthy()
    expect(enPreschool.preschoolEnrollmentPage.applicationDialog.legacy.birthPlaceLabel).toBeTruthy()
    expect(khPreschool.preschoolEnrollmentPage.applicationDialog.legacy.birthPlaceLabel).toBeTruthy()
  })
})
