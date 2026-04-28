<script setup>
import { computed } from 'vue'
import MainLayout from '@/layouts/MainLayout.vue'
import HeaderSection from '@/components/navigation/HeaderSection.vue'
import { useLanguage } from '@/composables/useLanguage'

const { t, language } = useLanguage()
const isKh = computed(() => language.value === 'KH')

const title = computed(() => t('common.notifications'))
const subtitle = computed(() =>
  isKh.value
    ? 'មើលការជូនដំណឹងថ្មីៗ និងសកម្មភាពដែលត្រូវការតាមដានពីគ្រប់ផ្នែកការងារ។'
    : 'Review recent alerts and activity updates that need follow-up across the workspace.',
)

const notifications = computed(() => [
  {
    tone: 'danger',
    label: isKh.value ? 'ត្រូវការឆ្លើយតប' : 'Needs action',
    title: isKh.value ? 'មានសំណើអនុម័តថ្មី 4' : '4 new approval requests are waiting',
    detail: isKh.value ? 'តាមដានពីផ្ទាំងការងាររដ្ឋបាល និងកម្មវិធី' : 'Follow up from administration and program dashboards',
  },
  {
    tone: 'info',
    label: isKh.value ? 'ព័ត៌មាន' : 'Update',
    title: isKh.value ? 'កាលវិភាគប្រចាំថ្ងៃត្រូវបានធ្វើបច្ចុប្បន្នភាព' : 'The shared daily schedule was updated',
    detail: isKh.value ? 'ពិនិត្យព្រឹត្តិការណ៍ និងកិច្ចប្រជុំបន្ថែម' : 'Check new meetings and event changes',
  },
  {
    tone: 'success',
    label: isKh.value ? 'បានបញ្ចប់' : 'Completed',
    title: isKh.value ? 'ការបម្រុងទុកប្រព័ន្ធបានសម្រេច' : 'System backup completed successfully',
    detail: isKh.value ? 'មិនត្រូវការសកម្មភាពបន្ថែម' : 'No further action is required',
  },
])
</script>

<template>
  <MainLayout>
    <section :class="isKh ? 'global-page global-page--kh' : 'global-page'">
      <HeaderSection :title="title" :subtitle="subtitle" />

      <article class="global-card">
        <p class="global-card__eyebrow">{{ isKh ? 'ប្រអប់ជូនដំណឹង' : 'Inbox' }}</p>
        <div class="notification-list">
          <div
            v-for="item in notifications"
            :key="item.title"
            class="notification-list__item"
            :class="`notification-list__item--${item.tone}`"
          >
            <div class="notification-list__pill">{{ item.label }}</div>
            <div>
              <p class="notification-list__title">{{ item.title }}</p>
              <p class="notification-list__detail">{{ item.detail }}</p>
            </div>
          </div>
        </div>
      </article>
    </section>
  </MainLayout>
</template>

<style scoped>
.global-page {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.global-card {
  border: 1px solid #e2e8f0;
  border-radius: 1.25rem;
  padding: 1.25rem;
  background: linear-gradient(160deg, #ffffff 0%, #f8fbff 100%);
  box-shadow: 0 16px 32px rgba(15, 23, 42, 0.05);
}

.global-card__eyebrow {
  margin: 0 0 1rem;
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--hope-cyan);
}

.notification-list {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}

.notification-list__item {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1rem;
  border-radius: 1rem;
  border: 1px solid #e7eef6;
  background: white;
}

.notification-list__item--danger {
  border-left: 4px solid var(--hope-red);
}

.notification-list__item--info {
  border-left: 4px solid var(--hope-cyan);
}

.notification-list__item--success {
  border-left: 4px solid var(--hope-lime);
}

.notification-list__pill {
  min-width: 7.2rem;
  padding: 0.35rem 0.7rem;
  border-radius: 9999px;
  background: #eef6fb;
  color: #0f6e96;
  font-size: 0.72rem;
  font-weight: 800;
  text-align: center;
}

.notification-list__title {
  margin: 0;
  font-size: 0.94rem;
  font-weight: 800;
  color: #122f43;
}

.notification-list__detail {
  margin: 0.25rem 0 0;
  font-size: 0.82rem;
  line-height: 1.6;
  color: #64748b;
}

.global-page--kh .global-card__eyebrow,
.global-page--kh .notification-list__pill,
.global-page--kh .notification-list__title,
.global-page--kh .notification-list__detail {
  font-family:
    'Noto Sans Khmer', 'Khmer OS Siemreap', 'Khmer OS Battambang', 'Leelawadee UI', sans-serif;
}

.global-page--kh .global-card__eyebrow {
  text-transform: none;
  letter-spacing: 0.01em;
}

@media (max-width: 640px) {
  .notification-list__item {
    flex-direction: column;
    gap: 0.7rem;
  }

  .notification-list__pill {
    min-width: 0;
  }
}
</style>
