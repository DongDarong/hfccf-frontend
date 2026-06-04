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
const SPORT_CRUMB_MAP = {
  'dashboard-sport-admin': [
    { labelKey: 'breadcrumb.sportDashboard' },
  ],
  'dashboard-sport-admin-attendance': [
    { labelKey: 'breadcrumb.sportDashboard', to: { name: 'dashboard-sport-admin' } },
    { labelKey: 'breadcrumb.attendance' },
  ],
  'dashboard-sport-admin-attendance-players': [
    { labelKey: 'breadcrumb.sportDashboard', to: { name: 'dashboard-sport-admin' } },
    { labelKey: 'breadcrumb.attendance', to: { name: 'dashboard-sport-admin-attendance' } },
    { labelKey: 'breadcrumb.attendancePlayers' },
  ],
  'dashboard-sport-admin-attendance-coaches': [
    { labelKey: 'breadcrumb.sportDashboard', to: { name: 'dashboard-sport-admin' } },
    { labelKey: 'breadcrumb.attendance', to: { name: 'dashboard-sport-admin-attendance' } },
    { labelKey: 'breadcrumb.attendanceCoaches' },
  ],
  'dashboard-sport-admin-attendance-history': [
    { labelKey: 'breadcrumb.sportDashboard', to: { name: 'dashboard-sport-admin' } },
    { labelKey: 'breadcrumb.attendance', to: { name: 'dashboard-sport-admin-attendance' } },
    { labelKey: 'breadcrumb.attendanceHistory' },
  ],
  'dashboard-sport-admin-users': [
    { labelKey: 'breadcrumb.sportDashboard', to: { name: 'dashboard-sport-admin' } },
    { labelKey: 'breadcrumb.coaches' },
  ],
  'dashboard-sport-admin-users-add': [
    { labelKey: 'breadcrumb.sportDashboard', to: { name: 'dashboard-sport-admin' } },
    { labelKey: 'breadcrumb.coaches', to: { name: 'dashboard-sport-admin-users' } },
    { labelKey: 'breadcrumb.addCoach' },
  ],
  'dashboard-sport-admin-teams': [
    { labelKey: 'breadcrumb.sportDashboard', to: { name: 'dashboard-sport-admin' } },
    { labelKey: 'breadcrumb.teams' },
  ],
  'dashboard-sport-admin-teams-add': [
    { labelKey: 'breadcrumb.sportDashboard', to: { name: 'dashboard-sport-admin' } },
    { labelKey: 'breadcrumb.teams', to: { name: 'dashboard-sport-admin-teams' } },
    { labelKey: 'breadcrumb.addTeam' },
  ],
  'dashboard-sport-admin-players': [
    { labelKey: 'breadcrumb.sportDashboard', to: { name: 'dashboard-sport-admin' } },
    { labelKey: 'breadcrumb.players' },
  ],
  'dashboard-sport-admin-players-add': [
    { labelKey: 'breadcrumb.sportDashboard', to: { name: 'dashboard-sport-admin' } },
    { labelKey: 'breadcrumb.players', to: { name: 'dashboard-sport-admin-players' } },
    { labelKey: 'breadcrumb.addPlayer' },
  ],
  'dashboard-sport-admin-matches': [
    { labelKey: 'breadcrumb.sportDashboard', to: { name: 'dashboard-sport-admin' } },
    { labelKey: 'breadcrumb.matches' },
  ],
  'dashboard-sport-admin-matches-add': [
    { labelKey: 'breadcrumb.sportDashboard', to: { name: 'dashboard-sport-admin' } },
    { labelKey: 'breadcrumb.matches', to: { name: 'dashboard-sport-admin-matches' } },
    { labelKey: 'breadcrumb.addMatch' },
  ],
  'dashboard-sport-admin-matches-edit': [
    { labelKey: 'breadcrumb.sportDashboard', to: { name: 'dashboard-sport-admin' } },
    { labelKey: 'breadcrumb.matches', to: { name: 'dashboard-sport-admin-matches' } },
    { labelKey: 'breadcrumb.editMatch' },
  ],
  'dashboard-sport-admin-matches-results': [
    { labelKey: 'breadcrumb.sportDashboard', to: { name: 'dashboard-sport-admin' } },
    { labelKey: 'breadcrumb.matches', to: { name: 'dashboard-sport-admin-matches' } },
    { labelKey: 'breadcrumb.matchResults' },
  ],
  'dashboard-sport-admin-training': [
    { labelKey: 'breadcrumb.sportDashboard', to: { name: 'dashboard-sport-admin' } },
    { labelKey: 'breadcrumb.training' },
  ],
  'dashboard-sport-coach': [
    { labelKey: 'breadcrumb.coachDashboard' },
  ],
  'dashboard-sport-coach-teams': [
    { labelKey: 'breadcrumb.coachDashboard', to: { name: 'dashboard-sport-coach' } },
    { labelKey: 'breadcrumb.myTeams' },
  ],
  'dashboard-sport-coach-roster': [
    { labelKey: 'breadcrumb.coachDashboard', to: { name: 'dashboard-sport-coach' } },
    { labelKey: 'breadcrumb.myTeams', to: { name: 'dashboard-sport-coach-teams' } },
    { labelKey: 'breadcrumb.roster' },
  ],
  'dashboard-sport-coach-team-players': [
    { labelKey: 'breadcrumb.coachDashboard', to: { name: 'dashboard-sport-coach' } },
    { labelKey: 'breadcrumb.myTeams', to: { name: 'dashboard-sport-coach-teams' } },
    { labelKey: 'breadcrumb.teamPlayers' },
  ],
  'dashboard-sport-coach-match-squad-selection': [
    { labelKey: 'breadcrumb.coachDashboard', to: { name: 'dashboard-sport-coach' } },
    { labelKey: 'breadcrumb.matches' },
    { labelKey: 'breadcrumb.matchSquad' },
  ],
  'dashboard-sport-coach-player-request': [
    { labelKey: 'breadcrumb.coachDashboard', to: { name: 'dashboard-sport-coach' } },
    { labelKey: 'breadcrumb.requests', to: { name: 'dashboard-sport-coach-requests' } },
    { labelKey: 'breadcrumb.playerRequest' },
  ],
  'dashboard-sport-coach-match-request': [
    { labelKey: 'breadcrumb.coachDashboard', to: { name: 'dashboard-sport-coach' } },
    { labelKey: 'breadcrumb.requests', to: { name: 'dashboard-sport-coach-requests' } },
    { labelKey: 'breadcrumb.matchRequest' },
  ],
  'dashboard-sport-coach-requests': [
    { labelKey: 'breadcrumb.coachDashboard', to: { name: 'dashboard-sport-coach' } },
    { labelKey: 'breadcrumb.requests' },
  ],
  'dashboard-sport-coach-training': [
    { labelKey: 'breadcrumb.coachDashboard', to: { name: 'dashboard-sport-coach' } },
    { labelKey: 'breadcrumb.training' },
  ],
  'dashboard-sport-admin-coach-team-assignments': [
    { labelKey: 'breadcrumb.sportDashboard', to: { name: 'dashboard-sport-admin' } },
    { labelKey: 'breadcrumb.coachTeamAssignments' },
  ],
  'dashboard-sport-admin-pending-player-approvals': [
    { labelKey: 'breadcrumb.sportDashboard', to: { name: 'dashboard-sport-admin' } },
    { labelKey: 'breadcrumb.pendingApprovals' },
    { labelKey: 'breadcrumb.pendingPlayerApprovals' },
  ],
  'dashboard-sport-admin-pending-match-approvals': [
    { labelKey: 'breadcrumb.sportDashboard', to: { name: 'dashboard-sport-admin' } },
    { labelKey: 'breadcrumb.pendingApprovals' },
    { labelKey: 'breadcrumb.pendingMatchApprovals' },
  ],
  'dashboard-sport-admin-player-lifecycle': [
    { labelKey: 'breadcrumb.sportDashboard', to: { name: 'dashboard-sport-admin' } },
    { labelKey: 'breadcrumb.playerLifecycle' },
  ],
  'dashboard-sport-admin-match-squad-review': [
    { labelKey: 'breadcrumb.sportDashboard', to: { name: 'dashboard-sport-admin' } },
    { labelKey: 'breadcrumb.matches', to: { name: 'dashboard-sport-admin-matches' } },
    { labelKey: 'breadcrumb.matchSquadReview' },
  ],
  'dashboard-sport-admin-tournaments': [
    { labelKey: 'breadcrumb.sportDashboard', to: { name: 'dashboard-sport-admin' } },
    { labelKey: 'breadcrumb.tournaments' },
  ],
  'dashboard-sport-admin-tournaments-create': [
    { labelKey: 'breadcrumb.sportDashboard', to: { name: 'dashboard-sport-admin' } },
    { labelKey: 'breadcrumb.tournaments', to: { name: 'dashboard-sport-admin-tournaments' } },
    { labelKey: 'breadcrumb.addTournament' },
  ],
  'dashboard-sport-admin-tournaments-edit': [
    { labelKey: 'breadcrumb.sportDashboard', to: { name: 'dashboard-sport-admin' } },
    { labelKey: 'breadcrumb.tournaments', to: { name: 'dashboard-sport-admin-tournaments' } },
    { labelKey: 'breadcrumb.editTournament' },
  ],
  'dashboard-sport-admin-tournaments-groups': [
    { labelKey: 'breadcrumb.sportDashboard', to: { name: 'dashboard-sport-admin' } },
    { labelKey: 'breadcrumb.tournaments', to: { name: 'dashboard-sport-admin-tournaments' } },
    { labelKey: 'breadcrumb.tournamentGroups' },
  ],
  'dashboard-sport-admin-tournaments-fixtures': [
    { labelKey: 'breadcrumb.sportDashboard', to: { name: 'dashboard-sport-admin' } },
    { labelKey: 'breadcrumb.tournaments', to: { name: 'dashboard-sport-admin-tournaments' } },
    { labelKey: 'breadcrumb.tournamentFixtures' },
  ],
  'dashboard-sport-admin-tournaments-standings': [
    { labelKey: 'breadcrumb.sportDashboard', to: { name: 'dashboard-sport-admin' } },
    { labelKey: 'breadcrumb.tournaments', to: { name: 'dashboard-sport-admin-tournaments' } },
    { labelKey: 'breadcrumb.tournamentStandings' },
  ],
  'dashboard-sport-admin-tournaments-results': [
    { labelKey: 'breadcrumb.sportDashboard', to: { name: 'dashboard-sport-admin' } },
    { labelKey: 'breadcrumb.tournaments', to: { name: 'dashboard-sport-admin-tournaments' } },
    { labelKey: 'breadcrumb.tournamentResults' },
  ],
  'dashboard-sport-admin-tournaments-knockout': [
    { labelKey: 'breadcrumb.sportDashboard', to: { name: 'dashboard-sport-admin' } },
    { labelKey: 'breadcrumb.tournaments', to: { name: 'dashboard-sport-admin-tournaments' } },
    { labelKey: 'breadcrumb.tournamentKnockout' },
  ],
  'dashboard-sport-admin-tournaments-detail': [
    { labelKey: 'breadcrumb.sportDashboard', to: { name: 'dashboard-sport-admin' } },
    { labelKey: 'breadcrumb.tournaments', to: { name: 'dashboard-sport-admin-tournaments' } },
    { labelKey: 'breadcrumb.tournamentDetail' },
  ],
}
const CRUMB_MAP = {
  // ── Admin dashboard — root of the module; single crumb, no parent link ───
  'dashboard-preschool-admin': [
    { labelKey: 'breadcrumb.dashboard' },
  ],

  // ── Students ��─────────────────────��────────────────────────────────��──────
  'dashboard-preschool-admin-students': [
    { labelKey: 'breadcrumb.preschool', to: { name: 'dashboard-preschool-admin' } },
    { labelKey: 'breadcrumb.students' },
  ],
  'dashboard-preschool-admin-students-add': [
    { labelKey: 'breadcrumb.preschool', to: { name: 'dashboard-preschool-admin' } },
    { labelKey: 'breadcrumb.students', to: { name: 'dashboard-preschool-admin-students' } },
    { labelKey: 'breadcrumb.addStudent' },
  ],
  'dashboard-preschool-admin-students-edit': [
    { labelKey: 'breadcrumb.preschool', to: { name: 'dashboard-preschool-admin' } },
    { labelKey: 'breadcrumb.students', to: { name: 'dashboard-preschool-admin-students' } },
    { labelKey: 'breadcrumb.editStudent' },
  ],
  'dashboard-preschool-admin-student-profile': [
    { labelKey: 'breadcrumb.preschool', to: { name: 'dashboard-preschool-admin' } },
    { labelKey: 'breadcrumb.students', to: { name: 'dashboard-preschool-admin-students' } },
    { labelKey: 'breadcrumb.studentProfile' },
  ],

  // ── Teachers ─────��────────────────────────────��───────────────────────────
  'dashboard-preschool-admin-users': [
    { labelKey: 'breadcrumb.preschool', to: { name: 'dashboard-preschool-admin' } },
    { labelKey: 'breadcrumb.teachers' },
  ],
  'dashboard-preschool-admin-users-add': [
    { labelKey: 'breadcrumb.preschool', to: { name: 'dashboard-preschool-admin' } },
    { labelKey: 'breadcrumb.teachers', to: { name: 'dashboard-preschool-admin-users' } },
    { labelKey: 'breadcrumb.addTeacher' },
  ],
  'dashboard-preschool-admin-teacher-view': [
    { labelKey: 'breadcrumb.preschool', to: { name: 'dashboard-preschool-admin' } },
    { labelKey: 'breadcrumb.teachers', to: { name: 'dashboard-preschool-admin-users' } },
    { labelKey: 'breadcrumb.teacherDetail' },
  ],

  // ── Classes ───────────────────────��─────────────────────────────���─────────
  'dashboard-preschool-admin-classes': [
    { labelKey: 'breadcrumb.preschool', to: { name: 'dashboard-preschool-admin' } },
    { labelKey: 'breadcrumb.classes' },
  ],
  'dashboard-preschool-admin-classes-add': [
    { labelKey: 'breadcrumb.preschool', to: { name: 'dashboard-preschool-admin' } },
    { labelKey: 'breadcrumb.classes', to: { name: 'dashboard-preschool-admin-classes' } },
    { labelKey: 'breadcrumb.addClass' },
  ],

  // ── Payment ───────────────────────���───────────────────────────────────────
  'dashboard-preschool-admin-payment': [
    { labelKey: 'breadcrumb.preschool', to: { name: 'dashboard-preschool-admin' } },
    { labelKey: 'breadcrumb.payment' },
  ],

  // ── Attendance ────────────────────���───────────────────────────────────────
  'dashboard-preschool-admin-attendance': [
    { labelKey: 'breadcrumb.preschool', to: { name: 'dashboard-preschool-admin' } },
    { labelKey: 'breadcrumb.attendance' },
  ],
  'dashboard-preschool-admin-attendance-students': [
    { labelKey: 'breadcrumb.preschool', to: { name: 'dashboard-preschool-admin' } },
    { labelKey: 'breadcrumb.attendance', to: { name: 'dashboard-preschool-admin-attendance' } },
    { labelKey: 'breadcrumb.attendanceStudents' },
  ],
  'dashboard-preschool-admin-attendance-history': [
    { labelKey: 'breadcrumb.preschool', to: { name: 'dashboard-preschool-admin' } },
    { labelKey: 'breadcrumb.attendance', to: { name: 'dashboard-preschool-admin-attendance' } },
    { labelKey: 'breadcrumb.attendanceHistory' },
  ],
  'dashboard-preschool-admin-attendance-dashboard': [
    { labelKey: 'breadcrumb.preschool', to: { name: 'dashboard-preschool-admin' } },
    { labelKey: 'breadcrumb.attendance', to: { name: 'dashboard-preschool-admin-attendance' } },
    { labelKey: 'breadcrumb.attendanceDashboard' },
  ],
  'dashboard-preschool-admin-attendance-alerts': [
    { labelKey: 'breadcrumb.preschool', to: { name: 'dashboard-preschool-admin' } },
    { labelKey: 'breadcrumb.attendance', to: { name: 'dashboard-preschool-admin-attendance' } },
    { labelKey: 'breadcrumb.attendanceAlerts' },
  ],
  'dashboard-preschool-admin-attendance-calendar': [
    { labelKey: 'breadcrumb.preschool', to: { name: 'dashboard-preschool-admin' } },
    { labelKey: 'breadcrumb.attendance', to: { name: 'dashboard-preschool-admin-attendance' } },
    { labelKey: 'breadcrumb.attendanceCalendar' },
  ],
  'dashboard-preschool-admin-attendance-profile': [
    { labelKey: 'breadcrumb.preschool', to: { name: 'dashboard-preschool-admin' } },
    { labelKey: 'breadcrumb.attendance', to: { name: 'dashboard-preschool-admin-attendance' } },
    { labelKey: 'breadcrumb.attendanceProfile' },
  ],
  'dashboard-preschool-admin-attendance-id-card': [
    { labelKey: 'breadcrumb.preschool', to: { name: 'dashboard-preschool-admin' } },
    { labelKey: 'breadcrumb.attendance', to: { name: 'dashboard-preschool-admin-attendance' } },
    { labelKey: 'breadcrumb.attendanceIdCard' },
  ],

  // ── Enrollment ──────────────────────────────────────────────────��─────────
  'dashboard-preschool-admin-enrollments': [
    { labelKey: 'breadcrumb.preschool', to: { name: 'dashboard-preschool-admin' } },
    { labelKey: 'breadcrumb.enrollment' },
  ],

  // ── Assignments ────────────────────────────────────────────────────��──────
  'dashboard-preschool-admin-assignments': [
    { labelKey: 'breadcrumb.preschool', to: { name: 'dashboard-preschool-admin' } },
    { labelKey: 'breadcrumb.assignments' },
  ],

  // ── Assessments ───────────────────────────────────────��───────────────────
  'dashboard-preschool-assessments': [
    { labelKey: 'breadcrumb.preschool', to: { name: 'dashboard-preschool-admin' } },
    { labelKey: 'breadcrumb.assessments' },
  ],
  'dashboard-preschool-assessments-add': [
    { labelKey: 'breadcrumb.preschool', to: { name: 'dashboard-preschool-admin' } },
    { labelKey: 'breadcrumb.assessments', to: { name: 'dashboard-preschool-assessments' } },
    { labelKey: 'breadcrumb.addAssessment' },
  ],
  'dashboard-preschool-progress-summary': [
    { labelKey: 'breadcrumb.preschool', to: { name: 'dashboard-preschool-admin' } },
    { labelKey: 'breadcrumb.assessments', to: { name: 'dashboard-preschool-assessments' } },
    { labelKey: 'breadcrumb.progressSummary' },
  ],

  // ── Schedules ───────────────────��─────────────────────────────────────────
  'dashboard-preschool-admin-schedules': [
    { labelKey: 'breadcrumb.preschool', to: { name: 'dashboard-preschool-admin' } },
    { labelKey: 'breadcrumb.schedules' },
  ],
  'dashboard-preschool-admin-class-schedule': [
    { labelKey: 'breadcrumb.preschool', to: { name: 'dashboard-preschool-admin' } },
    { labelKey: 'breadcrumb.schedules', to: { name: 'dashboard-preschool-admin-schedules' } },
    { labelKey: 'breadcrumb.classSchedule' },
  ],
  'dashboard-preschool-admin-teacher-schedule': [
    { labelKey: 'breadcrumb.preschool', to: { name: 'dashboard-preschool-admin' } },
    { labelKey: 'breadcrumb.schedules', to: { name: 'dashboard-preschool-admin-schedules' } },
    { labelKey: 'breadcrumb.teacherSchedule' },
  ],

  // ── Reports ──────────────────────────��─────────────────────────────────��──
  'dashboard-preschool-admin-reports': [
    { labelKey: 'breadcrumb.preschool', to: { name: 'dashboard-preschool-admin' } },
    { labelKey: 'breadcrumb.reports' },
  ],
  'dashboard-preschool-admin-student-reports': [
    { labelKey: 'breadcrumb.preschool', to: { name: 'dashboard-preschool-admin' } },
    { labelKey: 'breadcrumb.reports', to: { name: 'dashboard-preschool-admin-reports' } },
    { labelKey: 'breadcrumb.studentReports' },
  ],
  'dashboard-preschool-admin-classroom-reports': [
    { labelKey: 'breadcrumb.preschool', to: { name: 'dashboard-preschool-admin' } },
    { labelKey: 'breadcrumb.reports', to: { name: 'dashboard-preschool-admin-reports' } },
    { labelKey: 'breadcrumb.classroomReports' },
  ],
  'dashboard-preschool-admin-lifecycle-audit': [
    { labelKey: 'breadcrumb.preschool', to: { name: 'dashboard-preschool-admin' } },
    { labelKey: 'breadcrumb.reports', to: { name: 'dashboard-preschool-admin-reports' } },
    { labelKey: 'breadcrumb.lifecycleAudit' },
  ],
  'dashboard-preschool-admin-report-snapshots': [
    { labelKey: 'breadcrumb.preschool', to: { name: 'dashboard-preschool-admin' } },
    { labelKey: 'breadcrumb.reports', to: { name: 'dashboard-preschool-admin-reports' } },
    { labelKey: 'breadcrumb.snapshotArchive' },
  ],
  'dashboard-preschool-admin-export-governance': [
    { labelKey: 'breadcrumb.preschool', to: { name: 'dashboard-preschool-admin' } },
    { labelKey: 'breadcrumb.reports', to: { name: 'dashboard-preschool-admin-reports' } },
    { labelKey: 'breadcrumb.exportGovernance' },
  ],

  // ── Governance ────────────────────────────────────────────────────────────
  'dashboard-preschool-admin-governance-review': [
    { labelKey: 'breadcrumb.preschool', to: { name: 'dashboard-preschool-admin' } },
    { labelKey: 'breadcrumb.governance' },
    { labelKey: 'breadcrumb.governanceReview' },
  ],
  'dashboard-preschool-admin-reconstruction': [
    { labelKey: 'breadcrumb.preschool', to: { name: 'dashboard-preschool-admin' } },
    { labelKey: 'breadcrumb.governance' },
    { labelKey: 'breadcrumb.reconstruction' },
  ],
  'dashboard-preschool-admin-governance-diff': [
    { labelKey: 'breadcrumb.preschool', to: { name: 'dashboard-preschool-admin' } },
    { labelKey: 'breadcrumb.governance' },
    { labelKey: 'breadcrumb.diffAnalysis' },
  ],
  'dashboard-preschool-admin-governance-cases': [
    { labelKey: 'breadcrumb.preschool', to: { name: 'dashboard-preschool-admin' } },
    { labelKey: 'breadcrumb.governance' },
    { labelKey: 'breadcrumb.governanceCases' },
  ],

  // ── Other admin pages ───────────────────────���─────────────────────────────
  'dashboard-preschool-admin-forms': [
    { labelKey: 'breadcrumb.preschool', to: { name: 'dashboard-preschool-admin' } },
    { labelKey: 'breadcrumb.forms' },
  ],
  'dashboard-preschool-admin-classroom-resources': [
    { labelKey: 'breadcrumb.preschool', to: { name: 'dashboard-preschool-admin' } },
    { labelKey: 'breadcrumb.classroomResources' },
  ],
  'dashboard-preschool-admin-settings': [
    { labelKey: 'breadcrumb.preschool', to: { name: 'dashboard-preschool-admin' } },
    { labelKey: 'breadcrumb.settings' },
  ],

  // ── Teacher portal ──────────────────────────────────────────────────��─────
  // root of the teacher section — single crumb, no parent link
  'dashboard-preschool-teacher': [
    { labelKey: 'breadcrumb.teacherDashboard' },
  ],
  'dashboard-preschool-teacher-students': [
    { labelKey: 'breadcrumb.preschool', to: { name: 'dashboard-preschool-teacher' } },
    { labelKey: 'breadcrumb.myStudents' },
  ],
  'dashboard-preschool-teacher-schedule': [
    { labelKey: 'breadcrumb.preschool', to: { name: 'dashboard-preschool-teacher' } },
    { labelKey: 'breadcrumb.mySchedule' },
  ],
  'dashboard-preschool-teacher-report': [
    { labelKey: 'breadcrumb.preschool', to: { name: 'dashboard-preschool-teacher' } },
    { labelKey: 'breadcrumb.studentReports' },
  ],
  'dashboard-preschool-teacher-classroomresources': [
    { labelKey: 'breadcrumb.preschool', to: { name: 'dashboard-preschool-teacher' } },
    { labelKey: 'breadcrumb.classroomResources' },
  ],
  'dashboard-preschool-teacher-healthy': [
    { labelKey: 'breadcrumb.preschool', to: { name: 'dashboard-preschool-teacher' } },
    { labelKey: 'breadcrumb.health' },
  ],
}

/**
 * Resolved breadcrumb trail for the current route.
 * Returns an empty array when the route has no entry in CRUMB_MAP,
 * so the component renders nothing on unknown pages.
 * @returns {Array<{ label: string, to?: Object }>}
 */
const crumbs = computed(() => {
  const trail = {
    ...SPORT_CRUMB_MAP,
    ...CRUMB_MAP,
  }[route.name] ?? []
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
