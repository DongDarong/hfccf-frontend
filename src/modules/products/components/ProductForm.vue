<script setup>
import { computed } from 'vue'
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import UiForm from '@/components/forms/Form.vue'

defineOptions({
  name: 'ProductForm',
})

const props = defineProps({
  form: {
    type: Object,
    required: true,
  },
  errors: {
    type: Object,
    default: () => ({}),
  },
  loading: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: 'Product information',
  },
  description: {
    type: String,
    default: 'Add the product data exactly as the Laravel API expects it.',
  },
  submitText: {
    type: String,
    default: 'Save product',
  },
  cancelText: {
    type: String,
    default: 'Cancel',
  },
  requestError: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['submit', 'cancel', 'update:form'])

function resolveFieldError(field) {
  const messages = props.errors?.[field]

  if (Array.isArray(messages) && messages.length) {
    return messages[0]
  }

  return typeof messages === 'string' ? messages : ''
}

const requestErrorMessage = computed(() => String(props.requestError || '').trim())

function updateField(field, value) {
  emit('update:form', { field, value })
}
</script>

<template>
  <UiForm
    :title="title"
    :description="description"
    :submit-text="submitText"
    :cancel-text="cancelText"
    :loading="loading"
    :show-cancel="true"
    @submit="emit('submit')"
    @cancel="emit('cancel')"
  >
    <div
      v-if="requestErrorMessage"
      class="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm leading-6 text-rose-700"
      role="alert"
    >
      {{ requestErrorMessage }}
    </div>

    <div class="grid gap-4 lg:grid-cols-2">
      <div class="grid gap-1.5 lg:col-span-2">
        <label for="product-name" class="text-sm font-bold text-surface-900">
          Name
        </label>
        <InputText
          id="product-name"
          :model-value="props.form.name"
          :invalid="Boolean(resolveFieldError('name'))"
          placeholder="Enter product name"
          autocomplete="off"
          @update:model-value="updateField('name', $event)"
        />
        <p v-if="resolveFieldError('name')" class="text-xs font-semibold text-rose-600">
          {{ resolveFieldError('name') }}
        </p>
      </div>

      <div class="grid gap-1.5">
        <label for="product-price" class="text-sm font-bold text-surface-900">
          Price
        </label>
        <input
          id="product-price"
          :value="props.form.price"
          type="number"
          min="0"
          step="0.01"
          inputmode="decimal"
          placeholder="0.00"
          @input="updateField('price', $event.target.value)"
        />
        <p v-if="resolveFieldError('price')" class="text-xs font-semibold text-rose-600">
          {{ resolveFieldError('price') }}
        </p>
      </div>

      <div class="grid gap-1.5">
        <label for="product-stock" class="text-sm font-bold text-surface-900">
          Stock
        </label>
        <input
          id="product-stock"
          :value="props.form.stock"
          type="number"
          min="0"
          step="1"
          inputmode="numeric"
          placeholder="0"
          @input="updateField('stock', $event.target.value)"
        />
        <p v-if="resolveFieldError('stock')" class="text-xs font-semibold text-rose-600">
          {{ resolveFieldError('stock') }}
        </p>
      </div>

      <div class="grid gap-1.5 lg:col-span-2">
        <label for="product-description" class="text-sm font-bold text-surface-900">
          Description
        </label>
        <Textarea
          id="product-description"
          :model-value="props.form.description"
          rows="6"
          auto-resize
          placeholder="Optional description"
          @update:model-value="updateField('description', $event)"
        />
        <p v-if="resolveFieldError('description')" class="text-xs font-semibold text-rose-600">
          {{ resolveFieldError('description') }}
        </p>
      </div>
    </div>
  </UiForm>
</template>
