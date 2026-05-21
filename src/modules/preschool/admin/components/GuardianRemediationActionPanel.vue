<template>
  <Card class="mb-4">
    <template #title>
      <div class="flex items-center gap-2">
        <span>{{ issue.title || t(`preschoolGuardianRemediation.issueTypes.${camelType}`) }}</span>
        <GuardianRemediationStatusBadge :severity="issueSeverity" :label="issueSeverity" />
      </div>
    </template>
    <template #content>
      <p class="text-sm text-surface-600 dark:text-surface-300 mb-4">
        {{ issue.message || t(`preschoolGuardianRemediation.issueDescriptions.${camelType}`) }}
      </p>

      <div v-if="issue.student" class="mb-3 text-sm">
        <span class="font-medium">{{ t('preschoolGuardianRemediation.labels.student') }}:</span>
        {{ issue.student.fullName }} ({{ issue.student.studentCode }})
      </div>

      <div v-if="issue.guardian" class="mb-3 text-sm">
        <span class="font-medium">{{ t('preschoolGuardianRemediation.labels.guardian') }}:</span>
        {{ issue.guardian.fullName }} — {{ issue.guardian.phone }}
      </div>

      <div v-if="issue.relationship" class="mb-3 text-sm">
        <span class="font-medium"
          >{{ t('preschoolGuardianRemediation.labels.relationship') }}:</span
        >
        ID {{ issue.relationship.id }} — {{ issue.relationship.status }} —
        {{ issue.relationship.relationshipType }}
      </div>

      <slot name="actions" />
    </template>
  </Card>
</template>

<script setup>
import Card from 'primevue/card'
import { computed } from 'vue'
import { useLanguage } from '@/composables/useLanguage'
import { ISSUE_TYPE_SEVERITY } from '@/modules/preschool/services/api/preschoolGuardianRemediationMappers'
import GuardianRemediationStatusBadge from './GuardianRemediationStatusBadge.vue'

const props = defineProps({
  issue: { type: Object, required: true },
})

const { t } = useLanguage()

const camelType = computed(() =>
  (props.issue.type ?? '').replace(/_([a-z])/g, (_, c) => c.toUpperCase()),
)

const issueSeverity = computed(() => ISSUE_TYPE_SEVERITY[props.issue.type] ?? 'info')
</script>
