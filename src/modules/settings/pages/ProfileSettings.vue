<script setup>
import { computed } from 'vue'
import MainLayout from '@/layouts/MainLayout.vue'
import HeaderSection from '@/components/navigation/HeaderSection.vue'
import { useLanguage } from '@/composables/useLanguage'

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

      <div class="global-page__grid">
        <article v-for="section in sections" :key="section.title" class="global-card">
          <h3 class="global-card__title">{{ section.title }}</h3>
          <p class="global-card__copy">{{ section.copy }}</p>
        </article>
      </div>
    </section>
  </MainLayout>
</template>

<style scoped>
.global-page {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.global-page__grid {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.global-card {
  border: 1px solid #e2e8f0;
  border-radius: 1.25rem;
  padding: 1.25rem;
  background: linear-gradient(160deg, #ffffff 0%, #f8fbff 100%);
  box-shadow: 0 16px 32px rgba(15, 23, 42, 0.05);
}

.global-card__title {
  margin: 0;
  font-size: 1rem;
  font-weight: 800;
  color: #122f43;
}

.global-card__copy {
  margin: 0.55rem 0 0;
  font-size: 0.9rem;
  line-height: 1.65;
  color: #64748b;
}

.global-page--kh .global-card__title,
.global-page--kh .global-card__copy {
  font-family:
    'Noto Sans Khmer', 'Khmer OS Siemreap', 'Khmer OS Battambang', 'Leelawadee UI', sans-serif;
}

@media (max-width: 1000px) {
  .global-page__grid {
    grid-template-columns: 1fr;
  }
}
</style>
