<script setup>
defineOptions({
  name: 'AddAdminPermissionsField',
})

defineProps({
  title: {
    type: String,
    required: true,
  },
  permissions: {
    type: Array,
    default: () => [],
  },
  options: {
    type: Array,
    default: () => [],
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  permissionLabel: {
    type: Function,
    required: true,
  },
})

const emit = defineEmits(['toggle'])
</script>

<template>
  <div class="flex flex-col gap-2">
    <span class="text-[0.8rem] font-bold uppercase tracking-[0.03em] text-slate-900">
      {{ title }}
    </span>

    <div class="grid grid-cols-1 gap-2 md:grid-cols-2">
      <label
        v-for="permission in options"
        :key="permission"
        class="flex min-h-[2.35rem] cursor-pointer items-center gap-2 rounded-[0.72rem] border border-[#d6e2ee] bg-gradient-to-b from-white to-[#f8fbff] px-3 py-2 text-[0.8rem] font-semibold text-slate-700 transition hover:-translate-y-px hover:border-[#8fc3de] hover:bg-[#f0f8fe]"
        :class="{ 'border-[#67b7df] bg-gradient-to-b from-[#e8f6fe] to-[#dff1fc] text-[#075985] shadow-[0_6px_14px_-12px_rgba(0,87,138,0.8)]': permissions.includes(permission) }"
      >
        <input
          type="checkbox"
          class="h-[0.95rem] w-[0.95rem] shrink-0 accent-[var(--hope-o-cyan-blue)]"
          :checked="permissions.includes(permission)"
          :disabled="disabled"
          @change="emit('toggle', permission)"
        />
        <span class="leading-[1.2]">{{ permissionLabel(permission) }}</span>
      </label>
    </div>
  </div>
</template>
