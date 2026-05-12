<script setup>
/**
 * NotificationListItem
 * --------------------------------------------------------------------------
 * Single notification row item.
 *
 * Features:
 * - Tone-based icon and border
 * - Read state styling
 * - Mark-read action
 * - Delete action
 * - Time and relative-time display
 * --------------------------------------------------------------------------
 */

import { computed } from 'vue'

defineOptions({
  name: 'NotificationListItem',
})

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
  markReadLabel: {
    type: String,
    default: 'Mark Read',
  },
  deleteLabel: {
    type: String,
    default: 'Delete',
  },
  loading: {
    type: Boolean,
    default: false,
  },
  time: {
    type: String,
    default: '',
  },
  relativeTime: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['delete', 'mark-read'])

/**
 * Safe notification tone.
 */
const normalizedTone = computed(() => {
  const tone = String(props.item?.tone || 'info').toLowerCase()

  return ['danger', 'success', 'info'].includes(tone) ? tone : 'info'
})

/**
 * Icon by notification tone.
 */
const toneIcon = computed(() => {
  if (normalizedTone.value === 'danger') return 'pi pi-exclamation-triangle'
  if (normalizedTone.value === 'success') return 'pi pi-check-circle'

  return 'pi pi-info-circle'
})

/**
 * Resolve exact time from prop or item.
 */
const resolvedTime = computed(() =>
  props.time || props.item?.time || '',
)

/**
 * Resolve relative time from prop or item.
 */
const resolvedRelativeTime = computed(() =>
  props.relativeTime || props.item?.relativeTime || '',
)

/**
 * Mark notification as read.
 */
function handleMarkRead() {
  if (props.loading || props.item?.read) return

  emit('mark-read', props.item)
}

/**
 * Delete notification.
 */
function handleDelete() {
  if (props.loading) return

  emit('delete', props.item)
}
</script>

<template>
  <div
    class="notification-list-item"
    :class="[
      `notification-list-item--${normalizedTone}`,
      { 'notification-list-item--read': item.read },
    ]"
  >
    <div class="notification-list-item__main">
      <span
        class="notification-list-item__icon"
        aria-hidden="true"
      >
        <i :class="toneIcon" />
      </span>

      <div class="min-w-0">
        <div class="notification-list-item__pill">
          {{ item.label }}
        </div>

        <p class="notification-list-item__title">
          {{ item.title }}
        </p>

        <p class="notification-list-item__detail">
          {{ item.detail }}
        </p>

        <p
          v-if="resolvedTime"
          class="notification-list-item__time"
        >
          <span>{{ resolvedTime }}</span>

          <span
            v-if="resolvedRelativeTime"
            class="notification-list-item__time-separator"
          >
            •
          </span>

          <span v-if="resolvedRelativeTime">
            {{ resolvedRelativeTime }}
          </span>
        </p>
      </div>
    </div>

    <div class="notification-list-item__actions-wrap">
      <div class="notification-list-item__actions">
        <button
          type="button"
          class="notification-list-item__button notification-list-item__button--read"
          :disabled="item.read || loading"
          @click="handleMarkRead"
        >
          <i
            class="pi pi-check"
            aria-hidden="true"
          />

          <span>{{ markReadLabel }}</span>
        </button>

        <button
          type="button"
          class="notification-list-item__button notification-list-item__button--delete"
          :disabled="loading"
          @click="handleDelete"
        >
          <i
            class="pi pi-trash"
            aria-hidden="true"
          />

          <span>{{ deleteLabel }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/**
 * Notification row shell.
 */
.notification-list-item {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem;
  border: 1px solid #e7eef6;
  border-radius: 1rem;
  background: #ffffff;
}

.notification-list-item--read {
  opacity: 0.72;
}

.notification-list-item--danger {
  border-left: 4px solid var(--hope-red);
}

.notification-list-item--info {
  border-left: 4px solid var(--hope-cyan);
}

.notification-list-item--success {
  border-left: 4px solid var(--hope-lime);
}

/**
 * Main content layout.
 */
.notification-list-item__main {
  display: flex;
  min-width: 0;
  align-items: flex-start;
  gap: 0.75rem;
}

/**
 * Tone icon.
 */
.notification-list-item__icon {
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 2.35rem;
  height: 2.35rem;
  border-radius: 0.8rem;
  background: #eef6fb;
  color: #0f6e96;
  font-size: 0.95rem;
}

.notification-list-item--danger .notification-list-item__icon {
  background: #fff1f2;
  color: #be123c;
}

.notification-list-item--info .notification-list-item__icon {
  background: #eff6ff;
  color: #1d4ed8;
}

.notification-list-item--success .notification-list-item__icon {
  background: #ecfdf5;
  color: #15803d;
}

/**
 * Pill label.
 */
.notification-list-item__pill {
  display: inline-flex;
  align-items: center;
  margin-bottom: 0.25rem;
  padding: 0.28rem 0.7rem;
  border-radius: 9999px;
  background: #eef6fb;
  color: #0f6e96;
  font-size: 0.7rem;
  font-weight: 800;
  text-align: center;
}

/**
 * Notification text.
 */
.notification-list-item__title {
  margin: 0;
  color: #122f43;
  font-size: 1rem;
  font-weight: 800;
}

.notification-list-item__detail {
  margin: 0.25rem 0 0;
  color: #64748b;
  font-size: 0.86rem;
  line-height: 1.6;
}

.notification-list-item__time {
  margin: 0.35rem 0 0;
  color: #0f6e96;
  font-size: 0.75rem;
  font-weight: 700;
}

.notification-list-item__time-separator {
  margin-inline: 0.35rem;
  color: #94a3b8;
}

/**
 * Actions.
 */
.notification-list-item__actions-wrap {
  display: flex;
  flex-shrink: 0;
  align-items: center;
}

.notification-list-item__actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.notification-list-item__button {
  display: inline-flex;
  min-height: 2rem;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  padding: 0.45rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.74rem;
  font-weight: 800;
  transition:
    background-color 0.18s ease,
    border-color 0.18s ease,
    color 0.18s ease;
}

.notification-list-item__button:disabled {
  cursor: not-allowed;
}

.notification-list-item__button--read {
  border: 1px solid #bfdbfe;
  background: #eff6ff;
  color: #1d4ed8;
}

.notification-list-item__button--read:hover:not(:disabled) {
  border-color: #93c5fd;
  background: #dbeafe;
}

.notification-list-item__button--read:disabled {
  border-color: #d1fae5;
  background: #ecfdf5;
  color: #15803d;
}

.notification-list-item__button--delete {
  border: 1px solid #fecdd3;
  background: #fff1f2;
  color: #be123c;
}

.notification-list-item__button--delete:hover:not(:disabled) {
  border-color: #fda4af;
  background: #ffe4e6;
}

@media (max-width: 640px) {
  .notification-list-item {
    flex-direction: column;
    gap: 1rem;
  }

  .notification-list-item__pill {
    min-width: 0;
  }

  .notification-list-item__icon {
    width: 2.2rem;
    height: 2.2rem;
  }

  .notification-list-item__main,
  .notification-list-item__actions-wrap,
  .notification-list-item__actions {
    width: 100%;
  }

  .notification-list-item__main {
    gap: 0.9rem;
  }

  .notification-list-item__button {
    flex: 1;
  }
}
</style>
