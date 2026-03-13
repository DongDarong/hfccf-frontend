<script setup>
import { useLanguage } from '@/composables/useLanguage'
import adminDashboardData from '@/mocks/sport/admin-dashboard-data.json'

const { t } = useLanguage()

const topScorers = adminDashboardData.topScorers
</script>

<template>
  <div class="bg-white rounded-xl shadow-sm border border-hope-yellow/30 p-5 md:p-6 tournament-panel">
    <h3 class="text-lg font-bold text-hope-dark mb-4">{{ t('sportAdminDashboard.quickPanels.topScorers') }}</h3>
    <ul id="topScorersList" class="space-y-3 text-sm text-gray-600">
      <li v-for="scorer in topScorers" :key="scorer.player" class="flex items-center justify-between p-3 rounded-lg bg-gray-50">
        <span>{{ scorer.player }} · {{ scorer.goals }} goals</span>
        <span>{{ scorer.team }}</span>
      </li>
    </ul>
  </div>
</template>
