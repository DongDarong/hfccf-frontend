<script setup>
// Keep guardian master data on a dedicated admin page so reusable contacts can
// be created once and then linked to multiple students without duplicating UI.
import { computed, onMounted, ref, watch } from 'vue'
import Dialog from 'primevue/dialog'
import MainLayout from '@/layouts/MainLayout.vue'
import HeaderSection from '@/components/navigation/HeaderSection.vue'
import Button from '@/components/buttons/Button.vue'
import Pagination from '@/components/data-display/Pagination.vue'
import AlertQuestion from '@/components/alerts/AlertQuestion.vue'
import AlertSuccess from '@/components/alerts/AlertSuccess.vue'
import { useLanguage } from '@/composables/useLanguage'
import {
  usePreschoolGuardians,
} from '@/modules/preschool/composables/usePreschoolGuardians'
import GuardianForm from '@/modules/preschool/shared/components/guardian/GuardianForm.vue'
import GuardianList from '@/modules/preschool/shared/components/guardian/GuardianList.vue'

defineOptions({
  name: 'PreschoolGuardianManagementPage',
})

const { t } = useLanguage()
const {
  archiveSelectedGuardian,
  closeGuardianDialog,
  currentPage,
  dialogMode,
  dialogOpen,
  errorMessage,
  guardianForm,
  guardians,
  loadGuardians,
  loading,
  openCreateGuardian,
  openEditGuardian,
  pagination,
  saveGuardian,
  saving,
  searchQuery,
  selectedGuardian,
  selectedStatus,
  setCurrentPage,
} = usePreschoolGuardians()

const archiveOpen = ref(false)
const archiveMessage = computed(() =>
  t('preschoolGuardiansPage.alerts.archiveMessage', {
    name: selectedGuardian.value?.fullName || t('preschoolGuardiansPage.alerts.archiveFallback'),
  }),
)
const successOpen = ref(false)
const successMessage = ref('')

async function handleSave() {
  const guardian = await saveGuardian()
  successMessage.value = dialogMode.value === 'edit'
    ? t('preschoolGuardiansPage.messages.updatedSuccess', { name: guardian.fullName || guardian.phone || '-' })
    : t('preschoolGuardiansPage.messages.createdSuccess', { name: guardian.fullName || guardian.phone || '-' })
  successOpen.value = true
}

function handleArchiveRequest(guardian) {
  selectedGuardian.value = guardian || null
  archiveOpen.value = true
}

async function confirmArchive() {
  await archiveSelectedGuardian(selectedGuardian.value?.id)
  successMessage.value = t('preschoolGuardiansPage.messages.archivedSuccess')
  successOpen.value = true
  archiveOpen.value = false
}

watch([searchQuery, selectedStatus], () => {
  setCurrentPage(1)
  loadGuardians()
})

watch(currentPage, () => {
  loadGuardians()
})

onMounted(() => {
  loadGuardians()
})
</script>

<template>
  <MainLayout>
    <section class="preschool-guardian-page">
      <HeaderSection
        :title="t('preschoolGuardiansPage.title')"
        :subtitle="t('preschoolGuardiansPage.subtitle')"
      />

      <div class="preschool-guardian-page__panel">
        <div class="preschool-guardian-page__toolbar">
          <Button type="button" variant="primary" rounded="xl" @click="openCreateGuardian">
            {{ t('preschoolGuardiansPage.actions.addGuardian') }}
          </Button>
        </div>

        <div class="preschool-guardian-page__filters">
          <input
            v-model="searchQuery"
            type="search"
            class="preschool-guardian-page__input"
            :placeholder="t('preschoolGuardiansPage.filters.searchPlaceholder')"
          />
          <select v-model="selectedStatus" class="preschool-guardian-page__input">
            <option value="">{{ t('preschoolGuardiansPage.filters.allStatus') }}</option>
            <option value="active">{{ t('preschoolGuardianShared.statusLabels.active') }}</option>
            <option value="inactive">{{ t('preschoolGuardianShared.statusLabels.inactive') }}</option>
            <option value="archived">{{ t('preschoolGuardianShared.statusLabels.archived') }}</option>
          </select>
        </div>

        <div
          v-if="errorMessage"
          class="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"
        >
          {{ errorMessage }}
        </div>

        <GuardianList
          :guardians="guardians"
          :loading="loading"
          :empty-text="t('preschoolGuardiansPage.empty')"
          @edit="openEditGuardian"
          @archive="handleArchiveRequest"
        />

        <div v-if="pagination.totalPages > 1" class="flex justify-end">
          <Pagination v-model="currentPage" :total-pages="pagination.totalPages" class="mt-2" />
        </div>
      </div>
    </section>

    <Dialog
      v-model:visible="dialogOpen"
      modal
      class="preschool-guardian-page__dialog"
      :header="dialogMode === 'edit' ? t('preschoolGuardiansPage.dialog.editTitle') : t('preschoolGuardiansPage.dialog.createTitle')"
    >
      <GuardianForm :form="guardianForm" :mode="dialogMode" :saving="saving" @save="handleSave" @cancel="closeGuardianDialog" />
    </Dialog>

    <AlertQuestion
      :show="archiveOpen"
      :title="t('preschoolGuardiansPage.alerts.archiveTitle')"
      :message="archiveMessage"
      :confirm-text="t('preschoolGuardiansPage.actions.archive')"
      :cancel-text="t('common.cancel')"
      type="danger"
      @confirm="confirmArchive"
      @cancel="archiveOpen = false"
    />

    <AlertSuccess
      :show="successOpen"
      :title="t('preschoolGuardiansPage.alerts.successTitle')"
      :message="successMessage"
      :button-text="t('preschoolGuardiansPage.alerts.close')"
      @close="successOpen = false"
    />
  </MainLayout>
</template>

<style scoped>
.preschool-guardian-page {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.preschool-guardian-page__panel {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.5rem;
  border-radius: 1.5rem;
  border: 1px solid #dce6f2;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.98) 100%);
  box-shadow: 0 25px 60px -40px rgba(15, 23, 42, 0.5);
}

.preschool-guardian-page__toolbar {
  display: flex;
  justify-content: flex-end;
}

.preschool-guardian-page__filters {
  display: grid;
  grid-template-columns: 1fr 220px;
  gap: 0.75rem;
}

.preschool-guardian-page__input {
  width: 100%;
  min-height: 2.75rem;
  border-radius: 0.85rem;
  border: 1px solid #d5dde8;
  background: #fff;
  padding: 0.7rem 0.85rem;
  color: #0f172a;
}

.preschool-guardian-page__dialog :deep(.p-dialog-content) {
  overflow: visible;
}

@media (max-width: 760px) {
  .preschool-guardian-page__filters {
    grid-template-columns: 1fr;
  }
}
</style>
