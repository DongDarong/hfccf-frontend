<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import MainLayout from '@/layouts/MainLayout.vue'
import HeaderSection from '@/components/navigation/HeaderSection.vue'
import StatusBadge from '@/components/badges/StatusBadge.vue'
import Pagination from '@/components/data-display/Pagination.vue'
import { PROGRAM_ADMIN_ROLES, ROLES } from '@/constants/roles'
import AdminSummaryCards from '@/modules/super-admin/components/admin-management/AdminSummaryCards.vue'
import AdminManagementToolbar from '@/modules/super-admin/components/admin-management/list/AdminManagementToolbar.vue'
import AdminManagementListPanel from '@/modules/super-admin/components/admin-management/list/AdminManagementListPanel.vue'
import AdminManagementDialogs from '@/modules/super-admin/components/admin-management/dialogs/AdminManagementDialogs.vue'
import {
  deleteAdminUser,
  listAdminUsers,
} from '@/modules/super-admin/services/adminUsersApi'

defineOptions({
  name: 'AdminManagementPage',
})

const { t } = useI18n()
const router = useRouter()
const searchQuery = ref('')
const roleFilter = ref('')
const statusFilter = ref('')
const currentPage = ref(1)
const isLoading = ref(false)
const isDeleteOpen = ref(false)
const selectedUserId = ref('')
const selectedUserName = ref('')
const showSuccess = ref(false)
const successMessage = ref('')
const showError = ref(false)
const errorMessage = ref('')

const pageSize = 10
const statusOptions = ['active', 'pending', 'inactive', 'suspended']
const roleOptions = [ROLES.SUPER_ADMIN, ...PROGRAM_ADMIN_ROLES]

const pageTitle = computed(() => t('users.manageAdmins.title'))
const pageSubtitle = computed(() => t('users.manageAdmins.summary'))
const searchPlaceholder = computed(() => t('users.manageAdmins.searchPlaceholder'))
const addButtonLabel = computed(() => t('users.manageAdmins.addButton'))
const toolbarNote = computed(() => t('users.manageAdmins.toolbarNote'))
const refreshButtonLabel = computed(() => t('common.refresh'))
const toolbarCountText = computed(() =>
  t('users.manageAdmins.accountsInView', { count: filteredAdmins.value.length }),
)
const tableEmptyText = computed(() => t('users.manageAdmins.tableEmpty'))
const loadingLabel = computed(() => t('users.manageAdmins.loading'))

const statusBadges = computed(() => {
  const statuses = ['active', 'pending', 'inactive', 'suspended']

  return statuses.map((status) => {
    const count = filteredAdmins.value.filter(
      (user) => String(user.status || '').toLowerCase() === status,
    ).length

    return {
      status,
      label: `${statusLabel(status)} (${count})`,
      count,
    }
  })
})

const admins = ref([])

function statusLabel(status) {
  const key = `common.status.${String(status || '').replace(/[\s-]+/g, '_').toLowerCase()}`
  const translated = t(key)
  return translated !== key ? translated : String(status || '')
}

const summaryCards = computed(() => {
  const total = admins.value.length
  const active = admins.value.filter((user) => String(user.status).toLowerCase() === 'active').length
  const pending = admins.value.filter((user) => String(user.status).toLowerCase() === 'pending').length
  const alerts = admins.value.filter((user) =>
    ['inactive', 'suspended'].includes(String(user.status).toLowerCase()),
  ).length

  return [
    {
      id: 'total-admins',
      title: t('users.manageAdmins.metrics.total'),
      value: total,
      label: toolbarNote.value,
      status: 'info',
      statusLabel: statusLabel('info'),
      surfaceClass: 'bg-cyan-50/80 border-cyan-200',
      actionLabel: addButtonLabel.value,
    },
    {
      id: 'active-admins',
      title: t('users.manageAdmins.metrics.active'),
      value: active,
      label: t('users.manageAdmins.metrics.activeLabel'),
      status: 'success',
      statusLabel: statusLabel('success'),
      surfaceClass: 'bg-lime-50/80 border-lime-200',
    },
    {
      id: 'pending-admins',
      title: t('users.manageAdmins.metrics.pending'),
      value: pending,
      label: t('users.manageAdmins.metrics.pendingLabel'),
      status: 'warning',
      statusLabel: statusLabel('warning'),
      surfaceClass: 'bg-amber-50/80 border-amber-200',
    },
    {
      id: 'security-alerts',
      title: t('users.manageAdmins.metrics.alerts'),
      value: alerts,
      label: t('users.manageAdmins.metrics.alertsLabel'),
      status: alerts > 0 ? 'error' : 'success',
      statusLabel: statusLabel(alerts > 0 ? 'error' : 'success'),
      surfaceClass: 'bg-rose-50/80 border-rose-200',
    },
  ]
})

const filteredAdmins = computed(() => {
  const query = String(searchQuery.value ?? '')
    .trim()
    .toLowerCase()

  return admins.value.filter((user) => {
    let isMatch = true

    if (query) {
      const haystack =
        `${user.name} ${user.email} ${user.role} ${user.department} ${user.permissions?.join(' ')}`.toLowerCase()
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

const totalPages = computed(() => Math.max(Math.ceil(filteredAdmins.value.length / pageSize), 1))

const paginatedAdmins = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredAdmins.value.slice(start, start + pageSize).map((user, index) => ({
    ...user,
    rowNumber: start + index + 1,
    role: user.role || ROLES.SUPER_ADMIN,
    status: user.status || 'active',
    permissions: Array.isArray(user.permissions) ? user.permissions : [],
  }))
})

watch(
  () => filteredAdmins.value.length,
  () => {
    if (currentPage.value > totalPages.value) {
      currentPage.value = totalPages.value
    }
  },
)

function goToAddAdmin() {
  router.push('/module/super-admin/users/add')
}

function onEditAdmin(admin) {
  const id = String(admin?.id || '').trim()
  if (!id) return
  router.push({ path: '/module/super-admin/users/add', query: { mode: 'edit', id } })
}

function onDeleteAdmin(admin) {
  selectedUserId.value = admin?.id || ''
  selectedUserName.value = admin?.name || ''
  isDeleteOpen.value = true
}

function onClearFilters() {
  searchQuery.value = ''
  roleFilter.value = ''
  statusFilter.value = ''
  currentPage.value = 1
}

function onCancelDelete() {
  isDeleteOpen.value = false
  selectedUserId.value = ''
  selectedUserName.value = ''
}

async function onConfirmDelete() {
  isLoading.value = true
  showError.value = false
  errorMessage.value = ''

  try {
    await deleteAdminUser(selectedUserId.value)
    admins.value = await listAdminUsers()
    successMessage.value = t('users.manageAdmins.removeSuccess')
    showSuccess.value = true
  } catch (error) {
    errorMessage.value = error?.message || 'Unable to delete admin right now.'
    showError.value = true
  } finally {
    isLoading.value = false
  }

  isDeleteOpen.value = false
  selectedUserId.value = ''
  selectedUserName.value = ''
}

const deleteConfirmTitle = computed(() => t('users.deleteConfirmTitle') || 'Delete admin?')
const deleteConfirmText = computed(() => t('users.deleteConfirmText') || 'Delete')
const cancelLabel = computed(() => t('common.cancel') || 'Cancel')
const deleteConfirmMessage = computed(() => {
  const name = selectedUserName.value || 'this admin'
  const translated = t('users.deleteConfirmMessage', { name })
  return translated !== 'users.deleteConfirmMessage'
    ? translated
    : `Are you sure you want to delete ${name}?`
})

async function loadAdmins() {
  isLoading.value = true
  showError.value = false
  errorMessage.value = ''

  try {
    admins.value = await listAdminUsers()
  } catch (error) {
    errorMessage.value = error?.message || 'Unable to load admin accounts right now.'
    showError.value = true
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  loadAdmins()
})
</script>

<template>
  <MainLayout>
    <section class="admin-directory-page">
      <HeaderSection :title="pageTitle" :subtitle="pageSubtitle" />

      <AdminSummaryCards :cards="summaryCards" />

      <div class="admin-directory-shell">
        <div class="admin-directory-shell__badges">
          <StatusBadge
            v-for="badge in statusBadges"
            :key="badge.status"
            :status="badge.status"
            :label="badge.label"
            :translate-label="false"
            size="sm"
            :dot="false"
          />
        </div>

        <AdminManagementToolbar
          :title="toolbarNote"
          :note="pageSubtitle"
          :count-text="toolbarCountText"
          :add-label="addButtonLabel"
          @add="goToAddAdmin"
        />

        <AdminManagementListPanel
          :refresh-label="refreshButtonLabel"
          :search-query="searchQuery"
          :role-filter="roleFilter"
          :status-filter="statusFilter"
          :search-placeholder="searchPlaceholder"
          :role-options="roleOptions"
          :status-options="statusOptions"
          :users="paginatedAdmins"
          :empty-text="tableEmptyText"
          :loading="isLoading"
          :loading-label="loadingLabel"
          @update:search-query="searchQuery = $event"
          @update:role-filter="roleFilter = $event"
          @update:status-filter="statusFilter = $event"
          @edit="onEditAdmin"
          @delete="onDeleteAdmin"
          @refresh="loadAdmins"
          @clear="onClearFilters"
        />

        <div v-if="totalPages > 1" class="flex justify-end pt-1">
          <Pagination v-model="currentPage" :total-pages="totalPages" />
        </div>
      </div>
    </section>

    <AdminManagementDialogs
      :delete-show="isDeleteOpen"
      :delete-loading="isLoading"
      :delete-title="deleteConfirmTitle"
      :delete-message="deleteConfirmMessage"
      :delete-confirm-text="deleteConfirmText"
      :delete-cancel-text="cancelLabel"
      :success-show="showSuccess"
      :success-title="t('common.success')"
      :success-message="successMessage"
      :success-button-text="t('common.close')"
      :error-show="showError"
      :error-title="t('common.error')"
      :error-message="errorMessage"
      :error-button-text="t('common.close')"
      @confirm-delete="onConfirmDelete"
      @cancel-delete="onCancelDelete"
      @close-success="showSuccess = false"
      @close-error="showError = false"
    />
  </MainLayout>
</template>

<style scoped>
.admin-directory-page {
  display: flex;
  flex-direction: column;
  gap: 1.35rem;
}

.admin-directory-shell {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  border-radius: 1.75rem;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.94) 0%, rgba(248, 250, 252, 0.98) 100%);
  border: 1px solid #e7eaf3;
  padding: 1.25rem;
  box-shadow: 0 25px 60px -40px rgba(15, 23, 42, 0.5);
}

.admin-directory-shell__badges {
  display: flex;
  flex-wrap: wrap;
  gap: 0.55rem;
}

</style>
