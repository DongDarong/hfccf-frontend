<script setup>
// Keep guardian summaries read-only so staff can inspect contact records
// without exposing edit controls in the detail view.
// Regression protection: this page only reads the admin-managed guardian data
// model and never turns guardians into portal users or editable child records.
import { computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import MainLayout from '@/layouts/MainLayout.vue'
import HeaderSection from '@/components/navigation/HeaderSection.vue'
import Button from '@/components/buttons/Button.vue'
import { useLanguage } from '@/composables/useLanguage'
import GuardianStatusBadge from '@/modules/preschool/shared/components/guardian/GuardianStatusBadge.vue'
import { usePreschoolGuardianDetails } from '@/modules/preschool/composables/usePreschoolGuardianDetails'

defineOptions({
  name: 'PreschoolGuardianDetailsPage',
})

const { t } = useLanguage()
const route = useRoute()
const router = useRouter()
const {
  guardian,
  errorMessage,
  loadGuardianDetails,
  loading,
} = usePreschoolGuardianDetails()

const guardianId = computed(() => String(route.params.guardianId || '').trim())

function goBack() {
  router.push({ name: 'dashboard-preschool-admin-guardians' })
}

function goToRelationships() {
  router.push({ name: 'dashboard-preschool-admin-student-guardians' })
}

async function loadCurrentGuardian() {
  await loadGuardianDetails(guardianId.value)
}

watch(guardianId, () => {
  loadCurrentGuardian()
})

onMounted(() => {
  loadCurrentGuardian()
})
</script>

<template>
  <MainLayout>
    <section class="preschool-guardian-details-page">
      <HeaderSection
        :title="t('preschoolGuardianDetailsPage.title')"
        :subtitle="t('preschoolGuardianDetailsPage.subtitle')"
      />

      <div class="preschool-guardian-details-page__panel">
        <div class="preschool-guardian-details-page__toolbar">
          <Button type="button" variant="ghost" rounded="xl" @click="goBack">
            {{ t('preschoolGuardianDetailsPage.actions.back') }}
          </Button>
          <Button type="button" variant="primary" rounded="xl" @click="goToRelationships">
            {{ t('preschoolGuardianDetailsPage.actions.manageRelationships') }}
          </Button>
        </div>

        <div
          v-if="errorMessage"
          class="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"
        >
          {{ errorMessage }}
        </div>

        <div v-if="loading" class="rounded-2xl border border-slate-200 bg-white px-4 py-6 text-sm text-slate-500">
          {{ t('preschoolGuardianDetailsPage.loading') }}
        </div>

        <template v-else-if="guardian">
          <div class="grid gap-4 lg:grid-cols-[1.4fr,0.6fr]">
            <article class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div class="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p class="text-xs uppercase tracking-wide text-slate-500">
                    {{ t('preschoolGuardianDetailsPage.labels.guardianRecord') }}
                  </p>
                  <h2 class="mt-1 text-2xl font-semibold text-slate-900">
                    {{ guardian.fullName || '-' }}
                  </h2>
                </div>
                <GuardianStatusBadge :status="guardian.status" />
              </div>

              <dl class="mt-5 grid gap-4 sm:grid-cols-2">
                <div>
                  <dt class="text-xs uppercase tracking-wide text-slate-500">{{ t('preschoolGuardianDetailsPage.labels.phone') }}</dt>
                  <dd class="mt-1 text-sm text-slate-800">{{ guardian.phone || '-' }}</dd>
                </div>
                <div>
                  <dt class="text-xs uppercase tracking-wide text-slate-500">{{ t('preschoolGuardianDetailsPage.labels.secondaryPhone') }}</dt>
                  <dd class="mt-1 text-sm text-slate-800">{{ guardian.secondaryPhone || '-' }}</dd>
                </div>
                <div>
                  <dt class="text-xs uppercase tracking-wide text-slate-500">{{ t('preschoolGuardianDetailsPage.labels.email') }}</dt>
                  <dd class="mt-1 text-sm text-slate-800">{{ guardian.email || '-' }}</dd>
                </div>
                <div>
                  <dt class="text-xs uppercase tracking-wide text-slate-500">{{ t('preschoolGuardianDetailsPage.labels.occupation') }}</dt>
                  <dd class="mt-1 text-sm text-slate-800">{{ guardian.occupation || '-' }}</dd>
                </div>
                <div class="sm:col-span-2">
                  <dt class="text-xs uppercase tracking-wide text-slate-500">{{ t('preschoolGuardianDetailsPage.labels.address') }}</dt>
                  <dd class="mt-1 text-sm text-slate-800">{{ guardian.address || '-' }}</dd>
                </div>
                <div class="sm:col-span-2">
                  <dt class="text-xs uppercase tracking-wide text-slate-500">{{ t('preschoolGuardianDetailsPage.labels.notes') }}</dt>
                  <dd class="mt-1 text-sm text-slate-800">{{ guardian.notes || '-' }}</dd>
                </div>
              </dl>
            </article>

            <aside class="grid gap-4">
              <article class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <p class="text-xs uppercase tracking-wide text-slate-500">
                  {{ t('preschoolGuardianDetailsPage.labels.summary') }}
                </p>
                <div class="mt-3 grid gap-3">
                  <div class="rounded-xl bg-slate-50 px-4 py-3">
                    <p class="text-xs text-slate-500">{{ t('preschoolGuardianDetailsPage.labels.relationshipsCount') }}</p>
                    <p class="mt-1 text-lg font-semibold text-slate-900">{{ guardian.relationshipsCount ?? 0 }}</p>
                  </div>
                  <div class="rounded-xl bg-slate-50 px-4 py-3">
                    <p class="text-xs text-slate-500">{{ t('preschoolGuardianDetailsPage.labels.activeRelationshipsCount') }}</p>
                    <p class="mt-1 text-lg font-semibold text-slate-900">{{ guardian.activeRelationshipsCount ?? 0 }}</p>
                  </div>
                </div>
              </article>

              <article class="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-900 shadow-sm">
                {{ t('preschoolGuardianDetailsPage.notes.readOnly') }}
              </article>
            </aside>
          </div>
        </template>

        <div v-else class="rounded-2xl border border-slate-200 bg-white px-4 py-6 text-sm text-slate-500">
          {{ t('preschoolGuardianDetailsPage.empty') }}
        </div>
      </div>
    </section>
  </MainLayout>
</template>

<style scoped>
.preschool-guardian-details-page {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.preschool-guardian-details-page__panel {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.5rem;
  border-radius: 1.5rem;
  border: 1px solid #dce6f2;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.98) 100%);
  box-shadow: 0 25px 60px -40px rgba(15, 23, 42, 0.5);
}

.preschool-guardian-details-page__toolbar {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 0.75rem;
}
</style>
