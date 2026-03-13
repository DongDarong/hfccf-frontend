<script setup>
import { useLanguage } from '@/composables/useLanguage'

const { t } = useLanguage()
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
          <tr>
            <td class="py-2 font-medium">1</td>
            <td class="py-2 font-medium text-hope-dark">Team A</td>
            <td class="py-2">4</td>
            <td class="py-2">3</td>
            <td class="py-2">1</td>
            <td class="py-2">0</td>
            <td class="py-2">9</td>
            <td class="py-2">3</td>
            <td class="py-2">+6</td>
            <td class="py-2 text-right font-semibold text-hope-lime">10</td>
          </tr>
          <tr>
            <td class="py-2 font-medium">2</td>
            <td class="py-2 font-medium text-hope-dark">Team B</td>
            <td class="py-2">4</td>
            <td class="py-2">2</td>
            <td class="py-2">2</td>
            <td class="py-2">0</td>
            <td class="py-2">7</td>
            <td class="py-2">4</td>
            <td class="py-2">+3</td>
            <td class="py-2 text-right font-semibold text-hope-lime">8</td>
          </tr>
          <tr>
            <td class="py-2 font-medium">3</td>
            <td class="py-2 font-medium text-hope-dark">Team C</td>
            <td class="py-2">4</td>
            <td class="py-2">2</td>
            <td class="py-2">1</td>
            <td class="py-2">1</td>
            <td class="py-2">6</td>
            <td class="py-2">5</td>
            <td class="py-2">+1</td>
            <td class="py-2 text-right font-semibold text-hope-lime">7</td>
          </tr>
          <tr>
            <td class="py-2 font-medium">4</td>
            <td class="py-2 font-medium text-hope-dark">Team D</td>
            <td class="py-2">4</td>
            <td class="py-2">2</td>
            <td class="py-2">0</td>
            <td class="py-2">2</td>
            <td class="py-2">5</td>
            <td class="py-2">5</td>
            <td class="py-2">0</td>
            <td class="py-2 text-right font-semibold text-hope-lime">6</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
