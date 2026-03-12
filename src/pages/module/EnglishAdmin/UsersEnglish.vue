<script setup>
import { computed, ref, watch } from 'vue'
import MainLayout from '@/layouts/MainLayout.vue'
import HeaderSection from '@/components/layout/HeaderSection.vue'
import SearchFilterBar from '@/components/ui/SearchFilterBar.vue'
import Pagination from '@/components/ui/Pagination.vue'
import RolesBadge from '@/components/common/RolesBadge.vue'
import StatusBadge from '@/components/common/StatusBadge.vue'
import PermissionBadge from '@/components/common/PermissionBadge.vue'
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

function resolveStatusType(status) {
  const value = String(status || '').toLowerCase()
  if (value === 'active') return 'success'
  if (value === 'pending') return 'pending'
  if (value === 'inactive') return 'warning'
  if (value === 'suspended') return 'error'
  return 'info'
}

function avatarFallback(user) {
  return String(user.name || '')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || '')
    .join('') || '?'
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
        <SearchFilterBar
          class="w-full"
          v-model:searchQuery="searchQuery"
          v-model:roleFilter="roleFilter"
          v-model:statusFilter="statusFilter"
          :role-options="roleOptions"
          :status-options="statusOptions"
        />

        <div class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-slate-100 text-sm">
              <thead class="bg-slate-50">
                <tr>
                  <th class="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-600">No.</th>
                  <th class="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-600">User</th>
                  <th class="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-600">Email</th>
                  <th class="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-600">Role</th>
                  <th class="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-600">Permissions</th>
                  <th class="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-600">Status</th>
                  <th class="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-600">Phone</th>
                </tr>
              </thead>

              <tbody class="divide-y divide-slate-100 bg-white">
                <tr v-if="!paginatedUsers.length">
                  <td colspan="7" class="px-4 py-8 text-center text-sm text-slate-500">
                    No English teachers found.
                  </td>
                </tr>

                <tr v-for="user in paginatedUsers" :key="user.id" class="hover:bg-slate-50/80">
                  <td class="px-4 py-3 text-sm font-semibold text-slate-700">
                    {{ user.rowNumber }}
                  </td>
                  <td class="px-4 py-3">
                    <div class="flex items-center gap-3">
                      <img
                        v-if="user.avatar"
                        :src="user.avatar"
                        :alt="`${user.name} avatar`"
                        class="h-11 w-11 rounded-2xl border border-white/70 object-cover shadow-sm ring-2 ring-cyan-200"
                      >
                      <div
                        v-else
                        class="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-500 text-xs font-bold text-white shadow-sm ring-2 ring-cyan-200"
                      >
                        {{ avatarFallback(user) }}
                      </div>

                      <div>
                        <div class="font-semibold text-slate-900">{{ user.name }}</div>
                        <div class="text-xs text-slate-400">ID: {{ user.id }}</div>
                        <div class="text-xs text-slate-500">@{{ user.username }}</div>
                      </div>
                    </div>
                  </td>

                  <td class="px-4 py-3 text-sm text-slate-700">{{ user.email }}</td>
                  <td class="px-4 py-3"><RolesBadge :role="user.role" /></td>
                  <td class="px-4 py-3">
                    <div class="flex flex-wrap gap-1">
                      <PermissionBadge
                        v-for="permission in user.permissions"
                        :key="permission"
                        :permission="permission"
                        size="sm"
                      />
                    </div>
                  </td>
                  <td class="px-4 py-3">
                    <StatusBadge :status="resolveStatusType(user.status)" :label="user.status" size="sm" />
                  </td>
                  <td class="px-4 py-3 text-sm text-slate-700">{{ user.phone }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

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
