<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import AddAdminProfileImageField from '@/modules/super-admin/components/admin-management/AddAdminProfileImageField.vue'
import AddAdminIdentityFields from '@/modules/super-admin/components/admin-management/AddAdminIdentityFields.vue'
import AddAdminPermissionsField from '@/modules/super-admin/components/admin-management/AddAdminPermissionsField.vue'
import AddAdminPasswordFields from '@/modules/super-admin/components/admin-management/AddAdminPasswordFields.vue'

defineOptions({
  name: 'AddCoachFormFields',
})

defineProps({
  profileImagePreview: {
    type: String,
    default: '',
  },
  roleOptions: {
    type: Array,
    default: () => [],
  },
  statusOptions: {
    type: Array,
    default: () => [],
  },
  permissionOptions: {
    type: Array,
    default: () => [],
  },
  permissions: {
    type: Array,
    default: () => [],
  },
  form: {
    type: Object,
    required: true,
  },
  isLocked: {
    type: Boolean,
    default: false,
  },
  isPasswordVisible: {
    type: Boolean,
    default: false,
  },
  isConfirmPasswordVisible: {
    type: Boolean,
    default: false,
  },
  roleLabel: {
    type: Function,
    required: true,
  },
  statusLabel: {
    type: Function,
    required: true,
  },
  permissionLabel: {
    type: Function,
    required: true,
  },
})

const emit = defineEmits([
  'profile-image-change',
  'profile-image-remove',
  'toggle-permission',
  'toggle-password',
  'toggle-confirm-password',
])

const { t } = useI18n()
const labels = computed(() => ({
  profileImage: t('sportAddCoach.profileImage'),
  removeImage: t('sportAddCoach.removeImage'),
  fullName: t('sportAddCoach.fullName'),
  email: t('sportAddCoach.email'),
  phone: t('sportAddCoach.phone'),
  role: t('sportAddCoach.role'),
  status: t('sportAddCoach.status'),
  permissions: t('sportAddCoach.permissions'),
  password: t('sportAddCoach.password'),
  confirmPassword: t('sportAddCoach.confirmPassword'),
  showPassword: t('sportAddCoach.showPassword'),
  hidePassword: t('sportAddCoach.hidePassword'),
}))
const placeholders = computed(() => ({
  fullName: t('sportAddCoach.enterFullName'),
  email: t('sportAddCoach.emailPlaceholder'),
  phone: t('sportAddCoach.phonePlaceholder'),
  password: t('sportAddCoach.minimumPassword'),
  confirmPassword: t('sportAddCoach.reenterPassword'),
}))
</script>

<template>
  <div class="add-coach-form-fields">
    <AddAdminProfileImageField
      class="add-coach-form-fields__field add-coach-form-fields__field--full"
      :title="labels.profileImage"
      :preview="profileImagePreview"
      :remove-label="labels.removeImage"
      :disabled="isLocked"
      @change="emit('profile-image-change', $event)"
      @remove="emit('profile-image-remove')"
    />

    <AddAdminIdentityFields
      class="add-coach-form-fields__field add-coach-form-fields__field--full"
      v-model:name="form.name"
      v-model:email="form.email"
      v-model:phone="form.phone"
      v-model:role="form.role"
      v-model:status="form.status"
      :role-options="roleOptions"
      :status-options="statusOptions"
      :disabled="isLocked"
      :name-label="labels.fullName"
      :email-label="labels.email"
      :phone-label="labels.phone"
      :role-label-text="labels.role"
      :status-label-text="labels.status"
      :name-placeholder="placeholders.fullName"
      :email-placeholder="placeholders.email"
      :phone-placeholder="placeholders.phone"
      :role-label="roleLabel"
      :status-label="statusLabel"
    />

    <AddAdminPermissionsField
      class="add-coach-form-fields__field add-coach-form-fields__field--full"
      :title="labels.permissions"
      :permissions="permissions"
      :options="permissionOptions"
      :disabled="isLocked"
      :permission-label="permissionLabel"
      @toggle="emit('toggle-permission', $event)"
    />

    <AddAdminPasswordFields
      class="add-coach-form-fields__field add-coach-form-fields__field--full"
      v-model:password="form.password"
      v-model:confirmPassword="form.confirmPassword"
      :disabled="isLocked"
      :password-visible="isPasswordVisible"
      :confirm-password-visible="isConfirmPasswordVisible"
      :password-label="labels.password"
      :confirm-password-label="labels.confirmPassword"
      :password-placeholder="placeholders.password"
      :confirm-password-placeholder="placeholders.confirmPassword"
      :show-password-label="labels.showPassword"
      :hide-password-label="labels.hidePassword"
      @toggle-password="emit('toggle-password')"
      @toggle-confirm-password="emit('toggle-confirm-password')"
    />
  </div>
</template>

<style scoped>
.add-coach-form-fields {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
}

.add-coach-form-fields__field {
  display: flex;
  flex-direction: column;
  gap: 0.42rem;
}

.add-coach-form-fields__field--full {
  grid-column: 1 / -1;
}

@media (max-width: 768px) {
  .add-coach-form-fields {
    grid-template-columns: 1fr;
  }
}
</style>
