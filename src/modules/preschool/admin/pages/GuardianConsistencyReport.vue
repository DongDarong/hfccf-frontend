<script setup>
// Keep guardian integrity reporting on its own staff-only page so duplicate
// review and relationship consistency checks stay separate from CRUD screens.
import { onMounted } from 'vue'
import MainLayout from '@/layouts/MainLayout.vue'
import HeaderSection from '@/components/navigation/HeaderSection.vue'
import Button from '@/components/buttons/Button.vue'
import { useLanguage } from '@/composables/useLanguage'
import { usePreschoolGuardianIntegrity } from '@/modules/preschool/composables/usePreschoolGuardianIntegrity'
import GuardianConsistencySummaryCard from '@/modules/preschool/shared/components/guardian/GuardianConsistencySummaryCard.vue'
import GuardianConsistencyIssueList from '@/modules/preschool/shared/components/guardian/GuardianConsistencyIssueList.vue'
import GuardianDuplicateWarning from '@/modules/preschool/shared/components/guardian/GuardianDuplicateWarning.vue'

defineOptions({
  name: 'PreschoolGuardianConsistencyReportPage',
})

const { t } = useLanguage()
const {
  duplicates,
  errorMessage,
  loadIntegrityData,
  loading,
  refreshIntegrityData,
  report,
} = usePreschoolGuardianIntegrity()

onMounted(() => {
  void loadIntegrityData().catch(() => undefined)
})

function handleRefresh() {
  void refreshIntegrityData().catch(() => undefined)
}
</script>

<template>
  <MainLayout>
    <section class="preschool-guardian-integrity-page">
      <HeaderSection
        :title="t('preschoolGuardianIntegrityPage.title')"
        :subtitle="t('preschoolGuardianIntegrityPage.subtitle')"
      />

      <div class="preschool-guardian-integrity-page__panel">
        <div class="preschool-guardian-integrity-page__toolbar">
          <Button
            type="button"
            variant="primary"
            rounded="xl"
            :loading="loading"
            @click="handleRefresh"
          >
            {{ t('preschoolGuardianIntegrityPage.actions.refresh') }}
          </Button>
        </div>

        <div
          v-if="errorMessage"
          class="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"
        >
          {{ errorMessage }}
        </div>

        <div v-if="loading" class="rounded-2xl border border-slate-200 bg-white px-4 py-6 text-sm text-slate-500">
          {{ t('preschoolGuardianIntegrityPage.loading') }}
        </div>

        <template v-else>
          <div
            v-if="!report.summary.issueCount && !duplicates.summary.candidateGroups"
            class="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800"
          >
            {{ t('preschoolGuardianIntegrityPage.empty') }}
          </div>

          <section>
            <div class="mb-3 flex items-center justify-between gap-3">
              <h2 class="text-base font-semibold text-slate-900">
                {{ t('preschoolGuardianIntegrityPage.sections.summary') }}
              </h2>
            </div>

            <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <GuardianConsistencySummaryCard
                :title="t('preschoolGuardianIntegrityPage.summary.issueCount')"
                :value="report.summary.issueCount"
                :caption="t('preschoolGuardianIntegrityPage.summary.criticalCount') + ': ' + report.summary.criticalCount"
                tone="critical"
              />
              <GuardianConsistencySummaryCard
                :title="t('preschoolGuardianIntegrityPage.summary.warningCount')"
                :value="report.summary.warningCount"
                :caption="t('preschoolGuardianIntegrityPage.summary.infoCount') + ': ' + report.summary.infoCount"
                tone="warning"
              />
              <GuardianConsistencySummaryCard
                :title="t('preschoolGuardianIntegrityPage.summary.duplicateGroups')"
                :value="duplicates.summary.candidateGroups"
                :caption="t('preschoolGuardianIntegrityPage.summary.matchedGuardians') + ': ' + duplicates.summary.matchedGuardians"
              />
              <GuardianConsistencySummaryCard
                :title="t('preschoolGuardianIntegrityPage.summary.studentsWithoutActiveGuardian')"
                :value="report.summary.studentsWithoutActiveGuardian"
              />
            </div>

            <div class="mt-4 grid gap-4 md:grid-cols-2">
              <GuardianConsistencySummaryCard
                :title="t('preschoolGuardianIntegrityPage.summary.multiplePrimaryGuardianStudents')"
                :value="report.summary.multiplePrimaryGuardianStudents"
              />
              <GuardianConsistencySummaryCard
                :title="t('preschoolGuardianIntegrityPage.summary.guardiansWithoutStudents')"
                :value="report.summary.guardiansWithoutStudents"
              />
              <GuardianConsistencySummaryCard
                :title="t('preschoolGuardianIntegrityPage.summary.archivedPrimaryRelationships')"
                :value="report.summary.archivedPrimaryRelationships"
              />
              <GuardianConsistencySummaryCard
                :title="t('preschoolGuardianIntegrityPage.summary.legacyMismatches')"
                :value="report.summary.legacyMismatches"
              />
              <GuardianConsistencySummaryCard
                :title="t('preschoolGuardianIntegrityPage.summary.inactiveEmergencyContacts')"
                :value="report.summary.inactiveEmergencyContacts"
              />
              <GuardianConsistencySummaryCard
                :title="t('preschoolGuardianIntegrityPage.summary.pickupPermissionIssues')"
                :value="report.summary.pickupPermissionIssues"
              />
            </div>
          </section>

          <section class="mt-6">
            <div class="mb-3 flex items-center justify-between gap-3">
              <h2 class="text-base font-semibold text-slate-900">
                {{ t('preschoolGuardianIntegrityPage.sections.duplicates') }}
              </h2>
            </div>

            <div v-if="duplicates.items.length" class="grid gap-4">
              <GuardianDuplicateWarning
                v-for="(group, index) in duplicates.items"
                :key="group.guardianIds.join('-') || index"
                :group="group"
                :index="index + 1"
              />
            </div>

            <div v-else class="rounded-2xl border border-dashed border-slate-300 bg-white px-4 py-6 text-sm text-slate-500">
              {{ t('preschoolGuardianIntegrityPage.emptyDuplicates') }}
            </div>
          </section>

          <section class="mt-6">
            <div class="mb-3 flex items-center justify-between gap-3">
              <h2 class="text-base font-semibold text-slate-900">
                {{ t('preschoolGuardianIntegrityPage.sections.issues') }}
              </h2>
            </div>

            <GuardianConsistencyIssueList
              :issues="report.items"
              :loading="false"
              :empty-text="t('preschoolGuardianIntegrityPage.emptyIssues')"
            />
          </section>
        </template>
      </div>
    </section>
  </MainLayout>
</template>

<style scoped>
.preschool-guardian-integrity-page {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.preschool-guardian-integrity-page__panel {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.5rem;
  border-radius: 1.5rem;
  border: 1px solid #dce6f2;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.98) 100%);
  box-shadow: 0 25px 60px -40px rgba(15, 23, 42, 0.5);
}

.preschool-guardian-integrity-page__toolbar {
  display: flex;
  justify-content: flex-end;
}
</style>
