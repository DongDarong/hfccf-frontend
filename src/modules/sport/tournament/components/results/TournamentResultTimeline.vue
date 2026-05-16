<script setup>
import { useLanguage } from '@/composables/useLanguage'

defineOptions({
  name: 'TournamentResultTimeline',
})

defineProps({
  events: {
    type: Array,
    default: () => [],
  },
})

const { t, te } = useLanguage()

function eventLabel(event) {
  const key = `sportTournament.results.eventTypes.${String(event?.type || '').trim()}`
  return te(key) ? t(key) : String(event?.type || '')
}
</script>

<template>
  <section class="result-timeline">
    <div class="result-timeline__head">
      <div>
        <h3>{{ t('sportTournament.results.timeline.title') }}</h3>
        <p>{{ t('sportTournament.results.timeline.subtitle') }}</p>
      </div>
    </div>

    <div v-if="events.length" class="result-timeline__items">
      <article v-for="event in events" :key="event.id" class="result-timeline__item">
        <div class="result-timeline__minute">{{ event.minute }}'</div>
        <div class="result-timeline__copy">
          <strong>{{ eventLabel(event) }}</strong>
          <p>{{ event.playerName || event.teamName || event.teamId || '-' }}</p>
        </div>
      </article>
    </div>

    <div v-else class="result-timeline__empty">
      {{ t('sportTournament.results.timeline.empty') }}
    </div>
  </section>
</template>

<style scoped>
.result-timeline {
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
  padding: 1rem;
  border-radius: 1.25rem;
  border: 1px solid #dce6f2;
  background: rgba(255, 255, 255, 0.96);
}

.result-timeline__head h3 {
  margin: 0;
  color: #0f172a;
  font-size: 1rem;
  font-weight: 800;
}

.result-timeline__head p {
  margin: 0.35rem 0 0;
  color: #64748b;
  line-height: 1.6;
}

.result-timeline__items {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.result-timeline__item {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 0.75rem;
  align-items: center;
  padding: 0.8rem 0.9rem;
  border-radius: 1rem;
  border: 1px solid #dce6f2;
  background: rgba(248, 250, 252, 0.94);
}

.result-timeline__minute {
  display: inline-flex;
  min-width: 3rem;
  justify-content: center;
  padding: 0.35rem 0.55rem;
  border-radius: 999px;
  background: rgba(0, 174, 239, 0.1);
  color: #0369a1;
  font-weight: 900;
}

.result-timeline__copy strong {
  display: block;
  color: #0f172a;
  font-size: 0.9rem;
}

.result-timeline__copy p {
  margin: 0.2rem 0 0;
  color: #64748b;
}

.result-timeline__empty {
  padding: 0.95rem;
  border-radius: 1rem;
  border: 1px dashed #cbd5e1;
  color: #64748b;
}
</style>
