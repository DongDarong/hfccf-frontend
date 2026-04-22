<script setup>
import { computed, reactive, watch } from 'vue'
import Card from 'primevue/card'
import InputText from 'primevue/inputtext'
import Message from 'primevue/message'
import Button from '@/components/buttons/Button.vue'

const props = defineProps({
  email: {
    type: String,
    default: '',
  },
  loading: {
    type: Boolean,
    default: false,
  },
  resendLoading: {
    type: Boolean,
    default: false,
  },
  errorMessage: {
    type: String,
    default: '',
  },
  successMessage: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['verify', 'resend', 'update:email'])

const form = reactive({
  email: props.email,
  code: '',
})

const touched = reactive({
  email: false,
  code: false,
})

watch(
  () => props.email,
  (value) => {
    if (value !== form.email) form.email = value
  },
)

watch(
  () => form.email,
  (value) => {
    emit('update:email', value)
  },
)

const normalizedEmail = computed(() => form.email.trim())
const normalizedCode = computed(() => form.code.replace(/\D/g, '').slice(0, 6))

const emailError = computed(() => {
  if (!touched.email) return ''
  if (!normalizedEmail.value) return 'Email is required.'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail.value)) {
    return 'Enter a valid email address.'
  }
  return ''
})

const codeError = computed(() => {
  if (!touched.code) return ''
  if (!normalizedCode.value) return 'Verification code is required.'
  if (normalizedCode.value.length !== 6) return 'Enter the 6-digit code.'
  return ''
})

const isFormValid = computed(
  () =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail.value) &&
    normalizedCode.value.length === 6,
)

function touchField(field) {
  touched[field] = true
}

function onCodeInput(value) {
  form.code = String(value || '').replace(/\D/g, '').slice(0, 6)
}

function onSubmit() {
  touched.email = true
  touched.code = true

  if (!isFormValid.value) return

  emit('verify', {
    email: normalizedEmail.value,
    code: normalizedCode.value,
  })
}

function onResend() {
  touched.email = true

  if (emailError.value || !normalizedEmail.value) return

  emit('resend', {
    email: normalizedEmail.value,
  })
}
</script>

<template>
  <div class="verify-email mx-auto w-full max-w-md">
    <Card class="verify-email-card border-0">
      <template #content>
        <form class="verify-email-fields" @submit.prevent="onSubmit">
          <div class="verify-email-header">
            <div class="verify-email-badge" aria-hidden="true">
              <i class="pi pi-envelope"></i>
            </div>
            <div>
              <p class="verify-email-eyebrow">Email verification</p>
              <h2>Check your inbox</h2>
            </div>
          </div>

          <div class="verify-email-field">
            <label for="verifyEmail">Email</label>
            <div class="verify-email-control">
              <i class="pi pi-at verify-email-control-icon" aria-hidden="true"></i>
              <InputText
                id="verifyEmail"
                v-model="form.email"
                type="email"
                autocomplete="email"
                class="verify-email-input w-full"
                :class="{ 'verify-email-input--invalid': emailError }"
                :aria-invalid="Boolean(emailError)"
                :aria-describedby="emailError ? 'verify-email-error' : undefined"
                placeholder="name@hfccf.org"
                @blur="touchField('email')"
              />
            </div>
            <p v-if="emailError" id="verify-email-error" class="verify-email-error">
              <i class="pi pi-exclamation-circle" aria-hidden="true"></i>
              {{ emailError }}
            </p>
          </div>

          <div class="verify-email-field">
            <label for="verifyCode">Code</label>
            <div class="verify-email-control">
              <i class="pi pi-key verify-email-control-icon" aria-hidden="true"></i>
              <InputText
                id="verifyCode"
                :model-value="form.code"
                inputmode="numeric"
                autocomplete="one-time-code"
                maxlength="6"
                class="verify-email-input verify-email-code w-full"
                :class="{ 'verify-email-input--invalid': codeError }"
                :aria-invalid="Boolean(codeError)"
                :aria-describedby="codeError ? 'verify-code-error' : undefined"
                placeholder="000000"
                @update:model-value="onCodeInput"
                @blur="touchField('code')"
              />
            </div>
            <p v-if="codeError" id="verify-code-error" class="verify-email-error">
              <i class="pi pi-exclamation-circle" aria-hidden="true"></i>
              {{ codeError }}
            </p>
          </div>

          <Message v-if="errorMessage" severity="error" :closable="false">
            {{ errorMessage }}
          </Message>
          <Message v-if="successMessage" severity="success" :closable="false">
            {{ successMessage }}
          </Message>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            rounded="xl"
            block
            :disabled="!isFormValid"
            :loading="loading"
          >
            <template #iconLeft>
              <i class="pi pi-check-circle" aria-hidden="true"></i>
            </template>
            Verify email
          </Button>

          <button
            type="button"
            class="verify-email-resend"
            :disabled="resendLoading"
            @click="onResend"
          >
            {{ resendLoading ? 'Sending...' : 'Resend code' }}
          </button>
        </form>
      </template>
    </Card>
  </div>
</template>

<style scoped>
:deep(.verify-email-card.p-card) {
  border: 1px solid rgba(226, 232, 240, 0.88);
  border-radius: 1.35rem;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.98), rgba(248, 250, 252, 0.95)),
    linear-gradient(135deg, rgba(0, 174, 239, 0.07), transparent 42%);
  box-shadow: 0 18px 38px -30px rgba(15, 23, 42, 0.34);
}

:deep(.verify-email-card.p-card .p-card-body) {
  padding: 0;
}

:deep(.verify-email-card.p-card .p-card-content) {
  padding: 1.35rem;
}

.verify-email-fields {
  display: grid;
  gap: 1rem;
}

.verify-email-header {
  display: flex;
  align-items: center;
  gap: 0.9rem;
  padding-bottom: 0.2rem;
}

.verify-email-badge {
  display: grid;
  height: 3rem;
  width: 3rem;
  flex: 0 0 auto;
  place-items: center;
  border: 1px solid rgba(203, 213, 225, 0.85);
  border-radius: 1rem;
  background: #ffffff;
  color: #0ea5e9;
  box-shadow: 0 12px 22px -18px rgba(15, 23, 42, 0.3);
}

.verify-email-eyebrow {
  margin: 0;
  color: #0369a1;
  font-size: 0.68rem;
  font-weight: 900;
  text-transform: uppercase;
}

.verify-email-header h2 {
  margin: 0.25rem 0 0;
  color: #0f172a;
  font-size: 1.35rem;
  font-weight: 900;
  line-height: 1.2;
}

.verify-email-field {
  display: grid;
  gap: 0.45rem;
}

.verify-email-field label {
  color: #334155;
  font-size: 0.9rem;
  font-weight: 800;
}

.verify-email-control {
  position: relative;
}

.verify-email-control-icon {
  position: absolute;
  top: 50%;
  left: 0.95rem;
  z-index: 2;
  color: #0ea5e9;
  font-size: 0.95rem;
  transform: translateY(-50%);
}

:deep(.verify-email-input.p-inputtext) {
  width: 100%;
  min-height: 3.15rem;
  border-radius: 1rem;
  border: 1px solid #dbe4ee;
  background: #ffffff;
  padding: 0.82rem 0.95rem 0.82rem 2.8rem;
  color: #0f172a;
  font-size: 0.95rem;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease,
    background-color 0.2s ease;
}

:deep(.verify-email-input.p-inputtext::placeholder) {
  color: #94a3b8;
}

:deep(.verify-email-input.p-inputtext:enabled:hover) {
  border-color: #7dd3fc;
}

:deep(.verify-email-input.p-inputtext:enabled:focus) {
  border-color: #0ea5e9;
  box-shadow:
    0 0 0 3px rgba(14, 165, 233, 0.14),
    0 12px 22px -20px rgba(14, 165, 233, 0.58);
}

:deep(.verify-email-code.p-inputtext) {
  font-weight: 900;
  letter-spacing: 0.18em;
}

:deep(.verify-email-input--invalid.p-inputtext) {
  border-color: #f43f5e;
  box-shadow: 0 0 0 3px rgba(244, 63, 94, 0.1);
}

.verify-email-error {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  color: #e11d48;
  font-size: 0.78rem;
  font-weight: 800;
}

.verify-email-resend {
  justify-self: center;
  border: 0;
  background: transparent;
  color: #0369a1;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 900;
}

.verify-email-resend:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

@media (max-width: 639px) {
  :deep(.verify-email-card.p-card .p-card-content) {
    padding: 1rem;
  }

  .verify-email-fields {
    gap: 0.9rem;
  }

  :deep(.verify-email-input.p-inputtext) {
    min-height: 2.95rem;
    padding: 0.74rem 0.9rem 0.74rem 2.65rem;
    font-size: 0.92rem;
  }

  .verify-email-control-icon {
    left: 0.9rem;
  }
}
</style>
