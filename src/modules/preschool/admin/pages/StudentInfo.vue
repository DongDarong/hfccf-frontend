<script setup>
// Keep student management text locale-driven so EN/KH parity is testable and
// hardcoded English labels do not reappear in a production page.
import { computed, onMounted, onUnmounted, reactive, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { resolveAvatarSource } from '@/utils/avatar'
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
const router = useRouter()

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

const avatarFileInput = ref(null)
const avatarPreview = ref('')

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
  avatar: null,
  remove_avatar: false,
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
      avatarUrl: resolveAvatarSource(student.avatarUrl || ''),
      classesCount: student.classesCount || student.classes?.length || 0,
      guardianPhone: student.guardianPhone || '-',
    }
  }),
)

function clearAvatarPreview() {
  if (avatarPreview.value.startsWith('blob:')) {
    URL.revokeObjectURL(avatarPreview.value)
  }
  avatarPreview.value = ''
}

function onAvatarClick() {
  avatarFileInput.value?.click()
}

function onAvatarChange(event) {
  const file = event.target.files?.[0]
  if (!file) return
  clearAvatarPreview()
  avatarPreview.value = URL.createObjectURL(file)
  form.avatar = file
  form.remove_avatar = false
}

function onAvatarRemove() {
  clearAvatarPreview()
  form.avatar = null
  form.remove_avatar = true
  if (avatarFileInput.value) avatarFileInput.value.value = ''
}

onUnmounted(clearAvatarPreview)

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
  clearAvatarPreview()
  form.avatar = null
  form.remove_avatar = false
  if (avatarFileInput.value) avatarFileInput.value.value = ''
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
  clearAvatarPreview()
  avatarPreview.value = resolveAvatarSource(student?.avatarUrl || '')
  form.avatar = null
  form.remove_avatar = false
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
    avatar: form.avatar instanceof File ? form.avatar : undefined,
    removeAvatar: form.remove_avatar || undefined,
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
  const studentId = String(student?.id || '').trim()
  if (!studentId) return
  router.push({ name: 'dashboard-preschool-admin-student-profile', params: { id: studentId } })
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

        <!-- toolbar: count + add button -->
        <div class="student-info-page__toolbar">
          <div class="student-info-page__toolbar-meta">
            <p class="text-xs font-semibold uppercase tracking-[0.16em] text-sky-600">
              {{ t('preschoolStudentInfoPage.summary.total') }}
            </p>
            <p class="text-2xl font-bold text-slate-900 leading-none">
              {{ pagination.total ?? mappedStudents.length }}
            </p>
          </div>
          <Button type="button" variant="primary" size="md" rounded="xl" @click="openCreateModal">
            {{ t('preschoolStudentInfoPage.addButton') }}
          </Button>
        </div>

        <!-- filters -->
        <div class="student-info-page__filters">
          <div class="student-info-page__search-wrap">
            <svg class="student-info-page__search-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input v-model="searchQuery" class="student-info-page__input student-info-page__input--search" type="search" :placeholder="t('preschoolStudentInfoPage.searchPlaceholder')" />
          </div>
          <select v-model="statusFilter" class="student-info-page__input">
            <option value="">{{ t('preschoolStudentInfoPage.filters.allStatus') }}</option>
            <option v-for="opt in statusOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
          </select>
          <select v-model="genderFilter" class="student-info-page__input">
            <option value="">{{ t('preschoolStudentInfoPage.filters.allGenders') }}</option>
            <option v-for="opt in genderOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
          </select>
          <select v-model="classFilter" class="student-info-page__input">
            <option value="">{{ t('preschoolStudentInfoPage.filters.allClasses') }}</option>
            <option v-for="opt in classOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
          </select>
        </div>

        <!-- page-level error -->
        <div v-if="errorMessage && !modalOpen" class="student-info-page__error">
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

    <!-- create / edit dialog -->
    <Dialog v-model:visible="modalOpen" modal class="student-info-page__dialog">
      <template #header>
        <div class="student-info-page__dialog-hd">
          <!-- avatar column -->
          <div class="student-info-page__avatar-col">
            <div
              class="student-info-page__dialog-avatar"
              :class="{ 'student-info-page__dialog-avatar--empty': !avatarPreview }"
              :role="modalMode === 'view' ? undefined : 'button'"
              :tabindex="modalMode === 'view' ? -1 : 0"
              :title="modalMode === 'view' ? `${t('common.view')} ${t('preschoolStudentInfoPage.columns.student')}` : t('preschoolStudentInfoPage.dialog.uploadAvatar')"
              :aria-disabled="modalMode === 'view'"
              @click="modalMode !== 'view' && onAvatarClick()"
              @keydown.enter.space.prevent="modalMode !== 'view' && onAvatarClick()"
            >
              <img v-if="avatarPreview" :src="avatarPreview" class="student-info-page__dialog-avatar-img" alt="Student avatar" />
              <span v-else class="student-info-page__avatar-placeholder" aria-hidden="true">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M20 21a8 8 0 0 0-16 0" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </span>
              <div class="student-info-page__dialog-avatar-overlay" aria-hidden="true">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                  <circle cx="12" cy="13" r="4" />
                </svg>
              </div>
            </div>
            <!-- camera badge -->
            <div class="student-info-page__avatar-badge" aria-hidden="true" @click="onAvatarClick">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                <circle cx="12" cy="13" r="4" />
              </svg>
            </div>
          </div>

          <!-- text + actions column -->
          <div class="student-info-page__avatar-info">
            <p class="student-info-page__dialog-title">
              {{
                modalMode === 'view'
                  ? `${t('common.view')} ${t('preschoolStudentInfoPage.columns.student')}`
                  : modalMode === 'edit'
                    ? t('preschoolStudentInfoPage.dialog.editTitle')
                    : t('preschoolStudentInfoPage.dialog.createTitle')
              }}
            </p>
            <p v-if="modalMode !== 'create' && (form.first_name || form.last_name)" class="student-info-page__dialog-name">
              {{ `${form.first_name} ${form.last_name}`.trim() }}
            </p>
            <div class="student-info-page__avatar-btns">
              <button v-if="modalMode !== 'view'" class="student-info-page__avatar-upload-btn" type="button" @click="onAvatarClick">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
                </svg>
                {{ t('preschoolStudentInfoPage.dialog.uploadAvatar') }}
              </button>
              <button v-if="modalMode !== 'view' && avatarPreview" class="student-info-page__avatar-remove-btn" type="button" @click.stop="onAvatarRemove">
                {{ t('preschoolStudentInfoPage.dialog.removeAvatar') }}
              </button>
            </div>
          </div>
        </div>
        <input ref="avatarFileInput" type="file" accept="image/jpeg,image/png,image/webp,image/gif" class="hidden" @change="onAvatarChange" />
      </template>

      <div class="student-info-page__form">

        <!-- Personal information -->
        <p class="student-info-page__form-section">{{ t('preschoolStudentInfoPage.dialog.sectionPersonal') }}</p>
        <div class="student-info-page__form-grid">
          <div class="student-info-page__field">
            <label class="student-info-page__label">{{ t('preschoolStudentInfoPage.dialog.studentCode') }}</label>
            <input v-model="form.student_code" class="student-info-page__input" type="text" :placeholder="t('preschoolStudentInfoPage.dialog.studentCode')" :disabled="modalMode === 'view'" />
          </div>
          <div class="student-info-page__field">
            <label class="student-info-page__label">{{ t('preschoolStudentInfoPage.dialog.status') }}</label>
            <select v-model="form.status" class="student-info-page__input" :disabled="modalMode === 'view'">
              <option v-for="opt in statusOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
            </select>
          </div>
          <div class="student-info-page__field">
            <label class="student-info-page__label">{{ t('preschoolStudentInfoPage.dialog.firstName') }}</label>
            <input v-model="form.first_name" class="student-info-page__input" type="text" :placeholder="t('preschoolStudentInfoPage.dialog.firstName')" :disabled="modalMode === 'view'" />
          </div>
          <div class="student-info-page__field">
            <label class="student-info-page__label">{{ t('preschoolStudentInfoPage.dialog.lastName') }}</label>
            <input v-model="form.last_name" class="student-info-page__input" type="text" :placeholder="t('preschoolStudentInfoPage.dialog.lastName')" :disabled="modalMode === 'view'" />
          </div>
          <div class="student-info-page__field">
            <label class="student-info-page__label">{{ t('preschoolStudentInfoPage.dialog.gender') }}</label>
            <select v-model="form.gender" class="student-info-page__input" :disabled="modalMode === 'view'">
              <option value="">—</option>
              <option v-for="opt in genderOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
            </select>
          </div>
          <div class="student-info-page__field">
            <label class="student-info-page__label">{{ t('preschoolStudentInfoPage.dialog.dateOfBirth') }}</label>
            <input v-model="form.date_of_birth" class="student-info-page__input" type="date" :disabled="modalMode === 'view'" />
          </div>
        </div>

        <!-- Guardian contact -->
        <p class="student-info-page__form-section">{{ t('preschoolStudentInfoPage.dialog.sectionGuardian') }}</p>
        <div class="student-info-page__form-grid">
          <div class="student-info-page__field">
            <label class="student-info-page__label">{{ t('preschoolStudentInfoPage.dialog.guardianName') }}</label>
            <input v-model="form.guardian_name" class="student-info-page__input" type="text" :placeholder="t('preschoolStudentInfoPage.dialog.guardianName')" :disabled="modalMode === 'view'" />
          </div>
          <div class="student-info-page__field">
            <label class="student-info-page__label">{{ t('preschoolStudentInfoPage.dialog.guardianPhone') }}</label>
            <input v-model="form.guardian_phone" class="student-info-page__input" type="text" :placeholder="t('preschoolStudentInfoPage.dialog.guardianPhone')" :disabled="modalMode === 'view'" />
          </div>
        </div>

        <!-- Enrollment -->
        <p class="student-info-page__form-section">{{ t('preschoolStudentInfoPage.dialog.sectionEnrollment') }}</p>
        <div class="student-info-page__form-grid">
          <div class="student-info-page__field student-info-page__field--full">
            <label class="student-info-page__label">{{ t('preschoolStudentInfoPage.dialog.assignClasses') }}</label>
            <MultiSelect
              v-model="form.class_ids"
              :options="classOptions"
              option-label="label"
              option-value="value"
              :placeholder="t('preschoolStudentInfoPage.dialog.assignClasses')"
              display="chip"
              class="w-full"
              :disabled="modalMode === 'view'"
            />
          </div>
          <div class="student-info-page__field student-info-page__field--full">
            <label class="student-info-page__label">{{ t('preschoolStudentInfoPage.dialog.address') }}</label>
            <textarea v-model="form.address" class="student-info-page__input" rows="3" :placeholder="t('preschoolStudentInfoPage.dialog.address')" :disabled="modalMode === 'view'" />
          </div>
        </div>

        <!-- inline error when save fails -->
        <div v-if="errorMessage && modalOpen" class="student-info-page__error">
          {{ errorMessage }}
        </div>
      </div>

      <template #footer>
        <Button type="button" variant="ghost" rounded="xl" @click="closeModal">{{ t('preschoolStudentInfoPage.dialog.cancel') }}</Button>
        <Button v-if="modalMode !== 'view'" type="button" variant="primary" rounded="xl" :loading="saving" :disabled="saving" @click="onSaveStudent">
          {{ t('preschoolStudentInfoPage.dialog.save') }}
        </Button>
        <Button v-else type="button" variant="primary" rounded="xl" @click="closeModal">
          {{ t('common.close') }}
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
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.student-info-page__toolbar-meta {
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
}

.student-info-page__filters {
  display: grid;
  grid-template-columns: 2fr repeat(3, minmax(0, 1fr));
  gap: 0.75rem;
}

.student-info-page__search-wrap {
  position: relative;
  display: flex;
  align-items: center;
}

.student-info-page__search-icon {
  position: absolute;
  left: 0.7rem;
  width: 0.95rem;
  height: 0.95rem;
  color: #94a3b8;
  pointer-events: none;
  flex-shrink: 0;
}

.student-info-page__input--search {
  padding-left: 2.2rem;
}

.student-info-page__error {
  padding: 0.65rem 1rem;
  border-radius: 0.7rem;
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #dc2626;
  font-size: 0.82rem;
  font-weight: 500;
}

.student-info-page__input {
  width: 100%;
  min-height: 2.7rem;
  border-radius: 0.8rem;
  border: 1px solid #d4dde8;
  background: #fcfdff;
  padding: 0.6rem 0.8rem;
  color: #0f172a;
  font-size: 0.875rem;
  outline: none;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}

.student-info-page__input:focus {
  border-color: #7c3aed;
  box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.12);
}

/* ── Dialog form ─────────────────────────────────────────── */
.student-info-page__form {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  min-width: min(100vw - 2rem, 48rem);
  padding-top: 0.25rem;
}

.student-info-page__form-section {
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #7c3aed;
  padding: 0.6rem 0 0.25rem;
  border-top: 1px solid #ede9fe;
  margin-top: 0.35rem;
}

.student-info-page__form-section:first-child {
  margin-top: 0;
  padding-top: 0;
  border-top: none;
}

.student-info-page__form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.65rem 1rem;
}

.student-info-page__field {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.student-info-page__field--full {
  grid-column: 1 / -1;
}

.student-info-page__label {
  font-size: 0.75rem;
  font-weight: 600;
  color: #475569;
  letter-spacing: 0.01em;
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

/* ── Avatar redesign ─────────────────────────────────────── */
.student-info-page__dialog-hd {
  display: flex;
  align-items: center;
  gap: 1.1rem;
}

.student-info-page__avatar-col {
  position: relative;
  flex-shrink: 0;
}

.student-info-page__dialog-avatar {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 4.5rem;
  height: 4.5rem;
  border-radius: 9999px;
  background: linear-gradient(135deg, #c4b5fd 0%, #7c3aed 100%);
  box-shadow:
    0 0 0 3px #fff,
    0 0 0 4.5px #ede9fe,
    0 12px 24px -14px rgba(124, 58, 237, 0.55);
  color: #fff;
  font-size: 1.15rem;
  font-weight: 800;
  letter-spacing: 0.04em;
  cursor: pointer;
  overflow: hidden;
  transition: box-shadow 0.18s ease, transform 0.18s ease;
}

.student-info-page__dialog-avatar--empty {
  background: linear-gradient(135deg, #c4b5fd 0%, #7c3aed 100%);
  outline: 2.5px dashed #c4b5fd;
  outline-offset: 3px;
}

.student-info-page__dialog-avatar:hover {
  box-shadow:
    0 0 0 3px #fff,
    0 0 0 4.5px #a78bfa,
    0 14px 28px -12px rgba(124, 58, 237, 0.6);
  transform: scale(1.04);
}

.student-info-page__avatar-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  user-select: none;
  pointer-events: none;
  color: rgba(255, 255, 255, 0.92);
}

.student-info-page__avatar-placeholder svg {
  width: 2rem;
  height: 2rem;
}

.student-info-page__dialog-avatar-img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 9999px;
}

.student-info-page__dialog-avatar-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 9999px;
  background: rgba(0, 0, 0, 0.4);
  opacity: 0;
  transition: opacity 0.15s ease;
  color: #fff;
}

.student-info-page__dialog-avatar-overlay svg {
  width: 1.4rem;
  height: 1.4rem;
}

.student-info-page__dialog-avatar:hover .student-info-page__dialog-avatar-overlay {
  opacity: 1;
}

/* camera badge */
.student-info-page__avatar-badge {
  position: absolute;
  bottom: 1px;
  right: 1px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 9999px;
  background: #7c3aed;
  border: 2px solid #fff;
  color: #fff;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(124, 58, 237, 0.45);
  transition: background 0.15s ease, transform 0.15s ease;
}

.student-info-page__avatar-badge:hover {
  background: #6d28d9;
  transform: scale(1.1);
}

.student-info-page__avatar-badge svg {
  width: 0.7rem;
  height: 0.7rem;
}

/* text + action column */
.student-info-page__avatar-info {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.student-info-page__dialog-title {
  font-size: 0.9rem;
  font-weight: 700;
  color: #0f172a;
  line-height: 1.3;
}

.student-info-page__dialog-name {
  font-size: 0.78rem;
  color: #64748b;
  margin-bottom: 0.25rem;
}

.student-info-page__avatar-btns {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  margin-top: 0.2rem;
}

.student-info-page__avatar-upload-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.72rem;
  font-weight: 600;
  color: #7c3aed;
  background: #f5f3ff;
  border: 1px solid #ede9fe;
  border-radius: 0.5rem;
  padding: 0.28rem 0.6rem;
  cursor: pointer;
  transition: background 0.15s ease, border-color 0.15s ease;
}

.student-info-page__avatar-upload-btn svg {
  width: 0.75rem;
  height: 0.75rem;
  flex-shrink: 0;
}

.student-info-page__avatar-upload-btn:hover {
  background: #ede9fe;
  border-color: #c4b5fd;
}

.student-info-page__avatar-remove-btn {
  font-size: 0.72rem;
  font-weight: 600;
  color: #dc2626;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  text-decoration: underline;
  text-underline-offset: 2px;
  transition: color 0.15s ease;
}

.student-info-page__avatar-remove-btn:hover {
  color: #b91c1c;
}

@media (max-width: 900px) {
  .student-info-page__filters,
  .student-info-page__form-grid,
  .student-info-page__dialog-grid {
    grid-template-columns: 1fr;
  }

  .student-info-page__filters {
    grid-template-columns: 1fr;
  }

  .student-info-page__form {
    min-width: 0;
  }
}
</style>
