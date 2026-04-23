<script setup>
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import MainLayout from '@/layouts/MainLayout.vue'
import HeaderSection from '@/components/navigation/HeaderSection.vue'
import SearchFilterBar from '@/components/forms/SearchFilterBar.vue'
import Table from '@/components/data-display/Table.vue'
import Pagination from '@/components/data-display/Pagination.vue'
import Button from '@/components/buttons/Button.vue'
import AlertQuestion from '@/components/alerts/AlertQuestion.vue'
import AlertSuccess from '@/components/alerts/AlertSuccess.vue'
import Loading from '@/components/feedback/Loading.vue'
import { PROGRAM_ADMIN_ROLES, ROLES, isProgramAdminRole, isSuperAdminRole } from '@/constants/roles'
import { mapUsers } from '@/services/mappers/userMapper'
import usersMock from '@/mocks/users.json'
import AdminSummaryCards from '@/modules/super-admin/components/admin-management/AdminSummaryCards.vue'

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

const pageSize = 10
const statusOptions = ['active', 'pending', 'inactive', 'suspended']
const roleOptions = [ROLES.SUPER_ADMIN, ...PROGRAM_ADMIN_ROLES]

const pageTitle = computed(() => t('users.manageAdmins.title'))
const pageSubtitle = computed(() => t('users.manageAdmins.summary'))
const searchPlaceholder = computed(() => t('users.manageAdmins.searchPlaceholder'))
const addButtonLabel = computed(() => t('users.manageAdmins.addButton'))
const toolbarNote = computed(() => t('users.manageAdmins.toolbarNote'))
const tableEmptyText = computed(() => t('users.manageAdmins.tableEmpty'))
const loadingLabel = computed(() => t('users.manageAdmins.loading'))

const admins = ref(
  mapUsers(usersMock).filter((user) => isSuperAdminRole(user.role) || isProgramAdminRole(user.role)),
)

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

function onCancelDelete() {
  isDeleteOpen.value = false
  selectedUserId.value = ''
  selectedUserName.value = ''
}

function onConfirmDelete() {
  admins.value = admins.value.filter((user) => user.id !== selectedUserId.value)
  isDeleteOpen.value = false
  selectedUserId.value = ''
  selectedUserName.value = ''
  successMessage.value = t('users.manageAdmins.removeSuccess')
  showSuccess.value = true
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
</script>

<template>
  <MainLayout>
    <section class="admin-directory-page">
      <HeaderSection :title="pageTitle" :subtitle="pageSubtitle" />

      <AdminSummaryCards :cards="summaryCards" />

      <div class="admin-directory-shell">
        <div class="admin-directory-shell__toolbar">
          <div class="min-w-0">
            <p class="text-[0.78rem] font-semibold uppercase tracking-[0.08em] text-surface-500">
              {{ toolbarNote }}
            </p>
            <p class="mt-1 text-[0.9rem] leading-6 text-slate-600">
              {{ t('users.manageAdmins.accountsInView', { count: filteredAdmins.length }) }}
            </p>
          </div>

          <Button variant="primary" size="md" rounded="xl" @click="goToAddAdmin">
            <template #iconLeft>
              <svg
                class="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </template>
            {{ addButtonLabel }}
          </Button>
        </div>

        <SearchFilterBar
          class="w-full"
          v-model:searchQuery="searchQuery"
          v-model:roleFilter="roleFilter"
          v-model:statusFilter="statusFilter"
          :search-placeholder="searchPlaceholder"
          :role-options="roleOptions"
          :status-options="statusOptions"
        />

        <div v-if="isLoading" class="admin-directory-shell__loading">
          <Loading :label="loadingLabel" size="md" />
        </div>

        <Table
          v-else
          :users="paginatedAdmins"
          :empty-text="tableEmptyText"
          @edit="onEditAdmin"
          @delete="onDeleteAdmin"
        />

        <div v-if="totalPages > 1" class="flex justify-end">
          <Pagination
            v-model="currentPage"
            :total-pages="totalPages"
            :disabled="!filteredAdmins.length"
            class="mt-3"
          />
        </div>
      </div>
    </section>

    <AlertQuestion
      :show="isDeleteOpen"
      :title="deleteConfirmTitle"
      :message="deleteConfirmMessage"
      :confirm-text="deleteConfirmText"
      :cancel-text="cancelLabel"
      type="danger"
      @confirm="onConfirmDelete"
      @cancel="onCancelDelete"
    />

    <AlertSuccess
      :show="showSuccess"
      :title="t('common.success')"
      :message="successMessage"
      :button-text="t('common.close')"
      @close="showSuccess = false"
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
  gap: 1.15rem;
  border-radius: 1.5rem;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.94) 0%, rgba(248, 250, 252, 0.98) 100%);
  border: 1px solid #e7eaf3;
  padding: 1.5rem;
  box-shadow: 0 25px 60px -40px rgba(15, 23, 42, 0.5);
}

.admin-directory-shell__toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.admin-directory-shell__loading {
  padding: 1.5rem 0.5rem;
}
</style>
