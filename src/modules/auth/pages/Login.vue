<script setup>
import Card from 'primevue/card'
import Divider from 'primevue/divider'
import Tag from 'primevue/tag'
import AuthLayout from '@/layouts/AuthLayout.vue'
import LoginForm from '@/modules/auth/components/LoginForm.vue'
</script>

<template>
  <AuthLayout>
    <main class="relative overflow-hidden">
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

      <section class="relative z-10 mx-auto flex w-full max-w-6xl items-center justify-center">
        <Card class="login-page-card w-full overflow-hidden border border-white/70 shadow-2xl">
          <template #content>
            <div class="grid md:grid-cols-[1.05fr_0.95fr]">
              <div
                class="hidden bg-[linear-gradient(165deg,#00aeef_0%,#0091cf_50%,#0070a8_100%)] p-10 text-white md:flex md:flex-col md:justify-between"
              >
                <div class="space-y-4">
                  <img
                    src="@/assets/images/logo.jpg"
                    alt="HFCCF"
                    class="h-14 w-auto rounded-md bg-white px-2 py-1"
                  />
                  <Tag value="HFCCF Portal" severity="contrast" rounded />
                  <h1 class="text-3xl font-extrabold tracking-tight">Welcome Back</h1>
                  <p class="max-w-sm text-sm text-white/90">
                    Sign in to continue managing care programs, reports, and community support
                    activities.
                  </p>
                </div>

                <div class="space-y-5">
                  <Divider class="login-page-divider !border-white/20" />
                  <ul class="space-y-3 text-sm text-white/90">
                    <li>Secure session management</li>
                    <li>Access role-based tools quickly</li>
                    <li>Track operations in one dashboard</li>
                  </ul>
                </div>
              </div>

              <div class="p-6 sm:p-8 md:p-10">
                <LoginForm />
              </div>
            </div>
          </template>
        </Card>
      </section>
    </main>
  </AuthLayout>
</template>

<style scoped>
:deep(.login-page-card.p-card) {
  border-radius: 1.75rem;
  background: rgba(255, 255, 255, 0.82);
  backdrop-filter: blur(18px);
}

:deep(.login-page-card .p-card-body) {
  padding: 0;
}

:deep(.login-page-card .p-card-content) {
  padding: 0;
}
</style>
