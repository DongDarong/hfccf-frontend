<script setup>
import Button from 'primevue/button'
import Loading from '@/components/feedback/Loading.vue'
import NotificationItem from '@/modules/notifications/components/NotificationItem.vue'
import NotificationEmptyState from '@/modules/notifications/components/NotificationEmptyState.vue'

defineOptions({
  name: 'NotificationInboxCard',
})

defineProps({
  title: {
    type: String,
    required: true,
  },
  subtitle: {
    type: String,
    default: '',
  },
  notifications: {
    type: Array,
    default: () => [],
  },
  loading: {
    type: Boolean,
    default: false,
  },
  loadingLabel: {
    type: String,
    default: 'Loading notifications',
  },
  emptyTitle: {
    type: String,
    default: 'No notifications',
  },
  emptyDescription: {
    type: String,
    default: '',
  },
  readLabel: {
    type: String,
    default: 'Mark as read',
  },
  dismissLabel: {
    type: String,
    default: 'Dismiss',
  },
  markAllReadLabel: {
    type: String,
    default: 'Mark all as read',
  },
  showMarkAll: {
    type: Boolean,
    default: true,
  },
})

const emit = defineEmits(['read', 'dismiss', 'mark-all-read'])

function notificationKey(item, index) {
  return item?.id || item?.uuid || item?.key || `notification-${index}`
}
</script>

<template>
  <section class="notification-inbox-card">
    <header class="notification-inbox-card__header">
      <div class="min-w-0">
        <p class="notification-inbox-card__eyebrow">
          {{ title }}
        </p>

        <p
          v-if="subtitle"
          class="notification-inbox-card__subtitle"
        >
          {{ subtitle }}
        </p>
      </div>

      <Button
        v-if="showMarkAll"
        type="button"
        severity="secondary"
        text
        size="small"
        :disabled="loading || !notifications.length"
        @click="emit('mark-all-read')"
      >
        {{ markAllReadLabel }}
      </Button>
    </header>

    <div class="notification-inbox-card__body">
      <div
        v-if="loading"
        class="notification-inbox-card__state"
      >
        <Loading
          :label="loadingLabel"
          size="sm"
        />
      </div>

      <NotificationEmptyState
        v-else-if="!notifications.length"
        :title="emptyTitle"
        :description="emptyDescription"
      />

      <div
        v-else
        class="notification-inbox-card__list"
      >
        <NotificationItem
          v-for="(item, index) in notifications"
          :key="notificationKey(item, index)"
          :notification="item"
          :read-label="readLabel"
          :dismiss-label="dismissLabel"
          @read="emit('read', $event)"
          @dismiss="emit('dismiss', $event)"
        />
      </div>
    </div>
  </section>
</template>

<style scoped>
.notification-inbox-card {
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
  padding: 1.1rem;
  border: 1px solid #e2e8f0;
  border-radius: 1.25rem;
  background: linear-gradient(180deg, #ffffff 0%, #f8fbff 100%);
  box-shadow: 0 18px 40px -32px rgba(15, 23, 42, 0.32);
}

.notification-inbox-card__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.75rem;
}

.notification-inbox-card__eyebrow {
  margin: 0;
  color: #0f172a;
  font-size: 1rem;
  font-weight: 800;
}

.notification-inbox-card__subtitle {
  margin: 0.2rem 0 0;
  color: #64748b;
  font-size: 0.86rem;
  line-height: 1.55;
}

.notification-inbox-card__body {
  min-width: 0;
}

.notification-inbox-card__list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.notification-inbox-card__state {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 9rem;
  border: 1px dashed #dbe4ea;
  border-radius: 1rem;
  color: #64748b;
  font-size: 0.9rem;
}

@media (max-width: 640px) {
  .notification-inbox-card__header {
    flex-direction: column;
  }
}
</style>
