<script setup>
import Card from 'primevue/card'
import Divider from 'primevue/divider'
import AuthLayout from '@/layouts/AuthLayout.vue'
import LoginForm from '@/modules/auth/components/LoginForm.vue'
</script>

<template>
  <AuthLayout>
    <main
      class="login-page relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(0,174,239,0.08),transparent_28%),linear-gradient(180deg,#f8fbfd_0%,#eef4f7_100%)] p-4 sm:p-6 lg:p-8"
    >
      <div class="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          class="absolute -top-20 left-[-8%] h-80 w-80 rounded-full bg-[var(--hope-cyan)]/10 blur-[90px]"
        ></div>
        <div
          class="absolute top-16 right-[-8%] h-72 w-72 rounded-full bg-[var(--hope-lime)]/12 blur-[88px]"
        ></div>
        <div
          class="absolute bottom-[-8%] left-[24%] h-96 w-96 rounded-full bg-[var(--hope-yellow)]/8 blur-[110px]"
        ></div>
      </div>

      <div class="relative z-10 mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-6xl items-center">
        <Card
          class="login-card w-full overflow-hidden !border-white/50 !bg-white/78 !shadow-[0_38px_90px_-28px_rgba(15,23,42,0.18)] !backdrop-blur-xl"
        >
          <template #content>
            <div class="grid min-h-[680px] lg:grid-cols-[1.04fr_0.96fr]">
              <div
                class="hero-panel relative hidden overflow-hidden p-12 text-white lg:flex lg:flex-col lg:justify-between"
              >
                <div class="relative z-20 space-y-10">
                  <div class="flex items-center gap-4">
                    <div
                      class="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/95 p-2 shadow-xl"
                    >
                      <img src="@/assets/images/logo.jpg" alt="Logo" class="h-full w-auto" />
                    </div>
                    <div class="space-y-0.5">
                      <p
                        class="text-[0.6rem] font-black uppercase tracking-[0.25em] text-sky-100/70"
                      >
                        Secure Portal
                      </p>
                      <p class="text-sm font-bold tracking-tight">HFCCF Administration</p>
                    </div>
                  </div>

                  <div class="space-y-5">
                    <p
                      class="inline-flex rounded-full border border-white/18 bg-white/10 px-3 py-1 text-[0.68rem] font-bold uppercase tracking-[0.18em] text-sky-50/80"
                    >
                      HFCCF Access
                    </p>
                    <h1 class="max-w-md text-5xl font-black leading-[1.02] tracking-tight">
                      Manage programs with clarity and control.
                    </h1>
                    <p class="max-w-md text-base font-medium leading-7 text-sky-50/80">
                      Access dashboards for operations, education, scholarship, and sport from one
                      secure portal.
                    </p>
                  </div>
                </div>

                <div class="relative z-20 space-y-8">
                  <div class="grid max-w-sm grid-cols-2 gap-4">
                    <div class="space-y-1">
                      <p class="text-2xl font-black">100%</p>
                      <p
                        class="text-[0.65rem] font-bold uppercase tracking-widest text-sky-100/60"
                      >
                        Secure Access
                      </p>
                    </div>
                    <div class="space-y-1">
                      <p class="text-2xl font-black">24/7</p>
                      <p
                        class="text-[0.65rem] font-bold uppercase tracking-widest text-sky-100/60"
                      >
                        Availability
                      </p>
                    </div>
                  </div>

                  <Divider class="!border-white/15" />

                  <ul class="space-y-4">
                    <li
                      v-for="item in ['Unified program management', 'Role-based access control', 'Real-time operational insight']"
                      :key="item"
                      class="flex items-center gap-3 text-sm font-semibold text-sky-50"
                    >
                      <div
                        class="flex h-5 w-5 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-md"
                      >
                        <svg
                          class="h-3 w-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="3"
                            d="M5 13l4 4L19 7"
                          ></path>
                        </svg>
                      </div>
                      {{ item }}
                    </li>
                  </ul>
                </div>

                <div
                  class="absolute -right-20 -bottom-20 h-80 w-80 rounded-full bg-sky-400/18 blur-[60px]"
                ></div>
                <div
                  class="absolute top-1/2 -right-10 h-40 w-40 rounded-full bg-white/10 blur-[40px]"
                ></div>
              </div>

              <div
                class="form-panel relative flex items-center justify-center bg-[linear-gradient(180deg,rgba(255,255,255,0.88)_0%,rgba(248,250,252,0.96)_100%)] p-8 sm:p-10 md:p-14 lg:p-16"
              >
                <LoginForm class="w-full" />
              </div>
            </div>
          </template>
        </Card>
      </div>
    </main>
  </AuthLayout>
</template>

<style scoped>
.login-card {
  border-radius: 2rem;
}

:deep(.login-card .p-card-body),
:deep(.login-card .p-card-content) {
  padding: 0;
}

.hero-panel {
  background:
    radial-gradient(circle at top left, rgba(255, 255, 255, 0.16), transparent 32%),
    radial-gradient(circle at 82% 18%, rgba(186, 230, 253, 0.18), transparent 24%),
    linear-gradient(160deg, #00aeef 0%, #008dca 48%, #05638d 100%);
  box-shadow: inset -1px 0 0 rgba(255, 255, 255, 0.1);
}

.hero-panel::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: radial-gradient(circle at 2px 2px, rgba(255, 255, 255, 0.1) 1px, transparent 0);
  background-size: 24px 24px;
  pointer-events: none;
}

.form-panel::before {
  content: '';
  position: absolute;
  inset: 1.5rem auto 1.5rem 0;
  width: 1px;
  background: linear-gradient(
    180deg,
    transparent 0%,
    rgba(148, 163, 184, 0.22) 16%,
    rgba(148, 163, 184, 0.22) 84%,
    transparent 100%
  );
}

@media (max-width: 1023px) {
  .login-card {
    border-radius: 1.5rem;
  }
  .form-panel {
    background: transparent;
  }
  .form-panel::before {
    display: none;
  }
}
</style>
