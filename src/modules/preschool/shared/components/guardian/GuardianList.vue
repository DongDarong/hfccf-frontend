<script setup>
// Keep the guardian list compact and reusable so the admin page can remain a
// thin container around CRUD and archive actions.
import Button from '@/components/buttons/Button.vue'
import { useLanguage } from '@/composables/useLanguage'
import GuardianStatusBadge from './GuardianStatusBadge.vue'

defineOptions({
  name: 'GuardianList',
})

const { t } = useLanguage()

defineProps({
  guardians: {
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

const emit = defineEmits(['edit', 'archive'])
</script>

<template>
  <div class="overflow-hidden rounded-2xl border border-slate-200 bg-white">
    <div v-if="loading" class="px-4 py-6 text-sm text-slate-500">
      {{ t('preschoolGuardianShared.loading') }}
    </div>

    <div v-else-if="!guardians.length" class="px-4 py-6 text-sm text-slate-500">
      {{ emptyText || t('preschoolGuardianShared.emptyGuardians') }}
    </div>

    <table v-else class="w-full border-collapse text-left">
      <thead class="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
        <tr>
          <th class="px-4 py-3">{{ t('preschoolGuardiansPage.columns.name') }}</th>
          <th class="px-4 py-3">{{ t('preschoolGuardiansPage.columns.phone') }}</th>
          <th class="px-4 py-3">{{ t('preschoolGuardiansPage.columns.relationships') }}</th>
          <th class="px-4 py-3">{{ t('preschoolGuardiansPage.columns.status') }}</th>
          <th class="px-4 py-3 text-right">{{ t('preschoolGuardiansPage.columns.actions') }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="guardian in guardians" :key="guardian.id" class="border-t border-slate-100 align-top">
          <td class="px-4 py-4">
            <p class="font-semibold text-slate-900">{{ guardian.fullName || '-' }}</p>
            <p class="text-xs text-slate-500">{{ guardian.email || guardian.address || t('preschoolGuardianShared.labels.noDetails') }}</p>
          </td>
          <td class="px-4 py-4 text-sm text-slate-700">
            <p>{{ guardian.phone || '-' }}</p>
            <p class="text-xs text-slate-500">{{ guardian.secondaryPhone || '-' }}</p>
          </td>
          <td class="px-4 py-4 text-sm text-slate-700">
            {{ guardian.relationshipsCount ?? 0 }}
          </td>
          <td class="px-4 py-4">
            <GuardianStatusBadge :status="guardian.status" />
          </td>
          <td class="px-4 py-4">
            <div class="flex justify-end gap-2">
              <Button type="button" size="sm" variant="outline" rounded="xl" @click="emit('edit', guardian)">
                {{ t('common.edit') }}
              </Button>
              <Button type="button" size="sm" variant="danger" rounded="xl" @click="emit('archive', guardian)">
                {{ t('preschoolGuardiansPage.actions.archive') }}
              </Button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
