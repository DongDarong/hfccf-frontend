<script setup>
// Keep the invite flow dedicated to portal access so Preschool admins can
// issue activation tokens without editing the guardian master record screen.
import { computed, reactive } from 'vue'
import Message from 'primevue/message'
import { useRoute, useRouter } from 'vue-router'
import MainLayout from '@/layouts/MainLayout.vue'
import HeaderSection from '@/components/navigation/HeaderSection.vue'
import Button from '@/components/buttons/Button.vue'
import { useLanguage } from '@/composables/useLanguage'
import { useGuardianPortalAdmin } from '@/modules/guardian-portal/composables/useGuardianPortalAdmin'
import GuardianPortalInviteForm from '@/modules/guardian-portal/components/GuardianPortalInviteForm.vue'

defineOptions({
  name: 'PreschoolInviteGuardianPortalPage',
})

const route = useRoute()
const router = useRouter()
const { t } = useLanguage()
const { loading, errorMessage, actionMessage, invite } = useGuardianPortalAdmin()

const form = reactive({
  guardianId: String(route.params.guardianId || route.query.guardianId || '').trim(),
  email: '',
})

const guardianId = computed(() => String(form.guardianId || '').trim())

async function handleInvite() {
  await invite(guardianId.value, form)
}

</script>

<template>
  <MainLayout>
    <section class="preschool-guardian-portal-page">
      <HeaderSection
        :title="t('guardianPortal.admin.inviteTitle')"
        :subtitle="t('guardianPortal.admin.inviteSubtitle')"
      />

      <div class="preschool-guardian-portal-page__toolbar">
        <Button type="button" variant="outline" rounded="xl" @click="router.push({ name: 'dashboard-preschool-admin-guardian-portal-accounts' })">
          {{ t('guardianPortal.admin.accountsTitle') }}
        </Button>
      </div>

      <Message v-if="errorMessage" severity="error" :closable="false">
        {{ errorMessage }}
      </Message>
      <Message v-if="actionMessage" severity="success" :closable="false">
        {{ actionMessage }}
      </Message>

      <div class="grid gap-3">
        <p class="text-sm text-slate-600">
          {{ t('guardianPortal.admin.inviteHint') }}
        </p>
        <GuardianPortalInviteForm
          v-model="form"
          :loading="loading"
          :error-message="errorMessage"
          @submit="handleInvite"
        />
      </div>
    </section>
  </MainLayout>
</template>

<style scoped>
.preschool-guardian-portal-page {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.preschool-guardian-portal-page__toolbar {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 0.75rem;
}
</style>
