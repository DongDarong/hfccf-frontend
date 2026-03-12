<script setup>
import { computed, onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import MainLayout from '@/layouts/MainLayout.vue'
import HeaderSection from '@/components/layout/HeaderSection.vue'
import Form from '@/components/ui/Form.vue'
import Button from '@/components/ui/Button.vue'
import AlertSuccess from '@/components/ui/AlertSuccess.vue'
import AlertError from '@/components/ui/AlertError.vue'
import ShowPassword from '@/components/icons/ShowPassword.vue'
import usersMock from '@/mocks/users.json'

defineOptions({
  name: 'AddUserPage',
})

const router = useRouter()
const route = useRoute()
const { t } = useI18n()

const roleOptions = [
  'superadmin',
  'coach',
  'teacher',
  'adminpreschool',
  'adminscholaship',
  'adminenglish',
  'adminsport',
]
const statusOptions = ['Active', 'Pending', 'Inactive', 'Suspended']
const permissionOptions = [
  'manage_users',
  'view_reports',
  'manage_programs',
  'approve_requests',
]
const allowedProfileImageTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
const maxProfileImageSizeBytes = 2 * 1024 * 1024

const form = reactive({
  name: '',
  email: '',
  phone: '',
  role: roleOptions[1],
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

const resolvedPageTitle = computed(() => {
  const key = isEditMode.value ? 'users.editUser' : 'users.addUser'
  const translated = t(key)
  return translated !== key ? translated : isEditMode.value ? 'Update User' : 'Add User'
})

const resolvedPageSubtitle = computed(() => {
  const key = isEditMode.value ? 'users.editDescription' : 'users.addUserDescription'
  const translated = t(key)
  return translated !== key
    ? translated
    : isEditMode.value
      ? 'Update user profile details and permissions.'
      : 'Create a new user account and assign access.'
})

const resolvedFormDescription = computed(() => {
  const key = 'users.formDescription'
  const translated = t(key)
  return translated !== key ? translated : 'Fill in all required details before saving.'
})

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
  if (!form.name.trim()) return 'Full name is required.'
  if (!form.email.trim()) return 'Email is required.'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return 'Please enter a valid email.'
  if (!form.role) return 'Role is required.'
  if (!form.permissions.length) return 'At least one role permission is required.'
  if (!form.status) return 'Status is required.'
  if (form.password.length < 6) return 'Password must be at least 6 characters.'
  if (form.password !== form.confirmPassword) return 'Passwords do not match.'
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
  return String(value ?? '')
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

function onProfileImageChange(event) {
  const [file] = event?.target?.files || []
  if (!file) return

  if (!allowedProfileImageTypes.includes(file.type)) {
    errorMessage.value = 'Please choose a JPG, PNG, WEBP, or GIF image.'
    showError.value = true
    return
  }

  if (file.size > maxProfileImageSizeBytes) {
    errorMessage.value = 'Profile images must be 2 MB or smaller.'
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
    // Placeholder for API integration.
    await new Promise((resolve) => setTimeout(resolve, 700))
    if (isEditMode.value) {
      errorMessage.value = 'User updated successfully.'
    }
    showSuccess.value = true
  } catch {
    errorMessage.value = isEditMode.value
      ? 'Unable to update user right now.'
      : 'Unable to create user right now.'
    showError.value = true
  } finally {
    isSubmitting.value = false
  }
}

async function onCancel() {
  await router.push('/users')
}

async function onSuccessClose() {
  showSuccess.value = false
  await router.push('/users')
}

function onErrorClose() {
  showError.value = false
}

onMounted(() => {
  if (!isEditMode.value) return
  const id = String(route.query.id || '')
  const found = usersMock.find((item) => String(item.id) === id) || usersMock[0]
  if (!found) return
  form.name = `${found.firstName || ''} ${found.lastName || ''}`.trim() || found.username || ''
  form.email = found.email || ''
  form.phone = found.phone || ''
  form.role = found.role || roleOptions[1]
  form.permissions = Array.isArray(found.role_permission) ? [...found.role_permission] : []
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
</script>

<template>
  <MainLayout>
    <section class="add-user-page">
      <HeaderSection :title="resolvedPageTitle" :subtitle="resolvedPageSubtitle" />

      <Form
        :title="resolvedPageTitle"
        :description="resolvedFormDescription"
        :submit-text="resolvedPageTitle"
        :cancel-text="t('common.cancel')"
        :loading="isSubmitting"
        :show-cancel="true"
        @submit="onSubmit"
        @cancel="onCancel"
      >
        <div class="add-user-page__grid">
          <div class="add-user-page__field add-user-page__field--full">
            <span class="add-user-page__label">Profile Image</span>
            <div class="add-user-page__profile">
              <div v-if="profileImagePreview" class="add-user-page__profile-preview-wrap">
                <img :src="profileImagePreview" alt="Profile preview" class="add-user-page__profile-preview" />
              </div>
              <div class="add-user-page__profile-actions">
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  class="add-user-page__file-input"
                  :disabled="isSubmitting"
                  @change="onProfileImageChange"
                />
                <button
                  v-if="profileImagePreview"
                  type="button"
                  class="add-user-page__remove-image"
                  :disabled="isSubmitting"
                  @click="removeProfileImage"
                >
                  Remove Image
                </button>
              </div>
            </div>
          </div>

          <label class="add-user-page__field">
            <span class="add-user-page__label">Full Name</span>
            <input
              v-model="form.name"
              type="text"
              class="add-user-page__input"
              placeholder="Enter full name"
              :disabled="isSubmitting"
            />
          </label>

          <label class="add-user-page__field">
            <span class="add-user-page__label">Email</span>
            <input
              v-model="form.email"
              type="email"
              class="add-user-page__input"
              placeholder="name@hfccf.org"
              :disabled="isSubmitting"
            />
          </label>

          <label class="add-user-page__field">
            <span class="add-user-page__label">Phone</span>
            <input
              v-model="form.phone"
              type="text"
              class="add-user-page__input"
              placeholder="012 345 678"
              :disabled="isSubmitting"
            />
          </label>

          <label class="add-user-page__field">
            <span class="add-user-page__label">Role</span>
            <select v-model="form.role" class="add-user-page__input" :disabled="isSubmitting">
              <option v-for="role in roleOptions" :key="role" :value="role">
                {{ role }}
              </option>
            </select>
          </label>

          <label class="add-user-page__field">
            <span class="add-user-page__label">Status</span>
            <select v-model="form.status" class="add-user-page__input" :disabled="isSubmitting">
              <option v-for="status in statusOptions" :key="status" :value="status">
                {{ status }}
              </option>
            </select>
          </label>

          <div class="add-user-page__field add-user-page__field--full">
            <span class="add-user-page__label">Role Permission</span>
            <div class="add-user-page__permissions">
              <label
                v-for="permission in permissionOptions"
                :key="permission"
                class="add-user-page__permission-item"
                :class="{ 'add-user-page__permission-item--active': hasPermission(permission) }"
              >
                <input
                  type="checkbox"
                  class="add-user-page__permission-checkbox"
                  :checked="hasPermission(permission)"
                  :disabled="isSubmitting"
                  @change="togglePermission(permission)"
                />
                <span>{{ permissionLabel(permission) }}</span>
              </label>
            </div>
          </div>

          <label class="add-user-page__field">
            <span class="add-user-page__label">Password</span>
            <div class="add-user-page__password-wrap">
              <input
                v-model="form.password"
                :type="isPasswordVisible ? 'text' : 'password'"
                class="add-user-page__input add-user-page__input--password"
                placeholder="Minimum 6 characters"
                :disabled="isSubmitting"
              />
              <button
                type="button"
                class="add-user-page__toggle-password"
                :aria-label="isPasswordVisible ? 'Hide password' : 'Show password'"
                :title="isPasswordVisible ? 'Hide password' : 'Show password'"
                :disabled="isSubmitting"
                @click="togglePasswordVisibility"
              >
                <ShowPassword :visible="isPasswordVisible" :size="18" />
              </button>
            </div>
          </label>

          <label class="add-user-page__field add-user-page__field--full">
            <span class="add-user-page__label">Confirm Password</span>
            <div class="add-user-page__password-wrap">
              <input
                v-model="form.confirmPassword"
                :type="isConfirmPasswordVisible ? 'text' : 'password'"
                class="add-user-page__input add-user-page__input--password"
                placeholder="Re-enter password"
                :disabled="isSubmitting"
              />
              <button
                type="button"
                class="add-user-page__toggle-password"
                :aria-label="isConfirmPasswordVisible ? 'Hide password' : 'Show password'"
                :title="isConfirmPasswordVisible ? 'Hide password' : 'Show password'"
                :disabled="isSubmitting"
                @click="toggleConfirmPasswordVisibility"
              >
                <ShowPassword :visible="isConfirmPasswordVisible" :size="18" />
              </button>
            </div>
          </label>
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
            {{ resolvedPageTitle }}
          </Button>
        </template>
      </Form>
    </section>

    <AlertError
      :show="showError"
      title="Validation error"
      :message="errorMessage"
      button-text="Close"
      @close="onErrorClose"
    />

    <AlertSuccess
      :show="showSuccess"
      :title="isEditMode ? 'User updated' : 'User created'"
      :message="isEditMode ? 'The user account was updated successfully.' : 'The user account was created successfully.'"
      button-text="Back to users"
      @close="onSuccessClose"
    />
  </MainLayout>
</template>

<style scoped>
.add-user-page {
  display: flex;
  flex-direction: column;
  gap: 1.4rem;
}

.add-user-page__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
}

.add-user-page__field {
  display: flex;
  flex-direction: column;
  gap: 0.42rem;
}

.add-user-page__field--full {
  grid-column: 1 / -1;
}

.add-user-page__label {
  font-size: 0.8rem;
  font-weight: 700;
  color: #0f172a;
  letter-spacing: 0.03em;
  text-transform: uppercase;
}

.add-user-page__input {
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

.add-user-page__input:hover {
  border-color: #bfccdb;
}

.add-user-page__password-wrap {
  position: relative;
}

.add-user-page__input--password {
  padding-right: 2.75rem;
}

.add-user-page__toggle-password {
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

.add-user-page__toggle-password:hover {
  color: #334155;
}

.add-user-page__toggle-password:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.add-user-page__input:focus {
  border-color: var(--hope-o-cyan-blue);
  box-shadow: 0 0 0 3px rgba(0, 174, 239, 0.15);
  background: #ffffff;
}

.add-user-page__permissions {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 0.55rem;
}

.add-user-page__permission-item {
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

.add-user-page__permission-item:hover {
  border-color: #8fc3de;
  background: #f0f8fe;
  transform: translateY(-1px);
}

.add-user-page__permission-item--active {
  border-color: #67b7df;
  background: linear-gradient(180deg, #e8f6fe 0%, #dff1fc 100%);
  color: #075985;
  box-shadow: 0 6px 14px -12px rgba(0, 87, 138, 0.8);
}

.add-user-page__permission-checkbox {
  accent-color: var(--hope-o-cyan-blue);
  width: 0.95rem;
  height: 0.95rem;
  flex-shrink: 0;
}

.add-user-page__permission-item span {
  line-height: 1.2;
}

.add-user-page__profile {
  display: flex;
  flex-wrap: wrap;
  gap: 0.85rem;
  align-items: center;
  border: 1px dashed #c9d9e8;
  border-radius: 0.9rem;
  background: #f9fcff;
  padding: 0.75rem;
}

.add-user-page__profile-preview-wrap {
  width: 68px;
  height: 68px;
  border-radius: 999px;
  overflow: hidden;
  border: 2px solid #c7d9ea;
  box-shadow: 0 6px 14px -10px rgba(15, 23, 42, 0.6);
}

.add-user-page__profile-preview {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.add-user-page__profile-actions {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.add-user-page__file-input {
  max-width: 260px;
  font-size: 0.8rem;
  color: #334155;
}

.add-user-page__remove-image {
  border: 1px solid #fecaca;
  background: #fff1f2;
  color: #be123c;
  border-radius: 0.6rem;
  font-size: 0.78rem;
  font-weight: 600;
  padding: 0.42rem 0.62rem;
}

.add-user-page__remove-image:hover {
  background: #ffe4e6;
}

@media (max-width: 768px) {
  .add-user-page__grid {
    grid-template-columns: 1fr;
  }

  .add-user-page__permissions {
    grid-template-columns: 1fr;
  }
}
</style>





