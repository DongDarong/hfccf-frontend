import { describe, expect, it } from 'vitest'
import { mountWithPlugins } from '@/tests/helpers/mount'
import enGuardianPortal from '@/i18n/en/guardian-portal'
import GuardianPortalStatusBadge from '@/modules/guardian-portal/components/GuardianPortalStatusBadge.vue'
import GuardianStudentCard from '@/modules/guardian-portal/components/GuardianStudentCard.vue'
import GuardianPortalAccessList from '@/modules/guardian-portal/components/GuardianPortalAccessList.vue'
import GuardianPortalInviteForm from '@/modules/guardian-portal/components/GuardianPortalInviteForm.vue'

// Keep the lightweight portal components tested so localized labels and empty
// states do not drift away from the read-only guardian portal contract.
const stubs = {
  // Keep the PrimeVue stubs close to the real render contract so the portal
  // component tests catch missing localized labels instead of stub gaps.
  Card: { template: '<div><slot name="content" /><slot /></div>' },
  Button: { props: ['label'], template: '<button>{{ label }}<slot /></button>' },
  InputText: { template: '<input />' },
  Message: { template: '<div><slot /></div>' },
}

describe('guardian portal components', () => {
  it('renders localized status, empty, and action labels', () => {
    const status = mountWithPlugins(GuardianPortalStatusBadge, {
      props: { status: 'active' },
      messages: { en: enGuardianPortal },
    })

    const card = mountWithPlugins(GuardianStudentCard, {
      props: { student: { fullName: 'Student One', studentCode: 'PS-001', guardianName: 'Guardian One', guardianPhone: '012345678', status: 'active' } },
      messages: { en: enGuardianPortal },
      global: { stubs },
    })

    const list = mountWithPlugins(GuardianPortalAccessList, {
      props: { items: [], loading: false, emptyText: '' },
      messages: { en: enGuardianPortal },
      global: { stubs },
    })

    const form = mountWithPlugins(GuardianPortalInviteForm, {
      props: { modelValue: { guardianId: '', email: '' }, loading: false, errorMessage: '' },
      messages: { en: enGuardianPortal },
      global: { stubs },
    })

    expect(status.text()).toContain(enGuardianPortal.guardianPortal.common.statusLabels.active)
    expect(card.text()).toContain(enGuardianPortal.guardianPortal.common.viewChild)
    expect(list.text()).toContain(enGuardianPortal.guardianPortal.admin.emptyAccounts)
    expect(form.text()).toContain(enGuardianPortal.guardianPortal.admin.guardianIdLabel)
    expect(form.text()).toContain(enGuardianPortal.guardianPortal.admin.emailLabel)
  })
})
