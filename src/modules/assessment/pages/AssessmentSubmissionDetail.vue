<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import MainLayout from '@/layouts/MainLayout.vue'
import HeaderSection from '@/components/navigation/HeaderSection.vue'
import Button from '@/components/buttons/Button.vue'
import Tag from 'primevue/tag'
import Select from 'primevue/select'
import Textarea from 'primevue/textarea'
import { useLanguage } from '@/composables/useLanguage'
import { assessmentSubmissionApi } from '../services/assessmentSubmissionApi'
import { assessmentPrintApi } from '../services/assessmentPrintApi'
import { useToast } from 'primevue/usetoast'
import { useConfirm } from 'primevue/useconfirm'

defineOptions({ name: 'AssessmentSubmissionDetailPage' })

const route   = useRoute()
const router  = useRouter()
const { t }   = useLanguage()
const toast   = useToast()
const confirm = useConfirm()

const submission             = ref(null)
const isLoading              = ref(false)
const isPreviewLoading       = ref(false)
const isPrintLoading         = ref(false)
const reviewNote             = ref('')
const printTemplates         = ref([])
const selectedPrintTemplateId = ref(null)
const printPreviewHtml       = ref('')
const printPreviewError      = ref('')

const previewTemplateOptions = computed(() =>
  printTemplates.value.map((template) => ({
    label: `${template.name}${template.is_default ? ' (Default)' : ''}`,
    value: template.id,
  })),
)

const statusSeverity = {
  draft: 'secondary', submitted: 'info', under_review: 'warn', approved: 'success', rejected: 'danger',
}

const hasPrintPreview = computed(() => Boolean(printPreviewHtml.value))

async function load() {
  isLoading.value = true
  try {
    const res = await assessmentSubmissionApi.get(route.params.id)
    submission.value = res.data.data
    await loadPrintTemplates()
  } catch (error) {
    printPreviewError.value = error?.response?.data?.message ?? t('common.error')
  } finally {
    isLoading.value = false
  }
}

async function loadPrintTemplates() {
  if (!submission.value?.form_template_id) {
    printTemplates.value = []
    selectedPrintTemplateId.value = null
    printPreviewHtml.value = ''
    printPreviewError.value = ''
    return
  }
  try {
    const response = await assessmentPrintApi.list({ form_template_id: submission.value.form_template_id })
    printTemplates.value = response.data.data ?? []
    if (!printTemplates.value.length) {
      selectedPrintTemplateId.value = null
      printPreviewHtml.value = ''
      printPreviewError.value = t('printDesigner.missingTemplates')
      return
    }
    const defaultTemplate = printTemplates.value.find((t) => t.is_default) ?? printTemplates.value[0]
    selectedPrintTemplateId.value = defaultTemplate.id
    await refreshPrintPreview()
  } catch (error) {
    printTemplates.value = []
    selectedPrintTemplateId.value = null
    printPreviewHtml.value = ''
    printPreviewError.value = error?.response?.data?.message ?? t('common.error')
  }
}

async function refreshPrintPreview() {
  if (!submission.value?.id || !selectedPrintTemplateId.value) {
    printPreviewHtml.value = ''
    return
  }
  isPreviewLoading.value = true
  printPreviewError.value = ''
  try {
    const response = await assessmentPrintApi.preview({
      submission_id: submission.value.id,
      template_id: selectedPrintTemplateId.value,
    })
    printPreviewHtml.value = response.data?.data?.html ?? ''
  } catch (error) {
    printPreviewHtml.value = ''
    printPreviewError.value = error?.response?.data?.message ?? t('common.error')
  } finally {
    isPreviewLoading.value = false
  }
}

async function printSubmission() {
  if (!submission.value?.id || !selectedPrintTemplateId.value) return
  isPrintLoading.value = true
  try {
    const response = await assessmentPrintApi.print(submission.value.id, selectedPrintTemplateId.value)
    const blob = response.data instanceof Blob ? response.data : new Blob([response.data], { type: 'application/pdf' })
    const url  = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `assessment-${submission.value.id}.pdf`
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.URL.revokeObjectURL(url)
  } finally {
    isPrintLoading.value = false
  }
}

async function approve() {
  confirm.require({
    message: t('submissions.confirmApprove'),
    accept: async () => {
      await assessmentSubmissionApi.review(route.params.id, { action: 'approve', note: reviewNote.value })
      toast.add({ severity: 'success', summary: t('common.success'), life: 3000 })
      load()
    },
  })
}

async function reject() {
  confirm.require({
    message: t('submissions.confirmReject'),
    accept: async () => {
      await assessmentSubmissionApi.review(route.params.id, { action: 'reject', note: reviewNote.value })
      toast.add({ severity: 'success', summary: t('common.success'), life: 3000 })
      load()
    },
  })
}

onMounted(load)
watch(selectedPrintTemplateId, refreshPrintPreview)
</script>

<template>
  <MainLayout>
    <div class="flex flex-col gap-6">
      <HeaderSection :title="t('submissions.title')">
        <template #actions>
          <Button
            :label="t('common.actions.back')"
            icon="pi pi-arrow-left"
            severity="secondary"
            @click="router.back()"
          />
          <template v-if="submission?.status === 'submitted'">
            <Button :label="t('submissions.actions.approve')" icon="pi pi-check" @click="approve" />
            <Button :label="t('submissions.actions.reject')" icon="pi pi-times" severity="danger" @click="reject" />
          </template>
        </template>
      </HeaderSection>

      <div v-if="isLoading" class="flex justify-center py-20 text-slate-400">
        <i class="pi pi-spin pi-spinner text-3xl" />
      </div>

      <template v-else-if="submission">
        <!-- Meta cards -->
        <div class="grid gap-4 lg:grid-cols-4">
          <div class="rounded-xl border border-slate-200 bg-white p-4 space-y-1">
            <p class="text-xs font-semibold uppercase tracking-wider text-slate-400">{{ t('submissions.student') }}</p>
            <p class="font-medium text-slate-800">{{ submission.student?.full_name ?? '—' }}</p>
            <p class="text-xs text-slate-500">{{ submission.student?.student_code }}</p>
          </div>
          <div class="rounded-xl border border-slate-200 bg-white p-4 space-y-1">
            <p class="text-xs font-semibold uppercase tracking-wider text-slate-400">{{ t('submissions.form') }}</p>
            <p class="font-medium text-slate-800">{{ submission.form_template?.name ?? '—' }}</p>
          </div>
          <div class="rounded-xl border border-slate-200 bg-white p-4 space-y-1">
            <p class="text-xs font-semibold uppercase tracking-wider text-slate-400">{{ t('submissions.status') }}</p>
            <Tag :severity="statusSeverity[submission.status]" :value="t(`submissions.statuses.${submission.status}`)" />
          </div>
          <div class="rounded-xl border border-slate-200 bg-white p-4 space-y-1">
            <p class="text-xs font-semibold uppercase tracking-wider text-slate-400">{{ t('scoring.totalScore') }}</p>
            <p class="text-2xl font-bold text-slate-800">{{ submission.total_score ?? '—' }}</p>
          </div>
        </div>

        <!-- Review note -->
        <div class="rounded-xl border border-slate-200 bg-white p-4">
          <label class="mb-1.5 block text-sm font-medium text-slate-700">{{ t('submissions.reviewNote') }}</label>
          <Textarea v-model="reviewNote" rows="3" class="w-full text-sm" />
        </div>

        <!-- Print preview section -->
        <div class="rounded-xl border border-slate-200 bg-white shadow-sm">
          <div class="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-3.5">
            <div>
              <h3 class="text-sm font-semibold text-slate-800">{{ t('printDesigner.preview.title') }}</h3>
              <p class="text-xs text-slate-400">{{ t('printDesigner.preview.subtitle') }}</p>
            </div>
            <div class="flex items-center gap-3 flex-wrap">
              <Select
                v-model="selectedPrintTemplateId"
                :options="previewTemplateOptions"
                option-label="label"
                option-value="value"
                class="w-72"
                :placeholder="t('printDesigner.templateLibrary.title')"
                :disabled="!previewTemplateOptions.length"
              />
              <Button
                :label="t('printDesigner.print')"
                icon="pi pi-print"
                :disabled="!selectedPrintTemplateId"
                :loading="isPrintLoading"
                @click="printSubmission"
              />
            </div>
          </div>

          <div v-if="printPreviewError" class="m-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
            {{ printPreviewError }}
          </div>
          <div v-else class="relative min-h-96 overflow-hidden rounded-b-xl">
            <div v-if="isPreviewLoading" class="flex min-h-96 items-center justify-center text-slate-400">
              <i class="pi pi-spin pi-spinner text-2xl" />
            </div>
            <iframe
              v-else-if="hasPrintPreview"
              :srcdoc="printPreviewHtml"
              title="assessment-print-preview"
              sandbox="allow-same-origin"
              class="w-full min-h-[720px] border-0"
            />
            <div v-else class="flex min-h-96 items-center justify-center text-sm text-slate-400">
              {{ t('printDesigner.missingTemplates') }}
            </div>
          </div>
        </div>
      </template>
    </div>
  </MainLayout>
</template>
