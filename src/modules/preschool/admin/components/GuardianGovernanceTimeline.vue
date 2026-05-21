<template>
  <div class="space-y-2 text-sm">
    <div v-if="issue.detectedAt" class="flex gap-2">
      <span class="font-medium text-gray-600">{{ t('preschoolGuardianGovernance.labels.detectedAt') }}:</span>
      <span>{{ formatDate(issue.detectedAt) }}</span>
    </div>
    <div v-if="issue.acknowledgedAt" class="flex gap-2">
      <span class="font-medium text-gray-600">{{ t('preschoolGuardianGovernance.labels.acknowledgedAt') }}:</span>
      <span>{{ formatDate(issue.acknowledgedAt) }}</span>
    </div>
    <div v-if="issue.assignedToName" class="flex gap-2">
      <span class="font-medium text-gray-600">{{ t('preschoolGuardianGovernance.labels.assignedTo') }}:</span>
      <span>{{ issue.assignedToName }}</span>
    </div>
    <div v-if="issue.resolvedAt" class="flex gap-2">
      <span class="font-medium text-gray-600">{{ t('preschoolGuardianGovernance.labels.resolvedAt') }}:</span>
      <span>{{ formatDate(issue.resolvedAt) }}</span>
    </div>
    <div v-if="issue.dismissedAt" class="flex gap-2">
      <span class="font-medium text-gray-600">{{ t('preschoolGuardianGovernance.labels.dismissedAt') }}:</span>
      <span>{{ formatDate(issue.dismissedAt) }}</span>
    </div>
    <div v-if="issue.resolutionNotes" class="flex gap-2">
      <span class="font-medium text-gray-600">{{ t('preschoolGuardianGovernance.labels.notes') }}:</span>
      <span class="text-gray-700">{{ issue.resolutionNotes }}</span>
    </div>
  </div>
</template>

<script setup>
import { useLanguage } from '@/composables/useLanguage'

defineProps({
  issue: { type: Object, required: true },
})

const { t } = useLanguage()

function formatDate(iso) {
  if (!iso) return ''
  return new Date(iso).toLocaleString()
}
</script>
