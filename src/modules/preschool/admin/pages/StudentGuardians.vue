<script setup>
// Keep student guardian history on one page so admins can manage the reusable
// contact relationship separately from the guardian master data.
import { computed, onMounted, ref, watch } from 'vue'
import Dialog from 'primevue/dialog'
import MainLayout from '@/layouts/MainLayout.vue'
import HeaderSection from '@/components/navigation/HeaderSection.vue'
import Button from '@/components/buttons/Button.vue'
import AlertQuestion from '@/components/alerts/AlertQuestion.vue'
import AlertSuccess from '@/components/alerts/AlertSuccess.vue'
import { useLanguage } from '@/composables/useLanguage'
import { useStudentGuardians } from '@/modules/preschool/composables/useStudentGuardians'
import StudentGuardianRelationshipForm from '@/modules/preschool/shared/components/guardian/StudentGuardianRelationshipForm.vue'
import StudentGuardianList from '@/modules/preschool/shared/components/guardian/StudentGuardianList.vue'
import EmergencyContactList from '@/modules/preschool/shared/components/guardian/EmergencyContactList.vue'

defineOptions({
  name: 'PreschoolStudentGuardiansPage',
})

const { t } = useLanguage()
const {
  archiveRelationship,
  closeRelationshipDialog,
  emergencyContacts,
  errorMessage,
  guardianOptions,
  loadLookups,
  loadStudentData,
  loading,
  openCreateRelationship,
  openEditRelationship,
  pagination,
  relationshipDialogOpen,
  relationshipForm,
  relationshipMode,
  relationships,
  saveRelationship,
  saving,
  selectedRelationship,
  selectedStudentId,
  setPrimaryRelationship,
  setSelectedStudentId,
  restoreRelationship,
  studentOptions,
} = useStudentGuardians()

const archiveOpen = ref(false)
const successOpen = ref(false)
const successMessage = ref('')

const selectedStudentLabel = computed(() => {
  const selected = studentOptions.value.find((item) => String(item.value) === String(selectedStudentId.value))
  return selected?.label || t('preschoolStudentGuardiansPage.placeholders.student')
})

function handleStudentChange(event) {
  setSelectedStudentId(event.target.value)
}

async function handleSave() {
  const result = await saveRelationship()
  successMessage.value = relationshipMode.value === 'edit'
    ? t('preschoolStudentGuardiansPage.messages.updatedSuccess', { name: result.guardianName || '-' })
    : t('preschoolStudentGuardiansPage.messages.linkedSuccess', { name: result.guardianName || '-' })
  successOpen.value = true
}

function handleArchiveRequest(relationship) {
  selectedRelationship.value = relationship || null
  archiveOpen.value = true
}

async function handleSetPrimary(relationship) {
  selectedRelationship.value = relationship || null
  const result = await setPrimaryRelationship(relationship)
  successMessage.value = t('preschoolStudentGuardiansPage.messages.setPrimarySuccess', {
    name: result?.guardianName || relationship?.guardianName || '-',
  })
  successOpen.value = true
}

async function handleRestore(relationship) {
  selectedRelationship.value = relationship || null
  const result = await restoreRelationship(relationship)
  successMessage.value = t('preschoolStudentGuardiansPage.messages.restoredSuccess', {
    name: result?.guardianName || relationship?.guardianName || '-',
  })
  successOpen.value = true
}

async function confirmArchive() {
  await archiveRelationship(selectedRelationship.value?.id)
  successMessage.value = t('preschoolStudentGuardiansPage.messages.archivedSuccess')
  successOpen.value = true
  archiveOpen.value = false
}

watch(selectedStudentId, () => {
  loadStudentData()
})

onMounted(async () => {
  await loadLookups()
  if (selectedStudentId.value) {
    await loadStudentData()
  }
})
</script>

<template>
  <MainLayout>
    <section class="preschool-guardian-page">
      <HeaderSection
        :title="t('preschoolStudentGuardiansPage.title')"
        :subtitle="t('preschoolStudentGuardiansPage.subtitle')"
      />

      <div class="preschool-guardian-page__panel">
        <div class="preschool-guardian-page__toolbar">
          <Button type="button" variant="primary" rounded="xl" :disabled="!selectedStudentId" @click="openCreateRelationship">
            {{ t('preschoolStudentGuardiansPage.actions.linkGuardian') }}
          </Button>
        </div>

        <div class="preschool-guardian-page__filters">
          <select :value="selectedStudentId" class="preschool-guardian-page__input" @change="handleStudentChange">
            <option value="">{{ t('preschoolStudentGuardiansPage.placeholders.student') }}</option>
            <option v-for="student in studentOptions" :key="student.value" :value="student.value">
              {{ student.label }}
            </option>
          </select>
          <div class="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
            {{ selectedStudentLabel }}
          </div>
        </div>

        <div
          v-if="errorMessage"
          class="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"
        >
          {{ errorMessage }}
        </div>

        <div class="grid gap-4 lg:grid-cols-2">
          <StudentGuardianList
            :relationships="relationships"
            :loading="loading"
            :empty-text="t('preschoolStudentGuardiansPage.empty')"
            @edit="openEditRelationship"
            @archive="handleArchiveRequest"
            @set-primary="handleSetPrimary"
            @restore="handleRestore"
          />

          <EmergencyContactList
            :contacts="emergencyContacts"
            :loading="loading"
            :empty-text="t('preschoolEmergencyContactsPage.empty')"
          />
        </div>

        <div v-if="pagination.totalPages > 1" class="flex justify-end">
          <span class="text-xs text-slate-500">{{ t('preschoolStudentGuardiansPage.paginationHint', { page: pagination.page, total: pagination.totalPages }) }}</span>
        </div>
      </div>
    </section>

    <Dialog
      v-model:visible="relationshipDialogOpen"
      modal
      class="preschool-guardian-page__dialog"
      :header="relationshipMode === 'edit' ? t('preschoolStudentGuardiansPage.dialog.editTitle') : t('preschoolStudentGuardiansPage.dialog.createTitle')"
    >
      <StudentGuardianRelationshipForm
        :form="relationshipForm"
        :guardian-options="guardianOptions"
        :mode="relationshipMode"
        :saving="saving"
        @save="handleSave"
        @cancel="closeRelationshipDialog"
      />
    </Dialog>

    <AlertQuestion
      :show="archiveOpen"
      :title="t('preschoolStudentGuardiansPage.alerts.archiveTitle')"
      :message="t('preschoolStudentGuardiansPage.alerts.archiveMessage', { name: selectedRelationship?.guardianName || t('preschoolStudentGuardiansPage.alerts.archiveFallback') })"
      :confirm-text="t('preschoolStudentGuardiansPage.actions.archive')"
      :cancel-text="t('common.cancel')"
      type="danger"
      @confirm="confirmArchive"
      @cancel="archiveOpen = false"
    />

    <AlertSuccess
      :show="successOpen"
      :title="t('preschoolStudentGuardiansPage.alerts.successTitle')"
      :message="successMessage"
      :button-text="t('preschoolStudentGuardiansPage.alerts.close')"
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
  grid-template-columns: minmax(0, 1fr) minmax(220px, 0.7fr);
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

@media (max-width: 980px) {
  .preschool-guardian-page__filters {
    grid-template-columns: 1fr;
  }
}
</style>
