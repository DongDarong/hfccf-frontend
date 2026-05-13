<script setup>
import Button from 'primevue/button'
import NotificationTypeIcon from '@/modules/notifications/components/NotificationTypeIcon.vue'

defineOptions({
  name: 'NotificationEmptyState',
})

defineProps({
  title: {
    type: String,
    default: 'No notifications',
  },
  description: {
    type: String,
    default: '',
  },
  actionLabel: {
    type: String,
    default: '',
  },
  loading: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['action'])
</script>

<template>
  <div class="notification-empty-state">
    <NotificationTypeIcon
      type="system"
      size="lg"
    />

    <div class="notification-empty-state__copy">
      <h3 class="notification-empty-state__title">
        {{ title }}
      </h3>

      <p
        v-if="description"
        class="notification-empty-state__description"
      >
        {{ description }}
      </p>
    </div>

    <Button
      v-if="actionLabel"
      type="button"
      severity="secondary"
      outlined
      :loading="loading"
      @click="emit('action')"
    >
      {{ actionLabel }}
    </Button>
  </div>
</template>

<style scoped>
.notification-empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.85rem;
  padding: 1.5rem;
  text-align: center;
}

.notification-empty-state__copy {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  max-width: 28rem;
}

.notification-empty-state__title {
  margin: 0;
  color: #0f172a;
  font-size: 1rem;
  font-weight: 800;
}

.notification-empty-state__description {
  margin: 0;
  color: #64748b;
  font-size: 0.9rem;
  line-height: 1.6;
}
</style>
