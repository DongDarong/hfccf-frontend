<script setup>
import { computed, nextTick, ref, watch } from 'vue'
import { useDsamFormBuilderStore } from '../../stores/useDsamFormBuilderStore'
import { useLanguage } from '@/composables/useLanguage'
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import Select from 'primevue/select'
import ToggleSwitch from 'primevue/toggleswitch'
import InputNumber from 'primevue/inputnumber'
import Button from '@/components/buttons/Button.vue'

const store = useDsamFormBuilderStore()
const { t } = useLanguage()

const activeTab = ref('general')
const form = ref({})
const isDirty = ref(false)

const question = computed(() => store.activeQuestion)
const section  = computed(() => store.activeSection)

watch(question, async (q) => {
  if (!q) { form.value = {}; isDirty.value = false; return }
  form.value = {
    label:            q.label ?? '',
    label_kh:         q.label_kh ?? '',
    placeholder:      q.placeholder ?? '',
    help_text:        q.help_text ?? '',
    is_required:      q.is_required ?? false,
    is_scored:        q.is_scored ?? false,
    max_score:        q.max_score ?? null,
    question_type_id: q.question_type_id,
  }
  await nextTick()
  isDirty.value = false
}, { immediate: true })

watch(form, () => { isDirty.value = true }, { deep: true })

async function save() {
  if (!question.value || !section.value) return
  await store.updateQuestion(section.value.id, question.value.id, form.value)
  isDirty.value = false
}

async function addOption() {
  if (!question.value || !section.value) return
  await store.addOption(section.value.id, question.value.id, {
    label: 'New option',
    value: `opt_${Date.now()}`,
    score_value: 0,
  })
}

async function removeOption(optionId) {
  if (!question.value || !section.value) return
  await store.deleteOption(section.value.id, question.value.id, optionId)
}

const hasOptions = computed(() => question.value?.question_type?.has_options)
const hasScoring = computed(() => question.value?.question_type?.has_scoring)
</script>

<template>
  <aside class="flex h-full w-72 shrink-0 flex-col border-l border-slate-200 bg-white">
    <!-- Empty state -->
    <div v-if="!question" class="flex flex-1 items-center justify-center p-6 text-center">
      <div>
        <i class="pi pi-mouse-pointer mb-3 text-3xl text-slate-300" />
        <p class="text-sm text-slate-400">{{ t('dsamForms.inspector.selectQuestion') }}</p>
      </div>
    </div>

    <template v-else>
      <!-- Header -->
      <div class="border-b border-slate-200 px-4 py-3 flex items-center justify-between">
        <p class="text-sm font-semibold text-slate-800 truncate">{{ t('dsamForms.inspector.title') }}</p>
        <button
          v-if="isDirty && !store.isPublished"
          class="rounded bg-blue-600 px-2 py-1 text-xs text-white hover:bg-blue-700"
          @click="save"
        >
          {{ t('dsamShared.actions.save') }}
        </button>
      </div>

      <!-- Tabs -->
      <div class="flex border-b border-slate-200 text-xs font-medium">
        <button
          v-for="tab in ['general', 'options', 'scoring']"
          :key="tab"
          :class="[
            'flex-1 py-2 capitalize transition-colors',
            activeTab === tab ? 'border-b-2 border-blue-600 text-blue-600' : 'text-slate-500 hover:text-slate-700',
          ]"
          @click="activeTab = tab"
        >
          {{ t('dsamForms.inspector.tabs.' + tab) }}
        </button>
      </div>

      <!-- Content -->
      <div class="flex-1 overflow-y-auto p-4 space-y-4">

        <!-- General tab -->
        <template v-if="activeTab === 'general'">
          <div>
            <label class="mb-1 block text-xs font-medium text-slate-600">{{ t('dsamForms.inspector.labelEn') }}</label>
            <Textarea v-model="form.label" :disabled="store.isPublished" rows="2" class="w-full text-sm" auto-resize />
          </div>
          <div>
            <label class="mb-1 block text-xs font-medium text-slate-600">{{ t('dsamForms.inspector.labelKh') }}</label>
            <Textarea v-model="form.label_kh" :disabled="store.isPublished" rows="2" class="w-full text-sm" auto-resize />
          </div>
          <div>
            <label class="mb-1 block text-xs font-medium text-slate-600">{{ t('dsamForms.inspector.placeholder') }}</label>
            <InputText v-model="form.placeholder" :disabled="store.isPublished" class="w-full text-sm" />
          </div>
          <div>
            <label class="mb-1 block text-xs font-medium text-slate-600">{{ t('dsamForms.inspector.helpText') }}</label>
            <InputText v-model="form.help_text" :disabled="store.isPublished" class="w-full text-sm" />
          </div>
          <div class="flex items-center justify-between">
            <label class="text-xs font-medium text-slate-600">{{ t('dsamForms.inspector.required') }}</label>
            <ToggleSwitch v-model="form.is_required" :disabled="store.isPublished" />
          </div>
        </template>

        <!-- Options tab -->
        <template v-else-if="activeTab === 'options'">
          <div v-if="!hasOptions" class="text-center py-6 text-xs text-slate-400">
            {{ t('dsamForms.inspector.noOptions') }}
          </div>
          <template v-else>
            <div
              v-for="opt in question.options ?? []"
              :key="opt.id"
              class="flex items-center gap-2 rounded border border-slate-200 px-2 py-1.5 text-sm"
            >
              <i class="pi pi-equals text-slate-300 cursor-grab" />
              <span class="flex-1 truncate">{{ opt.label }}</span>
              <span class="text-xs text-emerald-600 font-medium">{{ opt.score_value ?? 0 }}pt</span>
              <button
                v-if="!store.isPublished"
                class="text-slate-300 hover:text-red-500"
                @click="removeOption(opt.id)"
              >
                <i class="pi pi-times text-xs" />
              </button>
            </div>
            <Button
              v-if="!store.isPublished"
              :label="t('dsamForms.inspector.addOption')"
              icon="pi pi-plus"
              size="sm"
              severity="secondary"
              class="w-full"
              @click="addOption"
            />
          </template>
        </template>

        <!-- Scoring tab -->
        <template v-else-if="activeTab === 'scoring'">
          <div v-if="!hasScoring" class="text-center py-6 text-xs text-slate-400">
            {{ t('dsamForms.inspector.noScoring') }}
          </div>
          <template v-else>
            <div class="flex items-center justify-between">
              <label class="text-xs font-medium text-slate-600">{{ t('dsamForms.inspector.enableScoring') }}</label>
              <ToggleSwitch v-model="form.is_scored" :disabled="store.isPublished" />
            </div>
            <div v-if="form.is_scored">
              <label class="mb-1 block text-xs font-medium text-slate-600">{{ t('dsamForms.inspector.maxScore') }}</label>
              <InputNumber v-model="form.max_score" :disabled="store.isPublished" :min="0" class="w-full" />
            </div>
          </template>
        </template>

      </div>
    </template>
  </aside>
</template>
