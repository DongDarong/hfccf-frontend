<script setup>
defineOptions({
  name: 'AddAdminIdentityFields',
})

defineProps({
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
  roleOptions: {
    type: Array,
    default: () => [],
  },
  statusOptions: {
    type: Array,
    default: () => [],
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  nameLabel: {
    type: String,
    required: true,
  },
  emailLabel: {
    type: String,
    required: true,
  },
  phoneLabel: {
    type: String,
    required: true,
  },
  roleLabelText: {
    type: String,
    required: true,
  },
  statusLabelText: {
    type: String,
    required: true,
  },
  namePlaceholder: {
    type: String,
    required: true,
  },
  emailPlaceholder: {
    type: String,
    required: true,
  },
  phonePlaceholder: {
    type: String,
    required: true,
  },
  roleLabel: {
    type: Function,
    required: true,
  },
  statusLabel: {
    type: Function,
    required: true,
  },
})

const emit = defineEmits(['update:name', 'update:email', 'update:phone', 'update:role', 'update:status'])
</script>

<template>
  <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
    <label class="flex flex-col gap-2">
      <span class="text-[0.8rem] font-bold uppercase tracking-[0.03em] text-slate-900">{{ nameLabel }}</span>
      <input
        :value="name"
        type="text"
        class="rounded-[0.75rem] border border-[#d4dde8] bg-[#fcfdff] px-3 py-[0.68rem] text-[0.88rem] text-slate-900 outline-none transition focus:border-[var(--hope-o-cyan-blue)] focus:bg-white focus:shadow-[0_0_0_3px_rgba(0,174,239,0.15)]"
        :placeholder="namePlaceholder"
        :disabled="disabled"
        @input="emit('update:name', $event.target.value)"
      />
    </label>

    <label class="flex flex-col gap-2">
      <span class="text-[0.8rem] font-bold uppercase tracking-[0.03em] text-slate-900">{{ emailLabel }}</span>
      <input
        :value="email"
        type="email"
        class="rounded-[0.75rem] border border-[#d4dde8] bg-[#fcfdff] px-3 py-[0.68rem] text-[0.88rem] text-slate-900 outline-none transition focus:border-[var(--hope-o-cyan-blue)] focus:bg-white focus:shadow-[0_0_0_3px_rgba(0,174,239,0.15)]"
        :placeholder="emailPlaceholder"
        :disabled="disabled"
        @input="emit('update:email', $event.target.value)"
      />
    </label>

    <label class="flex flex-col gap-2">
      <span class="text-[0.8rem] font-bold uppercase tracking-[0.03em] text-slate-900">{{ phoneLabel }}</span>
      <input
        :value="phone"
        type="text"
        class="rounded-[0.75rem] border border-[#d4dde8] bg-[#fcfdff] px-3 py-[0.68rem] text-[0.88rem] text-slate-900 outline-none transition focus:border-[var(--hope-o-cyan-blue)] focus:bg-white focus:shadow-[0_0_0_3px_rgba(0,174,239,0.15)]"
        :placeholder="phonePlaceholder"
        :disabled="disabled"
        @input="emit('update:phone', $event.target.value)"
      />
    </label>

    <label class="flex flex-col gap-2">
      <span class="text-[0.8rem] font-bold uppercase tracking-[0.03em] text-slate-900">{{ roleLabelText }}</span>
      <select
        :value="role"
        class="rounded-[0.75rem] border border-[#d4dde8] bg-[#fcfdff] px-3 py-[0.68rem] text-[0.88rem] text-slate-900 outline-none transition focus:border-[var(--hope-o-cyan-blue)] focus:bg-white focus:shadow-[0_0_0_3px_rgba(0,174,239,0.15)]"
        :disabled="disabled"
        @change="emit('update:role', $event.target.value)"
      >
        <option v-for="option in roleOptions" :key="option" :value="option">
          {{ roleLabel(option) }}
        </option>
      </select>
    </label>

    <label class="flex flex-col gap-2 md:col-span-2">
      <span class="text-[0.8rem] font-bold uppercase tracking-[0.03em] text-slate-900">{{ statusLabelText }}</span>
      <select
        :value="status"
        class="rounded-[0.75rem] border border-[#d4dde8] bg-[#fcfdff] px-3 py-[0.68rem] text-[0.88rem] text-slate-900 outline-none transition focus:border-[var(--hope-o-cyan-blue)] focus:bg-white focus:shadow-[0_0_0_3px_rgba(0,174,239,0.15)]"
        :disabled="disabled"
        @change="emit('update:status', $event.target.value)"
      >
        <option v-for="option in statusOptions" :key="option" :value="option">
          {{ statusLabel(option) }}
        </option>
      </select>
    </label>
  </div>
</template>
