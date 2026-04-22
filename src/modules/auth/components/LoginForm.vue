<script setup>
import { computed, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Card from 'primevue/card'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Checkbox from 'primevue/checkbox'
import Message from 'primevue/message'
import Select from 'primevue/select'
import Button from '@/components/buttons/Button.vue'
import AlertSuccess from '@/components/alerts/AlertSuccess.vue'
import Loading from '@/components/feedback/Loading.vue'
import { useLanguage } from '@/composables/useLanguage'
import { login, logout } from '@/modules/auth/services/authService'

const router = useRouter()
const route = useRoute()
const { language } = useLanguage()

const props = defineProps({
  accessPolicy: {
    type: Object,
    default: () => ({
      defaultRedirect: '/module/dashboard',
      recoveryRole: 'superadmin',
      allowedRoles: [],
      requiredPermissionsByRole: {},
    }),
  },
})

const isKhmer = computed(() => language.value === 'KH')

const form = reactive({
  email: '',
  password: '',
  userType: '',
  remember: false,
})

const isSubmitting = ref(false)
const errorMessage = ref('')
const showLoginSuccess = ref(false)
const shouldRedirectAfterSuccess = ref(false)
const touched = reactive({
  email: false,
  password: false,
  userType: false,
})

const userTypeOptions = [
  { label: 'Super Admin', khLabel: 'អ្នកគ្រប់គ្រងធំ', value: 'superadmin' },
  { label: 'English Admin', khLabel: 'អ្នកគ្រប់គ្រងអង់គ្លេស', value: 'adminenglish' },
  { label: 'Preschool Admin', khLabel: 'អ្នកគ្រប់គ្រងមត្តេយ្យ', value: 'adminpreschool' },
  { label: 'Scholarship Admin', khLabel: 'អ្នកគ្រប់គ្រងអាហារូបករណ៍', value: 'adminscholaship' },
  { label: 'Sport Admin', khLabel: 'អ្នកគ្រប់គ្រងកីឡា', value: 'adminsport' },
  { label: 'English Teacher', khLabel: 'គ្រូអង់គ្លេស', value: 'teacher-english' },
  { label: 'Preschool Teacher', khLabel: 'គ្រូមត្តេយ្យ', value: 'teacher-preschool' },
  { label: 'Scholarship Teacher', khLabel: 'គ្រូអាហារូបករណ៍', value: 'teacher-scholarship' },
  { label: 'Coach', khLabel: 'គ្រូបង្វឹក', value: 'coach' },
]

const allowedRoleValues = computed(() =>
  Array.isArray(props.accessPolicy.allowedRoles)
    ? props.accessPolicy.allowedRoles.map((role) => String(role || '').trim().toLowerCase()).filter(Boolean)
    : [],
)

const normalizedUserType = computed(() =>
  String(form.userType || '')
    .trim()
    .toLowerCase(),
)

const isRoleAllowed = computed(
  () => !allowedRoleValues.value.length || allowedRoleValues.value.includes(normalizedUserType.value),
)

const recoveryRole = computed(() =>
  String(props.accessPolicy.recoveryRole || 'superadmin')
    .trim()
    .toLowerCase(),
)

const localizedUserTypeOptions = computed(() =>
  userTypeOptions
    .filter((option) => !allowedRoleValues.value.length || allowedRoleValues.value.includes(option.value))
    .map((option) => ({
      ...option,
      displayLabel: isKhmer.value ? option.khLabel : option.label,
    })),
)

const emailError = computed(() => {
  if (!touched.email) return ''
  if (!form.email.trim()) return isKhmer.value ? 'សូមបញ្ចូលអ៊ីមែល។' : 'Email is required.'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
    return isKhmer.value ? 'សូមបញ្ចូលអ៊ីមែលឱ្យបានត្រឹមត្រូវ។' : 'Enter a valid email address.'
  }
  return ''
})

const passwordError = computed(() => {
  if (!touched.password) return ''
  if (!form.password) return isKhmer.value ? 'សូមបញ្ចូលពាក្យសម្ងាត់។' : 'Password is required.'
  return ''
})

const userTypeError = computed(() => {
  if (!touched.userType) return ''
  if (!form.userType) return isKhmer.value ? 'សូមជ្រើសរើសប្រភេទអ្នកប្រើ។' : 'Please choose your user type.'
  if (!isRoleAllowed.value) return isKhmer.value ? 'អ្នកប្រើនេះមិនមានសិទ្ធិចូលប្រើទេ។' : 'This user type is not allowed.'
  return ''
})

const isFormValid = computed(
  () =>
    Boolean(form.email.trim()) &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()) &&
    Boolean(form.password) &&
    Boolean(form.userType) &&
    isRoleAllowed.value,
)

const localizedSubmitLabel = computed(() => {
  if (isSubmitting.value) return isKhmer.value ? 'កំពុងចូល...' : 'Signing in...'
  return isKhmer.value ? 'ចូលប្រើ' : 'Sign in'
})

function touchField(field) {
  touched[field] = true
}

function hasRequiredPermissionsForRole(user) {
  const role = String(user?.role || '')
    .trim()
    .toLowerCase()
  const requiredPermissions = Array.isArray(props.accessPolicy.requiredPermissionsByRole?.[role])
    ? props.accessPolicy.requiredPermissionsByRole[role]
    : []
  const userPermissions = Array.isArray(user?.role_permission) ? user.role_permission : []

  if (!requiredPermissions.length) return true
  if (userPermissions.includes('all:*')) return true

  return requiredPermissions.every((permission) => userPermissions.includes(permission))
}

async function onSubmit() {
  touched.email = true
  touched.password = true
  touched.userType = true
  errorMessage.value = ''

  if (!isFormValid.value) return

  isSubmitting.value = true

  try {
    const authenticatedUser = await login({
      email: form.email.trim().toLowerCase(),
      password: form.password,
      role: normalizedUserType.value,
      remember: form.remember,
    })

    if (!hasRequiredPermissionsForRole(authenticatedUser)) {
      logout()
      throw new Error('Your account does not have the required permissions for this access type.')
    }

    shouldRedirectAfterSuccess.value = true
    showLoginSuccess.value = true
  } catch (error) {
    errorMessage.value = isKhmer.value
      ? 'ព័ត៌មានចូលប្រើមិនត្រឹមត្រូវ។'
      : error?.message || 'Unable to login right now.'
  } finally {
    isSubmitting.value = false
  }
}

function getSafeRedirectTarget(value) {
  const redirect = String(value || '').trim()

  if (!redirect.startsWith('/') || redirect.startsWith('//')) {
    return props.accessPolicy.defaultRedirect || '/module/dashboard'
  }

  return redirect
}

async function onLoginSuccessClose() {
  showLoginSuccess.value = false

  if (!shouldRedirectAfterSuccess.value) return
  shouldRedirectAfterSuccess.value = false
  await router.push(getSafeRedirectTarget(route.query.redirect))
}
</script>

<template>
  <div class="login-form-root mx-auto w-full max-w-md">
    <Card class="login-form-card border-0">
      <template #content>
        <form class="login-form-fields" :class="{ 'login-form-khmer': isKhmer }" @submit.prevent="onSubmit">
          <div class="login-form-field">
            <div class="login-form-label-row">
              <label for="email">{{ isKhmer ? 'អ៊ីមែល' : 'Email' }}</label>
            </div>
            <div class="login-form-control">
              <i class="pi pi-envelope login-form-control-icon" aria-hidden="true"></i>
              <InputText
                id="email"
                v-model="form.email"
                type="email"
                autocomplete="email"
                class="login-form-input w-full"
                :class="{ 'login-form-input--invalid': emailError }"
                :aria-invalid="Boolean(emailError)"
                :aria-describedby="emailError ? 'email-error' : undefined"
                :placeholder="isKhmer ? 'name@hfccf.org' : 'name@hfccf.org'"
                @blur="touchField('email')"
              />
            </div>
            <p v-if="emailError" id="email-error" class="login-form-error">
              <i class="pi pi-exclamation-circle" aria-hidden="true"></i>
              {{ emailError }}
            </p>
          </div>

          <div class="login-form-field">
            <div class="login-form-label-row">
              <label for="password">{{ isKhmer ? 'ពាក្យសម្ងាត់' : 'Password' }}</label>
            </div>
            <div class="login-form-control">
              <i class="pi pi-key login-form-control-icon" aria-hidden="true"></i>
              <Password
                id="password"
                v-model="form.password"
                class="w-full login-form-password"
                autocomplete="current-password"
                :placeholder="isKhmer ? 'បញ្ចូលពាក្យសម្ងាត់' : 'Enter your password'"
                :feedback="false"
                toggle-mask
                fluid
                :input-class="['w-full', passwordError ? 'login-form-input--invalid' : '']"
                :aria-invalid="Boolean(passwordError)"
                :aria-describedby="passwordError ? 'password-error' : undefined"
                @blur="touchField('password')"
              />
            </div>
            <p v-if="passwordError" id="password-error" class="login-form-error">
              <i class="pi pi-exclamation-circle" aria-hidden="true"></i>
              {{ passwordError }}
            </p>
          </div>

          <div class="login-form-field">
            <div class="login-form-label-row">
              <label for="userType">{{ isKhmer ? 'ប្រភេទអ្នកប្រើ' : 'User type' }}</label>
            </div>
            <div class="login-form-control">
              <i class="pi pi-id-card login-form-control-icon" aria-hidden="true"></i>
              <Select
                id="userType"
                v-model="form.userType"
                :options="localizedUserTypeOptions"
                option-label="displayLabel"
                option-value="value"
                append-to="self"
                class="login-form-input w-full"
                :class="{ 'login-form-input--invalid': userTypeError }"
                :aria-invalid="Boolean(userTypeError)"
                :aria-describedby="userTypeError ? 'user-type-error' : undefined"
                :placeholder="isKhmer ? 'ជ្រើសរើសប្រភេទ' : 'Select user type'"
                @blur="touchField('userType')"
              />
            </div>
            <p v-if="userTypeError" id="user-type-error" class="login-form-error">
              <i class="pi pi-exclamation-circle" aria-hidden="true"></i>
              {{ userTypeError }}
            </p>
          </div>

          <div class="login-form-actions">
            <label class="login-form-remember">
              <Checkbox v-model="form.remember" binary input-id="rememberMe" />
              <span>{{ isKhmer ? 'ចងចាំខ្ញុំ' : 'Remember me' }}</span>
            </label>

            <RouterLink
              v-if="normalizedUserType === recoveryRole"
              :to="{ name: 'forgot-password' }"
              class="font-semibold text-sky-700 transition hover:text-sky-800 max-sm:self-start"
            >
              {{ isKhmer ? 'ភ្លេច?' : 'Forgot?' }}
            </RouterLink>
          </div>

          <Message v-if="errorMessage" severity="error" :closable="false" class="login-form-message">
            {{ errorMessage }}
          </Message>

          <Loading
            v-if="isSubmitting"
            class="login-form-loading"
            :label="isKhmer ? 'កំពុងចូល...' : 'Signing in...'"
            size="sm"
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            rounded="xl"
            block
            :disabled="!isFormValid"
            :loading="isSubmitting"
            class="login-form-submit"
          >
            <template #iconLeft>
              <i class="pi pi-sign-in" aria-hidden="true"></i>
            </template>
            {{ localizedSubmitLabel }}
          </Button>

        </form>
      </template>
    </Card>

    <AlertSuccess
      :show="showLoginSuccess"
      :title="isKhmer ? 'បានចូលប្រើ' : 'Signed in'"
      :message="isKhmer ? 'កំពុងបញ្ជូន...' : 'Redirecting...'"
      :button-text="isKhmer ? 'បន្ត' : 'Continue'"
      :auto-close="900"
      @close="onLoginSuccessClose"
    />
  </div>
</template>

<style scoped>
:deep(.login-form-card.p-card) {
  border: 1px solid rgba(226, 232, 240, 0.88);
  border-radius: 1.35rem;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.98), rgba(248, 250, 252, 0.95)),
    linear-gradient(135deg, rgba(0, 174, 239, 0.07), transparent 42%);
  box-shadow: 0 18px 38px -30px rgba(15, 23, 42, 0.34);
}

:deep(.login-form-card.p-card .p-card-body) {
  padding: 0;
}

:deep(.login-form-card.p-card .p-card-content) {
  padding: 1.35rem;
}

.login-form-fields {
  display: grid;
  gap: 1rem;
}

.login-form-khmer {
  font-family:
    'Noto Sans Khmer',
    'Khmer OS Siemreap',
    'Khmer OS Battambang',
    'Leelawadee UI',
    sans-serif;
}

.login-form-field {
  display: grid;
  gap: 0.45rem;
}

.login-form-label-row {
  display: flex;
  align-items: center;
}

.login-form-label-row label {
  color: #334155;
  font-size: 0.9rem;
  font-weight: 800;
}

.login-form-control {
  position: relative;
}

.login-form-control-icon {
  position: absolute;
  top: 50%;
  left: 0.95rem;
  z-index: 2;
  color: #0ea5e9;
  font-size: 0.95rem;
  transform: translateY(-50%);
}

:deep(.login-form-card .login-form-input.p-inputtext),
:deep(.login-form-card .p-password-input),
:deep(.login-form-card .login-form-input.p-select) {
  width: 100%;
  min-height: 3.15rem;
  border-radius: 1rem;
  border: 1px solid #dbe4ee;
  background: #ffffff;
  padding: 0.82rem 0.95rem 0.82rem 2.8rem;
  color: #0f172a;
  font-size: 0.95rem;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease,
    background-color 0.2s ease;
}

:deep(.login-form-card .login-form-input.p-inputtext::placeholder),
:deep(.login-form-card .p-password-input::placeholder) {
  color: #94a3b8;
}

:deep(.login-form-card .login-form-input.p-select .p-select-label) {
  display: flex;
  align-items: center;
  min-height: 3.15rem;
  color: #0f172a;
  padding: 0.82rem 0.95rem 0.82rem 2.8rem;
}

:deep(.login-form-card .login-form-input.p-select .p-select-label.p-placeholder) {
  color: #94a3b8;
}

:deep(.login-form-card .login-form-input.p-select .p-select-dropdown) {
  width: 3.05rem;
  background: transparent;
  color: #64748b;
}

:deep(.login-form-card .login-form-input.p-select .p-select-clear-icon) {
  right: 3.05rem;
  color: #94a3b8;
}

:deep(.login-form-card .login-form-input.p-select .p-select-label),
:deep(.login-form-card .login-form-input.p-select .p-select-dropdown),
:deep(.login-form-card .login-form-input.p-select .p-select-dropdown-icon) {
  background: transparent;
}

:deep(.login-form-card .login-form-input.p-inputtext:enabled:hover),
:deep(.login-form-card .p-password-input:enabled:hover),
:deep(.login-form-card .login-form-input.p-select:not(.p-disabled):hover) {
  border-color: #7dd3fc;
  background: #ffffff;
}

:deep(.login-form-card .login-form-input.p-inputtext:enabled:focus),
:deep(.login-form-card .p-password-input:enabled:focus),
:deep(.login-form-card .login-form-input.p-select.p-focus) {
  border-color: #0ea5e9;
  box-shadow:
    0 0 0 3px rgba(14, 165, 233, 0.14),
    0 12px 22px -20px rgba(14, 165, 233, 0.58);
}

:deep(.login-form-password .p-password) {
  width: 100%;
}

:deep(.login-form-card .p-checkbox .p-checkbox-box) {
  border: 1px solid #cbd5e1;
  background: #ffffff;
  box-shadow: none;
}

:deep(.login-form-card .p-checkbox:not(.p-disabled) .p-checkbox-box:hover) {
  border-color: #94a3b8;
  background: #ffffff;
}

:deep(.login-form-card .p-checkbox.p-focus .p-checkbox-box) {
  border-color: #38bdf8;
  box-shadow: 0 0 0 2px rgba(125, 211, 252, 0.18);
}

:deep(.login-form-card .p-checkbox.p-highlight .p-checkbox-box) {
  border-color: #0ea5e9;
  background: #0ea5e9;
}

:deep(.login-form-card .p-checkbox.p-highlight .p-checkbox-icon) {
  color: #ffffff;
}

:deep(.login-form-card .login-form-input.p-select .p-select-overlay) {
  margin-top: 0.3rem;
  border: 1px solid #e2e8f0;
  border-radius: 1rem;
  background: #fff;
  box-shadow: 0 16px 28px -20px rgba(15, 23, 42, 0.2);
}

:deep(.login-form-card .login-form-input.p-select .p-select-list-container) {
  background: #fff;
  padding: 0.4rem;
}

:deep(.login-form-card .login-form-input.p-select .p-select-option) {
  border-radius: 0.75rem;
  background: #fff;
  color: #0f172a;
}

:deep(.login-form-card .login-form-input.p-select .p-select-option:hover) {
  background: #f8fafc;
}

:deep(.login-form-card .login-form-input.p-select .p-select-option.p-select-option-selected) {
  background: rgba(56, 189, 248, 0.12);
  color: #0369a1;
}

:deep(.login-form-card .login-form-input--invalid.p-inputtext),
:deep(.login-form-card .login-form-input--invalid.p-select),
:deep(.login-form-card .login-form-password .login-form-input--invalid) {
  border-color: #f43f5e;
  box-shadow: 0 0 0 3px rgba(244, 63, 94, 0.1);
}

.login-form-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.9rem;
  padding-top: 0.15rem;
  font-size: 0.9rem;
}

.login-form-remember {
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  color: #475569;
  font-weight: 700;
}

.login-form-actions a {
  color: #0369a1;
  font-weight: 900;
  text-decoration: none;
  transition: color 0.2s ease;
}

.login-form-actions a:hover {
  color: #075985;
}

.login-form-message {
  border-radius: 1rem;
}

.login-form-loading {
  padding: 0.1rem 0;
}

.login-form-submit {
  margin-top: 0.1rem;
}

.login-form-error {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  color: #e11d48;
  font-size: 0.78rem;
  font-weight: 800;
}

@media (max-width: 639px) {
  :deep(.login-form-card.p-card .p-card-content) {
    padding: 1rem;
  }

  .login-form-fields {
    gap: 0.9rem;
  }

  :deep(.login-form-card .login-form-input.p-inputtext),
  :deep(.login-form-card .p-password-input),
  :deep(.login-form-card .login-form-input.p-select) {
    min-height: 2.95rem;
    padding: 0.74rem 0.9rem 0.74rem 2.65rem;
    font-size: 0.92rem;
  }

  :deep(.login-form-card .login-form-input.p-select .p-select-label) {
    min-height: 2.95rem;
    padding: 0.74rem 0.9rem 0.74rem 2.65rem;
  }

  :deep(.login-form-card .login-form-input.p-select .p-select-dropdown) {
    width: 2.75rem;
  }

  :deep(.login-form-card .login-form-input.p-select .p-select-clear-icon) {
    right: 2.75rem;
  }

  .login-form-control-icon {
    left: 0.9rem;
  }

  .login-form-actions {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }
}

@media (max-width: 420px) {
  :deep(.login-form-card.p-card .p-card-content) {
    padding: 0.9rem;
  }

  .login-form-error {
    font-size: 0.74rem;
  }
}
</style>

