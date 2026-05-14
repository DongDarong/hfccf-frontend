<script setup>
import { computed, onMounted, reactive, ref, watch } from 'vue'
import Dialog from 'primevue/dialog'
import MainLayout from '@/layouts/MainLayout.vue'
import HeaderSection from '@/components/navigation/HeaderSection.vue'
import Table from '@/components/data-display/Table.vue'
import Pagination from '@/components/data-display/Pagination.vue'
import Button from '@/components/buttons/Button.vue'
import AlertQuestion from '@/components/alerts/AlertQuestion.vue'
import AlertSuccess from '@/components/alerts/AlertSuccess.vue'
import { createEnglishStudent, deleteEnglishStudent, fetchEnglishClasses, fetchEnglishStudents, updateEnglishStudent } from '@/modules/english/services/englishApi'

defineOptions({
  name: 'EnglishStudentManagementPage',
})

const searchQuery = ref('')
const statusFilter = ref('')
const genderFilter = ref('')
const currentPage = ref(1)
const pageSize = 10
const loading = ref(false)
const errorMessage = ref('')
const students = ref([])
const classes = ref([])
const pagination = ref({ page: 1, perPage: pageSize, total: 0, totalPages: 1 })
const modalOpen = ref(false)
const modalMode = ref('create')
const saving = ref(false)
const showSuccess = ref(false)
const successMessage = ref('')
const deleteTarget = ref(null)
const deleteOpen = ref(false)

const form = reactive({
  student_code: '',
  first_name: '',
  last_name: '',
  gender: '',
  date_of_birth: '',
  guardian_name: '',
  guardian_phone: '',
  email: '',
  phone: '',
  address: '',
  status: 'active',
  class_ids: [],
})

const statusOptions = ['active', 'inactive', 'archived']
const genderOptions = ['male', 'female', 'other']

const tableColumns = [
  { key: 'number', label: 'No.', align: 'left' },
  { key: 'student', label: 'Student', align: 'left' },
  { key: 'studentCode', label: 'Code', align: 'left' },
  { key: 'gender', label: 'Gender', align: 'left' },
  { key: 'status', label: 'Status', align: 'left' },
  { key: 'guardian', label: 'Guardian', align: 'left' },
  { key: 'classesCount', label: 'Classes', align: 'left' },
  { key: 'actions', label: 'Actions', align: 'right' },
]

const mappedStudents = computed(() =>
  students.value.map((student) => ({
    ...student,
    student: student.fullName || `${student.firstName || ''} ${student.lastName || ''}`.trim(),
    studentCode: student.studentCode || '-',
    guardian: student.guardianName || '-',
    classesCount: student.classesCount ?? 0,
  })),
)

const classOptions = computed(() =>
  classes.value.map((item) => ({
    value: item.id,
    label: item.name || item.classCode || item.id,
  })),
)

function resetForm() {
  Object.assign(form, {
    student_code: '',
    first_name: '',
    last_name: '',
    gender: '',
    date_of_birth: '',
    guardian_name: '',
    guardian_phone: '',
    email: '',
    phone: '',
    address: '',
    status: 'active',
    class_ids: [],
  })
}

function openCreateModal() {
  modalMode.value = 'create'
  resetForm()
  modalOpen.value = true
}

function openEditModal(item, mode = 'edit') {
  modalMode.value = mode
  Object.assign(form, {
    student_code: item?.studentCode || '',
    first_name: item?.firstName || '',
    last_name: item?.lastName || '',
    gender: item?.gender || '',
    date_of_birth: item?.dateOfBirth || '',
    guardian_name: item?.guardianName || '',
    guardian_phone: item?.guardianPhone || '',
    email: item?.email || '',
    phone: item?.phone || '',
    address: item?.address || '',
    status: item?.status || 'active',
    class_ids: Array.isArray(item?.classIds) ? item.classIds.filter(Boolean) : [],
  })
  deleteTarget.value = item || null
  modalOpen.value = true
}

function closeModal() {
  modalOpen.value = false
  saving.value = false
}

function normalizePayload() {
  return {
    student_code: form.student_code.trim() || null,
    first_name: form.first_name.trim(),
    last_name: form.last_name.trim(),
    gender: form.gender || null,
    date_of_birth: form.date_of_birth || null,
    guardian_name: form.guardian_name.trim() || null,
    guardian_phone: form.guardian_phone.trim() || null,
    email: form.email.trim() || null,
    phone: form.phone.trim() || null,
    address: form.address.trim() || null,
    status: form.status,
    class_ids: form.class_ids,
  }
}

async function loadStudents() {
  loading.value = true
  errorMessage.value = ''

  try {
    const response = await fetchEnglishStudents({
      page: currentPage.value,
      perPage: pageSize,
      search: searchQuery.value,
      status: statusFilter.value,
      gender: genderFilter.value,
    })

    students.value = response.items || []
    pagination.value = response.pagination || pagination.value
  } catch (error) {
    students.value = []
    errorMessage.value = error?.message || 'Failed to load English students.'
  } finally {
    loading.value = false
  }
}

async function loadClasses() {
  try {
    const response = await fetchEnglishClasses({ perPage: 100, status: 'active' })
    classes.value = response.items || []
  } catch {
    classes.value = []
  }
}

async function onSaveStudent() {
  saving.value = true
  errorMessage.value = ''

  try {
    const payload = normalizePayload()
    if (modalMode.value === 'edit' && deleteTarget.value?.id) {
      await updateEnglishStudent(deleteTarget.value.id, payload)
      successMessage.value = 'English student updated successfully.'
    } else {
      await createEnglishStudent(payload)
      successMessage.value = 'English student created successfully.'
    }

    showSuccess.value = true
    closeModal()
    await loadStudents()
  } catch (error) {
    errorMessage.value = error?.message || 'Failed to save English student.'
  } finally {
    saving.value = false
  }
}

function onViewStudent(item) {
  openEditModal(item, 'view')
}

function onEditStudent(item) {
  openEditModal(item, 'edit')
}

function onDeleteStudent(item) {
  deleteTarget.value = item
  deleteOpen.value = true
}

async function confirmDelete() {
  const id = String(deleteTarget.value?.id || '').trim()
  if (!id) return

  try {
    await deleteEnglishStudent(id)
    successMessage.value = 'English student deleted successfully.'
    showSuccess.value = true
    deleteOpen.value = false
    deleteTarget.value = null
    await loadStudents()
  } catch (error) {
    errorMessage.value = error?.message || 'Failed to delete English student.'
  }
}

watch([searchQuery, statusFilter, genderFilter], () => {
  currentPage.value = 1
  loadStudents()
})

watch(currentPage, () => {
  loadStudents()
})

onMounted(() => {
  Promise.all([loadClasses(), loadStudents()])
})
</script>

<template>
  <MainLayout>
    <section class="english-students-page">
      <HeaderSection
        title="English Students"
        subtitle="Manage English student records and class assignments."
      />

      <div class="english-students-page__panel">
        <div class="english-students-page__toolbar">
          <Button type="button" variant="primary" size="md" rounded="xl" @click="openCreateModal">
            Add Student
          </Button>
        </div>

        <div class="english-students-page__filters">
          <input v-model="searchQuery" class="english-students-page__input" type="search" placeholder="Search students" />
          <select v-model="genderFilter" class="english-students-page__input">
            <option value="">All genders</option>
            <option v-for="option in genderOptions" :key="option" :value="option">{{ option }}</option>
          </select>
          <select v-model="statusFilter" class="english-students-page__input">
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

        <Table
          :rows="mappedStudents"
          :columns="tableColumns"
          :loading="loading"
          empty-text="No English students found."
          @view="onViewStudent"
          @edit="onEditStudent"
          @delete="onDeleteStudent"
        />

        <div v-if="pagination.totalPages > 1" class="flex justify-end">
          <Pagination v-model="currentPage" :total-pages="pagination.totalPages" class="mt-2" />
        </div>
      </div>
    </section>

    <Dialog
      v-model:visible="modalOpen"
      :header="modalMode === 'view' ? 'View Student' : modalMode === 'edit' ? 'Edit Student' : 'Create Student'"
      modal
      class="english-students-page__dialog"
    >
      <div class="english-students-page__dialog-grid">
        <input v-model="form.student_code" class="english-students-page__input" type="text" placeholder="Student code" :disabled="modalMode === 'view'" />
        <input v-model="form.first_name" class="english-students-page__input" type="text" placeholder="First name" :disabled="modalMode === 'view'" />
        <input v-model="form.last_name" class="english-students-page__input" type="text" placeholder="Last name" :disabled="modalMode === 'view'" />
        <select v-model="form.gender" class="english-students-page__input" :disabled="modalMode === 'view'">
          <option value="">Gender</option>
          <option v-for="option in genderOptions" :key="option" :value="option">{{ option }}</option>
        </select>
        <input v-model="form.date_of_birth" class="english-students-page__input" type="date" :disabled="modalMode === 'view'" />
        <input v-model="form.guardian_name" class="english-students-page__input" type="text" placeholder="Guardian name" :disabled="modalMode === 'view'" />
        <input v-model="form.guardian_phone" class="english-students-page__input" type="text" placeholder="Guardian phone" :disabled="modalMode === 'view'" />
        <input v-model="form.email" class="english-students-page__input" type="email" placeholder="Email" :disabled="modalMode === 'view'" />
        <input v-model="form.phone" class="english-students-page__input" type="text" placeholder="Phone" :disabled="modalMode === 'view'" />
        <select v-model="form.status" class="english-students-page__input" :disabled="modalMode === 'view'">
          <option v-for="option in statusOptions" :key="option" :value="option">{{ option }}</option>
        </select>
        <select v-model="form.class_ids" class="english-students-page__input english-students-page__dialog-full english-students-page__multiselect" multiple :disabled="modalMode === 'view'">
          <option v-for="option in classOptions" :key="option.value" :value="option.value">{{ option.label }}</option>
        </select>
        <textarea v-model="form.address" class="english-students-page__input english-students-page__dialog-full" rows="3" placeholder="Address" :disabled="modalMode === 'view'"></textarea>
      </div>

      <template #footer>
        <Button type="button" variant="outline" rounded="xl" @click="closeModal">Close</Button>
        <Button v-if="modalMode !== 'view'" type="button" variant="primary" rounded="xl" :loading="saving" :disabled="saving" @click="onSaveStudent">
          Save
        </Button>
      </template>
    </Dialog>

    <AlertQuestion
      :show="deleteOpen"
      title="Delete student?"
      :message="`Are you sure you want to delete ${deleteTarget?.student || 'this student'}?`"
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
.english-students-page {
  display: flex;
  flex-direction: column;
  gap: 1.35rem;
}

.english-students-page__panel {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.5rem;
  border-radius: 1.5rem;
  border: 1px solid #dce6f2;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.98) 100%);
  box-shadow: 0 25px 60px -40px rgba(15, 23, 42, 0.5);
}

.english-students-page__toolbar {
  display: flex;
  justify-content: flex-end;
}

.english-students-page__filters {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.75rem;
}

.english-students-page__input {
  width: 100%;
  min-height: 2.7rem;
  border-radius: 0.8rem;
  border: 1px solid #d4dde8;
  background: #fcfdff;
  padding: 0.6rem 0.8rem;
  color: #0f172a;
}

.english-students-page__dialog-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.75rem;
  min-width: min(100vw - 2rem, 48rem);
}

.english-students-page__dialog-full {
  grid-column: 1 / -1;
}

.english-students-page__multiselect {
  min-height: 8rem;
}

@media (max-width: 900px) {
  .english-students-page__filters,
  .english-students-page__dialog-grid {
    grid-template-columns: 1fr;
    min-width: 0;
  }
}
</style>
