<script setup>
/**
 * GoalEventRow
 * Single editable goal event row. It never mutates the event prop directly.
 */
import InputText from 'primevue/inputtext'
import Button from '@/components/buttons/Button.vue'

defineOptions({
  name: 'GoalEventRow',
})

const props = defineProps({
  event: {
    type: Object,
    required: true,
  },
  labels: {
    type: Object,
    required: true,
  },
  placeholders: {
    type: Object,
    required: true,
  },
  readonly: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update', 'remove'])

function updateField(field, value) {
  emit('update', {
    ...props.event,
    [field]: value,
  })
}
</script>

<template>
  <div class="goal-event-row">
    <label class="goal-event-row__field">
      <span class="goal-event-row__label">{{ labels.playerName }}</span>
      <InputText
        :model-value="event.playerName"
        :placeholder="placeholders.playerName"
        class="w-full"
        :disabled="readonly"
        @update:model-value="updateField('playerName', $event)"
      />
    </label>

    <label class="goal-event-row__field">
      <span class="goal-event-row__label">{{ labels.minute }}</span>
      <InputText
        :model-value="event.minute"
        :placeholder="placeholders.minute"
        class="w-full"
        :disabled="readonly"
        @update:model-value="updateField('minute', $event)"
      />
    </label>

    <Button
      type="button"
      variant="ghost"
      size="sm"
      rounded="xl"
      :disabled="readonly"
      @click="emit('remove', event.id)"
    >
      {{ labels.remove }}
    </Button>
  </div>
</template>

<style scoped>
.goal-event-row {
  display: grid;
  grid-template-columns: minmax(0, 1.3fr) minmax(90px, 0.5fr) auto;
  gap: 0.75rem;
  align-items: end;
  padding: 0.85rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  background: #ffffff;
}

.goal-event-row__field {
  display: grid;
  gap: 0.4rem;
}

.goal-event-row__label {
  color: #64748b;
  font-size: 0.7rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

@media (max-width: 720px) {
  .goal-event-row {
    grid-template-columns: 1fr;
  }
}
</style>
