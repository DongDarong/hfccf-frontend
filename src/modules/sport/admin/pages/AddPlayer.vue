<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import MainLayout from '@/layouts/MainLayout.vue'
import HeaderSection from '@/components/navigation/HeaderSection.vue'
import Form from '@/components/forms/Form.vue'
import AlertSuccess from '@/components/alerts/AlertSuccess.vue'
import AlertError from '@/components/alerts/AlertError.vue'
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import Select from 'primevue/select'
import { useLanguage } from '@/composables/useLanguage'
import teamsManagementData from '@/mocks/sport/teams-management-data.json'
import playersManagementData from '@/mocks/sport/players-management-data.json'

defineOptions({
  name: 'SportAdminAddPlayerPage',
})

const router = useRouter()
const route = useRoute()
const { t, language, te } = useLanguage()

const playersDirectoryPath = '/module/sport-admin/players'
const statusOptions = ['active', 'pending', 'inactive', 'suspended']

const form = reactive({
  name: '',
  team: '',
  division: '',
  position: '',
  jerseyNumber: null,
  age: null,
  status: statusOptions[0],
  matchesPlayed: 0,
  goalsScored: 0,
})

const isSubmitting = ref(false)
const errorMessage = ref('')
const showSuccess = ref(false)
const showError = ref(false)
const isKh = computed(() => language.value === 'KH')

// Build select options from sport team data first; fall back to player mock data if needed.
const teamOptions = computed(() => {
  const fromTeams = (Array.isArray(teamsManagementData) ? teamsManagementData : [])
    .map((item) => String(item?.name || '').trim())
    .filter(Boolean)
  const fromPlayers = (Array.isArray(playersManagementData) ? playersManagementData : [])
    .map((item) => String(item?.team || '').trim())
    .filter(Boolean)
  return [...new Set([...fromTeams, ...fromPlayers])].sort()
})

const divisionOptions = computed(() => {
  const fromTeams = (Array.isArray(teamsManagementData) ? teamsManagementData : [])
    .map((item) => String(item?.division || '').trim())
    .filter(Boolean)
  const fromPlayers = (Array.isArray(playersManagementData) ? playersManagementData : [])
    .map((item) => String(item?.division || '').trim())
    .filter(Boolean)
  return [...new Set([...fromTeams, ...fromPlayers])].sort()
})

function playerStatusLabel(status) {
  const key = `sportPlayerInformation.status.${String(status || '').replace(/[\s-]+/g, '_').toLowerCase()}`
  return te(key) ? t(key) : String(status || '')
}

const pageTitle = computed(() => t('sportAddPlayer.title'))
const pageSubtitle = computed(() => t('sportAddPlayer.summary'))

function resetFeedback() {
  errorMessage.value = ''
  showError.value = false
}

function validate() {
  if (!form.name.trim()) return t('sportAddPlayer.validation.nameRequired')
  if (!form.team.trim()) return t('sportAddPlayer.validation.teamRequired')
  if (!form.division.trim()) return t('sportAddPlayer.validation.divisionRequired')
  if (!form.status) return t('sportAddPlayer.validation.statusRequired')
  if (Number(form.matchesPlayed) < 0) return t('sportAddPlayer.validation.statsInvalid')
  if (Number(form.goalsScored) < 0) return t('sportAddPlayer.validation.statsInvalid')
  if (Number(form.goalsScored) > Number(form.matchesPlayed)) return t('sportAddPlayer.validation.goalsTooHigh')
  return ''
}

async function goBackToPlayers() {
  await router.push(playersDirectoryPath)
}

async function onSubmit() {
  resetFeedback()
  const message = validate()
  if (message) {
    errorMessage.value = message
    showError.value = true
    return
  }

  // No persistence yet: this page defines the future API contract only.
  isSubmitting.value = true
  try {
    await new Promise((resolve) => setTimeout(resolve, 450))
    showSuccess.value = true
  } catch {
    errorMessage.value = t('sportAddPlayer.validation.createFailed')
    showError.value = true
  } finally {
    isSubmitting.value = false
  }
}

function onSuccessClose() {
  showSuccess.value = false
  goBackToPlayers()
}

function onErrorClose() {
  showError.value = false
}

onMounted(() => {
  // Pre-fill from query id when present (supports future view/edit modes).
  const id = String(route.query.id || '').trim()
  if (!id) return

  const found = (Array.isArray(playersManagementData) ? playersManagementData : []).find(
    (item) => String(item?.id || '') === id,
  )
  if (!found) return

  form.name = String(found.name || '')
  form.team = String(found.team || '')
  form.division = String(found.division || '')
  form.position = String(found.position || '')
  form.jerseyNumber = found.jerseyNumber ?? null
  form.age = found.age ?? null
  form.status = String(found.status || statusOptions[0])
  form.matchesPlayed = Number(found.matchesPlayed ?? 0)
  form.goalsScored = Number(found.goalsScored ?? 0)
})
</script>

<template>
  <MainLayout>
    <section :class="isKh ? 'add-player-page add-player-page--kh' : 'add-player-page'">
      <HeaderSection :title="pageTitle" :subtitle="pageSubtitle" />

      <div class="add-player-page__layout">
        <Form
          class="add-player-page__form"
          :title="pageTitle"
          :description="t('sportAddPlayer.formDescription')"
          :submit-text="t('sportAddPlayer.createAction')"
          :cancel-text="t('common.cancel')"
          :loading="isSubmitting"
          :disabled="false"
          :show-cancel="true"
          @submit="onSubmit"
          @cancel="goBackToPlayers"
        >
          <div class="grid gap-4 sm:grid-cols-2">
            <div class="sm:col-span-2">
              <label class="mb-2 block text-sm font-semibold text-surface-800">
                {{ t('sportAddPlayer.fullName') }}
              </label>
              <InputText
                v-model="form.name"
                class="w-full"
                :placeholder="t('sportAddPlayer.fullNamePlaceholder')"
              />
            </div>

            <div>
              <label class="mb-2 block text-sm font-semibold text-surface-800">
                {{ t('sportAddPlayer.team') }}
              </label>
              <Select
                v-model="form.team"
                class="w-full"
                :options="teamOptions"
                :placeholder="t('sportAddPlayer.teamPlaceholder')"
                append-to="self"
              />
            </div>

            <div>
              <label class="mb-2 block text-sm font-semibold text-surface-800">
                {{ t('sportAddPlayer.division') }}
              </label>
              <Select
                v-model="form.division"
                class="w-full"
                :options="divisionOptions"
                :placeholder="t('sportAddPlayer.divisionPlaceholder')"
                append-to="self"
              />
            </div>

            <div>
              <label class="mb-2 block text-sm font-semibold text-surface-800">
                {{ t('sportAddPlayer.position') }}
              </label>
              <InputText
                v-model="form.position"
                class="w-full"
                :placeholder="t('sportAddPlayer.positionPlaceholder')"
              />
            </div>

            <div>
              <label class="mb-2 block text-sm font-semibold text-surface-800">
                {{ t('sportAddPlayer.status') }}
              </label>
              <Select
                v-model="form.status"
                class="w-full"
                :options="statusOptions"
                :option-label="(value) => playerStatusLabel(value)"
                :option-value="(value) => value"
                append-to="self"
              />
            </div>

            <div>
              <label class="mb-2 block text-sm font-semibold text-surface-800">
                {{ t('sportAddPlayer.jerseyNumber') }}
              </label>
              <InputNumber
                v-model="form.jerseyNumber"
                class="w-full"
                :min="0"
                :placeholder="t('sportAddPlayer.jerseyNumberPlaceholder')"
                input-class="w-full"
              />
            </div>

            <div>
              <label class="mb-2 block text-sm font-semibold text-surface-800">
                {{ t('sportAddPlayer.age') }}
              </label>
              <InputNumber
                v-model="form.age"
                class="w-full"
                :min="0"
                :placeholder="t('sportAddPlayer.agePlaceholder')"
                input-class="w-full"
              />
            </div>

            <div>
              <label class="mb-2 block text-sm font-semibold text-surface-800">
                {{ t('sportAddPlayer.matchesPlayed') }}
              </label>
              <InputNumber
                v-model="form.matchesPlayed"
                class="w-full"
                :min="0"
                input-class="w-full"
              />
            </div>

            <div>
              <label class="mb-2 block text-sm font-semibold text-surface-800">
                {{ t('sportAddPlayer.goalsScored') }}
              </label>
              <InputNumber
                v-model="form.goalsScored"
                class="w-full"
                :min="0"
                input-class="w-full"
              />
            </div>
          </div>
        </Form>
      </div>
    </section>

    <AlertError
      :show="showError"
      :title="t('sportAddPlayer.validationError')"
      :message="errorMessage"
      :button-text="t('common.close')"
      @close="onErrorClose"
    />

    <AlertSuccess
      :show="showSuccess"
      :title="t('sportAddPlayer.playerCreated')"
      :message="t('sportAddPlayer.createdMessage')"
      :button-text="t('sportAddPlayer.backToPlayers')"
      @close="onSuccessClose"
    />
  </MainLayout>
</template>

<style scoped>
.add-player-page {
  display: flex;
  flex-direction: column;
  gap: 1.35rem;
}

.add-player-page__layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 1rem;
}

.add-player-page--kh :deep(form header h3),
.add-player-page--kh :deep(form header p),
.add-player-page--kh :deep(.p-dialog-content),
.add-player-page--kh :deep(.p-dialog-footer),
.add-player-page--kh :deep(label) {
  font-family:
    'Noto Sans Khmer', 'Khmer OS Siemreap', 'Khmer OS Battambang', 'Leelawadee UI', sans-serif;
}

.add-player-page--kh :deep(form header p),
.add-player-page--kh :deep(.p-dialog-content p) {
  line-height: 1.7;
}
</style>

