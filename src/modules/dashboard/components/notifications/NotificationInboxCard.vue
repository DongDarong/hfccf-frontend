<script setup>
import ModernNotificationInboxCard from '@/modules/notifications/components/NotificationInboxCard.vue'

defineOptions({
  name: 'NotificationInboxCard',
})

defineProps({
  eyebrow: {
    type: String,
    required: true,
  },
  notifications: {
    type: Array,
    default: () => [],
  },
  emptyText: {
    type: String,
    default: 'No notifications to show.',
  },
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
  loading: {
    type: Boolean,
    default: false,
  },
  loadingLabel: {
    type: String,
    default: 'Loading',
  },
})

const emit = defineEmits(['clear-all', 'delete-notification', 'mark-notification-read'])
</script>

<template>
  <ModernNotificationInboxCard
    :title="eyebrow"
    :subtitle="''"
    :notifications="notifications"
    :loading="loading"
    :loading-label="loadingLabel"
    :empty-title="emptyText"
    :empty-description="''"
    :read-label="markReadLabel"
    :dismiss-label="deleteLabel"
    :mark-all-read-label="clearAllLabel"
    @mark-all-read="emit('clear-all')"
    @read="emit('mark-notification-read', $event)"
    @dismiss="emit('delete-notification', $event)"
  />
</template>
