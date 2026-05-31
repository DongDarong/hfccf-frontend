<script setup>
/**
 * Breadcrumb
 *
 * Auto-generates a breadcrumb trail from the current Vue Router route name.
 * Each entry in CRUMB_MAP declares its ancestor crumbs so the component
 * builds the full trail without needing route meta changes.
 *
 * The final crumb (current page) is rendered as plain text.
 * All preceding crumbs are router-links.
 * Renders nothing when the current route has no entry in the map.
 */
import { computed } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { useLanguage } from '@/composables/useLanguage'

const route = useRoute()
const { t } = useLanguage()

/**
 * Breadcrumb trail definitions keyed by route name.
 * Each value is an ordered array of crumb objects:
 *   { labelKey: string, to?: { name: string } }
 * The last item in the array is the current page (no link).
 * The first item is always the module root.
 */
const CRUMB_MAP = {
  // ── Admin dashboard — root of the module; single crumb, no parent link ───
  'dashboard-preschool-admin': [
    { labelKey: 'common.breadcrumb.dashboard' },
  ],

  // ── Students ��─────────────────────��────────────────────────────────��──────
  'dashboard-preschool-admin-students': [
    { labelKey: 'common.breadcrumb.preschool', to: { name: 'dashboard-preschool-admin' } },
    { labelKey: 'common.breadcrumb.students' },
  ],

  // ── Teachers ─────��────────────────────────────��───────────────────────────
  'dashboard-preschool-admin-users': [
    { labelKey: 'common.breadcrumb.preschool', to: { name: 'dashboard-preschool-admin' } },
    { labelKey: 'common.breadcrumb.teachers' },
  ],
  'dashboard-preschool-admin-users-add': [
    { labelKey: 'common.breadcrumb.preschool', to: { name: 'dashboard-preschool-admin' } },
    { labelKey: 'common.breadcrumb.teachers', to: { name: 'dashboard-preschool-admin-users' } },
    { labelKey: 'common.breadcrumb.addTeacher' },
  ],
  'dashboard-preschool-admin-teacher-view': [
    { labelKey: 'common.breadcrumb.preschool', to: { name: 'dashboard-preschool-admin' } },
    { labelKey: 'common.breadcrumb.teachers', to: { name: 'dashboard-preschool-admin-users' } },
    { labelKey: 'common.breadcrumb.teacherDetail' },
  ],

  // ── Classes ───────────────────────��─────────────────────────────���─────────
  'dashboard-preschool-admin-classes': [
    { labelKey: 'common.breadcrumb.preschool', to: { name: 'dashboard-preschool-admin' } },
    { labelKey: 'common.breadcrumb.classes' },
  ],
  'dashboard-preschool-admin-classes-add': [
    { labelKey: 'common.breadcrumb.preschool', to: { name: 'dashboard-preschool-admin' } },
    { labelKey: 'common.breadcrumb.classes', to: { name: 'dashboard-preschool-admin-classes' } },
    { labelKey: 'common.breadcrumb.addClass' },
  ],

  // ── Payment ───────────────────────���───────────────────────────────────────
  'dashboard-preschool-admin-payment': [
    { labelKey: 'common.breadcrumb.preschool', to: { name: 'dashboard-preschool-admin' } },
    { labelKey: 'common.breadcrumb.payment' },
  ],

  // ── Attendance ────────────────────���───────────────────────────────────────
  'dashboard-preschool-admin-attendance': [
    { labelKey: 'common.breadcrumb.preschool', to: { name: 'dashboard-preschool-admin' } },
    { labelKey: 'common.breadcrumb.attendance' },
  ],

  // ── Enrollment ──────────────────────────────────────────────────��─────────
  'dashboard-preschool-admin-enrollments': [
    { labelKey: 'common.breadcrumb.preschool', to: { name: 'dashboard-preschool-admin' } },
    { labelKey: 'common.breadcrumb.enrollment' },
  ],

  // ── Assignments ────────────────────────────────────────────────────��──────
  'dashboard-preschool-admin-assignments': [
    { labelKey: 'common.breadcrumb.preschool', to: { name: 'dashboard-preschool-admin' } },
    { labelKey: 'common.breadcrumb.assignments' },
  ],

  // ── Assessments ───────────────────────────────────────��───────────────────
  'dashboard-preschool-assessments': [
    { labelKey: 'common.breadcrumb.preschool', to: { name: 'dashboard-preschool-admin' } },
    { labelKey: 'common.breadcrumb.assessments' },
  ],
  'dashboard-preschool-assessments-add': [
    { labelKey: 'common.breadcrumb.preschool', to: { name: 'dashboard-preschool-admin' } },
    { labelKey: 'common.breadcrumb.assessments', to: { name: 'dashboard-preschool-assessments' } },
    { labelKey: 'common.breadcrumb.addAssessment' },
  ],
  'dashboard-preschool-progress-summary': [
    { labelKey: 'common.breadcrumb.preschool', to: { name: 'dashboard-preschool-admin' } },
    { labelKey: 'common.breadcrumb.assessments', to: { name: 'dashboard-preschool-assessments' } },
    { labelKey: 'common.breadcrumb.progressSummary' },
  ],

  // ── Schedules ───────────────────��─────────────────────────────────────────
  'dashboard-preschool-admin-schedules': [
    { labelKey: 'common.breadcrumb.preschool', to: { name: 'dashboard-preschool-admin' } },
    { labelKey: 'common.breadcrumb.schedules' },
  ],
  'dashboard-preschool-admin-class-schedule': [
    { labelKey: 'common.breadcrumb.preschool', to: { name: 'dashboard-preschool-admin' } },
    { labelKey: 'common.breadcrumb.schedules', to: { name: 'dashboard-preschool-admin-schedules' } },
    { labelKey: 'common.breadcrumb.classSchedule' },
  ],
  'dashboard-preschool-admin-teacher-schedule': [
    { labelKey: 'common.breadcrumb.preschool', to: { name: 'dashboard-preschool-admin' } },
    { labelKey: 'common.breadcrumb.schedules', to: { name: 'dashboard-preschool-admin-schedules' } },
    { labelKey: 'common.breadcrumb.teacherSchedule' },
  ],

  // ── Reports ──────────────────────────��─────────────────────────────────��──
  'dashboard-preschool-admin-reports': [
    { labelKey: 'common.breadcrumb.preschool', to: { name: 'dashboard-preschool-admin' } },
    { labelKey: 'common.breadcrumb.reports' },
  ],
  'dashboard-preschool-admin-student-reports': [
    { labelKey: 'common.breadcrumb.preschool', to: { name: 'dashboard-preschool-admin' } },
    { labelKey: 'common.breadcrumb.reports', to: { name: 'dashboard-preschool-admin-reports' } },
    { labelKey: 'common.breadcrumb.studentReports' },
  ],
  'dashboard-preschool-admin-classroom-reports': [
    { labelKey: 'common.breadcrumb.preschool', to: { name: 'dashboard-preschool-admin' } },
    { labelKey: 'common.breadcrumb.reports', to: { name: 'dashboard-preschool-admin-reports' } },
    { labelKey: 'common.breadcrumb.classroomReports' },
  ],
  'dashboard-preschool-admin-lifecycle-audit': [
    { labelKey: 'common.breadcrumb.preschool', to: { name: 'dashboard-preschool-admin' } },
    { labelKey: 'common.breadcrumb.reports', to: { name: 'dashboard-preschool-admin-reports' } },
    { labelKey: 'common.breadcrumb.lifecycleAudit' },
  ],
  'dashboard-preschool-admin-report-snapshots': [
    { labelKey: 'common.breadcrumb.preschool', to: { name: 'dashboard-preschool-admin' } },
    { labelKey: 'common.breadcrumb.reports', to: { name: 'dashboard-preschool-admin-reports' } },
    { labelKey: 'common.breadcrumb.snapshotArchive' },
  ],
  'dashboard-preschool-admin-export-governance': [
    { labelKey: 'common.breadcrumb.preschool', to: { name: 'dashboard-preschool-admin' } },
    { labelKey: 'common.breadcrumb.reports', to: { name: 'dashboard-preschool-admin-reports' } },
    { labelKey: 'common.breadcrumb.exportGovernance' },
  ],

  // ── Governance ────────────────────────────────────────────────────────────
  'dashboard-preschool-admin-governance-review': [
    { labelKey: 'common.breadcrumb.preschool', to: { name: 'dashboard-preschool-admin' } },
    { labelKey: 'common.breadcrumb.governance' },
    { labelKey: 'common.breadcrumb.governanceReview' },
  ],
  'dashboard-preschool-admin-reconstruction': [
    { labelKey: 'common.breadcrumb.preschool', to: { name: 'dashboard-preschool-admin' } },
    { labelKey: 'common.breadcrumb.governance' },
    { labelKey: 'common.breadcrumb.reconstruction' },
  ],
  'dashboard-preschool-admin-governance-diff': [
    { labelKey: 'common.breadcrumb.preschool', to: { name: 'dashboard-preschool-admin' } },
    { labelKey: 'common.breadcrumb.governance' },
    { labelKey: 'common.breadcrumb.diffAnalysis' },
  ],
  'dashboard-preschool-admin-governance-cases': [
    { labelKey: 'common.breadcrumb.preschool', to: { name: 'dashboard-preschool-admin' } },
    { labelKey: 'common.breadcrumb.governance' },
    { labelKey: 'common.breadcrumb.governanceCases' },
  ],

  // ── Other admin pages ───────────────────────���─────────────────────────────
  'dashboard-preschool-admin-forms': [
    { labelKey: 'common.breadcrumb.preschool', to: { name: 'dashboard-preschool-admin' } },
    { labelKey: 'common.breadcrumb.forms' },
  ],
  'dashboard-preschool-admin-classroom-resources': [
    { labelKey: 'common.breadcrumb.preschool', to: { name: 'dashboard-preschool-admin' } },
    { labelKey: 'common.breadcrumb.classroomResources' },
  ],
  'dashboard-preschool-admin-settings': [
    { labelKey: 'common.breadcrumb.preschool', to: { name: 'dashboard-preschool-admin' } },
    { labelKey: 'common.breadcrumb.settings' },
  ],

  // ── Teacher portal ──────────────────────────────────────────────────��─────
  // root of the teacher section — single crumb, no parent link
  'dashboard-preschool-teacher': [
    { labelKey: 'common.breadcrumb.teacherDashboard' },
  ],
  'dashboard-preschool-teacher-students': [
    { labelKey: 'common.breadcrumb.preschool', to: { name: 'dashboard-preschool-teacher' } },
    { labelKey: 'common.breadcrumb.myStudents' },
  ],
  'dashboard-preschool-teacher-attendance': [
    { labelKey: 'common.breadcrumb.preschool', to: { name: 'dashboard-preschool-teacher' } },
    { labelKey: 'common.breadcrumb.attendance' },
  ],
  'dashboard-preschool-teacher-schedule': [
    { labelKey: 'common.breadcrumb.preschool', to: { name: 'dashboard-preschool-teacher' } },
    { labelKey: 'common.breadcrumb.mySchedule' },
  ],
  'dashboard-preschool-teacher-report': [
    { labelKey: 'common.breadcrumb.preschool', to: { name: 'dashboard-preschool-teacher' } },
    { labelKey: 'common.breadcrumb.studentReports' },
  ],
  'dashboard-preschool-teacher-classroomresources': [
    { labelKey: 'common.breadcrumb.preschool', to: { name: 'dashboard-preschool-teacher' } },
    { labelKey: 'common.breadcrumb.classroomResources' },
  ],
  'dashboard-preschool-teacher-healthy': [
    { labelKey: 'common.breadcrumb.preschool', to: { name: 'dashboard-preschool-teacher' } },
    { labelKey: 'common.breadcrumb.health' },
  ],
}

/**
 * Resolved breadcrumb trail for the current route.
 * Returns an empty array when the route has no entry in CRUMB_MAP,
 * so the component renders nothing on unknown pages.
 * @returns {Array<{ label: string, to?: Object }>}
 */
const crumbs = computed(() => {
  const trail = CRUMB_MAP[route.name] ?? []
  return trail.map((item) => ({
    label: t(item.labelKey),
    to: item.to ?? null,
  }))
})
</script>

<template>
  <nav v-if="crumbs.length" aria-label="Breadcrumb" class="breadcrumb">
    <ol class="breadcrumb__list">
      <li
        v-for="(crumb, index) in crumbs"
        :key="index"
        class="breadcrumb__item"
      >
        <!-- Separator between crumbs (not before the first) -->
        <span v-if="index > 0" class="breadcrumb__sep" aria-hidden="true">/</span>

        <!-- Link crumbs -->
        <RouterLink
          v-if="crumb.to"
          :to="crumb.to"
          class="breadcrumb__link"
        >
          {{ crumb.label }}
        </RouterLink>

        <!-- Current page — plain text, aria-current for accessibility -->
        <span
          v-else
          class="breadcrumb__current"
          aria-current="page"
        >
          {{ crumb.label }}
        </span>
      </li>
    </ol>
  </nav>
</template>

<style scoped>
.breadcrumb {
  margin-bottom: 0.35rem;
}

.breadcrumb__list {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0;
  list-style: none;
  padding: 0;
  margin: 0;
}

.breadcrumb__item {
  display: inline-flex;
  align-items: center;
}

.breadcrumb__sep {
  margin: 0 0.4rem;
  font-size: 0.72rem;
  color: #cbd5e1;
  user-select: none;
}

.breadcrumb__link {
  font-size: 0.75rem;
  font-weight: 500;
  color: #7c3aed;
  text-decoration: none;
  transition: color 0.12s ease;
}

.breadcrumb__link:hover {
  color: #5b21b6;
  text-decoration: underline;
  text-underline-offset: 2px;
}

.breadcrumb__current {
  font-size: 0.75rem;
  font-weight: 600;
  color: #64748b;
}
</style>
