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
import { login } from '@/modules/auth/services/authService'

const router = useRouter()
const route = useRoute()

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
  { label: 'Super Admin', value: 'superadmin' },
  { label: 'English Admin', value: 'adminenglish' },
  { label: 'Preschool Admin', value: 'adminpreschool' },
  { label: 'Scholarship Admin', value: 'adminscholaship' },
  { label: 'Sport Admin', value: 'adminsport' },
  { label: 'English Teacher', value: 'teacher-english' },
  { label: 'Preschool Teacher', value: 'teacher-preschool' },
  { label: 'Scholarship Teacher', value: 'teacher-scholarship' },
  { label: 'Coach', value: 'coach' },
]

const emailError = computed(() => {
  if (!touched.email) return ''
  if (!form.email.trim()) return 'Email is required.'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) return 'Enter a valid email address.'
  return ''
})

const passwordError = computed(() => {
  if (!touched.password) return ''
  if (!form.password) return 'Password is required.'
  return ''
})

const userTypeError = computed(() => {
  if (!touched.userType) return ''
  if (!form.userType) return 'Please choose your user type.'
  return ''
})

const isFormValid = computed(
  () =>
    Boolean(form.email.trim()) &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()) &&
    Boolean(form.password) &&
    Boolean(form.userType),
)

const submitLabel = computed(() => (isSubmitting.value ? 'Signing in...' : 'Sign in'))

function touchField(field) {
  touched[field] = true
}

async function onSubmit() {
  touched.email = true
  touched.password = true
  touched.userType = true
  errorMessage.value = ''

  if (!isFormValid.value) return

  isSubmitting.value = true

  try {
    await login({
      email: form.email,
      password: form.password,
      role: form.userType,
      remember: form.remember,
    })
    shouldRedirectAfterSuccess.value = true
    showLoginSuccess.value = true
  } catch (error) {
    errorMessage.value = error?.message || 'Unable to login right now.'
  } finally {
    isSubmitting.value = false
  }
}

function getSafeRedirectTarget(value) {
  const redirect = String(value || '').trim()

  if (!redirect.startsWith('/') || redirect.startsWith('//')) {
    return '/module/dashboard'
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
  <div class="mx-auto w-full max-w-md">
    <Card class="login-form-card border-0 shadow-none">
      <template #content>
        <header class="login-form-header mb-7 space-y-3 sm:mb-8">
          <p
            class="inline-flex items-center rounded-full border border-sky-100 bg-sky-50 px-3 py-1 text-[0.64rem] font-bold uppercase tracking-[0.18em] text-sky-700 sm:text-[0.68rem]"
          >
            Secure access
          </p>
          <div class="space-y-1">
            <h2 class="text-[1.7rem] font-bold tracking-tight text-slate-900 sm:text-2xl">Login</h2>
            <p class="text-sm leading-6 text-slate-600 sm:text-sm">
              Use your HFCCF account details and assigned role to continue.
            </p>
          </div>
        </header>

        <form class="login-form-fields space-y-4 sm:space-y-5" @submit.prevent="onSubmit">
          <div class="space-y-1.5">
            <label for="email" class="text-sm font-semibold text-slate-700">Email</label>
            <InputText
              id="email"
              v-model="form.email"
              type="email"
              autocomplete="email"
              class="login-form-input w-full"
              :class="{ 'login-form-input--invalid': emailError }"
              placeholder="name@hfccf.org"
              @blur="touchField('email')"
            />
            <p v-if="emailError" class="login-form-error">{{ emailError }}</p>
          </div>

          <div class="space-y-1.5">
            <label for="password" class="text-sm font-semibold text-slate-700">Password</label>
            <Password
              id="password"
              v-model="form.password"
              class="w-full login-form-password"
              autocomplete="current-password"
              placeholder="Enter your password"
              :feedback="false"
              toggle-mask
              fluid
              :input-class="['w-full', passwordError ? 'login-form-input--invalid' : '']"
              @blur="touchField('password')"
            />
            <p v-if="passwordError" class="login-form-error">{{ passwordError }}</p>
          </div>

          <div class="space-y-1.5">
            <label for="userType" class="text-sm font-semibold text-slate-700">User type</label>
            <Select
              id="userType"
              v-model="form.userType"
              :options="userTypeOptions"
              option-label="label"
              option-value="value"
              append-to="self"
              class="login-form-input w-full"
              :class="{ 'login-form-input--invalid': userTypeError }"
              placeholder="Select user type"
              @blur="touchField('userType')"
            />
            <p class="text-xs text-slate-500">Choose the role assigned to your account.</p>
            <p v-if="userTypeError" class="login-form-error">{{ userTypeError }}</p>
          </div>

          <div class="login-form-actions flex flex-col gap-3 text-sm sm:flex-row sm:items-center sm:justify-between">
            <label class="inline-flex items-center gap-2 text-slate-600">
              <Checkbox v-model="form.remember" binary input-id="rememberMe" />
              <span>Remember me</span>
            </label>

            <RouterLink
              :to="{ name: 'forgot-password' }"
              class="font-semibold text-sky-700 transition hover:text-sky-800 max-sm:self-start"
            >
              Forgot password?
            </RouterLink>
          </div>

          <Message v-if="errorMessage" severity="error" :closable="false">
            {{ errorMessage }}
          </Message>

          <Loading v-if="isSubmitting" label="Signing in..." size="sm" />

          <Button
            type="submit"
            variant="primary"
            size="md"
            rounded="xl"
            block
            :disabled="!isFormValid"
            :loading="isSubmitting"
            class="mt-1"
          >
            {{ submitLabel }}
          </Button>

          <p class="text-sm leading-6 text-slate-600">
            Need access?
            <RouterLink :to="{ name: 'register' }" class="font-semibold text-sky-700">
              Create an account
            </RouterLink>
          </p>
        </form>
      </template>
    </Card>

    <AlertSuccess
      :show="showLoginSuccess"
      title="Login successful"
      message="Welcome back. Redirecting to dashboard..."
      button-text="Continue"
      :auto-close="900"
      @close="onLoginSuccessClose"
    />
  </div>
</template>

<style scoped>
:deep(.login-form-card.p-card .p-card-body) {
  padding: 0;
}

:deep(.login-form-card .login-form-input.p-inputtext),
:deep(.login-form-card .p-password-input),
:deep(.login-form-card .login-form-input.p-select) {
  width: 100%;
  min-height: 3.05rem;
  border-radius: 0.9rem;
  border: 1px solid #dbe4ee;
  background: #fff;
  padding: 0.8rem 0.95rem;
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
  min-height: 3.05rem;
  color: #0f172a;
  padding: 0.8rem 0.95rem;
}

:deep(.login-form-card .login-form-input.p-select .p-select-label.p-placeholder) {
  color: #94a3b8;
}

:deep(.login-form-card .login-form-input.p-select .p-select-dropdown) {
  width: 3rem;
  background: transparent;
  color: #64748b;
}

:deep(.login-form-card .login-form-input.p-select .p-select-clear-icon) {
  right: 3rem;
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
  border-color: #94a3b8;
  background: #fff;
}

:deep(.login-form-card .login-form-input.p-inputtext:enabled:focus),
:deep(.login-form-card .p-password-input:enabled:focus),
:deep(.login-form-card .login-form-input.p-select.p-focus) {
  border-color: #38bdf8;
  box-shadow: 0 0 0 2px rgba(125, 211, 252, 0.22);
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

:deep(.login-form-card .login-form-input.p-select .p-select-overlay) {
  margin-top: 0.3rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.9rem;
  background: #fff;
  box-shadow: 0 12px 24px -18px rgba(15, 23, 42, 0.16);
}

:deep(.login-form-card .login-form-input.p-select .p-select-list-container) {
  background: #fff;
  padding: 0.4rem;
}

:deep(.login-form-card .login-form-input.p-select .p-select-option) {
  border-radius: 0.65rem;
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
  box-shadow: 0 0 0 2px rgba(244, 63, 94, 0.1);
}

.login-form-error {
  font-size: 0.78rem;
  font-weight: 600;
  color: #e11d48;
}

@media (max-width: 639px) {
  .login-form-header {
    margin-bottom: 1.35rem;
  }

  :deep(.login-form-card .login-form-input.p-inputtext),
  :deep(.login-form-card .p-password-input),
  :deep(.login-form-card .login-form-input.p-select) {
    min-height: 2.9rem;
    padding: 0.75rem 0.9rem;
    font-size: 0.92rem;
  }

  :deep(.login-form-card .login-form-input.p-select .p-select-label) {
    min-height: 2.9rem;
    padding: 0.75rem 0.9rem;
  }

  :deep(.login-form-card .login-form-input.p-select .p-select-dropdown) {
    width: 2.75rem;
  }

  :deep(.login-form-card .login-form-input.p-select .p-select-clear-icon) {
    right: 2.75rem;
  }

  .login-form-actions {
    padding-top: 0.15rem;
  }
}

@media (max-width: 420px) {
  .login-form-fields {
    gap: 0.9rem;
  }

  .login-form-error {
    font-size: 0.74rem;
  }
}
</style>

