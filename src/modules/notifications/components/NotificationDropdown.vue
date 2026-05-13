<script setup>
import { computed } from 'vue'
import Button from 'primevue/button'
import Divider from 'primevue/divider'
import ScrollPanel from 'primevue/scrollpanel'
import Loading from '@/components/feedback/Loading.vue'
import NotificationItem from '@/modules/notifications/components/NotificationItem.vue'
import NotificationEmptyState from '@/modules/notifications/components/NotificationEmptyState.vue'
import { useLanguage } from '@/composables/useLanguage'

defineOptions({
  name: 'NotificationDropdown',
})

const props = defineProps({
  notifications: {
    type: Array,
    default: () => [],
  },
  loading: {
    type: Boolean,
    default: false,
  },
  unreadCount: {
    type: Number,
    default: 0,
  },
})

const emit = defineEmits(['mark-all-read', 'view-all', 'read', 'dismiss', 'undismiss'])

const { t } = useLanguage()

const hasNotifications = computed(() => props.notifications.length > 0)

function handleMarkAllRead() {
  if (props.loading || !hasNotifications.value) return

  emit('mark-all-read')
}
</script>

<template>
  <section class="notification-dropdown">
    <header class="notification-dropdown__header">
      <div>
        <p class="notification-dropdown__eyebrow">
          {{ t('notifications.title') }}
        </p>

        <p class="notification-dropdown__count">
          {{ t('notifications.unreadCount', { count: unreadCount }) }}
        </p>
      </div>

      <Button
        type="button"
        severity="secondary"
        text
        size="small"
        :disabled="loading || !hasNotifications"
        @click="handleMarkAllRead"
      >
        {{ t('notifications.markAllRead') }}
      </Button>
    </header>

    <Divider class="notification-dropdown__divider" />

    <ScrollPanel
      class="notification-dropdown__scroll"
      :style="{ width: '100%', height: '18rem' }"
    >
      <div class="notification-dropdown__list">
        <NotificationItem
          v-for="item in notifications"
          :key="item.id"
          :notification="item"
          :read-label="t('notifications.read')"
          :dismiss-label="t('notifications.dismiss')"
          :undismiss-label="t('notifications.undismiss')"
          :show-actions="true"
          compact
          @read="emit('read', $event)"
          @dismiss="emit('dismiss', $event)"
          @undismiss="emit('undismiss', $event)"
        />

        <NotificationEmptyState
          v-if="!hasNotifications && !loading"
          :title="t('notifications.empty')"
          :description="t('notifications.emptyDescription')"
        />

        <div
          v-if="loading"
          class="notification-dropdown__loading"
        >
          <Loading
            :label="t('common.loading')"
            size="sm"
          />
        </div>
      </div>
    </ScrollPanel>

    <Divider class="notification-dropdown__divider" />

    <footer class="notification-dropdown__footer">
      <Button
        type="button"
        severity="secondary"
        outlined
        size="small"
        class="w-full"
        @click="emit('view-all')"
      >
        {{ t('notifications.viewAll') }}
      </Button>
    </footer>
  </section>
</template>

<style scoped>
.notification-dropdown {
  width: min(92vw, 26rem);
  padding: 0.9rem;
  border: 1px solid #e2e8f0;
  border-radius: 1.1rem;
  background: #ffffff;
  box-shadow: 0 28px 60px -34px rgba(15, 23, 42, 0.35);
}

.notification-dropdown__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.75rem;
}

.notification-dropdown__eyebrow {
  margin: 0;
  color: #0f172a;
  font-size: 0.92rem;
  font-weight: 800;
}

.notification-dropdown__count {
  margin: 0.15rem 0 0;
  color: #64748b;
  font-size: 0.76rem;
}

.notification-dropdown__divider {
  margin: 0.75rem 0;
}

.notification-dropdown__list {
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
  padding-right: 0.35rem;
}

.notification-dropdown__loading {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 8rem;
  color: #64748b;
  font-size: 0.88rem;
}

.notification-dropdown__footer {
  display: flex;
  gap: 0.5rem;
}
</style>
