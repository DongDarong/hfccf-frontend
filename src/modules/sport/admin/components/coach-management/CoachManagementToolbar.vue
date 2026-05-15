<script setup>
import Button from '@/components/buttons/Button.vue'

defineOptions({
  name: 'CoachManagementToolbar',
})

defineProps({
  eyebrow: {
    type: String,
    default: '',
  },
  title: {
    type: String,
    default: '',
  },
  description: {
    type: String,
    default: '',
  },
  spotlightLabel: {
    type: String,
    default: '',
  },
  spotlightValue: {
    type: String,
    default: '',
  },
  buttonLabel: {
    type: String,
    default: '',
  },
  buttonCaption: {
    type: String,
    default: '',
  },
  isKh: {
    type: Boolean,
    default: false,
  },
})

defineEmits(['add'])
</script>

<template>
  <div :class="isKh ? 'coach-toolbar coach-toolbar--kh' : 'coach-toolbar'">
    <div class="coach-toolbar__copy">
      <p class="coach-toolbar__eyebrow">{{ eyebrow }}</p>
      <h2 class="coach-toolbar__title">{{ title }}</h2>
      <p class="coach-toolbar__text">{{ description }}</p>
    </div>

    <div class="coach-toolbar__actions">
      <div class="coach-toolbar__spotlight">
        <span class="coach-toolbar__spotlight-label">{{ spotlightLabel }}</span>
        <strong class="coach-toolbar__spotlight-value">{{ spotlightValue }}</strong>
      </div>

      <Button
        variant="primary"
        size="lg"
        rounded="xl"
        class="coach-toolbar__add-button"
        @click="$emit('add')"
      >
        <template #iconLeft>
          <svg
            class="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 4v16m8-8H4"
            />
          </svg>
        </template>
        <span class="coach-toolbar__add-button-content">
          <span class="coach-toolbar__add-button-label">{{ buttonLabel }}</span>
          <span v-if="buttonCaption" class="coach-toolbar__add-button-caption">
            {{ buttonCaption }}
          </span>
        </span>
        <span class="coach-toolbar__add-button-trailing" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M7 17L17 7M9 7h8v8" />
          </svg>
        </span>
      </Button>
    </div>
  </div>
</template>

<style scoped>
.coach-toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.coach-toolbar__copy {
  min-width: 0;
}

.coach-toolbar__eyebrow {
  margin: 0;
  color: #64748b;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.coach-toolbar__title {
  margin: 0.35rem 0 0;
  color: #0f172a;
  font-size: 1.4rem;
  line-height: 1.2;
  font-weight: 800;
}

.coach-toolbar__text {
  margin: 0.45rem 0 0;
  color: #475569;
  font-size: 0.92rem;
  line-height: 1.6;
}

.coach-toolbar__actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-end;
  gap: 0.85rem;
}

.coach-toolbar__spotlight {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  padding: 0.8rem 1rem;
  border-radius: 1rem;
  border: 1px solid rgba(14, 116, 144, 0.16);
  background: linear-gradient(135deg, rgba(6, 182, 212, 0.1) 0%, rgba(255, 255, 255, 0.94) 100%);
}

.coach-toolbar__spotlight-label {
  color: #0f6f8f;
  font-size: 0.76rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.coach-toolbar__spotlight-value {
  color: #0f172a;
  font-size: 1.3rem;
  line-height: 1;
  font-weight: 800;
}

.coach-toolbar__add-button {
  flex: 0 0 auto;
  min-width: 14.5rem;
  white-space: nowrap;
}

.coach-toolbar__add-button-content {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.12rem;
  line-height: 1.15;
  text-align: left;
}

.coach-toolbar__add-button-label {
  font-size: 0.96rem;
  font-weight: 800;
}

.coach-toolbar__add-button-caption {
  opacity: 0.84;
  font-size: 0.72rem;
  font-weight: 600;
}

.coach-toolbar__add-button-trailing {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.9rem;
  height: 1.9rem;
  margin-left: 0.35rem;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.18);
  border: 1px solid rgba(255, 255, 255, 0.26);
}

.coach-toolbar__add-button-trailing svg {
  width: 0.9rem;
  height: 0.9rem;
}

.coach-toolbar--kh .coach-toolbar__eyebrow,
.coach-toolbar--kh .coach-toolbar__spotlight-label,
.coach-toolbar--kh .coach-toolbar__add-button-label,
.coach-toolbar--kh .coach-toolbar__add-button-caption {
  font-family:
    'Noto Sans Khmer', 'Khmer OS Siemreap', 'Khmer OS Battambang', 'Leelawadee UI', sans-serif;
}

.coach-toolbar--kh .coach-toolbar__eyebrow,
.coach-toolbar--kh .coach-toolbar__spotlight-label {
  text-transform: none;
  letter-spacing: 0.01em;
}

.coach-toolbar--kh .coach-toolbar__text {
  font-size: 0.92rem;
  line-height: 1.65;
}

.coach-toolbar--kh .coach-toolbar__add-button-caption {
  font-size: 0.76rem;
}

@media (max-width: 640px) {
  .coach-toolbar__title {
    font-size: 1.2rem;
  }

  .coach-toolbar__actions {
    width: 100%;
    justify-content: stretch;
  }

  .coach-toolbar__spotlight,
  .coach-toolbar__add-button {
    width: 100%;
    min-width: 0;
  }
}
</style>
