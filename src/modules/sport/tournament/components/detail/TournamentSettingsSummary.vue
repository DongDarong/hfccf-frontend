<script setup>
import Card from 'primevue/card'
import { computed } from 'vue'
import { useLanguage } from '@/composables/useLanguage'

defineOptions({
  name: 'TournamentSettingsSummary',
})

const props = defineProps({
  tournament: {
    type: Object,
    default: () => ({}),
  },
})

const { t } = useLanguage()

const items = computed(() => [
  {
    label: t('sportTournament.detail.settings.organizer'),
    value: props.tournament.organizer || '-',
  },
  {
    label: t('sportTournament.detail.settings.location'),
    value: props.tournament.location || '-',
  },
  {
    label: t('sportTournament.detail.settings.visibility'),
    value: t(`sportTournament.visibility.${props.tournament.visibility || 'private'}`),
  },
  {
    label: t('sportTournament.detail.settings.registration'),
    value: t(`sportTournament.registrationStatuses.${props.tournament.registrationStatus || 'closed'}`),
  },
  {
    label: t('sportTournament.detail.settings.rules'),
    value: [
      `${props.tournament.rules?.groupCount ?? 0} ${t('sportTournament.detail.settings.groups')}`,
      `${props.tournament.rules?.teamsPerGroup ?? 0} ${t('sportTournament.detail.settings.teamsPerGroup')}`,
      props.tournament.rules?.knockoutEnabled
        ? t('sportTournament.detail.settings.knockoutEnabled')
        : t('sportTournament.detail.settings.knockoutDisabled'),
    ].join(' • '),
  },
])
</script>

<template>
  <Card class="tournament-settings-summary">
    <template #title>
      {{ t('sportTournament.detail.settings.title') }}
    </template>
    <template #subtitle>
      {{ t('sportTournament.detail.settings.subtitle') }}
    </template>
    <template #content>
      <dl class="tournament-settings-summary__grid">
        <div v-for="item in items" :key="item.label" class="tournament-settings-summary__item">
          <dt class="tournament-settings-summary__label">{{ item.label }}</dt>
          <dd class="tournament-settings-summary__value">{{ item.value }}</dd>
        </div>
      </dl>
    </template>
  </Card>
</template>
