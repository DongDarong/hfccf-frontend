<script setup>
import AddAdminProfileImageField from '@/modules/super-admin/components/admin-management/AddAdminProfileImageField.vue'
import AddAdminIdentityFields from '@/modules/super-admin/components/admin-management/AddAdminIdentityFields.vue'
import AddAdminPermissionsField from '@/modules/super-admin/components/admin-management/AddAdminPermissionsField.vue'
import AddAdminPasswordFields from '@/modules/super-admin/components/admin-management/AddAdminPasswordFields.vue'

defineOptions({
  name: 'AddTeacherFormFields',
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
  name: {
    type: String,
    default: '',
  },
  email: {
    type: String,
    default: '',
  },
  phone: {
    type: String,
    default: '',
  },
  role: {
    type: String,
    default: '',
  },
  status: {
    type: String,
    default: '',
  },
  password: {
    type: String,
    default: '',
  },
  confirmPassword: {
    type: String,
    default: '',
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
  'update:name',
  'update:email',
  'update:phone',
  'update:role',
  'update:status',
  'update:password',
  'update:confirmPassword',
  'profile-image-change',
  'profile-image-remove',
  'toggle-permission',
  'toggle-password',
  'toggle-confirm-password',
])
</script>

<template>
  <div class="add-teacher-form-fields">
    <AddAdminProfileImageField
      class="add-teacher-form-fields__field add-teacher-form-fields__field--full"
      title="Profile Image"
      :preview="profileImagePreview"
      remove-label="Remove image"
      :disabled="isLocked"
      @change="emit('profile-image-change', $event)"
      @remove="emit('profile-image-remove')"
    />

    <AddAdminIdentityFields
      class="add-teacher-form-fields__field add-teacher-form-fields__field--full"
      :name="name"
      :email="email"
      :phone="phone"
      :role="role"
      :status="status"
      :role-options="roleOptions"
      :status-options="statusOptions"
      :disabled="isLocked"
      name-label="Full Name"
      email-label="Email"
      phone-label="Phone"
      role-label-text="Role"
      status-label-text="Status"
      name-placeholder="Enter full name"
      email-placeholder="teacher@example.com"
      phone-placeholder="Enter phone number"
      :role-label="roleLabel"
      :status-label="statusLabel"
      @update:name="emit('update:name', $event)"
      @update:email="emit('update:email', $event)"
      @update:phone="emit('update:phone', $event)"
      @update:role="emit('update:role', $event)"
      @update:status="emit('update:status', $event)"
    />

    <AddAdminPermissionsField
      class="add-teacher-form-fields__field add-teacher-form-fields__field--full"
      title="Permissions"
      :permissions="permissions"
      :options="permissionOptions"
      :disabled="isLocked"
      :permission-label="permissionLabel"
      @toggle="emit('toggle-permission', $event)"
    />

    <AddAdminPasswordFields
      class="add-teacher-form-fields__field add-teacher-form-fields__field--full"
      :password="password"
      :confirm-password="confirmPassword"
      :disabled="isLocked"
      :password-visible="isPasswordVisible"
      :confirm-password-visible="isConfirmPasswordVisible"
      password-label="Password"
      confirm-password-label="Confirm Password"
      password-placeholder="Minimum 6 characters"
      confirm-password-placeholder="Re-enter password"
      show-password-label="Show password"
      hide-password-label="Hide password"
      @update:password="emit('update:password', $event)"
      @update:confirm-password="emit('update:confirmPassword', $event)"
      @toggle-password="emit('toggle-password')"
      @toggle-confirm-password="emit('toggle-confirm-password')"
    />
  </div>
</template>

<style scoped>
.add-teacher-form-fields {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
}

.add-teacher-form-fields__field {
  display: flex;
  flex-direction: column;
  gap: 0.42rem;
}

.add-teacher-form-fields__field--full {
  grid-column: 1 / -1;
}

@media (max-width: 768px) {
  .add-teacher-form-fields {
    grid-template-columns: 1fr;
  }
}
</style>
