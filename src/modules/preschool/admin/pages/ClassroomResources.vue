<script setup>
// Keep the route registered as an explicit scaffold so the sidebar does not
// suggest the feature is production-ready before the workflow exists.
import MainLayout from '@/layouts/MainLayout.vue'
import HeaderSection from '@/components/navigation/HeaderSection.vue'
import PreschoolPlaceholderState from '@/modules/preschool/shared/components/PreschoolPlaceholderState.vue'
import { useLanguage } from '@/composables/useLanguage'

defineOptions({
  name: 'PreschoolAdminClassroomResourcesPage',
})

const { t } = useLanguage()
</script>

<template>
  <MainLayout>
    <section class="preschool-placeholder-page">
      <HeaderSection
        :title="t('preschoolScaffold.classroomResources.title')"
        :subtitle="t('preschoolScaffold.classroomResources.subtitle')"
      />

      <PreschoolPlaceholderState
        :eyebrow="t('preschoolScaffold.classroomResources.eyebrow')"
        :title="t('preschoolScaffold.classroomResources.title')"
        :subtitle="t('preschoolScaffold.classroomResources.subtitle')"
        :description="t('preschoolScaffold.classroomResources.description')"
      />
    </section>
  </MainLayout>
</template>
