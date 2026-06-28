import { describe, expect, it } from 'vitest'
import { DEFAULT_FORM } from '@/modules/preschool/admin/pages/students/constants/studentFormConstants'
import {
  buildGuardianTypeOptions,
  loadStudentIntoForm,
  normalizeStudentPayload,
} from '@/modules/preschool/admin/pages/students/utils/studentFormHelpers'
import { buildLocationAddress } from '@/modules/preschool/services/cambodiaLocationService'

const t = (key) => key

describe('studentFormHelpers', () => {
  it('loads structured guardian and address fields safely in edit mode', () => {
    const form = { ...DEFAULT_FORM }

    loadStudentIntoForm(
      {
        studentCode: 'ST-1',
        guardianName: 'Sokha',
        guardianPhone: '012345678',
        guardianType: 'mother',
        province: 'ខេត្តភ្នំពេញ',
        district: 'ខណ្ឌដង្កោ',
        commune: 'សង្កាត់ព្រែកប្រា',
        village: 'ភូមិ១',
        address: 'ភូមិ១, សង្កាត់ព្រែកប្រា, ខណ្ឌដង្កោ, ខេត្តភ្នំពេញ',
        classes: [{ id: 'class-1' }],
      },
      form,
    )

    expect(form.guardian_name).toBe('Sokha')
    expect(form.guardian_phone).toBe('012345678')
    expect(form.guardian_type).toBe('mother')
    expect(form.province).toBe('ខេត្តភ្នំពេញ')
    expect(form.district).toBe('ខណ្ឌដង្កោ')
    expect(form.commune).toBe('សង្កាត់ព្រែកប្រា')
    expect(form.village).toBe('ភូមិ១')
    expect(form.address).toBe('ភូមិ១, សង្កាត់ព្រែកប្រា, ខណ្ឌដង្កោ, ខេត្តភ្នំពេញ')
    expect(form.class_ids).toEqual(['class-1'])
  })

  it('builds the submitted address from the selected location hierarchy', () => {
    const payload = normalizeStudentPayload(
      {
        student_code: 'ST-1',
        student_type: 'paying',
        first_name: 'Alice',
        last_name: 'Student',
        gender: 'female',
        date_of_birth: '2020-01-01',
        guardian_name: 'Sokha',
        guardian_phone: '012345678',
        guardian_type: 'mother',
        province: 'ខេត្តភ្នំពេញ',
        district: 'ខណ្ឌដង្កោ',
        commune: 'សង្កាត់ព្រែកប្រា',
        village: 'ភូមិ១',
        address: '',
        status: 'active',
        class_ids: ['class-1'],
        avatar: null,
        remove_avatar: false,
      },
      true,
    )

    expect(payload.guardian_type).toBe('mother')
    expect(payload.address).toBe('ភូមិ១, សង្កាត់ព្រែកប្រា, ខណ្ឌដង្កោ, ខេត្តភ្នំពេញ')
  })

  it('falls back to the raw address when no structured location is selected', () => {
    expect(
      buildLocationAddress({
        address: '123 Sample Street',
        province: '',
        district: '',
        commune: '',
        village: '',
      }),
    ).toBe('123 Sample Street')
  })

  it('keeps guardian type options aligned with the locale keys', () => {
    const options = buildGuardianTypeOptions(t)

    expect(options.map((option) => option.value)).toEqual([
      'father',
      'mother',
      'grandfather',
      'grandmother',
      'other',
    ])
  })
})
