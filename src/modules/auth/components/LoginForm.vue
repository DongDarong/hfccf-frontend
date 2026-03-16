<script setup>
import { reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Button from '@/components/Button.vue'
import AlertSuccess from '@/components/AlertSuccess.vue'
import Loading from '@/components/Loading.vue'
import ShowPassword from '@/assets/icons/ShowPassword.vue'
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
const isPasswordVisible = ref(false)
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

function togglePasswordVisibility() {
  isPasswordVisible.value = !isPasswordVisible.value
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

    <header class="mb-8">
      <h2 class="text-2xl font-bold text-slate-900">Login</h2>
      <p class="mt-1 text-sm text-slate-600">Enter your credentials to access your account.</p>
    </header>

    <form class="space-y-5" @submit.prevent="onSubmit">
      <div class="space-y-1.5">
        <label for="email" class="text-sm font-semibold text-slate-700">Email</label>
        <input
          id="email"
          v-model="form.email"
          type="email"
          autocomplete="email"
          class="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-200"
          placeholder="name@hfccf.org"
        />
      </div>

      <div class="space-y-1.5">
        <label for="password" class="text-sm font-semibold text-slate-700">Password</label>
        <div class="relative">
          <input
            id="password"
            v-model="form.password"
            :type="isPasswordVisible ? 'text' : 'password'"
            autocomplete="current-password"
            class="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 pr-12 text-sm outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-200"
            placeholder="Enter your password"
          />
          <button
            type="button"
            class="absolute inset-y-0 right-0 inline-flex w-11 items-center justify-center text-slate-500 transition hover:text-slate-700"
            :aria-label="isPasswordVisible ? 'Hide password' : 'Show password'"
            :title="isPasswordVisible ? 'Hide password' : 'Show password'"
            @click="togglePasswordVisibility"
          >
            <ShowPassword :visible="isPasswordVisible" :size="18" />
          </button>
        </div>
      </div>

      <div class="flex items-center justify-between gap-3 text-sm">
        <label class="inline-flex items-center gap-2 text-slate-600">
          <input
            v-model="form.remember"
            type="checkbox"
            class="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-300"
          />
          Remember me
        </label>

        <RouterLink
          :to="{ name: 'forgot-password' }"
          class="font-semibold text-sky-700 transition hover:text-sky-800"
        >
          Forgot password?
        </RouterLink>
      </div>

      <p
        v-if="errorMessage"
        class="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
      >
        {{ errorMessage }}
      </p>

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



