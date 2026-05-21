import { describe, expect, it } from 'vitest'
import { mountWithPlugins } from '@/tests/helpers/mount'
import enPreschool from '@/i18n/en/preschool'
import GuardianConsistencySeverityBadge from '@/modules/preschool/shared/components/guardian/GuardianConsistencySeverityBadge.vue'
import GuardianConsistencySummaryCard from '@/modules/preschool/shared/components/guardian/GuardianConsistencySummaryCard.vue'
import GuardianConsistencyIssueList from '@/modules/preschool/shared/components/guardian/GuardianConsistencyIssueList.vue'
import GuardianDuplicateWarning from '@/modules/preschool/shared/components/guardian/GuardianDuplicateWarning.vue'

// Keep the integrity leaf components covered so the duplicate and consistency
// labels stay localized and readable as the report grows.
const stubs = {
  GuardianStatusBadge: { template: '<span />' },
}

describe('preschool guardian integrity components', () => {
  it('renders severity badges and summary cards', () => {
    const badge = mountWithPlugins(GuardianConsistencySeverityBadge, {
      props: { severity: 'critical' },
      messages: { en: enPreschool },
    })
    const summary = mountWithPlugins(GuardianConsistencySummaryCard, {
      props: { title: 'Issues', value: 3, caption: 'Caption', tone: 'critical' },
      messages: { en: enPreschool },
    })

    expect(badge.text()).toContain(enPreschool.preschoolGuardianShared.integritySeverityLabels.critical)
    expect(summary.text()).toContain('Issues')
    expect(summary.text()).toContain('3')
  })

  it('renders duplicate warnings and consistency issues with localized copy', async () => {
    const duplicateWrapper = mountWithPlugins(GuardianDuplicateWarning, {
      props: {
        index: 1,
        group: {
          guardianIds: ['1', '2'],
          severity: 'warning',
          signals: ['same_phone', 'same_name_phone'],
          guardians: [
            { id: 1, fullName: 'Guardian One', phone: '012345678', status: 'active', relationshipsCount: 1, activeRelationshipsCount: 1 },
            { id: 2, fullName: 'Guardian Two', phone: '012345678', status: 'active', relationshipsCount: 2, activeRelationshipsCount: 1 },
          ],
        },
      },
      messages: { en: enPreschool },
      global: { stubs },
    })

    const issueWrapper = mountWithPlugins(GuardianConsistencyIssueList, {
      props: {
        issues: [
          {
            id: 'issue-1',
            type: 'student_no_active_guardian',
            severity: 'critical',
            student: { fullName: 'Student One', studentCode: 'PS-1', guardianSource: 'legacy' },
            guardian: null,
            relationship: null,
            difference: { guardianName: { legacy: 'Legacy', normalized: 'Normalized' } },
            preferredGuardian: null,
          },
          {
            id: 'issue-2',
            type: 'pickup_permission_issue',
            severity: 'warning',
            student: { fullName: 'Student Two', studentCode: 'PS-2', guardianSource: 'normalized' },
            guardian: null,
            relationship: {
              relationshipType: 'guardian',
              isPrimary: false,
              canPickup: false,
            },
            difference: null,
            preferredGuardian: null,
          },
        ],
        loading: false,
        emptyText: enPreschool.preschoolGuardianIntegrityPage.emptyIssues,
      },
      messages: { en: enPreschool },
      global: { stubs },
    })

    expect(duplicateWrapper.text()).toContain(enPreschool.preschoolGuardianIntegrityPage.duplicateGroup.heading)
    expect(duplicateWrapper.text()).toContain(enPreschool.preschoolGuardianIntegrityPage.signalLabels.samePhone)
    expect(issueWrapper.text()).toContain(enPreschool.preschoolGuardianIntegrityPage.issueTypes.studentNoActiveGuardian)
    expect(issueWrapper.text()).toContain(enPreschool.preschoolGuardianIntegrityPage.issueDescriptions.studentNoActiveGuardian)
    expect(issueWrapper.text()).toContain(enPreschool.preschoolGuardianIntegrityPage.issueTypes.pickupPermissionIssue)
    expect(issueWrapper.text()).toContain(enPreschool.preschoolGuardianIntegrityPage.issueDescriptions.pickupPermissionIssue)
  })
})
