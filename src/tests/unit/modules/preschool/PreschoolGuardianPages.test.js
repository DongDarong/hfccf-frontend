import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ref } from 'vue'
import { flushPromises } from '@vue/test-utils'
import { mountWithPlugins } from '@/tests/helpers/mount'
import enPreschool from '@/i18n/en/preschool'
import GuardianManagement from '@/modules/preschool/admin/pages/GuardianManagement.vue'
import StudentGuardians from '@/modules/preschool/admin/pages/StudentGuardians.vue'
import EmergencyContacts from '@/modules/preschool/teacher/pages/EmergencyContacts.vue'

// Keep the guardian route pages mount-tested so the new Preschool workflow
// does not regress into placeholder screens or runtime warnings.
const mockGuardianComposables = vi.fn()
const mockStudentGuardianComposables = vi.fn()
const mockEmergencyContactComposables = vi.fn()

vi.mock('@/modules/preschool/composables/usePreschoolGuardians', () => ({
  usePreschoolGuardians: () => mockGuardianComposables(),
}))

vi.mock('@/modules/preschool/composables/useStudentGuardians', () => ({
  useStudentGuardians: () => mockStudentGuardianComposables(),
}))

vi.mock('@/modules/preschool/composables/useEmergencyContacts', () => ({
  useEmergencyContacts: () => mockEmergencyContactComposables(),
}))

beforeEach(() => {
  vi.clearAllMocks()
})

function baseStubs() {
  return {
    MainLayout: { template: '<div><slot /></div>' },
    HeaderSection: { props: ['title', 'subtitle'], template: '<header><h1>{{ title }}</h1><p>{{ subtitle }}</p></header>' },
    Button: { template: '<button><slot /></button>' },
    Dialog: { template: '<div><slot /></div>' },
    AlertQuestion: { template: '<div />' },
    AlertSuccess: { template: '<div />' },
    GuardianForm: { template: '<div />' },
    GuardianList: { template: '<div />' },
    StudentGuardianRelationshipForm: { template: '<div />' },
    StudentGuardianList: { template: '<div />' },
    EmergencyContactList: { template: '<div />' },
  }
}

describe('preschool guardian pages', () => {
  it('mounts the guardian management page', async () => {
    mockGuardianComposables.mockReturnValue({
      archiveSelectedGuardian: vi.fn().mockResolvedValue(true),
      closeGuardianDialog: vi.fn(),
      currentPage: ref(1),
      dialogMode: ref('create'),
      dialogOpen: ref(false),
      errorMessage: ref(''),
      guardianForm: ref({}),
      guardians: ref([{ id: 1, fullName: 'Guardian One' }]),
      loadGuardians: vi.fn().mockResolvedValue(undefined),
      loading: ref(false),
      openCreateGuardian: vi.fn(),
      openEditGuardian: vi.fn(),
      pagination: ref({ page: 1, perPage: 10, total: 1, totalPages: 1 }),
      saveGuardian: vi.fn().mockResolvedValue({ fullName: 'Guardian One' }),
      saving: ref(false),
      searchQuery: ref(''),
      selectedGuardian: ref(null),
      selectedStatus: ref(''),
      setCurrentPage: vi.fn(),
      setSearchQuery: vi.fn(),
      setSelectedStatus: vi.fn(),
    })

    const wrapper = mountWithPlugins(GuardianManagement, {
      messages: { en: enPreschool },
      global: { stubs: baseStubs() },
    })

    await flushPromises()

    expect(wrapper.text()).toContain(enPreschool.preschoolGuardiansPage.title)
    expect(wrapper.text()).toContain(enPreschool.preschoolGuardiansPage.actions.addGuardian)
  })

  it('mounts the student guardian relationship page', async () => {
    mockStudentGuardianComposables.mockReturnValue({
      archiveRelationship: vi.fn().mockResolvedValue(true),
      closeRelationshipDialog: vi.fn(),
      emergencyContacts: ref([{ id: 1, guardianName: 'Guardian One' }]),
      errorMessage: ref(''),
      guardianOptions: ref([{ label: 'Guardian One', value: 1 }]),
      loadLookups: vi.fn().mockResolvedValue(undefined),
      loadStudentData: vi.fn().mockResolvedValue(undefined),
      loading: ref(false),
      openCreateRelationship: vi.fn(),
      openEditRelationship: vi.fn(),
      pagination: ref({ page: 1, perPage: 10, total: 1, totalPages: 1 }),
      relationshipDialogOpen: ref(false),
      relationshipForm: ref({}),
      relationshipMode: ref('create'),
      relationships: ref([{ id: 1, guardianName: 'Guardian One' }]),
      saveRelationship: vi.fn().mockResolvedValue({ guardianName: 'Guardian One' }),
      saving: ref(false),
      selectedRelationship: ref(null),
      selectedStudentId: ref('1'),
      setSelectedStudentId: vi.fn(),
      studentOptions: ref([{ label: 'Student One', value: 1 }]),
    })

    const wrapper = mountWithPlugins(StudentGuardians, {
      messages: { en: enPreschool },
      global: { stubs: baseStubs() },
    })

    await flushPromises()

    expect(wrapper.text()).toContain(enPreschool.preschoolStudentGuardiansPage.title)
    expect(wrapper.text()).toContain(enPreschool.preschoolStudentGuardiansPage.actions.linkGuardian)
  })

  it('mounts the teacher emergency contacts page', async () => {
    mockEmergencyContactComposables.mockReturnValue({
      contacts: ref([{ id: 1, guardianName: 'Guardian One' }]),
      errorMessage: ref(''),
      loadEmergencyContacts: vi.fn().mockResolvedValue(undefined),
      loadStudents: vi.fn().mockResolvedValue(undefined),
      loading: ref(false),
      selectedStudentId: ref('1'),
      setSelectedStudentId: vi.fn(),
      studentOptions: ref([{ label: 'Student One', value: 1 }]),
    })

    const wrapper = mountWithPlugins(EmergencyContacts, {
      messages: { en: enPreschool },
      global: { stubs: baseStubs() },
    })

    await flushPromises()

    expect(wrapper.text()).toContain(enPreschool.preschoolEmergencyContactsPage.title)
    expect(wrapper.text()).toContain(enPreschool.preschoolEmergencyContactsPage.actions.refresh)
  })
})
