<template>
  <div class="p-4 md:p-6">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-surface-800 dark:text-surface-100">
        {{ t('preschoolGuardianRemediation.page.title') }}
      </h1>
      <p class="text-surface-500 mt-1">{{ t('preschoolGuardianRemediation.page.subtitle') }}</p>
    </div>

    <Message v-if="errorMessage" severity="error" :closable="true" class="mb-4" @close="clearMessages">
      {{ errorMessage }}
    </Message>
    <Message v-if="successMessage" severity="success" :closable="true" class="mb-4" @close="clearMessages">
      {{ successMessage }}
    </Message>

    <TabView>
      <!-- Consistency Issues -->
      <TabPanel :header="t('preschoolGuardianRemediation.tabs.issues')">
        <div v-if="integrityLoading" class="py-8 text-center text-surface-400">
          {{ t('preschoolGuardianRemediation.page.loadingIssues') }}
        </div>
        <div v-else-if="consistencyIssues.length === 0" class="py-8 text-center text-surface-400">
          {{ t('preschoolGuardianRemediation.page.noIssues') }}
        </div>
        <div v-else class="space-y-4">
          <GuardianRemediationActionPanel
            v-for="issue in consistencyIssues"
            :key="issue.id"
            :issue="issue"
          >
            <template #actions>
              <div class="flex flex-wrap gap-2 mt-3">
                <!-- mark-reviewed: available for any issue -->
                <Button
                  :label="t('preschoolGuardianRemediation.actions.markReviewed')"
                  size="small"
                  severity="secondary"
                  :loading="actionLoading && activeIssueId === issue.id"
                  @click="openDialog('mark_reviewed', issue)"
                />

                <!-- set-primary: for multiple_active_primary_guardians -->
                <Button
                  v-if="issue.type === 'multiple_active_primary_guardians' && issue.relationship"
                  :label="t('preschoolGuardianRemediation.actions.setPrimary')"
                  size="small"
                  severity="warn"
                  :loading="actionLoading && activeIssueId === issue.id"
                  @click="openDialog('set_primary', issue)"
                />

                <!-- clear-invalid-primary: for archived_primary_relationship -->
                <Button
                  v-if="issue.type === 'archived_primary_relationship' && issue.relationship"
                  :label="t('preschoolGuardianRemediation.actions.clearInvalidPrimary')"
                  size="small"
                  severity="warn"
                  :loading="actionLoading && activeIssueId === issue.id"
                  @click="openDialog('clear_invalid_primary', issue)"
                />

                <!-- clear-invalid-emergency: for inactive_emergency_contact -->
                <Button
                  v-if="issue.type === 'inactive_emergency_contact' && issue.relationship"
                  :label="t('preschoolGuardianRemediation.actions.clearInvalidEmergencyContact')"
                  size="small"
                  severity="warn"
                  :loading="actionLoading && activeIssueId === issue.id"
                  @click="openDialog('clear_invalid_emergency_contact', issue)"
                />

                <!-- reconcile-legacy: for legacy_guardian_mismatch -->
                <Button
                  v-if="issue.type === 'legacy_guardian_mismatch' && issue.student"
                  :label="t('preschoolGuardianRemediation.actions.reconcileLegacyFields')"
                  size="small"
                  severity="warn"
                  :loading="actionLoading && activeIssueId === issue.id"
                  @click="openDialog('reconcile_legacy_fields', issue)"
                />

                <!-- archive-orphan: for guardian_without_students -->
                <Button
                  v-if="issue.type === 'guardian_without_students' && issue.guardian"
                  :label="t('preschoolGuardianRemediation.actions.archiveOrphanGuardian')"
                  size="small"
                  severity="danger"
                  :loading="actionLoading && activeIssueId === issue.id"
                  @click="openDialog('archive_orphan_guardian', issue)"
                />
              </div>
            </template>
          </GuardianRemediationActionPanel>
        </div>
        <div class="mt-4 flex justify-end">
          <Button
            :label="t('preschoolGuardianRemediation.actions.refreshIssues')"
            size="small"
            severity="secondary"
            :loading="integrityLoading"
            @click="reloadIntegrity"
          />
        </div>
      </TabPanel>

      <!-- Remediation Logs -->
      <TabPanel :header="t('preschoolGuardianRemediation.tabs.logs')">
        <GuardianRemediationLogTable
          :items="logs.items"
          :meta="logs.meta"
          :loading="loading"
          @view-snapshots="openSnapshotDialog"
          @page-change="onPageChange"
        />
      </TabPanel>
    </TabView>

    <!-- Action confirmation dialog -->
    <GuardianReviewDialog
      v-if="dialogVisible"
      :visible="dialogVisible"
      :title="dialogTitle"
      :description="dialogDescription"
      :action-loading="actionLoading"
      @update:visible="dialogVisible = $event"
      @confirm="handleConfirm"
      @cancel="dialogVisible = false"
    >
      <template v-if="pendingIssue?.difference" #body>
        <div class="text-sm font-medium mb-2">
          {{ t('preschoolGuardianRemediation.labels.legacyDifferences') }}
        </div>
        <pre class="text-xs bg-surface-100 dark:bg-surface-800 rounded p-3">{{
          JSON.stringify(pendingIssue.difference, null, 2)
        }}</pre>
      </template>
    </GuardianReviewDialog>

    <!-- Snapshot viewer dialog -->
    <Dialog
      v-model:visible="snapshotDialogVisible"
      :header="t('preschoolGuardianRemediation.labels.snapshots')"
      :modal="true"
      :style="{ width: '50rem', maxWidth: '95vw' }"
    >
      <GuardianBeforeAfterSnapshot
        :before="snapshotLog?.beforeSnapshot"
        :after="snapshotLog?.afterSnapshot"
      />
    </Dialog>
  </div>
</template>

<script setup>
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import Message from 'primevue/message'
import TabPanel from 'primevue/tabpanel'
import TabView from 'primevue/tabview'
import { computed, onMounted, ref } from 'vue'
import { useLanguage } from '@/composables/useLanguage'
import { usePreschoolGuardianIntegrity } from '@/modules/preschool/composables/usePreschoolGuardianIntegrity'
import { usePreschoolGuardianRemediation } from '@/modules/preschool/composables/usePreschoolGuardianRemediation'
import GuardianBeforeAfterSnapshot from '../components/GuardianBeforeAfterSnapshot.vue'
import GuardianRemediationActionPanel from '../components/GuardianRemediationActionPanel.vue'
import GuardianRemediationLogTable from '../components/GuardianRemediationLogTable.vue'
import GuardianReviewDialog from '../components/GuardianReviewDialog.vue'

const { t } = useLanguage()

const {
  actionLoading,
  clearMessages,
  doArchiveOrphanGuardian,
  doClearInvalidEmergencyContact,
  doClearInvalidPrimary,
  doMarkReviewed,
  doReconcileLegacyFields,
  doSetPrimary,
  errorMessage,
  loadLogs,
  loading,
  logs,
  successMessage,
} = usePreschoolGuardianRemediation()

const { loading: integrityLoading, report, loadIntegrityData } = usePreschoolGuardianIntegrity()

const consistencyIssues = computed(() => report.value?.issues ?? [])

const dialogVisible = ref(false)
const dialogAction = ref('')
const dialogTitle = ref('')
const dialogDescription = ref('')
const pendingIssue = ref(null)
const activeIssueId = ref(null)

const snapshotDialogVisible = ref(false)
const snapshotLog = ref(null)

const currentPage = ref(1)

function openDialog(action, issue) {
  dialogAction.value = action
  pendingIssue.value = issue
  dialogTitle.value = t(`preschoolGuardianRemediation.dialogTitles.${camelize(action)}`)
  dialogDescription.value = t(`preschoolGuardianRemediation.dialogDescriptions.${camelize(action)}`)
  dialogVisible.value = true
}

function camelize(str) {
  return str.replace(/_([a-z])/g, (_, c) => c.toUpperCase())
}

async function handleConfirm(notes) {
  const issue = pendingIssue.value
  activeIssueId.value = issue?.id

  let ok = false

  if (dialogAction.value === 'mark_reviewed') {
    ok = await doMarkReviewed({
      issue_type: issue.type,
      issue_key: issue.id,
      student_id: issue.student?.id ?? null,
      guardian_id: issue.guardian?.id ?? null,
      relationship_id: issue.relationship?.id ?? null,
      notes,
    })
  } else if (dialogAction.value === 'set_primary') {
    ok = await doSetPrimary({
      student_id: issue.student?.id,
      relationship_id: issue.relationship?.id,
      notes,
    })
  } else if (dialogAction.value === 'clear_invalid_primary') {
    ok = await doClearInvalidPrimary({
      relationship_id: issue.relationship?.id,
      notes,
    })
  } else if (dialogAction.value === 'clear_invalid_emergency_contact') {
    ok = await doClearInvalidEmergencyContact({
      relationship_id: issue.relationship?.id,
      notes,
    })
  } else if (dialogAction.value === 'reconcile_legacy_fields') {
    ok = await doReconcileLegacyFields({
      student_id: issue.student?.id,
      confirmed: true,
      notes,
    })
  } else if (dialogAction.value === 'archive_orphan_guardian') {
    ok = await doArchiveOrphanGuardian({
      guardian_id: issue.guardian?.id,
      confirmed: true,
      notes,
    })
  }

  if (ok) {
    dialogVisible.value = false
    pendingIssue.value = null
    reloadIntegrity()
    loadLogs({ page: currentPage.value })
  }

  activeIssueId.value = null
}

function openSnapshotDialog(log) {
  snapshotLog.value = log
  snapshotDialogVisible.value = true
}

function onPageChange(event) {
  currentPage.value = Math.floor(event.first / event.rows) + 1
  loadLogs({ page: currentPage.value })
}

async function reloadIntegrity() {
  await loadIntegrityData()
}

onMounted(async () => {
  await Promise.all([loadIntegrityData(), loadLogs()])
})
</script>
