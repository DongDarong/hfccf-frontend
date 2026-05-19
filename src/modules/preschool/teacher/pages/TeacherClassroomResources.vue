<script setup>
// Keep the teacher resource route visible as a scaffold so navigation remains
// stable while the Preschool workflow is still being designed.
import MainLayout from '@/layouts/MainLayout.vue'
import HeaderSection from '@/components/navigation/HeaderSection.vue'
import PreschoolPlaceholderState from '@/modules/preschool/shared/components/PreschoolPlaceholderState.vue'
import { useLanguage } from '@/composables/useLanguage'

defineOptions({
  name: 'PreschoolTeacherClassroomResourcesPage',
})

const { t } = useLanguage()
</script>

<template>
  <MainLayout>
    <section class="preschool-placeholder-page">
      <HeaderSection
        :title="t('preschoolScaffold.teacherClassroomResources.title')"
        :subtitle="t('preschoolScaffold.teacherClassroomResources.subtitle')"
      />

      <PreschoolPlaceholderState
        :eyebrow="t('preschoolScaffold.teacherClassroomResources.eyebrow')"
        :title="t('preschoolScaffold.teacherClassroomResources.title')"
        :subtitle="t('preschoolScaffold.teacherClassroomResources.subtitle')"
        :description="t('preschoolScaffold.teacherClassroomResources.description')"
      />
    </section>
  </MainLayout>
</template>
