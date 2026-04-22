<script setup>
import AuthLayout from '@/layouts/AuthLayout.vue'
import LoginForm from '@/modules/auth/components/LoginForm.vue'
</script>

<template>
  <AuthLayout>
    <main
      class="login-page relative flex min-h-screen items-center overflow-hidden px-4 py-5 sm:px-6 sm:py-8 lg:px-8"
    >
      <section class="login-page-shell relative z-10 mx-auto grid w-full max-w-6xl overflow-hidden lg:grid-cols-[0.95fr_1.05fr]">
        <div class="login-page-brand hidden min-h-[660px] flex-col justify-between lg:flex">
          <div>
            <div class="flex items-center gap-4">
              <div class="login-page-logo">
                <img src="@/assets/images/logo.jpg" alt="HFCCF" class="h-12 w-auto" />
              </div>
              <div class="space-y-1">
                <p class="text-xs font-black uppercase text-sky-900">HFCCF Portal</p>
                <p class="max-w-[14rem] text-sm leading-6 text-slate-600">
                  Secure access for staff, teachers, and administrators.
                </p>
              </div>
            </div>

            <div class="mt-14 space-y-5">
              <p class="login-page-eyebrow">Welcome back</p>
              <p class="max-w-sm text-[2.75rem] leading-[1.02] font-black text-slate-950">
                One sign-in for your daily HFCCF work.
              </p>
              <p class="max-w-md text-base leading-8 text-slate-600">
                Continue to your role dashboard, manage users, and handle day-to-day tasks
                from a single protected workspace.
              </p>
            </div>
          </div>

          <div class="grid gap-3">
            <div class="login-page-metric-grid grid grid-cols-2 gap-3">
              <div class="login-page-metric">
                <span class="pi pi-clock text-sky-600" aria-hidden="true"></span>
                <div>
                  <p class="text-xl font-black text-slate-950">24/7</p>
                  <p class="text-xs font-bold uppercase text-slate-500">Access window</p>
                </div>
              </div>
              <div class="login-page-metric">
                <span class="pi pi-check-circle text-lime-600" aria-hidden="true"></span>
                <div>
                  <p class="text-xl font-black text-slate-950">5+</p>
                  <p class="text-xs font-bold uppercase text-slate-500">Program areas</p>
                </div>
              </div>
            </div>

            <ul class="login-page-checklist grid gap-3 text-sm text-slate-600">
              <li class="flex items-center gap-3">
                <i class="pi pi-shield text-sky-600" aria-hidden="true"></i>
                Role-based access for each team
              </li>
              <li class="flex items-center gap-3">
                <i class="pi pi-lock text-sky-600" aria-hidden="true"></i>
                Secure session management
              </li>
              <li class="flex items-center gap-3">
                <i class="pi pi-chart-line text-sky-600" aria-hidden="true"></i>
                Faster access to daily dashboards
              </li>
            </ul>
          </div>
        </div>

        <div class="login-page-form-panel">
          <div class="login-page-form-shell mx-auto w-full max-w-xl">
            <div class="mb-7 flex items-start justify-between gap-4 lg:hidden">
              <div class="flex min-w-0 items-center gap-3">
                <div class="login-page-logo login-page-logo--compact">
                  <img src="@/assets/images/logo.jpg" alt="HFCCF" class="h-9 w-auto" />
                </div>
                <div class="min-w-0">
                  <p class="text-xs font-black uppercase text-sky-800">HFCCF Portal</p>
                  <p class="text-xs leading-5 text-slate-500 sm:text-sm">
                    Secure access for staff and administrators
                  </p>
                </div>
              </div>
              <div class="login-page-status hidden items-center gap-2 sm:inline-flex">
                <i class="pi pi-lock" aria-hidden="true"></i>
                Protected
              </div>
            </div>

            <div class="mb-6 px-1">
              <p class="login-page-eyebrow">Staff Sign In</p>
              <h1 class="mt-3 text-[1.65rem] leading-tight font-black text-slate-950 sm:text-[2rem] lg:text-[2.15rem]">
                Continue to your dashboard
              </h1>
              <p class="mt-3 max-w-lg text-sm leading-6 text-slate-600 sm:text-[0.95rem]">
                Use your HFCCF email, password, and assigned role to continue securely.
              </p>
            </div>

            <LoginForm />
          </div>
        </div>
      </section>
    </main>
  </AuthLayout>
</template>

<style scoped>
.login-page {
  background:
    linear-gradient(135deg, rgba(0, 174, 239, 0.08) 0 18%, transparent 18% 100%),
    linear-gradient(315deg, rgba(253, 193, 22, 0.12) 0 14%, transparent 14% 100%),
    linear-gradient(180deg, #f8fcff 0%, #eef6fb 100%);
}

.login-page::before {
  position: absolute;
  inset: 0;
  pointer-events: none;
  content: '';
  background-image:
    linear-gradient(rgba(14, 165, 233, 0.07) 1px, transparent 1px),
    linear-gradient(90deg, rgba(14, 165, 233, 0.07) 1px, transparent 1px);
  background-size: 38px 38px;
  mask-image: linear-gradient(180deg, rgba(0, 0, 0, 0.68), transparent 78%);
}

.login-page-shell {
  border: 1px solid rgba(203, 213, 225, 0.82);
  border-radius: 2rem;
  background: rgba(255, 255, 255, 0.84);
  color: #0f172a;
  box-shadow: 0 30px 70px -42px rgba(15, 23, 42, 0.36);
  backdrop-filter: blur(16px);
}

.login-page-shell::before {
  position: absolute;
  inset: 0 auto 0 0;
  width: 0.35rem;
  content: '';
  background: linear-gradient(180deg, var(--hope-o-cyan-blue), var(--hope-h-lime-green), var(--hope-e-golden-yellow));
}

.login-page-brand {
  position: relative;
  padding: 2rem 1.75rem 2rem 2rem;
  background:
    linear-gradient(160deg, rgba(255, 255, 255, 0.88), rgba(236, 251, 255, 0.78)),
    repeating-linear-gradient(135deg, rgba(0, 174, 239, 0.08) 0 1px, transparent 1px 14px);
}

.login-page-logo {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 4.35rem;
  min-height: 4rem;
  border: 1px solid rgba(226, 232, 240, 0.9);
  border-radius: 1.15rem;
  background: #ffffff;
  box-shadow: 0 16px 30px -24px rgba(15, 23, 42, 0.3);
}

.login-page-logo--compact {
  min-width: 3.4rem;
  min-height: 3.2rem;
  border-radius: 1rem;
  box-shadow: 0 10px 22px -18px rgba(15, 23, 42, 0.32);
}

.login-page-eyebrow {
  display: inline-flex;
  align-items: center;
  border: 1px solid rgba(14, 165, 233, 0.2);
  border-radius: 999px;
  background: rgba(240, 249, 255, 0.92);
  padding: 0.28rem 0.75rem;
  color: #0369a1;
  font-size: 0.68rem;
  font-weight: 900;
  text-transform: uppercase;
}

.login-page-form-panel {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 660px;
  padding: 2.5rem;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.96), rgba(248, 250, 252, 0.92)),
    linear-gradient(90deg, rgba(141, 198, 63, 0.08), transparent 42%);
}

.login-page-form-shell {
  padding: 1.35rem;
}

.login-page-metric,
.login-page-checklist {
  border: 1px solid rgba(226, 232, 240, 0.82);
  border-radius: 1rem;
  background: rgba(255, 255, 255, 0.76);
}

.login-page-metric {
  display: flex;
  min-height: 5.25rem;
  align-items: center;
  gap: 0.85rem;
  padding: 1rem;
}

.login-page-metric .pi {
  display: inline-grid;
  height: 2.45rem;
  width: 2.45rem;
  flex: 0 0 auto;
  place-items: center;
  border-radius: 999px;
  background: #f8fafc;
}

.login-page-checklist {
  padding: 1rem;
}

.login-page-checklist .pi {
  display: inline-grid;
  height: 2rem;
  width: 2rem;
  flex: 0 0 auto;
  place-items: center;
  border-radius: 999px;
  background: rgba(14, 165, 233, 0.09);
}

.login-page-status {
  border: 1px solid rgba(203, 213, 225, 0.86);
  border-radius: 999px;
  background: #ffffff;
  padding: 0.35rem 0.7rem;
  color: #475569;
  font-size: 0.68rem;
  font-weight: 900;
  text-transform: uppercase;
}

@media (max-width: 1023px) {
  .login-page-shell {
    border-radius: 1.5rem;
  }

  .login-page-form-panel {
    min-height: auto;
    padding: 1.75rem;
  }

  .login-page-form-shell {
    padding: 0.5rem;
  }
}

@media (max-width: 639px) {
  .login-page {
    align-items: flex-start;
    padding: 0.85rem;
  }

  .login-page-shell {
    border-radius: 1.2rem;
    box-shadow: 0 18px 40px -30px rgba(15, 23, 42, 0.35);
  }

  .login-page-shell::before {
    width: 100%;
    height: 0.28rem;
  }

  .login-page-form-panel {
    padding: 1.1rem 0.95rem;
  }

  .login-page-form-shell {
    padding: 0.2rem;
  }
}

@media (max-width: 420px) {
  .login-page-form-panel {
    padding: 0.95rem 0.8rem;
  }

  .login-page-logo--compact {
    min-width: 3rem;
    min-height: 2.9rem;
  }
}
</style>
