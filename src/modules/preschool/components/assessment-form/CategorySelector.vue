<script setup>
import { computed } from 'vue'
import Select from 'primevue/select'

defineOptions({
  name: 'AssessmentCategorySelector',
})

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: null,
  },
  categories: {
    type: Array,
    required: true,
    // Expected: [{ id, name, code }, ...]
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
})

const emit = defineEmits(['update:modelValue', 'change'])

const selectedValue = computed({
  get: () => props.modelValue,
  set: (value) => {
    emit('update:modelValue', value)
    const selected = props.categories.find(cat => cat.id === value)
    if (selected) {
      emit('change', selected)
    }
  },
})

const categoryOptions = computed(() =>
  props.categories.map(cat => ({
    label: cat.name,
    value: cat.id,
    code: cat.code,
  }))
)
</script>

<template>
  <div class="space-y-2">
    <!-- Label -->
    <label class="block text-sm font-medium text-gray-700">
      🎯 Assessment Category
      <span class="text-red-500">*</span>
    </label>

    <!-- Select -->
    <Select
      v-model="selectedValue"
      :options="categoryOptions"
      option-label="label"
      option-value="value"
      placeholder="Choose a category..."
      :loading="loading"
      :disabled="disabled || loading"
      show-clear
      class="w-full"
    />

    <!-- Error Message -->
    <p v-if="error" class="text-sm text-red-600">
      ❌ {{ error }}
    </p>

    <!-- Help Text -->
    <p class="text-xs text-gray-500">
      Select the assessment category (e.g., Language, Math, Social-Emotional)
    </p>
  </div>
</template>
