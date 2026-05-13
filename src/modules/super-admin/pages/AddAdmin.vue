<script setup>
import { computed, onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import MainLayout from '@/layouts/MainLayout.vue'
import HeaderSection from '@/components/navigation/HeaderSection.vue'
import Form from '@/components/forms/Form.vue'
import Button from '@/components/buttons/Button.vue'
import AlertSuccess from '@/components/alerts/AlertSuccess.vue'
import AlertError from '@/components/alerts/AlertError.vue'
import { ROLES } from '@/constants/roles'
import AdminSummaryCards from '@/modules/super-admin/components/admin-management/AdminSummaryCards.vue'
import AdminChecklistPanel from '@/modules/super-admin/components/admin-management/AdminChecklistPanel.vue'
import AddAdminProfileImageField from '@/modules/super-admin/components/admin-management/AddAdminProfileImageField.vue'
import AddAdminIdentityFields from '@/modules/super-admin/components/admin-management/AddAdminIdentityFields.vue'
import AddAdminPermissionsField from '@/modules/super-admin/components/admin-management/AddAdminPermissionsField.vue'
import AddAdminPasswordFields from '@/modules/super-admin/components/admin-management/AddAdminPasswordFields.vue'
import {
  createAdminUser,
  findAdminUserById,
  updateAdminUser,
} from '@/modules/super-admin/services/adminUsersApi'

defineOptions({
  name: 'AddUserPage',
})

const router = useRouter()
const route = useRoute()
const { t } = useI18n()

/**
 * Super Admin can now manage every system role, not just admin roles.
 */
const roleOptions = [
  ROLES.SUPER_ADMIN,
  ROLES.ADMIN_ENGLISH,
  ROLES.ADMIN_PRESCHOOL,
  ROLES.ADMIN_SCHOLARSHIP,
  ROLES.ADMIN_SPORT,
  ROLES.COACH,
  ROLES.TEACHER_ENGLISH,
  ROLES.TEACHER_PRESCHOOL,
  ROLES.TEACHER_SCHOLARSHIP,
]
const statusOptions = ['active', 'pending', 'inactive', 'suspended']
const permissionOptions = ['all:*', 'users:read', 'users:write', 'reports:read', 'programs:write', 'settings:read']
const allowedProfileImageTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
const maxProfileImageSizeBytes = 2 * 1024 * 1024

const form = reactive({
  name: '',
  email: '',
  phone: '',
  role: ROLES.ADMIN_ENGLISH,
  permissions: [],
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

const isEditMode = computed(() => route.query.mode === 'edit' || Boolean(route.query.id))
const editingUserId = computed(() => String(route.query.id || '').trim())

function resolvedText(key, fallback) {
  const translated = t(key)
  return translated !== key ? translated : fallback
}

const pageTitle = computed(() =>
  isEditMode.value
    ? resolvedText('users.addAdmin.updateTitle', 'Update User')
    : resolvedText('users.addAdmin.title', 'Add User'),
)

const pageSubtitle = computed(() =>
  isEditMode.value
    ? resolvedText(
        'users.addAdmin.updateSubtitle',
        'Update the user profile, permissions, and account security details.',
      )
    : resolvedText(
        'users.addAdmin.summary',
        'Create a new system account, assign permissions, and verify access before saving.',
      ),
)

const resolvedFormDescription = computed(() =>
  resolvedText(
    'users.addAdmin.formDescription',
    'Use the profile details, permissions, and role assignment below to create the account.',
  ),
)

function statusLabel(status) {
  const key = `common.status.${String(status || '').replace(/[\s-]+/g, '_').toLowerCase()}`
  const translated = t(key)
  return translated !== key ? translated : String(status || '')
}

function roleLabel(value) {
  const key = `common.role.${String(value || '').replace(/[\s-]+/g, '_').toLowerCase()}`
  const translated = t(key)
  return translated !== key ? translated : String(value || '')
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

function validateForm() {
  if (!form.name.trim()) return resolvedText('users.addAdmin.validation.fullNameRequired', 'Full name is required.')
  if (!form.email.trim()) return resolvedText('users.addAdmin.validation.emailRequired', 'Email is required.')
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return resolvedText('users.addAdmin.validation.emailInvalid', 'Please enter a valid email.')
  if (!form.role) return resolvedText('users.addAdmin.validation.roleRequired', 'Role is required.')
  if (!form.permissions.length) return resolvedText('users.addAdmin.validation.permissionsRequired', 'At least one permission is required.')
  if (!form.status) return resolvedText('users.addAdmin.validation.statusRequired', 'Status is required.')
  if (!isEditMode.value && form.password.length < 8) return resolvedText('users.addAdmin.validation.passwordLength', 'Password must be at least 8 characters.')
  if (isEditMode.value && form.password && form.password.length < 8) return resolvedText('users.addAdmin.validation.passwordLength', 'Password must be at least 8 characters.')
  if (form.password || form.confirmPassword) {
    if (form.password !== form.confirmPassword) return resolvedText('users.addAdmin.validation.passwordMismatch', 'Passwords do not match.')
  }
  return ''
}

function hasPermission(permission) {
  return form.permissions.includes(permission)
}

function togglePermission(permission) {
  if (hasPermission(permission)) {
    form.permissions = form.permissions.filter((value) => value !== permission)
    return
  }
  form.permissions = [...form.permissions, permission]
}

function permissionLabel(value) {
  const normalized = String(value ?? '').trim().toLowerCase()
  const key = `common.permission.${normalized}`
  const translated = t(key)
  if (translated !== key) return translated

  return String(value ?? '')
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

function onProfileImageChange(event) {
  const [file] = event?.target?.files || []
  if (!file) return

  if (!allowedProfileImageTypes.includes(file.type)) {
    errorMessage.value = resolvedText(
      'users.addAdmin.validation.imageType',
      'Please choose a JPG, PNG, WEBP, or GIF image.',
    )
    showError.value = true
    return
  }

  if (file.size > maxProfileImageSizeBytes) {
    errorMessage.value = resolvedText(
      'users.addAdmin.validation.imageSize',
      'Profile images must be 2 MB or smaller.',
    )
    showError.value = true
    return
  }

  if (profileImagePreview.value) {
    URL.revokeObjectURL(profileImagePreview.value)
  }
  form.profileImage = file
  profileImagePreview.value = URL.createObjectURL(file)
}

function removeProfileImage() {
  if (profileImagePreview.value) {
    URL.revokeObjectURL(profileImagePreview.value)
  }
  profileImagePreview.value = ''
  form.profileImage = null
}

async function onSubmit() {
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
      name: form.name,
      email: form.email,
      phone: form.phone,
      role: form.role,
      permissions: form.permissions,
      status: form.status,
      avatar: profileImagePreview.value,
      password: form.password,
      confirmPassword: form.confirmPassword,
    }

    if (isEditMode.value) {
      await updateAdminUser(editingUserId.value, payload)
    } else {
      await createAdminUser(payload)
    }

    showSuccess.value = true
  } catch (error) {
    errorMessage.value = isEditMode.value
      ? error?.message || resolvedText('users.addAdmin.validation.updateFailed', 'Unable to update user right now.')
      : error?.message || resolvedText('users.addAdmin.validation.createFailed', 'Unable to create user right now.')
    showError.value = true
  } finally {
    isSubmitting.value = false
  }
}

async function onCancel() {
  await router.push('/module/super-admin/users/manage')
}

async function onSuccessClose() {
  showSuccess.value = false
  await router.push('/module/super-admin/users/manage')
}

function onErrorClose() {
  showError.value = false
}

onMounted(async () => {
  if (!isEditMode.value) {
    // Allow deep links like ?role=teacher-preschool while keeping the default role stable.
    const requestedRole = String(route.query.role || '').trim()
    if (roleOptions.includes(requestedRole)) {
      form.role = requestedRole
    }
    return
  }

  const found = await findAdminUserById(editingUserId.value)
  if (!found) return
  form.name = found.name || found.username || ''
  form.email = found.email || ''
  form.phone = found.phone || ''
  form.role = found.role || roleOptions[0]
  form.permissions = Array.isArray(found.permissions) ? [...found.permissions] : []
  const normalizedStatus = String(found.status || '')
  const matchedStatus = statusOptions.find(
    (status) => status.toLowerCase() === normalizedStatus.toLowerCase(),
  )
  form.status = matchedStatus || statusOptions[0]
  profileImagePreview.value = found.avatar || ''
})

onBeforeUnmount(() => {
  if (profileImagePreview.value) {
    URL.revokeObjectURL(profileImagePreview.value)
  }
})

const formSummaryCards = computed(() => {
  const selectedRole = roleLabel(form.role)
  const permissionCount = form.permissions.length
  const securityStatus =
    isEditMode.value || (form.password.length >= 6 && form.confirmPassword === form.password)
      ? 'success'
      : 'warning'

  return [
    {
      id: 'role-scope',
      title: resolvedText('users.addAdmin.roleScope', 'Role scope'),
      value: selectedRole,
      label: resolvedText('users.addAdmin.programAccess', 'Account access'),
      status: 'info',
      statusLabel: statusLabel('info'),
      surfaceClass: 'bg-cyan-50/80 border-cyan-200',
    },
    {
      id: 'permissions',
      title: resolvedText('users.addAdmin.permissions', 'Permissions'),
      value: permissionCount,
      label: permissionCount
        ? resolvedText('users.addAdmin.configuredPermissions', 'Configured permissions')
        : resolvedText('users.addAdmin.noPermissionsSelected', 'No permissions selected'),
      status: permissionCount ? 'success' : 'warning',
      statusLabel: statusLabel(permissionCount ? 'success' : 'warning'),
      surfaceClass: 'bg-lime-50/80 border-lime-200',
    },
    {
      id: 'account-state',
      title: resolvedText('users.addAdmin.accountState', 'Account state'),
      value: statusLabel(form.status),
      label: resolvedText('users.addAdmin.initialAccountState', 'Initial account state'),
      status: form.status,
      statusLabel: statusLabel(form.status),
      surfaceClass: 'bg-amber-50/80 border-amber-200',
    },
    {
      id: 'security-review',
      title: resolvedText('users.addAdmin.securityReview', 'Security review'),
      value: profileImagePreview.value ? resolvedText('users.addAdmin.ready', 'Ready') : resolvedText('users.addAdmin.pending', 'Pending'),
      label: profileImagePreview.value
        ? resolvedText('users.addAdmin.profileImageSet', 'Profile image set')
        : resolvedText('users.addAdmin.profileImagePending', 'Profile image pending'),
      status: securityStatus,
      statusLabel: statusLabel(securityStatus),
      surfaceClass: 'bg-rose-50/80 border-rose-200',
    },
  ]
})

const selectedRoleDescription = computed(() => roleLabel(form.role))

const checklistItems = computed(() => [
  {
    title: resolvedText('users.addAdmin.sidebarItems.role', 'Choose a role'),
    text: selectedRoleDescription.value,
  },
  {
    title: resolvedText('users.addAdmin.sidebarItems.permissions', 'Review permissions'),
    text: resolvedText(
      'users.addAdmin.sidebarItems.permissionsDetail',
      'Make sure the selected permissions match the account scope.',
    ),
  },
  {
    title: resolvedText('users.addAdmin.sidebarItems.security', 'Check security'),
    text: resolvedText(
      'users.addAdmin.sidebarItems.securityDetail',
      'Password strength and image upload are part of the final review.',
    ),
  },
  {
    title: resolvedText('users.addAdmin.sidebarItems.review', 'Review summary'),
    text: resolvedText(
      'users.addAdmin.sidebarItems.reviewDetail',
      'Use the summary cards to confirm the account is ready.',
    ),
  },
])
</script>

<template>
  <MainLayout>
    <section class="add-admin-page">
      <HeaderSection :title="pageTitle" :subtitle="pageSubtitle" />

      <AdminSummaryCards :cards="formSummaryCards" />

      <div class="add-admin-page__layout">
      <Form
        class="add-admin-page__form"
        :title="pageTitle"
        :description="resolvedFormDescription"
        :submit-text="pageTitle"
          :cancel-text="t('common.cancel')"
          :loading="isSubmitting"
          :show-cancel="true"
          @submit="onSubmit"
          @cancel="onCancel"
        >
          <div class="add-admin-page__intro">
            <div>
              <p class="text-[0.8rem] font-semibold uppercase tracking-[0.08em] text-surface-500">
                {{ pageTitle }}
              </p>
              <p class="mt-1 text-[0.92rem] leading-6 text-slate-600">
                {{ pageSubtitle }}
              </p>
            </div>
            <div class="flex flex-wrap gap-2">
              <span
                class="inline-flex items-center rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-[0.74rem] font-semibold text-brand-800"
              >
                {{ selectedRoleDescription }}
              </span>
              <span
                class="inline-flex items-center rounded-full border border-surface-200 bg-slate-50 px-3 py-1 text-[0.74rem] font-semibold text-slate-700"
              >
                {{ statusLabel(form.status) }}
              </span>
            </div>
          </div>

          <div class="add-admin-page__grid">
            <AddAdminProfileImageField
              class="add-admin-page__field add-admin-page__field--full"
              :title="t('users.addAdmin.profileImage')"
              :preview="profileImagePreview"
              :remove-label="t('users.addAdmin.removeImage')"
              :disabled="isSubmitting"
              @change="onProfileImageChange"
              @remove="removeProfileImage"
            />

            <AddAdminIdentityFields
              class="add-admin-page__field add-admin-page__field--full"
              v-model:name="form.name"
              v-model:email="form.email"
              v-model:phone="form.phone"
              v-model:role="form.role"
              v-model:status="form.status"
              :role-options="roleOptions"
              :status-options="statusOptions"
              :disabled="isSubmitting"
              :name-label="t('users.addAdmin.fullName')"
              :email-label="t('users.addAdmin.email')"
              :phone-label="t('users.addAdmin.phone')"
              :role-label-text="t('users.addAdmin.role')"
              :status-label-text="t('users.addAdmin.status')"
              :name-placeholder="t('users.addAdmin.enterFullName')"
              :email-placeholder="t('users.addAdmin.emailPlaceholder')"
              :phone-placeholder="t('users.addAdmin.phonePlaceholder')"
              :role-label="roleLabel"
              :status-label="statusLabel"
            />

            <AddAdminPermissionsField
              class="add-admin-page__field add-admin-page__field--full"
              :title="t('users.addAdmin.permissions')"
              :permissions="form.permissions"
              :options="permissionOptions"
              :disabled="isSubmitting"
              :permission-label="permissionLabel"
              @toggle="togglePermission"
            />

            <AddAdminPasswordFields
              class="add-admin-page__field add-admin-page__field--full"
              v-model:password="form.password"
              v-model:confirmPassword="form.confirmPassword"
              :disabled="isSubmitting"
              :password-visible="isPasswordVisible"
              :confirm-password-visible="isConfirmPasswordVisible"
              :password-label="t('users.addAdmin.password')"
              :confirm-password-label="t('users.addAdmin.confirmPassword')"
              :password-placeholder="t('users.addAdmin.minimumPassword')"
              :confirm-password-placeholder="t('users.addAdmin.reenterPassword')"
              :show-password-label="t('users.addAdmin.showPassword')"
              :hide-password-label="t('users.addAdmin.hidePassword')"
              @toggle-password="togglePasswordVisibility"
              @toggle-confirm-password="toggleConfirmPasswordVisibility"
            />
          </div>

          <template #actions>
            <Button
              type="button"
              variant="outline"
              size="md"
              rounded="xl"
              :disabled="isSubmitting"
              @click="onCancel"
            >
              {{ t('common.cancel') }}
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="md"
              rounded="xl"
              :loading="isSubmitting"
              :disabled="isSubmitting"
            >
              {{ pageTitle }}
            </Button>
          </template>
        </Form>

        <div class="add-admin-page__rail">
          <AdminChecklistPanel
            :title="t('users.addAdmin.sidebarTitle')"
            :description="t('users.addAdmin.sidebarText')"
            :items="checklistItems"
            :highlight-label="t('users.addAdmin.roleScope')"
            :highlight-value="selectedRoleDescription"
          />
        </div>
      </div>
    </section>

    <AlertError
      :show="showError"
      :title="resolvedText('users.addAdmin.validationError', 'Validation error')"
      :message="errorMessage"
      :button-text="t('common.close')"
      @close="onErrorClose"
    />

    <AlertSuccess
      :show="showSuccess"
      :title="isEditMode ? resolvedText('users.addAdmin.adminUpdated', 'User updated') : resolvedText('users.addAdmin.adminCreated', 'User created')"
      :message="
        isEditMode
          ? resolvedText('users.addAdmin.updatedMessage', 'The user account was updated successfully.')
          : resolvedText('users.addAdmin.createdMessage', 'The user account was created successfully.')
      "
      :button-text="resolvedText('users.addAdmin.backToAdmins', 'Back to users')"
      @close="onSuccessClose"
    />
  </MainLayout>
</template>

<style scoped>
.add-admin-page {
  display: flex;
  flex-direction: column;
  gap: 1.35rem;
}

.add-admin-page__layout {
  display: grid;
  grid-template-columns: minmax(0, 1.7fr) minmax(300px, 0.95fr);
  gap: 1rem;
  align-items: start;
}

.add-admin-page__form {
  display: block;
}

.add-admin-page__rail {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  position: sticky;
  top: 1rem;
}

.add-admin-page__intro {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem 1.1rem;
  border: 1px solid #e7eaf3;
  border-radius: 1rem;
  background: linear-gradient(180deg, rgba(248, 251, 255, 1) 0%, rgba(255, 255, 255, 1) 100%);
}

.add-admin-page__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
}

.add-admin-page__field {
  display: flex;
  flex-direction: column;
  gap: 0.42rem;
}

.add-admin-page__field--full {
  grid-column: 1 / -1;
}

.add-admin-page__label {
  font-size: 0.8rem;
  font-weight: 700;
  color: #0f172a;
  letter-spacing: 0.03em;
  text-transform: uppercase;
}

.add-admin-page__input {
  width: 100%;
  border: 1px solid #d4dde8;
  border-radius: 0.75rem;
  padding: 0.68rem 0.88rem;
  font-size: 0.88rem;
  color: #111827;
  background: #fcfdff;
  outline: none;
  transition: all 0.18s ease;
}

.add-admin-page__input:hover {
  border-color: #bfccdb;
}

.add-admin-page__password-wrap {
  position: relative;
}

.add-admin-page__input--password {
  padding-right: 2.75rem;
}

.add-admin-page__toggle-password {
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  width: 2.5rem;
  border: 0;
  background: transparent;
  color: #64748b;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.add-admin-page__toggle-password:hover {
  color: #334155;
}

.add-admin-page__toggle-password:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.add-admin-page__input:focus {
  border-color: var(--hope-o-cyan-blue);
  box-shadow: 0 0 0 3px rgba(0, 174, 239, 0.15);
  background: #ffffff;
}

.add-admin-page__permissions {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 0.55rem;
}

.add-admin-page__permission-item {
  display: flex;
  align-items: center;
  gap: 0.52rem;
  min-height: 2.35rem;
  padding: 0.52rem 0.72rem;
  border: 1px solid #d6e2ee;
  border-radius: 0.72rem;
  background: linear-gradient(180deg, #ffffff 0%, #f8fbff 100%);
  font-size: 0.8rem;
  font-weight: 600;
  color: #334155;
  cursor: pointer;
  transition: all 0.16s ease;
}

.add-admin-page__permission-item:hover {
  border-color: #8fc3de;
  background: #f0f8fe;
  transform: translateY(-1px);
}

.add-admin-page__permission-item--active {
  border-color: #67b7df;
  background: linear-gradient(180deg, #e8f6fe 0%, #dff1fc 100%);
  color: #075985;
  box-shadow: 0 6px 14px -12px rgba(0, 87, 138, 0.8);
}

.add-admin-page__permission-checkbox {
  accent-color: var(--hope-o-cyan-blue);
  width: 0.95rem;
  height: 0.95rem;
  flex-shrink: 0;
}

.add-admin-page__permission-item span {
  line-height: 1.2;
}

.add-admin-page__profile {
  display: flex;
  flex-wrap: wrap;
  gap: 0.85rem;
  align-items: center;
  border: 1px dashed #c9d9e8;
  border-radius: 0.9rem;
  background: #f9fcff;
  padding: 0.75rem;
}

.add-admin-page__profile-preview-wrap {
  width: 68px;
  height: 68px;
  border-radius: 999px;
  overflow: hidden;
  border: 2px solid #c7d9ea;
  box-shadow: 0 6px 14px -10px rgba(15, 23, 42, 0.6);
}

.add-admin-page__profile-preview {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.add-admin-page__profile-actions {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.add-admin-page__file-input {
  max-width: 260px;
  font-size: 0.8rem;
  color: #334155;
}

.add-admin-page__remove-image {
  border: 1px solid #fecaca;
  background: #fff1f2;
  color: #be123c;
  border-radius: 0.6rem;
  font-size: 0.78rem;
  font-weight: 600;
  padding: 0.42rem 0.62rem;
}

.add-admin-page__remove-image:hover {
  background: #ffe4e6;
}

@media (max-width: 1120px) {
  .add-admin-page__layout {
    grid-template-columns: 1fr;
  }

  .add-admin-page__rail {
    position: static;
  }
}

@media (max-width: 768px) {
  .add-admin-page__grid {
    grid-template-columns: 1fr;
  }

  .add-admin-page__permissions {
    grid-template-columns: 1fr;
  }
}
</style>
