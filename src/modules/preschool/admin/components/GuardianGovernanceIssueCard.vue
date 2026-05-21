<template>
  <div class="border rounded p-4 bg-white space-y-3">
    <div class="flex items-start justify-between gap-2 flex-wrap">
      <div class="space-y-1">
        <div class="font-semibold text-gray-800 text-sm">{{ issueTypeLabel }}</div>
        <div class="text-xs text-gray-400">{{ issue.issueKey }}</div>
      </div>
      <div class="flex gap-1 flex-wrap">
        <GuardianGovernanceSeverityBadge :severity="issue.severity" />
        <GuardianGovernancePriorityBadge :priority="issue.priority" />
        <GuardianGovernanceStatusBadge :status="issue.status" />
      </div>
    </div>

    <div class="flex items-center gap-3 flex-wrap text-xs text-gray-500">
      <GuardianIssueAgeBadge
        :days-since-detection="issue.daysSinceDetection"
        :stale-threshold-days="issue.staleThresholdDays"
      />
      <GuardianRecurringIssueWarning :recurrence-count="issue.recurrenceCount" />
      <span v-if="issue.assignedToName" class="text-blue-600">
        {{ t('preschoolGuardianGovernance.labels.assignedTo') }}: {{ issue.assignedToName }}
      </span>
    </div>

    <GuardianIssueEscalationNotice
      :is-stale="issue.isStale"
      :severity="issue.severity"
      :days-since-detection="issue.daysSinceDetection"
      :stale-threshold-days="issue.staleThresholdDays"
    />

    <div class="flex gap-2 flex-wrap" v-if="isActive">
      <Button
        size="small"
        :label="t('preschoolGuardianGovernance.actions.acknowledge')"
        severity="info"
        :loading="actionLoading"
        @click="$emit('acknowledge', issue)"
      />
      <Button
        size="small"
        :label="t('preschoolGuardianGovernance.actions.assign')"
        severity="warn"
        :loading="actionLoading"
        @click="$emit('assign', issue)"
      />
      <Button
        size="small"
        :label="t('preschoolGuardianGovernance.actions.resolve')"
        severity="success"
        :loading="actionLoading"
        @click="$emit('resolve', issue)"
      />
      <Button
        size="small"
        :label="t('preschoolGuardianGovernance.actions.dismiss')"
        severity="secondary"
        :loading="actionLoading"
        @click="$emit('dismiss', issue)"
      />
    </div>
  </div>
</template>

<script setup>
import Button from 'primevue/button'
import { computed } from 'vue'
import { useLanguage } from '@/composables/useLanguage'
import { ACTIVE_STATUSES } from '@/modules/preschool/services/api/preschoolGuardianGovernanceMappers'
import GuardianGovernanceSeverityBadge from './GuardianGovernanceSeverityBadge.vue'
import GuardianGovernancePriorityBadge from './GuardianGovernancePriorityBadge.vue'
import GuardianGovernanceStatusBadge from './GuardianGovernanceStatusBadge.vue'
import GuardianIssueAgeBadge from './GuardianIssueAgeBadge.vue'
import GuardianRecurringIssueWarning from './GuardianRecurringIssueWarning.vue'
import GuardianIssueEscalationNotice from './GuardianIssueEscalationNotice.vue'

const props = defineProps({
  issue: { type: Object, required: true },
  actionLoading: { type: Boolean, default: false },
})

defineEmits(['acknowledge', 'assign', 'resolve', 'dismiss'])

const { t } = useLanguage()

const typeKey = computed(() =>
  props.issue.issueType.replace(/_([a-z])/g, (_, c) => c.toUpperCase()),
)
const issueTypeLabel = computed(
  () => t(`preschoolGuardianGovernance.issueTypes.${typeKey.value}`) || props.issue.issueType,
)
const isActive = computed(() => ACTIVE_STATUSES.includes(props.issue.status))
</script>
