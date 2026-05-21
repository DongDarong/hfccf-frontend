<script setup>
import Button from 'primevue/button'
import Card from 'primevue/card'
import InputText from 'primevue/inputtext'
import Message from 'primevue/message'
import Password from 'primevue/password'
import AuthLayout from '@/layouts/AuthLayout.vue'
import { useGuardianPortalAuth } from '@/modules/guardian-portal/composables/useGuardianPortalAuth'

const {
  t,
  form,
  loading,
  errorMessage,
  successMessage,
  isFormValid,
  activateInvitation,
} = useGuardianPortalAuth()
</script>

<template>
  <AuthLayout>
    <main class="mx-auto flex min-h-screen w-full max-w-3xl items-center px-4 py-8">
      <Card class="w-full border-slate-200 shadow-sm">
        <template #content>
          <div class="grid gap-4">
            <div class="grid gap-1">
              <p class="text-xs font-black uppercase tracking-[0.24em] text-sky-700">
                {{ t('guardianPortal.activation.eyebrow') }}
              </p>
              <h1 class="text-2xl font-black text-slate-950">
                {{ t('guardianPortal.activation.title') }}
              </h1>
              <p class="text-sm text-slate-500">
                {{ t('guardianPortal.activation.subtitle') }}
              </p>
            </div>

            <div class="grid gap-3">
              <label class="grid gap-2">
                <span class="text-sm font-bold text-slate-700">{{ t('guardianPortal.activation.tokenLabel') }}</span>
                <InputText v-model="form.token" :placeholder="t('guardianPortal.activation.tokenPlaceholder')" />
              </label>

              <label class="grid gap-2">
                <span class="text-sm font-bold text-slate-700">{{ t('guardianPortal.activation.passwordLabel') }}</span>
                <Password
                  v-model="form.password"
                  :placeholder="t('guardianPortal.activation.passwordPlaceholder')"
                  :feedback="false"
                  toggle-mask
                  fluid
                />
              </label>

              <label class="grid gap-2">
                <span class="text-sm font-bold text-slate-700">{{ t('guardianPortal.activation.confirmLabel') }}</span>
                <Password
                  v-model="form.passwordConfirmation"
                  :placeholder="t('guardianPortal.activation.confirmPlaceholder')"
                  :feedback="false"
                  toggle-mask
                  fluid
                />
              </label>
            </div>

            <Message v-if="errorMessage" severity="error" :closable="false">
              {{ errorMessage }}
            </Message>

            <Message v-if="successMessage" severity="success" :closable="false">
              {{ successMessage }}
            </Message>

            <Button
              :label="t('guardianPortal.activation.submit')"
              :loading="loading"
              :disabled="!isFormValid"
              @click="activateInvitation"
            />
          </div>
        </template>
      </Card>
    </main>
  </AuthLayout>
</template>
