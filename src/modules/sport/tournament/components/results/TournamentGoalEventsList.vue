<script setup>
import Button from 'primevue/button'
import { useLanguage } from '@/composables/useLanguage'

defineOptions({
  name: 'TournamentGoalEventsList',
})

defineProps({
  events: {
    type: Array,
    default: () => [],
  },
  disabled: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['add-event', 'remove-event'])
const { t, te } = useLanguage()

function eventLabel(event) {
  const key = `sportTournament.results.eventTypes.${String(event?.type || '').trim()}`
  return te(key) ? t(key) : String(event?.type || '')
}
</script>

<template>
  <section class="events-list">
    <div class="events-list__head">
      <div>
        <h3>{{ t('sportTournament.results.events.title') }}</h3>
        <p>{{ t('sportTournament.results.events.subtitle') }}</p>
      </div>

      <Button
        type="button"
        class="rounded-xl"
        outlined
        :disabled="disabled"
        :label="t('sportTournament.results.actions.addEvent')"
        @click="emit('add-event')"
      />
    </div>

    <div v-if="events.length" class="events-list__grid">
      <article v-for="event in events" :key="event.id" class="events-list__item">
        <div>
          <strong>{{ event.minute }}'</strong>
          <span>{{ eventLabel(event) }}</span>
        </div>
        <p>{{ event.playerName || event.teamName || event.teamId || '-' }}</p>
        <Button
          type="button"
          class="rounded-xl"
          severity="secondary"
          :disabled="disabled"
          :label="t('sportTournament.results.actions.removeEvent')"
          @click="emit('remove-event', event.id)"
        />
      </article>
    </div>

    <div v-else class="events-list__empty">
      {{ t('sportTournament.results.events.empty') }}
    </div>
  </section>
</template>

<style scoped>
.events-list {
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
  padding: 1rem;
  border-radius: 1.25rem;
  border: 1px solid #dce6f2;
  background: rgba(255, 255, 255, 0.96);
}

.events-list__head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
}

.events-list__head h3 {
  margin: 0;
  color: #0f172a;
  font-size: 1rem;
  font-weight: 800;
}

.events-list__head p {
  margin: 0.35rem 0 0;
  color: #64748b;
  line-height: 1.6;
}

.events-list__grid {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.events-list__item {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 0.75rem;
  padding: 0.85rem 0.95rem;
  border-radius: 1rem;
  border: 1px solid #dce6f2;
  background: rgba(248, 250, 252, 0.94);
}

.events-list__item strong {
  color: #0f172a;
  font-size: 0.95rem;
}

.events-list__item span,
.events-list__item p {
  color: #64748b;
}

.events-list__item p {
  margin: 0;
}

.events-list__empty {
  padding: 0.95rem;
  border-radius: 1rem;
  border: 1px dashed #cbd5e1;
  color: #64748b;
}

@media (max-width: 768px) {
  .events-list__item {
    grid-template-columns: 1fr;
    align-items: flex-start;
  }
}
</style>
