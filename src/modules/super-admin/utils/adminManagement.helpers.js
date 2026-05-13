import { ROLES } from '@/constants/roles'

const DEFAULT_STATUS_ORDER = ['active', 'pending', 'inactive', 'suspended']

/**
 * Translate a status key with a stable fallback for untranslated values.
 */
export function statusLabel(t, status) {
  const key = `common.status.${String(status || '').replace(/[\s-]+/g, '_').toLowerCase()}`
  const translated = t(key)

  return translated !== key ? translated : String(status || '')
}

/**
 * Keep the list filtering rules identical to the current page behavior.
 */
export function filterAdmins(admins = [], { searchQuery = '', roleFilter = '', statusFilter = '' } = {}) {
  const query = String(searchQuery ?? '')
    .trim()
    .toLowerCase()

  return admins.filter((user) => {
    let isMatch = true

    if (query) {
      const haystack =
        `${user.name} ${user.email} ${user.role} ${user.department} ${user.permissions?.join(' ')}`.toLowerCase()
      isMatch = haystack.includes(query)
    }

    if (isMatch && roleFilter) {
      isMatch = String(user.role).toLowerCase() === roleFilter.toLowerCase()
    }

    if (isMatch && statusFilter) {
      isMatch = String(user.status).toLowerCase() === statusFilter.toLowerCase()
    }

    return isMatch
  })
}

/**
 * Normalize a table row so pagination always receives the same shape.
 */
export function normalizeAdminRow(user, rowNumber) {
  return {
    ...user,
    rowNumber,
    role: user.role || ROLES.SUPER_ADMIN,
    status: user.status || 'active',
    permissions: Array.isArray(user.permissions) ? user.permissions : [],
  }
}

/**
 * Slice the visible page and normalize the row payloads for the table.
 */
export function paginateAdmins(admins = [], currentPage = 1, pageSize = 10) {
  const start = (currentPage - 1) * pageSize

  return admins.slice(start, start + pageSize).map((user, index) =>
    normalizeAdminRow(user, start + index + 1),
  )
}

/**
 * Build the summary cards shown above the admin list.
 */
export function buildSummaryCards(t, admins = [], toolbarNote = '', addButtonLabel = '') {
  const total = admins.length
  const active = admins.filter((user) => String(user.status).toLowerCase() === 'active').length
  const pending = admins.filter((user) => String(user.status).toLowerCase() === 'pending').length
  const alerts = admins.filter((user) =>
    ['inactive', 'suspended'].includes(String(user.status).toLowerCase()),
  ).length

  return [
    {
      id: 'total-admins',
      title: t('users.manageAdmins.metrics.total'),
      value: total,
      label: toolbarNote,
      status: 'info',
      statusLabel: statusLabel(t, 'info'),
      surfaceClass: 'bg-cyan-50/80 border-cyan-200',
      actionLabel: addButtonLabel,
    },
    {
      id: 'active-admins',
      title: t('users.manageAdmins.metrics.active'),
      value: active,
      label: t('users.manageAdmins.metrics.activeLabel'),
      status: 'success',
      statusLabel: statusLabel(t, 'success'),
      surfaceClass: 'bg-lime-50/80 border-lime-200',
    },
    {
      id: 'pending-admins',
      title: t('users.manageAdmins.metrics.pending'),
      value: pending,
      label: t('users.manageAdmins.metrics.pendingLabel'),
      status: 'warning',
      statusLabel: statusLabel(t, 'warning'),
      surfaceClass: 'bg-amber-50/80 border-amber-200',
    },
    {
      id: 'security-alerts',
      title: t('users.manageAdmins.metrics.alerts'),
      value: alerts,
      label: t('users.manageAdmins.metrics.alertsLabel'),
      status: alerts > 0 ? 'error' : 'success',
      statusLabel: statusLabel(t, alerts > 0 ? 'error' : 'success'),
      surfaceClass: 'bg-rose-50/80 border-rose-200',
    },
  ]
}

/**
 * Build the filtered status chips using the current filtered list.
 */
export function buildStatusBadges(t, admins = [], statuses = DEFAULT_STATUS_ORDER) {
  return statuses.map((status) => {
    const count = admins.filter((user) => String(user.status || '').toLowerCase() === status).length

    return {
      status,
      label: `${statusLabel(t, status)} (${count})`,
      count,
    }
  })
}
