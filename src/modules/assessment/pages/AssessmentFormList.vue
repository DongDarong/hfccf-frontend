<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import MainLayout from '@/layouts/MainLayout.vue'
import HeaderSection from '@/components/navigation/HeaderSection.vue'
import Button from '@/components/buttons/Button.vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Tag from 'primevue/tag'
import InputText from 'primevue/inputtext'
import Select from 'primevue/select'
import { useLanguage } from '@/composables/useLanguage'
import { assessmentFormApi } from '../services/assessmentFormApi'
import { useConfirm } from 'primevue/useconfirm'
import { useToast } from 'primevue/usetoast'

defineOptions({ name: 'AssessmentFormListPage' })

const router  = useRouter()
const { t }   = useLanguage()
const confirm = useConfirm()
const toast   = useToast()

const forms        = ref([])
const isLoading    = ref(false)
const total        = ref(0)
const search       = ref('')
const statusFilter = ref(null)

const statusOptions = computed(() =>
  ['draft', 'published', 'archived'].map(v => ({ label: t(`formBuilder.statuses.${v}`), value: v }))
)

const statusSeverity = { draft: 'warn', published: 'success', archived: 'secondary' }

let searchDebounce = null
watch(search, () => {
  clearTimeout(searchDebounce)
  searchDebounce = setTimeout(load, 350)
})
watch(statusFilter, load)

async function load() {
  isLoading.value = true
  try {
    const params = { module: 'preschool' }
    if (search.value.trim()) params.search = search.value.trim()
    if (statusFilter.value)  params.status = statusFilter.value
    const res = await assessmentFormApi.list(params)
    forms.value = res.data.data
    total.value = res.data.meta?.total ?? forms.value.length
  } finally {
    isLoading.value = false
  }
}

async function archive(id) {
  confirm.require({
    message: t('formBuilder.archiveConfirm'),
    accept: async () => {
      try {
        await assessmentFormApi.archive(id)
        toast.add({ severity: 'success', summary: t('common.success'), life: 3000 })
        await load()
      } catch (error) {
        toast.add({ severity: 'error', summary: t('common.error'), detail: error?.message || t('common.errorTryAgain'), life: 4000 })
      }
    },
  })
}

async function duplicate(id) {
  try {
    await assessmentFormApi.duplicate(id)
    toast.add({ severity: 'success', summary: t('common.success'), life: 3000 })
    await load()
  } catch (error) {
    toast.add({ severity: 'error', summary: t('common.error'), detail: error?.message || t('common.errorTryAgain'), life: 4000 })
  }
}

onMounted(load)
</script>

<template>
  <MainLayout>
    <div class="flex flex-col gap-6">
      <HeaderSection :title="t('formBuilder.title')">
        <template #actions>
          <Button
            :label="t('formBuilder.newForm')"
            icon="pi pi-plus"
            @click="router.push({ name: 'assessment-form-create' })"
          />
        </template>
      </HeaderSection>

      <!-- Filters -->
      <div class="flex flex-wrap gap-3">
        <span class="p-input-icon-left min-w-48 flex-1">
          <i class="pi pi-search text-slate-400" />
          <InputText
            v-model="search"
            :placeholder="t('formBuilder.searchPlaceholder')"
            class="w-full pl-8"
          />
        </span>
        <Select
          v-model="statusFilter"
          :options="statusOptions"
          option-label="label"
          option-value="value"
          :placeholder="t('formBuilder.allStatuses')"
          show-clear
          class="w-44"
        />
      </div>

      <!-- Result count -->
      <p class="-mt-3 text-xs text-slate-400">{{ total }} {{ t('formBuilder.results') }}</p>

      <DataTable
        :value="forms"
        :loading="isLoading"
        class="rounded-xl border border-slate-200 bg-white shadow-sm"
      >
        <template #empty>
          <div class="py-12 text-center text-sm text-slate-400">
            <i class="pi pi-file-edit mb-3 block text-3xl" />
            {{ t('formBuilder.noForms') }}
          </div>
        </template>

        <Column field="name" :header="t('formBuilder.formName')" />
        <Column field="module" :header="t('formBuilder.module')" />
        <Column :header="t('formBuilder.status')">
          <template #body="{ data }">
            <Tag :severity="statusSeverity[data.status]" :value="t(`formBuilder.statuses.${data.status}`)" />
          </template>
        </Column>
        <Column field="current_version" :header="t('formBuilder.version')" />
        <Column :header="t('common.table.actions')">
          <template #body="{ data }">
            <div class="flex gap-1">
              <Button
                icon="pi pi-pencil"
                severity="secondary"
                size="sm"
                :title="t('formBuilder.editForm')"
                @click="router.push({ name: 'assessment-form-edit', params: { id: data.id } })"
              />
              <Button
                icon="pi pi-copy"
                severity="secondary"
                size="sm"
                :title="t('formBuilder.duplicate')"
                @click="duplicate(data.id)"
              />
              <Button
                icon="pi pi-inbox"
                severity="secondary"
                size="sm"
                :title="t('formBuilder.archive')"
                @click="archive(data.id)"
              />
            </div>
          </template>
        </Column>
      </DataTable>
    </div>
  </MainLayout>
</template>
