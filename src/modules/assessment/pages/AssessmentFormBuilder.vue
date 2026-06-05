<script setup>
import { onMounted, onUnmounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import MainLayout from '@/layouts/MainLayout.vue'
import Button from '@/components/buttons/Button.vue'
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import Tag from 'primevue/tag'
import { useLanguage } from '@/composables/useLanguage'
import { useFormBuilderStore } from '../stores/useFormBuilderStore'
import { useAutoSave } from '../composables/useAutoSave'
import { useToast } from 'primevue/usetoast'
import { useConfirm } from 'primevue/useconfirm'
import FormSectionPanel from '../components/form-builder/FormSectionPanel.vue'

defineOptions({ name: 'AssessmentFormBuilderPage' })

const route  = useRoute()
const router = useRouter()
const { t }  = useLanguage()
const store  = useFormBuilderStore()
const toast  = useToast()
const confirm = useConfirm()

const { lastSavedAt, isSaving: autoSaving, scheduleAutoSave } = useAutoSave(
  () => store.saveTemplate({
    name:        store.template?.name,
    description: store.template?.description,
    module:      store.template?.module ?? 'preschool',
  }),
)

watch(() => store.isDirty, (dirty) => {
  if (dirty) scheduleAutoSave()
})

const statusSeverity = { draft: 'warn', published: 'success', archived: 'secondary' }

async function publish() {
  confirm.require({
    message: t('formBuilder.publishConfirm'),
    header:  t('formBuilder.publish'),
    icon:    'pi pi-send',
    acceptClass: 'p-button-success',
    accept: async () => {
      try {
        await store.publishTemplate()
        toast.add({ severity: 'success', summary: t('formBuilder.published'), life: 3000 })
      } catch {
        toast.add({ severity: 'error', summary: t('common.error'), life: 3000 })
      }
    },
  })
}

onMounted(async () => {
  await store.loadQuestionTypes()
  if (route.params.id) {
    await store.loadTemplate(route.params.id)
  }
})

onUnmounted(() => store.reset())
</script>

<template>
  <MainLayout>
    <div class="flex flex-col gap-5">

      <!-- ── Top bar ── -->
      <div class="flex items-center gap-3">
        <button
          class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-400 shadow-sm hover:text-slate-600 transition-colors"
          @click="router.push({ name: 'assessment-form-list' })"
        >
          <i class="pi pi-arrow-left text-sm" />
        </button>

        <div class="flex-1 min-w-0">
          <h1 class="text-lg font-bold text-slate-900 leading-none">
            {{ route.params.id ? t('formBuilder.editForm') : t('formBuilder.newForm') }}
          </h1>
          <p class="mt-0.5 text-xs text-slate-400">
            {{ store.template?.module ?? 'preschool' }}
          </p>
        </div>

        <!-- Status + save indicator + actions -->
        <div class="flex items-center gap-3 shrink-0">
          <Tag
            v-if="store.template?.status"
            :severity="statusSeverity[store.template.status] ?? 'secondary'"
            :value="store.template.status"
          />

          <span v-if="autoSaving" class="flex items-center gap-1.5 text-xs text-slate-400">
            <i class="pi pi-spin pi-spinner" />{{ t('formBuilder.autoSaving') }}
          </span>
          <span v-else-if="lastSavedAt" class="flex items-center gap-1.5 text-xs text-emerald-600">
            <i class="pi pi-check" />{{ t('formBuilder.autoSaved') }}
          </span>

          <Button
            v-if="store.template?.id && store.template?.status === 'draft'"
            :label="t('formBuilder.publish')"
            icon="pi pi-send"
            size="sm"
            @click="publish"
          />
        </div>
      </div>

      <!-- ── Form metadata card ── -->
      <div class="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div class="border-b border-slate-100 px-5 py-3">
          <h2 class="text-xs font-semibold uppercase tracking-wider text-slate-400">Form Details</h2>
        </div>
        <div class="grid grid-cols-1 gap-4 p-5 md:grid-cols-2">
          <div class="flex flex-col gap-1.5">
            <label class="text-sm font-medium text-slate-700">{{ t('formBuilder.formName') }} <span class="text-red-400">*</span></label>
            <InputText
              v-model="store.template.name"
              class="w-full"
              :placeholder="t('formBuilder.formName')"
              @input="store.markDirty()"
            />
          </div>
          <div class="flex flex-col gap-1.5">
            <label class="text-sm font-medium text-slate-700">{{ t('formBuilder.formDescription') }}</label>
            <Textarea
              v-model="store.template.description"
              rows="1"
              auto-resize
              class="w-full"
              :placeholder="t('formBuilder.formDescription')"
              @input="store.markDirty()"
            />
          </div>
        </div>
      </div>

      <!-- ── Sections ── -->
      <div class="flex flex-col gap-3">
        <div class="flex items-center justify-between">
          <h2 class="text-sm font-semibold text-slate-700">
            Sections
            <span class="ml-1.5 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500">
              {{ store.sections.length }}
            </span>
          </h2>
        </div>

        <!-- Has template id → show sections -->
        <template v-if="store.template?.id">
          <FormSectionPanel
            v-for="(section, idx) in store.sortedSections"
            :key="section.id"
            :section="section"
            :index="idx"
          />

          <!-- Add section -->
          <button
            class="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-200 py-4 text-sm font-medium text-slate-400 transition-colors hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600"
            @click="store.addSection({ title: t('formBuilder.sections.sectionTitle'), order: store.sections.length + 1 })"
          >
            <i class="pi pi-plus" />
            {{ t('formBuilder.sections.addSection') }}
          </button>
        </template>

        <!-- No template yet → save prompt -->
        <div
          v-else
          class="flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 py-12 text-center"
        >
          <div class="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600">
            <i class="pi pi-save text-xl" />
          </div>
          <div>
            <p class="font-medium text-slate-700">{{ t('formBuilder.saveBeforeSections') }}</p>
            <p class="mt-1 text-sm text-slate-400">Fill in the form name above and it will auto-save.</p>
          </div>
        </div>
      </div>

    </div>
  </MainLayout>
</template>
