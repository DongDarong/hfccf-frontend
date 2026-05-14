<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import MainLayout from '@/layouts/MainLayout.vue'
import HeaderSection from '@/components/navigation/HeaderSection.vue'
import SearchFilterBar from '@/components/forms/SearchFilterBar.vue'
import Table from '@/components/data-display/Table.vue'
import Pagination from '@/components/data-display/Pagination.vue'
import Button from '@/components/buttons/Button.vue'
import AlertQuestion from '@/components/alerts/AlertQuestion.vue'
import AlertSuccess from '@/components/alerts/AlertSuccess.vue'
import { mapUsers } from '@/services/mappers/userMapper'
import {
  deletePreschoolTeacher,
  fetchPreschoolTeachers,
} from '@/modules/preschool/services/preschoolApi'

defineOptions({
  name: 'PreschoolAdminTeachersPage',
})

const router = useRouter()

const searchQuery = ref('')
const statusFilter = ref('')
const currentPage = ref(1)
const pageSize = 8
const teachers = ref([])
const pagination = ref({
  page: 1,
  perPage: pageSize,
  total: 0,
  totalPages: 1,
})
const loading = ref(false)
const errorMessage = ref('')
const isDeleteOpen = ref(false)
const selectedTeacher = ref(null)
const showSuccess = ref(false)
const successMessage = ref('')

const statusOptions = ['active', 'pending', 'inactive', 'suspended']
const addTeacherLabel = computed(() => 'Add Teacher')
const addTeacherCaption = computed(() => 'Create preschool account')
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

const mappedTeachers = computed(() =>
  mapUsers(teachers.value).map((teacher) => ({
    ...teacher,
    permissions: Array.isArray(teacher.permissions) ? teacher.permissions : [],
  })),
)

function goToAddTeacher() {
  router.push({ path: '/module/preschool-admin/users/add' })
}

async function loadTeachers() {
  loading.value = true
  errorMessage.value = ''

  try {
    const response = await fetchPreschoolTeachers({
      page: currentPage.value,
      perPage: pageSize,
      search: searchQuery.value,
      status: statusFilter.value,
    })

    teachers.value = Array.isArray(response.items) ? response.items : []
    pagination.value = response.pagination || pagination.value
  } catch (error) {
    teachers.value = []
    pagination.value = {
      page: 1,
      perPage: pageSize,
      total: 0,
      totalPages: 1,
    }
    errorMessage.value = error?.message || 'Failed to load preschool teachers.'
  } finally {
    loading.value = false
  }
}

function onViewUser(user) {
  const id = String(user?.id || '').trim()
  if (!id) return
  router.push({ path: '/module/preschool-admin/users/add', query: { mode: 'view', id } })
}

function onEditUser(user) {
  const id = String(user?.id || '').trim()
  if (!id) return
  router.push({ path: '/module/preschool-admin/users/add', query: { mode: 'edit', id } })
}

function onDeleteUser(user) {
  selectedTeacher.value = user || null
  if (!selectedTeacher.value?.id) return
  isDeleteOpen.value = true
}

function onCancelDelete() {
  isDeleteOpen.value = false
  selectedTeacher.value = null
}

async function onConfirmDelete() {
  const id = String(selectedTeacher.value?.id || '').trim()
  if (!id) return

  try {
    await deletePreschoolTeacher(id)
    successMessage.value = 'Teacher deleted successfully.'
    showSuccess.value = true
    onCancelDelete()
    await loadTeachers()
  } catch (error) {
    errorMessage.value = error?.message || 'Failed to delete the teacher.'
  }
}

function onFiltersCleared() {
  searchQuery.value = ''
  statusFilter.value = ''
}

watch([searchQuery, statusFilter], () => {
  currentPage.value = 1
  loadTeachers()
})

watch(currentPage, () => {
  loadTeachers()
})

onMounted(() => {
  loadTeachers()
})
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
            rounded="xl"
            class="preschool-users-page__add-button"
            @click="goToAddTeacher"
          >
            <template #iconLeft>
              <span class="preschool-users-page__add-button-icon" aria-hidden="true">
                <i class="pi pi-user-plus text-sm" />
              </span>
            </template>
            <span class="preschool-users-page__add-button-content">
              <span class="preschool-users-page__add-button-label">{{ addTeacherLabel }}</span>
              <span class="preschool-users-page__add-button-caption">{{ addTeacherCaption }}</span>
            </span>
            <span class="preschool-users-page__add-button-trailing" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M7 17L17 7M9 7h8v8" />
              </svg>
            </span>
          </Button>
        </div>

        <SearchFilterBar
          class="w-full"
          v-model:searchQuery="searchQuery"
          v-model:statusFilter="statusFilter"
          :show-role-filter="false"
          :status-options="statusOptions"
          search-placeholder="Search by teacher name, email, or phone"
          @clear="onFiltersCleared"
        />

        <div
          v-if="errorMessage"
          class="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"
        >
          {{ errorMessage }}
        </div>

        <Table
          :rows="mappedTeachers"
          :columns="tableColumns"
          :loading="loading"
          empty-text="No Preschool teachers found."
          @view="onViewUser"
          @edit="onEditUser"
          @delete="onDeleteUser"
        />

        <div v-if="pagination.totalPages > 1" class="flex justify-end">
          <Pagination v-model="currentPage" :total-pages="pagination.totalPages" class="mt-2" />
        </div>
      </div>
    </section>

    <AlertQuestion
      :show="isDeleteOpen"
      title="Delete teacher?"
      :message="`Are you sure you want to delete ${selectedTeacher?.name || selectedTeacher?.fullName || 'this teacher'}?`"
      confirm-text="Delete"
      cancel-text="Cancel"
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
  min-width: 15rem;
  justify-content: space-between;
  padding-inline: 0.95rem 1rem;
  box-shadow: 0 20px 36px -24px rgba(0, 174, 239, 0.58);
}

.preschool-users-page__add-button-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: 0.9rem;
  background: rgba(255, 255, 255, 0.16);
  border: 1px solid rgba(255, 255, 255, 0.24);
}

.preschool-users-page__add-button-content {
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.1rem;
  line-height: 1.15;
  text-align: left;
}

.preschool-users-page__add-button-label {
  font-weight: 800;
  letter-spacing: 0.01em;
}

.preschool-users-page__add-button-caption {
  font-size: 0.72rem;
  font-weight: 600;
  opacity: 0.84;
}

.preschool-users-page__add-button-trailing {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.9rem;
  height: 1.9rem;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.18);
  border: 1px solid rgba(255, 255, 255, 0.26);
}

.preschool-users-page__add-button-trailing svg {
  width: 0.9rem;
  height: 0.9rem;
}

.preschool-users-page__add-button :deep(.p-button-label) {
  width: 100%;
}

.preschool-users-page__add-button :deep(.p-button-icon) {
  margin-right: 0.75rem;
  font-size: 0.95rem;
}

@media (max-width: 640px) {
  .preschool-users-page__actions {
    justify-content: stretch;
  }

  .preschool-users-page__add-button {
    width: 100%;
    min-width: 0;
  }
}
</style>
