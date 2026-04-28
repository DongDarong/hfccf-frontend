<script setup>
import { computed } from 'vue'
import Dialog from 'primevue/dialog'
import EventFormFields from '@/modules/dashboard/components/calendar/EventFormFields.vue'

const emit = defineEmits([
  'update:visible',
  'save',
  'cancel',
  'delete',
  'update-field',
  'update:teamQuery',
  'update:selectedTeamIds',
])

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  mode: {
    type: String,
    default: 'create',
  },
  form: {
    type: Object,
    required: true,
  },
  eventTypes: {
    type: Array,
    default: () => [],
  },
  teams: {
    type: Array,
    default: () => [],
  },
  teamQuery: {
    type: String,
    default: '',
  },
})

const dialogTitle = computed(() =>
  props.mode === 'edit' ? 'Edit Schedule Event' : 'Create Schedule Event',
)

const submitLabel = computed(() => (props.mode === 'edit' ? 'Save Changes' : 'Save Event'))
</script>

<template>
  <Dialog
    :visible="visible"
    modal
    :draggable="false"
    :closable="true"
    :style="{ width: 'min(44rem, calc(100vw - 1.5rem))' }"
    :pt="{
      root: { class: 'rounded-[1.4rem] overflow-hidden' },
      header: { class: 'px-6 pt-6 pb-2' },
      content: { class: 'px-6 pb-5 pt-2' },
      footer: { class: 'px-6 pb-6 pt-0' },
    }"
    @update:visible="$emit('update:visible', $event)"
    @hide="$emit('cancel')"
  >
    <template #header>
      <div class="event-form-modal__header">
        <p class="event-form-modal__eyebrow">{{ mode === 'edit' ? 'Update' : 'Create' }}</p>
        <h2 class="event-form-modal__title">{{ dialogTitle }}</h2>
      </div>
    </template>

    <EventFormFields
      :form="form"
      :event-types="eventTypes"
      :teams="teams"
      :team-query="teamQuery"
      @update-field="$emit('update-field', $event)"
      @update:team-query="$emit('update:teamQuery', $event)"
      @update:selected-team-ids="$emit('update:selectedTeamIds', $event)"
    />

    <template #footer>
      <div class="event-form-modal__footer">
        <button
          v-if="mode === 'edit'"
          type="button"
          class="event-form-modal__delete"
          @click="$emit('delete')"
        >
          Delete
        </button>

        <div class="event-form-modal__actions">
          <button type="button" class="event-form-modal__cancel" @click="$emit('cancel')">
            Cancel
          </button>
          <button type="button" class="event-form-modal__save" @click="$emit('save')">
            {{ submitLabel }}
          </button>
        </div>
      </div>
    </template>
  </Dialog>
</template>

<style scoped>
.event-form-modal__header {
  display: flex;
  flex-direction: column;
}

.event-form-modal__eyebrow {
  margin: 0;
  color: #00aeef;
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.event-form-modal__title {
  margin: 0.35rem 0 0;
  color: #1d1d1b;
  font-size: 1.3rem;
  font-weight: 900;
}

.event-form-modal__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
}

.event-form-modal__actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-left: auto;
}

.event-form-modal__cancel,
.event-form-modal__save,
.event-form-modal__delete {
  border-radius: 9999px;
  padding: 0.8rem 1.2rem;
  font-size: 0.86rem;
  font-weight: 800;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    border-color 0.2s ease;
}

.event-form-modal__cancel {
  border: 1px solid #d7dee7;
  background: #fff;
  color: #334155;
}

.event-form-modal__save {
  border: 0;
  background: linear-gradient(180deg, #00aeef 0%, #0097d3 100%);
  color: #fff;
  box-shadow: 0 20px 28px -22px rgba(0, 174, 239, 0.82);
}

.event-form-modal__delete {
  border: 1px solid #ffd7da;
  background: #fff5f5;
  color: #c81e1e;
}

.event-form-modal__cancel:hover,
.event-form-modal__save:hover,
.event-form-modal__delete:hover {
  transform: translateY(-1px);
}

@media (max-width: 640px) {
  .event-form-modal__footer {
    flex-direction: column;
    align-items: stretch;
  }

  .event-form-modal__actions {
    margin-left: 0;
    justify-content: stretch;
    flex-direction: column;
  }

  .event-form-modal__cancel,
  .event-form-modal__save,
  .event-form-modal__delete {
    width: 100%;
  }
}
</style>
