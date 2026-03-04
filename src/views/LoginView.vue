<script setup>
import { reactive, ref } from 'vue'
import Button from '@/components/ui/Button.vue'

const form = reactive({
  email: '',
  password: '',
  remember: false,
})

const isSubmitting = ref(false)
const errorMessage = ref('')

function onSubmit() {
  errorMessage.value = ''

  if (!form.email || !form.password) {
    errorMessage.value = 'Please enter both email and password.'
    return
  }

  isSubmitting.value = true

  // Placeholder submit flow until API auth is connected.
  setTimeout(() => {
    isSubmitting.value = false
    errorMessage.value = 'Login endpoint is not connected yet.'
  }, 900)
}
</script>

<template>
  <main class="relative min-h-screen overflow-hidden bg-[var(--hope-background-light)]">
    <div class="absolute inset-0 pointer-events-none">
      <div class="absolute -top-28 -left-16 h-72 w-72 rounded-full bg-[var(--hope-o-cyan-blue)]/15 blur-3xl"></div>
      <div class="absolute top-20 -right-10 h-72 w-72 rounded-full bg-[var(--hope-h-lime-green)]/20 blur-3xl"></div>
      <div class="absolute bottom-0 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-[var(--hope-e-golden-yellow)]/15 blur-3xl"></div>
    </div>

    <section class="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl items-center justify-center px-4 py-10 sm:px-6">
      <div class="grid w-full overflow-hidden rounded-3xl border border-white/70 bg-white/80 shadow-2xl backdrop-blur md:grid-cols-[1.05fr_0.95fr]">
        <div class="hidden bg-[linear-gradient(165deg,#00aeef_0%,#0091cf_50%,#0070a8_100%)] p-10 text-white md:flex md:flex-col md:justify-between">
          <div class="space-y-4">
            <img src="@/assets/images/logo.jpg" alt="HFCCF" class="h-14 w-auto rounded-md bg-white px-2 py-1" />
            <h1 class="text-3xl font-extrabold tracking-tight">Welcome Back</h1>
            <p class="max-w-sm text-sm text-white/90">
              Sign in to continue managing care programs, reports, and community support activities.
            </p>
          </div>

          <ul class="space-y-3 text-sm text-white/90">
            <li>Secure session management</li>
            <li>Access role-based tools quickly</li>
            <li>Track operations in one dashboard</li>
          </ul>
        </div>

        <div class="p-6 sm:p-8 md:p-10">
          <div class="mx-auto w-full max-w-md">
            <div class="mb-6 flex items-center gap-3 md:hidden">
              <img src="@/assets/images/logo.jpg" alt="HFCCF" class="h-9 w-auto" />
              <span class="text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">HFCCF Portal</span>
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
                <input
                  id="password"
                  v-model="form.password"
                  type="password"
                  autocomplete="current-password"
                  class="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-200"
                  placeholder="Enter your password"
                />
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

                <a href="#" class="font-semibold text-sky-700 hover:text-sky-800">Forgot password?</a>
              </div>

              <p v-if="errorMessage" class="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {{ errorMessage }}
              </p>

              <Button type="submit" variant="primary" size="md" rounded="xl" block :loading="isSubmitting">
                Sign in
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>
