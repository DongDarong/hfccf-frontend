<script setup>
import { ref, watch, computed } from 'vue'
import Button from '@/components/buttons/Button.vue'
import DynamicCollection from './DynamicCollection.vue'
import CollectionCard from './CollectionCard.vue'
import ConditionCard from './ConditionCard.vue'
import AllergyCard from './AllergyCard.vue'
import MedicationCard from './MedicationCard.vue'
import VaccinationCard from './VaccinationCard.vue'
import EmergencyContactCard from './EmergencyContactCard.vue'
import { useLanguage } from '@/composables/useLanguage'

const props = defineProps({
  student: {
    type: Object,
    default: null,
  },
  profile: {
    type: Object,
    default: null,
  },
  mode: {
    type: String,
    default: 'add',
  },
  loading: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['save', 'close'])

const { t } = useLanguage()

// Basic Health Information
const bloodType = ref('')
const height = ref('')
const weight = ref('')
const specialNeeds = ref('')
const medicalNotes = ref('')

// Dynamic Collections
const conditions = ref([])
const allergies = ref([])
const medications = ref([])
const vaccinations = ref([])
const emergencyContacts = ref([])

const validationErrors = ref({})
const submitError = ref('')

watch(
  () => props.profile,
  (profile) => {
    if (profile) {
      bloodType.value = profile.blood_type || ''
      height.value = profile.height || ''
      weight.value = profile.weight || ''
      specialNeeds.value = profile.special_needs || ''
      medicalNotes.value = profile.medical_notes || ''
    }
  },
  { immediate: true, deep: true }
)

function resetForm() {
  bloodType.value = ''
  height.value = ''
  weight.value = ''
  specialNeeds.value = ''
  medicalNotes.value = ''
  conditions.value = []
  allergies.value = []
  medications.value = []
  vaccinations.value = []
  emergencyContacts.value = []
  validationErrors.value = {}
  submitError.value = ''
}

function closeDialog() {
  resetForm()
  emit('close')
}

// Collection handlers
function addCondition() {
  conditions.value.push({ condition_name: '', diagnosis_date: '', status: 'active', notes: '' })
}

function removeCondition(index) {
  conditions.value.splice(index, 1)
}

function updateCondition(data) {
  const item = conditions.value[data.index]
  if (item) {
    item[data.key] = data.value
  }
}

function addAllergy() {
  allergies.value.push({ allergy_name: '', severity: 'medium', reaction: '', notes: '' })
}

function removeAllergy(index) {
  allergies.value.splice(index, 1)
}

function updateAllergy(data) {
  const item = allergies.value[data.index]
  if (item) {
    item[data.key] = data.value
  }
}

function addMedication() {
  medications.value.push({ medication_name: '', dosage: '', frequency: '', start_date: '', end_date: '', notes: '' })
}

function removeMedication(index) {
  medications.value.splice(index, 1)
}

function updateMedication(data) {
  const item = medications.value[data.index]
  if (item) {
    item[data.key] = data.value
  }
}

function addVaccination() {
  vaccinations.value.push({ vaccine_name: '', vaccination_date: '', next_due_date: '', status: 'completed', notes: '' })
}

function removeVaccination(index) {
  vaccinations.value.splice(index, 1)
}

function updateVaccination(data) {
  const item = vaccinations.value[data.index]
  if (item) {
    item[data.key] = data.value
  }
}

function addEmergencyContact() {
  emergencyContacts.value.push({ contact_name: '', relationship: '', phone_number: '', hospital_clinic: '', notes: '' })
}

function removeEmergencyContact(index) {
  emergencyContacts.value.splice(index, 1)
}

function updateEmergencyContact(data) {
  const item = emergencyContacts.value[data.index]
  if (item) {
    item[data.key] = data.value
  }
}

async function submitForm() {
  validationErrors.value = {}
  submitError.value = ''

  const payload = {
    basicInfo: {
      blood_type: bloodType.value || null,
      height: height.value ? parseInt(height.value) : null,
      weight: weight.value ? parseInt(weight.value) : null,
      special_needs: specialNeeds.value || null,
      medical_notes: medicalNotes.value || null,
      status: 'active',
    },
    conditions: conditions.value,
    allergies: allergies.value,
    medications: medications.value,
    vaccinations: vaccinations.value,
    emergencyContacts: emergencyContacts.value,
  }

  try {
    emit('save', payload)
  } catch (error) {
    if (error?.response?.status === 422) {
      validationErrors.value = error.response.data?.errors || {}
    } else {
      submitError.value = error?.message || t('preschoolHealthPage.messages.saveFailed')
    }
    throw error
  }
}
</script>

<template>
  <div class="health-record-form-overlay" @click="closeDialog">
    <div class="health-record-form-dialog" @click.stop>
      <div class="health-record-form-header">
        <h3>{{ mode === 'add' ? t('preschoolHealthPage.records.addHealth') : t('preschoolHealthPage.records.editHealth') }}</h3>
        <button class="health-record-form-close" @click="closeDialog">&times;</button>
      </div>

      <div class="health-record-form-body">
        <!-- Student Summary -->
        <div class="health-record-form-summary">
          <div class="health-record-form-summary-item">
            <div class="health-record-form-label">{{ t('preschoolHealthPage.records.student') }}</div>
            <div class="health-record-form-value">{{ student?.fullName || '-' }}</div>
          </div>
          <div class="health-record-form-summary-item">
            <div class="health-record-form-label">{{ t('preschoolHealthPage.records.gender') }}</div>
            <div class="health-record-form-value">{{ student?.gender || '-' }}</div>
          </div>
          <div class="health-record-form-summary-item">
            <div class="health-record-form-label">{{ t('preschoolHealthPage.records.class') }}</div>
            <div class="health-record-form-value">{{ student?.className || '-' }}</div>
          </div>
        </div>

        <!-- Error Messages -->
        <div v-if="submitError" class="health-record-form-error">
          {{ submitError }}
        </div>

        <!-- Section 1: Basic Health Information -->
        <div class="health-record-form-section">
          <h4 class="section-title">{{ t('preschoolHealthPage.records.healthInformation') }}</h4>

          <div class="form-grid">
            <div class="form-group">
              <label class="health-record-form-label">{{ t('preschoolHealthPage.records.bloodType') }}</label>
              <select v-model="bloodType" class="health-record-form-input">
                <option value="">{{ t('common.none') }}</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
              </select>
            </div>

            <div class="form-group">
              <label class="health-record-form-label">{{ t('preschoolHealthPage.records.height') }}</label>
              <input
                v-model="height"
                type="number"
                class="health-record-form-input"
                placeholder="Height in cm"
                min="0"
                max="300"
              />
            </div>

            <div class="form-group">
              <label class="health-record-form-label">{{ t('preschoolHealthPage.records.weight') }}</label>
              <input
                v-model="weight"
                type="number"
                class="health-record-form-input"
                placeholder="Weight in kg"
                min="0"
                max="200"
              />
            </div>

            <div class="form-group">
              <label class="health-record-form-label">{{ t('preschoolHealthPage.records.specialNeeds') }}</label>
              <input
                v-model="specialNeeds"
                type="text"
                class="health-record-form-input"
                :placeholder="t('common.none')"
              />
            </div>
          </div>

          <div class="form-group">
            <label class="health-record-form-label">{{ t('preschoolHealthPage.records.medicalNotes') }}</label>
            <textarea
              v-model="medicalNotes"
              class="health-record-form-textarea"
              :placeholder="t('preschoolHealthPage.records.notesPlaceholder')"
              rows="3"
            />
          </div>
        </div>

        <!-- Section 2: Medical Conditions -->
        <div class="health-record-form-section">
          <h4 class="section-title">{{ t('preschoolHealthPage.records.medicalCondition') }}</h4>
          <DynamicCollection
            :items="conditions"
            :emptyMessage="t('preschoolHealthPage.records.noRecords') || 'No records added.'"
            :addButtonLabel="t('common.add') || 'Add Condition'"
            @add="addCondition"
            @remove="removeCondition"
          >
            <template #item="{ item, index, onRemove, onChange }">
              <ConditionCard :condition="item" :index="index" @remove="onRemove" @update="updateCondition" />
            </template>
          </DynamicCollection>
        </div>

        <!-- Section 3: Allergies -->
        <div class="health-record-form-section">
          <h4 class="section-title">{{ t('preschoolHealthPage.records.allergies') }}</h4>
          <DynamicCollection
            :items="allergies"
            :emptyMessage="t('preschoolHealthPage.records.noRecords') || 'No records added.'"
            :addButtonLabel="t('common.add') || 'Add Allergy'"
            @add="addAllergy"
            @remove="removeAllergy"
          >
            <template #item="{ item, index }">
              <AllergyCard :allergy="item" :index="index" @remove="removeAllergy(index)" @update="updateAllergy" />
            </template>
          </DynamicCollection>
        </div>

        <!-- Section 4: Medications -->
        <div class="health-record-form-section">
          <h4 class="section-title">{{ t('preschoolHealthPage.records.medications') }}</h4>
          <DynamicCollection
            :items="medications"
            :emptyMessage="t('preschoolHealthPage.records.noRecords') || 'No records added.'"
            :addButtonLabel="t('common.add') || 'Add Medication'"
            @add="addMedication"
            @remove="removeMedication"
          >
            <template #item="{ item, index }">
              <MedicationCard :medication="item" :index="index" @remove="removeMedication(index)" @update="updateMedication" />
            </template>
          </DynamicCollection>
        </div>

        <!-- Section 5: Vaccinations -->
        <div class="health-record-form-section">
          <h4 class="section-title">{{ t('preschoolHealthPage.records.vaccinations') }}</h4>
          <DynamicCollection
            :items="vaccinations"
            :emptyMessage="t('preschoolHealthPage.records.noRecords') || 'No records added.'"
            :addButtonLabel="t('common.add') || 'Add Vaccination'"
            @add="addVaccination"
            @remove="removeVaccination"
          >
            <template #item="{ item, index }">
              <VaccinationCard :vaccination="item" :index="index" @remove="removeVaccination(index)" @update="updateVaccination" />
            </template>
          </DynamicCollection>
        </div>

        <!-- Section 6: Emergency Contacts -->
        <div class="health-record-form-section">
          <h4 class="section-title">{{ t('preschoolHealthPage.records.emergencyContacts') }}</h4>
          <DynamicCollection
            :items="emergencyContacts"
            :emptyMessage="t('preschoolHealthPage.records.noRecords') || 'No records added.'"
            :addButtonLabel="t('common.add') || 'Add Contact'"
            @add="addEmergencyContact"
            @remove="removeEmergencyContact"
          >
            <template #item="{ item, index }">
              <EmergencyContactCard :contact="item" :index="index" @remove="removeEmergencyContact(index)" @update="updateEmergencyContact" />
            </template>
          </DynamicCollection>
        </div>
      </div>

      <div class="health-record-form-footer">
        <Button
          type="button"
          variant="secondary"
          size="md"
          rounded="lg"
          :label="t('common.cancel')"
          :disabled="loading"
          @click="closeDialog"
        />
        <Button
          type="button"
          variant="primary"
          size="md"
          rounded="lg"
          :label="t('common.save')"
          :loading="loading"
          @click="submitForm"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.health-record-form-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  z-index: 40;
  padding: 2rem 0;
  overflow-y: auto;
}

.health-record-form-dialog {
  background: #fff;
  border-radius: 1rem;
  box-shadow: 0 20px 50px -30px rgba(0, 0, 0, 0.3);
  max-width: 48rem;
  width: 90%;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
}

.health-record-form-header {
  padding: 1.5rem;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.health-record-form-header h3 {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 700;
  color: #0f172a;
}

.health-record-form-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #64748b;
  padding: 0;
  line-height: 1;
}

.health-record-form-close:hover {
  color: #0f172a;
}

.health-record-form-body {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.health-record-form-summary {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(10rem, 1fr));
  gap: 1rem;
  padding: 1rem;
  background: #f8fafc;
  border-radius: 0.75rem;
}

.health-record-form-summary-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.health-record-form-label {
  font-size: 0.85rem;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
}

.health-record-form-value {
  font-size: 0.95rem;
  color: #0f172a;
  font-weight: 500;
}

.health-record-form-error {
  padding: 1rem;
  background: #fff1f2;
  border: 1px solid #fecaca;
  border-radius: 0.75rem;
  color: #b91c1c;
  font-size: 0.9rem;
}

.health-record-form-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.section-title {
  margin: 0;
  font-size: 1rem;
  font-weight: 700;
  color: #0f172a;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #1d4ed8;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(12rem, 1fr));
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.health-record-form-input,
.health-record-form-textarea {
  padding: 0.65rem 0.85rem;
  border: 1px solid #cbd5e1;
  border-radius: 0.6rem;
  font-size: 0.9rem;
  color: #0f172a;
  background: #fff;
  font-family: inherit;
}

.health-record-form-input:focus,
.health-record-form-textarea:focus {
  outline: none;
  border-color: #1d4ed8;
  box-shadow: 0 0 0 3px rgba(29, 78, 216, 0.1);
}

.health-record-form-textarea {
  resize: vertical;
}

.health-record-form-footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid #e2e8f0;
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
}

@media (max-width: 640px) {
  .health-record-form-overlay {
    padding: 0;
  }

  .health-record-form-dialog {
    max-width: 100%;
    width: 100%;
    max-height: 100vh;
    border-radius: 0;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }
}
</style>
