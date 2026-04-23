<script setup>
import { computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import MainLayout from '@/layouts/MainLayout.vue'
import HeaderSection from '@/components/navigation/HeaderSection.vue'
import SearchFilterBar from '@/components/forms/SearchFilterBar.vue'
import Table from '@/components/data-display/Table.vue'
import Pagination from '@/components/data-display/Pagination.vue'
import Button from '@/components/buttons/Button.vue'
import usersMock from '@/mocks/users.json'
import { ROLES } from '@/constants/roles'
import { mapUser } from '@/services/mappers/userMapper'

defineOptions({
  name: 'EnglishAdminUsersPage',
})

const router = useRouter()
const searchQuery = ref('')
const roleFilter = ref('')
const statusFilter = ref('')
const currentPage = ref(1)
const pageSize = 8

const roleOptions = [ROLES.TEACHER_ENGLISH]
const statusOptions = ['Active', 'Pending', 'Inactive', 'Suspended']
const addTeacherLabel = computed(() => 'Add Teacher')
const tableColumns = [
  { key: 'number', label: 'No.', align: 'left' },
  { key: 'user', label: 'User', align: 'left' },
  { key: 'email', label: 'Email', align: 'left' },
  { key: 'role', label: 'Role', align: 'left' },
  { key: 'permission', label: 'Permissions', align: 'left' },
  { key: 'status', label: 'Status', align: 'left' },
  { key: 'phone', label: 'Phone', align: 'left' },
  { key: 'actions', label: 'Actions', align: 'right' },
]

function goToAddTeacher() {
  router.push({ path: '/module/super-admin/users/add', query: { role: ROLES.TEACHER_ENGLISH } })
}

const englishUsers = ref(
  usersMock
    .filter((item) => String(item.role || '').toLowerCase() === ROLES.TEACHER_ENGLISH)
    .map((item) => mapUser(item)),
)

const filteredUsers = computed(() => {
  const query = String(searchQuery.value || '')
    .trim()
    .toLowerCase()

  return englishUsers.value.filter((user) => {
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

watch(
  () => filteredUsers.value.length,
  () => {
    if (currentPage.value > totalPages.value) currentPage.value = totalPages.value
  },
)

function onViewUser(user) {
  const id = String(user?.id || '').trim()
  if (!id) return
  router.push({ path: '/module/super-admin/users/add', query: { mode: 'view', id } })
}

function onEditUser(user) {
  const id = String(user?.id || '').trim()
  if (!id) return
  router.push({ path: '/module/super-admin/users/add', query: { mode: 'edit', id } })
}

function onDeleteUser(user) {
  const id = String(user?.id || '').trim()
  if (!id) return
  englishUsers.value = englishUsers.value.filter((item) => item.id !== id)
}
</script>

<template>
  <MainLayout>
    <section class="english-users-page">
      <HeaderSection
        title="English Teachers"
        subtitle="View teachers assigned to the English program."
      />

      <div class="english-users-page__panel">
        <div class="english-users-page__actions">
          <Button variant="primary" size="md" rounded="xl" @click="goToAddTeacher">
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
            {{ addTeacherLabel }}
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

        <Table
          :rows="paginatedUsers"
          :columns="tableColumns"
          empty-text="No English teachers found."
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
.english-users-page {
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
}

.english-users-page__panel {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  border: 1px solid #e2e8f0;
  border-radius: 1.5rem;
  padding: 1.5rem;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.92) 0%, rgba(248, 250, 252, 0.96) 100%);
  box-shadow: 0 25px 60px -40px rgba(15, 23, 42, 0.45);
}

.english-users-page__actions {
  display: flex;
  justify-content: flex-end;
}
</style>


