<script setup>
import { computed, ref } from 'vue'
import MainLayout from '@/layouts/MainLayout.vue'
import HeaderSection from '@/components/navigation/HeaderSection.vue'
import { useLanguage } from '@/composables/useLanguage'
import AlertQuestion from '@/components/alerts/AlertQuestion.vue'
import NotificationFilterTabs from '@/modules/dashboard/components/notifications/NotificationFilterTabs.vue'
import NotificationInboxCard from '@/modules/dashboard/components/notifications/NotificationInboxCard.vue'

const { t, language } = useLanguage()
const isKh = computed(() => language.value === 'KH')

const title = computed(() => t('common.notifications'))
const readNotificationIds = ref([])
const deletedNotificationIds = ref([])
const confirmAction = ref(null)
const pendingNotification = ref(null)
const isLoading = ref(false)
const activeFilter = ref('all')
const subtitle = computed(() =>
  isKh.value
    ? 'មើលការជូនដំណឹងថ្មីៗ និងសកម្មភាពដែលត្រូវការតាមដានពីគ្រប់ផ្នែកការងារ។'
    : 'Review recent alerts and activity updates that need follow-up across the workspace.',
)

const notifications = computed(() => [
  {
    id: 'approval-requests',
    tone: 'danger',
    label: isKh.value ? 'ត្រូវការឆ្លើយតប' : 'Needs action',
    title: isKh.value ? 'មានសំណើអនុម័តថ្មី 4' : '4 new approval requests are waiting',
    detail: isKh.value
      ? 'តាមដានពីផ្ទាំងការងាររដ្ឋបាល និងកម្មវិធី'
      : 'Follow up from administration and program dashboards',
  },
  {
    id: 'schedule-updated',
    tone: 'info',
    label: isKh.value ? 'ព័ត៌មាន' : 'Update',
    title: isKh.value ? 'កាលវិភាគប្រចាំថ្ងៃត្រូវបានធ្វើបច្ចុប្បន្នភាព' : 'The shared daily schedule was updated',
    detail: isKh.value ? 'ពិនិត្យព្រឹត្តិការណ៍ និងកិច្ចប្រជុំបន្ថែម' : 'Check new meetings and event changes',
  },
  {
    id: 'backup-completed',
    tone: 'success',
    label: isKh.value ? 'បានបញ្ចប់' : 'Completed',
    title: isKh.value ? 'ការបម្រុងទុកប្រព័ន្ធបានសម្រេច' : 'System backup completed successfully',
    detail: isKh.value ? 'មិនត្រូវការសកម្មភាពបន្ថែម' : 'No further action is required',
  },
])

const inboxLabel = computed(() => (isKh.value ? 'ប្រអប់ជូនដំណឹង' : 'Inbox'))
const emptyText = computed(() => (isKh.value ? 'មិនមានការជូនដំណឹងត្រូវបង្ហាញ។' : 'No notifications to show.'))
const markReadLabel = computed(() => (isKh.value ? 'បានអាន' : 'Mark Read'))
const deleteLabel = computed(() => (isKh.value ? 'លុប' : 'Delete'))
const clearAllLabel = computed(() => (isKh.value ? 'លុបទាំងអស់' : 'Clear All'))
const cancelLabel = computed(() => (isKh.value ? 'បោះបង់' : 'Cancel'))
const loadingLabel = computed(() => (isKh.value ? 'កំពុងដំណើរការ' : 'Updating notifications'))
const visibleNotifications = computed(() =>
  notifications.value
    .filter((item) => !deletedNotificationIds.value.includes(item.id))
    .map((item) => ({
      ...item,
      read: readNotificationIds.value.includes(item.id),
    })),
)
const unreadNotifications = computed(() => visibleNotifications.value.filter((item) => !item.read))
const readNotifications = computed(() => visibleNotifications.value.filter((item) => item.read))
const filteredNotifications = computed(() => {
  if (activeFilter.value === 'unread') return unreadNotifications.value
  if (activeFilter.value === 'read') return readNotifications.value
  return visibleNotifications.value
})
const filterTabs = computed(() => [
  {
    value: 'all',
    label: isKh.value ? 'ទាំងអស់' : 'All',
    count: visibleNotifications.value.length,
  },
  {
    value: 'unread',
    label: isKh.value ? 'មិនទាន់អាន' : 'Unread',
    count: unreadNotifications.value.length,
  },
  {
    value: 'read',
    label: isKh.value ? 'បានអាន' : 'Read',
    count: readNotifications.value.length,
  },
])
const filteredEmptyText = computed(() => {
  if (activeFilter.value === 'unread') {
    return isKh.value ? 'មិនមានការជូនដំណឹងមិនទាន់អានទេ។' : 'No unread notifications to show.'
  }

  if (activeFilter.value === 'read') {
    return isKh.value ? 'មិនមានការជូនដំណឹងដែលបានអានទេ។' : 'No read notifications to show.'
  }

  return emptyText.value
})
const alertTitle = computed(() => {
  if (confirmAction.value === 'clear-all') {
    return isKh.value ? 'លុបការជូនដំណឹងទាំងអស់?' : 'Clear all notifications?'
  }

  return isKh.value ? 'លុបការជូនដំណឹង?' : 'Delete notification?'
})
const alertMessage = computed(() => {
  if (confirmAction.value === 'clear-all') {
    return isKh.value
      ? 'តើអ្នកពិតជាចង់លុបការជូនដំណឹងទាំងអស់មែនទេ? សកម្មភាពនេះមិនអាចត្រឡប់វិញបានទេ។'
      : 'Are you sure you want to clear all notifications? This action cannot be undone.'
  }

  const notificationTitle = pendingNotification.value?.title || (isKh.value ? 'ការជូនដំណឹងនេះ' : 'this notification')
  return isKh.value
    ? `តើអ្នកពិតជាចង់លុប "${notificationTitle}" មែនទេ?`
    : `Are you sure you want to delete "${notificationTitle}"?`
})

function markNotificationRead(item) {
  if (isLoading.value) return
  if (!item?.id || readNotificationIds.value.includes(item.id)) return
  runNotificationAction(() => {
    readNotificationIds.value = [...readNotificationIds.value, item.id]
  })
}

function deleteNotification(item) {
  if (isLoading.value) return
  if (!item?.id || deletedNotificationIds.value.includes(item.id)) return
  pendingNotification.value = item
  confirmAction.value = 'delete'
}

function clearAllNotifications() {
  if (isLoading.value) return
  if (!visibleNotifications.value.length) return
  pendingNotification.value = null
  confirmAction.value = 'clear-all'
}

function cancelQuestion() {
  confirmAction.value = null
  pendingNotification.value = null
}

function confirmQuestion() {
  if (isLoading.value) return
  const action = confirmAction.value
  const notificationId = pendingNotification.value?.id

  cancelQuestion()

  runNotificationAction(() => {
    if (action === 'delete' && notificationId) {
      deletedNotificationIds.value = [...deletedNotificationIds.value, notificationId]
    }

    if (action === 'clear-all') {
      deletedNotificationIds.value = notifications.value.map((item) => item.id)
    }
  })
}

function runNotificationAction(callback) {
  isLoading.value = true
  window.setTimeout(() => {
    callback()
    isLoading.value = false
  }, 350)
}
</script>

<template>
  <MainLayout>
    <section :class="isKh ? 'global-page global-page--kh' : 'global-page'">
      <HeaderSection :title="title" :subtitle="subtitle" />

      <NotificationFilterTabs
        v-model:active-tab="activeFilter"
        :tabs="filterTabs"
        :disabled="isLoading"
      />

      <NotificationInboxCard
        :eyebrow="inboxLabel"
        :notifications="filteredNotifications"
        :empty-text="filteredEmptyText"
        :mark-read-label="markReadLabel"
        :delete-label="deleteLabel"
        :clear-all-label="clearAllLabel"
        :loading="isLoading"
        :loading-label="loadingLabel"
        @clear-all="clearAllNotifications"
        @mark-notification-read="markNotificationRead"
        @delete-notification="deleteNotification"
      />

      <AlertQuestion
        :show="Boolean(confirmAction)"
        :title="alertTitle"
        :message="alertMessage"
        :confirm-text="confirmAction === 'clear-all' ? clearAllLabel : deleteLabel"
        :cancel-text="cancelLabel"
        type="danger"
        @confirm="confirmQuestion"
        @cancel="cancelQuestion"
      />
    </section>
  </MainLayout>
</template>

<style scoped>
.global-page {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.global-page--kh :deep(.notification-inbox-card__eyebrow),
.global-page--kh :deep(.notification-inbox-card__empty),
.global-page--kh :deep(.notification-filter-tabs__button),
.global-page--kh :deep(.notification-list-item__pill),
.global-page--kh :deep(.notification-list-item__title),
.global-page--kh :deep(.notification-list-item__detail) {
  font-family:
    'Noto Sans Khmer', 'Khmer OS Siemreap', 'Khmer OS Battambang', 'Leelawadee UI', sans-serif;
}

.global-page--kh :deep(.notification-inbox-card__eyebrow) {
  text-transform: none;
  letter-spacing: 0.01em;
}
</style>
