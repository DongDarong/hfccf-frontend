<script setup>
// Keep the teacher emergency-contact view read-only so assigned student
// contacts stay obvious without exposing edit/archive affordances.
import { useLanguage } from '@/composables/useLanguage'
import GuardianStatusBadge from './GuardianStatusBadge.vue'
import PickupPermissionBadge from './PickupPermissionBadge.vue'
import PrimaryGuardianBadge from './PrimaryGuardianBadge.vue'

defineOptions({
  name: 'EmergencyContactList',
})

const { t } = useLanguage()

defineProps({
  contacts: {
    type: Array,
    default: () => [],
  },
  loading: {
    type: Boolean,
    default: false,
  },
  emptyText: {
    type: String,
    default: '',
  },
})
</script>

<template>
  <div class="grid gap-3">
    <div v-if="loading" class="rounded-2xl border border-slate-200 bg-white px-4 py-6 text-sm text-slate-500">
      {{ t('preschoolGuardianShared.loading') }}
    </div>

    <div v-else-if="!contacts.length" class="rounded-2xl border border-slate-200 bg-white px-4 py-6 text-sm text-slate-500">
      {{ emptyText || t('preschoolEmergencyContactsPage.empty') }}
    </div>

    <article v-for="contact in contacts" :key="contact.id" class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div class="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 class="text-base font-semibold text-slate-900">{{ contact.guardianName || '-' }}</h3>
          <p class="mt-1 text-sm text-slate-600">{{ contact.guardianPhone || '-' }}</p>
          <p class="mt-1 text-xs text-slate-500">{{ contact.guardianEmail || contact.guardianSecondaryPhone || '' }}</p>
        </div>
        <GuardianStatusBadge :status="contact.status" />
      </div>

      <div class="mt-3 flex flex-wrap gap-2">
        <PrimaryGuardianBadge :is-primary="contact.isPrimary" />
        <PickupPermissionBadge :can-pickup="contact.canPickup" />
      </div>

      <dl class="mt-4 grid gap-2 text-sm text-slate-700 sm:grid-cols-3">
        <div>
          <dt class="text-xs uppercase tracking-wide text-slate-500">{{ t('preschoolEmergencyContactsPage.relationship') }}</dt>
          <dd class="mt-1">{{ t(`preschoolGuardianShared.relationshipTypes.${contact.relationshipType || 'other'}`) }}</dd>
        </div>
        <div>
          <dt class="text-xs uppercase tracking-wide text-slate-500">{{ t('preschoolEmergencyContactsPage.priority') }}</dt>
          <dd class="mt-1">{{ contact.emergencyPriority ?? '-' }}</dd>
        </div>
        <div>
          <dt class="text-xs uppercase tracking-wide text-slate-500">{{ t('preschoolEmergencyContactsPage.notes') }}</dt>
          <dd class="mt-1">{{ contact.notes || '-' }}</dd>
        </div>
      </dl>
    </article>
  </div>
</template>
