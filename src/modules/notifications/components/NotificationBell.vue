<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import Badge from 'primevue/badge'
import Button from 'primevue/button'
import Popover from 'primevue/popover'
import { fetchNotifications, markAllNotificationsAsRead, markNotificationAsRead, dismissNotification, undismissNotification } from '@/modules/notifications/services/notificationsApi'
import { useNotificationsStore } from '@/modules/notifications/stores/notificationsStore'
import NotificationDropdown from '@/modules/notifications/components/NotificationDropdown.vue'
import NotificationTypeIcon from '@/modules/notifications/components/NotificationTypeIcon.vue'
import { useLanguage } from '@/composables/useLanguage'
import { menuButtonPt } from '@/components/navigation/config/navbar.config'

defineOptions({
  name: 'NotificationBell',
})

const router = useRouter()
const notificationsStore = useNotificationsStore()
const overlayRef = ref(null)
const dropdownLoading = ref(false)
const dropdownItems = ref([])
const { t } = useLanguage()

const unreadCount = computed(() => notificationsStore.unreadCount)

function normalizeItems(payload) {
  const collection = Array.isArray(payload)
    ? payload
    : Array.isArray(payload?.items)
      ? payload.items
      : Array.isArray(payload?.notifications)
        ? payload.notifications
        : Array.isArray(payload?.data)
          ? payload.data
          : []

  return collection.map((item) => ({
    ...item,
    id: item.id ?? item.uuid ?? item.key ?? '',
    type: String(item.type || item.level || item.category || 'system').trim().toLowerCase(),
    module: String(item.module || item.domain || 'global').trim().toLowerCase(),
    title: String(item.title || item.subject || '').trim(),
    message: String(item.message || item.body || item.content || '').trim(),
    read: Boolean(item.read || item.is_read || item.read_at || item.readAt),
    dismissed: Boolean(item.dismissed || item.dismissed_at || item.dismissedAt),
    createdAt: item.created_at || item.createdAt || item.sent_at || item.timestamp || '',
  }))
}

async function loadDropdownItems() {
  dropdownLoading.value = true

  try {
    const payload = await fetchNotifications({
      page: 1,
      perPage: 5,
    })

    dropdownItems.value = normalizeItems(payload).slice(0, 5)
  } catch {
    dropdownItems.value = []
  } finally {
    dropdownLoading.value = false
  }
}

async function openDropdown(event) {
  overlayRef.value?.toggle(event)
  await loadDropdownItems()
}

async function handleRead(notification) {
  if (!notification?.id) return

  try {
    await markNotificationAsRead(notification.id)
    dropdownItems.value = dropdownItems.value.map((item) =>
      String(item.id) === String(notification.id)
        ? { ...item, read: true, read_at: item.read_at || new Date().toISOString() }
        : item,
    )
    await notificationsStore.loadUnreadCount()
  } catch {
    // Keep the dropdown usable if the backend rejects the change.
  }
}

async function handleDismiss(notification) {
  if (!notification?.id) return

  try {
    await dismissNotification(notification.id)
    dropdownItems.value = dropdownItems.value.filter((item) => String(item.id) !== String(notification.id))
    await notificationsStore.loadUnreadCount()
  } catch {
    // Keep the dropdown usable if the backend rejects the change.
  }
}

async function handleUndismiss(notification) {
  if (!notification?.id) return

  try {
    await undismissNotification(notification.id)
    await loadDropdownItems()
    await notificationsStore.loadUnreadCount()
  } catch {
    // Keep the dropdown usable if the backend rejects the change.
  }
}

async function handleMarkAllRead() {
  try {
    await markAllNotificationsAsRead()
    dropdownItems.value = dropdownItems.value.map((item) => ({
      ...item,
      read: true,
      read_at: item.read_at || new Date().toISOString(),
    }))
    await notificationsStore.loadUnreadCount()
  } catch {
    // Keep the dropdown usable if the backend rejects the change.
  }
}

function goToNotificationsPage() {
  overlayRef.value?.hide()
  router.push({ name: 'notifications' })
}

onMounted(() => {
  void notificationsStore.loadUnreadCount()
})
</script>

<template>
  <div class="relative">
    <Button
      type="button"
      severity="secondary"
      text
      rounded
      class="icon-btn icon-btn--notification"
      :pt="menuButtonPt"
      :aria-label="t('common.notifications.title')"
      @click="openDropdown"
    >
      <template #icon>
        <div class="relative flex items-center justify-center">
          <NotificationTypeIcon
            type="system"
            size="sm"
          />

          <Badge
            v-if="unreadCount > 0"
            :value="unreadCount"
            severity="danger"
            class="notification-bell__badge"
          />
        </div>
      </template>
    </Button>

    <Popover
      ref="overlayRef"
      class="notification-bell__panel"
    >
      <NotificationDropdown
        :notifications="dropdownItems"
        :loading="dropdownLoading"
        :unread-count="unreadCount"
        @read="handleRead"
        @dismiss="handleDismiss"
        @undismiss="handleUndismiss"
        @mark-all-read="handleMarkAllRead"
        @view-all="goToNotificationsPage"
      />
    </Popover>
  </div>
</template>

<style scoped>
.notification-bell__badge {
  position: absolute;
  top: -0.4rem;
  right: -0.45rem;
  min-width: 1.15rem;
  height: 1.15rem;
  padding: 0 0.25rem;
  border: 2px solid #ffffff;
  border-radius: 9999px;
  font-size: 0.62rem;
  line-height: 1;
}

:deep(.notification-bell__panel.p-popover) {
  padding: 0;
  border: 0;
  background: transparent;
  box-shadow: none;
}
</style>
