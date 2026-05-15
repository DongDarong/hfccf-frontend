<script setup>
import ShowPassword from '@/assets/icons/ShowPassword.vue'

defineOptions({
  name: 'AddAdminPasswordFields',
})

defineProps({
  password: {
    type: String,
    default: '',
  },
  confirmPassword: {
    type: String,
    default: '',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  passwordVisible: {
    type: Boolean,
    default: false,
  },
  confirmPasswordVisible: {
    type: Boolean,
    default: false,
  },
  passwordLabel: {
    type: String,
    required: true,
  },
  confirmPasswordLabel: {
    type: String,
    required: true,
  },
  passwordPlaceholder: {
    type: String,
    required: true,
  },
  confirmPasswordPlaceholder: {
    type: String,
    required: true,
  },
  showPasswordLabel: {
    type: String,
    required: true,
  },
  hidePasswordLabel: {
    type: String,
    required: true,
  },
})

const emit = defineEmits([
  'update:password',
  'update:confirmPassword',
  'toggle-password',
  'toggle-confirm-password',
])
</script>

<template>
  <div class="grid grid-cols-1 gap-4">
    <label class="flex flex-col gap-2">
      <span class="text-[0.8rem] font-bold uppercase tracking-[0.03em] text-slate-900">{{ passwordLabel }}</span>
      <div class="relative">
        <input
          :value="password"
          :type="passwordVisible ? 'text' : 'password'"
          class="w-full rounded-[0.75rem] border border-[#d4dde8] bg-[#fcfdff] px-3 py-[0.68rem] pr-11 text-[0.88rem] text-slate-900 outline-none transition focus:border-[var(--hope-o-cyan-blue)] focus:bg-white focus:shadow-[0_0_0_3px_rgba(0,174,239,0.15)]"
          :placeholder="passwordPlaceholder"
          :disabled="disabled"
          @input="emit('update:password', $event.target.value)"
        />
        <button
          type="button"
          class="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-slate-500 transition hover:text-slate-700"
          :aria-label="passwordVisible ? hidePasswordLabel : showPasswordLabel"
          :title="passwordVisible ? hidePasswordLabel : showPasswordLabel"
          :disabled="disabled"
          @click="emit('toggle-password')"
        >
          <ShowPassword :visible="passwordVisible" :size="18" />
        </button>
      </div>
    </label>

    <label class="flex flex-col gap-2">
      <span class="text-[0.8rem] font-bold uppercase tracking-[0.03em] text-slate-900">{{ confirmPasswordLabel }}</span>
      <div class="relative">
        <input
          :value="confirmPassword"
          :type="confirmPasswordVisible ? 'text' : 'password'"
          class="w-full rounded-[0.75rem] border border-[#d4dde8] bg-[#fcfdff] px-3 py-[0.68rem] pr-11 text-[0.88rem] text-slate-900 outline-none transition focus:border-[var(--hope-o-cyan-blue)] focus:bg-white focus:shadow-[0_0_0_3px_rgba(0,174,239,0.15)]"
          :placeholder="confirmPasswordPlaceholder"
          :disabled="disabled"
          @input="emit('update:confirmPassword', $event.target.value)"
        />
        <button
          type="button"
          class="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-slate-500 transition hover:text-slate-700"
          :aria-label="confirmPasswordVisible ? hidePasswordLabel : showPasswordLabel"
          :title="confirmPasswordVisible ? hidePasswordLabel : showPasswordLabel"
          :disabled="disabled"
          @click="emit('toggle-confirm-password')"
        >
          <ShowPassword :visible="confirmPasswordVisible" :size="18" />
        </button>
      </div>
    </label>
  </div>
</template>
