<script setup>
import { computed } from 'vue'
import MainLayout from '@/layouts/MainLayout.vue'
import HeaderSection from '@/components/navigation/HeaderSection.vue'
import { useLanguage } from '@/composables/useLanguage'
import ProfileSettingsGrid from '@/modules/settings/components/profile-settings/ProfileSettingsGrid.vue'

const { language } = useLanguage()
const isKh = computed(() => language.value === 'KH')

const title = computed(() => (isKh.value ? 'ប្រវត្តិរូប និងការកំណត់' : 'Profile & Settings'))
const subtitle = computed(() =>
  isKh.value
    ? 'គ្រប់គ្រងព័ត៌មានផ្ទាល់ខ្លួន ចំណូលចិត្តភាសា និងសុវត្ថិភាពគណនីរបស់អ្នក។'
    : 'Manage your personal details, language preferences, and account security settings.',
)

const sections = computed(() => [
  {
    title: isKh.value ? 'ព័ត៌មានគណនី' : 'Account details',
    copy: isKh.value
      ? 'ទីតាំងសម្រាប់កែសម្រួលឈ្មោះ អ៊ីមែល និងព័ត៌មានទំនាក់ទំនងរបស់អ្នក។'
      : 'A place to update your display name, email address, and contact details.',
  },
  {
    title: isKh.value ? 'ចំណូលចិត្ត' : 'Preferences',
    copy: isKh.value
      ? 'គ្រប់គ្រងភាសា ការជូនដំណឹង និងរបៀបបង្ហាញក្នុងការងារប្រចាំថ្ងៃ។'
      : 'Control language, alerts, and workspace presentation preferences.',
  },
  {
    title: isKh.value ? 'សុវត្ថិភាព' : 'Security',
    copy: isKh.value
      ? 'ពិនិត្យពាក្យសម្ងាត់ សកម្មភាពចុងក្រោយ និងជម្រើសការពារគណនីបន្ថែម។'
      : 'Review password status, recent activity, and additional account protection options.',
  },
])
</script>

<template>
  <MainLayout>
    <section :class="isKh ? 'global-page global-page--kh' : 'global-page'">
      <HeaderSection :title="title" :subtitle="subtitle" />

      <ProfileSettingsGrid :sections="sections" />
    </section>
  </MainLayout>
</template>

<style scoped>
.global-page {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.global-page--kh :deep(.profile-settings-card__title),
.global-page--kh :deep(.profile-settings-card__copy) {
  font-family:
    'Noto Sans Khmer', 'Khmer OS Siemreap', 'Khmer OS Battambang', 'Leelawadee UI', sans-serif;
}
</style>
