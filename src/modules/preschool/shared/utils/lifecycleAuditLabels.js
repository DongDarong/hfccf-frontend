function humanizeSegment(segment) {
  return String(segment || '')
    .replace(/[_-]+/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase())
    .trim()
}

export function formatAuditCodeFallback(value) {
  const raw = String(value ?? '').trim()
  if (!raw) return '-'

  if (/^\d+$/.test(raw)) return `#${raw}`

  const withoutHash = raw.startsWith('#') ? raw.slice(1).trim() : raw
  if (!withoutHash) return '-'

  if (/^\d+$/.test(withoutHash)) return `#${withoutHash}`
  if (/^[A-Z0-9]+$/.test(withoutHash)) return withoutHash
  if (!/[._-]/.test(withoutHash) && /[A-Z]/.test(withoutHash) && /[a-z]/.test(withoutHash)) return withoutHash

  return withoutHash
    .split('.')
    .map((segment) => humanizeSegment(segment))
    .join(' ')
}

export function resolveLifecycleActionLabel(t, action, te) {
  const raw = String(action ?? '').trim()
  if (!raw) return '-'

  const key = `preschoolLifecycleAuditPage.actions.${raw}`
  if (typeof te === 'function' && te(key)) {
    return t(key)
  }

  return formatAuditCodeFallback(raw)
}

export function resolveLifecycleEntityLabel(t, entity, te) {
  const raw = String(entity ?? '').trim()
  if (!raw) return '-'

  const key = `preschoolLifecycleAuditPage.entities.${raw}`
  if (typeof te === 'function' && te(key)) {
    return t(key)
  }

  return formatAuditCodeFallback(raw)
}

function normalizeContextKey(value) {
  return String(value ?? '')
    .trim()
    .replace(/^#/, '')
    .replace(/[._-]+/g, '_')
    .replace(/\s+/g, '_')
    .toLowerCase()
}

export function resolveLifecycleContextLabel(t, context, te) {
  const raw = String(context ?? '').trim()
  if (!raw) return '-'

  const key = `preschoolLifecycleAuditPage.contexts.${normalizeContextKey(raw)}`
  if (typeof te === 'function' && te(key)) {
    return t(key)
  }

  return formatAuditCodeFallback(raw)
}
