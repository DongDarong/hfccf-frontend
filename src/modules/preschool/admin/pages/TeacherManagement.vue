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
  name: 'PreschoolAdminTeachersPage',
})

const router = useRouter()
const searchQuery = ref('')
const roleFilter = ref('')
const statusFilter = ref('')
const currentPage = ref(1)
const pageSize = 8

const roleOptions = [ROLES.TEACHER_PRESCHOOL]
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
  router.push({ name: 'add-user', query: { role: ROLES.TEACHER_PRESCHOOL } })
}

const preschoolUsers = ref(
  usersMock
    .filter((item) => String(item.role || '').toLowerCase() === ROLES.TEACHER_PRESCHOOL)
    .map((item) => mapUser(item)),
)

const filteredUsers = computed(() => {
  const query = String(searchQuery.value || '')
    .trim()
    .toLowerCase()

  return preschoolUsers.value.filter((user) => {
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
  preschoolUsers.value = preschoolUsers.value.filter((item) => item.id !== id)
}
</script>

<template>
  <MainLayout>
    <section class="preschool-users-page">
      <HeaderSection
        title="Preschool Teachers"
        subtitle="View teachers assigned to the Preschool program."
      />

      <div class="preschool-users-page__panel">
        <div class="preschool-users-page__actions">
          <Button
            variant="primary"
            size="lg"
            rounded="full"
            class="preschool-users-page__add-button"
            @click="goToAddTeacher"
          >
            <template #iconLeft>
              <i class="pi pi-user-plus text-sm" aria-hidden="true" />
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
          empty-text="No Preschool teachers found."
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
.preschool-users-page {
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
}

.preschool-users-page__panel {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  border: 1px solid #e2e8f0;
  border-radius: 1.5rem;
  padding: 1.5rem;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.92) 0%, rgba(248, 250, 252, 0.96) 100%);
  box-shadow: 0 25px 60px -40px rgba(15, 23, 42, 0.45);
}

.preschool-users-page__actions {
  display: flex;
  justify-content: flex-end;
}

.preschool-users-page__add-button {
  min-width: 10.5rem;
  box-shadow: 0 18px 30px -22px rgba(0, 174, 239, 0.55);
}

.preschool-users-page__add-button :deep(.p-button-label) {
  font-weight: 800;
  letter-spacing: 0.01em;
}

.preschool-users-page__add-button :deep(.p-button-icon) {
  font-size: 0.95rem;
}
</style>
