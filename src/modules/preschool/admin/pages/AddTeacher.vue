<script setup>
import { computed, onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import MainLayout from '@/layouts/MainLayout.vue'
import HeaderSection from '@/components/navigation/HeaderSection.vue'
import Form from '@/components/forms/Form.vue'
import AlertSuccess from '@/components/alerts/AlertSuccess.vue'
import AlertError from '@/components/alerts/AlertError.vue'
import { ROLES } from '@/constants/roles'
import { mapUser } from '@/services/mappers/userMapper'
import usersMock from '@/mocks/users.json'
import AdminSummaryCards from '@/modules/super-admin/components/admin-management/AdminSummaryCards.vue'
import AdminChecklistPanel from '@/modules/super-admin/components/admin-management/AdminChecklistPanel.vue'
import AddTeacherIntro from '@/modules/preschool/admin/components/add-teacher/AddTeacherIntro.vue'
import AddTeacherFormFields from '@/modules/preschool/admin/components/add-teacher/AddTeacherFormFields.vue'
import AddTeacherFormActions from '@/modules/preschool/admin/components/add-teacher/AddTeacherFormActions.vue'

defineOptions({
  name: 'PreschoolAdminAddTeacherPage',
})

const router = useRouter()
const route = useRoute()

const teacherDirectoryPath = '/module/preschool-admin/users'
const roleOptions = [ROLES.TEACHER_PRESCHOOL]
const statusOptions = ['active', 'pending', 'inactive', 'suspended']
const permissionOptions = ['dashboard:read', 'classes:write', 'students:read', 'tasks:write']
const allowedProfileImageTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
const maxProfileImageSizeBytes = 2 * 1024 * 1024

const form = reactive({
  name: '',
  email: '',
  phone: '',
  role: ROLES.TEACHER_PRESCHOOL,
  permissions: permissionOptions.slice(0, 3),
  status: statusOptions[0],
  password: '',
  confirmPassword: '',
  profileImage: null,
})

const isSubmitting = ref(false)
const errorMessage = ref('')
const showSuccess = ref(false)
const showError = ref(false)
const isPasswordVisible = ref(false)
const isConfirmPasswordVisible = ref(false)
const profileImagePreview = ref('')

const mode = computed(() => {
  if (route.query.mode === 'view') return 'view'
  if (route.query.mode === 'edit' || Boolean(route.query.id)) return 'edit'
  return 'add'
})
const isViewMode = computed(() => mode.value === 'view')
const isEditMode = computed(() => mode.value === 'edit')
const isAddMode = computed(() => mode.value === 'add')
const isFormLocked = computed(() => isSubmitting.value || isViewMode.value)

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
  if (String(value || '').trim().toLowerCase() === ROLES.TEACHER_PRESCHOOL) {
    return 'Preschool Teacher'
  }
  return String(value || '')
}

function permissionLabel(value) {
  return String(value || '')
    .replace(/[:_]/g, ' ')
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
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

function hasPermission(permission) {
  return form.permissions.includes(permission)
}

function togglePermission(permission) {
  if (isFormLocked.value) return

  if (hasPermission(permission)) {
    form.permissions = form.permissions.filter((value) => value !== permission)
    return
  }

  form.permissions = [...form.permissions, permission]
}

function onProfileImageChange(event) {
  if (isFormLocked.value) return

  const [file] = event?.target?.files || []
  if (!file) return

  if (!allowedProfileImageTypes.includes(file.type)) {
    errorMessage.value = 'Profile image must be a JPG, PNG, WEBP, or GIF file.'
    showError.value = true
    return
  }

  if (file.size > maxProfileImageSizeBytes) {
    errorMessage.value = 'Profile image must be smaller than 2MB.'
    showError.value = true
    return
  }

  if (profileImagePreview.value.startsWith('blob:')) {
    URL.revokeObjectURL(profileImagePreview.value)
  }

  form.profileImage = file
  profileImagePreview.value = URL.createObjectURL(file)
}

function removeProfileImage() {
  if (isFormLocked.value) return

  if (profileImagePreview.value.startsWith('blob:')) {
    URL.revokeObjectURL(profileImagePreview.value)
  }

  profileImagePreview.value = ''
  form.profileImage = null
}

function validateForm() {
  if (!form.name.trim()) return 'Full name is required.'
  if (!form.email.trim()) return 'Email is required.'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return 'Please enter a valid email.'
  if (!form.permissions.length) return 'Select at least one permission.'
  if (!form.status) return 'Status is required.'
  if (form.password.length < 6) return 'Password must be at least 6 characters.'
  if (form.password !== form.confirmPassword) return 'Passwords do not match.'
  return ''
}

async function goBackToTeachers() {
  await router.push(teacherDirectoryPath)
}

async function goToEditMode() {
  const id = String(route.query.id || '').trim()
  if (!id) return
  await router.push({ path: '/module/preschool-admin/users/add', query: { mode: 'edit', id } })
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
    await new Promise((resolve) => setTimeout(resolve, 700))
    showSuccess.value = true
  } catch {
    errorMessage.value = isEditMode.value
      ? 'Failed to update the teacher account.'
      : 'Failed to create the teacher account.'
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

function populateFromUser(user) {
  form.name = user.name || user.username || ''
  form.email = user.email || ''
  form.phone = user.phone || ''
  form.role = ROLES.TEACHER_PRESCHOOL
  form.permissions = Array.isArray(user.permissions) ? [...user.permissions] : permissionOptions.slice(0, 3)

  const normalizedStatus = String(user.status || '')
  const matchedStatus = statusOptions.find(
    (status) => status.toLowerCase() === normalizedStatus.toLowerCase(),
  )
  form.status = matchedStatus || statusOptions[0]
  form.password = 'Teacher@123'
  form.confirmPassword = 'Teacher@123'
  form.profileImage = null
  profileImagePreview.value = String(user.avatar || '').trim()
}

onMounted(() => {
  if (isAddMode.value) return

  const id = String(route.query.id || '').trim()
  const found = mapUser(
    usersMock.find(
      (item) =>
        String(item.id) === id && String(item.role || '').toLowerCase() === ROLES.TEACHER_PRESCHOOL,
    ) || {},
  )

  if (!found?.id) return
  populateFromUser(found)
})

onBeforeUnmount(() => {
  if (profileImagePreview.value.startsWith('blob:')) {
    URL.revokeObjectURL(profileImagePreview.value)
  }
})

const selectedRoleDescription = computed(() => roleLabel(form.role))

const formSummaryCards = computed(() => {
  const permissionCount = form.permissions.length
  const securityStatus =
    form.password.length >= 6 && form.confirmPassword === form.password ? 'success' : 'warning'

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
      label: permissionCount ? 'Configured permissions' : 'No permissions selected',
      status: permissionCount ? 'success' : 'warning',
      statusLabel: statusLabel(permissionCount ? 'success' : 'warning'),
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
    text: 'Grant access for classes, student records, and daily teaching tasks.',
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
            :permission-options="permissionOptions"
            :permissions="form.permissions"
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
            :permission-label="permissionLabel"
            @update:name="form.name = $event"
            @update:email="form.email = $event"
            @update:phone="form.phone = $event"
            @update:role="form.role = $event"
            @update:status="form.status = $event"
            @update:password="form.password = $event"
            @update:confirm-password="form.confirmPassword = $event"
            @profile-image-change="onProfileImageChange"
            @profile-image-remove="removeProfileImage"
            @toggle-permission="togglePermission"
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
