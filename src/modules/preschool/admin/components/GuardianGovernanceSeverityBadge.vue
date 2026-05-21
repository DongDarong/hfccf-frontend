<template>
  <Tag :value="label" :severity="primevueSeverity" />
</template>

<script setup>
import Tag from 'primevue/tag'
import { computed } from 'vue'
import { useLanguage } from '@/composables/useLanguage'
import { SEVERITY_PRIMEVUE } from '@/modules/preschool/services/api/preschoolGuardianGovernanceMappers'

const props = defineProps({
  severity: { type: String, required: true },
})

const { t } = useLanguage()

const label = computed(() => t(`preschoolGuardianGovernance.severity.${props.severity}`) || props.severity)
const primevueSeverity = computed(() => SEVERITY_PRIMEVUE[props.severity] ?? 'secondary')
</script>
