const toneMap = {
  stable: {
    badgeStatus: 'success',
    surfaceClass: 'bg-lime-50/80 border-lime-200',
    accentClass: 'bg-lime-500',
    textClass: 'text-lime-900',
  },
  watch: {
    badgeStatus: 'warning',
    surfaceClass: 'bg-amber-50/80 border-amber-200',
    accentClass: 'bg-amber-500',
    textClass: 'text-amber-900',
  },
  critical: {
    badgeStatus: 'error',
    surfaceClass: 'bg-rose-50/80 border-rose-200',
    accentClass: 'bg-rose-500',
    textClass: 'text-rose-900',
  },
  info: {
    badgeStatus: 'info',
    surfaceClass: 'bg-cyan-50/80 border-cyan-200',
    accentClass: 'bg-cyan-500',
    textClass: 'text-cyan-900',
  },
  neutral: {
    badgeStatus: 'neutral',
    surfaceClass: 'bg-slate-50 border-slate-200',
    accentClass: 'bg-slate-400',
    textClass: 'text-slate-800',
  },
}

const aliasMap = {
  success: 'stable',
  warning: 'watch',
  error: 'critical',
  pending: 'watch',
  high: 'critical',
  medium: 'watch',
  low: 'info',
  urgent: 'critical',
  active: 'stable',
  inactive: 'watch',
}

export function getCommandCenterTone(value) {
  const key = aliasMap[String(value || '').trim().toLowerCase()] || String(value || '').trim().toLowerCase()
  return toneMap[key] || toneMap.neutral
}

export function getPriorityTone(value) {
  const key = String(value || '').trim().toLowerCase()
  if (key === 'critical' || key === 'urgent' || key === 'high') return toneMap.critical
  if (key === 'watch' || key === 'medium' || key === 'pending') return toneMap.watch
  if (key === 'stable' || key === 'low' || key === 'normal') return toneMap.stable
  return toneMap.neutral
}
