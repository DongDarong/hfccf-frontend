<script setup>
import { computed, onMounted, reactive, ref, watch } from 'vue'
import Dialog from 'primevue/dialog'
import MainLayout from '@/layouts/MainLayout.vue'
import HeaderSection from '@/components/navigation/HeaderSection.vue'
import Pagination from '@/components/data-display/Pagination.vue'
import UsersTable from '@/components/data-display/Table.vue'
import Button from '@/components/buttons/Button.vue'
import AlertQuestion from '@/components/alerts/AlertQuestion.vue'
import AlertSuccess from '@/components/alerts/AlertSuccess.vue'
import {
  createEnglishTeacher,
  deleteEnglishTeacher,
  fetchEnglishTeachers,
  updateEnglishTeacher,
} from '@/modules/english/services/englishApi'

defineOptions({
  name: 'EnglishTeacherManagementPage',
})

const searchQuery = ref('')
const statusFilter = ref('')
const currentPage = ref(1)
const pageSize = 10
const loading = ref(false)
const errorMessage = ref('')
const teachers = ref([])
const pagination = ref({ page: 1, perPage: pageSize, total: 0, totalPages: 1 })
const modalOpen = ref(false)
const modalMode = ref('create')
const saving = ref(false)
const showSuccess = ref(false)
const successMessage = ref('')
const deleteTarget = ref(null)
const deleteOpen = ref(false)

const form = reactive({
  first_name: '',
  last_name: '',
  username: '',
  email: '',
  phone: '',
  status: 'active',
  password: '',
  password_confirmation: '',
})

const statusOptions = ['active', 'pending', 'inactive', 'suspended']

const tableColumns = [
  { key: 'number', label: 'No.', align: 'left' },
  { key: 'user', label: 'Teacher', align: 'left' },
  { key: 'email', label: 'Email', align: 'left' },
  { key: 'role', label: 'Role', align: 'left' },
  { key: 'permission', label: 'Permissions', align: 'left' },
  { key: 'status', label: 'Status', align: 'left' },
  { key: 'phone', label: 'Phone', align: 'left' },
  { key: 'actions', label: 'Actions', align: 'right' },
]

const mappedTeachers = computed(() =>
  teachers.value.map((teacher) => ({
    ...teacher,
    name: teacher.fullName || teacher.name || `${teacher.firstName || ''} ${teacher.lastName || ''}`.trim(),
    email: teacher.email || '-',
    phone: teacher.phone || '-',
  })),
)

function resetForm() {
  Object.assign(form, {
    first_name: '',
    last_name: '',
    username: '',
    email: '',
    phone: '',
    status: 'active',
    password: '',
    password_confirmation: '',
  })
}

function openCreateModal() {
  modalMode.value = 'create'
  resetForm()
  modalOpen.value = true
}

function openEditModal(teacher, mode = 'edit') {
  modalMode.value = mode
  Object.assign(form, {
    first_name: teacher?.firstName || '',
    last_name: teacher?.lastName || '',
    username: teacher?.username || '',
    email: teacher?.email || '',
    phone: teacher?.phone || '',
    status: teacher?.status || 'active',
    password: '',
    password_confirmation: '',
  })
  deleteTarget.value = teacher || null
  modalOpen.value = true
}

function closeModal() {
  modalOpen.value = false
  saving.value = false
}

function normalizePayload() {
  return {
    first_name: form.first_name.trim(),
    last_name: form.last_name.trim(),
    username: form.username.trim() || null,
    email: form.email.trim(),
    phone: form.phone.trim() || null,
    status: form.status,
    ...(form.password ? {
      password: form.password,
      password_confirmation: form.password_confirmation,
    } : {}),
  }
}

async function loadTeachers() {
  loading.value = true
  errorMessage.value = ''

  try {
    const response = await fetchEnglishTeachers({
      page: currentPage.value,
      perPage: pageSize,
      search: searchQuery.value,
      status: statusFilter.value,
    })

    teachers.value = response.items || []
    pagination.value = response.pagination || pagination.value
  } catch (error) {
    teachers.value = []
    errorMessage.value = error?.message || 'Failed to load English teachers.'
  } finally {
    loading.value = false
  }
}

async function onSaveTeacher() {
  saving.value = true
  errorMessage.value = ''

  try {
    const payload = normalizePayload()
    if (modalMode.value === 'edit' && deleteTarget.value?.id) {
      await updateEnglishTeacher(deleteTarget.value.id, payload)
      successMessage.value = 'English teacher updated successfully.'
    } else {
      await createEnglishTeacher(payload)
      successMessage.value = 'English teacher created successfully.'
    }

    showSuccess.value = true
    closeModal()
    await loadTeachers()
  } catch (error) {
    errorMessage.value = error?.message || 'Failed to save English teacher.'
  } finally {
    saving.value = false
  }
}

function onViewTeacher(teacher) {
  openEditModal(teacher, 'view')
}

function onEditTeacher(teacher) {
  openEditModal(teacher, 'edit')
}

function onDeleteTeacher(teacher) {
  deleteTarget.value = teacher
  deleteOpen.value = true
}

async function confirmDelete() {
  const id = String(deleteTarget.value?.id || '').trim()
  if (!id) return

  try {
    await deleteEnglishTeacher(id)
    successMessage.value = 'English teacher deleted successfully.'
    showSuccess.value = true
    deleteOpen.value = false
    deleteTarget.value = null
    await loadTeachers()
  } catch (error) {
    errorMessage.value = error?.message || 'Failed to delete English teacher.'
  }
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
    <section class="english-teachers-page">
      <HeaderSection
        title="English Teachers"
        subtitle="Manage English teacher accounts, permissions, and assignments."
      />

      <div class="english-teachers-page__panel">
        <div class="english-teachers-page__toolbar">
          <Button type="button" variant="primary" size="md" rounded="xl" @click="openCreateModal">
            Add Teacher
          </Button>
        </div>

        <div class="english-teachers-page__filters">
          <input v-model="searchQuery" class="english-teachers-page__input" type="search" placeholder="Search teachers" />
          <select v-model="statusFilter" class="english-teachers-page__input">
            <option value="">All status</option>
            <option v-for="option in statusOptions" :key="option" :value="option">{{ option }}</option>
          </select>
        </div>

        <div
          v-if="errorMessage"
          class="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"
        >
          {{ errorMessage }}
        </div>

        <UsersTable
          :rows="mappedTeachers"
          :columns="tableColumns"
          :loading="loading"
          empty-text="No English teachers found."
          @view="onViewTeacher"
          @edit="onEditTeacher"
          @delete="onDeleteTeacher"
        />

        <div v-if="pagination.totalPages > 1" class="flex justify-end">
          <Pagination v-model="currentPage" :total-pages="pagination.totalPages" class="mt-2" />
        </div>
      </div>
    </section>

    <Dialog
      v-model:visible="modalOpen"
      :header="modalMode === 'view' ? 'View Teacher' : modalMode === 'edit' ? 'Edit Teacher' : 'Create Teacher'"
      modal
      class="english-teachers-page__dialog"
    >
      <div class="english-teachers-page__dialog-grid">
        <input v-model="form.first_name" class="english-teachers-page__input" type="text" placeholder="First name" :disabled="modalMode === 'view'" />
        <input v-model="form.last_name" class="english-teachers-page__input" type="text" placeholder="Last name" :disabled="modalMode === 'view'" />
        <input v-model="form.username" class="english-teachers-page__input" type="text" placeholder="Username" :disabled="modalMode === 'view'" />
        <input v-model="form.email" class="english-teachers-page__input" type="email" placeholder="Email" :disabled="modalMode === 'view'" />
        <input v-model="form.phone" class="english-teachers-page__input" type="text" placeholder="Phone" :disabled="modalMode === 'view'" />
        <select v-model="form.status" class="english-teachers-page__input" :disabled="modalMode === 'view'">
          <option v-for="option in statusOptions" :key="option" :value="option">{{ option }}</option>
        </select>
        <input
          v-if="modalMode !== 'view'"
          v-model="form.password"
          class="english-teachers-page__input english-teachers-page__dialog-full"
          type="password"
          placeholder="Password"
        />
        <input
          v-if="modalMode !== 'view'"
          v-model="form.password_confirmation"
          class="english-teachers-page__input english-teachers-page__dialog-full"
          type="password"
          placeholder="Confirm password"
        />
      </div>

      <template #footer>
        <Button type="button" variant="outline" rounded="xl" @click="closeModal">Close</Button>
        <Button v-if="modalMode !== 'view'" type="button" variant="primary" rounded="xl" :loading="saving" :disabled="saving" @click="onSaveTeacher">
          Save
        </Button>
      </template>
    </Dialog>

    <AlertQuestion
      :show="deleteOpen"
      title="Delete teacher?"
      :message="`Are you sure you want to delete ${deleteTarget?.name || 'this teacher'}?`"
      confirm-text="Delete"
      cancel-text="Cancel"
      type="danger"
      @confirm="confirmDelete"
      @cancel="deleteOpen = false"
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
.english-teachers-page {
  display: flex;
  flex-direction: column;
  gap: 1.35rem;
}

.english-teachers-page__panel {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.5rem;
  border-radius: 1.5rem;
  border: 1px solid #dce6f2;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.98) 100%);
  box-shadow: 0 25px 60px -40px rgba(15, 23, 42, 0.5);
}

.english-teachers-page__toolbar {
  display: flex;
  justify-content: flex-end;
}

.english-teachers-page__filters {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.75rem;
}

.english-teachers-page__input {
  width: 100%;
  min-height: 2.7rem;
  border-radius: 0.8rem;
  border: 1px solid #d4dde8;
  background: #fcfdff;
  padding: 0.6rem 0.8rem;
  color: #0f172a;
}

.english-teachers-page__dialog-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.75rem;
  min-width: min(100vw - 2rem, 44rem);
}

.english-teachers-page__dialog-full {
  grid-column: 1 / -1;
}

@media (max-width: 900px) {
  .english-teachers-page__filters,
  .english-teachers-page__dialog-grid {
    grid-template-columns: 1fr;
    min-width: 0;
  }
}
</style>
