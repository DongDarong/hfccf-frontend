<script setup>
import { useLanguage } from '@/composables/useLanguage'
import adminDashboardData from '@/mocks/sport/admin-dashboard-data.json'

const { t } = useLanguage()

const standings = adminDashboardData.standings
</script>

<template>
  <div class="bg-white rounded-xl shadow-sm border border-hope-lime/30 p-5 md:p-6 tournament-panel">
    <h3 class="text-lg font-bold text-hope-dark mb-4">{{ t('sportAdminDashboard.quickPanels.standings') }}</h3>
    <div class="overflow-x-auto">
      <table class="min-w-full text-sm">
        <thead>
          <tr class="text-left text-xs text-gray-500 uppercase tracking-wider border-b border-gray-200">
            <th class="py-2">Pos</th>
            <th class="py-2">Team</th>
            <th class="py-2">P</th>
            <th class="py-2">W</th>
            <th class="py-2">D</th>
            <th class="py-2">L</th>
            <th class="py-2">GF</th>
            <th class="py-2">GA</th>
            <th class="py-2">GD</th>
            <th class="py-2 text-right">Pts</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100 text-gray-600">
          <tr v-for="team in standings" :key="team.team">
            <td class="py-2 font-medium">{{ team.pos }}</td>
            <td class="py-2 font-medium text-hope-dark">{{ team.team }}</td>
            <td class="py-2">{{ team.p }}</td>
            <td class="py-2">{{ team.w }}</td>
            <td class="py-2">{{ team.d }}</td>
            <td class="py-2">{{ team.l }}</td>
            <td class="py-2">{{ team.gf }}</td>
            <td class="py-2">{{ team.ga }}</td>
            <td class="py-2">{{ team.gd }}</td>
            <td class="py-2 text-right font-semibold text-hope-lime">{{ team.pts }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
