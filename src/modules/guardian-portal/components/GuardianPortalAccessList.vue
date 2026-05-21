<script setup>
// Keep the admin access list isolated so invitation and revocation stay in a
// single reusable list with localized empty/loading copy.
import Button from 'primevue/button'
import Card from 'primevue/card'
import { useLanguage } from '@/composables/useLanguage'
import GuardianPortalStatusBadge from './GuardianPortalStatusBadge.vue'

defineOptions({
  name: 'GuardianPortalAccessList',
})

const { t } = useLanguage()

defineProps({
  items: {
    type: Array,
    default: () => [],
  },
  loading: {
    type: Boolean,
    default: false,
  },
  revokeLabel: {
    type: String,
    default: '',
  },
  emptyText: {
    type: String,
    default: '',
  },
})

defineEmits(['revoke'])
</script>

<template>
  <Card class="border-slate-200 shadow-sm">
    <template #content>
      <div class="grid gap-4">
        <div v-if="loading" class="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-5 text-sm text-slate-500">
          {{ t('guardianPortal.common.loading') }}
        </div>

        <div v-else-if="!items.length" class="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-5 text-sm text-slate-500">
          {{ emptyText || t('guardianPortal.admin.emptyAccounts') }}
        </div>

        <div
          v-for="item in items"
          :key="item.id"
          class="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 px-4 py-3"
        >
          <div class="grid gap-1">
            <p class="font-bold text-slate-950">{{ item.email || t('guardianPortal.common.emptyValue') }}</p>
            <p class="text-sm text-slate-500">{{ item.guardian?.fullName || t('guardianPortal.common.emptyValue') }}</p>
          </div>

          <div class="flex items-center gap-3">
            <GuardianPortalStatusBadge :status="item.status" />
            <Button
              severity="danger"
              size="small"
              outlined
              :label="revokeLabel || t('guardianPortal.admin.revokeAction')"
              :loading="loading"
              @click="$emit('revoke', item)"
            />
          </div>
        </div>
      </div>
    </template>
  </Card>
</template>
