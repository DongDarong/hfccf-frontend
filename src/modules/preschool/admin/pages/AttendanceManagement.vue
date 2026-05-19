<script setup>
// Keep the admin attendance route visible as a scaffold until the real
// Preschool workflow is wired here; this prevents the sidebar from implying
// a finished screen before it exists.
import MainLayout from '@/layouts/MainLayout.vue'
import HeaderSection from '@/components/navigation/HeaderSection.vue'
import PreschoolPlaceholderState from '@/modules/preschool/shared/components/PreschoolPlaceholderState.vue'
import { useLanguage } from '@/composables/useLanguage'

defineOptions({
  name: 'PreschoolAdminAttendanceManagementPage',
})

const { t } = useLanguage()
</script>

<template>
  <MainLayout>
    <section class="preschool-placeholder-page">
      <HeaderSection
        :title="t('preschoolScaffold.attendanceManagement.title')"
        :subtitle="t('preschoolScaffold.attendanceManagement.subtitle')"
      />

      <PreschoolPlaceholderState
        :eyebrow="t('preschoolScaffold.attendanceManagement.eyebrow')"
        :title="t('preschoolScaffold.attendanceManagement.title')"
        :subtitle="t('preschoolScaffold.attendanceManagement.subtitle')"
        :description="t('preschoolScaffold.attendanceManagement.description')"
      />
    </section>
  </MainLayout>
</template>
