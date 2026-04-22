<script setup>
import Card from 'primevue/card'
import AuthLayout from '@/layouts/AuthLayout.vue'
import LoginForm from '@/modules/auth/components/LoginForm.vue'
</script>

<template>
  <AuthLayout>
    <main
      class="login-page relative flex min-h-screen items-center overflow-hidden px-3 py-4 sm:px-6 sm:py-8 lg:px-8"
    >
      <div class="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          class="absolute -top-24 -left-12 h-56 w-56 rounded-full bg-[var(--hope-o-cyan-blue)]/10"
        ></div>
        <div
          class="absolute top-16 -right-8 h-48 w-48 rounded-full bg-[var(--hope-h-lime-green)]/10"
        ></div>
        <div
          class="absolute inset-x-[8%] top-[14%] h-px bg-[linear-gradient(90deg,transparent,rgba(148,163,184,0.2),transparent)]"
        ></div>
      </div>

      <section class="relative z-10 mx-auto flex w-full max-w-6xl items-center justify-center">
        <Card class="login-page-card w-full overflow-hidden border border-white/80 shadow-2xl">
          <template #content>
            <div class="min-h-[620px] lg:min-h-[680px]">
              <div class="login-page-form-panel p-3 sm:p-6 md:p-8 lg:p-10">
                <div class="login-page-form-shell mx-auto w-full max-w-xl">
                  <div class="mb-5 flex items-center gap-3 lg:hidden">
                    <div class="rounded-2xl bg-white px-2.5 py-2 shadow-sm ring-1 ring-slate-200/70">
                      <img src="@/assets/images/logo.jpg" alt="HFCCF" class="h-8 w-auto sm:h-9" />
                    </div>
                    <div class="min-w-0">
                      <p class="text-xs font-bold uppercase tracking-[0.18em] text-sky-700">
                        HFCCF Portal
                      </p>
                      <p class="text-xs leading-5 text-slate-500 sm:text-sm">
                        Secure access for staff and administrators
                      </p>
                    </div>
                  </div>

                  <LoginForm />
                </div>
              </div>
            </div>
          </template>
        </Card>
      </section>
    </main>
  </AuthLayout>
</template>

<style scoped>
.login-page {
  background:
    radial-gradient(circle at top left, rgba(0, 174, 239, 0.12), transparent 28%),
    radial-gradient(circle at right 14%, rgba(141, 198, 63, 0.1), transparent 24%),
    linear-gradient(180deg, #f4fbff 0%, #eef7fb 48%, #e7f1f8 100%);
}

:deep(.login-page-card.p-card) {
  border-radius: 2rem;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.98) 0%, rgba(248, 250, 252, 0.98) 100%);
  color: #0f172a;
  box-shadow: 0 20px 48px -28px rgba(15, 23, 42, 0.2);
}

:deep(.login-page-card .p-card-body) {
  padding: 0;
  background: #ffffff;
}

:deep(.login-page-card .p-card-content) {
  padding: 0;
  background: #ffffff;
}

.login-page-form-panel {
  display: flex;
  align-items: center;
  justify-content: center;
  background:
    radial-gradient(circle at top right, rgba(0, 174, 239, 0.08), transparent 32%),
    linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
}

.login-page-form-shell {
  border-radius: 1.75rem;
  border: 1px solid rgba(226, 232, 240, 0.8);
  background: #ffffff;
  padding: 1.5rem;
  box-shadow: 0 12px 32px -28px rgba(15, 23, 42, 0.16);
}

@media (max-width: 1023px) {
  :deep(.login-page-card.p-card) {
    border-radius: 1.5rem;
  }

  .login-page-form-shell {
    border-radius: 1.35rem;
    padding: 1.25rem;
  }
}

@media (max-width: 639px) {
  .login-page::before {
    content: '';
    position: absolute;
    inset: auto 0 0 0;
    height: 40%;
    background: linear-gradient(180deg, rgba(244, 251, 255, 0), rgba(244, 251, 255, 0.78));
    pointer-events: none;
  }

  :deep(.login-page-card.p-card) {
    border-radius: 1.2rem;
    box-shadow: 0 14px 32px -24px rgba(15, 23, 42, 0.18);
  }

  .login-page-form-panel {
    padding: 0.75rem;
    background:
      radial-gradient(circle at top right, rgba(0, 174, 239, 0.06), transparent 28%),
      linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
  }

  .login-page-form-shell {
    border-radius: 1.15rem;
    padding: 1rem 0.95rem;
    box-shadow: 0 10px 24px -20px rgba(15, 23, 42, 0.14);
  }
}

@media (max-width: 420px) {
  .login-page {
    padding-left: 0.75rem;
    padding-right: 0.75rem;
    padding-top: 0.75rem;
    padding-bottom: 0.75rem;
  }

  .login-page-form-shell {
    padding: 0.9rem 0.85rem;
  }
}
</style>
