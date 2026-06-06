<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import { useDsamFormBuilderStore } from '../stores/useDsamFormBuilderStore'
import { dsamFormApi } from '../services/dsamFormApi'
import SectionPanel from '../components/form-builder/SectionPanel.vue'
import QuestionCard from '../components/form-builder/QuestionCard.vue'
import InspectorPanel from '../components/form-builder/InspectorPanel.vue'
import Button from '@/components/buttons/Button.vue'
import Select from 'primevue/select'
import Tag from 'primevue/tag'
import Dialog from 'primevue/dialog'

defineOptions({ name: 'DsamFormBuilderPage' })

const route  = useRoute()
const router = useRouter()
const toast  = useToast()
const store  = useDsamFormBuilderStore()

const addingQuestion  = ref(false)
const selectedTypeId  = ref(null)
const showPublishDlg  = ref(false)
const showVersionDlg  = ref(false)
const versionNotes    = ref('')
const publishing      = ref(false)
const archiving       = ref(false)
const creatingVersion = ref(false)

const statusSeverity = { draft: 'warn', published: 'success', archived: 'secondary' }

// Pre-publish readiness derived from store state
const readiness = computed(() => {
  const sectionCount   = store.sections.length
  const totalQuestions = store.sections.reduce((n, s) => n + (s.questions?.length ?? 0), 0)
  const emptySections  = store.sections.filter(s => !(s.questions?.length)).map(s => s.title)
  return { sectionCount, totalQuestions, emptySections, ok: sectionCount > 0 && totalQuestions > 0 }
})

const publishedAt = computed(() => {
  const d = store.template?.published_at
  return d ? new Date(d).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : null
})

onMounted(async () => {
  const id = route.params.id
  if (id) {
    await store.load(id)
  } else {
    store.reset()
    await store.load(await createNewForm())
  }
})

onUnmounted(() => store.reset())

async function createNewForm() {
  const res = await dsamFormApi.create({ name: 'Untitled Form', category: 'annual_assessment' })
  router.replace({ name: 'dsam-form-builder-edit', params: { id: res.data.data.id } })
  return res.data.data.id
}

async function addQuestion() {
  if (!selectedTypeId.value || !store.activeSectionId) return
  await store.addQuestion(store.activeSectionId, {
    question_type_id: selectedTypeId.value,
    label: 'New question',
  })
  addingQuestion.value = false
  selectedTypeId.value = null
}

async function confirmPublish() {
  publishing.value = true
  try {
    await store.publish()
    showPublishDlg.value = false
    toast.add({ severity: 'success', summary: 'Published', detail: 'Form is now live and available for assessments.', life: 4000 })
  } catch (e) {
    toast.add({ severity: 'error', summary: 'Publish failed', detail: e?.response?.data?.message ?? e.message, life: 5000 })
  } finally {
    publishing.value = false
  }
}

async function archiveForm() {
  archiving.value = true
  try {
    await store.archive()
    toast.add({ severity: 'info', summary: 'Archived', detail: 'Form is archived and no longer available for new assessments.', life: 4000 })
  } catch (e) {
    toast.add({ severity: 'error', summary: 'Error', detail: e?.response?.data?.message ?? e.message, life: 5000 })
  } finally {
    archiving.value = false
  }
}

async function createNewVersion() {
  creatingVersion.value = true
  try {
    const newForm = await store.createNewVersion({ version_notes: versionNotes.value || null })
    showVersionDlg.value = false
    versionNotes.value = ''
    toast.add({ severity: 'success', summary: `v${newForm.version_number} created`, detail: 'New draft version ready to edit.', life: 4000 })
    router.push({ name: 'dsam-form-builder-edit', params: { id: newForm.id } })
  } catch (e) {
    toast.add({ severity: 'error', summary: 'Error', detail: e?.response?.data?.message ?? e.message, life: 5000 })
  } finally {
    creatingVersion.value = false
  }
}
</script>

<template>
  <div class="flex h-screen flex-col overflow-hidden bg-slate-100">

    <!-- Topbar -->
    <header class="flex h-14 shrink-0 items-center gap-3 border-b border-slate-200 bg-white px-4 shadow-sm">
      <button
        class="rounded p-1.5 text-slate-400 hover:bg-slate-100"
        @click="router.push({ name: 'dsam-form-list' })"
      >
        <i class="pi pi-arrow-left" />
      </button>

      <div class="flex-1 min-w-0">
        <h1 class="truncate text-sm font-semibold text-slate-800">
          {{ store.template?.name ?? 'Loading…' }}
        </h1>
        <p class="text-xs text-slate-400">
          Form Builder
          <span v-if="store.template?.version_number"> · v{{ store.template.version_number }}</span>
          <span v-if="publishedAt" class="ml-1">· Published {{ publishedAt }}</span>
        </p>
      </div>

      <Tag
        v-if="store.template?.status"
        :severity="statusSeverity[store.template.status]"
        :value="store.template.status"
      />

      <!-- Draft actions -->
      <template v-if="store.isEditable">
        <Button
          label="Publish"
          icon="pi pi-send"
          size="sm"
          @click="showPublishDlg = true"
        />
      </template>

      <!-- Published actions -->
      <template v-else-if="store.isPublished">
        <Button
          label="New Version"
          icon="pi pi-code-branch"
          size="sm"
          severity="secondary"
          @click="showVersionDlg = true"
        />
        <Button
          label="Archive"
          icon="pi pi-inbox"
          size="sm"
          severity="secondary"
          :loading="archiving"
          @click="archiveForm"
        />
      </template>
    </header>

    <!-- 3-panel body -->
    <div class="flex flex-1 overflow-hidden">

      <!-- Left: Section list -->
      <SectionPanel />

      <!-- Center: Canvas -->
      <main class="flex flex-1 flex-col overflow-hidden">
        <div v-if="store.isLoading" class="flex flex-1 items-center justify-center text-slate-400">
          <i class="pi pi-spin pi-spinner text-2xl" />
        </div>

        <div v-else-if="!store.activeSection" class="flex flex-1 items-center justify-center text-center text-slate-400 p-10">
          <div>
            <i class="pi pi-layout mb-3 text-4xl" />
            <p class="font-medium">Add a section first</p>
            <p class="text-sm mt-1">Use the panel on the left to add your first section.</p>
          </div>
        </div>

        <template v-else>
          <!-- Section header -->
          <div class="flex items-center gap-2 border-b border-slate-200 bg-white px-5 py-3">
            <h2 class="flex-1 text-sm font-semibold text-slate-800">
              {{ store.activeSection.title }}
            </h2>
            <span class="text-xs text-slate-400">
              weight: {{ (Number(store.activeSection.scoring_weight) * 100).toFixed(0) }}%
            </span>
          </div>

          <!-- Questions -->
          <div class="flex-1 overflow-y-auto p-5 space-y-2">
            <QuestionCard
              v-for="question in store.activeSection.questions ?? []"
              :key="question.id"
              :question="question"
              :section-id="store.activeSection.id"
            />

            <div v-if="!(store.activeSection.questions ?? []).length" class="rounded-xl border-2 border-dashed border-slate-200 p-8 text-center text-sm text-slate-400">
              No questions in this section yet.
            </div>

            <!-- Add question (draft only) -->
            <div v-if="store.isEditable">
              <div v-if="addingQuestion" class="flex items-center gap-2 rounded-xl border border-slate-200 bg-white p-3">
                <Select
                  v-model="selectedTypeId"
                  :options="store.questionTypes"
                  option-label="display_name"
                  option-value="id"
                  placeholder="Select question type…"
                  class="flex-1"
                />
                <Button label="Add" size="sm" :disabled="!selectedTypeId" @click="addQuestion" />
                <Button label="Cancel" size="sm" severity="secondary" @click="addingQuestion = false" />
              </div>
              <button
                v-else
                class="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-blue-200 py-3 text-sm text-blue-500 hover:border-blue-400 hover:bg-blue-50 transition-colors"
                @click="addingQuestion = true"
              >
                <i class="pi pi-plus" />
                Add question
              </button>
            </div>

            <!-- Archived notice -->
            <div v-else-if="store.isArchived" class="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700">
              <i class="pi pi-info-circle mr-1" />
              This form is archived. Create a new version to make changes.
            </div>
          </div>
        </template>
      </main>

      <!-- Right: Inspector -->
      <InspectorPanel />
    </div>

    <!-- ── Publish confirmation dialog ─────────────────────────────────── -->
    <Dialog
      v-model:visible="showPublishDlg"
      header="Publish Form"
      :style="{ width: '26rem' }"
      :modal="true"
      :closable="!publishing"
    >
      <div class="space-y-4 pt-1 text-sm">
        <p class="text-slate-600">Once published, the form becomes available for assessments. You won't be able to edit it directly — use <strong>New Version</strong> instead.</p>

        <!-- Readiness checklist -->
        <div class="rounded-lg border border-slate-200 bg-slate-50 p-3 space-y-2">
          <p class="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-1">Readiness check</p>

          <div class="flex items-center gap-2">
            <i :class="readiness.sectionCount > 0 ? 'pi-check-circle text-emerald-500' : 'pi-times-circle text-red-500'" class="pi text-base" />
            <span :class="readiness.sectionCount > 0 ? 'text-slate-700' : 'text-red-600'">
              {{ readiness.sectionCount }} section{{ readiness.sectionCount !== 1 ? 's' : '' }}
            </span>
          </div>

          <div class="flex items-center gap-2">
            <i :class="readiness.totalQuestions > 0 ? 'pi-check-circle text-emerald-500' : 'pi-times-circle text-red-500'" class="pi text-base" />
            <span :class="readiness.totalQuestions > 0 ? 'text-slate-700' : 'text-red-600'">
              {{ readiness.totalQuestions }} question{{ readiness.totalQuestions !== 1 ? 's' : '' }} total
            </span>
          </div>

          <div v-if="readiness.emptySections.length" class="flex items-start gap-2 text-amber-700">
            <i class="pi pi-exclamation-triangle text-base mt-0.5" />
            <span>Empty sections: {{ readiness.emptySections.join(', ') }}</span>
          </div>
        </div>

        <p v-if="!readiness.ok" class="text-red-600 text-xs">
          Add at least one section with one question before publishing.
        </p>
      </div>

      <template #footer>
        <Button label="Cancel" severity="secondary" :disabled="publishing" @click="showPublishDlg = false" />
        <Button
          label="Publish Now"
          icon="pi pi-send"
          :loading="publishing"
          :disabled="!readiness.ok"
          @click="confirmPublish"
        />
      </template>
    </Dialog>

    <!-- ── New Version dialog ──────────────────────────────────────────── -->
    <Dialog
      v-model:visible="showVersionDlg"
      header="Create New Version"
      :style="{ width: '24rem' }"
      :modal="true"
      :closable="!creatingVersion"
    >
      <div class="space-y-3 pt-1 text-sm text-slate-600">
        <p>A new draft copy of <strong>v{{ store.template?.version_number }}</strong> will be created. The current published version stays live until the new version is published.</p>
        <div>
          <label class="mb-1 block text-xs font-medium text-slate-700">Version notes <span class="text-slate-400">(optional)</span></label>
          <textarea
            v-model="versionNotes"
            rows="2"
            class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="What's changing in this version?"
          />
        </div>
      </div>

      <template #footer>
        <Button label="Cancel" severity="secondary" :disabled="creatingVersion" @click="showVersionDlg = false" />
        <Button
          label="Create Draft"
          icon="pi pi-code-branch"
          :loading="creatingVersion"
          @click="createNewVersion"
        />
      </template>
    </Dialog>

  </div>
</template>
