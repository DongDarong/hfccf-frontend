<script setup>
// Keep student-guardian relationship history visible so the admin page can
// distinguish primary, pickup, and archived links at a glance.
import Button from '@/components/buttons/Button.vue'
import { useLanguage } from '@/composables/useLanguage'
import GuardianStatusBadge from './GuardianStatusBadge.vue'
import PickupPermissionBadge from './PickupPermissionBadge.vue'
import PrimaryGuardianBadge from './PrimaryGuardianBadge.vue'

defineOptions({
  name: 'StudentGuardianList',
})

const { t } = useLanguage()

defineProps({
  relationships: {
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

const emit = defineEmits(['edit', 'archive', 'set-primary', 'restore'])
</script>

<template>
  <div class="overflow-hidden rounded-2xl border border-slate-200 bg-white">
    <div v-if="loading" class="px-4 py-6 text-sm text-slate-500">
      {{ t('preschoolGuardianShared.loading') }}
    </div>

    <div v-else-if="!relationships.length" class="px-4 py-6 text-sm text-slate-500">
      {{ emptyText || t('preschoolStudentGuardiansPage.empty') }}
    </div>

    <table v-else class="w-full border-collapse text-left">
      <thead class="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
        <tr>
          <th class="px-4 py-3">{{ t('preschoolStudentGuardiansPage.columns.guardian') }}</th>
          <th class="px-4 py-3">{{ t('preschoolStudentGuardiansPage.columns.relationship') }}</th>
          <th class="px-4 py-3">{{ t('preschoolStudentGuardiansPage.columns.flags') }}</th>
          <th class="px-4 py-3">{{ t('preschoolStudentGuardiansPage.columns.priority') }}</th>
          <th class="px-4 py-3">{{ t('preschoolStudentGuardiansPage.columns.status') }}</th>
          <th class="px-4 py-3 text-right">{{ t('preschoolStudentGuardiansPage.columns.actions') }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="relationship in relationships" :key="relationship.id" class="border-t border-slate-100 align-top">
          <td class="px-4 py-4">
            <p class="font-semibold text-slate-900">{{ relationship.guardianName || '-' }}</p>
            <p class="text-xs text-slate-500">{{ relationship.guardianPhone || '-' }}</p>
          </td>
          <td class="px-4 py-4 text-sm text-slate-700">
            {{ t(`preschoolGuardianShared.relationshipTypes.${relationship.relationshipType || 'other'}`) }}
          </td>
          <td class="px-4 py-4">
            <div class="flex flex-wrap gap-2">
              <PrimaryGuardianBadge :is-primary="relationship.isPrimary" />
              <PickupPermissionBadge :can-pickup="relationship.canPickup" />
            </div>
          </td>
          <td class="px-4 py-4 text-sm text-slate-700">
            {{ relationship.emergencyPriority ?? '-' }}
          </td>
          <td class="px-4 py-4">
            <GuardianStatusBadge :status="relationship.status" />
          </td>
          <td class="px-4 py-4">
            <div class="flex justify-end gap-2">
              <Button
                v-if="relationship.status === 'active' && !relationship.isPrimary"
                type="button"
                size="sm"
                variant="outline"
                rounded="xl"
                @click="emit('set-primary', relationship)"
              >
                {{ t('preschoolStudentGuardiansPage.actions.setPrimary') }}
              </Button>
              <Button
                v-if="relationship.status === 'archived'"
                type="button"
                size="sm"
                variant="outline"
                rounded="xl"
                @click="emit('restore', relationship)"
              >
                {{ t('preschoolStudentGuardiansPage.actions.restore') }}
              </Button>
              <Button v-if="relationship.status !== 'archived'" type="button" size="sm" variant="outline" rounded="xl" @click="emit('edit', relationship)">
                {{ t('common.edit') }}
              </Button>
              <Button v-if="relationship.status !== 'archived'" type="button" size="sm" variant="danger" rounded="xl" @click="emit('archive', relationship)">
                {{ t('preschoolStudentGuardiansPage.actions.archive') }}
              </Button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
