<script setup>
import { computed, onBeforeUnmount, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import MainLayout from '@/layouts/MainLayout.vue'
import HeaderSection from '@/components/layout/HeaderSection.vue'
import Form from '@/components/ui/Form.vue'
import AlertSuccess from '@/components/ui/AlertSuccess.vue'
import AlertError from '@/components/ui/AlertError.vue'
import ShowPassword from '@/components/icons/ShowPassword.vue'

defineOptions({
  name: 'AddUserPage',
})

const router = useRouter()
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

const resolvedPageTitle = computed(() => {
  const key = 'users.addUser'
  const translated = t(key)
  return translated !== key ? translated : 'Add User'
})

const resolvedPageSubtitle = computed(() => {
  const key = 'users.addUserDescription'
  const translated = t(key)
  return translated !== key ? translated : 'Create a new user account and assign access.'
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

  if (!file.type.startsWith('image/')) {
    errorMessage.value = 'Please choose a valid image file.'
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
    showSuccess.value = true
  } catch {
    errorMessage.value = 'Unable to create user right now.'
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
                  accept="image/*"
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
      title="User created"
      message="The user account was created successfully."
      button-text="Back to users"
      @close="onSuccessClose"
    />
  </MainLayout>
</template>

<style scoped>
.add-user-page {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.add-user-page__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.9rem;
}

.add-user-page__field {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.add-user-page__field--full {
  grid-column: 1 / -1;
}

.add-user-page__label {
  font-size: 0.84rem;
  font-weight: 700;
  color: #1f2937;
}

.add-user-page__input {
  width: 100%;
  border: 1px solid #d1d5db;
  border-radius: 0.75rem;
  padding: 0.65rem 0.85rem;
  font-size: 0.88rem;
  color: #111827;
  background: #ffffff;
  outline: none;
  transition: all 0.2s ease;
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
}

.add-user-page__permissions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
}

.add-user-page__permission-item {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.45rem 0.6rem;
  border: 1px solid #dbe4ee;
  border-radius: 0.65rem;
  background: #f8fafc;
  font-size: 0.82rem;
  color: #1f2937;
}

.add-user-page__permission-checkbox {
  accent-color: var(--hope-o-cyan-blue);
}

.add-user-page__profile {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  align-items: center;
}

.add-user-page__profile-preview-wrap {
  width: 64px;
  height: 64px;
  border-radius: 999px;
  overflow: hidden;
  border: 2px solid #dbe4ee;
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
  max-width: 250px;
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
  padding: 0.38rem 0.55rem;
}

@media (max-width: 768px) {
  .add-user-page__grid {
    grid-template-columns: 1fr;
  }
}
</style>
