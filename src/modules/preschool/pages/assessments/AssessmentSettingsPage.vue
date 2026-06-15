<script setup>
import { onMounted, ref } from 'vue'
import MainLayout from '@/layouts/MainLayout.vue'
import HeaderSection from '@/components/navigation/HeaderSection.vue'
import Button from '@/components/buttons/Button.vue'
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import Select from 'primevue/select'
import Checkbox from 'primevue/checkbox'
import Message from 'primevue/message'
import { useAssessmentData } from '@/modules/preschool/composables/useAssessmentData'

defineOptions({
  name: 'PreschoolAssessmentSettingsPage',
})

const { categories, loadCategories } = useAssessmentData()

const saving = ref(false)
const saved = ref(false)
const error = ref(null)

// Settings state
const settings = ref({
  enableRiskTracking: true,
  riskThreshold: 60,
  enableAutoRating: true,
  requireObservation: true,
  requireTeacherComment: false,
  allowArchiving: true,
  notifyOnHighRisk: true,
})

const ratingOptions = [
  { label: 'Excellent', value: 'Excellent' },
  { label: 'Good', value: 'Good' },
  { label: 'Fair', value: 'Fair' },
  { label: 'Needs Improvement', value: 'Needs Improvement' },
]

const periodOptions = [
  { label: 'Q1', value: 'Q1' },
  { label: 'Q2', value: 'Q2' },
  { label: 'Q3', value: 'Q3' },
  { label: 'Q4', value: 'Q4' },
  { label: 'Midterm', value: 'Midterm' },
  { label: 'Final', value: 'Final' },
]

onMounted(async () => {
  await loadCategories()
  // Load settings from localStorage or API
  const saved = localStorage.getItem('assessmentSettings')
  if (saved) {
    settings.value = { ...settings.value, ...JSON.parse(saved) }
  }
})

async function saveSettings() {
  saving.value = true
  error.value = null

  try {
    // Save to localStorage (can be replaced with API call)
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
  const saved = localStorage.getItem('assessmentSettings')
  if (saved) {
    settings.value = { ...settings.value, ...JSON.parse(saved) }
  }
}
</script>

<template>
  <MainLayout>
    <div class="space-y-8">
      <!-- Header -->
      <HeaderSection
        title="⚙️ Assessment Settings"
        subtitle="Configure assessment tracking and display preferences"
      />

      <!-- Success Message -->
      <Message
        v-if="saved"
        severity="success"
        text="Settings saved successfully!"
        class="w-full"
      />

      <!-- Error Message -->
      <Message
        v-if="error"
        severity="error"
        :text="`Error: ${error}`"
        class="w-full"
      />

      <!-- Form Sections -->
      <div class="space-y-6">
        <!-- Risk Management Section -->
        <div class="rounded-lg border border-gray-200 bg-white p-6">
          <h3 class="text-lg font-bold text-gray-900">⚠️ Risk Management</h3>

          <div class="mt-4 space-y-4">
            <!-- Enable Risk Tracking -->
            <div class="flex items-center gap-3">
              <Checkbox
                v-model="settings.enableRiskTracking"
                binary
                input-id="enableRisk"
              />
              <label for="enableRisk" class="cursor-pointer">
                <span class="font-medium text-gray-900">Enable Risk Tracking</span>
                <p class="text-sm text-gray-600">Automatically identify at-risk students</p>
              </label>
            </div>

            <!-- Risk Threshold -->
            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-900">
                Risk Threshold Score
              </label>
              <div class="flex items-center gap-2">
                <input
                  v-model.number="settings.riskThreshold"
                  type="range"
                  min="0"
                  max="100"
                  class="flex-1"
                />
                <span class="w-16 rounded-lg border border-gray-200 bg-gray-50 p-2 text-center font-bold text-gray-900">
                  {{ settings.riskThreshold }}
                </span>
              </div>
              <p class="text-xs text-gray-600">
                Students scoring below this threshold will be marked as high risk
              </p>
            </div>

            <!-- Notify on High Risk -->
            <div class="flex items-center gap-3">
              <Checkbox
                v-model="settings.notifyOnHighRisk"
                binary
                input-id="notifyRisk"
              />
              <label for="notifyRisk" class="cursor-pointer">
                <span class="font-medium text-gray-900">Send Notifications</span>
                <p class="text-sm text-gray-600">Alert when high-risk students are identified</p>
              </label>
            </div>
          </div>
        </div>

        <!-- Assessment Options Section -->
        <div class="rounded-lg border border-gray-200 bg-white p-6">
          <h3 class="text-lg font-bold text-gray-900">📋 Assessment Options</h3>

          <div class="mt-4 space-y-4">
            <!-- Auto Rating -->
            <div class="flex items-center gap-3">
              <Checkbox
                v-model="settings.enableAutoRating"
                binary
                input-id="autoRating"
              />
              <label for="autoRating" class="cursor-pointer">
                <span class="font-medium text-gray-900">Enable Auto-Rating</span>
                <p class="text-sm text-gray-600">Suggest ratings based on assessment scores</p>
              </label>
            </div>

            <!-- Require Observation -->
            <div class="flex items-center gap-3">
              <Checkbox
                v-model="settings.requireObservation"
                binary
                input-id="requireObs"
              />
              <label for="requireObs" class="cursor-pointer">
                <span class="font-medium text-gray-900">Require Observation Notes</span>
                <p class="text-sm text-gray-600">Make observation field mandatory</p>
              </label>
            </div>

            <!-- Require Teacher Comment -->
            <div class="flex items-center gap-3">
              <Checkbox
                v-model="settings.requireTeacherComment"
                binary
                input-id="requireComment"
              />
              <label for="requireComment" class="cursor-pointer">
                <span class="font-medium text-gray-900">Require Teacher Comment</span>
                <p class="text-sm text-gray-600">Make teacher comment field mandatory</p>
              </label>
            </div>

            <!-- Allow Archiving -->
            <div class="flex items-center gap-3">
              <Checkbox
                v-model="settings.allowArchiving"
                binary
                input-id="allowArchive"
              />
              <label for="allowArchive" class="cursor-pointer">
                <span class="font-medium text-gray-900">Allow Assessment Archiving</span>
                <p class="text-sm text-gray-600">Let users soft-delete assessments</p>
              </label>
            </div>
          </div>
        </div>

        <!-- Category Management Section -->
        <div class="rounded-lg border border-gray-200 bg-white p-6">
          <h3 class="text-lg font-bold text-gray-900">🎯 Assessment Categories</h3>

          <div class="mt-4 space-y-2">
            <p class="text-sm text-gray-600">
              {{ categories.length }} assessment categories configured
            </p>

            <div class="mt-4 space-y-2">
              <div
                v-for="category in categories"
                :key="category.id"
                class="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-3"
              >
                <div>
                  <p class="font-medium text-gray-900">{{ category.name }}</p>
                  <p v-if="category.code" class="text-xs text-gray-600">Code: {{ category.code }}</p>
                </div>
                <span class="inline-block rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                  Active
                </span>
              </div>
            </div>

            <Button
              label="Manage Categories"
              icon="pi pi-cog"
              size="sm"
              variant="secondary"
              class="mt-4"
            />
          </div>
        </div>

        <!-- Period Configuration Section -->
        <div class="rounded-lg border border-gray-200 bg-white p-6">
          <h3 class="text-lg font-bold text-gray-900">📅 Assessment Periods</h3>

          <div class="mt-4 space-y-2">
            <p class="text-sm text-gray-600">
              Configure available assessment periods
            </p>

            <div class="mt-4 grid gap-2 sm:grid-cols-3">
              <div
                v-for="period in periodOptions"
                :key="period.value"
                class="rounded-lg border border-gray-200 bg-gray-50 p-3 text-center"
              >
                <p class="font-medium text-gray-900">{{ period.label }}</p>
              </div>
            </div>

            <Button
              label="Edit Periods"
              icon="pi pi-pencil"
              size="sm"
              variant="secondary"
              class="mt-4"
            />
          </div>
        </div>

        <!-- Rating Scale Section -->
        <div class="rounded-lg border border-gray-200 bg-white p-6">
          <h3 class="text-lg font-bold text-gray-900">⭐ Rating Scale</h3>

          <div class="mt-4 space-y-2">
            <p class="text-sm text-gray-600">
              Current rating scale options
            </p>

            <div class="mt-4 space-y-2">
              <div
                v-for="rating in ratingOptions"
                :key="rating.value"
                class="flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 p-3"
              >
                <div
                  :class="[
                    'rounded-full w-10 h-10 flex items-center justify-center',
                    rating.value === 'Excellent' ? 'bg-blue-100 text-blue-700' :
                    rating.value === 'Good' ? 'bg-emerald-100 text-emerald-700' :
                    rating.value === 'Fair' ? 'bg-amber-100 text-amber-700' :
                    'bg-red-100 text-red-700'
                  ]"
                >
                  {{
                    rating.value === 'Excellent' ? '⭐' :
                    rating.value === 'Good' ? '👍' :
                    rating.value === 'Fair' ? '👌' :
                    '⚠️'
                  }}
                </div>
                <p class="font-medium text-gray-900">{{ rating.label }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex gap-3">
          <Button
            label="💾 Save Settings"
            icon="pi pi-check"
            :loading="saving"
            @click="saveSettings"
          />

          <Button
            label="↩️ Reset"
            icon="pi pi-refresh"
            variant="secondary"
            :disabled="saving"
            @click="resetSettings"
          />
        </div>
      </div>
    </div>
  </MainLayout>
</template>
