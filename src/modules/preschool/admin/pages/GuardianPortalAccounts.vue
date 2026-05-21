<script setup>
// Keep portal account administration separate from guardian data so Preschool
// admins can review invitations and revocations without touching the data model.
import { onMounted } from 'vue'
import Message from 'primevue/message'
import { useRouter } from 'vue-router'
import MainLayout from '@/layouts/MainLayout.vue'
import HeaderSection from '@/components/navigation/HeaderSection.vue'
import Button from '@/components/buttons/Button.vue'
import { useLanguage } from '@/composables/useLanguage'
import { useGuardianPortalAdmin } from '@/modules/guardian-portal/composables/useGuardianPortalAdmin'
import GuardianPortalAccessList from '@/modules/guardian-portal/components/GuardianPortalAccessList.vue'

defineOptions({
  name: 'PreschoolGuardianPortalAccountsPage',
})

const { t } = useLanguage()
const router = useRouter()
const { items, loading, errorMessage, actionMessage, loadAccounts, revoke } = useGuardianPortalAdmin()

async function handleRefresh() {
  await loadAccounts()
}

async function requestRevoke(item) {
  await revoke(item?.id)
}

onMounted(handleRefresh)
</script>

<template>
  <MainLayout>
    <section class="preschool-guardian-portal-page">
      <HeaderSection
        :title="t('guardianPortal.admin.accountsTitle')"
        :subtitle="t('guardianPortal.admin.accountsSubtitle')"
      />

      <div class="preschool-guardian-portal-page__toolbar">
        <Button type="button" variant="primary" rounded="xl" @click="router.push({ name: 'dashboard-preschool-admin-guardian-portal-invite' })">
          {{ t('guardianPortal.admin.inviteAction') }}
        </Button>
        <Button type="button" variant="outline" rounded="xl" :loading="loading" @click="handleRefresh">
          {{ t('guardianPortal.common.refresh') }}
        </Button>
      </div>

      <Message v-if="errorMessage" severity="error" :closable="false">
        {{ errorMessage }}
      </Message>
      <Message v-if="actionMessage" severity="success" :closable="false">
        {{ actionMessage }}
      </Message>

      <GuardianPortalAccessList
        :items="items"
        :loading="loading"
        :revoke-label="t('guardianPortal.admin.revokeAction')"
        :empty-text="t('guardianPortal.admin.emptyAccounts')"
        @revoke="requestRevoke"
      />
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
