<script setup>
import { computed } from 'vue'
import Select from 'primevue/select'

defineOptions({
  name: 'AssessmentStudentSelector',
})

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: null,
  },
  options: {
    type: Array,
    required: true,
    // Expected: [{ label, value, raw }, ...]
  },
  loading: {
    type: Boolean,
    default: false,
  },
  error: {
    type: String,
    default: '',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  clearable: {
    type: Boolean,
    default: true,
  },
})

const emit = defineEmits(['update:modelValue', 'change'])

const selectedValue = computed({
  get: () => props.modelValue,
  set: (value) => {
    emit('update:modelValue', value)
    const selected = props.options.find(opt => opt.value === value)
    if (selected) {
      emit('change', selected)
    }
  },
})

const sortedOptions = computed(() => {
  return [...props.options].sort((a, b) => a.label.localeCompare(b.label))
})
</script>

<template>
  <div class="space-y-2">
    <!-- Label -->
    <label class="block text-sm font-medium text-gray-700">
      👥 Select Student
      <span class="text-red-500">*</span>
    </label>

    <!-- Select -->
    <Select
      v-model="selectedValue"
      :options="sortedOptions"
      option-label="label"
      option-value="value"
      placeholder="Choose a student..."
      :loading="loading"
      :disabled="disabled || loading"
      :show-clear="clearable && selectedValue"
      filter
      class="w-full"
    />

    <!-- Error Message -->
    <p v-if="error" class="text-sm text-red-600">
      ❌ {{ error }}
    </p>

    <!-- Help Text -->
    <p class="text-xs text-gray-500">
      Search by student name or code
    </p>
  </div>
</template>
