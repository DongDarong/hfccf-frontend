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
import { fetchEnglishClasses, fetchEnglishStudents, fetchEnglishTeachers, createEnglishClass, updateEnglishClass, deleteEnglishClass } from '@/modules/english/services/englishApi'

defineOptions({
  name: 'EnglishClassManagementPage',
})

const searchQuery = ref('')
const statusFilter = ref('')
const levelFilter = ref('')
const currentPage = ref(1)
const pageSize = 10
const loading = ref(false)
const errorMessage = ref('')
const classes = ref([])
const teachers = ref([])
const students = ref([])
const pagination = ref({ page: 1, perPage: pageSize, total: 0, totalPages: 1 })
const modalOpen = ref(false)
const modalMode = ref('create')
const saving = ref(false)
const showSuccess = ref(false)
const successMessage = ref('')
const deleteTarget = ref(null)
const deleteOpen = ref(false)

const form = reactive({
  class_code: '',
  name: '',
  level: '',
  teacher_user_id: '',
  schedule: '',
  room: '',
  status: 'active',
  description: '',
  student_ids: [],
})

const statusOptions = ['active', 'inactive', 'archived']
const levelOptions = ['Beginner', 'Elementary', 'Pre-Intermediate', 'Intermediate', 'Upper Intermediate']

const tableColumns = [
  { key: 'number', label: 'No.', align: 'left' },
  { key: 'classCode', label: 'Code', align: 'left' },
  { key: 'name', label: 'Class', align: 'left' },
  { key: 'level', label: 'Level', align: 'left' },
  { key: 'teacher', label: 'Teacher', align: 'left' },
  { key: 'studentsCount', label: 'Students', align: 'left' },
  { key: 'taskCount', label: 'Tasks', align: 'left' },
  { key: 'status', label: 'Status', align: 'left' },
  { key: 'actions', label: 'Actions', align: 'right' },
]

const mappedClasses = computed(() =>
  classes.value.map((item) => ({
    ...item,
    classCode: item.classCode || '-',
    teacher: item.teacherDisplayName || item.teacher?.name || '-',
    studentsCount: item.studentsCount ?? 0,
    taskCount: item.tasksCount ?? 0,
  })),
)

const teacherOptions = computed(() =>
  teachers.value.map((teacher) => ({
    value: teacher.id,
    label: teacher.name || teacher.fullName || teacher.email,
  })),
)

const studentOptions = computed(() =>
  students.value.map((student) => ({
    value: student.id,
    label: student.fullName || student.name || student.studentCode || student.id,
  })),
)

function resetForm() {
  Object.assign(form, {
    class_code: '',
    name: '',
    level: '',
    teacher_user_id: '',
    schedule: '',
    room: '',
    status: 'active',
    description: '',
    student_ids: [],
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
    class_code: item?.classCode || '',
    name: item?.name || '',
    level: item?.level || '',
    teacher_user_id: item?.teacherUserId || '',
    schedule: item?.schedule || '',
    room: item?.room || '',
    status: item?.status || 'active',
    description: item?.description || '',
    student_ids: Array.isArray(item?.studentIds) ? item.studentIds.filter(Boolean) : [],
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
    class_code: form.class_code.trim() || null,
    name: form.name.trim(),
    level: form.level.trim(),
    teacher_user_id: form.teacher_user_id || null,
    schedule: form.schedule.trim() || null,
    room: form.room.trim() || null,
    status: form.status,
    description: form.description.trim() || null,
    student_ids: form.student_ids,
  }
}

async function loadTeachers() {
  try {
    const response = await fetchEnglishTeachers({ perPage: 100, status: 'active' })
    teachers.value = response.items || []
  } catch {
    teachers.value = []
  }
}

async function loadStudents() {
  try {
    const response = await fetchEnglishStudents({ perPage: 100, status: 'active' })
    students.value = response.items || []
  } catch {
    students.value = []
  }
}

async function loadClasses() {
  loading.value = true
  errorMessage.value = ''

  try {
    const response = await fetchEnglishClasses({
      page: currentPage.value,
      perPage: pageSize,
      search: searchQuery.value,
      status: statusFilter.value,
      level: levelFilter.value,
    })

    classes.value = response.items || []
    pagination.value = response.pagination || pagination.value
  } catch (error) {
    classes.value = []
    errorMessage.value = error?.message || 'Failed to load English classes.'
  } finally {
    loading.value = false
  }
}

async function onSaveClass() {
  saving.value = true
  errorMessage.value = ''

  try {
    const payload = normalizePayload()
    if (modalMode.value === 'edit' && deleteTarget.value?.id) {
      await updateEnglishClass(deleteTarget.value.id, payload)
      successMessage.value = 'English class updated successfully.'
    } else {
      await createEnglishClass(payload)
      successMessage.value = 'English class created successfully.'
    }

    showSuccess.value = true
    closeModal()
    await loadClasses()
  } catch (error) {
    errorMessage.value = error?.message || 'Failed to save English class.'
  } finally {
    saving.value = false
  }
}

function onViewClass(item) {
  openEditModal(item, 'view')
}

function onEditClass(item) {
  openEditModal(item, 'edit')
}

function onDeleteClass(item) {
  deleteTarget.value = item
  deleteOpen.value = true
}

async function confirmDelete() {
  const id = String(deleteTarget.value?.id || '').trim()
  if (!id) return

  try {
    await deleteEnglishClass(id)
    successMessage.value = 'English class deleted successfully.'
    showSuccess.value = true
    deleteOpen.value = false
    deleteTarget.value = null
    await loadClasses()
  } catch (error) {
    errorMessage.value = error?.message || 'Failed to delete English class.'
  }
}

watch([searchQuery, statusFilter, levelFilter], () => {
  currentPage.value = 1
  loadClasses()
})

watch(currentPage, () => {
  loadClasses()
})

onMounted(async () => {
  await Promise.all([loadTeachers(), loadStudents(), loadClasses()])
})
</script>

<template>
  <MainLayout>
    <section class="english-classes-page">
      <HeaderSection
        title="English Classes"
        subtitle="Manage English class records and teacher assignments."
      />

      <div class="english-classes-page__panel">
        <div class="english-classes-page__toolbar">
          <Button type="button" variant="primary" size="md" rounded="xl" @click="openCreateModal">
            Add Class
          </Button>
        </div>

        <div class="english-classes-page__filters">
          <input v-model="searchQuery" class="english-classes-page__input" type="search" placeholder="Search classes" />
          <select v-model="levelFilter" class="english-classes-page__input">
            <option value="">All levels</option>
            <option v-for="option in levelOptions" :key="option" :value="option">{{ option }}</option>
          </select>
          <select v-model="statusFilter" class="english-classes-page__input">
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
          :rows="mappedClasses"
          :columns="tableColumns"
          :loading="loading"
          empty-text="No English classes found."
          @view="onViewClass"
          @edit="onEditClass"
          @delete="onDeleteClass"
        />

        <div v-if="pagination.totalPages > 1" class="flex justify-end">
          <Pagination v-model="currentPage" :total-pages="pagination.totalPages" class="mt-2" />
        </div>
      </div>
    </section>

    <Dialog
      v-model:visible="modalOpen"
      :header="modalMode === 'view' ? 'View Class' : modalMode === 'edit' ? 'Edit Class' : 'Create Class'"
      modal
      class="english-classes-page__dialog"
    >
      <div class="english-classes-page__dialog-grid">
        <input v-model="form.class_code" class="english-classes-page__input" type="text" placeholder="Class code" :disabled="modalMode === 'view'" />
        <input v-model="form.name" class="english-classes-page__input" type="text" placeholder="Class name" :disabled="modalMode === 'view'" />
        <select v-model="form.level" class="english-classes-page__input" :disabled="modalMode === 'view'">
          <option value="">Level</option>
          <option v-for="option in levelOptions" :key="option" :value="option">{{ option }}</option>
        </select>
        <select v-model="form.teacher_user_id" class="english-classes-page__input" :disabled="modalMode === 'view'">
          <option value="">Select teacher</option>
          <option v-for="option in teacherOptions" :key="option.value" :value="option.value">{{ option.label }}</option>
        </select>
        <select v-model="form.student_ids" class="english-classes-page__input english-classes-page__dialog-full english-classes-page__multiselect" multiple :disabled="modalMode === 'view'">
          <option v-for="option in studentOptions" :key="option.value" :value="option.value">{{ option.label }}</option>
        </select>
        <input v-model="form.schedule" class="english-classes-page__input" type="text" placeholder="Schedule" :disabled="modalMode === 'view'" />
        <input v-model="form.room" class="english-classes-page__input" type="text" placeholder="Room" :disabled="modalMode === 'view'" />
        <select v-model="form.status" class="english-classes-page__input" :disabled="modalMode === 'view'">
          <option v-for="option in statusOptions" :key="option" :value="option">{{ option }}</option>
        </select>
        <textarea v-model="form.description" class="english-classes-page__input english-classes-page__dialog-full" rows="3" placeholder="Description" :disabled="modalMode === 'view'"></textarea>
      </div>

      <template #footer>
        <Button type="button" variant="outline" rounded="xl" @click="closeModal">Close</Button>
        <Button v-if="modalMode !== 'view'" type="button" variant="primary" rounded="xl" :loading="saving" :disabled="saving" @click="onSaveClass">
          Save
        </Button>
      </template>
    </Dialog>

    <AlertQuestion
      :show="deleteOpen"
      title="Delete class?"
      :message="`Are you sure you want to delete ${deleteTarget?.name || 'this class'}?`"
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
.english-classes-page {
  display: flex;
  flex-direction: column;
  gap: 1.35rem;
}

.english-classes-page__panel {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.5rem;
  border-radius: 1.5rem;
  border: 1px solid #dce6f2;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.98) 100%);
  box-shadow: 0 25px 60px -40px rgba(15, 23, 42, 0.5);
}

.english-classes-page__toolbar {
  display: flex;
  justify-content: flex-end;
}

.english-classes-page__filters {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.75rem;
}

.english-classes-page__input {
  width: 100%;
  min-height: 2.7rem;
  border-radius: 0.8rem;
  border: 1px solid #d4dde8;
  background: #fcfdff;
  padding: 0.6rem 0.8rem;
  color: #0f172a;
}

.english-classes-page__dialog-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.75rem;
  min-width: min(100vw - 2rem, 48rem);
}

.english-classes-page__dialog-full {
  grid-column: 1 / -1;
}

.english-classes-page__multiselect {
  min-height: 8rem;
}

@media (max-width: 900px) {
  .english-classes-page__filters,
  .english-classes-page__dialog-grid {
    grid-template-columns: 1fr;
    min-width: 0;
  }
}
</style>
