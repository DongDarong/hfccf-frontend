<script setup>
// Keep the teacher report route visible as a scaffold so navigation remains
// stable while the real reporting workflow is still being designed.
import MainLayout from '@/layouts/MainLayout.vue'
import HeaderSection from '@/components/navigation/HeaderSection.vue'
import PreschoolPlaceholderState from '@/modules/preschool/shared/components/PreschoolPlaceholderState.vue'
import { useLanguage } from '@/composables/useLanguage'

defineOptions({
  name: 'PreschoolTeacherReportPage',
})

const { t } = useLanguage()
</script>

<template>
  <MainLayout>
    <section class="preschool-placeholder-page">
      <HeaderSection
        :title="t('preschoolScaffold.teacherReport.title')"
        :subtitle="t('preschoolScaffold.teacherReport.subtitle')"
      />

      <PreschoolPlaceholderState
        :eyebrow="t('preschoolScaffold.teacherReport.eyebrow')"
        :title="t('preschoolScaffold.teacherReport.title')"
        :subtitle="t('preschoolScaffold.teacherReport.subtitle')"
        :description="t('preschoolScaffold.teacherReport.description')"
      />
    </section>
  </MainLayout>
</template>
