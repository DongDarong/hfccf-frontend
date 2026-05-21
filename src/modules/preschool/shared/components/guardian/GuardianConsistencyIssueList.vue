<script setup>
// Keep the issue list separate from the page so staff can scan consistency
// problems without the report page becoming a giant rendering block.
import { computed } from 'vue'
import { useLanguage } from '@/composables/useLanguage'
import GuardianConsistencySeverityBadge from './GuardianConsistencySeverityBadge.vue'
import GuardianStatusBadge from './GuardianStatusBadge.vue'

defineOptions({
  name: 'GuardianConsistencyIssueList',
})

const { t } = useLanguage()

defineProps({
  issues: {
    type: Array,
    default: () => [],
  },
  loading: {
    type: Boolean,
    default: false,
  },
  emptyText: {
    type: String,
    default: '',
  },
})

const issueLabelMap = computed(() => ({
  student_no_active_guardian: t('preschoolGuardianIntegrityPage.issueTypes.studentNoActiveGuardian'),
  multiple_active_primary_guardians: t('preschoolGuardianIntegrityPage.issueTypes.multipleActivePrimaryGuardians'),
  guardian_without_students: t('preschoolGuardianIntegrityPage.issueTypes.guardianWithoutStudents'),
  archived_primary_relationship: t('preschoolGuardianIntegrityPage.issueTypes.archivedPrimaryRelationship'),
  inactive_emergency_contact: t('preschoolGuardianIntegrityPage.issueTypes.inactiveEmergencyContact'),
  pickup_permission_issue: t('preschoolGuardianIntegrityPage.issueTypes.pickupPermissionIssue'),
  legacy_guardian_mismatch: t('preschoolGuardianIntegrityPage.issueTypes.legacyGuardianMismatch'),
}))

const issueDescriptionMap = computed(() => ({
  student_no_active_guardian: t('preschoolGuardianIntegrityPage.issueDescriptions.studentNoActiveGuardian'),
  multiple_active_primary_guardians: t('preschoolGuardianIntegrityPage.issueDescriptions.multipleActivePrimaryGuardians'),
  guardian_without_students: t('preschoolGuardianIntegrityPage.issueDescriptions.guardianWithoutStudents'),
  archived_primary_relationship: t('preschoolGuardianIntegrityPage.issueDescriptions.archivedPrimaryRelationship'),
  inactive_emergency_contact: t('preschoolGuardianIntegrityPage.issueDescriptions.inactiveEmergencyContact'),
  pickup_permission_issue: t('preschoolGuardianIntegrityPage.issueDescriptions.pickupPermissionIssue'),
  legacy_guardian_mismatch: t('preschoolGuardianIntegrityPage.issueDescriptions.legacyGuardianMismatch'),
}))

const relationshipLabelMap = computed(() => ({
  mother: t('preschoolGuardianShared.relationshipTypes.mother'),
  father: t('preschoolGuardianShared.relationshipTypes.father'),
  guardian: t('preschoolGuardianShared.relationshipTypes.guardian'),
  grandparent: t('preschoolGuardianShared.relationshipTypes.grandparent'),
  sibling: t('preschoolGuardianShared.relationshipTypes.sibling'),
  relative: t('preschoolGuardianShared.relationshipTypes.relative'),
  other: t('preschoolGuardianShared.relationshipTypes.other'),
}))

const guardianSourceMap = computed(() => ({
  normalized: t('preschoolGuardianIntegrityPage.guardianSources.normalized'),
  legacy: t('preschoolGuardianIntegrityPage.guardianSources.legacy'),
}))

const legacyDifferenceMap = computed(() => ({
  guardianName: t('preschoolGuardianIntegrityPage.legacyDifferenceLabels.guardianName'),
  guardianPhone: t('preschoolGuardianIntegrityPage.legacyDifferenceLabels.guardianPhone'),
}))

function formatStudent(student) {
  if (!student) return ''
  return `${student.fullName || '-'}${student.studentCode ? ` (${student.studentCode})` : ''}`
}

function formatGuardian(guardian) {
  if (!guardian) return ''
  return `${guardian.fullName || '-'}${guardian.phone ? ` (${guardian.phone})` : ''}`
}

function formatPreferredGuardian(guardian) {
  if (!guardian) return ''
  return `${guardian.guardianName || '-'}${guardian.guardianPhone ? ` (${guardian.guardianPhone})` : ''}`
}

function formatRelationship(relationship) {
  if (!relationship) return ''
  return [
    relationshipLabelMap.value[relationship.relationshipType] || relationship.relationshipType,
    relationship.isPrimary ? t('preschoolGuardianShared.primaryGuardian.primary') : '',
    relationship.canPickup ? t('preschoolGuardianShared.pickupPermission.allowed') : '',
  ].filter(Boolean).join(' / ')
}

function formatDifference(key, value) {
  if (!value || typeof value !== 'object') return `${key}: ${String(value ?? '-')}`
  const label = legacyDifferenceMap.value[key] || key
  return `${label}: ${String(value.legacy ?? '-')} -> ${String(value.normalized ?? '-')}`
}
</script>

<template>
  <div class="grid gap-4">
    <div v-if="loading" class="rounded-2xl border border-slate-200 bg-white px-4 py-6 text-sm text-slate-500">
      {{ t('preschoolGuardianIntegrityPage.loading') }}
    </div>

    <div v-else-if="!issues.length" class="rounded-2xl border border-dashed border-slate-300 bg-white px-4 py-6 text-sm text-slate-500">
      {{ emptyText }}
    </div>

    <article
      v-for="issue in issues"
      :key="issue.id"
      class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
    >
      <div class="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">
            {{ issueLabelMap[issue.type] || issue.type }}
          </p>
          <h3 class="mt-1 text-lg font-semibold text-slate-900">
            {{ issueLabelMap[issue.type] || issue.title }}
          </h3>
          <p class="mt-1 text-sm text-slate-600">
            {{ issueDescriptionMap[issue.type] || issue.message }}
          </p>
        </div>
        <GuardianConsistencySeverityBadge :severity="issue.severity" />
      </div>

      <div class="mt-4 grid gap-3 lg:grid-cols-2">
        <div v-if="issue.student" class="rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-700">
          <p class="text-xs uppercase tracking-wide text-slate-500">{{ t('preschoolGuardianIntegrityPage.labels.student') }}</p>
          <p class="mt-1 font-medium">{{ formatStudent(issue.student) }}</p>
          <p class="mt-1 text-xs text-slate-500">
            {{ guardianSourceMap[issue.student.guardianSource] || issue.student.guardianSource }}
          </p>
        </div>
        <div v-if="issue.guardian" class="rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-700">
          <p class="text-xs uppercase tracking-wide text-slate-500">{{ t('preschoolGuardianIntegrityPage.labels.guardian') }}</p>
          <p class="mt-1 font-medium">{{ formatGuardian(issue.guardian) }}</p>
          <div class="mt-2">
            <GuardianStatusBadge :status="issue.guardian.status" />
          </div>
        </div>
        <div v-if="issue.relationship" class="rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-700">
          <p class="text-xs uppercase tracking-wide text-slate-500">{{ t('preschoolGuardianIntegrityPage.labels.relationship') }}</p>
          <p class="mt-1 font-medium">{{ formatRelationship(issue.relationship) }}</p>
        </div>
        <div v-if="issue.preferredGuardian" class="rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-700">
          <p class="text-xs uppercase tracking-wide text-slate-500">{{ t('preschoolGuardianIntegrityPage.labels.preferredGuardian') }}</p>
          <p class="mt-1 font-medium">{{ formatPreferredGuardian(issue.preferredGuardian) }}</p>
        </div>
      </div>

      <div v-if="issue.difference" class="mt-4 rounded-xl border border-dashed border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
        <p class="text-xs uppercase tracking-wide text-amber-700">{{ t('preschoolGuardianIntegrityPage.labels.legacyDifferences') }}</p>
        <ul class="mt-2 space-y-1">
          <li v-for="(value, key) in issue.difference" :key="key">
            {{ formatDifference(key, value) }}
          </li>
        </ul>
      </div>
    </article>
  </div>
</template>
