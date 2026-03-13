<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useLanguage } from '@/composables/useLanguage'

const props = defineProps({
  tournamentTitle: String,
  tournamentSubtitle: String,
  actionLabel: String,
  actionLink: String,
})

const { t } = useLanguage()

const defaultActionLink = '/module/sport-admin/matches'

const title = computed(() => props.tournamentTitle || t('sportAdminDashboard.tournamentBanner.title'))
const subtitle = computed(() => props.tournamentSubtitle || t('sportAdminDashboard.tournamentBanner.subtitle'))
const actionLabel = computed(() => props.actionLabel || t('sportAdminDashboard.tournamentBanner.action'))
const actionLink = computed(() => props.actionLink || defaultActionLink)
</script>

<template>
  <div class="rounded-xl border border-hope-cyan/30 p-5 md:p-6 text-white shadow-lg mb-6 banner-gradient">
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <p class="text-xs uppercase tracking-wider font-semibold text-white/85">{{ t('sportAdminDashboard.tournamentBanner.badge') }}</p>
        <h2 id="dashboardTournamentTitle" class="text-2xl md:text-3xl font-extrabold mt-1">{{ title }}</h2>
        <p id="dashboardTournamentSubtitle" class="text-sm md:text-base text-white/90 mt-2">{{ subtitle }}</p>
      </div>
    <RouterLink
      :to="actionLink"
      class="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-white font-semibold hover:bg-slate-100 transition-colors banner-button"
    >
        {{ actionLabel }}
      </RouterLink>
    </div>
  </div>
</template>

<style scoped>
.banner-gradient {
  border-color: rgba(139, 92, 246, 0.3);
  background: linear-gradient(135deg, #0ea5e9 0%, #6366f1 45%, #7c3aed 100%);
}

.banner-button {
  color: #0f172a;
  border: none;
}
</style>
.banner-gradient {
  border-color: rgba(14, 165, 233, 0.3);
  background: linear-gradient(135deg, var(--hope-cyan) 0%, color-mix(in srgb, var(--hope-cyan) 70%, var(--hope-blue) 45%), var(--hope-purple) 100%);
}

.banner-button {
  color: var(--hope-cyan);
  border: none;
}
