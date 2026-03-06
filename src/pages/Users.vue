<script setup>
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import MainLayout from '@/layouts/MainLayout.vue'
import HeaderSection from '@/components/layout/HeaderSection.vue'
import SearchFilterBar from '@/components/ui/SearchFilterBar.vue'
import Table from '@/components/ui/Table.vue'
import Pagination from '@/components/ui/Pagination.vue'
import usersMock from '@/mocks/users.json'

defineOptions({
  name: 'UsersPage',
})

const { t } = useI18n()
const searchQuery = ref('')
const roleFilter = ref('')
const statusFilter = ref('')
const currentPage = ref(1)

const pageSize = 5

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
      const haystack = `${user.name} ${user.email} ${user.role} ${user.permission}`.toLowerCase()
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
</script>

<template>
  <MainLayout>
    <section class="users-page">
      <HeaderSection :title="t('users.pageTitle')" :subtitle="t('users.summary')" />

      <div class="users-page__panel">
        <SearchFilterBar
          class="w-full"
          v-model:searchQuery="searchQuery"
          v-model:roleFilter="roleFilter"
          v-model:statusFilter="statusFilter"
          :role-options="roleOptions"
          :status-options="statusOptions"
        />

        <Table :users="paginatedUsers" :empty-text="t('users.table.empty')" />

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
</style>
