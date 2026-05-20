<script setup>
// Pickup permissions are a distinct contract from primary guardians so the
// classroom team can see who is allowed to collect the child.
import { computed } from 'vue'
import { useLanguage } from '@/composables/useLanguage'

defineOptions({
  name: 'PickupPermissionBadge',
})

const { t } = useLanguage()

const props = defineProps({
  canPickup: {
    type: Boolean,
    default: false,
  },
})

const label = computed(() => (props.canPickup ? t('preschoolGuardianShared.pickupPermission.allowed') : t('preschoolGuardianShared.pickupPermission.blocked')))
const classes = computed(() => (props.canPickup ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'))
</script>

<template>
  <span class="inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold" :class="classes">
    {{ label }}
  </span>
</template>
