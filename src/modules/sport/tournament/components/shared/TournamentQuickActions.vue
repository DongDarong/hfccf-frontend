<script setup>
import Button from 'primevue/button'
import { useLanguage } from '@/composables/useLanguage'

defineOptions({
  name: 'TournamentQuickActions',
})

defineProps({
  title: {
    type: String,
    default: '',
  },
  subtitle: {
    type: String,
    default: '',
  },
  actions: {
    type: Array,
    default: () => [],
  },
  compact: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['action'])
const { t, te } = useLanguage()

function actionLabel(action) {
  if (!action) return ''

  if (action.label) return action.label

  return te(action.labelKey) ? t(action.labelKey) : String(action.key || '')
}

function actionDescription(action) {
  if (!action?.descriptionKey) return ''
  return te(action.descriptionKey) ? t(action.descriptionKey) : ''
}

function actionTone(action) {
  const tone = String(action?.tone || 'info').trim().toLowerCase()

  if (tone === 'success') return 'success'
  if (tone === 'warning') return 'warning'
  if (tone === 'neutral') return 'secondary'

  return 'info'
}
</script>

<template>
  <section class="tournament-actions">
    <div class="tournament-actions__head">
      <div>
        <p v-if="title" class="tournament-actions__eyebrow">{{ title }}</p>
        <p v-if="subtitle" class="tournament-actions__subtitle">{{ subtitle }}</p>
      </div>
    </div>

    <div class="tournament-actions__grid" :class="{ 'tournament-actions__grid--compact': compact }">
      <article
        v-for="action in actions"
        :key="action.key"
        class="tournament-actions__card"
        :class="{ 'tournament-actions__card--disabled': action.disabled }"
      >
        <div class="tournament-actions__copy">
          <h4 class="tournament-actions__title">{{ actionLabel(action) }}</h4>
          <p v-if="actionDescription(action)" class="tournament-actions__text">
            {{ actionDescription(action) }}
          </p>
        </div>

        <Button
          type="button"
          class="w-full"
          :severity="actionTone(action)"
          :label="actionLabel(action)"
          :disabled="action.disabled"
          @click="emit('action', action)"
        />
      </article>
    </div>
  </section>
</template>
