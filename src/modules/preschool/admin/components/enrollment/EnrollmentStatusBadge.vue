<script setup>
import { useI18n } from 'vue-i18n'

defineOptions({ name: 'EnrollmentStatusBadge' })

const props = defineProps({
  status: { type: String, default: '' },
})

const { t, te } = useI18n()

const TONE = {
  draft: 'neutral',
  submitted: 'info',
  under_review: 'warning',
  approved: 'success',
  waitlisted: 'warning',
  rejected: 'danger',
  enrolled: 'success',
  cancelled: 'muted',
}

function label(status) {
  const key = `preschoolEnrollmentPage.statuses.${status}`
  return te(key) ? t(key) : status
}
</script>

<template>
  <span class="enr-badge" :class="`enr-badge--${TONE[props.status] ?? 'neutral'}`">
    {{ label(props.status) }}
  </span>
</template>

<style scoped>
.enr-badge {
  display: inline-block;
  padding: 0.22em 0.65em;
  border-radius: 999px;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  white-space: nowrap;
}

.enr-badge--info { background: #dbeafe; color: #1d4ed8; }
.enr-badge--success { background: #dcfce7; color: #15803d; }
.enr-badge--warning { background: #fef9c3; color: #a16207; }
.enr-badge--danger { background: #fee2e2; color: #b91c1c; }
.enr-badge--neutral { background: #f1f5f9; color: #475569; }
.enr-badge--muted { background: #f1f5f9; color: #94a3b8; }
</style>
