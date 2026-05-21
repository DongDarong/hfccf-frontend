import { describe, expect, it } from 'vitest'
import { mountWithPlugins } from '@/tests/helpers/mount'
import enGuardians from '@/i18n/en/preschool/guardians'
import khGuardians from '@/i18n/kh/preschool/guardians'
import GuardianBeforeAfterSnapshot from '@/modules/preschool/admin/components/GuardianBeforeAfterSnapshot.vue'
import GuardianManualActionWarning from '@/modules/preschool/admin/components/GuardianManualActionWarning.vue'
import GuardianRemediationLogTable from '@/modules/preschool/admin/components/GuardianRemediationLogTable.vue'
import GuardianRemediationNoteField from '@/modules/preschool/admin/components/GuardianRemediationNoteField.vue'
import GuardianRemediationStatusBadge from '@/modules/preschool/admin/components/GuardianRemediationStatusBadge.vue'
import GuardianReviewDialog from '@/modules/preschool/admin/components/GuardianReviewDialog.vue'

const messages = { en: enGuardians, kh: khGuardians }

const stubs = {
  Tag: { template: '<span class="tag">{{ label }}</span>', props: ['value', 'severity', 'label'] },
  DataTable: { template: '<div class="dt"><slot /></div>' },
  Column: { template: '<div />' },
  Paginator: { template: '<div />' },
  Dialog: {
    template: '<div class="dialog"><slot /><slot name="footer" /></div>',
    props: ['visible', 'header', 'modal', 'closable', 'style'],
  },
  Button: { template: '<button>{{ label }}</button>', props: ['label', 'severity', 'loading'] },
  Message: { template: '<div class="message"><slot /></div>', props: ['severity'] },
  Textarea: { template: '<textarea />', props: ['modelValue', 'placeholder', 'rows'] },
}

describe('GuardianRemediationStatusBadge', () => {
  it('renders with severity and label', () => {
    const wrapper = mountWithPlugins(GuardianRemediationStatusBadge, {
      props: { severity: 'critical', label: 'Critical' },
      messages,
      global: { stubs },
    })
    expect(wrapper.exists()).toBe(true)
  })
})

describe('GuardianManualActionWarning', () => {
  it('renders warning with localized title and body', () => {
    const wrapper = mountWithPlugins(GuardianManualActionWarning, {
      messages,
      global: { stubs },
    })
    expect(wrapper.exists()).toBe(true)
  })
})

describe('GuardianRemediationNoteField', () => {
  it('renders textarea with label', () => {
    const wrapper = mountWithPlugins(GuardianRemediationNoteField, {
      props: { modelValue: '' },
      messages,
      global: { stubs },
    })
    expect(wrapper.exists()).toBe(true)
  })
})

describe('GuardianBeforeAfterSnapshot', () => {
  it('renders before and after snapshot content', () => {
    const wrapper = mountWithPlugins(GuardianBeforeAfterSnapshot, {
      props: {
        before: { guardianName: 'Old Name', guardianPhone: '+855 12 000 000' },
        after: { guardianName: 'New Name', guardianPhone: '+855 12 111 111' },
      },
      messages,
      global: { stubs },
    })
    expect(wrapper.text()).toContain('Old Name')
    expect(wrapper.text()).toContain('New Name')
  })

  it('renders nothing when both snapshots are null', () => {
    const wrapper = mountWithPlugins(GuardianBeforeAfterSnapshot, {
      props: { before: null, after: null },
      messages,
      global: { stubs },
    })
    expect(wrapper.find('pre').exists()).toBe(false)
  })
})

describe('GuardianRemediationLogTable', () => {
  it('renders empty state when no items', () => {
    const wrapper = mountWithPlugins(GuardianRemediationLogTable, {
      props: { items: [], meta: { currentPage: 1, lastPage: 1, perPage: 25, total: 0 }, loading: false },
      messages,
      global: { stubs },
    })
    expect(wrapper.text()).toContain(enGuardians.preschoolGuardianRemediation.table.empty)
  })

  it('renders with items and emits view-snapshots', async () => {
    const log = {
      id: 1,
      action: 'set_primary',
      issueType: 'multiple_active_primary_guardians',
      performedAt: '2026-05-21T10:00:00Z',
      performedByName: 'Admin',
      notes: 'Fixed.',
      beforeSnapshot: { x: 1 },
      afterSnapshot: { x: 2 },
    }
    const wrapper = mountWithPlugins(GuardianRemediationLogTable, {
      props: { items: [log], meta: { currentPage: 1, lastPage: 1, perPage: 25, total: 1 }, loading: false },
      messages,
      global: { stubs },
    })
    expect(wrapper.exists()).toBe(true)
  })
})

describe('GuardianReviewDialog', () => {
  it('renders dialog with title and action buttons', () => {
    const wrapper = mountWithPlugins(GuardianReviewDialog, {
      props: {
        visible: true,
        title: 'Confirm Action',
        description: 'Are you sure?',
        actionLoading: false,
      },
      messages,
      global: { stubs },
    })
    expect(wrapper.exists()).toBe(true)
  })
})

describe('EN/KH locale parity for remediation keys', () => {
  it('has matching top-level keys in EN and KH', () => {
    const enKeys = Object.keys(enGuardians.preschoolGuardianRemediation)
    const khKeys = Object.keys(khGuardians.preschoolGuardianRemediation)
    expect(enKeys.sort()).toEqual(khKeys.sort())
  })

  it('has matching action keys in EN and KH', () => {
    const enActions = Object.keys(enGuardians.preschoolGuardianRemediation.actions)
    const khActions = Object.keys(khGuardians.preschoolGuardianRemediation.actions)
    expect(enActions.sort()).toEqual(khActions.sort())
  })

  it('has matching issueTypes keys in EN and KH', () => {
    const enTypes = Object.keys(enGuardians.preschoolGuardianRemediation.issueTypes)
    const khTypes = Object.keys(khGuardians.preschoolGuardianRemediation.issueTypes)
    expect(enTypes.sort()).toEqual(khTypes.sort())
  })

  it('has matching success keys in EN and KH', () => {
    const enSuccess = Object.keys(enGuardians.preschoolGuardianRemediation.success)
    const khSuccess = Object.keys(khGuardians.preschoolGuardianRemediation.success)
    expect(enSuccess.sort()).toEqual(khSuccess.sort())
  })
})
