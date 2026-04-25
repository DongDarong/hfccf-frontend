import axios from 'axios'
import http from '@/services/http'

const RESOURCE_PATH = '/products'

export function createDefaultPagination() {
  return {
    currentPage: 1,
    lastPage: 1,
    perPage: 0,
    total: 0,
    from: 0,
    to: 0,
    hasPages: false,
  }
}

function toRecord(value) {
  return value && typeof value === 'object' && !Array.isArray(value) ? value : null
}

function toMessage(value, fallbackMessage) {
  const normalized = String(value || '').trim()
  return normalized || fallbackMessage
}

function normalizeValidationErrors(rawErrors) {
  if (!rawErrors || typeof rawErrors !== 'object' || Array.isArray(rawErrors)) {
    return {}
  }

  return Object.fromEntries(
    Object.entries(rawErrors)
      .map(([field, messages]) => {
        const normalizedMessages = Array.isArray(messages)
          ? messages.map((message) => String(message || '').trim()).filter(Boolean)
          : [String(messages || '').trim()].filter(Boolean)

        return [field, normalizedMessages]
      })
      .filter(([, messages]) => messages.length),
  )
}

function createProductError({
  message,
  status = 0,
  validationErrors = {},
  payload = null,
  cause = null,
} = {}) {
  const error = new Error(message || 'The products request could not be completed.')
  error.name = 'ProductApiError'
  error.status = status
  error.validationErrors = validationErrors
  error.payload = payload

  if (cause) {
    error.cause = cause
  }

  return error
}

function unwrapEnvelope(response, fallbackMessage) {
  const payload = toRecord(response?.data)

  if (!payload) {
    throw createProductError({
      message: fallbackMessage,
      status: response?.status || 0,
      payload: response?.data ?? null,
    })
  }

  if (payload.success === false) {
    throw createProductError({
      message: toMessage(payload.message, fallbackMessage),
      status: response?.status || 0,
      validationErrors: normalizeValidationErrors(payload?.data?.errors || payload?.errors),
      payload,
    })
  }

  return payload
}

function normalizePagination(rawPagination, products = []) {
  const pagination = toRecord(rawPagination) || {}
  const total = Number(
    pagination.total ??
      pagination.totalItems ??
      pagination.total_items ??
      pagination.count ??
      products.length,
  )
  const perPage = Number(
    pagination.perPage ?? pagination.per_page ?? pagination.pageSize ?? pagination.page_size ?? 0,
  )
  const currentPage = Number(
    pagination.currentPage ?? pagination.current_page ?? pagination.page ?? 1,
  )
  const derivedLastPage =
    perPage > 0 && total > 0 ? Math.max(1, Math.ceil(total / perPage)) : total > 0 ? 1 : 1
  const lastPage = Number(
    pagination.lastPage ?? pagination.last_page ?? pagination.totalPages ?? pagination.total_pages,
  )
  const from = Number(
    pagination.from ?? (products.length && total ? (currentPage - 1) * (perPage || products.length) + 1 : 0),
  )
  const to = Number(pagination.to ?? (from && products.length ? from + products.length - 1 : 0))

  return {
    currentPage: Number.isFinite(currentPage) && currentPage > 0 ? currentPage : 1,
    lastPage: Number.isFinite(lastPage) && lastPage > 0 ? lastPage : derivedLastPage,
    perPage: Number.isFinite(perPage) && perPage >= 0 ? perPage : 0,
    total: Number.isFinite(total) && total >= 0 ? total : products.length,
    from: Number.isFinite(from) && from >= 0 ? from : 0,
    to: Number.isFinite(to) && to >= 0 ? to : products.length,
    hasPages: (Number.isFinite(lastPage) && lastPage > 1) || derivedLastPage > 1,
  }
}

function resolveProductData(data) {
  const record = toRecord(data)

  if (!record) {
    return data ?? null
  }

  if (record.product && typeof record.product === 'object') {
    return record.product
  }

  return record
}

function normalizeRequestError(error, fallbackMessage) {
  if (error?.name === 'ProductApiError') {
    return error
  }

  if (!axios.isAxiosError(error)) {
    return createProductError({
      message: error instanceof Error ? toMessage(error.message, fallbackMessage) : fallbackMessage,
      cause: error,
    })
  }

  const payload = toRecord(error.response?.data)
  const validationErrors = normalizeValidationErrors(
    payload?.data?.errors || payload?.errors || error.response?.data?.errors,
  )

  return createProductError({
    message: toMessage(payload?.message || error.message, fallbackMessage),
    status: error.response?.status || 0,
    validationErrors,
    payload: error.response?.data ?? null,
    cause: error,
  })
}

export async function listProducts(params = {}) {
  try {
    const response = await http.get(RESOURCE_PATH, { params })
    const envelope = unwrapEnvelope(response, 'Unable to load products.')
    const data = toRecord(envelope.data) || {}
    const products = Array.isArray(data.products) ? data.products : []

    return {
      success: true,
      message: toMessage(envelope.message, 'Products loaded successfully.'),
      data: {
        products,
        pagination: normalizePagination(data.pagination, products),
      },
    }
  } catch (error) {
    throw normalizeRequestError(error, 'Unable to load products.')
  }
}

export async function getProduct(id) {
  try {
    const response = await http.get(`${RESOURCE_PATH}/${id}`)
    const envelope = unwrapEnvelope(response, 'Unable to load that product.')

    return {
      success: true,
      message: toMessage(envelope.message, 'Product loaded successfully.'),
      data: resolveProductData(envelope.data),
    }
  } catch (error) {
    throw normalizeRequestError(error, 'Unable to load that product.')
  }
}

export async function createProduct(payload) {
  try {
    const response = await http.post(RESOURCE_PATH, payload)
    const envelope = unwrapEnvelope(response, 'Unable to create the product.')

    return {
      success: true,
      message: toMessage(envelope.message, 'Product created successfully.'),
      data: resolveProductData(envelope.data),
    }
  } catch (error) {
    throw normalizeRequestError(error, 'Unable to create the product.')
  }
}

export async function updateProduct(id, payload) {
  try {
    const response = await http.put(`${RESOURCE_PATH}/${id}`, payload)
    const envelope = unwrapEnvelope(response, 'Unable to update the product.')

    return {
      success: true,
      message: toMessage(envelope.message, 'Product updated successfully.'),
      data: resolveProductData(envelope.data),
    }
  } catch (error) {
    throw normalizeRequestError(error, 'Unable to update the product.')
  }
}

export async function deleteProduct(id) {
  try {
    const response = await http.delete(`${RESOURCE_PATH}/${id}`)

    if (response.status === 204) {
      return {
        success: true,
        message: 'Product deleted successfully.',
        data: null,
      }
    }

    const envelope = unwrapEnvelope(response, 'Unable to delete the product.')

    return {
      success: true,
      message: toMessage(envelope.message, 'Product deleted successfully.'),
      data: envelope.data ?? null,
    }
  } catch (error) {
    throw normalizeRequestError(error, 'Unable to delete the product.')
  }
}
