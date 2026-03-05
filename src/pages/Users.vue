<script setup>
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import MainLayout from '@/layouts/MainLayout.vue'
import HeaderSection from '@/components/layout/HeaderSection.vue'
import SearchFilterBar from '@/components/ui/SearchFilterBar.vue'
import Table from '@/components/ui/Table.vue'
import usersMock from '@/mocks/users.json'

defineOptions({
  name: 'UsersPage',
})

const { t } = useI18n()
const searchQuery = ref('')
const roleFilter = ref('')
const statusFilter = ref('')

const roleOptions = ['Admin', 'Manager', 'Staff', 'Support']
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
</script>

<template>
  <MainLayout>
    <section class="users-page">
      <HeaderSection :title="t('users.pageTitle')" :subtitle="t('users.summary')" />

      <SearchFilterBar
        class="w-full"
        v-model:searchQuery="searchQuery"
        v-model:roleFilter="roleFilter"
        v-model:statusFilter="statusFilter"
        :role-options="roleOptions"
        :status-options="statusOptions"
      />

      <Table :users="filteredUsers" :empty-text="t('users.table.empty')" />
    </section>
  </MainLayout>
</template>

<style scoped>
.users-page {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}
</style>
