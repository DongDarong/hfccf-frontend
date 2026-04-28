<script setup>
import { computed } from 'vue'
import MainLayout from '@/layouts/MainLayout.vue'
import HeaderSection from '@/components/navigation/HeaderSection.vue'
import { useLanguage } from '@/composables/useLanguage'

const { t, language } = useLanguage()
const isKh = computed(() => language.value === 'KH')

const title = computed(() => (isKh.value ? 'កាលវិភាគ' : 'Calendar'))
const subtitle = computed(() =>
  isKh.value
    ? 'មើលកាលវិភាគសកម្មភាព កិច្ចប្រជុំ និងព្រឹត្តិការណ៍សំខាន់ៗក្នុងថ្ងៃ និងសប្ដាហ៍នេះ។'
    : 'Review scheduled activities, meetings, and key events across today and this week.',
)

const upcomingItems = computed(() => [
  {
    time: '08:30',
    title: isKh.value ? 'កិច្ចប្រជុំក្រុមប្រតិបត្តិការ' : 'Operations check-in',
    note: isKh.value ? 'បន្ទប់ប្រជុំ A' : 'Meeting room A',
  },
  {
    time: '11:00',
    title: isKh.value ? 'ត្រួតពិនិត្យវគ្គបណ្ដុះបណ្ដាល' : 'Training session review',
    note: isKh.value ? 'ក្រុមការងារកីឡា' : 'Sport program team',
  },
  {
    time: '15:30',
    title: isKh.value ? 'តាមដានការអនុម័តប្រចាំថ្ងៃ' : 'Daily approval follow-up',
    note: isKh.value ? 'ការងាររដ្ឋបាល' : 'Administrative workflow',
  },
])
</script>

<template>
  <MainLayout>
    <section :class="isKh ? 'global-page global-page--kh' : 'global-page'">
      <HeaderSection :title="title" :subtitle="subtitle" />

      <div class="global-page__grid">
        <article class="global-card">
          <p class="global-card__eyebrow">{{ isKh ? 'ថ្ងៃនេះ' : 'Today' }}</p>
          <h3 class="global-card__title">{{ isKh ? 'ទិដ្ឋភាពកាលវិភាគ' : 'Schedule overview' }}</h3>
          <p class="global-card__copy">
            {{
              isKh
                ? 'ប្រើទំព័រនេះសម្រាប់បង្ហាញកាលវិភាគសកម្មភាពរួម សម្រាប់អ្នកប្រើគ្រប់តួនាទី។'
                : 'Use this page for a shared scheduling view that works across every authenticated role.'
            }}
          </p>
        </article>

        <article class="global-card">
          <p class="global-card__eyebrow">{{ isKh ? 'កិច្ចការខាងមុខ' : 'Upcoming' }}</p>
          <div class="global-list">
            <div v-for="item in upcomingItems" :key="`${item.time}-${item.title}`" class="global-list__item">
              <div class="global-list__time">{{ item.time }}</div>
              <div>
                <p class="global-list__title">{{ item.title }}</p>
                <p class="global-list__note">{{ item.note }}</p>
              </div>
            </div>
          </div>
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
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.global-card {
  border: 1px solid #e2e8f0;
  border-radius: 1.25rem;
  padding: 1.25rem;
  background: linear-gradient(160deg, #ffffff 0%, #f8fbff 100%);
  box-shadow: 0 16px 32px rgba(15, 23, 42, 0.05);
}

.global-card__eyebrow {
  margin: 0;
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--hope-cyan);
}

.global-card__title {
  margin: 0.4rem 0 0;
  font-size: 1.1rem;
  font-weight: 800;
  color: #122f43;
}

.global-card__copy {
  margin: 0.6rem 0 0;
  font-size: 0.92rem;
  line-height: 1.65;
  color: #64748b;
}

.global-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-top: 0.3rem;
}

.global-list__item {
  display: flex;
  align-items: flex-start;
  gap: 0.9rem;
  padding: 0.9rem;
  border: 1px solid #e7eef6;
  border-radius: 0.9rem;
  background: white;
}

.global-list__time {
  min-width: 3.4rem;
  padding: 0.35rem 0.55rem;
  border-radius: 9999px;
  background: color-mix(in srgb, var(--hope-cyan) 12%, white);
  color: #0f6e96;
  font-size: 0.78rem;
  font-weight: 800;
  text-align: center;
}

.global-list__title {
  margin: 0;
  font-size: 0.9rem;
  font-weight: 700;
  color: #122f43;
}

.global-list__note {
  margin: 0.2rem 0 0;
  font-size: 0.78rem;
  color: #64748b;
}

.global-page--kh .global-card__eyebrow,
.global-page--kh .global-card__title,
.global-page--kh .global-card__copy,
.global-page--kh .global-list__title,
.global-page--kh .global-list__note {
  font-family:
    'Noto Sans Khmer', 'Khmer OS Siemreap', 'Khmer OS Battambang', 'Leelawadee UI', sans-serif;
}

.global-page--kh .global-card__eyebrow {
  text-transform: none;
  letter-spacing: 0.01em;
}

@media (max-width: 900px) {
  .global-page__grid {
    grid-template-columns: 1fr;
  }
}
</style>
