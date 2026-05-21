import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ref } from 'vue'
import { flushPromises } from '@vue/test-utils'
import { mountWithPlugins } from '@/tests/helpers/mount'
import enPreschool from '@/i18n/en/preschool'
import GuardianConsistencyReport from '@/modules/preschool/admin/pages/GuardianConsistencyReport.vue'

// Keep the guardian integrity page mount-tested so staff can review duplicate
// data without the screen silently regressing back to a placeholder shell.
const mockIntegrityComposable = vi.fn()

vi.mock('@/modules/preschool/composables/usePreschoolGuardianIntegrity', () => ({
  usePreschoolGuardianIntegrity: () => mockIntegrityComposable(),
}))

beforeEach(() => {
  vi.clearAllMocks()
})

function stubs() {
  return {
    MainLayout: { template: '<div><slot /></div>' },
    HeaderSection: { props: ['title', 'subtitle'], template: '<header><h1>{{ title }}</h1><p>{{ subtitle }}</p></header>' },
    Button: { template: '<button><slot /></button>' },
    GuardianConsistencySummaryCard: { template: '<div><slot /></div>' },
    GuardianConsistencyIssueList: { template: '<div><slot /></div>' },
    GuardianDuplicateWarning: { template: '<div><slot /></div>' },
  }
}

describe('preschool guardian integrity pages', () => {
  it('mounts the guardian consistency report page', async () => {
    mockIntegrityComposable.mockReturnValue({
      duplicates: ref({
        summary: { candidateGroups: 1, matchedGuardians: 2, strongSignalGroups: 1, reviewRecommended: true },
        items: [{ guardianIds: ['1', '2'], signals: ['same_phone'], severity: 'warning' }],
      }),
      errorMessage: ref(''),
      loadIntegrityData: vi.fn().mockResolvedValue(undefined),
      loading: ref(false),
      refreshIntegrityData: vi.fn().mockResolvedValue(undefined),
      report: ref({
        summary: {
          studentsWithoutActiveGuardian: 1,
          multiplePrimaryGuardianStudents: 1,
          guardiansWithoutStudents: 1,
          pickupPermissionIssues: 1,
          archivedPrimaryRelationships: 1,
          inactiveEmergencyContacts: 1,
          legacyMismatches: 1,
          criticalCount: 1,
          warningCount: 2,
          infoCount: 0,
          issueCount: 4,
        },
        items: [{ id: 'issue-1', type: 'student_no_active_guardian', severity: 'critical', title: 'x', message: 'y' }],
      }),
    })

    const wrapper = mountWithPlugins(GuardianConsistencyReport, {
      messages: { en: enPreschool },
      global: { stubs: stubs() },
    })

    await flushPromises()

    expect(wrapper.text()).toContain(enPreschool.preschoolGuardianIntegrityPage.title)
    expect(wrapper.text()).toContain(enPreschool.preschoolGuardianIntegrityPage.sections.duplicates)
    expect(wrapper.text()).toContain(enPreschool.preschoolGuardianIntegrityPage.sections.issues)
  })
})
