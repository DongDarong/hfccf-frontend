import { describe, expect, it } from 'vitest'
import { mountWithPlugins } from '@/tests/helpers/mount'
import enPreschool from '@/i18n/en/preschool'
import GuardianForm from '@/modules/preschool/shared/components/guardian/GuardianForm.vue'
import StudentGuardianRelationshipForm from '@/modules/preschool/shared/components/guardian/StudentGuardianRelationshipForm.vue'
import GuardianList from '@/modules/preschool/shared/components/guardian/GuardianList.vue'
import StudentGuardianList from '@/modules/preschool/shared/components/guardian/StudentGuardianList.vue'
import EmergencyContactList from '@/modules/preschool/shared/components/guardian/EmergencyContactList.vue'
import PrimaryGuardianBadge from '@/modules/preschool/shared/components/guardian/PrimaryGuardianBadge.vue'
import PickupPermissionBadge from '@/modules/preschool/shared/components/guardian/PickupPermissionBadge.vue'
import GuardianStatusBadge from '@/modules/preschool/shared/components/guardian/GuardianStatusBadge.vue'

// Keep guardian leaf components covered so the form and badge contracts do not
// drift away from the localized relationship data shape.
const stubs = {
  Button: { template: '<button><slot /></button>' },
}

describe('preschool guardian components', () => {
  it('emits save/cancel from the guardian form', async () => {
    const form = {
      full_name: 'Guardian One',
      phone: '012345678',
      secondary_phone: '',
      email: '',
      address: '',
      occupation: '',
      national_id: '',
      status: 'active',
      notes: '',
    }

    const wrapper = mountWithPlugins(GuardianForm, {
      props: {
        form,
        mode: 'create',
        saving: false,
      },
      messages: { en: enPreschool },
      global: { stubs },
    })

    await wrapper.findAll('button')[1].trigger('click')
    await wrapper.findAll('button')[0].trigger('click')

    expect(wrapper.emitted().cancel).toBeTruthy()
    expect(wrapper.emitted().save).toBeTruthy()
  })

  it('renders relationship and emergency-contact copy with localized badges', async () => {
    const relationshipWrapper = mountWithPlugins(StudentGuardianRelationshipForm, {
      props: {
        form: {
          guardian_id: 11,
          relationship_type: 'mother',
          is_primary: true,
          can_pickup: true,
          emergency_priority: 1,
          status: 'active',
          starts_at: '',
          ends_at: '',
          notes: '',
        },
        guardianOptions: [{ label: 'Guardian One', value: 11 }],
        mode: 'create',
        saving: false,
      },
      messages: { en: enPreschool },
      global: { stubs },
    })

    const contactWrapper = mountWithPlugins(EmergencyContactList, {
      props: {
        contacts: [
          {
            id: 1,
            guardianName: 'Guardian One',
            guardianPhone: '012345678',
            relationshipType: 'guardian',
            isPrimary: true,
            canPickup: true,
            emergencyPriority: 1,
            status: 'active',
          },
        ],
        loading: false,
        emptyText: '',
      },
      messages: { en: enPreschool },
    })

    expect(relationshipWrapper.text()).toContain(enPreschool.preschoolGuardianShared.relationshipTypes.mother)
    expect(relationshipWrapper.text()).toContain(enPreschool.preschoolGuardianShared.primaryGuardian.primary)
    expect(contactWrapper.text()).toContain('Guardian One')
    expect(contactWrapper.text()).toContain(enPreschool.preschoolGuardianShared.primaryGuardian.primary)
    expect(contactWrapper.text()).toContain(enPreschool.preschoolGuardianShared.pickupPermission.allowed)
  })

  it('renders status and pickup badges independently', async () => {
    const statusWrapper = mountWithPlugins(GuardianStatusBadge, {
      props: { status: 'archived' },
      messages: { en: enPreschool },
    })
    const primaryWrapper = mountWithPlugins(PrimaryGuardianBadge, {
      props: { isPrimary: true },
      messages: { en: enPreschool },
    })
    const pickupWrapper = mountWithPlugins(PickupPermissionBadge, {
      props: { canPickup: false },
      messages: { en: enPreschool },
    })

    expect(statusWrapper.text()).toContain(enPreschool.preschoolGuardianShared.statusLabels.archived)
    expect(primaryWrapper.text()).toContain(enPreschool.preschoolGuardianShared.primaryGuardian.primary)
    expect(pickupWrapper.text()).toContain(enPreschool.preschoolGuardianShared.pickupPermission.blocked)
  })

  it('renders guardian list and relationship actions for staff review', async () => {
    const guardianWrapper = mountWithPlugins(GuardianList, {
      props: {
        guardians: [
          {
            id: 1,
            fullName: 'Guardian One',
            phone: '012345678',
            status: 'active',
            relationshipsCount: 2,
          },
        ],
        loading: false,
        emptyText: '',
      },
      messages: { en: enPreschool },
      global: { stubs },
    })

    const relationshipWrapper = mountWithPlugins(StudentGuardianList, {
      props: {
        relationships: [
          {
            id: 1,
            guardianName: 'Guardian One',
            guardianPhone: '012345678',
            relationshipType: 'guardian',
            isPrimary: false,
            canPickup: true,
            emergencyPriority: 1,
            status: 'active',
          },
          {
            id: 2,
            guardianName: 'Guardian Two',
            guardianPhone: '012345679',
            relationshipType: 'mother',
            isPrimary: false,
            canPickup: false,
            emergencyPriority: 2,
            status: 'archived',
          },
        ],
        loading: false,
        emptyText: '',
      },
      messages: { en: enPreschool },
      global: { stubs },
    })

    expect(guardianWrapper.text()).toContain(enPreschool.preschoolGuardiansPage.actions.viewDetails)
    expect(relationshipWrapper.text()).toContain(enPreschool.preschoolStudentGuardiansPage.actions.setPrimary)
    expect(relationshipWrapper.text()).toContain(enPreschool.preschoolStudentGuardiansPage.actions.restore)
  })
})
