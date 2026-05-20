<script setup>
// Keep the teacher contact view read-only so staff can see assigned student
// pickup order without editing the normalized guardian records.
import { onMounted, watch } from 'vue'
import MainLayout from '@/layouts/MainLayout.vue'
import HeaderSection from '@/components/navigation/HeaderSection.vue'
import Button from '@/components/buttons/Button.vue'
import { useLanguage } from '@/composables/useLanguage'
import { useEmergencyContacts } from '@/modules/preschool/composables/useEmergencyContacts'
import EmergencyContactList from '@/modules/preschool/shared/components/guardian/EmergencyContactList.vue'

defineOptions({
  name: 'PreschoolTeacherEmergencyContactsPage',
})

const { t } = useLanguage()
const {
  contacts,
  errorMessage,
  loadEmergencyContacts,
  loadStudents,
  loading,
  selectedStudentId,
  setSelectedStudentId,
  studentOptions,
} = useEmergencyContacts()

function handleStudentChange(event) {
  setSelectedStudentId(event.target.value)
}

watch(selectedStudentId, () => {
  loadEmergencyContacts()
})

onMounted(async () => {
  await loadStudents()
  if (selectedStudentId.value) {
    await loadEmergencyContacts()
  }
})
</script>

<template>
  <MainLayout>
    <section class="preschool-emergency-page">
      <HeaderSection
        :title="t('preschoolEmergencyContactsPage.title')"
        :subtitle="t('preschoolEmergencyContactsPage.subtitle')"
      />

      <div class="preschool-emergency-page__panel">
        <div class="preschool-emergency-page__toolbar">
          <Button type="button" variant="outline" rounded="xl" :disabled="loading" @click="loadEmergencyContacts()">
            {{ t('preschoolEmergencyContactsPage.actions.refresh') }}
          </Button>
        </div>

        <div class="preschool-emergency-page__filters">
          <select :value="selectedStudentId" class="preschool-emergency-page__input" @change="handleStudentChange">
            <option value="">{{ t('preschoolEmergencyContactsPage.placeholders.student') }}</option>
            <option v-for="student in studentOptions" :key="student.value" :value="student.value">
              {{ student.label }}
            </option>
          </select>
        </div>

        <div
          v-if="errorMessage"
          class="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"
        >
          {{ errorMessage }}
        </div>

        <EmergencyContactList
          :contacts="contacts"
          :loading="loading"
          :empty-text="t('preschoolEmergencyContactsPage.empty')"
        />
      </div>
    </section>
  </MainLayout>
</template>

<style scoped>
.preschool-emergency-page {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.preschool-emergency-page__panel {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.5rem;
  border-radius: 1.5rem;
  border: 1px solid #dce6f2;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.98) 100%);
  box-shadow: 0 25px 60px -40px rgba(15, 23, 42, 0.5);
}

.preschool-emergency-page__toolbar {
  display: flex;
  justify-content: flex-end;
}

.preschool-emergency-page__filters {
  display: grid;
  gap: 0.75rem;
}

.preschool-emergency-page__input {
  width: 100%;
  min-height: 2.75rem;
  border-radius: 0.85rem;
  border: 1px solid #d5dde8;
  background: #fff;
  padding: 0.7rem 0.85rem;
  color: #0f172a;
}
</style>
