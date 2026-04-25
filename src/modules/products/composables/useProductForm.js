import { reactive } from 'vue'

function createEmptyFormState() {
  return {
    name: '',
    description: '',
    price: '',
    stock: '',
  }
}

function toNullableText(value) {
  const normalized = String(value ?? '').trim()
  return normalized || null
}

function normalizeValidationErrors(errors) {
  if (!errors || typeof errors !== 'object' || Array.isArray(errors)) {
    return {}
  }

  return Object.fromEntries(
    Object.entries(errors)
      .map(([field, messages]) => {
        const normalizedMessages = Array.isArray(messages)
          ? messages.map((message) => String(message || '').trim()).filter(Boolean)
          : [String(messages || '').trim()].filter(Boolean)

        return [field, normalizedMessages]
      })
      .filter(([, messages]) => messages.length),
  )
}

function normalizeProductForForm(product) {
  return {
    name: String(product?.name ?? '').trim(),
    description: String(product?.description ?? ''),
    price:
      product?.price === null || product?.price === undefined || product?.price === ''
        ? ''
        : String(product.price),
    stock:
      product?.stock === null || product?.stock === undefined || product?.stock === ''
        ? ''
        : String(product.stock),
  }
}

export function useProductForm(initialProduct = null) {
  const form = reactive(createEmptyFormState())
  const validationErrors = reactive({})

  function clearValidationErrors() {
    Object.keys(validationErrors).forEach((field) => {
      delete validationErrors[field]
    })
  }

  function setValidationErrors(errors = {}) {
    clearValidationErrors()

    Object.assign(validationErrors, normalizeValidationErrors(errors))
  }

  function reset(nextProduct = null) {
    clearValidationErrors()
    Object.assign(form, createEmptyFormState(), normalizeProductForForm(nextProduct))
  }

  function validate() {
    const nextErrors = {}
    const name = String(form.name || '').trim()
    const price = Number(form.price)
    const stock = Number(form.stock)

    if (!name) {
      nextErrors.name = ['Name is required.']
    }

    if (form.price === '' || Number.isNaN(price)) {
      nextErrors.price = ['Price is required.']
    } else if (price < 0) {
      nextErrors.price = ['Price must be 0 or greater.']
    }

    if (form.stock === '' || Number.isNaN(stock)) {
      nextErrors.stock = ['Stock is required.']
    } else if (!Number.isInteger(stock)) {
      nextErrors.stock = ['Stock must be a whole number.']
    } else if (stock < 0) {
      nextErrors.stock = ['Stock must be 0 or greater.']
    }

    setValidationErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  function getFieldError(field) {
    const messages = validationErrors[field]
    return Array.isArray(messages) && messages.length ? messages[0] : ''
  }

  function toPayload() {
    return {
      name: String(form.name || '').trim(),
      description: toNullableText(form.description),
      price: Number(form.price),
      stock: Number(form.stock),
    }
  }

  reset(initialProduct)

  return {
    form,
    validationErrors,
    clearValidationErrors,
    setValidationErrors,
    reset,
    validate,
    getFieldError,
    toPayload,
  }
}
