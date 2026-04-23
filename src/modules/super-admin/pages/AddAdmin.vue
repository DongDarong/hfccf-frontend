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
import { mapUser } from '@/services/mappers/userMapper'
import usersMock from '@/mocks/users.json'
import AdminSummaryCards from '@/modules/super-admin/components/admin-management/AdminSummaryCards.vue'
import AdminChecklistPanel from '@/modules/super-admin/components/admin-management/AdminChecklistPanel.vue'
import AddAdminProfileImageField from '@/modules/super-admin/components/admin-management/AddAdminProfileImageField.vue'
import AddAdminIdentityFields from '@/modules/super-admin/components/admin-management/AddAdminIdentityFields.vue'
import AddAdminPermissionsField from '@/modules/super-admin/components/admin-management/AddAdminPermissionsField.vue'
import AddAdminPasswordFields from '@/modules/super-admin/components/admin-management/AddAdminPasswordFields.vue'

defineOptions({
  name: 'AddAdminPage',
})

const router = useRouter()
const route = useRoute()
const { t } = useI18n()

const roleOptions = [
  ROLES.ADMIN_ENGLISH,
  ROLES.ADMIN_PRESCHOOL,
  ROLES.ADMIN_SCHOLARSHIP,
  ROLES.ADMIN_SPORT,
  ROLES.SUPER_ADMIN,
]
const statusOptions = ['active', 'pending', 'inactive', 'suspended']
const permissionOptions = ['manage_users', 'view_reports', 'manage_programs', 'approve_requests']
const allowedProfileImageTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
const maxProfileImageSizeBytes = 2 * 1024 * 1024

const form = reactive({
  name: '',
  email: '',
  phone: '',
  role: roleOptions[0],
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

function resolvedText(key, fallback) {
  const translated = t(key)
  return translated !== key ? translated : fallback
}

const pageTitle = computed(() =>
  isEditMode.value ? resolvedText('users.addAdmin.updateTitle', 'Update Admin') : t('users.addAdmin.title'),
)

const pageSubtitle = computed(() =>
  isEditMode.value
    ? resolvedText(
        'users.addAdmin.updateSubtitle',
        'Update the admin profile, permissions, and account security details.',
      )
    : t('users.addAdmin.summary'),
)

const resolvedFormDescription = computed(() => t('users.addAdmin.formDescription'))

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
  if (!form.name.trim()) return t('users.addAdmin.validation.fullNameRequired')
  if (!form.email.trim()) return t('users.addAdmin.validation.emailRequired')
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return t('users.addAdmin.validation.emailInvalid')
  if (!form.role) return t('users.addAdmin.validation.roleRequired')
  if (!form.permissions.length) return t('users.addAdmin.validation.permissionsRequired')
  if (!form.status) return t('users.addAdmin.validation.statusRequired')
  if (form.password.length < 6) return t('users.addAdmin.validation.passwordLength')
  if (form.password !== form.confirmPassword) return t('users.addAdmin.validation.passwordMismatch')
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
  const permissionKeyMap = {
    manage_users: 'users:write',
    view_reports: 'reports:read',
    manage_programs: 'programs:write',
  }

  if (normalized === 'approve_requests') {
    return t('users.addAdmin.permissionLabels.approveRequests')
  }

  const mappedPermissionKey = permissionKeyMap[normalized] || normalized
  const key = `common.permission.${mappedPermissionKey}`
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
    errorMessage.value = t('users.addAdmin.validation.imageType')
    showError.value = true
    return
  }

  if (file.size > maxProfileImageSizeBytes) {
    errorMessage.value = t('users.addAdmin.validation.imageSize')
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
    await new Promise((resolve) => setTimeout(resolve, 700))
    showSuccess.value = true
  } catch {
    errorMessage.value = isEditMode.value
      ? t('users.addAdmin.validation.updateFailed')
      : t('users.addAdmin.validation.createFailed')
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

onMounted(() => {
  if (!isEditMode.value) return
  const id = String(route.query.id || '')
  const found = mapUser(usersMock.find((item) => String(item.id) === id) || usersMock[0])
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
    form.password.length >= 6 && form.confirmPassword === form.password ? 'success' : 'warning'

  return [
    {
      id: 'role-scope',
      title: t('users.addAdmin.roleScope'),
      value: selectedRole,
      label: t('users.addAdmin.programAccess'),
      status: 'info',
      statusLabel: statusLabel('info'),
      surfaceClass: 'bg-cyan-50/80 border-cyan-200',
    },
    {
      id: 'permissions',
      title: t('users.addAdmin.permissions'),
      value: permissionCount,
      label: permissionCount
        ? t('users.addAdmin.configuredPermissions')
        : t('users.addAdmin.noPermissionsSelected'),
      status: permissionCount ? 'success' : 'warning',
      statusLabel: statusLabel(permissionCount ? 'success' : 'warning'),
      surfaceClass: 'bg-lime-50/80 border-lime-200',
    },
    {
      id: 'account-state',
      title: t('users.addAdmin.accountState'),
      value: statusLabel(form.status),
      label: t('users.addAdmin.initialAccountState'),
      status: form.status,
      statusLabel: statusLabel(form.status),
      surfaceClass: 'bg-amber-50/80 border-amber-200',
    },
    {
      id: 'security-review',
      title: t('users.addAdmin.securityReview'),
      value: profileImagePreview.value ? t('users.addAdmin.ready') : t('users.addAdmin.pending'),
      label: profileImagePreview.value
        ? t('users.addAdmin.profileImageSet')
        : t('users.addAdmin.profileImagePending'),
      status: securityStatus,
      statusLabel: statusLabel(securityStatus),
      surfaceClass: 'bg-rose-50/80 border-rose-200',
    },
  ]
})

const selectedRoleDescription = computed(() => roleLabel(form.role))

const checklistItems = computed(() => [
  {
    title: t('users.addAdmin.sidebarItems.role'),
    text: selectedRoleDescription.value,
  },
  {
    title: t('users.addAdmin.sidebarItems.permissions'),
    text: t('users.addAdmin.sidebarItems.permissionsDetail'),
  },
  {
    title: t('users.addAdmin.sidebarItems.security'),
    text: t('users.addAdmin.sidebarItems.securityDetail'),
  },
  {
    title: t('users.addAdmin.sidebarItems.review'),
    text: t('users.addAdmin.sidebarItems.reviewDetail'),
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
                {{ t('users.addAdmin.title') }}
              </p>
              <p class="mt-1 text-[0.92rem] leading-6 text-slate-600">
                {{ t('users.addAdmin.summary') }}
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
      :title="t('users.addAdmin.validationError')"
      :message="errorMessage"
      :button-text="t('common.close')"
      @close="onErrorClose"
    />

    <AlertSuccess
      :show="showSuccess"
      :title="isEditMode ? t('users.addAdmin.adminUpdated') : t('users.addAdmin.adminCreated')"
      :message="
        isEditMode
          ? t('users.addAdmin.updatedMessage')
          : t('users.addAdmin.createdMessage')
      "
      :button-text="t('users.addAdmin.backToAdmins')"
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
