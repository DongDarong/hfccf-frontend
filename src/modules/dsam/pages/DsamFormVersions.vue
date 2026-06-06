<script setup>
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useLanguage } from '@/composables/useLanguage'
import { useToast } from 'primevue/usetoast'
import { useConfirm } from 'primevue/useconfirm'
import MainLayout from '@/layouts/MainLayout.vue'
import HeaderSection from '@/components/navigation/HeaderSection.vue'
import Button from '@/components/buttons/Button.vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Tag from 'primevue/tag'
import { dsamFormApi } from '../services/dsamFormApi'

defineOptions({ name: 'DsamFormVersionsPage' })

const route   = useRoute()
const router  = useRouter()
const toast   = useToast()
const confirm = useConfirm()
const { t }   = useLanguage()

const versions = ref([])
const parent   = ref(null)
const loading  = ref(false)

const statusSeverity = { draft: 'warn', published: 'success', archived: 'secondary' }

async function load() {
  loading.value = true
  try {
    const [parentRes, versionsRes] = await Promise.all([
      dsamFormApi.get(route.params.id),
      dsamFormApi.versions(route.params.id),
    ])
    parent.value   = parentRes.data.data
    versions.value = versionsRes.data.data ?? []
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
    const newForm = res.data.data
    toast.add({ severity: 'success', summary: t('dsamForms.builder.newVersion.button'), detail: t('dsamForms.versionSuccess', { n: newForm.version_number }), life: 3000 })
    router.push({ name: 'dsam-form-builder-edit', params: { id: newForm.id } })
  } catch (e) {
    toast.add({ severity: 'error', summary: 'Error', detail: e?.response?.data?.message ?? e.message, life: 5000 })
  }
}

onMounted(load)
</script>

<template>
  <MainLayout>
    <div class="flex flex-col gap-6">
      <HeaderSection :title="t('dsamForms.versions.title')">
        <template #subtitle>
          <span v-if="parent" class="text-sm text-slate-500">{{ parent.name }}</span>
        </template>
        <template #actions>
          <Button
            :label="t('dsamForms.versions.backToForms')"
            icon="pi pi-arrow-left"
            severity="secondary"
            @click="router.push({ name: 'dsam-form-list' })"
          />
        </template>
      </HeaderSection>

      <DataTable
        :value="versions"
        :loading="loading"
        class="rounded-xl border border-slate-200 bg-white shadow-sm"
        sort-field="version_number"
        :sort-order="-1"
      >
        <template #empty>
          <div class="py-12 text-center text-sm text-slate-400">
            <i class="pi pi-code-branch mb-3 text-3xl block" />
            {{ t('dsamForms.versions.empty') }}
          </div>
        </template>

        <Column :header="t('dsamShared.cols.version')" field="version_number" sortable>
          <template #body="{ data }">
            <div class="flex items-center gap-2">
              <span class="font-semibold text-slate-800">v{{ data.version_number }}</span>
              <span
                v-if="data.status === 'published'"
                class="rounded-full bg-violet-100 px-1.5 py-0.5 text-xs font-medium text-violet-700"
              >
                {{ t('dsamForms.versions.current') }}
              </span>
            </div>
          </template>
        </Column>

        <Column :header="t('dsamShared.cols.name')" field="name">
          <template #body="{ data }">
            <div>
              <p class="text-sm font-medium text-slate-800">{{ data.name }}</p>
              <p v-if="data.name_kh" class="text-xs text-slate-400">{{ data.name_kh }}</p>
            </div>
          </template>
        </Column>

        <Column :header="t('dsamShared.cols.status')">
          <template #body="{ data }">
            <Tag
              :severity="statusSeverity[data.status]"
              :value="t('dsamShared.statuses.' + data.status) || data.status"
            />
          </template>
        </Column>

        <Column :header="t('dsamShared.cols.sections')">
          <template #body="{ data }">
            {{ data.section_count ?? '—' }}
          </template>
        </Column>

        <Column :header="t('dsamShared.cols.published')">
          <template #body="{ data }">
            <span class="text-xs text-slate-500">
              {{ data.published_at ? new Date(data.published_at).toLocaleDateString() : '—' }}
            </span>
          </template>
        </Column>

        <Column :header="t('dsamForms.versions.createdAt')">
          <template #body="{ data }">
            <span class="text-xs text-slate-500">
              {{ data.created_at ? new Date(data.created_at).toLocaleDateString() : '—' }}
            </span>
          </template>
        </Column>

        <Column :header="t('dsamShared.cols.actions')">
          <template #body="{ data }">
            <div class="flex gap-1">
              <!-- Edit draft -->
              <Button
                v-if="data.status === 'draft'"
                icon="pi pi-pencil"
                severity="secondary"
                size="sm"
                :title="t('dsamShared.actions.edit')"
                @click="router.push({ name: 'dsam-form-builder-edit', params: { id: data.id } })"
              />

              <!-- View non-draft -->
              <Button
                v-else
                icon="pi pi-eye"
                severity="secondary"
                size="sm"
                :title="t('dsamShared.actions.view')"
                @click="router.push({ name: 'dsam-form-builder-edit', params: { id: data.id } })"
              />

              <!-- Publish draft -->
              <Button
                v-if="data.status === 'draft'"
                icon="pi pi-send"
                severity="success"
                size="sm"
                :title="t('dsamShared.actions.publish')"
                @click="publish(data.id, data.name)"
              />

              <!-- New version from published -->
              <Button
                v-if="data.status === 'published'"
                icon="pi pi-code-branch"
                severity="secondary"
                size="sm"
                :title="t('dsamForms.builder.newVersion.button')"
                @click="newVersion(data.id)"
              />

              <!-- Archive published -->
              <Button
                v-if="data.status === 'published'"
                icon="pi pi-inbox"
                severity="secondary"
                size="sm"
                :title="t('dsamShared.actions.archive')"
                @click="archive(data.id, data.name)"
              />
            </div>
          </template>
        </Column>
      </DataTable>
    </div>
  </MainLayout>
</template>
