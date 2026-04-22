<script setup>
import { computed, reactive, watch } from 'vue'
import Card from 'primevue/card'
import InputText from 'primevue/inputtext'
import Message from 'primevue/message'
import Button from '@/components/buttons/Button.vue'
import users from '@/mocks/users.json'

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

const emit = defineEmits(['resend', 'update:email'])

const form = reactive({
  email: props.email,
})

const touched = reactive({
  email: false,
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
const normalizedEmailKey = computed(() => normalizedEmail.value.toLowerCase())

const matchedSuperAdmin = computed(() =>
  users.find(
    (user) =>
      String(user.email || '').trim().toLowerCase() === normalizedEmailKey.value &&
      String(user.role || '').trim().toLowerCase() === 'superadmin',
  ),
)

const emailError = computed(() => {
  if (!touched.email) return ''
  if (!normalizedEmail.value) return 'Email is required.'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail.value)) {
    return 'Enter a valid email address.'
  }
  if (!matchedSuperAdmin.value) {
    return 'Use a Super Admin email registered in the system.'
  }
  return ''
})

const canContinueToOtp = computed(
  () => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail.value) && Boolean(matchedSuperAdmin.value),
)

const canSubmitCurrentStep = computed(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail.value))

function touchField(field) {
  touched[field] = true
}

function onSubmit() {
  touched.email = true

  if (!canContinueToOtp.value) return

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
            <RouterLink :to="{ name: 'login' }" class="verify-email-back" aria-label="Back to login">
              <i class="pi pi-arrow-left" aria-hidden="true"></i>
            </RouterLink>

            <div class="verify-email-badge" aria-hidden="true">
              <i class="pi pi-envelope"></i>
            </div>
            <div>
              <p class="verify-email-eyebrow">Email verification</p>
              <h2>Find account</h2>
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
            :disabled="!canSubmitCurrentStep"
            :loading="resendLoading"
          >
            <template #iconLeft>
              <i class="pi pi-check-circle" aria-hidden="true"></i>
            </template>
            Continue
          </Button>
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
  display: grid;
  grid-template-columns: auto auto 1fr;
  align-items: center;
  gap: 0.75rem;
  padding-bottom: 0.2rem;
}

.verify-email-back,
.verify-email-badge {
  display: grid;
  flex: 0 0 auto;
  place-items: center;
  border: 1px solid rgba(203, 213, 225, 0.85);
  background: #ffffff;
  color: #0ea5e9;
  box-shadow: 0 12px 22px -18px rgba(15, 23, 42, 0.3);
}

.verify-email-back {
  height: 2.45rem;
  width: 2.45rem;
  border-radius: 999px;
  text-decoration: none;
}

.verify-email-badge {
  height: 3rem;
  width: 3rem;
  border-radius: 1rem;
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

@media (max-width: 639px) {
  :deep(.verify-email-card.p-card .p-card-content) {
    padding: 1rem;
  }

  .verify-email-fields {
    gap: 0.9rem;
  }

  .verify-email-header {
    grid-template-columns: auto 1fr;
  }

  .verify-email-badge {
    display: none;
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
