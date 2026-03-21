<script setup>
import LoginForm from '@/modules/auth/components/LoginForm.vue'
</script>

<template>
  <main class="relative min-h-screen overflow-hidden bg-[var(--hope-background-light)]">
    <div class="pointer-events-none absolute inset-0">
      <div
        class="absolute -top-28 -left-16 h-72 w-72 rounded-full bg-[var(--hope-o-cyan-blue)]/15 blur-3xl"
      ></div>
      <div
        class="absolute top-20 -right-10 h-72 w-72 rounded-full bg-[var(--hope-h-lime-green)]/20 blur-3xl"
      ></div>
      <div
        class="absolute bottom-0 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-[var(--hope-e-golden-yellow)]/15 blur-3xl"
      ></div>
    </div>

    <section
      class="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl items-center justify-center px-4 py-10 sm:px-6"
    >
      <div
        class="grid w-full overflow-hidden rounded-3xl border border-white/70 bg-white/80 shadow-2xl backdrop-blur md:grid-cols-[1.05fr_0.95fr]"
      >
        <div
          class="hidden bg-[linear-gradient(165deg,#00aeef_0%,#0091cf_50%,#0070a8_100%)] p-10 text-white md:flex md:flex-col md:justify-between"
        >
          <div class="space-y-4">
            <img
              src="@/assets/images/logo.jpg"
              alt="HFCCF"
              class="h-14 w-auto rounded-md bg-white px-2 py-1"
            />
            <h1 class="text-3xl font-extrabold tracking-tight">Welcome Back</h1>
            <p class="max-w-sm text-sm text-white/90">
              Sign in to continue managing care programs, reports, and community support
              activities.
            </p>
          </div>

          <ul class="space-y-3 text-sm text-white/90">
            <li>Secure session management</li>
            <li>Access role-based tools quickly</li>
            <li>Track operations in one dashboard</li>
          </ul>
        </div>

        <div class="p-6 sm:p-8 md:p-10">
          <LoginForm />
        </div>
      </div>
    </section>
  </main>
</template>



