<script setup>
import { computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import MainLayout from '@/layouts/MainLayout.vue'
import HeaderSection from '@/components/navigation/HeaderSection.vue'
import SearchFilterBar from '@/components/forms/SearchFilterBar.vue'
import Table from '@/components/data-display/Table.vue'
import Pagination from '@/components/data-display/Pagination.vue'
import CoachManagementSummaryGrid from '@/modules/sport/admin/components/coach-management/CoachManagementSummaryGrid.vue'
import CoachManagementToolbar from '@/modules/sport/admin/components/coach-management/CoachManagementToolbar.vue'
import CoachManagementHighlights from '@/modules/sport/admin/components/coach-management/CoachManagementHighlights.vue'
import usersMock from '@/mocks/users.json'
import { ROLES } from '@/constants/roles'
import { useLanguage } from '@/composables/useLanguage'
import { mapUser } from '@/services/mappers/userMapper'

defineOptions({
  name: 'SportCoachManagementPage',
})

const router = useRouter()
const { t, language } = useLanguage()
const searchQuery = ref('')
const roleFilter = ref('')
const statusFilter = ref('')
const currentPage = ref(1)

const pageSize = 8
const isKh = computed(() => language.value === 'KH')
const roleOptions = [ROLES.COACH]
const statusOptions = ['Active', 'Pending', 'Inactive', 'Suspended']
const pageTitle = computed(() => t('sportCoachManagement.title'))
const pageSubtitle = computed(
  () => t('sportCoachManagement.subtitle'),
)
const addCoachLabel = computed(() => t('sportCoachManagement.addButton'))
const addCoachCaption = computed(() => t('sportCoachManagement.addButtonCaption'))
const searchPlaceholder = computed(() => t('sportCoachManagement.searchPlaceholder'))
const toolbarEyebrow = computed(() => t('sportCoachManagement.toolbarEyebrow'))
const tableEmptyText = computed(() => t('sportCoachManagement.tableEmpty'))
const activeRateTitle = computed(() => t('sportCoachManagement.activeRateLabel'))
const tableColumns = computed(() => [
  { key: 'number', label: t('common.table.number'), align: 'left' },
  { key: 'user', label: t('common.table.user'), align: 'left' },
  { key: 'email', label: t('common.table.email'), align: 'left' },
  { key: 'role', label: t('common.table.role'), align: 'left' },
  { key: 'permission', label: t('common.table.permission'), align: 'left' },
  { key: 'status', label: t('common.table.status'), align: 'left' },
  { key: 'phone', label: t('common.table.phone'), align: 'left' },
  { key: 'actions', label: t('common.table.actions'), align: 'right' },
])

function goToAddCoach() {
  router.push({ path: '/module/sport-admin/users/add' })
}

const coachUsers = ref(
  usersMock
    .filter((item) => String(item.role || '').toLowerCase() === ROLES.COACH)
    .map((item) => mapUser(item)),
)

const filteredUsers = computed(() => {
  const query = String(searchQuery.value || '')
    .trim()
    .toLowerCase()

  return coachUsers.value.filter((user) => {
    let isMatch = true

    if (query) {
      const haystack =
        `${user.name} ${user.email} ${user.role} ${user.permissions.join(' ')}`.toLowerCase()
      isMatch = haystack.includes(query)
    }

    if (isMatch && roleFilter.value) {
      isMatch = String(user.role).toLowerCase() === roleFilter.value.toLowerCase()
    }

    if (isMatch && statusFilter.value) {
      isMatch = String(user.status).toLowerCase() === statusFilter.value.toLowerCase()
    }

    return isMatch
  })
})

const totalPages = computed(() => Math.max(Math.ceil(filteredUsers.value.length / pageSize), 1))
const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredUsers.value.slice(start, start + pageSize).map((user, index) => ({
    ...user,
    rowNumber: start + index + 1,
  }))
})

const totalCoaches = computed(() => coachUsers.value.length)
const activeCount = computed(
  () => coachUsers.value.filter((user) => String(user.status).toLowerCase() === 'active').length,
)
const pendingCount = computed(
  () => coachUsers.value.filter((user) => String(user.status).toLowerCase() === 'pending').length,
)
const attentionCount = computed(
  () =>
    coachUsers.value.filter((user) =>
      ['inactive', 'suspended'].includes(String(user.status).toLowerCase()),
    ).length,
)
const activeRateLabel = computed(() => {
  if (!totalCoaches.value) return '0%'
  return `${Math.round((activeCount.value / totalCoaches.value) * 100)}%`
})
const toolbarSummary = computed(() =>
  t('sportCoachManagement.toolbarSummary', { count: filteredUsers.value.length }),
)
const visibleRangeLabel = computed(() => {
  if (!filteredUsers.value.length) return t('sportCoachManagement.noResults')

  const start = (currentPage.value - 1) * pageSize + 1
  const end = Math.min(currentPage.value * pageSize, filteredUsers.value.length)
  return t('sportCoachManagement.visibleRange', {
    start,
    end,
    total: filteredUsers.value.length,
  })
})
const summaryCards = computed(() => [
  {
    id: 'total',
    title: t('sportCoachManagement.summary.total.title'),
    value: totalCoaches.value,
    badge: t('sportCoachManagement.summary.total.badge', { count: filteredUsers.value.length }),
    caption: t('sportCoachManagement.summary.total.caption'),
    tone: 'info',
    icon:
      'M17 20h5V4H2v16h5m10 0v-5.5a2.5 2.5 0 00-2.5-2.5h-5A2.5 2.5 0 007 14.5V20m10 0H7m7-12a3 3 0 11-6 0 3 3 0 016 0z',
  },
  {
    id: 'active',
    title: t('sportCoachManagement.summary.active.title'),
    value: activeCount.value,
    badge: t('sportCoachManagement.summary.active.badge', { rate: activeRateLabel.value }),
    caption: t('sportCoachManagement.summary.active.caption'),
    tone: 'success',
    icon: 'M5 13l4 4L19 7',
  },
  {
    id: 'pending',
    title: t('sportCoachManagement.summary.pending.title'),
    value: pendingCount.value,
    badge: pendingCount.value
      ? t('sportCoachManagement.summary.pending.badge')
      : t('sportCoachManagement.summary.pending.badgeClear'),
    caption: t('sportCoachManagement.summary.pending.caption'),
    tone: 'warning',
    icon:
      'M12 8v4m0 4h.01M10.3 3.86l-7.5 13a1 1 0 00.87 1.5h16.66a1 1 0 00.87-1.5l-7.5-13a1 1 0 00-1.74 0z',
  },
  {
    id: 'attention',
    title: t('sportCoachManagement.summary.attention.title'),
    value: attentionCount.value,
    badge: attentionCount.value
      ? t('sportCoachManagement.summary.attention.badge')
      : t('sportCoachManagement.summary.attention.badgeClear'),
    caption: t('sportCoachManagement.summary.attention.caption'),
    tone: 'danger',
    icon: 'M6 18L18 6M6 6l12 12',
  },
])
const highlightItems = computed(() => [
  {
    label: t('sportCoachManagement.highlights.visibleRoster'),
    value: filteredUsers.value.length,
  },
  {
    label: t('sportCoachManagement.highlights.pendingReview'),
    value: pendingCount.value,
  },
  {
    label: t('sportCoachManagement.highlights.attentionItems'),
    value: attentionCount.value,
  },
])

watch(
  () => filteredUsers.value.length,
  () => {
    if (currentPage.value > totalPages.value) currentPage.value = totalPages.value
  },
)

function onViewUser(user) {
  const id = String(user?.id || '').trim()
  if (!id) return
  router.push({ path: '/module/sport-admin/users/add', query: { mode: 'view', id } })
}

function onEditUser(user) {
  const id = String(user?.id || '').trim()
  if (!id) return
  router.push({ path: '/module/sport-admin/users/add', query: { mode: 'edit', id } })
}

function onDeleteUser(user) {
  const id = String(user?.id || '').trim()
  if (!id) return
  coachUsers.value = coachUsers.value.filter((item) => item.id !== id)
}
</script>

<template>
  <MainLayout>
    <section class="coach-management-page">
      <HeaderSection :title="pageTitle" :subtitle="pageSubtitle" />

      <CoachManagementSummaryGrid :cards="summaryCards" :is-kh="isKh" />

      <div class="coach-management-page__shell">
        <CoachManagementToolbar
          :eyebrow="toolbarEyebrow"
          :title="toolbarSummary"
          :description="visibleRangeLabel"
          :spotlight-label="activeRateTitle"
          :spotlight-value="activeRateLabel"
          :button-label="addCoachLabel"
          :button-caption="addCoachCaption"
          :is-kh="isKh"
          @add="goToAddCoach"
        />

        <SearchFilterBar
          class="w-full"
          v-model:searchQuery="searchQuery"
          v-model:roleFilter="roleFilter"
          v-model:statusFilter="statusFilter"
          :search-placeholder="searchPlaceholder"
          :role-options="roleOptions"
          :status-options="statusOptions"
        />

        <CoachManagementHighlights :items="highlightItems" :is-kh="isKh" />

        <Table
          :rows="paginatedUsers"
          :columns="tableColumns"
          :empty-text="tableEmptyText"
          @view="onViewUser"
          @edit="onEditUser"
          @delete="onDeleteUser"
        />

        <div v-if="totalPages > 1" class="flex justify-end">
          <Pagination v-model="currentPage" :total-pages="totalPages" class="mt-2" />
        </div>
      </div>
    </section>
  </MainLayout>
</template>

<style scoped>
.coach-management-page {
  display: flex;
  flex-direction: column;
  gap: 1.35rem;
}

.coach-management-page__shell {
  display: flex;
  flex-direction: column;
  gap: 1.15rem;
  padding: 1.5rem;
  border-radius: 1.5rem;
  border: 1px solid #dce6f2;
  background:
    radial-gradient(circle at top left, rgba(186, 230, 253, 0.18), transparent 24%),
    linear-gradient(180deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.98) 100%);
  box-shadow: 0 25px 60px -40px rgba(15, 23, 42, 0.5);
}
</style>
