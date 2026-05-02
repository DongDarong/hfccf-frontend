<script setup>
import { computed, ref } from 'vue'
import { useLanguage } from '@/composables/useLanguage'
import UiForm from '@/components/forms/Form.vue'
import InputText from 'primevue/inputtext'

const emit = defineEmits(['submit'])
const { language, t } = useLanguage()
const isKh = computed(() => language.value === 'KH')

const form = ref({
  currentPassword: '',
  newPassword: '',
  confirmNewPassword: '',
})

// Group labels in one computed block so the template stays lean and the copy is easy to update later.
const labels = computed(() => ({
  title: isKh.value ? 'សុវត្ថិភាព' : 'Security',
  description: isKh.value
    ? 'ធ្វើបច្ចុប្បន្នភាពពាក្យសម្ងាត់របស់អ្នកដើម្បីរក្សាគណនីឱ្យមានសុវត្ថិភាព។'
    : 'Update your password to keep your account protected.',
  currentPassword: isKh.value ? 'ពាក្យសម្ងាត់បច្ចុប្បន្ន' : 'Current Password',
  newPassword: isKh.value ? 'ពាក្យសម្ងាត់ថ្មី' : 'New Password',
  confirmNewPassword: isKh.value ? 'បញ្ជាក់ពាក្យសម្ងាត់ថ្មី' : 'Confirm New Password',
  currentPasswordPlaceholder: isKh.value
    ? 'បញ្ចូលពាក្យសម្ងាត់បច្ចុប្បន្នរបស់អ្នក'
    : 'Enter your current password',
  newPasswordPlaceholder: isKh.value ? 'បញ្ចូលពាក្យសម្ងាត់ថ្មី' : 'Enter a new password',
  confirmNewPasswordPlaceholder: isKh.value
    ? 'បញ្ចូលពាក្យសម្ងាត់ថ្មីម្តងទៀត'
    : 'Re-enter your new password',
}))

function handleSubmit() {
  // Emit a copied payload so the page can own save behavior and user feedback.
  emit('submit', { ...form.value })
}
</script>

<template>
  <UiForm
    :title="labels.title"
    :description="labels.description"
    :submit-text="t('common.saveChanges')"
    show-cancel
    @submit="handleSubmit"
  >
    <div class="grid grid-cols-1 gap-6">
      <div class="flex flex-col gap-2">
        <label class="text-sm font-bold text-surface-900" for="currentPassword">
          {{ labels.currentPassword }}
        </label>
        <InputText
          id="currentPassword"
          v-model="form.currentPassword"
          type="password"
          :placeholder="labels.currentPasswordPlaceholder"
          class="w-full"
        />
      </div>

      <div class="flex flex-col gap-2">
        <label class="text-sm font-bold text-surface-900" for="newPassword">
          {{ labels.newPassword }}
        </label>
        <InputText
          id="newPassword"
          v-model="form.newPassword"
          type="password"
          :placeholder="labels.newPasswordPlaceholder"
          class="w-full"
        />
      </div>

      <div class="flex flex-col gap-2">
        <label class="text-sm font-bold text-surface-900" for="confirmNewPassword">
          {{ labels.confirmNewPassword }}
        </label>
        <InputText
          id="confirmNewPassword"
          v-model="form.confirmNewPassword"
          type="password"
          :placeholder="labels.confirmNewPasswordPlaceholder"
          class="w-full"
        />
      </div>
    </div>
  </UiForm>
</template>
