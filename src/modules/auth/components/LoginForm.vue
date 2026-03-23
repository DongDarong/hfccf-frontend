<script setup>
import { reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Card from 'primevue/card'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Checkbox from 'primevue/checkbox'
import Message from 'primevue/message'
import Select from 'primevue/select'
import Button from '@/components/Button.vue'
import AlertSuccess from '@/components/AlertSuccess.vue'
import Loading from '@/components/Loading.vue'
import { login } from '@/modules/auth/services/authService'

const router = useRouter()
const route = useRoute()

const form = reactive({
  userType: '',
  email: '',
  password: '',
  remember: false,
})

const isSubmitting = ref(false)
const errorMessage = ref('')
const showLoginSuccess = ref(false)
const shouldRedirectAfterSuccess = ref(false)

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

async function onSubmit() {
  errorMessage.value = ''
  isSubmitting.value = true

  try {
    await login({
      role: form.userType,
      email: form.email,
      password: form.password,
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
    <div class="mb-8 flex items-center gap-3 md:hidden">
      <img src="@/assets/images/logo.jpg" alt="HFCCF" class="h-10 w-auto rounded-lg shadow-sm" />
      <span class="text-sm font-bold uppercase tracking-widest text-slate-500"> HFCCF </span>
    </div>

    <Card class="login-form-card border-0 bg-transparent shadow-none">
      <template #content>
        <header class="mb-10">
          <p class="mb-1 text-[0.65rem] font-extrabold uppercase tracking-[0.2em] text-sky-600">
            Secure Access
          </p>
          <h2 class="text-3xl font-black tracking-tight text-slate-900">Sign in</h2>
          <p class="mt-3 text-[0.92rem] leading-relaxed text-slate-500">
            Welcome back! Please enter your details.
          </p>
        </header>

        <form class="space-y-6" @submit.prevent="onSubmit">
          <div class="group space-y-2">
            <label for="userType" class="login-form-label">User type</label>
            <Select
              id="userType"
              v-model="form.userType"
              :options="userTypeOptions"
              option-label="label"
              option-value="value"
              class="login-form-select w-full"
              placeholder="Select account type"
            />
          </div>

          <div class="group space-y-2">
            <label for="email" class="login-form-label">Email address</label>
            <div class="relative">
              <InputText
                id="email"
                v-model="form.email"
                type="email"
                autocomplete="email"
                class="login-form-input w-full"
                placeholder="e.g. name@hfccf.org"
              />
            </div>
          </div>

          <div class="group space-y-2">
            <label for="password" class="login-form-label">Password</label>
            <Password
              id="password"
              v-model="form.password"
              input-class="login-form-input w-full"
              class="w-full login-form-password"
              autocomplete="current-password"
              placeholder="••••••••"
              :feedback="false"
              toggle-mask
              fluid
            />
          </div>

          <div class="flex items-center justify-between py-1">
            <label class="login-form-remember group flex cursor-pointer items-center gap-3">
              <Checkbox v-model="form.remember" binary input-id="rememberMe" />
              <span class="text-sm font-semibold text-slate-600 transition-colors group-hover:text-slate-900">
                Keep me signed in
              </span>
            </label>

            <RouterLink
              :to="{ name: 'forgot-password' }"
              class="text-sm font-bold text-sky-600 transition-all hover:text-sky-700 hover:underline hover:underline-offset-4"
            >
              Forgot password?
            </RouterLink>
          </div>

          <Message v-if="errorMessage" severity="error" :closable="false" class="login-form-message">
            {{ errorMessage }}
          </Message>

          <Loading v-if="isSubmitting" label="Authenticating..." size="sm" />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            rounded="xl"
            block
            :loading="isSubmitting"
            class="mt-2 py-4 shadow-lg shadow-sky-200"
          >
            Sign in to Portal
          </Button>

          <div class="pt-4 text-center">
            <p class="text-[0.92rem] text-slate-500">
              Don't have an account?
              <RouterLink
                :to="{ name: 'register' }"
                class="ml-1 font-bold text-sky-600 transition-colors hover:text-sky-700"
              >
                Contact Administration
              </RouterLink>
            </p>
          </div>
        </form>
      </template>
    </Card>

    <AlertSuccess
      :show="showLoginSuccess"
      title="Access Granted"
      message="Welcome to HFCCF Portal. Preparing your dashboard..."
      button-text="Enter Dashboard"
      :auto-close="1200"
      @close="onLoginSuccessClose"
    />
  </div>
</template>

<style scoped>
:deep(.login-form-card.p-card) {
  background: transparent;
  border: 0;
  box-shadow: none;
}

:deep(.login-form-card.p-card .p-card-body) {
  padding: 0;
}

.login-form-label {
  display: block;
  font-size: 0.82rem;
  font-weight: 700;
  color: #475569;
  letter-spacing: 0.01em;
}

:deep(.login-form-card .login-form-input.p-inputtext),
:deep(.login-form-card .login-form-password .p-password-input),
:deep(.login-form-card .login-form-select.p-select) {
  width: 100%;
  border-radius: 0.85rem;
  border: 1.5px solid #e2e8f0;
  background: #ffffff;
  padding: 0.8rem 1rem;
  font-size: 0.95rem;
  color: #1e293b;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

:deep(.login-form-card .login-form-input.p-inputtext::placeholder),
:deep(.login-form-card .login-form-password .p-password-input::placeholder) {
  color: #94a3b8;
  font-weight: 400;
}

:deep(.login-form-card .login-form-select .p-select-label) {
  padding: 0.8rem 1rem;
  color: #1e293b;
}

:deep(.login-form-card .login-form-select .p-select-label.p-placeholder) {
  color: #94a3b8;
}

:deep(.login-form-card .login-form-input.p-inputtext:enabled:hover),
:deep(.login-form-card .login-form-password .p-password-input:enabled:hover),
:deep(.login-form-card .login-form-select.p-select:not(.p-disabled):hover) {
  border-color: #cbd5e1;
  background: #f8fafc;
}

:deep(.login-form-card .login-form-input.p-inputtext:enabled:focus),
:deep(.login-form-card .login-form-password .p-password-input:enabled:focus),
:deep(.login-form-card .login-form-select.p-focus) {
  border-color: var(--hope-o-cyan-blue);
  background: #ffffff;
  box-shadow:
    0 0 0 4px rgba(0, 174, 239, 0.1),
    0 1px 2px rgba(0, 0, 0, 0.05);
  outline: none;
}

:deep(.login-form-password .p-password) {
  width: 100%;
}

:deep(.login-form-password .p-password-toggle-mask-icon) {
  color: #94a3b8;
  right: 1rem;
}

:deep(.login-form-password .p-password-toggle-mask-icon:hover) {
  color: var(--hope-o-cyan-blue);
}

:deep(.login-form-remember .p-checkbox .p-checkbox-box) {
  width: 1.25rem;
  height: 1.25rem;
  border-radius: 0.4rem;
  border: 1.5px solid #cbd5e1;
  transition: all 0.2s;
}

:deep(.login-form-remember .p-checkbox-checked .p-checkbox-box) {
  background: var(--hope-o-cyan-blue);
  border-color: var(--hope-o-cyan-blue);
}

:deep(.login-form-message.p-message) {
  border-radius: 0.85rem;
  border: none;
  background: #fef2f2;
  color: #991b1b;
  font-size: 0.85rem;
  font-weight: 600;
  margin-top: 1.5rem;
}
</style>
