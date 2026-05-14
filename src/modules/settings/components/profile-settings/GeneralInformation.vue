<script setup>
import { computed, ref, watch } from 'vue'
import { useLanguage } from '@/composables/useLanguage'
import UiForm from '@/components/forms/Form.vue'
import InputText from 'primevue/inputtext'
import Select from 'primevue/select'
import Textarea from 'primevue/textarea'

const props = defineProps({
  user: {
    type: Object,
    required: true,
  },
})
const emit = defineEmits(['submit'])

const { t } = useLanguage()

const form = ref({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  department: '',
  bio: '',
})

const departments = [
  { label: 'Operations', value: 'Operations' },
  { label: 'Education', value: 'Education' },
  { label: 'Sports', value: 'Sports' },
  { label: 'Administration', value: 'Administration' },
]

const currentDepartment = computed(() => form.value.department || props.user.department || '')

function syncForm(user) {
  form.value = {
    firstName: user?.firstName || user?.name?.split?.(' ')?.[0] || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    department: user?.department || '',
    bio: user?.bio || '',
  }
}

watch(
  () => props.user,
  (nextUser) => {
    syncForm(nextUser || {})
  },
  { immediate: true, deep: true },
)

function handleSubmit() {
  emit('submit', { ...form.value })
}
</script>

<template>
  <UiForm
    :title="t('pages.profile.general.title')"
    :description="t('pages.profile.general.description')"
    :submit-text="t('common.saveChanges')"
    show-cancel
    @submit="handleSubmit"
  >
    <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
      <div class="flex flex-col gap-2">
        <label class="text-sm font-bold text-surface-900" for="firstName">
          {{ t('pages.profile.general.firstName') }}
        </label>
        <InputText
          id="firstName"
          v-model="form.firstName"
          :placeholder="t('pages.profile.general.firstNamePlaceholder')"
          class="w-full"
        />
      </div>

      <div class="flex flex-col gap-2">
        <label class="text-sm font-bold text-surface-900" for="lastName">
          {{ t('pages.profile.general.lastName') }}
        </label>
        <InputText
          id="lastName"
          v-model="form.lastName"
          :placeholder="t('pages.profile.general.lastNamePlaceholder')"
          class="w-full"
        />
      </div>

      <div class="flex flex-col gap-2">
        <label class="text-sm font-bold text-surface-900" for="email">
          {{ t('pages.profile.general.email') }}
        </label>
        <InputText
          id="email"
          v-model="form.email"
          type="email"
          :placeholder="t('pages.profile.general.emailPlaceholder')"
          class="w-full"
        />
      </div>

      <div class="flex flex-col gap-2">
        <label class="text-sm font-bold text-surface-900" for="phone">
          {{ t('pages.profile.general.phone') }}
        </label>
        <InputText
          id="phone"
          v-model="form.phone"
          :placeholder="t('pages.profile.general.phonePlaceholder')"
          class="w-full"
        />
      </div>

      <div class="flex flex-col gap-2 sm:col-span-2">
        <label class="text-sm font-bold text-surface-900" for="department">
          {{ t('pages.profile.general.department') }}
        </label>
        <Select
          id="department"
          v-model="form.department"
          :options="departments"
          option-label="label"
          option-value="value"
          :placeholder="t('pages.profile.general.departmentPlaceholder')"
          class="w-full"
        />
      </div>

      <div class="flex flex-col gap-2 sm:col-span-2">
        <label class="text-sm font-bold text-surface-900" for="bio">
          {{ t('pages.profile.general.bio') }}
        </label>
        <Textarea
          id="bio"
          v-model="form.bio"
          rows="4"
          :placeholder="t('pages.profile.general.bioPlaceholder')"
          class="w-full"
        />
      </div>
    </div>

    <div class="rounded-xl border border-sky-100 bg-sky-50 px-4 py-3 text-sm leading-6 text-sky-900">
      {{ t('pages.profile.general.description') }}
      <span class="font-bold text-sky-950">{{ currentDepartment || 'Unassigned' }}</span>
    </div>
  </UiForm>
</template>
