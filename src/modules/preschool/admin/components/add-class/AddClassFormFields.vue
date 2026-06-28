<script setup>
// Keep the class form localized at the field level so status labels stay
// readable without leaking hardcoded English into the editor.
import { computed } from 'vue'
import { useLanguage } from '@/composables/useLanguage'

defineOptions({
  name: 'AddClassFormFields',
})

const props = defineProps({
  statusOptions: {
    type: Array,
    default: () => [],
  },
  code: {
    type: String,
    default: '',
  },
  name: {
    type: String,
    default: '',
  },
  teacher: {
    type: String,
    default: '',
  },
  teacherOptions: {
    type: Array,
    default: () => [],
  },
  level: {
    type: String,
    default: '',
  },
  schedule: {
    type: String,
    default: '',
  },
  students: {
    type: [String, Number],
    default: 0,
  },
  status: {
    type: String,
    default: '',
  },
  room: {
    type: String,
    default: '',
  },
  notes: {
    type: String,
    default: '',
  },
  codeLabel: {
    type: String,
    default: '',
  },
  codeHint: {
    type: String,
    default: '',
  },
  codeLoading: {
    type: Boolean,
    default: false,
  },
  isLocked: {
    type: Boolean,
    default: false,
  },
})

defineEmits([
  'update:name',
  'update:teacher',
  'update:level',
  'update:schedule',
  'update:students',
  'update:status',
  'update:room',
  'update:notes',
])

const { t, language } = useLanguage()
const isKh = computed(() => language.value === 'KH')

function normalizeKey(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, '_')
}

function translateOption(namespace, value) {
  return t(`${namespace}.${normalizeKey(value)}`)
}

const translatedStatusOptions = computed(() =>
  props.statusOptions.map((option) => ({
    value: option,
    label: translateOption('common.status', option),
  })),
)
</script>

<template>
  <div :class="isKh ? 'add-class-form-fields add-class-form-fields--kh' : 'add-class-form-fields'">
    <div class="add-class-form-fields__field add-class-form-fields__field--half">
      <span class="add-class-form-fields__label">{{ codeLabel || t('preschoolAddClass.classCode') }}</span>
      <div
        class="add-class-form-fields__code-preview"
        data-testid="add-class-code-preview"
        :class="{ 'add-class-form-fields__code-preview--loading': codeLoading }"
      >
        <strong class="add-class-form-fields__code-value">{{ code || '-' }}</strong>
        <span class="add-class-form-fields__code-hint">
          {{ codeHint || t('preschoolAddClass.generatedClassCodeHint') }}
        </span>
      </div>
    </div>

    <label class="add-class-form-fields__field add-class-form-fields__field--half">
      <span class="add-class-form-fields__label">{{ t('preschoolAddClass.className') }}</span>
      <input
        :value="name"
        type="text"
        :placeholder="t('preschoolAddClass.classNamePlaceholder')"
        :disabled="isLocked"
        @input="$emit('update:name', $event.target.value)"
      />
    </label>

    <label class="add-class-form-fields__field add-class-form-fields__field--half">
      <span class="add-class-form-fields__label">{{ t('preschoolAddClass.teacher') }}</span>
      <select
        :value="teacher"
        :disabled="isLocked"
        @change="$emit('update:teacher', $event.target.value)"
      >
        <option value="">
          {{ t('preschoolAddClass.teacherPlaceholder') }}
        </option>
        <option v-for="option in teacherOptions" :key="option.value" :value="option.value">
          {{ option.label }}
        </option>
      </select>
    </label>

    <label class="add-class-form-fields__field add-class-form-fields__field--half">
      <span class="add-class-form-fields__label">{{ t('preschoolAddClass.level') }}</span>
      <input
        data-testid="add-class-level-input"
        :value="level"
        type="text"
        :placeholder="t('preschoolAddClass.levelPlaceholder')"
        :disabled="isLocked"
        @input="$emit('update:level', $event.target.value)"
      />
    </label>

    <label class="add-class-form-fields__field add-class-form-fields__field--half">
      <span class="add-class-form-fields__label">{{ t('preschoolAddClass.schedule') }}</span>
      <input
        data-testid="add-class-schedule-input"
        :value="schedule"
        type="text"
        :placeholder="t('preschoolAddClass.schedulePlaceholder')"
        :disabled="isLocked"
        @input="$emit('update:schedule', $event.target.value)"
      />
    </label>

    <label class="add-class-form-fields__field add-class-form-fields__field--half">
      <span class="add-class-form-fields__label">{{ t('preschoolAddClass.students') }}</span>
      <input
        :value="students"
        type="number"
        min="0"
        :placeholder="t('preschoolAddClass.studentsPlaceholder')"
        :disabled="isLocked"
        @input="$emit('update:students', $event.target.value)"
      />
    </label>

    <label class="add-class-form-fields__field add-class-form-fields__field--half">
      <span class="add-class-form-fields__label">{{ t('preschoolAddClass.status') }}</span>
      <select :value="status" :disabled="isLocked" @change="$emit('update:status', $event.target.value)">
        <option v-for="option in translatedStatusOptions" :key="option.value" :value="option.value">
          {{ option.label }}
        </option>
      </select>
    </label>

    <label class="add-class-form-fields__field add-class-form-fields__field--half">
      <span class="add-class-form-fields__label">{{ t('preschoolAddClass.room') }}</span>
      <input
        :value="room"
        type="text"
        :placeholder="t('preschoolAddClass.roomPlaceholder')"
        :disabled="isLocked"
        @input="$emit('update:room', $event.target.value)"
      />
    </label>

    <label class="add-class-form-fields__field add-class-form-fields__field--full">
      <span class="add-class-form-fields__label">{{ t('preschoolAddClass.notes') }}</span>
      <textarea
        :value="notes"
        rows="4"
        :placeholder="t('preschoolAddClass.notesPlaceholder')"
        :disabled="isLocked"
        @input="$emit('update:notes', $event.target.value)"
      />
    </label>
  </div>
</template>

<style scoped>
.add-class-form-fields {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.95rem;
}

.add-class-form-fields__field {
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
}

.add-class-form-fields__code-preview {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  padding: 0.85rem 0.95rem;
  border: 1px solid #dbeafe;
  border-radius: 0.95rem;
  background: linear-gradient(135deg, rgba(239, 246, 255, 0.9) 0%, rgba(255, 255, 255, 0.98) 100%);
}

.add-class-form-fields__code-preview--loading {
  opacity: 0.85;
}

.add-class-form-fields__code-value {
  color: #0f172a;
  font-size: 1rem;
  font-weight: 800;
  letter-spacing: 0.04em;
}

.add-class-form-fields__code-hint {
  color: #475569;
  font-size: 0.82rem;
  line-height: 1.45;
}

.add-class-form-fields__field--half {
  grid-column: span 1;
}

.add-class-form-fields__field--full {
  grid-column: 1 / -1;
}

.add-class-form-fields__label {
  color: #334155;
  font-size: 0.84rem;
  font-weight: 700;
}

.add-class-form-fields--kh .add-class-form-fields__label,
.add-class-form-fields--kh :deep(input),
.add-class-form-fields--kh :deep(select),
.add-class-form-fields--kh :deep(textarea) {
  font-family:
    'Noto Sans Khmer', 'Khmer OS Siemreap', 'Khmer OS Battambang', 'Leelawadee UI', sans-serif;
}

.add-class-form-fields--kh .add-class-form-fields__code-hint {
  line-height: 1.65;
}

@media (max-width: 720px) {
  .add-class-form-fields {
    grid-template-columns: 1fr;
  }
}
</style>
