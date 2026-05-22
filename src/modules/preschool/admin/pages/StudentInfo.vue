<script setup>
// Keep student management text locale-driven so EN/KH parity is testable and
// hardcoded English labels do not reappear in a production page.
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { getAvatarInitials } from '@/utils/avatar'
import Dialog from 'primevue/dialog'
import MultiSelect from 'primevue/multiselect'
import MainLayout from '@/layouts/MainLayout.vue'
import HeaderSection from '@/components/navigation/HeaderSection.vue'
import Table from '@/components/data-display/Table.vue'
import Pagination from '@/components/data-display/Pagination.vue'
import Button from '@/components/buttons/Button.vue'
import AlertQuestion from '@/components/alerts/AlertQuestion.vue'
import AlertSuccess from '@/components/alerts/AlertSuccess.vue'
import { useLanguage } from '@/composables/useLanguage'
import { fetchPreschoolClasses, fetchPreschoolStudents, createPreschoolStudent, updatePreschoolStudent, deletePreschoolStudent } from '@/modules/preschool/services/preschoolApi'

defineOptions({
  name: 'PreschoolAdminStudentInfoPage',
})

const { t } = useLanguage()

const searchQuery = ref('')
const statusFilter = ref('')
const genderFilter = ref('')
const classFilter = ref('')
const currentPage = ref(1)
const pageSize = 10
const loading = ref(false)
const errorMessage = ref('')
const students = ref([])
const pagination = ref({ page: 1, perPage: pageSize, total: 0, totalPages: 1 })
const classOptions = ref([])
const modalOpen = ref(false)
const modalMode = ref('create')
const currentStudentId = ref('')
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
  address: '',
  status: 'active',
  class_ids: [],
})

const genderOptions = computed(() => [
  { label: t('preschoolStudentInfoPage.options.male'), value: 'male' },
  { label: t('preschoolStudentInfoPage.options.female'), value: 'female' },
  { label: t('preschoolStudentInfoPage.options.other'), value: 'other' },
])

const statusOptions = computed(() => [
  { label: t('preschoolStudentInfoPage.options.active'), value: 'active' },
  { label: t('preschoolStudentInfoPage.options.pending'), value: 'pending' },
  { label: t('preschoolStudentInfoPage.options.inactive'), value: 'inactive' },
  { label: t('preschoolStudentInfoPage.options.graduated'), value: 'graduated' },
])

const tableColumns = computed(() => [
  { key: 'number', label: t('preschoolStudentInfoPage.columns.no'), align: 'left' },
  { key: 'student', label: t('preschoolStudentInfoPage.columns.student'), align: 'left' },
  { key: 'studentCode', label: t('preschoolStudentInfoPage.columns.code'), align: 'left' },
  { key: 'gender', label: t('preschoolStudentInfoPage.columns.gender'), align: 'left' },
  { key: 'status', label: t('preschoolStudentInfoPage.columns.status'), align: 'left' },
  { key: 'classesCount', label: t('preschoolStudentInfoPage.columns.classes'), align: 'left' },
  { key: 'guardianPhone', label: t('preschoolStudentInfoPage.columns.guardianPhone'), align: 'left' },
  { key: 'actions', label: t('preschoolStudentInfoPage.columns.actions'), align: 'right' },
])

const mappedStudents = computed(() =>
  students.value.map((student) => {
    const fullName =
      student.fullName ||
      `${student.firstName || ''} ${student.lastName || ''}`.trim() ||
      student.name ||
      '-'
    return {
      ...student,
      name: fullName,
      classesCount: student.classesCount || student.classes?.length || 0,
      guardianPhone: student.guardianPhone || '-',
    }
  }),
)

const studentInitials = computed(() => {
  const name = `${form.first_name} ${form.last_name}`.trim()
  return getAvatarInitials(name, '?')
})

function resetForm() {
  form.student_code = ''
  form.first_name = ''
  form.last_name = ''
  form.gender = ''
  form.date_of_birth = ''
  form.guardian_name = ''
  form.guardian_phone = ''
  form.address = ''
  form.status = 'active'
  form.class_ids = []
}

function openCreateModal() {
  modalMode.value = 'create'
  currentStudentId.value = ''
  resetForm()
  modalOpen.value = true
}

function openEditModal(student) {
  modalMode.value = 'edit'
  currentStudentId.value = String(student?.id || '').trim()
  form.student_code = student?.studentCode || ''
  form.first_name = student?.firstName || ''
  form.last_name = student?.lastName || ''
  form.gender = student?.gender || ''
  form.date_of_birth = student?.dateOfBirth || ''
  form.guardian_name = student?.guardianName || ''
  form.guardian_phone = student?.guardianPhone || ''
  form.address = student?.address || ''
  form.status = student?.status || 'active'
  form.class_ids = Array.isArray(student?.classes)
    ? student.classes.map((item) => item.id).filter(Boolean)
    : []
  modalOpen.value = true
}

function closeModal() {
  modalOpen.value = false
  currentStudentId.value = ''
  saving.value = false
}

function normalizeStudentPayload() {
  return {
    student_code: form.student_code.trim(),
    first_name: form.first_name.trim(),
    last_name: form.last_name.trim(),
    gender: form.gender || null,
    date_of_birth: form.date_of_birth || null,
    guardian_name: form.guardian_name.trim() || null,
    guardian_phone: form.guardian_phone.trim() || null,
    address: form.address.trim() || null,
    status: form.status,
    class_ids: form.class_ids,
  }
}

async function loadClasses() {
  try {
    const response = await fetchPreschoolClasses({ perPage: 100 })
    classOptions.value = (response.items || []).map((item) => ({
      label: `${item.code} - ${item.name}`,
      value: item.id,
    }))
  } catch {
    classOptions.value = []
  }
}

async function loadStudents() {
  loading.value = true
  errorMessage.value = ''

  try {
    const response = await fetchPreschoolStudents({
      page: currentPage.value,
      perPage: pageSize,
      search: searchQuery.value,
      status: statusFilter.value,
      gender: genderFilter.value,
      classId: classFilter.value,
    })

    students.value = response.items || []
    pagination.value = response.pagination || pagination.value
  } catch (error) {
    students.value = []
    errorMessage.value = error?.message || t('preschoolStudentInfoPage.messages.loadFailed')
  } finally {
    loading.value = false
  }
}

async function onSaveStudent() {
  errorMessage.value = ''
  saving.value = true

  try {
    const payload = normalizeStudentPayload()
    if (modalMode.value === 'edit') {
      await updatePreschoolStudent(currentStudentId.value, payload)
      successMessage.value = t('preschoolStudentInfoPage.messages.updateSuccess')
    } else {
      await createPreschoolStudent(payload)
      successMessage.value = t('preschoolStudentInfoPage.messages.createSuccess')
    }
    showSuccess.value = true
    closeModal()
    await loadStudents()
  } catch (error) {
    errorMessage.value = error?.message || t('preschoolStudentInfoPage.messages.saveFailed')
  } finally {
    saving.value = false
  }
}

function onDeleteStudent(student) {
  deleteTarget.value = student
  deleteOpen.value = true
}

async function confirmDelete() {
  const id = String(deleteTarget.value?.id || '').trim()
  if (!id) return

  try {
    await deletePreschoolStudent(id)
    successMessage.value = t('preschoolStudentInfoPage.messages.deleteSuccess')
    showSuccess.value = true
    deleteOpen.value = false
    deleteTarget.value = null
    await loadStudents()
  } catch (error) {
    errorMessage.value = error?.message || t('preschoolStudentInfoPage.messages.saveFailed')
  }
}

function onViewStudent(student) {
  openEditModal(student)
}

watch([searchQuery, statusFilter, genderFilter, classFilter], () => {
  currentPage.value = 1
  loadStudents()
})

watch(currentPage, () => {
  loadStudents()
})

onMounted(async () => {
  await loadClasses()
  await loadStudents()
})
</script>

<template>
  <MainLayout>
    <section class="student-info-page">
      <HeaderSection
        :title="t('preschoolStudentInfoPage.title')"
        :subtitle="t('preschoolStudentInfoPage.subtitle')"
      />

      <div class="student-info-page__panel">
        <div class="student-info-page__toolbar">
          <Button type="button" variant="primary" size="md" rounded="xl" @click="openCreateModal">
            {{ t('preschoolStudentInfoPage.addButton') }}
          </Button>
        </div>

        <div class="student-info-page__filters">
          <input v-model="searchQuery" class="student-info-page__input" type="search" :placeholder="t('preschoolStudentInfoPage.searchPlaceholder')" />
          <select v-model="statusFilter" class="student-info-page__input">
            <option value="">{{ t('preschoolStudentInfoPage.filters.allStatus') }}</option>
            <option v-for="option in statusOptions" :key="option.value" :value="option.value">
              {{ option.label }}
            </option>
          </select>
          <select v-model="genderFilter" class="student-info-page__input">
            <option value="">{{ t('preschoolStudentInfoPage.filters.allGenders') }}</option>
            <option v-for="option in genderOptions" :key="option.value" :value="option.value">
              {{ option.label }}
            </option>
          </select>
          <select v-model="classFilter" class="student-info-page__input">
            <option value="">{{ t('preschoolStudentInfoPage.filters.allClasses') }}</option>
            <option v-for="option in classOptions" :key="option.value" :value="option.value">
              {{ option.label }}
            </option>
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
          :empty-text="t('preschoolStudentInfoPage.messages.noResults')"
          @view="onViewStudent"
          @edit="openEditModal"
          @delete="onDeleteStudent"
        />

        <div v-if="pagination.totalPages > 1" class="flex justify-end">
          <Pagination v-model="currentPage" :total-pages="pagination.totalPages" class="mt-2" />
        </div>
      </div>
    </section>

    <Dialog v-model:visible="modalOpen" modal class="student-info-page__dialog">
      <template #header>
        <div class="flex items-center gap-3">
          <div class="student-info-page__dialog-avatar">
            <span>{{ studentInitials }}</span>
          </div>
          <div>
            <p class="text-base font-semibold text-slate-900">
              {{ modalMode === 'edit' ? t('preschoolStudentInfoPage.dialog.editTitle') : t('preschoolStudentInfoPage.dialog.createTitle') }}
            </p>
            <p v-if="modalMode === 'edit' && (form.first_name || form.last_name)" class="text-xs text-slate-500">
              {{ `${form.first_name} ${form.last_name}`.trim() }}
            </p>
          </div>
        </div>
      </template>
      <div class="student-info-page__dialog-grid">
        <input v-model="form.student_code" class="student-info-page__input" type="text" :placeholder="t('preschoolStudentInfoPage.dialog.studentCode')" />
        <input v-model="form.first_name" class="student-info-page__input" type="text" :placeholder="t('preschoolStudentInfoPage.dialog.firstName')" />
        <input v-model="form.last_name" class="student-info-page__input" type="text" :placeholder="t('preschoolStudentInfoPage.dialog.lastName')" />
        <select v-model="form.gender" class="student-info-page__input">
          <option value="">{{ t('preschoolStudentInfoPage.dialog.gender') }}</option>
          <option v-for="option in genderOptions" :key="option.value" :value="option.value">
            {{ option.label }}
          </option>
        </select>
        <input v-model="form.date_of_birth" class="student-info-page__input" type="date" />
        <input v-model="form.guardian_name" class="student-info-page__input" type="text" :placeholder="t('preschoolStudentInfoPage.dialog.guardianName')" />
        <input v-model="form.guardian_phone" class="student-info-page__input" type="text" :placeholder="t('preschoolStudentInfoPage.dialog.guardianPhone')" />
        <select v-model="form.status" class="student-info-page__input">
          <option v-for="option in statusOptions" :key="option.value" :value="option.value">
            {{ option.label }}
          </option>
        </select>
        <div class="student-info-page__dialog-full">
          <MultiSelect
            v-model="form.class_ids"
            :options="classOptions"
            option-label="label"
            option-value="value"
            :placeholder="t('preschoolStudentInfoPage.dialog.assignClasses')"
            display="chip"
            class="w-full"
          />
        </div>
        <textarea v-model="form.address" class="student-info-page__input student-info-page__dialog-full" rows="3" :placeholder="t('preschoolStudentInfoPage.dialog.address')"></textarea>
      </div>

      <template #footer>
        <Button type="button" variant="outline" rounded="xl" @click="closeModal">{{ t('preschoolStudentInfoPage.dialog.cancel') }}</Button>
        <Button type="button" variant="primary" rounded="xl" :loading="saving" :disabled="saving" @click="onSaveStudent">
          {{ t('preschoolStudentInfoPage.dialog.save') }}
        </Button>
      </template>
    </Dialog>

    <AlertQuestion
      :show="deleteOpen"
      :title="t('preschoolStudentInfoPage.alerts.deleteTitle')"
      :message="t('preschoolStudentInfoPage.alerts.deleteMessage', { name: deleteTarget?.fullName || deleteTarget?.name || t('preschoolStudentInfoPage.alerts.deleteFallback') })"
      :confirm-text="t('common.delete')"
      :cancel-text="t('common.cancel')"
      type="danger"
      @confirm="confirmDelete"
      @cancel="deleteOpen = false"
    />

    <AlertSuccess
      :show="showSuccess"
      :title="t('preschoolStudentInfoPage.alerts.successTitle')"
      :message="successMessage"
      :button-text="t('preschoolStudentInfoPage.alerts.close')"
      @close="showSuccess = false"
    />
  </MainLayout>
</template>

<style scoped>
.student-info-page {
  display: flex;
  flex-direction: column;
  gap: 1.35rem;
}

.student-info-page__panel {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.5rem;
  border-radius: 1.5rem;
  border: 1px solid #dce6f2;
  background:
    radial-gradient(circle at top left, rgba(186, 230, 253, 0.18), transparent 24%),
    linear-gradient(180deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.98) 100%);
  box-shadow: 0 25px 60px -40px rgba(15, 23, 42, 0.5);
}

.student-info-page__toolbar {
  display: flex;
  justify-content: flex-end;
}

.student-info-page__filters {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 0.75rem;
}

.student-info-page__input {
  width: 100%;
  min-height: 2.7rem;
  border-radius: 0.8rem;
  border: 1px solid #d4dde8;
  background: #fcfdff;
  padding: 0.6rem 0.8rem;
  color: #0f172a;
}

.student-info-page__dialog-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.75rem;
  min-width: min(100vw - 2rem, 48rem);
}

.student-info-page__dialog-full {
  grid-column: 1 / -1;
}

.student-info-page__dialog :deep(.p-dialog-content) {
  overflow: visible;
}

.student-info-page__dialog-avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 9999px;
  background: linear-gradient(135deg, #a78bfa 0%, #7c3aed 100%);
  box-shadow: 0 8px 16px -12px rgba(124, 58, 237, 0.5);
  color: #fff;
  font-size: 0.8rem;
  font-weight: 800;
  letter-spacing: 0.04em;
  flex-shrink: 0;
}

@media (max-width: 900px) {
  .student-info-page__filters,
  .student-info-page__dialog-grid {
    grid-template-columns: 1fr;
    min-width: 0;
  }
}
</style>
