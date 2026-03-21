<script setup>
import { reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Card from 'primevue/card'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Checkbox from 'primevue/checkbox'
import Message from 'primevue/message'
import Button from '@/components/Button.vue'
import AlertSuccess from '@/components/AlertSuccess.vue'
import Loading from '@/components/Loading.vue'
import { login } from '@/modules/auth/services/authService'

const router = useRouter()
const route = useRoute()

const form = reactive({
  email: '',
  password: '',
  remember: false,
})

const isSubmitting = ref(false)
const errorMessage = ref('')
const showLoginSuccess = ref(false)
const shouldRedirectAfterSuccess = ref(false)

async function onSubmit() {
  errorMessage.value = ''
  isSubmitting.value = true

  try {
    await login({
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
    <div class="mb-6 flex items-center gap-3 md:hidden">
      <img src="@/assets/images/logo.jpg" alt="HFCCF" class="h-9 w-auto" />
      <span class="text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">
        HFCCF Portal
      </span>
    </div>

    <Card class="login-form-card border-0 shadow-none">
      <template #content>
        <header class="mb-8">
          <h2 class="text-2xl font-bold text-slate-900">Login</h2>
          <p class="mt-1 text-sm text-slate-600">Enter your credentials to access your account.</p>
        </header>

        <form class="space-y-5" @submit.prevent="onSubmit">
          <div class="space-y-1.5">
            <label for="email" class="text-sm font-semibold text-slate-700">Email</label>
            <InputText
              id="email"
              v-model="form.email"
              type="email"
              autocomplete="email"
              class="w-full"
              placeholder="name@hfccf.org"
            />
          </div>

          <div class="space-y-1.5">
            <label for="password" class="text-sm font-semibold text-slate-700">Password</label>
            <Password
              id="password"
              v-model="form.password"
              input-class="w-full"
              class="w-full login-form-password"
              autocomplete="current-password"
              placeholder="Enter your password"
              :feedback="false"
              toggle-mask
              fluid
            />
          </div>

          <div class="flex items-center justify-between gap-3 text-sm">
            <label class="inline-flex items-center gap-2 text-slate-600">
              <Checkbox v-model="form.remember" binary input-id="rememberMe" />
              <span>Remember me</span>
            </label>

            <RouterLink
              :to="{ name: 'forgot-password' }"
              class="font-semibold text-sky-700 transition hover:text-sky-800"
            >
              Forgot password?
            </RouterLink>
          </div>

          <Message v-if="errorMessage" severity="error" :closable="false">
            {{ errorMessage }}
          </Message>

          <Loading v-if="isSubmitting" label="Signing in..." size="sm" />

          <Button type="submit" variant="primary" size="md" rounded="xl" block :loading="isSubmitting">
            Sign in
          </Button>

          <p class="text-sm text-slate-600">
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

:deep(.login-form-card .p-inputtext),
:deep(.login-form-card .p-password-input) {
  width: 100%;
  border-radius: 0.9rem;
  border-color: #e2e8f0;
  background: #fff;
  padding: 0.85rem 1rem;
}

:deep(.login-form-card .p-inputtext:enabled:focus),
:deep(.login-form-card .p-password-input:enabled:focus) {
  border-color: #38bdf8;
  box-shadow: 0 0 0 3px rgba(125, 211, 252, 0.35);
}

:deep(.login-form-password .p-password) {
  width: 100%;
}
</style>
