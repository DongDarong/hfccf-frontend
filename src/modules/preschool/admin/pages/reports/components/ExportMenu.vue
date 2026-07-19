<script setup>
import { ref } from 'vue'
import Button from '@/components/buttons/Button.vue'
import { useLanguage } from '@/composables/useLanguage'

defineProps({
  loading: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['export'])

const { t } = useLanguage()
const isOpen = ref(false)

const exportOptions = [
  {
    format: 'pdf',
    label: 'PDF Document',
    icon: 'pi-file-pdf',
    description: 'High-quality PDF file for printing',
    color: 'rose',
  },
  {
    format: 'excel',
    label: 'Excel Spreadsheet',
    icon: 'pi-file-excel',
    description: 'Editable Excel file with multiple sheets',
    color: 'emerald',
  },
  {
    format: 'csv',
    label: 'CSV File',
    icon: 'pi-file',
    description: 'Comma-separated values for data import',
    color: 'blue',
  },
  {
    format: 'print',
    label: 'Print',
    icon: 'pi-print',
    description: 'Open print dialog in your browser',
    color: 'slate',
  },
]

function handleExport(format) {
  emit('export', format)
  isOpen.value = false
}

const colorMap = {
  rose: 'hover:bg-rose-50',
  emerald: 'hover:bg-emerald-50',
  blue: 'hover:bg-blue-50',
  slate: 'hover:bg-slate-50',
}
</script>

<template>
  <div class="relative">
    <!-- Export Button -->
    <Button
      type="button"
      variant="primary"
      size="md"
      rounded="xl"
      :loading="loading"
      @click="isOpen = !isOpen"
      class="flex items-center gap-2"
    >
      <i class="pi pi-download" />
      {{ t('preschoolReportsCenterPage.exports.export') || 'Export Report' }}
    </Button>

    <!-- Export Dropdown Menu -->
    <transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="translate-y-1 opacity-0"
      enter-to-class="translate-y-0 opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="translate-y-0 opacity-100"
      leave-to-class="translate-y-1 opacity-0"
    >
      <div
        v-if="isOpen"
        class="absolute right-0 top-full z-50 mt-2 w-56 rounded-xl border border-slate-200 bg-white shadow-lg"
      >
        <div class="space-y-1 p-2">
          <button
            v-for="option in exportOptions"
            :key="option.format"
            type="button"
            @click="handleExport(option.format)"
            :disabled="loading"
            :class="[
              'w-full rounded-lg px-4 py-3 text-left transition-colors',
              colorMap[option.color],
              loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
            ]"
          >
            <div class="flex items-start gap-3">
              <i :class="`pi ${option.icon} text-lg text-slate-600 mt-0.5`" />
              <div class="flex-1">
                <p class="font-semibold text-slate-900">{{ option.label }}</p>
                <p class="text-xs text-slate-500">{{ option.description }}</p>
              </div>
            </div>
          </button>
        </div>
      </div>
    </transition>

    <!-- Backdrop -->
    <transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isOpen"
        @click="isOpen = false"
        class="fixed inset-0 z-40"
      />
    </transition>
  </div>
</template>
