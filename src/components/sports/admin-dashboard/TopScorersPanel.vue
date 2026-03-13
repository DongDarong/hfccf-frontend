<script setup>
import { useLanguage } from '@/composables/useLanguage'

const { t } = useLanguage()
</script>

<template>
  <div class="bg-white rounded-xl shadow-sm border border-hope-yellow/30 p-5 md:p-6 tournament-panel">
    <h3 class="text-lg font-bold text-hope-dark mb-4">{{ t('sportAdminDashboard.quickPanels.topScorers') }}</h3>
    <ul id="topScorersList" class="space-y-3 text-sm text-gray-600">
      <li class="flex items-center justify-between p-3 rounded-lg bg-gray-50">
        <span>Player A · 6 goals</span>
        <span>Team A</span>
      </li>
      <li class="flex items-center justify-between p-3 rounded-lg bg-gray-50">
        <span>Player B · 5 goals</span>
        <span>Team B</span>
      </li>
      <li class="flex items-center justify-between p-3 rounded-lg bg-gray-50">
        <span>Player C · 4 goals</span>
        <span>Team C</span>
      </li>
    </ul>
  </div>
</template>
