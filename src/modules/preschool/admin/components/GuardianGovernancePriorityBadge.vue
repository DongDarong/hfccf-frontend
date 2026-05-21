<template>
  <Tag :value="label" :severity="primevueSeverity" />
</template>

<script setup>
import Tag from 'primevue/tag'
import { computed } from 'vue'
import { useLanguage } from '@/composables/useLanguage'
import { PRIORITY_PRIMEVUE } from '@/modules/preschool/services/api/preschoolGuardianGovernanceMappers'

const props = defineProps({
  priority: { type: String, required: true },
})

const { t } = useLanguage()

const label = computed(() => t(`preschoolGuardianGovernance.priority.${props.priority}`) || props.priority)
const primevueSeverity = computed(() => PRIORITY_PRIMEVUE[props.priority] ?? 'secondary')
</script>
