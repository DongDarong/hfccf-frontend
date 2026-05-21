<template>
  <div class="space-y-6 p-4">
    <div>
      <h1 class="text-xl font-bold text-gray-800">{{ t('preschoolGuardianGovernance.page.title') }}</h1>
      <p class="text-sm text-gray-500 mt-1">{{ t('preschoolGuardianGovernance.page.subtitle') }}</p>
    </div>

    <Message v-if="errorMessage" severity="error">{{ errorMessage }}</Message>
    <Message v-if="successMessage" severity="success">{{ successMessage }}</Message>

    <div class="flex gap-2">
      <Button
        :label="t('preschoolGuardianGovernance.sync.button')"
        :loading="syncLoading"
        severity="secondary"
        @click="handleSync"
      />
      <Button
        :label="t('preschoolGuardianGovernance.actions.refreshIssues')"
        :loading="loading"
        severity="secondary"
        outlined
        @click="loadAll"
      />
    </div>

    <TabView>
      <TabPanel :header="t('preschoolGuardianGovernance.tabs.dashboard')">
        <div class="pt-4">
          <div v-if="dashboardLoading" class="text-sm text-gray-400">
            {{ t('preschoolGuardianGovernance.page.loadingIssues') }}
          </div>
          <GuardianGovernanceDashboardMetrics v-else :metrics="metrics" />
        </div>
      </TabPanel>

      <TabPanel :header="t('preschoolGuardianGovernance.tabs.issues')">
        <div class="pt-4 space-y-3">
          <div v-if="loading" class="text-sm text-gray-400">
            {{ t('preschoolGuardianGovernance.page.loadingIssues') }}
          </div>
          <p v-else-if="issues.items.length === 0" class="text-sm text-gray-400">
            {{ t('preschoolGuardianGovernance.page.noIssues') }}
          </p>
          <GuardianGovernanceIssueCard
            v-for="issue in issues.items"
            :key="issue.id"
            :issue="issue"
            :action-loading="actionLoading"
            @acknowledge="openAcknowledge"
            @assign="openAssign"
            @resolve="openResolve"
            @dismiss="openDismiss"
          />
        </div>
      </TabPanel>

      <TabPanel :header="t('preschoolGuardianGovernance.tabs.stale')">
        <div class="pt-4 space-y-3">
          <div v-if="loading" class="text-sm text-gray-400">
            {{ t('preschoolGuardianGovernance.page.loadingIssues') }}
          </div>
          <p v-else-if="staleIssues.items.length === 0" class="text-sm text-gray-400">
            {{ t('preschoolGuardianGovernance.page.noIssues') }}
          </p>
          <GuardianGovernanceIssueCard
            v-for="issue in staleIssues.items"
            :key="issue.id"
            :issue="issue"
            :action-loading="actionLoading"
            @acknowledge="openAcknowledge"
            @assign="openAssign"
            @resolve="openResolve"
            @dismiss="openDismiss"
          />
        </div>
      </TabPanel>

      <TabPanel :header="t('preschoolGuardianGovernance.tabs.recurring')">
        <div class="pt-4 space-y-3">
          <div v-if="loading" class="text-sm text-gray-400">
            {{ t('preschoolGuardianGovernance.page.loadingIssues') }}
          </div>
          <p v-else-if="recurringIssues.items.length === 0" class="text-sm text-gray-400">
            {{ t('preschoolGuardianGovernance.page.noIssues') }}
          </p>
          <GuardianGovernanceIssueCard
            v-for="issue in recurringIssues.items"
            :key="issue.id"
            :issue="issue"
            :action-loading="actionLoading"
            @acknowledge="openAcknowledge"
            @assign="openAssign"
            @resolve="openResolve"
            @dismiss="openDismiss"
          />
        </div>
      </TabPanel>
    </TabView>

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
        <Button
          :label="t('preschoolGuardianGovernance.actions.cancel')"
          severity="secondary"
          outlined
          @click="dialog.acknowledge = false"
        />
        <Button
          :label="t('preschoolGuardianGovernance.actions.confirm')"
          :loading="actionLoading"
          @click="confirmAcknowledge"
        />
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
      <p class="text-sm text-gray-600 mb-4">
        {{ t('preschoolGuardianGovernance.dialogDescriptions.assign') }}
      </p>
      <GuardianGovernanceAssignmentPanel
        v-model="assignUserId"
        :notes="assignNotes"
        @update:notes="assignNotes = $event"
      />
      <template #footer>
        <Button
          :label="t('preschoolGuardianGovernance.actions.cancel')"
          severity="secondary"
          outlined
          @click="dialog.assign = false"
        />
        <Button
          :label="t('preschoolGuardianGovernance.actions.confirm')"
          :loading="actionLoading"
          :disabled="!assignUserId"
          @click="confirmAssign"
        />
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
      <p class="text-sm text-gray-600 mb-3">
        {{ t('preschoolGuardianGovernance.dialogDescriptions.resolve') }}
      </p>
      <Textarea
        v-model="resolveNotes"
        :placeholder="t('preschoolGuardianGovernance.placeholders.notes')"
        :rows="3"
        class="w-full"
      />
      <template #footer>
        <Button
          :label="t('preschoolGuardianGovernance.actions.cancel')"
          severity="secondary"
          outlined
          @click="dialog.resolve = false"
        />
        <Button
          :label="t('preschoolGuardianGovernance.actions.confirm')"
          :loading="actionLoading"
          @click="confirmResolve"
        />
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
      <p class="text-sm text-gray-600 mb-3">
        {{ t('preschoolGuardianGovernance.dialogDescriptions.dismiss') }}
      </p>
      <label class="text-sm font-medium text-gray-700 block mb-1">
        {{ t('preschoolGuardianGovernance.labels.dismissalNotes') }}
      </label>
      <Textarea
        v-model="dismissNotes"
        :placeholder="t('preschoolGuardianGovernance.placeholders.dismissalNotes')"
        :rows="4"
        class="w-full"
      />
      <template #footer>
        <Button
          :label="t('preschoolGuardianGovernance.actions.cancel')"
          severity="secondary"
          outlined
          @click="dialog.dismiss = false"
        />
        <Button
          :label="t('preschoolGuardianGovernance.actions.confirm')"
          severity="warn"
          :loading="actionLoading"
          :disabled="!dismissNotes.trim()"
          @click="confirmDismiss"
        />
      </template>
    </Dialog>
  </div>
</template>

<script setup>
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import Message from 'primevue/message'
import TabPanel from 'primevue/tabpanel'
import TabView from 'primevue/tabview'
import Textarea from 'primevue/textarea'
import { onMounted, reactive, ref } from 'vue'
import { useLanguage } from '@/composables/useLanguage'
import { useGuardianGovernanceDashboard } from '@/modules/preschool/composables/useGuardianGovernanceDashboard'
import { usePreschoolGuardianGovernance } from '@/modules/preschool/composables/usePreschoolGuardianGovernance'
import GuardianGovernanceAssignmentPanel from '../components/GuardianGovernanceAssignmentPanel.vue'
import GuardianGovernanceDashboardMetrics from '../components/GuardianGovernanceDashboardMetrics.vue'
import GuardianGovernanceIssueCard from '../components/GuardianGovernanceIssueCard.vue'

const { t } = useLanguage()

const {
  actionLoading,
  clearMessages,
  doAcknowledge,
  doAssign,
  doDismiss,
  doResolve,
  doSync,
  errorMessage,
  issues,
  loadIssues,
  loadRecurringIssues,
  loadStaleIssues,
  loading,
  recurringIssues,
  staleIssues,
  successMessage,
  syncLoading,
} = usePreschoolGuardianGovernance()

const { loadDashboard, loading: dashboardLoading, metrics } = useGuardianGovernanceDashboard()

const dialog = reactive({
  acknowledge: false,
  assign: false,
  resolve: false,
  dismiss: false,
})

const activeIssue = ref(null)
const assignUserId = ref('')
const assignNotes = ref('')
const resolveNotes = ref('')
const dismissNotes = ref('')

async function loadAll() {
  await Promise.all([loadIssues(), loadStaleIssues(), loadRecurringIssues(), loadDashboard()])
}

async function handleSync() {
  clearMessages()
  const ok = await doSync()
  if (ok) await loadAll()
}

function openAcknowledge(issue) {
  activeIssue.value = issue
  dialog.acknowledge = true
  clearMessages()
}

function openAssign(issue) {
  activeIssue.value = issue
  assignUserId.value = ''
  assignNotes.value = ''
  dialog.assign = true
  clearMessages()
}

function openResolve(issue) {
  activeIssue.value = issue
  resolveNotes.value = ''
  dialog.resolve = true
  clearMessages()
}

function openDismiss(issue) {
  activeIssue.value = issue
  dismissNotes.value = ''
  dialog.dismiss = true
  clearMessages()
}

async function confirmAcknowledge() {
  if (!activeIssue.value) return
  const result = await doAcknowledge(activeIssue.value.id)
  if (result) {
    dialog.acknowledge = false
    await loadAll()
  }
}

async function confirmAssign() {
  if (!activeIssue.value || !assignUserId.value) return
  const result = await doAssign(activeIssue.value.id, {
    assigned_to_user_id: assignUserId.value,
    notes: assignNotes.value || undefined,
  })
  if (result) {
    dialog.assign = false
    await loadAll()
  }
}

async function confirmResolve() {
  if (!activeIssue.value) return
  const result = await doResolve(activeIssue.value.id, {
    notes: resolveNotes.value || undefined,
  })
  if (result) {
    dialog.resolve = false
    await loadAll()
  }
}

async function confirmDismiss() {
  if (!activeIssue.value || !dismissNotes.value.trim()) return
  const result = await doDismiss(activeIssue.value.id, { notes: dismissNotes.value })
  if (result) {
    dialog.dismiss = false
    await loadAll()
  }
}

onMounted(loadAll)
</script>
