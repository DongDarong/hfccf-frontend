<script setup>
import { formatDate } from '@/utils/date'
import { useLanguage } from '@/composables/useLanguage'

defineOptions({
  name: 'StudentDetailsGridSection',
})

defineProps({
  student: {
    type: Object,
    default: null,
  },
  profileClasses: {
    type: Array,
    default: () => [],
  },
  statusLabel: {
    type: String,
    default: '',
  },
  addressDisplay: {
    type: String,
    default: '',
  },
})

const { t } = useLanguage()
</script>

<template>
  <div class="student-profile-page__content-grid">
    <section class="student-profile-page__panel">
      <h3 class="student-profile-page__panel-title">{{ t('preschoolStudentProfilePage.sections.personal') }}</h3>
      <dl class="student-profile-page__details">
        <div>
          <dt>{{ t('preschoolStudentProfilePage.fields.signature') }}</dt>
          <dd>{{ student?.publicId || student?.studentCode || '-' }}</dd>
        </div>
        <div>
          <dt>{{ t('preschoolStudentProfilePage.fields.gender') }}</dt>
          <dd>{{ student?.gender ? t(`preschoolStudentInfoPage.options.${student.gender}`) : '-' }}</dd>
        </div>
        <div>
          <dt>{{ t('preschoolStudentProfilePage.fields.dateOfBirth') }}</dt>
          <dd>{{ formatDate(student?.dateOfBirth) || student?.dateOfBirth || '-' }}</dd>
        </div>
        <div>
          <dt>{{ t('preschoolStudentProfilePage.fields.address') }}</dt>
          <dd>{{ addressDisplay || student?.address || '-' }}</dd>
        </div>
      </dl>
    </section>

    <section class="student-profile-page__panel">
      <h3 class="student-profile-page__panel-title">{{ t('preschoolStudentProfilePage.sections.guardian') }}</h3>
      <dl class="student-profile-page__details">
        <div>
          <dt>{{ t('preschoolStudentProfilePage.fields.guardianName') }}</dt>
          <dd>{{ student?.guardianName || '-' }}</dd>
        </div>
        <div>
          <dt>{{ t('preschoolStudentProfilePage.fields.guardianPhone') }}</dt>
          <dd>{{ student?.guardianPhone || '-' }}</dd>
        </div>
      </dl>
    </section>

    <section class="student-profile-page__panel student-profile-page__panel--wide">
      <h3 class="student-profile-page__panel-title">{{ t('preschoolStudentProfilePage.sections.enrollment') }}</h3>
      <div v-if="profileClasses.length" class="student-profile-page__class-list">
        <div v-for="classItem in profileClasses" :key="classItem.id" class="student-profile-page__class-chip">
          <p class="student-profile-page__class-name">{{ classItem.name || classItem.code || '-' }}</p>
          <p class="student-profile-page__class-meta">{{ classItem.level || classItem.code || '-' }}</p>
        </div>
      </div>
      <div v-else class="student-profile-page__empty-inline">
        {{ t('preschoolStudentProfilePage.messages.noClasses') }}
      </div>
    </section>

    <section class="student-profile-page__panel student-profile-page__panel--wide">
      <h3 class="student-profile-page__panel-title">{{ t('preschoolStudentProfilePage.sections.record') }}</h3>
      <dl class="student-profile-page__details student-profile-page__details--four">
        <div>
          <dt>{{ t('preschoolStudentProfilePage.fields.status') }}</dt>
          <dd>{{ statusLabel }}</dd>
        </div>
        <div>
          <dt>{{ t('preschoolStudentProfilePage.fields.createdAt') }}</dt>
          <dd>{{ formatDate(student?.createdAt) || student?.createdAt || '-' }}</dd>
        </div>
        <div>
          <dt>{{ t('preschoolStudentProfilePage.fields.updatedAt') }}</dt>
          <dd>{{ formatDate(student?.updatedAt) || student?.updatedAt || '-' }}</dd>
        </div>
        <div>
          <dt>{{ t('preschoolStudentProfilePage.fields.classesCount') }}</dt>
          <dd>{{ student?.classesCount || profileClasses.length || 0 }}</dd>
        </div>
      </dl>
    </section>
  </div>
</template>
