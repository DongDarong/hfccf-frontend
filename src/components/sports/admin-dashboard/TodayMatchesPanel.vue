<script setup>
import { useLanguage } from '@/composables/useLanguage'
import adminDashboardData from '@/mocks/sport/admin-dashboard-data.json'

const { t } = useLanguage()

const todayMatches = adminDashboardData.todayMatches
</script>

<template>
  <div class="bg-white rounded-xl shadow-sm border border-hope-purple/30 p-5 md:p-6 tournament-panel">
    <h3 class="text-lg font-bold text-hope-dark mb-4">{{ t('sportAdminDashboard.quickPanels.todayMatches') }}</h3>
    <ul class="space-y-3">
      <li
        v-for="match in todayMatches"
        :key="match.teams"
        class="flex items-center justify-between p-3 rounded-lg bg-gray-50"
      >
        <span class="font-medium text-hope-dark">{{ match.teams }}</span>
        <span class="text-sm text-gray-500">{{ match.time }}</span>
      </li>
    </ul>
  </div>
</template>
