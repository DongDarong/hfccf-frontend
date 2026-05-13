<script setup>
import { computed, onBeforeUnmount, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import Card from 'primevue/card'
import Select from 'primevue/select'
import Button from 'primevue/button'
import MainLayout from '@/layouts/MainLayout.vue'
import HeaderSection from '@/components/navigation/HeaderSection.vue'
import SearchInputField from '@/components/forms/SearchInputField.vue'
import Pagination from '@/components/data-display/Pagination.vue'
import NotificationFilterTabs from '@/modules/dashboard/components/notifications/NotificationFilterTabs.vue'
import NotificationInboxCard from '@/modules/notifications/components/NotificationInboxCard.vue'
import { useLanguage } from '@/composables/useLanguage'
import { hasPermission } from '@/services/auth'
import { useUserStore } from '@/store/userStore'
import { useNotificationsStore } from '@/modules/notifications/stores/notificationsStore'

defineOptions({
  name: 'NotificationsPage',
})

const router = useRouter()
const userStore = useUserStore()
const notificationsStore = useNotificationsStore()
const { t } = useLanguage()

const typeOptions = computed(() => [
  { label: t('notifications.types.all'), value: '' },
  { label: t('notifications.types.info'), value: 'info' },
  { label: t('notifications.types.success'), value: 'success' },
  { label: t('notifications.types.warning'), value: 'warning' },
  { label: t('notifications.types.error'), value: 'error' },
  { label: t('notifications.types.system'), value: 'system' },
])

const moduleOptions = computed(() => [
  { label: t('notifications.modules.all'), value: '' },
  { label: t('notifications.modules.global'), value: 'global' },
  { label: t('notifications.modules.english'), value: 'english' },
  { label: t('notifications.modules.preschool'), value: 'preschool' },
  { label: t('notifications.modules.scholarship'), value: 'scholarship' },
  { label: t('notifications.modules.sport'), value: 'sport' },
])

const statusTabs = computed(() => [
  { value: 'all', label: t('notifications.filters.all'), count: notificationsStore.pagination.total || notificationsStore.items.length },
  { value: 'unread', label: t('notifications.unread'), count: notificationsStore.items.filter((item) => !item.read && !item.dismissed).length },
  { value: 'read', label: t('notifications.read'), count: notificationsStore.items.filter((item) => item.read && !item.dismissed).length },
  { value: 'dismissed', label: t('notifications.dismissed'), count: notificationsStore.items.filter((item) => item.dismissed).length },
])

const pageTitle = computed(() => t('notifications.title'))
const pageSubtitle = computed(() => t('notifications.subtitle'))
const emptyTitle = computed(() => t('notifications.empty'))
const emptyDescription = computed(() => t('notifications.emptyDescription'))
const loadingLabel = computed(() => t('notifications.loading'))
const markAllReadLabel = computed(() => t('notifications.markAllRead'))
const readLabel = computed(() => t('notifications.read'))
const dismissLabel = computed(() => t('notifications.dismiss'))
const searchPlaceholder = computed(() => t('notifications.searchPlaceholder'))
const createLabel = computed(() => t('notifications.create'))
const showCreateAction = computed(() => hasPermission('all:*', userStore.currentUser))

const filteredNotifications = computed(() => {
  const status = String(notificationsStore.filters.status || 'all')

  return notificationsStore.items.filter((item) => {
    const readState = item.read ? 'read' : 'unread'
    const itemStatus = item.dismissed ? 'dismissed' : readState
    const matchesStatus = status === 'all' || itemStatus === status
    const matchesType = !notificationsStore.filters.type || item.type === notificationsStore.filters.type
    const matchesModule = !notificationsStore.filters.module || item.module === notificationsStore.filters.module
    const search = String(notificationsStore.filters.search || '').trim().toLowerCase()
    const haystack = `${item.title} ${item.message}`.toLowerCase()
    const matchesSearch = !search || haystack.includes(search)

    return matchesStatus && matchesType && matchesModule && matchesSearch
  })
})

const pageCount = computed(() =>
  Math.max(notificationsStore.pagination.lastPage || Math.ceil((notificationsStore.pagination.total || filteredNotifications.value.length) / notificationsStore.pagination.perPage), 1),
)

let searchDebounceId = null

async function loadCurrentPage() {
  await notificationsStore.loadNotifications({
    page: notificationsStore.pagination.page,
    perPage: notificationsStore.pagination.perPage,
  })
}

async function loadPageFromFilters({ resetPage = false } = {}) {
  const shouldLoadImmediately = resetPage && notificationsStore.pagination.page === 1

  if (resetPage) {
    notificationsStore.pagination.page = 1
  }

  if (shouldLoadImmediately) {
    await loadCurrentPage()
  }
}

async function handleMarkAllRead() {
  await notificationsStore.markAllAsRead()
}

async function handleRead(notification) {
  await notificationsStore.markAsRead(notification.id)
}

async function handleDismiss(notification) {
  await notificationsStore.dismiss(notification.id)
}

function goToCreateNotification() {
  router.push({ name: 'notifications-create' })
}

function onStatusTabChange(value) {
  notificationsStore.filters.status = value
  void loadPageFromFilters({ resetPage: true })
}

function onTypeChange(value) {
  notificationsStore.filters.type = value
  void loadPageFromFilters({ resetPage: true })
}

function onModuleChange(value) {
  notificationsStore.filters.module = value
  void loadPageFromFilters({ resetPage: true })
}

function onSearchChange(value) {
  notificationsStore.filters.search = value

  if (searchDebounceId) {
    window.clearTimeout(searchDebounceId)
  }

  searchDebounceId = window.setTimeout(() => {
    void loadPageFromFilters({ resetPage: true })
  }, 300)
}

watch(
  () => notificationsStore.pagination.page,
  () => {
    void loadCurrentPage()
  },
)

onMounted(async () => {
  await Promise.all([
    notificationsStore.loadUnreadCount(),
    notificationsStore.loadNotifications(),
  ])
})

onBeforeUnmount(() => {
  if (searchDebounceId) {
    window.clearTimeout(searchDebounceId)
  }
})
</script>

<template>
  <MainLayout>
    <section class="notifications-page">
      <HeaderSection
        :title="pageTitle"
        :subtitle="pageSubtitle"
      />

      <div class="notifications-page__toolbar">
        <SearchInputField
          :model-value="notificationsStore.filters.search"
          :placeholder="searchPlaceholder"
          @update:model-value="onSearchChange"
        />

        <div class="notifications-page__selects">
          <Select
            :model-value="notificationsStore.filters.type"
            :options="typeOptions"
            option-label="label"
            option-value="value"
            class="notifications-page__select"
            @update:model-value="onTypeChange"
          />

          <Select
            :model-value="notificationsStore.filters.module"
            :options="moduleOptions"
            option-label="label"
            option-value="value"
            class="notifications-page__select"
            @update:model-value="onModuleChange"
          />
        </div>

        <Button
          v-if="showCreateAction"
          type="button"
          @click="goToCreateNotification"
        >
          {{ createLabel }}
        </Button>
      </div>

      <NotificationFilterTabs
        :tabs="statusTabs"
        :active-tab="notificationsStore.filters.status"
        :disabled="notificationsStore.loading"
        @update:activeTab="onStatusTabChange"
      />

      <NotificationInboxCard
        :title="t('notifications.inbox')"
        :subtitle="t('notifications.inboxSubtitle')"
        :notifications="filteredNotifications"
        :loading="notificationsStore.loading"
        :loading-label="loadingLabel"
        :empty-title="emptyTitle"
        :empty-description="emptyDescription"
        :read-label="readLabel"
        :dismiss-label="dismissLabel"
        :mark-all-read-label="markAllReadLabel"
        @mark-all-read="handleMarkAllRead"
        @read="handleRead"
        @dismiss="handleDismiss"
      />

      <div
        v-if="pageCount > 1"
        class="notifications-page__pagination"
      >
        <Pagination
          v-model="notificationsStore.pagination.page"
          :total-pages="pageCount"
          :disabled="notificationsStore.loading"
        />
      </div>

      <Card
        v-if="notificationsStore.error"
        class="notifications-page__error-card"
      >
        <template #title>
          {{ t('common.error') }}
        </template>

        <template #content>
          <div class="flex flex-col gap-3">
            <p class="text-sm text-slate-600">
              {{ notificationsStore.error }}
            </p>

            <div>
              <Button
                type="button"
                severity="secondary"
                outlined
                :disabled="notificationsStore.loading"
                @click="loadCurrentPage"
              >
                {{ t('common.refresh') }}
              </Button>
            </div>
          </div>
        </template>
      </Card>
    </section>
  </MainLayout>
</template>

<style scoped>
.notifications-page {
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
}

.notifications-page__toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.85rem;
  padding: 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 1.25rem;
  background: #ffffff;
  box-shadow: 0 18px 34px -34px rgba(15, 23, 42, 0.25);
}

.notifications-page__selects {
  display: flex;
  flex: 1 1 auto;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.notifications-page__select {
  min-width: 11rem;
}

.notifications-page__pagination {
  display: flex;
  justify-content: flex-end;
}

.notifications-page__error-card {
  border: 1px solid #fecaca;
  border-radius: 1.1rem;
}

@media (max-width: 768px) {
  .notifications-page__selects,
  .notifications-page__select,
  .notifications-page__toolbar > :deep(.ui-search-input) {
    width: 100%;
  }
}
</style>
