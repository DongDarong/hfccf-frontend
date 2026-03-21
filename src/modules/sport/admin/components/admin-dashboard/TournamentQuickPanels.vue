<script setup>
import LiveMatchesPanel from './LiveMatchesPanel.vue'
import TodayMatchesPanel from './TodayMatchesPanel.vue'
import TopScorersPanel from './TopScorersPanel.vue'
import StandingsPanel from './StandingsPanel.vue'
</script>

<template>
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <LiveMatchesPanel />
    <TodayMatchesPanel />
    <TopScorersPanel />
    <StandingsPanel />
  </div>
</template>

<style scoped>
.tournament-panel {
  background: color-mix(in srgb, white 94%, transparent);
}

.tournament-panel h3 {
  letter-spacing: 0.04em;
}

.tournament-panel .flex.items-center span {
  background: color-mix(in srgb, var(--hope-red) 65%, white);
}

.tournament-panel table th {
  color: #94a3b8;
}

.tournament-panel table td {
  color: #0f172a;
}
</style>


