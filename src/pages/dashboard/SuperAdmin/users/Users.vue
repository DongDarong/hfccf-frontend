<script setup>
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import MainLayout from '@/layouts/MainLayout.vue'
import HeaderSection from '@/components/layout/HeaderSection.vue'
import SearchFilterBar from '@/components/ui/SearchFilterBar.vue'
import Table from '@/components/ui/Table.vue'
import Pagination from '@/components/ui/Pagination.vue'
import Button from '@/components/ui/Button.vue'
import AlertQuestion from '@/components/ui/AlertQuestion.vue'
import AlertSuccess from '@/components/ui/AlertSuccess.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import usersMock from '@/mocks/users.json'

defineOptions({
  name: 'UsersPage',
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

const roleOptions = [
  'superadmin',
  'coach',
  'teacher',
  'adminpreschool',
  'adminscholaship',
  'adminenglish',
  'adminsport',
]
const statusOptions = ['Active', 'Pending', 'Inactive', 'Suspended']
const addUserLabel = computed(() => {
  const key = 'users.addUser'
  const translated = t(key)
  return translated !== key ? translated : 'Add User'
})
const cancelLabel = computed(() => t('common.cancel') || 'Cancel')
const deleteConfirmTitle = computed(() => t('users.deleteConfirmTitle') || 'Delete user?')
const deleteConfirmText = computed(() => t('users.deleteConfirmText') || 'Delete')
const deleteConfirmMessage = computed(() => {
  const name = selectedUserName.value || 'this user'
  const translated = t('users.deleteConfirmMessage', { name })
  return translated !== 'users.deleteConfirmMessage'
    ? translated
    : `Are you sure you want to delete ${name}?`
})

function goToAddUser() {
  router.push('/users/add')
}

const users = ref(
  usersMock.map((item) => ({
    id: item.id,
    name: item.fullName,
    email: item.email,
    role: item.role,
    permissions: Array.isArray(item.role_permission) ? [...item.role_permission] : [],
    status: item.status,
    phone: item.phone,
    username: item.firstName ? `${item.firstName.charAt(0).toLowerCase()}${item.lastName.toLowerCase()}` : item.id,
  })),
)

const filteredUsers = computed(() => {
  const query = String(searchQuery.value ?? '').trim().toLowerCase()

  return users.value.filter((user) => {
    let isMatch = true

    if (query) {
      const haystack = `${user.name} ${user.email} ${user.role} ${user.permissions?.join(' ')}`.toLowerCase()
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
  return filteredUsers.value.slice(start, start + pageSize)
})

watch(
  () => filteredUsers.value.length,
  () => {
    if (currentPage.value > totalPages.value) {
      currentPage.value = totalPages.value
    }
  },
)

function onEditUser(user) {
  const id = String(user?.id || '').trim()
  if (!id) return
  router.push({ path: '/users/add', query: { mode: 'edit', id } })
}

function onDeleteUser(user) {
  selectedUserId.value = user?.id || ''
  selectedUserName.value = user?.name || ''
  isDeleteOpen.value = true
}

function onCancelDelete() {
  isDeleteOpen.value = false
  selectedUserId.value = ''
  selectedUserName.value = ''
}

function onConfirmDelete() {
  users.value = users.value.filter((user) => user.id !== selectedUserId.value)
  isDeleteOpen.value = false
  selectedUserId.value = ''
  selectedUserName.value = ''
  successMessage.value = 'User deleted successfully.'
  showSuccess.value = true
}
</script>

<template>
  <MainLayout>
    <section class="users-page">
      <HeaderSection :title="t('users.pageTitle')" :subtitle="t('users.summary')" />

      <div class="users-page__panel">
        <div class="users-page__actions">
          <Button variant="primary" size="md" rounded="xl" @click="goToAddUser">
            <template #iconLeft>
              <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
            </template>
            {{ addUserLabel }}
          </Button>
        </div>

        <SearchFilterBar
          class="w-full"
          v-model:searchQuery="searchQuery"
          v-model:roleFilter="roleFilter"
          v-model:statusFilter="statusFilter"
          :role-options="roleOptions"
          :status-options="statusOptions"
        />

        <div v-if="isLoading" class="users-page__loading">
          <LoadingSpinner :label="t('users.loadingUsers')" size="md" />
        </div>
        <Table
          v-else
          :users="paginatedUsers"
          :empty-text="t('users.table.empty')"
          @edit="onEditUser"
          @delete="onDeleteUser"
        />

        <div v-if="totalPages > 1" class="flex justify-end">
          <Pagination
            v-model="currentPage"
            :total-pages="totalPages"
            :disabled="!filteredUsers.length"
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
      title="Success"
      :message="successMessage"
      button-text="Close"
      @close="showSuccess = false"
    />
  </MainLayout>
</template>

<style scoped>
.users-page {
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
}

.users-page__panel {
  border-radius: 1.5rem;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.95) 100%);
  border: 1px solid #e7eaf3;
  padding: 1.5rem;
  box-shadow: 0 25px 60px -40px rgba(15, 23, 42, 0.5);
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.users-page__actions {
  display: flex;
  justify-content: flex-end;
}

.users-page__loading {
  padding: 1.5rem 0.5rem;
}
</style>
