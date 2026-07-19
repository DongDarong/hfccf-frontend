<script setup>
import { ref } from 'vue'
import Button from '@/components/buttons/Button.vue'
import Select from 'primevue/select'
import { useLanguage } from '@/composables/useLanguage'

defineProps({
  teams: { type: Array, default: () => [] },
  availableTeams: { type: Array, default: () => [] },
  removingTeamId: { type: String, default: '' },
  pending: { type: Boolean, default: false },
})
const emit = defineEmits(['attach', 'remove'])
const { t } = useLanguage()
const selectedTeamId = ref('')
</script>

<template>
  <section class="tournament-team-management">
    <div class="tournament-team-management__head">
      <div>
        <p class="tournament-team-management__eyebrow">{{ t('sportTournament.detail.teams.eyebrow') }}</p>
        <h3>{{ t('sportTournament.detail.teams.title') }}</h3>
      </div>
      <div class="tournament-team-management__attach">
        <Select v-model="selectedTeamId" :options="availableTeams" option-label="name" option-value="id" :placeholder="t('sportTournament.detail.teams.select')" :disabled="pending || !availableTeams.length" />
        <Button type="button" :label="t('sportTournament.detail.teams.attach')" :disabled="pending || !selectedTeamId" @click="emit('attach', selectedTeamId); selectedTeamId = ''" />
      </div>
    </div>
    <p v-if="!teams.length" class="tournament-team-management__empty">{{ t('sportTournament.detail.teams.empty') }}</p>
    <div v-else class="tournament-team-management__list">
      <div v-for="team in teams" :key="team.teamId || team.id" class="tournament-team-management__item">
        <span>{{ team.name }}</span>
        <Button type="button" text severity="danger" :label="t('sportTournament.detail.teams.remove')" :disabled="pending || removingTeamId === String(team.teamId || team.id)" @click="emit('remove', team.teamId || team.id)" />
      </div>
    </div>
  </section>
</template>
