<script setup>
/**
 * NotificationInboxCard
 * --------------------------------------------------------------------------
 * Notification inbox card component.
 *
 * Features:
 * - Notification list rendering
 * - Loading state
 * - Empty state
 * - Clear-all action
 * - Delete / mark-read events from child items
 * --------------------------------------------------------------------------
 */

import Loading from '@/components/feedback/Loading.vue'
import NotificationListItem from '@/modules/dashboard/components/notifications/NotificationListItem.vue'

defineOptions({
  name: 'NotificationInboxCard',
})

const props = defineProps({
  /**
   * Small section label above the inbox.
   */
  eyebrow: {
    type: String,
    required: true,
  },

  /**
   * Notification items.
   */
  notifications: {
    type: Array,
    default: () => [],
  },

  /**
   * Empty-state message.
   */
  emptyText: {
    type: String,
    default: 'No notifications to show.',
  },

  /**
   * Action labels.
   */
  markReadLabel: {
    type: String,
    default: 'Mark Read',
  },

  deleteLabel: {
    type: String,
    default: 'Delete',
  },

  clearAllLabel: {
    type: String,
    default: 'Clear All',
  },

  /**
   * Loading state.
   */
  loading: {
    type: Boolean,
    default: false,
  },

  loadingLabel: {
    type: String,
    default: 'Loading',
  },
})

const emit = defineEmits([
  'clear-all',
  'delete-notification',
  'mark-notification-read',
])

/**
 * Resolve a stable key for notification rows.
 */
function notificationKey(item, index) {
  return item?.id || item?.key || item?.title || `notification-${index}`
}

/**
 * Emit clear all only when the list is not loading.
 */
function handleClearAll() {
  if (props.loading || !props.notifications.length) return

  emit('clear-all')
}
</script>

<template>
  <article class="notification-inbox-card">
    <header class="notification-inbox-card__header">
      <p class="notification-inbox-card__eyebrow">
        {{ eyebrow }}
      </p>

      <button
        v-if="notifications.length"
        type="button"
        class="notification-inbox-card__clear"
        :disabled="loading"
        @click="handleClearAll"
      >
        <i
          class="pi pi-trash"
          aria-hidden="true"
        />

        <span>{{ clearAllLabel }}</span>
      </button>
    </header>

    <div class="notification-inbox-card__list">
      <NotificationListItem
        v-for="(item, index) in notifications"
        :key="notificationKey(item, index)"
        :item="item"
        :delete-label="deleteLabel"
        :mark-read-label="markReadLabel"
        :loading="loading"
        @delete="emit('delete-notification', $event)"
        @mark-read="emit('mark-notification-read', $event)"
      />

      <!-- Loading state -->
      <div
        v-if="loading"
        class="notification-inbox-card__loading"
      >
        <Loading
          :label="loadingLabel"
          size="sm"
        />
      </div>

      <!-- Empty state -->
      <div
        v-else-if="!notifications.length"
        class="notification-inbox-card__empty"
      >
        {{ emptyText }}
      </div>
    </div>
  </article>
</template>

<style scoped>
/**
 * Card shell.
 */
.notification-inbox-card {
  padding: 1.25rem;
  border: 1px solid #e2e8f0;
  border-radius: 1.25rem;
  background: linear-gradient(160deg, #ffffff 0%, #f8fbff 100%);
  box-shadow: 0 16px 32px rgba(15, 23, 42, 0.05);
}

/**
 * Card header.
 */
.notification-inbox-card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1rem;
}

/**
 * Eyebrow label.
 */
.notification-inbox-card__eyebrow {
  margin: 0;
  color: var(--hope-cyan);
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

/**
 * Clear-all action.
 */
.notification-inbox-card__clear {
  display: inline-flex;
  min-height: 2rem;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  padding: 0.45rem 0.75rem;
  border: 1px solid #fecdd3;
  border-radius: 9999px;
  background: #fff1f2;
  color: #be123c;
  font-size: 0.74rem;
  font-weight: 800;
  transition:
    background-color 0.18s ease,
    border-color 0.18s ease;
}

.notification-inbox-card__clear:hover:enabled {
  border-color: #fda4af;
  background: #ffe4e6;
}

.notification-inbox-card__clear:disabled {
  cursor: not-allowed;
  opacity: 0.7;
}

/**
 * Notification list.
 */
.notification-inbox-card__list {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}

/**
 * Shared loading/empty surface.
 */
.notification-inbox-card__loading,
.notification-inbox-card__empty {
  padding: 1.25rem;
  border: 1px dashed #dbe4ea;
  border-radius: 1rem;
  background: #fafcfd;
}

/**
 * Empty state text.
 */
.notification-inbox-card__empty {
  color: #64748b;
  font-size: 0.9rem;
  text-align: center;
}

@media (max-width: 640px) {
  .notification-inbox-card__header {
    align-items: flex-start;
    flex-direction: column;
  }

  .notification-inbox-card__clear {
    width: 100%;
  }
}
</style>
