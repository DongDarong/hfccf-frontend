<script setup>
import { ref, watch } from 'vue'
import Button from '@/components/buttons/Button.vue'
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
    default: 'add', // 'add' or 'edit'
  },
  loading: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['save', 'close'])

const { t } = useLanguage()

const bloodType = ref('')
const medicalCondition = ref('')
const medicalNotes = ref('')
const validationErrors = ref({})
const submitError = ref('')

watch(
  () => props.profile,
  (profile) => {
    if (profile) {
      bloodType.value = profile.blood_type || ''
      medicalCondition.value = profile.current_conditions ? profile.current_conditions.join(', ') : ''
      medicalNotes.value = profile.medical_notes || ''
    }
  },
  { immediate: true, deep: true }
)

function resetForm() {
  bloodType.value = ''
  medicalCondition.value = ''
  medicalNotes.value = ''
  validationErrors.value = {}
  submitError.value = ''
}

function closeDialog() {
  resetForm()
  emit('close')
}

async function submitForm() {
  validationErrors.value = {}
  submitError.value = ''

  const payload = {
    blood_type: bloodType.value || null,
    current_conditions: medicalCondition.value ? medicalCondition.value.split(',').map(c => c.trim()).filter(Boolean) : null,
    medical_notes: medicalNotes.value || null,
    status: 'active',
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

        <!-- Form Fields -->
        <div class="health-record-form-section">
          <div class="health-record-form-group">
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
            <span v-if="validationErrors.blood_type" class="health-record-form-error-text">
              {{ validationErrors.blood_type[0] }}
            </span>
          </div>

          <div class="health-record-form-group">
            <label class="health-record-form-label">{{ t('preschoolHealthPage.records.medicalCondition') }}</label>
            <input
              v-model="medicalCondition"
              class="health-record-form-input"
              type="text"
              :placeholder="t('preschoolHealthPage.records.conditionsPlaceholder')"
            />
            <div class="health-record-form-hint">{{ t('preschoolHealthPage.records.conditionsHint') }}</div>
            <span v-if="validationErrors.current_conditions" class="health-record-form-error-text">
              {{ validationErrors.current_conditions[0] }}
            </span>
          </div>

          <div class="health-record-form-group">
            <label class="health-record-form-label">{{ t('preschoolHealthPage.records.medicalNotes') }}</label>
            <textarea
              v-model="medicalNotes"
              class="health-record-form-textarea"
              :placeholder="t('preschoolHealthPage.records.notesPlaceholder')"
              rows="4"
            />
            <span v-if="validationErrors.medical_notes" class="health-record-form-error-text">
              {{ validationErrors.medical_notes[0] }}
            </span>
          </div>
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
  align-items: center;
  justify-content: center;
  z-index: 40;
}

.health-record-form-dialog {
  background: #fff;
  border-radius: 1rem;
  box-shadow: 0 20px 50px -30px rgba(0, 0, 0, 0.3);
  max-width: 32rem;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
}

.health-record-form-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e2e8f0;
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
  color: #64748b;
  cursor: pointer;
  padding: 0;
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.health-record-form-close:hover {
  color: #0f172a;
}

.health-record-form-body {
  padding: 1.5rem;
}

.health-record-form-summary {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1.5rem;
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
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #64748b;
}

.health-record-form-value {
  font-size: 0.95rem;
  color: #0f172a;
  font-weight: 500;
}

.health-record-form-error {
  padding: 0.75rem;
  background: #fff1f2;
  border: 1px solid #fecaca;
  border-radius: 0.75rem;
  color: #b91c1c;
  font-size: 0.9rem;
  margin-bottom: 1rem;
}

.health-record-form-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.health-record-form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.health-record-form-input,
.health-record-form-textarea {
  padding: 0.65rem 0.85rem;
  border: 1px solid #cbd5e1;
  border-radius: 0.75rem;
  font-size: 0.95rem;
  font-family: inherit;
  color: #0f172a;
}

.health-record-form-input:focus,
.health-record-form-textarea:focus {
  outline: none;
  border-color: #7c3aed;
  box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.1);
}

.health-record-form-textarea {
  resize: vertical;
  min-height: 6rem;
}

.health-record-form-hint {
  font-size: 0.8rem;
  color: #64748b;
  font-style: italic;
}

.health-record-form-error-text {
  font-size: 0.8rem;
  color: #b91c1c;
}

.health-record-form-footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid #e2e8f0;
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
}
</style>
