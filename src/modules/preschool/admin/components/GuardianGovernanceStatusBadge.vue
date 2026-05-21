<template>
  <Tag :value="label" :severity="primevueSeverity" />
</template>

<script setup>
import Tag from 'primevue/tag'
import { computed } from 'vue'
import { useLanguage } from '@/composables/useLanguage'
import { STATUS_PRIMEVUE } from '@/modules/preschool/services/api/preschoolGuardianGovernanceMappers'

const props = defineProps({
  status: { type: String, required: true },
})

const { t } = useLanguage()

const statusKey = computed(() => props.status.replace(/_([a-z])/g, (_, c) => c.toUpperCase()))
const label = computed(() => t(`preschoolGuardianGovernance.status.${statusKey.value}`) || props.status)
const primevueSeverity = computed(() => STATUS_PRIMEVUE[props.status] ?? 'secondary')
</script>
