<script setup>
import { computed, onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import MainLayout from '@/layouts/MainLayout.vue'
import HeaderSection from '@/components/navigation/HeaderSection.vue'
import Form from '@/components/forms/Form.vue'
import AlertSuccess from '@/components/alerts/AlertSuccess.vue'
import AlertError from '@/components/alerts/AlertError.vue'
import AdminSummaryCards from '@/modules/super-admin/components/admin-management/AdminSummaryCards.vue'
import AdminChecklistPanel from '@/modules/super-admin/components/admin-management/AdminChecklistPanel.vue'
import AddTeacherIntro from '@/modules/preschool/admin/components/add-teacher/AddTeacherIntro.vue'
import AddTeacherFormFields from '@/modules/preschool/admin/components/add-teacher/AddTeacherFormFields.vue'
import AddTeacherFormActions from '@/modules/preschool/admin/components/add-teacher/AddTeacherFormActions.vue'
import { ROLES } from '@/constants/roles'
import { fetchRolePermissions } from '@/modules/super-admin/services/rolePermissionsApi'
import {
  createPreschoolTeacher,
  fetchPreschoolTeacher,
  updatePreschoolTeacher,
} from '@/modules/preschool/services/preschoolApi'

defineOptions({
  name: 'PreschoolAdminAddTeacherPage',
})

const router = useRouter()
const route = useRoute()

const teacherDirectoryPath = '/module/preschool-admin/users'
const teacherRole = ROLES.TEACHER_PRESCHOOL
const roleOptions = [teacherRole]
const statusOptions = ['active', 'pending', 'inactive', 'suspended']

const form = reactive({
  name: '',
  email: '',
  phone: '',
  role: teacherRole,
  status: statusOptions[0],
  password: '',
  confirmPassword: '',
  profileImage: null,
  removeAvatar: false,
})

const isSubmitting = ref(false)
const errorMessage = ref('')
const showSuccess = ref(false)
const showError = ref(false)
const isPasswordVisible = ref(false)
const isConfirmPasswordVisible = ref(false)
const profileImagePreview = ref('')
const rolePermissions = ref([])
const rolePermissionsLoading = ref(false)

const mode = computed(() => {
  if (route.query.mode === 'view') return 'view'
  if (route.query.mode === 'edit' || Boolean(route.query.id)) return 'edit'
  return 'add'
})
const isViewMode = computed(() => mode.value === 'view')
const isEditMode = computed(() => mode.value === 'edit')
const isAddMode = computed(() => mode.value === 'add')
const isFormLocked = computed(() => isSubmitting.value || isViewMode.value)
const editingTeacherId = computed(() => String(route.query.id || '').trim())

const pageTitle = computed(() => {
  if (isViewMode.value) return 'Teacher Details'
  if (isEditMode.value) return 'Update Teacher'
  return 'Add Teacher'
})

const pageSubtitle = computed(() => {
  if (isViewMode.value) return 'Review the teacher profile, permissions, and account status.'
  if (isEditMode.value) return 'Update the teacher profile, permissions, and account details.'
  return 'Create a Preschool teacher account and assign classroom access.'
})

function statusLabel(status) {
  const normalized = String(status || '').trim().toLowerCase()
  return normalized ? normalized.charAt(0).toUpperCase() + normalized.slice(1) : ''
}

function roleLabel(value) {
  if (String(value || '').trim().toLowerCase() === teacherRole) {
    return 'Preschool Teacher'
  }
  return String(value || '-')
}

function resetFeedback() {
  errorMessage.value = ''
  showError.value = false
}

function togglePasswordVisibility() {
  isPasswordVisible.value = !isPasswordVisible.value
}

function toggleConfirmPasswordVisibility() {
  isConfirmPasswordVisible.value = !isConfirmPasswordVisible.value
}

function isBlobUrl(value) {
  return String(value || '').startsWith('blob:')
}

function onProfileImageChange(event) {
  if (isFormLocked.value) return

  const [file] = event?.target?.files || []
  if (!file) return

  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
    errorMessage.value = 'Profile image must be a JPG, PNG, or WEBP file.'
    showError.value = true
    return
  }

  if (file.size > 2 * 1024 * 1024) {
    errorMessage.value = 'Profile image must be 2MB or smaller.'
    showError.value = true
    return
  }

  if (isBlobUrl(profileImagePreview.value)) {
    URL.revokeObjectURL(profileImagePreview.value)
  }

  form.profileImage = file
  form.removeAvatar = false
  profileImagePreview.value = URL.createObjectURL(file)
}

function removeProfileImage() {
  if (isFormLocked.value) return

  if (isBlobUrl(profileImagePreview.value)) {
    URL.revokeObjectURL(profileImagePreview.value)
  }

  profileImagePreview.value = ''
  form.profileImage = null
  form.removeAvatar = true
}

function validateForm() {
  if (!form.name.trim()) return 'Full name is required.'
  if (!form.email.trim()) return 'Email is required.'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return 'Please enter a valid email.'
  if (!form.status) return 'Status is required.'

  if (isAddMode.value || form.password || form.confirmPassword) {
    if (form.password.length < 8) return 'Password must be at least 8 characters.'
    if (form.password !== form.confirmPassword) return 'Passwords do not match.'
  }

  return ''
}

async function goBackToTeachers() {
  await router.push(teacherDirectoryPath)
}

async function goToEditMode() {
  if (!editingTeacherId.value) return
  await router.push({ path: '/module/preschool-admin/users/add', query: { mode: 'edit', id: editingTeacherId.value } })
}

function populateFromTeacher(user) {
  form.name = user?.fullName || user?.name || user?.username || ''
  form.email = user?.email || ''
  form.phone = user?.phone || ''
  form.role = teacherRole
  form.status = String(user?.status || statusOptions[0]).toLowerCase()
  form.password = ''
  form.confirmPassword = ''
  form.profileImage = null
  form.removeAvatar = false
  profileImagePreview.value = String(user?.avatar || '').trim()
}

async function loadRolePermissions() {
  rolePermissionsLoading.value = true
  try {
    rolePermissions.value = await fetchRolePermissions(teacherRole)
  } catch {
    rolePermissions.value = []
  } finally {
    rolePermissionsLoading.value = false
  }
}

async function loadTeacher() {
  if (!editingTeacherId.value) return

  try {
    const teacher = await fetchPreschoolTeacher(editingTeacherId.value)
    if (!teacher) return
    populateFromTeacher(teacher)
  } catch (error) {
    errorMessage.value = error?.message || 'Failed to load teacher details.'
    showError.value = true
  }
}

async function onSubmit() {
  if (isViewMode.value) return

  resetFeedback()
  const validationError = validateForm()

  if (validationError) {
    errorMessage.value = validationError
    showError.value = true
    return
  }

  isSubmitting.value = true

  try {
    const payload = {
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      role: teacherRole,
      status: form.status,
      avatar: form.profileImage,
      removeAvatar: form.removeAvatar,
      password: form.password,
      confirmPassword: form.confirmPassword,
    }

    if (isEditMode.value) {
      await updatePreschoolTeacher(editingTeacherId.value, payload)
    } else {
      await createPreschoolTeacher(payload)
    }

    showSuccess.value = true
  } catch (error) {
    errorMessage.value = error?.message || (isEditMode.value ? 'Failed to update the teacher account.' : 'Failed to create the teacher account.')
    showError.value = true
  } finally {
    isSubmitting.value = false
  }
}

function onErrorClose() {
  showError.value = false
}

async function onSuccessClose() {
  showSuccess.value = false
  await goBackToTeachers()
}

const selectedRoleDescription = computed(() => roleLabel(form.role))

const formSummaryCards = computed(() => {
  const permissionCount = rolePermissions.value.length
  const securityStatus =
    isAddMode.value || form.password.length >= 8 ? 'success' : 'warning'

  return [
    {
      id: 'teacher-role',
      title: 'Role Scope',
      value: selectedRoleDescription.value,
      label: 'Program access',
      status: 'info',
      statusLabel: statusLabel('info'),
      surfaceClass: 'bg-cyan-50/80 border-cyan-200',
    },
    {
      id: 'teacher-permissions',
      title: 'Permissions',
      value: permissionCount,
      label: permissionCount ? 'Configured permissions' : 'Permissions loaded from role',
      status: 'success',
      statusLabel: statusLabel('success'),
      surfaceClass: 'bg-lime-50/80 border-lime-200',
    },
    {
      id: 'teacher-account-state',
      title: 'Account State',
      value: statusLabel(form.status),
      label: 'Initial account status',
      status: form.status,
      statusLabel: statusLabel(form.status),
      surfaceClass: 'bg-amber-50/80 border-amber-200',
    },
    {
      id: 'teacher-security-review',
      title: 'Security Review',
      value: profileImagePreview.value ? 'Ready' : 'Pending',
      label: profileImagePreview.value ? 'Profile image set' : 'Profile image pending',
      status: securityStatus,
      statusLabel: statusLabel(securityStatus),
      surfaceClass: 'bg-rose-50/80 border-rose-200',
    },
  ]
})

const checklistItems = computed(() => [
  {
    title: 'Role',
    text: selectedRoleDescription.value,
  },
  {
    title: 'Permissions',
    text: 'Permissions are resolved from the teacher role and displayed read-only.',
  },
  {
    title: 'Security',
    text: 'Set a password and verify the teacher profile image before saving.',
  },
  {
    title: 'Review',
    text: 'Confirm the account status and contact details before submission.',
  },
])

onMounted(async () => {
  await loadRolePermissions()

  if (isAddMode.value) {
    return
  }

  await loadTeacher()
})

onBeforeUnmount(() => {
  if (isBlobUrl(profileImagePreview.value)) {
    URL.revokeObjectURL(profileImagePreview.value)
  }
})
</script>

<template>
  <MainLayout>
    <section class="add-teacher-page">
      <HeaderSection :title="pageTitle" :subtitle="pageSubtitle" />

      <AdminSummaryCards :cards="formSummaryCards" />

      <div class="add-teacher-page__layout">
        <Form
          class="add-teacher-page__form"
          :title="pageTitle"
          description="Complete the teacher profile, permissions, and sign-in details."
          :cancel-text="'Cancel'"
          :loading="isSubmitting"
          :disabled="isViewMode"
          :show-cancel="true"
          @submit="onSubmit"
          @cancel="goBackToTeachers"
        >
          <AddTeacherIntro
            :role-label="selectedRoleDescription"
            :status-label="statusLabel(form.status)"
          />

          <AddTeacherFormFields
            :profile-image-preview="profileImagePreview"
            :role-options="roleOptions"
            :status-options="statusOptions"
            :role-permissions="rolePermissions"
            :role-permissions-loading="rolePermissionsLoading"
            :name="form.name"
            :email="form.email"
            :phone="form.phone"
            :role="form.role"
            :status="form.status"
            :password="form.password"
            :confirm-password="form.confirmPassword"
            :is-locked="isFormLocked"
            :is-password-visible="isPasswordVisible"
            :is-confirm-password-visible="isConfirmPasswordVisible"
            :role-label="roleLabel"
            :status-label="statusLabel"
            @update:name="form.name = $event"
            @update:email="form.email = $event"
            @update:phone="form.phone = $event"
            @update:role="form.role = $event"
            @update:status="form.status = $event"
            @update:password="form.password = $event"
            @update:confirm-password="form.confirmPassword = $event"
            @profile-image-change="onProfileImageChange"
            @profile-image-remove="removeProfileImage"
            @toggle-password="togglePasswordVisibility"
            @toggle-confirm-password="toggleConfirmPasswordVisibility"
          />

          <template #actions>
            <AddTeacherFormActions
              :is-submitting="isSubmitting"
              :is-view-mode="isViewMode"
              :is-edit-mode="isEditMode"
              @back="goBackToTeachers"
              @edit="goToEditMode"
            />
          </template>
        </Form>

        <div class="add-teacher-page__rail">
          <AdminChecklistPanel
            title="Teacher Setup Checklist"
            description="Review the essentials before activating the account."
            :items="checklistItems"
            highlight-label="Role Scope"
            :highlight-value="selectedRoleDescription"
          />
        </div>
      </div>
    </section>

    <AlertError
      :show="showError"
      title="Validation Error"
      :message="errorMessage"
      button-text="Close"
      @close="onErrorClose"
    />

    <AlertSuccess
      :show="showSuccess"
      :title="isEditMode ? 'Teacher Updated' : 'Teacher Created'"
      :message="
        isEditMode
          ? 'The teacher account has been updated successfully.'
          : 'The teacher account has been created successfully.'
      "
      button-text="Back to Teachers"
      @close="onSuccessClose"
    />
  </MainLayout>
</template>

<style scoped>
.add-teacher-page {
  display: flex;
  flex-direction: column;
  gap: 1.35rem;
}

.add-teacher-page__layout {
  display: grid;
  grid-template-columns: minmax(0, 1.7fr) minmax(300px, 0.95fr);
  gap: 1rem;
  align-items: start;
}

.add-teacher-page__form {
  display: block;
}

.add-teacher-page__rail {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  position: sticky;
  top: 1rem;
}

@media (max-width: 1120px) {
  .add-teacher-page__layout {
    grid-template-columns: 1fr;
  }

  .add-teacher-page__rail {
    position: static;
  }
}
</style>
