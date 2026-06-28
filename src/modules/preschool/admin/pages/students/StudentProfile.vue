<script setup>
import MainLayout from '@/layouts/MainLayout.vue'
import HeaderSection from '@/components/navigation/HeaderSection.vue'
import { useLanguage } from '@/composables/useLanguage'
import { useStudentProfileData } from './student-profile/composables/useStudentProfileData'
import { useStudentProfileActions } from './student-profile/composables/useStudentProfileActions'
import StudentProfileHeader from './student-profile/sections/StudentProfileHeader.vue'
import StudentSummaryCardsSection from './student-profile/sections/StudentSummaryCardsSection.vue'
import StudentHealthSummarySection from './student-profile/sections/StudentHealthSummarySection.vue'
import StudentPaymentSummarySection from './student-profile/sections/StudentPaymentSummarySection.vue'
import StudentCommunicationSection from './student-profile/sections/StudentCommunicationSection.vue'
import StudentDetailsGridSection from './student-profile/sections/StudentDetailsGridSection.vue'
import './student-profile/student-profile.css'

defineOptions({
  name: 'PreschoolAdminStudentProfilePage',
})

const { t } = useLanguage()
const {
  loading,
  errorMessage,
  student,
  healthSummary,
  paymentSummary,
  communicationTimeline,
  profileClasses,
  avatarSrc,
  initials,
  statusLabel,
  statusClass,
  infoCards,
  addressDisplay,
} = useStudentProfileData()
const {
  goBack,
  goToHealthRecords,
  goToPayments,
  goToCommunications,
} = useStudentProfileActions()
</script>

<template>
  <MainLayout>
    <section class="student-profile-page">
      <HeaderSection
        :title="t('preschoolStudentProfilePage.title')"
        :subtitle="t('preschoolStudentProfilePage.subtitle')"
      />

      <div class="student-profile-page__shell">
          <StudentProfileHeader
            :student="student"
            :avatar-src="avatarSrc"
            :initials="initials"
            :status-label="statusLabel"
            :status-class="statusClass"
            :back-label="t('preschoolStudentProfilePage.actions.back')"
            :health-label="t('preschoolStudentProfilePage.actions.health')"
            :communications-label="t('preschoolGuardianCommunicationPage.profile.viewFullContactHistory')"
            @back="goBack"
            @health="goToHealthRecords"
            @communications="goToCommunications"
          />

        <div v-if="loading" class="student-profile-page__state">
          {{ t('preschoolStudentProfilePage.messages.loading') }}
        </div>

        <div v-else-if="errorMessage" class="student-profile-page__state student-profile-page__state--error">
          {{ errorMessage }}
        </div>

        <template v-else-if="student">
          <StudentSummaryCardsSection :cards="infoCards" />

          <StudentHealthSummarySection
            v-if="healthSummary"
            :health-summary="healthSummary"
            @open-health="goToHealthRecords"
          />

          <StudentPaymentSummarySection
            v-if="paymentSummary"
            :payment-summary="paymentSummary"
            @open-payments="goToPayments"
          />

          <StudentCommunicationSection
            v-if="communicationTimeline"
            :communication-timeline="communicationTimeline"
          />

          <StudentDetailsGridSection
            :student="student"
            :profile-classes="profileClasses"
            :status-label="statusLabel"
            :address-display="addressDisplay"
          />
        </template>
      </div>
    </section>
  </MainLayout>
</template>
