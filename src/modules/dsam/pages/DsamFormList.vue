<script setup>
import { onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useLanguage } from '@/composables/useLanguage'
import MainLayout from '@/layouts/MainLayout.vue'
import HeaderSection from '@/components/navigation/HeaderSection.vue'
import Button from '@/components/buttons/Button.vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Tag from 'primevue/tag'
import Select from 'primevue/select'
import InputText from 'primevue/inputtext'
import { useToast } from 'primevue/usetoast'
import { useConfirm } from 'primevue/useconfirm'
import { dsamFormApi } from '../services/dsamFormApi'

defineOptions({ name: 'DsamFormListPage' })

const router  = useRouter()
const toast   = useToast()
const confirm = useConfirm()
const { t }   = useLanguage()

const forms        = ref([])
const loading      = ref(false)
const total        = ref(0)
const search       = ref('')
const statusFilter = ref(null)

const statusSeverity = { draft: 'warn', published: 'success', archived: 'secondary' }
const statusOptions  = ['draft', 'published', 'archived'].map(v => ({ label: v, value: v }))

let searchDebounce = null
watch(search, () => {
  clearTimeout(searchDebounce)
  searchDebounce = setTimeout(load, 350)
})

watch(statusFilter, load)

async function load() {
  loading.value = true
  try {
    const params = {}
    if (search.value.trim())  params.search = search.value.trim()
    if (statusFilter.value)   params.status = statusFilter.value
    const res = await dsamFormApi.list(params)
    forms.value = res.data.data ?? []
    total.value = res.data.meta?.total ?? forms.value.length
  } finally {
    loading.value = false
  }
}

async function publish(id, name) {
  confirm.require({
    message: t('dsamForms.confirmPublish', { name }),
    header: t('dsamForms.publishHeader'),
    icon: 'pi pi-send',
    acceptLabel: t('dsamShared.actions.publish'),
    rejectLabel: t('dsamShared.actions.cancel'),
    accept: async () => {
      try {
        await dsamFormApi.publish(id)
        toast.add({ severity: 'success', summary: t('dsamForms.builder.publish.successTitle'), detail: t('dsamForms.publishSuccess', { name }), life: 3000 })
        await load()
      } catch (e) {
        toast.add({ severity: 'error', summary: 'Error', detail: e?.response?.data?.message ?? e.message, life: 5000 })
      }
    },
  })
}

async function archive(id, name) {
  confirm.require({
    message: t('dsamForms.confirmArchive', { name }),
    header: t('dsamForms.archiveHeader'),
    icon: 'pi pi-inbox',
    acceptLabel: t('dsamShared.actions.archive'),
    rejectLabel: t('dsamShared.actions.cancel'),
    accept: async () => {
      try {
        await dsamFormApi.archive(id)
        toast.add({ severity: 'info', summary: t('dsamForms.builder.archive.successTitle'), detail: t('dsamForms.archiveSuccess', { name }), life: 3000 })
        await load()
      } catch (e) {
        toast.add({ severity: 'error', summary: 'Error', detail: e?.response?.data?.message ?? e.message, life: 5000 })
      }
    },
  })
}

async function newVersion(id) {
  try {
    const res = await dsamFormApi.newVersion(id, {})
    toast.add({ severity: 'success', summary: t('dsamForms.builder.newVersion.button'), detail: t('dsamForms.versionSuccess', { n: res.data.data.version_number }), life: 3000 })
    router.push({ name: 'dsam-form-builder-edit', params: { id: res.data.data.id } })
  } catch (e) {
    toast.add({ severity: 'error', summary: 'Error', detail: e?.response?.data?.message ?? e.message, life: 5000 })
  }
}

async function duplicate(id) {
  try {
    await dsamFormApi.duplicate(id)
    toast.add({ severity: 'success', summary: t('dsamForms.duplicateSuccess'), life: 3000 })
    await load()
  } catch (e) {
    toast.add({ severity: 'error', summary: 'Error', detail: e.message, life: 4000 })
  }
}

async function remove(id) {
  confirm.require({
    message: t('dsamForms.confirmDelete'),
    header: t('dsamForms.deleteHeader'),
    icon: 'pi pi-trash',
    acceptLabel: t('dsamShared.actions.delete'),
    rejectLabel: t('dsamShared.actions.cancel'),
    acceptClass: 'p-button-danger',
    accept: async () => {
      try {
        await dsamFormApi.delete(id)
        toast.add({ severity: 'success', summary: t('dsamForms.deleteSuccess'), life: 3000 })
        await load()
      } catch (e) {
        toast.add({ severity: 'error', summary: 'Error', detail: e?.response?.data?.message ?? e.message, life: 5000 })
      }
    },
  })
}

onMounted(load)
</script>

<template>
  <MainLayout>
    <div class="flex flex-col gap-6">
      <HeaderSection :title="t('dsamForms.title')">
        <template #actions>
          <Button
            :label="t('dsamForms.newForm')"
            icon="pi pi-plus"
            @click="router.push({ name: 'dsam-form-builder' })"
          />
        </template>
      </HeaderSection>

      <!-- Search + filter -->
      <div class="flex flex-wrap gap-3">
        <span class="p-input-icon-left flex-1 min-w-48">
          <i class="pi pi-search text-slate-400" />
          <InputText
            v-model="search"
            :placeholder="t('dsamForms.searchPlaceholder')"
            class="w-full pl-8"
          />
        </span>
        <Select
          v-model="statusFilter"
          :options="statusOptions"
          option-label="label"
          option-value="value"
          :placeholder="t('dsamForms.allStatuses')"
          show-clear
          class="w-44"
        />
      </div>

      <!-- Result count -->
      <div class="flex items-center -mt-3">
        <p class="text-xs text-slate-400">
          {{ total }} {{ t('dsamForms.results', total) }}
          <template v-if="search.trim()"> for "{{ search.trim() }}"</template>
        </p>
      </div>

      <DataTable :value="forms" :loading="loading" class="rounded-xl border border-slate-200 bg-white shadow-sm">
        <template #empty>
          <div class="py-12 text-center text-sm text-slate-400">
            <i class="pi pi-file mb-3 text-3xl block" />
            {{ t('dsamForms.empty') }}
          </div>
        </template>

        <Column field="name" :header="t('dsamShared.cols.name')" sortable>
          <template #body="{ data }">
            <div>
              <p class="font-medium text-slate-800">{{ data.name }}</p>
              <p v-if="data.name_kh" class="text-xs text-slate-400">{{ data.name_kh }}</p>
            </div>
          </template>
        </Column>
        <Column field="category" :header="t('dsamShared.cols.category')" />
        <Column :header="t('dsamShared.cols.version')">
          <template #body="{ data }">v{{ data.version_number }}</template>
        </Column>
        <Column field="academic_year.name" :header="t('dsamShared.cols.year')" />
        <Column :header="t('dsamShared.cols.status')">
          <template #body="{ data }">
            <Tag :severity="statusSeverity[data.status]" :value="t('dsamShared.statuses.' + data.status) || data.status" />
          </template>
        </Column>
        <Column :header="t('dsamShared.cols.sections')">
          <template #body="{ data }">{{ data.section_count ?? '—' }}</template>
        </Column>
        <Column :header="t('dsamShared.cols.published')">
          <template #body="{ data }">
            <span class="text-xs text-slate-500">
              {{ data.published_at ? new Date(data.published_at).toLocaleDateString() : '—' }}
            </span>
          </template>
        </Column>
        <Column :header="t('dsamShared.cols.actions')">
          <template #body="{ data }">
            <div class="flex gap-1">
              <Button
                v-if="data.status === 'draft'"
                icon="pi pi-pencil"
                severity="secondary"
                size="sm"
                :title="t('dsamShared.actions.edit')"
                @click="router.push({ name: 'dsam-form-builder-edit', params: { id: data.id } })"
              />
              <Button
                v-else
                icon="pi pi-eye"
                severity="secondary"
                size="sm"
                :title="t('dsamShared.actions.view')"
                @click="router.push({ name: 'dsam-form-builder-edit', params: { id: data.id } })"
              />
              <Button
                v-if="data.status === 'draft'"
                icon="pi pi-send"
                severity="success"
                size="sm"
                :title="t('dsamShared.actions.publish')"
                @click="publish(data.id, data.name)"
              />
              <Button
                v-if="data.status === 'published'"
                icon="pi pi-code-branch"
                severity="secondary"
                size="sm"
                :title="t('dsamForms.builder.newVersion.button')"
                @click="newVersion(data.id)"
              />
              <Button
                v-if="data.status === 'published'"
                icon="pi pi-inbox"
                severity="secondary"
                size="sm"
                :title="t('dsamShared.actions.archive')"
                @click="archive(data.id, data.name)"
              />
              <Button
                icon="pi pi-list"
                severity="secondary"
                size="sm"
                :title="t('dsamForms.versions.title')"
                @click="router.push({ name: 'dsam-form-versions', params: { id: data.id } })"
              />
              <Button
                icon="pi pi-copy"
                severity="secondary"
                size="sm"
                :title="t('dsamShared.actions.duplicate')"
                @click="duplicate(data.id)"
              />
              <Button
                v-if="data.status === 'draft'"
                icon="pi pi-trash"
                severity="danger"
                size="sm"
                :title="t('dsamShared.actions.delete')"
                @click="remove(data.id)"
              />
            </div>
          </template>
        </Column>
      </DataTable>
    </div>
  </MainLayout>
</template>
