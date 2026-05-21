<template>
  <div v-if="metrics" class="grid grid-cols-2 md:grid-cols-4 gap-4">
    <div class="bg-white rounded border p-4 text-center">
      <div class="text-2xl font-bold">{{ metrics.totalIssues }}</div>
      <div class="text-sm text-gray-500">{{ t('preschoolGuardianGovernance.dashboard.totalIssues') }}</div>
    </div>
    <div class="bg-white rounded border p-4 text-center">
      <div class="text-2xl font-bold text-blue-600">{{ metrics.activeIssues }}</div>
      <div class="text-sm text-gray-500">{{ t('preschoolGuardianGovernance.dashboard.activeIssues') }}</div>
    </div>
    <div class="bg-white rounded border p-4 text-center">
      <div class="text-2xl font-bold text-red-600">{{ metrics.criticalUnresolved }}</div>
      <div class="text-sm text-gray-500">{{ t('preschoolGuardianGovernance.dashboard.criticalUnresolved') }}</div>
    </div>
    <div class="bg-white rounded border p-4 text-center">
      <div class="text-2xl font-bold text-orange-500">{{ metrics.staleIssues }}</div>
      <div class="text-sm text-gray-500">{{ t('preschoolGuardianGovernance.dashboard.staleIssues') }}</div>
    </div>
    <div class="bg-white rounded border p-4 text-center">
      <div class="text-2xl font-bold text-green-600">{{ metrics.resolvedIssues }}</div>
      <div class="text-sm text-gray-500">{{ t('preschoolGuardianGovernance.dashboard.resolvedIssues') }}</div>
    </div>
    <div class="bg-white rounded border p-4 text-center">
      <div class="text-2xl font-bold text-gray-400">{{ metrics.dismissedIssues }}</div>
      <div class="text-sm text-gray-500">{{ t('preschoolGuardianGovernance.dashboard.dismissedIssues') }}</div>
    </div>
    <div class="bg-white rounded border p-4 text-center">
      <div class="text-2xl font-bold text-purple-600">{{ metrics.recurringIssues }}</div>
      <div class="text-sm text-gray-500">{{ t('preschoolGuardianGovernance.dashboard.recurringIssues') }}</div>
    </div>
    <div class="bg-white rounded border p-4 text-center">
      <div class="text-2xl font-bold text-yellow-600">{{ metrics.unassignedIssues }}</div>
      <div class="text-sm text-gray-500">{{ t('preschoolGuardianGovernance.dashboard.unassignedIssues') }}</div>
    </div>
  </div>
  <p v-else class="text-gray-500 text-sm">{{ t('preschoolGuardianGovernance.dashboard.noData') }}</p>
</template>

<script setup>
import { useLanguage } from '@/composables/useLanguage'

defineProps({
  metrics: { type: Object, default: null },
})

const { t } = useLanguage()
</script>
