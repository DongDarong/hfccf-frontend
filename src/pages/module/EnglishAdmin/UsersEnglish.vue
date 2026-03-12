<script setup>
import { computed, ref, watch } from 'vue'
import MainLayout from '@/layouts/MainLayout.vue'
import HeaderSection from '@/components/layout/HeaderSection.vue'
import SearchFilterBar from '@/components/ui/SearchFilterBar.vue'
import Table from '@/components/ui/Table.vue'
import Pagination from '@/components/ui/Pagination.vue'
import usersMock from '@/mocks/users.json'

defineOptions({
  name: 'EnglishAdminUsersPage',
})

const searchQuery = ref('')
const roleFilter = ref('')
const statusFilter = ref('')
const currentPage = ref(1)
const pageSize = 8

const roleOptions = ['teacher-english']
const statusOptions = ['Active', 'Pending', 'Inactive', 'Suspended']
const tableColumns = [
  { key: 'number', label: 'No.', align: 'left' },
  { key: 'user', label: 'User', align: 'left' },
  { key: 'email', label: 'Email', align: 'left' },
  { key: 'role', label: 'Role', align: 'left' },
  { key: 'permission', label: 'Permissions', align: 'left' },
  { key: 'status', label: 'Status', align: 'left' },
  { key: 'phone', label: 'Phone', align: 'left' },
]

const englishUsers = ref(
  usersMock
    .filter((item) => String(item.role || '').toLowerCase() === 'teacher-english')
    .map((item) => ({
      id: item.id,
      name: `${item.firstName || ''} ${item.lastName || ''}`.trim() || item.username || item.id,
      username: item.username || item.id,
      email: item.email,
      avatar: item.avatar,
      role: item.role,
      permissions: Array.isArray(item.role_permission) ? [...item.role_permission] : [],
      status: item.status,
      phone: item.phone,
    })),
)

const filteredUsers = computed(() => {
  const query = String(searchQuery.value || '').trim().toLowerCase()

  return englishUsers.value.filter((user) => {
    let isMatch = true

    if (query) {
      const haystack = `${user.name} ${user.email} ${user.role} ${user.permissions.join(' ')}`.toLowerCase()
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
</script>

<template>
  <MainLayout>
    <section class="english-users-page">
      <HeaderSection
        title="English Teachers"
        subtitle="View teachers assigned to the English program."
      />

      <div class="english-users-page__panel">
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
</style>
