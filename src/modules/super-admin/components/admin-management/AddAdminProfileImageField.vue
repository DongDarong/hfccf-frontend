<script setup>
defineOptions({
  name: 'AddAdminProfileImageField',
})

defineProps({
  title: {
    type: String,
    required: true,
  },
  removeLabel: {
    type: String,
    required: true,
  },
  preview: {
    type: String,
    default: '',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['change', 'remove'])
</script>

<template>
  <div class="flex flex-col gap-2">
    <span class="text-[0.8rem] font-bold uppercase tracking-[0.03em] text-slate-900">
      {{ title }}
    </span>

    <div class="flex flex-wrap items-center gap-3 rounded-[0.9rem] border border-dashed border-[#c9d9e8] bg-[#f9fcff] p-3">
      <div v-if="preview" class="h-[68px] w-[68px] overflow-hidden rounded-full border-2 border-[#c7d9ea] shadow-[0_6px_14px_-10px_rgba(15,23,42,0.6)]">
        <img :src="preview" alt="Profile preview" class="h-full w-full object-cover" />
      </div>

      <div class="flex flex-wrap items-center gap-2">
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          class="max-w-[260px] text-[0.8rem] text-slate-700"
          :disabled="disabled"
          @change="emit('change', $event)"
        />

        <button
          v-if="preview"
          type="button"
          class="rounded-[0.6rem] border border-rose-200 bg-rose-50 px-3 py-1.5 text-[0.78rem] font-semibold text-rose-700"
          :disabled="disabled"
          @click="emit('remove')"
        >
          {{ removeLabel }}
        </button>
      </div>
    </div>
  </div>
</template>
