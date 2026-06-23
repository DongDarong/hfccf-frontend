<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import EnrollmentApplicationForm from './EnrollmentApplicationForm.vue'

defineOptions({ name: 'EnrollmentApplicationDialog' })

const props = defineProps({
  visible: { type: Boolean, default: false },
  application: { type: Object, default: null },
  academicYears: { type: Array, default: () => [] },
  terms: { type: Array, default: () => [] },
  classes: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false },
  readonly: { type: Boolean, default: false },
})

const emit = defineEmits(['update:visible', 'save'])
const { t } = useI18n()

const dialogTitle = computed(() => {
  if (props.readonly) return t('preschoolEnrollmentPage.applicationDialog.titleView')
  if (props.application) return t('preschoolEnrollmentPage.applicationDialog.titleEdit')
  return t('preschoolEnrollmentPage.applicationDialog.titleNew')
})
</script>

<template>
  <Teleport to="body">
    <div v-if="visible" class="enr-app-overlay" @click.self="emit('update:visible', false)">
      <div class="enr-app-dialog" role="dialog" :aria-label="dialogTitle">
        <div class="enr-app-dialog__header">
          <h2 class="enr-app-dialog__title">{{ dialogTitle }}</h2>
          <button class="enr-app-dialog__close" @click="emit('update:visible', false)">
            <i class="pi pi-times" />
          </button>
        </div>

        <div class="enr-app-dialog__body">
          <EnrollmentApplicationForm
            :application="application"
            :academic-years="academicYears"
            :terms="terms"
            :classes="classes"
            :loading="loading"
            :readonly="readonly"
            :cancel-label="t('preschoolEnrollmentPage.actions.close')"
            :save-label="t('preschoolEnrollmentPage.actions.save')"
            @cancel="emit('update:visible', false)"
            @save="emit('save', $event)"
          />
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.enr-app-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.45);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  z-index: 1000;
  padding: 1.5rem;
  overflow-y: auto;
}

.enr-app-dialog {
  background: #fff;
  border-radius: 1rem;
  width: 100%;
  max-width: 900px;
  box-shadow: 0 25px 60px rgba(15, 23, 42, 0.2);
  display: flex;
  flex-direction: column;
  max-height: 90vh;
  overflow: hidden;
}

.enr-app-dialog__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem 1.5rem 0;
}

.enr-app-dialog__title {
  font-size: 1.1rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
}

.enr-app-dialog__close {
  background: none;
  border: none;
  color: #94a3b8;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 0.4rem;
}

.enr-app-dialog__close:hover {
  color: #0f172a;
}

.enr-app-dialog__body {
  padding: 1.25rem 1.5rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}
</style>
