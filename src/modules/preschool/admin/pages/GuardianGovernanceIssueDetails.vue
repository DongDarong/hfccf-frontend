<template>
  <div class="space-y-6 p-4">
    <div class="flex items-center gap-3">
      <Button
        :label="t('preschoolGuardianGovernance.actions.refreshIssues')"
        severity="secondary"
        outlined
        size="small"
        @click="reload"
      />
    </div>

    <div v-if="loading" class="text-sm text-gray-400">
      {{ t('preschoolGuardianGovernance.page.loadingIssues') }}
    </div>

    <Message v-if="errorMessage" severity="error">{{ errorMessage }}</Message>
    <Message v-if="successMessage" severity="success">{{ successMessage }}</Message>

    <template v-if="currentIssue && !loading">
      <div class="bg-white border rounded p-5 space-y-4">
        <div class="flex items-start justify-between gap-2 flex-wrap">
          <div>
            <h2 class="text-lg font-bold text-gray-800">{{ issueTypeLabel }}</h2>
            <div class="text-xs text-gray-400 mt-0.5">{{ currentIssue.issueKey }}</div>
          </div>
          <div class="flex gap-1 flex-wrap">
            <GuardianGovernanceSeverityBadge :severity="currentIssue.severity" />
            <GuardianGovernancePriorityBadge :priority="currentIssue.priority" />
            <GuardianGovernanceStatusBadge :status="currentIssue.status" />
          </div>
        </div>

        <div class="flex items-center gap-3 flex-wrap">
          <GuardianIssueAgeBadge
            :days-since-detection="currentIssue.daysSinceDetection"
            :stale-threshold-days="currentIssue.staleThresholdDays"
          />
          <GuardianRecurringIssueWarning :recurrence-count="currentIssue.recurrenceCount" />
        </div>

        <GuardianIssueEscalationNotice
          :is-stale="currentIssue.isStale"
          :severity="currentIssue.severity"
          :days-since-detection="currentIssue.daysSinceDetection"
          :stale-threshold-days="currentIssue.staleThresholdDays"
        />

        <GuardianGovernanceTimeline :issue="currentIssue" />

        <div v-if="currentIssue.latestSnapshot" class="border-t pt-3">
          <div class="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">Snapshot</div>
          <pre class="bg-gray-50 rounded p-3 text-xs overflow-auto">{{ JSON.stringify(currentIssue.latestSnapshot, null, 2) }}</pre>
        </div>
      </div>

      <div v-if="isActive" class="flex gap-2 flex-wrap">
        <Button
          :label="t('preschoolGuardianGovernance.actions.acknowledge')"
          severity="info"
          :loading="actionLoading"
          @click="openAcknowledge"
        />
        <Button
          :label="t('preschoolGuardianGovernance.actions.assign')"
          severity="warn"
          :loading="actionLoading"
          @click="openAssign"
        />
        <Button
          :label="t('preschoolGuardianGovernance.actions.resolve')"
          severity="success"
          :loading="actionLoading"
          @click="openResolve"
        />
        <Button
          :label="t('preschoolGuardianGovernance.actions.dismiss')"
          severity="secondary"
          :loading="actionLoading"
          @click="openDismiss"
        />
      </div>
    </template>

    <!-- Acknowledge dialog -->
    <Dialog
      :visible="dialog.acknowledge"
      :header="t('preschoolGuardianGovernance.dialogTitles.acknowledge')"
      modal
      :closable="!actionLoading"
      @update:visible="dialog.acknowledge = false"
    >
      <p class="text-sm text-gray-600 mb-4">
        {{ t('preschoolGuardianGovernance.dialogDescriptions.acknowledge') }}
      </p>
      <template #footer>
        <Button severity="secondary" outlined :label="t('preschoolGuardianGovernance.actions.cancel')" @click="dialog.acknowledge = false" />
        <Button :label="t('preschoolGuardianGovernance.actions.confirm')" :loading="actionLoading" @click="confirmAcknowledge" />
      </template>
    </Dialog>

    <!-- Assign dialog -->
    <Dialog
      :visible="dialog.assign"
      :header="t('preschoolGuardianGovernance.dialogTitles.assign')"
      modal
      :closable="!actionLoading"
      @update:visible="dialog.assign = false"
    >
      <p class="text-sm text-gray-600 mb-4">{{ t('preschoolGuardianGovernance.dialogDescriptions.assign') }}</p>
      <GuardianGovernanceAssignmentPanel
        v-model="assignUserId"
        :notes="assignNotes"
        @update:notes="assignNotes = $event"
      />
      <template #footer>
        <Button severity="secondary" outlined :label="t('preschoolGuardianGovernance.actions.cancel')" @click="dialog.assign = false" />
        <Button :label="t('preschoolGuardianGovernance.actions.confirm')" :loading="actionLoading" :disabled="!assignUserId" @click="confirmAssign" />
      </template>
    </Dialog>

    <!-- Resolve dialog -->
    <Dialog
      :visible="dialog.resolve"
      :header="t('preschoolGuardianGovernance.dialogTitles.resolve')"
      modal
      :closable="!actionLoading"
      @update:visible="dialog.resolve = false"
    >
      <p class="text-sm text-gray-600 mb-3">{{ t('preschoolGuardianGovernance.dialogDescriptions.resolve') }}</p>
      <Textarea v-model="resolveNotes" :placeholder="t('preschoolGuardianGovernance.placeholders.notes')" :rows="3" class="w-full" />
      <template #footer>
        <Button severity="secondary" outlined :label="t('preschoolGuardianGovernance.actions.cancel')" @click="dialog.resolve = false" />
        <Button :label="t('preschoolGuardianGovernance.actions.confirm')" :loading="actionLoading" @click="confirmResolve" />
      </template>
    </Dialog>

    <!-- Dismiss dialog -->
    <Dialog
      :visible="dialog.dismiss"
      :header="t('preschoolGuardianGovernance.dialogTitles.dismiss')"
      modal
      :closable="!actionLoading"
      @update:visible="dialog.dismiss = false"
    >
      <p class="text-sm text-gray-600 mb-3">{{ t('preschoolGuardianGovernance.dialogDescriptions.dismiss') }}</p>
      <label class="text-sm font-medium text-gray-700 block mb-1">{{ t('preschoolGuardianGovernance.labels.dismissalNotes') }}</label>
      <Textarea v-model="dismissNotes" :placeholder="t('preschoolGuardianGovernance.placeholders.dismissalNotes')" :rows="4" class="w-full" />
      <template #footer>
        <Button severity="secondary" outlined :label="t('preschoolGuardianGovernance.actions.cancel')" @click="dialog.dismiss = false" />
        <Button severity="warn" :label="t('preschoolGuardianGovernance.actions.confirm')" :loading="actionLoading" :disabled="!dismissNotes.trim()" @click="confirmDismiss" />
      </template>
    </Dialog>
  </div>
</template>

<script setup>
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import Message from 'primevue/message'
import Textarea from 'primevue/textarea'
import { computed, onMounted, reactive, ref } from 'vue'
import { useLanguage } from '@/composables/useLanguage'
import { usePreschoolGuardianGovernance } from '@/modules/preschool/composables/usePreschoolGuardianGovernance'
import { ACTIVE_STATUSES } from '@/modules/preschool/services/api/preschoolGuardianGovernanceMappers'
import GuardianGovernanceAssignmentPanel from '../components/GuardianGovernanceAssignmentPanel.vue'
import GuardianGovernancePriorityBadge from '../components/GuardianGovernancePriorityBadge.vue'
import GuardianGovernanceSeverityBadge from '../components/GuardianGovernanceSeverityBadge.vue'
import GuardianGovernanceStatusBadge from '../components/GuardianGovernanceStatusBadge.vue'
import GuardianGovernanceTimeline from '../components/GuardianGovernanceTimeline.vue'
import GuardianIssueAgeBadge from '../components/GuardianIssueAgeBadge.vue'
import GuardianIssueEscalationNotice from '../components/GuardianIssueEscalationNotice.vue'
import GuardianRecurringIssueWarning from '../components/GuardianRecurringIssueWarning.vue'

const props = defineProps({
  issueId: { type: [Number, String], required: true },
})

const { t } = useLanguage()

const {
  actionLoading,
  clearMessages,
  currentIssue,
  doAcknowledge,
  doAssign,
  doDismiss,
  doResolve,
  errorMessage,
  loadIssue,
  loading,
  successMessage,
} = usePreschoolGuardianGovernance()

const dialog = reactive({ acknowledge: false, assign: false, resolve: false, dismiss: false })
const assignUserId = ref('')
const assignNotes = ref('')
const resolveNotes = ref('')
const dismissNotes = ref('')

const typeKey = computed(() =>
  currentIssue.value?.issueType.replace(/_([a-z])/g, (_, c) => c.toUpperCase()) ?? '',
)
const issueTypeLabel = computed(
  () => t(`preschoolGuardianGovernance.issueTypes.${typeKey.value}`) || currentIssue.value?.issueType,
)
const isActive = computed(() => ACTIVE_STATUSES.includes(currentIssue.value?.status ?? ''))

function reload() {
  clearMessages()
  loadIssue(props.issueId)
}

function openAcknowledge() { clearMessages(); dialog.acknowledge = true }
function openAssign() { assignUserId.value = ''; assignNotes.value = ''; clearMessages(); dialog.assign = true }
function openResolve() { resolveNotes.value = ''; clearMessages(); dialog.resolve = true }
function openDismiss() { dismissNotes.value = ''; clearMessages(); dialog.dismiss = true }

async function confirmAcknowledge() {
  const result = await doAcknowledge(props.issueId)
  if (result) dialog.acknowledge = false
}

async function confirmAssign() {
  if (!assignUserId.value) return
  const result = await doAssign(props.issueId, {
    assigned_to_user_id: assignUserId.value,
    notes: assignNotes.value || undefined,
  })
  if (result) dialog.assign = false
}

async function confirmResolve() {
  const result = await doResolve(props.issueId, { notes: resolveNotes.value || undefined })
  if (result) dialog.resolve = false
}

async function confirmDismiss() {
  if (!dismissNotes.value.trim()) return
  const result = await doDismiss(props.issueId, { notes: dismissNotes.value })
  if (result) dialog.dismiss = false
}

onMounted(() => loadIssue(props.issueId))
</script>
