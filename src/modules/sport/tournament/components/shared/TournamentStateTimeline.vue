<script setup>
import { computed } from 'vue'
import { useLanguage } from '@/composables/useLanguage'
import {
  getTournamentWorkflowSteps,
  getTournamentProgressPercent,
  getTournamentStateLabelKey,
} from '../../composables/useTournamentStateMachine'

defineOptions({
  name: 'TournamentStateTimeline',
})

const props = defineProps({
  state: {
    type: String,
    default: 'draft',
  },
  compact: {
    type: Boolean,
    default: false,
  },
})

const { t, te } = useLanguage()

const steps = computed(() => getTournamentWorkflowSteps(props.state))
const progressPercent = computed(() => getTournamentProgressPercent(props.state))
const currentStateLabel = computed(() => {
  const key = getTournamentStateLabelKey(props.state)
  return te(key) ? t(key) : String(props.state || 'draft')
})

function stepLabel(step) {
  return te(step.labelKey) ? t(step.labelKey) : step.state
}

function stepDescription(step) {
  return te(step.descriptionKey) ? t(step.descriptionKey) : ''
}
</script>

<template>
  <section class="tournament-timeline">
    <div class="tournament-timeline__head">
      <div>
        <p class="tournament-timeline__eyebrow">{{ t('sportTournament.detail.workflow.eyebrow') }}</p>
        <h3 class="tournament-timeline__title">{{ t('sportTournament.detail.workflow.title') }}</h3>
        <p class="tournament-timeline__subtitle">
          {{ t('sportTournament.detail.workflow.subtitle') }}
        </p>
      </div>

      <div class="tournament-timeline__progress">
        <strong>{{ progressPercent }}%</strong>
        <span>{{ currentStateLabel }}</span>
      </div>
    </div>

    <div class="tournament-timeline__track" :class="{ 'tournament-timeline__track--compact': compact }">
      <article
        v-for="(step, index) in steps"
        :key="step.state"
        class="tournament-timeline__step"
        :class="{
          'tournament-timeline__step--complete': step.isComplete,
          'tournament-timeline__step--current': step.isCurrent,
          'tournament-timeline__step--upcoming': step.isUpcoming,
        }"
      >
        <div class="tournament-timeline__marker">
          <span class="tournament-timeline__dot">{{ index + 1 }}</span>
        </div>
        <div class="tournament-timeline__copy">
          <h4 class="tournament-timeline__step-title">{{ stepLabel(step) }}</h4>
          <p v-if="!compact && stepDescription(step)" class="tournament-timeline__step-text">
            {{ stepDescription(step) }}
          </p>
        </div>
      </article>
    </div>
  </section>
</template>

