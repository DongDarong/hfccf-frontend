const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

export function formatProductPrice(value) {
  const amount = Number(value)

  if (!Number.isFinite(amount)) {
    return '--'
  }

  return currencyFormatter.format(amount)
}

export function formatProductStock(value) {
  const amount = Number(value)

  if (!Number.isFinite(amount)) {
    return '--'
  }

  return `${amount.toLocaleString('en-US')} units`
}

export function formatProductDescription(value, fallback = 'No description provided for this product.') {
  const normalized = String(value ?? '').trim()
  return normalized || fallback
}

export function truncateProductText(value, maxLength = 120) {
  const normalized = String(value ?? '').trim()

  if (!normalized) {
    return 'No description'
  }

  if (normalized.length <= maxLength) {
    return normalized
  }

  return `${normalized.slice(0, Math.max(0, maxLength - 1)).trimEnd()}...`
}
