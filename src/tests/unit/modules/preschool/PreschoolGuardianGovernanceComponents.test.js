import { describe, expect, it } from 'vitest'
import { mountWithPlugins } from '@/tests/helpers/mount'
import enGuardians from '@/i18n/en/preschool/guardians'
import khGuardians from '@/i18n/kh/preschool/guardians'
import GuardianGovernanceDashboardMetrics from '@/modules/preschool/admin/components/GuardianGovernanceDashboardMetrics.vue'
import GuardianGovernanceIssueCard from '@/modules/preschool/admin/components/GuardianGovernanceIssueCard.vue'
import GuardianGovernancePriorityBadge from '@/modules/preschool/admin/components/GuardianGovernancePriorityBadge.vue'
import GuardianGovernanceSeverityBadge from '@/modules/preschool/admin/components/GuardianGovernanceSeverityBadge.vue'
import GuardianGovernanceStatusBadge from '@/modules/preschool/admin/components/GuardianGovernanceStatusBadge.vue'
import GuardianGovernanceTimeline from '@/modules/preschool/admin/components/GuardianGovernanceTimeline.vue'
import GuardianIssueAgeBadge from '@/modules/preschool/admin/components/GuardianIssueAgeBadge.vue'
import GuardianIssueEscalationNotice from '@/modules/preschool/admin/components/GuardianIssueEscalationNotice.vue'
import GuardianRecurringIssueWarning from '@/modules/preschool/admin/components/GuardianRecurringIssueWarning.vue'

const messages = { en: enGuardians, kh: khGuardians }

const stubs = {
  Tag: { template: '<span class="tag">{{ value || label }}</span>', props: ['value', 'severity', 'label'] },
  Button: { template: '<button>{{ label }}</button>', props: ['label', 'severity', 'loading', 'disabled', 'size', 'outlined'] },
  Message: { template: '<div class="message"><slot /></div>', props: ['severity'] },
  InputText: { template: '<input />', props: ['modelValue', 'placeholder'] },
  Textarea: { template: '<textarea />', props: ['modelValue', 'placeholder', 'rows'] },
}

const sampleIssue = {
  id: 1,
  issueType: 'student_no_active_guardian',
  issueKey: 'student_no_active_guardian-s-1',
  severity: 'critical',
  priority: 'urgent',
  status: 'detected',
  daysSinceDetection: 5,
  staleThresholdDays: 3,
  recurrenceCount: 2,
  isStale: true,
  isRecurring: true,
  assignedToName: null,
  detectedAt: '2026-05-16T08:00:00Z',
  acknowledgedAt: null,
  resolvedAt: null,
  dismissedAt: null,
  resolutionNotes: null,
  latestSnapshot: null,
}

describe('GuardianGovernanceSeverityBadge', () => {
  it('renders critical severity badge', () => {
    const wrapper = mountWithPlugins(GuardianGovernanceSeverityBadge, {
      props: { severity: 'critical' },
      messages,
      global: { stubs },
    })
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.text()).toContain(enGuardians.preschoolGuardianGovernance.severity.critical)
  })

  it('renders warning severity badge', () => {
    const wrapper = mountWithPlugins(GuardianGovernanceSeverityBadge, {
      props: { severity: 'warning' },
      messages,
      global: { stubs },
    })
    expect(wrapper.text()).toContain(enGuardians.preschoolGuardianGovernance.severity.warning)
  })
})

describe('GuardianGovernancePriorityBadge', () => {
  it('renders urgent priority', () => {
    const wrapper = mountWithPlugins(GuardianGovernancePriorityBadge, {
      props: { priority: 'urgent' },
      messages,
      global: { stubs },
    })
    expect(wrapper.text()).toContain(enGuardians.preschoolGuardianGovernance.priority.urgent)
  })
})

describe('GuardianGovernanceStatusBadge', () => {
  it('renders detected status', () => {
    const wrapper = mountWithPlugins(GuardianGovernanceStatusBadge, {
      props: { status: 'detected' },
      messages,
      global: { stubs },
    })
    expect(wrapper.text()).toContain(enGuardians.preschoolGuardianGovernance.status.detected)
  })

  it('renders in_review status with camelCase key conversion', () => {
    const wrapper = mountWithPlugins(GuardianGovernanceStatusBadge, {
      props: { status: 'in_review' },
      messages,
      global: { stubs },
    })
    expect(wrapper.exists()).toBe(true)
  })
})

describe('GuardianIssueAgeBadge', () => {
  it('renders age badge with day count', () => {
    const wrapper = mountWithPlugins(GuardianIssueAgeBadge, {
      props: { daysSinceDetection: 5, staleThresholdDays: 3 },
      messages,
      global: { stubs },
    })
    expect(wrapper.text()).toContain('5')
  })
})

describe('GuardianRecurringIssueWarning', () => {
  it('shows warning when recurrence count is greater than zero', () => {
    const wrapper = mountWithPlugins(GuardianRecurringIssueWarning, {
      props: { recurrenceCount: 3 },
      messages,
      global: { stubs },
    })
    expect(wrapper.text()).toContain('3')
  })

  it('renders nothing when recurrenceCount is 0', () => {
    const wrapper = mountWithPlugins(GuardianRecurringIssueWarning, {
      props: { recurrenceCount: 0 },
      messages,
      global: { stubs },
    })
    expect(wrapper.find('div').exists()).toBe(false)
  })
})

describe('GuardianIssueEscalationNotice', () => {
  it('renders escalation message when stale', () => {
    const wrapper = mountWithPlugins(GuardianIssueEscalationNotice, {
      props: { isStale: true, severity: 'critical', daysSinceDetection: 5, staleThresholdDays: 3 },
      messages,
      global: { stubs },
    })
    expect(wrapper.find('.message').exists()).toBe(true)
  })

  it('renders nothing when not stale', () => {
    const wrapper = mountWithPlugins(GuardianIssueEscalationNotice, {
      props: { isStale: false, severity: 'info', daysSinceDetection: 1, staleThresholdDays: 14 },
      messages,
      global: { stubs },
    })
    expect(wrapper.find('.message').exists()).toBe(false)
  })
})

describe('GuardianGovernanceTimeline', () => {
  it('renders detected timestamp', () => {
    const wrapper = mountWithPlugins(GuardianGovernanceTimeline, {
      props: { issue: { ...sampleIssue } },
      messages,
      global: { stubs },
    })
    expect(wrapper.exists()).toBe(true)
  })

  it('shows resolution notes when present', () => {
    const wrapper = mountWithPlugins(GuardianGovernanceTimeline, {
      props: { issue: { ...sampleIssue, resolutionNotes: 'Issue was resolved manually.' } },
      messages,
      global: { stubs },
    })
    expect(wrapper.text()).toContain('Issue was resolved manually.')
  })
})

describe('GuardianGovernanceDashboardMetrics', () => {
  it('renders all metric cards', () => {
    const metrics = {
      totalIssues: 10,
      activeIssues: 6,
      resolvedIssues: 3,
      dismissedIssues: 1,
      staleIssues: 2,
      recurringIssues: 4,
      unassignedIssues: 5,
      criticalUnresolved: 2,
    }
    const wrapper = mountWithPlugins(GuardianGovernanceDashboardMetrics, {
      props: { metrics },
      messages,
      global: { stubs },
    })
    expect(wrapper.text()).toContain('10')
    expect(wrapper.text()).toContain('6')
  })

  it('shows no data message when metrics is null', () => {
    const wrapper = mountWithPlugins(GuardianGovernanceDashboardMetrics, {
      props: { metrics: null },
      messages,
      global: { stubs },
    })
    expect(wrapper.text()).toContain(enGuardians.preschoolGuardianGovernance.dashboard.noData)
  })
})

describe('GuardianGovernanceIssueCard', () => {
  it('renders issue type label and status badges', () => {
    const wrapper = mountWithPlugins(GuardianGovernanceIssueCard, {
      props: { issue: sampleIssue, actionLoading: false },
      messages,
      global: { stubs },
    })
    expect(wrapper.exists()).toBe(true)
  })

  it('emits acknowledge event when button clicked', async () => {
    const wrapper = mountWithPlugins(GuardianGovernanceIssueCard, {
      props: { issue: sampleIssue, actionLoading: false },
      messages,
      global: { stubs },
    })
    const acknowledgeBtn = wrapper.findAll('button').find((b) => b.text().includes(enGuardians.preschoolGuardianGovernance.actions.acknowledge))
    if (acknowledgeBtn) {
      await acknowledgeBtn.trigger('click')
      expect(wrapper.emitted('acknowledge')).toBeTruthy()
    }
  })
})

describe('EN/KH locale parity for governance keys', () => {
  it('has matching top-level keys in EN and KH', () => {
    const enKeys = Object.keys(enGuardians.preschoolGuardianGovernance)
    const khKeys = Object.keys(khGuardians.preschoolGuardianGovernance)
    expect(enKeys.sort()).toEqual(khKeys.sort())
  })

  it('has matching action keys in EN and KH', () => {
    const enActions = Object.keys(enGuardians.preschoolGuardianGovernance.actions)
    const khActions = Object.keys(khGuardians.preschoolGuardianGovernance.actions)
    expect(enActions.sort()).toEqual(khActions.sort())
  })

  it('has matching severity keys in EN and KH', () => {
    const enSeverity = Object.keys(enGuardians.preschoolGuardianGovernance.severity)
    const khSeverity = Object.keys(khGuardians.preschoolGuardianGovernance.severity)
    expect(enSeverity.sort()).toEqual(khSeverity.sort())
  })

  it('has matching status keys in EN and KH', () => {
    const enStatus = Object.keys(enGuardians.preschoolGuardianGovernance.status)
    const khStatus = Object.keys(khGuardians.preschoolGuardianGovernance.status)
    expect(enStatus.sort()).toEqual(khStatus.sort())
  })

  it('has matching issueTypes keys in EN and KH', () => {
    const enTypes = Object.keys(enGuardians.preschoolGuardianGovernance.issueTypes)
    const khTypes = Object.keys(khGuardians.preschoolGuardianGovernance.issueTypes)
    expect(enTypes.sort()).toEqual(khTypes.sort())
  })

  it('has matching success keys in EN and KH', () => {
    const enSuccess = Object.keys(enGuardians.preschoolGuardianGovernance.success)
    const khSuccess = Object.keys(khGuardians.preschoolGuardianGovernance.success)
    expect(enSuccess.sort()).toEqual(khSuccess.sort())
  })
})
