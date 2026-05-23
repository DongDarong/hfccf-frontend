<script setup>
import { onMounted, onUnmounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import MainLayout from '@/layouts/MainLayout.vue'
import HeaderSection from '@/components/navigation/HeaderSection.vue'
import Button from '@/components/buttons/Button.vue'
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import { useLanguage } from '@/composables/useLanguage'
import { useFormBuilderStore } from '../stores/useFormBuilderStore'
import { useAutoSave } from '../composables/useAutoSave'
import { useToast } from 'primevue/usetoast'
import { useConfirm } from 'primevue/useconfirm'
import FormSectionPanel from '../components/form-builder/FormSectionPanel.vue'

defineOptions({ name: 'AssessmentFormBuilderPage' })

const route = useRoute()
const router = useRouter()
const { t } = useLanguage()
const store = useFormBuilderStore()
const toast = useToast()
const confirm = useConfirm()

const { lastSavedAt, isSaving: autoSaving, scheduleAutoSave } = useAutoSave(
  () => store.saveTemplate({ name: store.template?.name, description: store.template?.description }),
)

watch(() => store.isDirty, (dirty) => {
  if (dirty) scheduleAutoSave()
})

async function publish() {
  confirm.require({
    message: t('formBuilder.publishConfirm'),
    accept: async () => {
      await store.publishTemplate()
      toast.add({ severity: 'success', summary: t('common.success'), life: 3000 })
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
    <div class="form-builder">
      <HeaderSection :title="route.params.id ? t('formBuilder.editForm') : t('formBuilder.newForm')">
        <template #actions>
          <span v-if="autoSaving" class="form-builder__save-status">{{ t('formBuilder.autoSaving') }}</span>
          <span v-else-if="lastSavedAt" class="form-builder__save-status">{{ t('formBuilder.autoSaved') }}</span>
          <Button
            v-if="store.template?.status === 'draft'"
            :label="t('formBuilder.publish')"
            icon="pi pi-send"
            @click="publish"
          />
          <Button
            :label="t('formBuilder.preview')"
            icon="pi pi-eye"
            severity="secondary"
          />
        </template>
      </HeaderSection>

      <div class="form-builder__meta">
        <div class="form-builder__field">
          <label>{{ t('formBuilder.formName') }}</label>
          <InputText
            v-model="store.template.name"
            class="w-full"
            @input="store.markDirty()"
          />
        </div>
        <div class="form-builder__field">
          <label>{{ t('formBuilder.formDescription') }}</label>
          <Textarea
            v-model="store.template.description"
            rows="2"
            class="w-full"
            @input="store.markDirty()"
          />
        </div>
      </div>

      <div class="form-builder__sections">
        <FormSectionPanel
          v-for="section in store.sortedSections"
          :key="section.id"
          :section="section"
        />
        <Button
          :label="t('formBuilder.sections.addSection')"
          icon="pi pi-plus"
          severity="secondary"
          @click="store.addSection({ title: t('formBuilder.sections.sectionTitle'), order: store.sections.length + 1 })"
        />
      </div>
    </div>
  </MainLayout>
</template>

<style scoped>
.form-builder {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-builder__meta {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  background: var(--surface-card);
  border: 1px solid var(--surface-border);
  border-radius: 8px;
  padding: 1.25rem;
}

.form-builder__field {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.form-builder__field label {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-color-secondary);
}

.form-builder__sections {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-builder__save-status {
  font-size: 0.8125rem;
  color: var(--text-color-secondary);
}
</style>
