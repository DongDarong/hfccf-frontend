<script setup>
import { onMounted, ref } from 'vue'
import MainLayout from '@/layouts/MainLayout.vue'
import HeaderSection from '@/components/navigation/HeaderSection.vue'
import Button from '@/components/buttons/Button.vue'
import Checkbox from 'primevue/checkbox'
import Message from 'primevue/message'
import { useAssessmentData } from '@/modules/preschool/composables/useAssessmentData'
import {
  PRESCHOOL_ASSESSMENT_PERIOD_OPTIONS,
  PRESCHOOL_ASSESSMENT_RATING_OPTIONS,
} from './constants/preschoolAssessmentWorkspace'

defineOptions({
  name: 'PreschoolAssessmentSettingsPage',
})

const { categories, loadCategories } = useAssessmentData()

const saving = ref(false)
const saved = ref(false)
const error = ref(null)

const settings = ref({
  enableRiskTracking: true,
  riskThreshold: 60,
  enableAutoRating: true,
  requireObservation: true,
  requireTeacherComment: false,
  allowArchiving: true,
  notifyOnHighRisk: true,
})

const ratingOptions = PRESCHOOL_ASSESSMENT_RATING_OPTIONS
const periodOptions = PRESCHOOL_ASSESSMENT_PERIOD_OPTIONS.filter(option => option.value)

onMounted(async () => {
  await loadCategories()

  const savedSettings = localStorage.getItem('assessmentSettings')
  if (savedSettings) {
    settings.value = { ...settings.value, ...JSON.parse(savedSettings) }
  }
})

async function saveSettings() {
  saving.value = true
  error.value = null

  try {
    localStorage.setItem('assessmentSettings', JSON.stringify(settings.value))
    saved.value = true
    setTimeout(() => {
      saved.value = false
    }, 3000)
  } catch (err) {
    error.value = err.message
  } finally {
    saving.value = false
  }
}

function resetSettings() {
  const savedSettings = localStorage.getItem('assessmentSettings')
  if (savedSettings) {
    settings.value = { ...settings.value, ...JSON.parse(savedSettings) }
  }
}
</script>

<template>
  <MainLayout>
    <div class="space-y-8">
      <HeaderSection
        title="Assessment Settings"
        subtitle="Configure risk rules, review defaults, and operational preferences for Preschool assessments."
      />

      <Message
        v-if="saved"
        severity="success"
        text="Settings saved successfully."
        class="w-full"
      />

      <Message
        v-if="error"
        severity="error"
        :text="`Error: ${error}`"
        class="w-full"
      />

      <div class="grid gap-6 xl:grid-cols-2">
        <section class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 class="text-lg font-bold text-slate-900">Risk Management</h3>

          <div class="mt-4 space-y-4">
            <div class="flex items-center gap-3">
              <Checkbox v-model="settings.enableRiskTracking" binary input-id="enableRisk" />
              <label for="enableRisk" class="cursor-pointer">
                <span class="font-medium text-slate-900">Enable Risk Tracking</span>
                <p class="text-sm text-slate-600">Automatically identify at-risk students.</p>
              </label>
            </div>

            <div class="space-y-2">
              <label class="block text-sm font-medium text-slate-900">
                Risk Threshold Score
              </label>
              <div class="flex items-center gap-3">
                <input
                  v-model.number="settings.riskThreshold"
                  type="range"
                  min="0"
                  max="100"
                  class="flex-1"
                />
                <span class="w-16 rounded-xl border border-slate-200 bg-slate-50 p-2 text-center font-bold text-slate-900">
                  {{ settings.riskThreshold }}
                </span>
              </div>
              <p class="text-xs text-slate-600">
                Students scoring below this threshold are treated as high risk.
              </p>
            </div>

            <div class="flex items-center gap-3">
              <Checkbox v-model="settings.notifyOnHighRisk" binary input-id="notifyRisk" />
              <label for="notifyRisk" class="cursor-pointer">
                <span class="font-medium text-slate-900">Send Notifications</span>
                <p class="text-sm text-slate-600">Alert when high-risk students are identified.</p>
              </label>
            </div>
          </div>
        </section>

        <section class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 class="text-lg font-bold text-slate-900">Assessment Options</h3>

          <div class="mt-4 space-y-4">
            <div class="flex items-center gap-3">
              <Checkbox v-model="settings.enableAutoRating" binary input-id="autoRating" />
              <label for="autoRating" class="cursor-pointer">
                <span class="font-medium text-slate-900">Enable Auto-Rating</span>
                <p class="text-sm text-slate-600">Suggest ratings based on assessment scores.</p>
              </label>
            </div>

            <div class="flex items-center gap-3">
              <Checkbox v-model="settings.requireObservation" binary input-id="requireObs" />
              <label for="requireObs" class="cursor-pointer">
                <span class="font-medium text-slate-900">Require Observation Notes</span>
                <p class="text-sm text-slate-600">Make observation mandatory for each assessment.</p>
              </label>
            </div>

            <div class="flex items-center gap-3">
              <Checkbox v-model="settings.requireTeacherComment" binary input-id="requireComment" />
              <label for="requireComment" class="cursor-pointer">
                <span class="font-medium text-slate-900">Require Teacher Comment</span>
                <p class="text-sm text-slate-600">Make teacher comment mandatory when needed.</p>
              </label>
            </div>

            <div class="flex items-center gap-3">
              <Checkbox v-model="settings.allowArchiving" binary input-id="allowArchive" />
              <label for="allowArchive" class="cursor-pointer">
                <span class="font-medium text-slate-900">Allow Assessment Archiving</span>
                <p class="text-sm text-slate-600">Let users archive older assessment records.</p>
              </label>
            </div>
          </div>
        </section>

        <section class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 class="text-lg font-bold text-slate-900">Assessment Categories</h3>
          <p class="mt-2 text-sm text-slate-600">
            {{ categories.length }} assessment category records are currently available.
          </p>

          <div class="mt-4 space-y-2">
            <div
              v-for="category in categories"
              :key="category.id"
              class="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-3"
            >
              <div>
                <p class="font-medium text-slate-900">{{ category.name }}</p>
                <p v-if="category.code" class="text-xs text-slate-600">Code: {{ category.code }}</p>
              </div>
              <span class="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                Active
              </span>
            </div>
          </div>

          <div class="mt-4 flex gap-3">
            <Button label="Manage Categories" icon="pi pi-cog" size="sm" variant="secondary" />
          </div>
        </section>

        <section class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 class="text-lg font-bold text-slate-900">Assessment Periods</h3>
          <p class="mt-2 text-sm text-slate-600">
            Keep the available periods aligned to the academic cycle.
          </p>

          <div class="mt-4 grid gap-3 sm:grid-cols-2">
            <div
              v-for="period in periodOptions"
              :key="period.value"
              class="rounded-xl border border-slate-200 bg-slate-50 p-3 text-center"
            >
              <p class="font-medium text-slate-900">{{ period.label }}</p>
            </div>
          </div>

          <div class="mt-4 flex gap-3">
            <Button label="Edit Periods" icon="pi pi-pencil" size="sm" variant="secondary" />
          </div>
        </section>
      </div>

      <section class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 class="text-lg font-bold text-slate-900">Rating Scale</h3>
        <p class="mt-2 text-sm text-slate-600">Current rating configuration used by the Preschool workspace.</p>

        <div class="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <div
            v-for="rating in ratingOptions"
            :key="rating.value"
            class="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3"
          >
            <div
              :class="[
                'flex h-10 w-10 items-center justify-center rounded-full',
                rating.riskLevel === 'excellent' ? 'bg-blue-100 text-blue-700' :
                rating.riskLevel === 'good' ? 'bg-emerald-100 text-emerald-700' :
                rating.riskLevel === 'fair' ? 'bg-amber-100 text-amber-700' :
                'bg-red-100 text-red-700',
              ]"
            >
              <i
                :class="[
                  rating.riskLevel === 'excellent' ? 'pi pi-star' :
                  rating.riskLevel === 'good' ? 'pi pi-thumbs-up' :
                  rating.riskLevel === 'fair' ? 'pi pi-minus-circle' :
                  'pi pi-exclamation-triangle',
                ]"
              />
            </div>
            <div>
              <p class="font-medium text-slate-900">{{ rating.label }}</p>
              <p class="text-xs text-slate-600">
                {{ rating.scoreMin }}-{{ rating.scoreMax }} points
              </p>
            </div>
          </div>
        </div>
      </section>

      <section class="flex flex-wrap gap-3">
        <Button
          label="Save Settings"
          icon="pi pi-check"
          :loading="saving"
          @click="saveSettings"
        />
        <Button
          label="Reset"
          icon="pi pi-refresh"
          variant="secondary"
          :disabled="saving"
          @click="resetSettings"
        />
      </section>
    </div>
  </MainLayout>
</template>
