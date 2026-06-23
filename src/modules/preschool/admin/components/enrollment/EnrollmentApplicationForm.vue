<script setup>
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  buildLocationAddress,
  getLocationDisplayName,
  fetchProvinces,
  fetchDistricts,
  fetchCommunes,
  fetchVillages,
} from '@/modules/preschool/services/cambodiaLocationService'

defineOptions({ name: 'EnrollmentApplicationForm' })

const props = defineProps({
  application: { type: Object, default: null },
  academicYears: { type: Array, default: () => [] },
  terms: { type: Array, default: () => [] },
  classes: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false },
  readonly: { type: Boolean, default: false },
  saveLabel: { type: String, default: '' },
  cancelLabel: { type: String, default: '' },
})

const emit = defineEmits(['cancel', 'save'])
const { t } = useI18n()

const form = ref({})
const validationMessage = ref('')
const locationErrorMessage = ref('')
const provinceItems = ref([])
const districtItems = ref([])
const communeItems = ref([])
const villageItems = ref([])
const isSyncingLocation = ref(false)

function normalizeText(value) {
  return String(value ?? '').trim()
}

function displayLocationName(item = {}) {
  return getLocationDisplayName(item, 'kh')
}

function buildLocationOptions(items = []) {
  return items.map((item) => {
    const label = displayLocationName(item)
    return { label, value: label }
  })
}

function findLocationItem(items = [], selectedValue = '') {
  const normalized = normalizeText(selectedValue)
  if (!normalized) return null

  return items.find((item) => (
    [item.code, item.nameEn, item.nameKh].some((candidate) => normalizeText(candidate) === normalized)
  )) || null
}

const provinceOptions = computed(() => buildLocationOptions(provinceItems.value))
const districtOptions = computed(() => buildLocationOptions(districtItems.value))
const communeOptions = computed(() => buildLocationOptions(communeItems.value))
const villageOptions = computed(() => buildLocationOptions(villageItems.value))

const addressPreview = computed(() => buildLocationAddress({
  province: form.value.guardian_province,
  district: form.value.guardian_district,
  commune: form.value.guardian_commune,
  village: form.value.guardian_village,
  address: form.value.guardian_address,
}, 'kh'))

const hasStructuredLocation = computed(() => Boolean(
  form.value.guardian_province ||
  form.value.guardian_district ||
  form.value.guardian_commune ||
  form.value.guardian_village,
))

const canUseLegacyAddress = computed(() => Boolean(
  props.application &&
  !hasStructuredLocation.value &&
  normalizeText(form.value.guardian_address),
))

const f = (key) => t(`preschoolEnrollmentPage.applicationDialog.fields.${key}`)
const p = (key) => t(`preschoolEnrollmentPage.applicationDialog.placeholders.${key}`)

function setLocationError(message = '') {
  locationErrorMessage.value = normalizeText(message)
}

function syncLocationFields(apply) {
  isSyncingLocation.value = true
  try {
    apply()
  } finally {
    queueMicrotask(() => {
      isSyncingLocation.value = false
    })
  }
}

function resetLocationOptions() {
  provinceItems.value = []
  districtItems.value = []
  communeItems.value = []
  villageItems.value = []
  setLocationError('')
}

function clearLocationChildren(level = 'province') {
  if (level === 'province') {
    form.value.guardian_district = ''
    form.value.guardian_commune = ''
    form.value.guardian_village = ''
    districtItems.value = []
    communeItems.value = []
    villageItems.value = []
    return
  }

  if (level === 'district') {
    form.value.guardian_commune = ''
    form.value.guardian_village = ''
    communeItems.value = []
    villageItems.value = []
    return
  }

  if (level === 'commune') {
    form.value.guardian_village = ''
    villageItems.value = []
  }
}

function createEmptyForm(application = null) {
  return {
    first_name: application?.firstName ?? '',
    last_name: application?.lastName ?? '',
    khmer_name: application?.khmerName ?? '',
    gender: application?.gender ?? '',
    date_of_birth: application?.dateOfBirth ?? '',
    place_of_birth: application?.placeOfBirth ?? '',
    nationality: application?.nationality ?? '',
    requested_level: application?.requestedLevel ?? '',
    requested_academic_year_id: application?.requestedAcademicYearId ?? '',
    requested_term_id: application?.requestedTermId ?? '',
    preferred_class_id: application?.preferredClassId ?? '',
    requested_start_date: application?.requestedStartDate ?? '',
    guardian_name: application?.guardianName ?? '',
    guardian_relationship: application?.guardianRelationship ?? '',
    guardian_phone: application?.guardianPhone ?? '',
    guardian_email: application?.guardianEmail ?? '',
    guardian_address: application?.guardianAddress ?? application?.guardian_address ?? '',
    guardian_province: application?.guardianProvince ?? application?.guardian_province ?? application?.province ?? '',
    guardian_district: application?.guardianDistrict ?? application?.guardian_district ?? application?.district ?? '',
    guardian_commune: application?.guardianCommune ?? application?.guardian_commune ?? application?.commune ?? '',
    guardian_village: application?.guardianVillage ?? application?.guardian_village ?? application?.village ?? '',
    guardian_can_pickup: application?.guardianCanPickup ?? false,
    guardian_is_emergency: application?.guardianIsEmergency ?? false,
  }
}

function buildSubmitPayload() {
  const guardianAddress = buildLocationAddress({
    province: form.value.guardian_province,
    district: form.value.guardian_district,
    commune: form.value.guardian_commune,
    village: form.value.guardian_village,
    address: form.value.guardian_address,
  }, 'kh')

  return {
    first_name: normalizeText(form.value.first_name),
    last_name: normalizeText(form.value.last_name),
    khmer_name: normalizeText(form.value.khmer_name),
    gender: form.value.gender || null,
    date_of_birth: form.value.date_of_birth || null,
    place_of_birth: normalizeText(form.value.place_of_birth) || null,
    nationality: normalizeText(form.value.nationality) || null,
    requested_level: normalizeText(form.value.requested_level) || null,
    requested_academic_year_id: form.value.requested_academic_year_id || null,
    requested_term_id: form.value.requested_term_id || null,
    preferred_class_id: form.value.preferred_class_id || null,
    requested_start_date: form.value.requested_start_date || null,
    guardian_name: normalizeText(form.value.guardian_name) || null,
    guardian_relationship: normalizeText(form.value.guardian_relationship) || null,
    guardian_phone: normalizeText(form.value.guardian_phone) || null,
    guardian_email: normalizeText(form.value.guardian_email) || null,
    guardian_address: guardianAddress || null,
    guardian_can_pickup: Boolean(form.value.guardian_can_pickup),
    guardian_is_emergency: Boolean(form.value.guardian_is_emergency),
  }
}

function validateForm() {
  if (!normalizeText(form.value.guardian_name)) {
    return t('preschoolEnrollmentPage.validation.guardianNameRequired')
  }

  if (!normalizeText(form.value.guardian_phone)) {
    return t('preschoolEnrollmentPage.validation.guardianPhoneRequired')
  }

  if (canUseLegacyAddress.value) {
    return ''
  }

  if (!normalizeText(form.value.guardian_province)) {
    return t('preschoolEnrollmentPage.validation.guardianProvinceRequired')
  }

  if (!normalizeText(form.value.guardian_district)) {
    return t('preschoolEnrollmentPage.validation.guardianDistrictRequired')
  }

  if (!normalizeText(form.value.guardian_commune)) {
    return t('preschoolEnrollmentPage.validation.guardianCommuneRequired')
  }

  if (!normalizeText(form.value.guardian_village)) {
    return t('preschoolEnrollmentPage.validation.guardianVillageRequired')
  }

  return ''
}

async function loadProvinceOptions() {
  try {
    provinceItems.value = await fetchProvinces()
    setLocationError('')
  } catch (error) {
    provinceItems.value = []
    districtItems.value = []
    communeItems.value = []
    villageItems.value = []
    setLocationError(error?.message || t('preschoolEnrollmentPage.messages.locationLoadFailed'))
  }
}

async function loadDistrictOptionsForProvince(provinceValue) {
  const province = findLocationItem(provinceItems.value, provinceValue)
  if (!province) {
    districtItems.value = []
    communeItems.value = []
    villageItems.value = []
    return null
  }

  try {
    districtItems.value = await fetchDistricts(province.code)
    setLocationError('')
    return province
  } catch (error) {
    districtItems.value = []
    communeItems.value = []
    villageItems.value = []
    setLocationError(error?.message || t('preschoolEnrollmentPage.messages.locationLoadFailed'))
    return null
  }
}

async function loadCommuneOptionsForDistrict(districtValue) {
  const district = findLocationItem(districtItems.value, districtValue)
  if (!district) {
    communeItems.value = []
    villageItems.value = []
    return null
  }

  try {
    communeItems.value = await fetchCommunes(district.code)
    setLocationError('')
    return district
  } catch (error) {
    communeItems.value = []
    villageItems.value = []
    setLocationError(error?.message || t('preschoolEnrollmentPage.messages.locationLoadFailed'))
    return null
  }
}

async function loadVillageOptionsForCommune(communeValue) {
  const commune = findLocationItem(communeItems.value, communeValue)
  if (!commune) {
    villageItems.value = []
    return null
  }

  try {
    villageItems.value = await fetchVillages(commune.code)
    setLocationError('')
    return commune
  } catch (error) {
    villageItems.value = []
    setLocationError(error?.message || t('preschoolEnrollmentPage.messages.locationLoadFailed'))
    return null
  }
}

async function hydrateLocationHierarchy() {
  if (!normalizeText(form.value.guardian_province)) return

  isSyncingLocation.value = true
  try {
    const province = await loadDistrictOptionsForProvince(form.value.guardian_province)
    if (province) {
      form.value.guardian_province = displayLocationName(province)
    }

    if (!form.value.guardian_province || !form.value.guardian_district) return

    const district = await loadCommuneOptionsForDistrict(form.value.guardian_district)
    if (district) {
      form.value.guardian_district = displayLocationName(district)
    }

    if (!form.value.guardian_district || !form.value.guardian_commune) return

    const commune = await loadVillageOptionsForCommune(form.value.guardian_commune)
    if (commune) {
      form.value.guardian_commune = displayLocationName(commune)
    }

    const village = findLocationItem(villageItems.value, form.value.guardian_village)
    if (village) {
      form.value.guardian_village = displayLocationName(village)
    }
  } finally {
    queueMicrotask(() => {
      isSyncingLocation.value = false
    })
  }
}

async function prepareForm() {
  syncLocationFields(() => {
    form.value = createEmptyForm(props.application)
  })

  validationMessage.value = ''
  resetLocationOptions()
  await loadProvinceOptions()
  await hydrateLocationHierarchy()
}

watch(
  () => props.application,
  async () => {
    await prepareForm()
  },
  { immediate: true },
)

watch(
  () => form.value.guardian_province,
  async (value) => {
    if (isSyncingLocation.value) return
    clearLocationChildren('province')
    if (!value) return

    await loadDistrictOptionsForProvince(value)
  },
)

watch(
  () => form.value.guardian_district,
  async (value) => {
    if (isSyncingLocation.value) return
    clearLocationChildren('district')
    if (!value) return

    await loadCommuneOptionsForDistrict(value)
  },
)

watch(
  () => form.value.guardian_commune,
  async (value) => {
    if (isSyncingLocation.value) return
    clearLocationChildren('commune')
    if (!value) return

    await loadVillageOptionsForCommune(value)
  },
)

function cancel() {
  emit('cancel')
}

function save() {
  validationMessage.value = validateForm()
  if (validationMessage.value) return

  emit('save', buildSubmitPayload())
}
</script>

<template>
  <form class="enr-app-form" @submit.prevent="save">
    <div v-if="validationMessage" class="enr-app-state enr-app-state--error">
      {{ validationMessage }}
    </div>

    <div v-if="locationErrorMessage" class="enr-app-state enr-app-state--error">
      {{ locationErrorMessage }}
    </div>

    <section class="enr-app-section">
      <h3 class="enr-app-section__title">
        {{ t('preschoolEnrollmentPage.applicationDialog.sections.student') }}
      </h3>
      <div class="enr-app-grid">
        <div class="enr-app-field">
          <label class="enr-app-label">{{ f('firstName') }} *</label>
          <input v-model="form.first_name" type="text" class="enr-app-input" :disabled="readonly" :placeholder="p('firstName')" />
        </div>
        <div class="enr-app-field">
          <label class="enr-app-label">{{ f('lastName') }} *</label>
          <input v-model="form.last_name" type="text" class="enr-app-input" :disabled="readonly" :placeholder="p('lastName')" />
        </div>
        <div class="enr-app-field enr-app-field--full">
          <label class="enr-app-label">{{ f('khmerName') }}</label>
          <input v-model="form.khmer_name" type="text" class="enr-app-input" :disabled="readonly" :placeholder="p('khmerName')" />
        </div>
        <div class="enr-app-field">
          <label class="enr-app-label">{{ f('gender') }} *</label>
          <select v-model="form.gender" class="enr-app-select" :disabled="readonly">
            <option value="">—</option>
            <option value="male">{{ t('preschoolEnrollmentPage.applicationDialog.genders.male') }}</option>
            <option value="female">{{ t('preschoolEnrollmentPage.applicationDialog.genders.female') }}</option>
          </select>
        </div>
        <div class="enr-app-field">
          <label class="enr-app-label">{{ f('dateOfBirth') }} *</label>
          <input v-model="form.date_of_birth" type="date" class="enr-app-input" :disabled="readonly" />
        </div>
        <div class="enr-app-field">
          <label class="enr-app-label">{{ f('placeOfBirth') }}</label>
          <input v-model="form.place_of_birth" type="text" class="enr-app-input" :disabled="readonly" :placeholder="p('placeOfBirth')" />
        </div>
        <div class="enr-app-field">
          <label class="enr-app-label">{{ f('nationality') }}</label>
          <input v-model="form.nationality" type="text" class="enr-app-input" :disabled="readonly" :placeholder="p('nationality')" />
        </div>
      </div>
    </section>

    <section class="enr-app-section">
      <h3 class="enr-app-section__title">
        {{ t('preschoolEnrollmentPage.applicationDialog.sections.enrollment') }}
      </h3>
      <div class="enr-app-grid">
        <div class="enr-app-field">
          <label class="enr-app-label">{{ f('requestedLevel') }}</label>
          <input v-model="form.requested_level" type="text" class="enr-app-input" :disabled="readonly" />
        </div>
        <div class="enr-app-field">
          <label class="enr-app-label">{{ f('requestedAcademicYear') }}</label>
          <select v-model="form.requested_academic_year_id" class="enr-app-select" :disabled="readonly">
            <option value="">—</option>
            <option v-for="yr in academicYears" :key="yr.id" :value="yr.id">{{ yr.label }}</option>
          </select>
        </div>
        <div class="enr-app-field">
          <label class="enr-app-label">{{ f('requestedTerm') }}</label>
          <select v-model="form.requested_term_id" class="enr-app-select" :disabled="readonly">
            <option value="">—</option>
            <option v-for="term in terms" :key="term.id" :value="term.id">{{ term.name }}</option>
          </select>
        </div>
        <div class="enr-app-field">
          <label class="enr-app-label">{{ f('preferredClass') }}</label>
          <select v-model="form.preferred_class_id" class="enr-app-select" :disabled="readonly">
            <option value="">—</option>
            <option v-for="cls in classes" :key="cls.id" :value="cls.id">{{ cls.name }}</option>
          </select>
        </div>
        <div class="enr-app-field">
          <label class="enr-app-label">{{ f('requestedStartDate') }}</label>
          <input v-model="form.requested_start_date" type="date" class="enr-app-input" :disabled="readonly" />
        </div>
      </div>
    </section>

    <section class="enr-app-section">
      <h3 class="enr-app-section__title">
        {{ t('preschoolEnrollmentPage.applicationDialog.sections.guardian') }}
      </h3>
      <div class="enr-app-grid">
        <div class="enr-app-field">
          <label class="enr-app-label">{{ f('guardianName') }} *</label>
          <input v-model="form.guardian_name" type="text" class="enr-app-input" :disabled="readonly" :placeholder="p('guardianName')" />
        </div>
        <div class="enr-app-field">
          <label class="enr-app-label">{{ f('guardianRelationship') }}</label>
          <input v-model="form.guardian_relationship" type="text" class="enr-app-input" :disabled="readonly" />
        </div>
        <div class="enr-app-field">
          <label class="enr-app-label">{{ f('guardianPhone') }} *</label>
          <input v-model="form.guardian_phone" type="text" class="enr-app-input" :disabled="readonly" :placeholder="p('guardianPhone')" />
        </div>
        <div class="enr-app-field">
          <label class="enr-app-label">{{ f('guardianEmail') }}</label>
          <input v-model="form.guardian_email" type="email" class="enr-app-input" :disabled="readonly" :placeholder="p('guardianEmail')" />
        </div>

      </div>
    </section>

    <section class="enr-app-section">
      <h3 class="enr-app-section__title">
        {{ f('guardianLocation') }}
      </h3>
      <div class="enr-app-grid">
        <div class="enr-app-location">
          <div class="enr-app-location__grid">
            <label class="enr-app-field">
              <span class="enr-app-label">{{ f('province') }} *</span>
              <select v-model="form.guardian_province" class="enr-app-select" :disabled="readonly">
                <option value="">{{ t('preschoolEnrollmentPage.applicationDialog.placeholders.selectProvince') }}</option>
                <option v-for="opt in provinceOptions" :key="opt.value" :value="opt.value">
                  {{ opt.label }}
                </option>
              </select>
            </label>

            <label class="enr-app-field">
              <span class="enr-app-label">{{ f('district') }} *</span>
              <select v-model="form.guardian_district" class="enr-app-select" :disabled="readonly || !form.guardian_province">
                <option value="">{{ t('preschoolEnrollmentPage.applicationDialog.placeholders.selectDistrict') }}</option>
                <option v-for="opt in districtOptions" :key="opt.value" :value="opt.value">
                  {{ opt.label }}
                </option>
              </select>
            </label>

            <label class="enr-app-field">
              <span class="enr-app-label">{{ f('commune') }} *</span>
              <select v-model="form.guardian_commune" class="enr-app-select" :disabled="readonly || !form.guardian_district">
                <option value="">{{ t('preschoolEnrollmentPage.applicationDialog.placeholders.selectCommune') }}</option>
                <option v-for="opt in communeOptions" :key="opt.value" :value="opt.value">
                  {{ opt.label }}
                </option>
              </select>
            </label>

            <label class="enr-app-field">
              <span class="enr-app-label">{{ f('village') }} *</span>
              <select v-model="form.guardian_village" class="enr-app-select" :disabled="readonly || !form.guardian_commune">
                <option value="">{{ t('preschoolEnrollmentPage.applicationDialog.placeholders.selectVillage') }}</option>
                <option v-for="opt in villageOptions" :key="opt.value" :value="opt.value">
                  {{ opt.label }}
                </option>
              </select>
            </label>
          </div>
        </div>

        <div class="enr-app-field enr-app-field--full">
          <span class="enr-app-label">{{ f('fullAddress') }}</span>
          <div class="enr-app-readonly enr-app-readonly--address">
            <span class="enr-app-readonly__label">
              {{ t('preschoolEnrollmentPage.applicationDialog.fields.fullAddress') }}
            </span>
            <span class="enr-app-readonly__value">{{ addressPreview || '-' }}</span>
          </div>
        </div>
      </div>
    </section>

    <section class="enr-app-section">
      <h3 class="enr-app-section__title">
        {{ t('preschoolEnrollmentPage.createPage.sections.authorization') }}
      </h3>
      <div class="enr-app-grid enr-app-grid--authorization">
        <div class="enr-app-field enr-app-field--check">
          <label class="enr-app-check">
            <input v-model="form.guardian_can_pickup" type="checkbox" :disabled="readonly" />
            {{ f('guardianCanPickup') }}
          </label>
        </div>
        <div class="enr-app-field enr-app-field--check">
          <label class="enr-app-check">
            <input v-model="form.guardian_is_emergency" type="checkbox" :disabled="readonly" />
            {{ f('guardianIsEmergency') }}
          </label>
        </div>
      </div>
    </section>

    <div v-if="!readonly" class="enr-app-form__footer">
      <button type="button" class="enr-app-btn enr-app-btn--cancel" @click="cancel">
        {{ cancelLabel || t('preschoolEnrollmentPage.actions.close') }}
      </button>
      <button
        type="submit"
        class="enr-app-btn enr-app-btn--save"
        :disabled="loading"
      >
        <i v-if="loading" class="pi pi-spin pi-spinner" />
        {{ saveLabel || t('preschoolEnrollmentPage.actions.save') }}
      </button>
    </div>
    <div v-else class="enr-app-form__footer">
      <button type="button" class="enr-app-btn enr-app-btn--cancel" @click="cancel">
        {{ cancelLabel || t('preschoolEnrollmentPage.actions.close') }}
      </button>
    </div>
  </form>
</template>

<style scoped>
.enr-app-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.enr-app-state {
  padding: 1rem 1.1rem;
  border-radius: 1rem;
  border: 1px solid #dbeafe;
  background: linear-gradient(180deg, #fff 0%, #f8fbff 100%);
  color: #0f172a;
  font-weight: 600;
}

.enr-app-state--error {
  border-color: #fecaca;
  background: linear-gradient(180deg, #fff 0%, #fff7f7 100%);
  color: #b91c1c;
}

.enr-app-section__title {
  margin: 0 0 0.75rem;
  font-size: 0.85rem;
  font-weight: 700;
  color: #475569;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  border-bottom: 1px solid #f1f5f9;
  padding-bottom: 0.5rem;
}

.enr-app-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 0.75rem;
}

.enr-app-field {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.enr-app-field--full {
  grid-column: 1 / -1;
}

.enr-app-field--check {
  justify-content: flex-end;
}

.enr-app-label {
  font-size: 0.78rem;
  font-weight: 600;
  color: #475569;
}

.enr-app-input,
.enr-app-select,
.enr-app-input:focus,
.enr-app-select:focus {
  border-color: #6366f1;
  box-shadow: 0 0 0 3px rgba(99,102,241,0.15);
}

.enr-app-input:disabled,
.enr-app-select:disabled {
  background: #f8fafc;
  color: #64748b;
  cursor: default;
}

.enr-app-location {
  grid-column: 1 / -1;
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
}

.enr-app-location__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.75rem;
}

.enr-app-readonly {
  display: flex;
  align-items: center;
  min-height: 2.75rem;
  padding: 0.7rem 0.85rem;
  border: 1px dashed #c4b5fd;
  border-radius: 0.9rem;
  background: #faf5ff;
  color: #6d28d9;
  font-size: 0.92rem;
  font-weight: 700;
}

.enr-app-readonly--address {
  flex-direction: column;
  align-items: flex-start;
  gap: 0.25rem;
}

.enr-app-readonly__label {
  color: #64748b;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.enr-app-readonly__value {
  color: #0f172a;
  font-size: 0.92rem;
  font-weight: 700;
}

.enr-app-check {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  color: #334155;
  cursor: pointer;
}

.enr-app-form__footer {
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
  padding-top: 0.25rem;
  flex-wrap: wrap;
}

.enr-app-btn {
  padding: 0.55rem 1.25rem;
  border-radius: 0.6rem;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  border: 1px solid transparent;
  transition: background 0.15s;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
}

.enr-app-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.enr-app-btn--cancel {
  background: #f8fafc;
  color: #475569;
  border-color: #e2e8f0;
}

.enr-app-btn--cancel:hover:not(:disabled) {
  background: #f1f5f9;
}

.enr-app-btn--save {
  background: #6366f1;
  color: #fff;
}

.enr-app-btn--save:hover:not(:disabled) {
  background: #4f46e5;
}

@media (max-width: 900px) {
  .enr-app-location__grid {
    grid-template-columns: 1fr;
  }
}
</style>
