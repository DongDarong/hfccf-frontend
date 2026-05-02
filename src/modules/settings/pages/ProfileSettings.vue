<script setup>
import { computed, ref } from 'vue'
import MainLayout from '@/layouts/MainLayout.vue'
import HeaderSection from '@/components/navigation/HeaderSection.vue'
import AlertSuccess from '@/components/alerts/AlertSuccess.vue'
import { useLanguage } from '@/composables/useLanguage'
import ProfileCard from '@/modules/settings/components/profile-settings/ProfileCard.vue'
import GeneralInformation from '@/modules/settings/components/profile-settings/GeneralInformation.vue'
import { useUserStore } from '@/store/userStore'

const { language, t } = useLanguage()
const isKh = computed(() => language.value === 'KH')
const userStore = useUserStore()
const currentUser = computed(() => userStore.currentUser)
const isSuccessAlertVisible = ref(false)

const title = computed(() => (isKh.value ? 'ប្រវត្តិរូប និងការកំណត់' : 'Profile & Settings'))
const subtitle = computed(() =>
  isKh.value
    ? 'គ្រប់គ្រងព័ត៌មានផ្ទាល់ខ្លួន ចំណូលចិត្តភាសា និងសុវត្ថិភាពគណនីរបស់អ្នក។'
    : 'Manage your personal details, language preferences, and account security settings.',
)
const successAlertTitle = computed(() => (isKh.value ? 'បានរក្សាទុកការផ្លាស់ប្តូរ' : 'Changes saved'))
const successAlertMessage = computed(() =>
  isKh.value
    ? 'ព័ត៌មានប្រវត្តិរូបរបស់អ្នកត្រូវបានធ្វើបច្ចុប្បន្នភាពដោយជោគជ័យ។'
    : 'Your profile information was updated successfully.',
)

function handleGeneralInformationSubmit(formData) {
  console.log('Profile settings submitted:', formData)
  isSuccessAlertVisible.value = true
}

function handleSuccessAlertClose() {
  isSuccessAlertVisible.value = false
}
</script>

<template>
  <MainLayout>
    <section :class="isKh ? 'global-page global-page--kh' : 'global-page'">
      <HeaderSection :title="title" :subtitle="subtitle" />

      <div class="profile-settings-layout">
        <aside class="profile-settings-layout__sidebar">
          <ProfileCard v-if="currentUser" :user="currentUser" />
        </aside>

        <main class="profile-settings-layout__content">
          <GeneralInformation
            v-if="currentUser"
            :user="currentUser"
            @submit="handleGeneralInformationSubmit"
          />
        </main>
      </div>
      <AlertSuccess
        :show="isSuccessAlertVisible"
        :title="successAlertTitle"
        :message="successAlertMessage"
        :button-text="t('common.continue')"
        :auto-close="2500"
        @close="handleSuccessAlertClose"
      />
    </section>
  </MainLayout>
</template>

<style scoped>
.global-page {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.profile-settings-layout {
  display: grid;
  grid-template-columns: 20rem 1fr;
  align-items: start;
  gap: 1.25rem;
}

@media (max-width: 1200px) {
  .profile-settings-layout {
    grid-template-columns: 1fr;
  }

  .profile-settings-layout__sidebar {
    max-width: 100%;
  }
}

.global-page--kh :deep(.profile-settings-card__title),
.global-page--kh :deep(.profile-settings-card__copy) {
  font-family:
    'Noto Sans Khmer', 'Khmer OS Siemreap', 'Khmer OS Battambang', 'Leelawadee UI', sans-serif;
}
</style>
