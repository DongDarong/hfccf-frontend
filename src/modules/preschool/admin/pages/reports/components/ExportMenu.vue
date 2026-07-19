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
  <div class="flex flex-wrap gap-2">
    <Button
      v-for="option in exportOptions"
      :key="option.format"
      type="button"
      :variant="option.format === 'pdf' ? 'primary' : 'ghost'"
      size="md"
      rounded="lg"
      :loading="loading"
      @click="handleExport(option.format)"
      class="flex items-center gap-2"
    >
      <i :class="`pi ${option.icon}`" />
      {{ option.label }}
    </Button>
  </div>
</template>
