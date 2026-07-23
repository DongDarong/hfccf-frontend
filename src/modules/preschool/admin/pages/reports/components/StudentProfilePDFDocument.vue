<script setup>
import Avatar from 'primevue/avatar'
import { computed } from 'vue'
import { useLanguage } from '@/composables/useLanguage'

defineOptions({
  name: 'StudentProfilePDFDocument',
})

const { t } = useLanguage()

const props = defineProps({
  student: {
    type: Object,
    required: true,
  },
  attendance: {
    type: Object,
    default: null,
  },
})

const formatDate = (dateString) => {
  if (!dateString) return '—'
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  } catch {
    return '—'
  }
}

const attendanceSummary = computed(() => {
  if (!props.attendance || !props.attendance.items) {
    return {
      present: 0,
      absent: 0,
      late: 0,
      excused: 0,
      total: 0,
      percentage: 0,
    }
  }

  const items = props.attendance.items || []
  const present = items.filter(a => a.status === 'present').length
  const absent = items.filter(a => a.status === 'absent').length
  const late = items.filter(a => a.status === 'late').length
  const excused = items.filter(a => a.status === 'excused').length
  const total = items.length

  return {
    present,
    absent,
    late,
    excused,
    total,
    percentage: total > 0 ? Math.round((present / total) * 100) : 0,
  }
})
</script>

<template>
  <div class="pdf-document">
    <!-- Header Section -->
    <div class="pdf-header">
      <div class="pdf-header__logo-section">
        <img
          src="@/assets/images/hfccf-logo.png"
          alt="HFCCF Logo"
          class="pdf-header__logo"
        />
      </div>

      <div class="pdf-header__center">
        <h1 class="pdf-header__org-name">HFCCF</h1>
        <h1 class="pdf-header__org-name-kh">{{ t('preschoolReportsPage.organization') || 'មជ្ឈមណ្ឌល HFCCF' }}</h1>
        <p class="pdf-header__title">{{ t('preschoolReportsPage.studentProfile') || 'Student Profile' }}</p>
        <p class="pdf-header__title-kh">{{ t('preschoolReportsPage.studentProfileKh') || 'ឯកសារ សម្ភាសន៍ដោយផ្ទាល់' }}</p>
      </div>

      <div class="pdf-header__photo-section">
        <Avatar
          v-if="student.avatarUrl"
          :image="student.avatarUrl"
          size="xlarge"
          shape="circle"
          class="pdf-header__photo"
        />
        <div v-else class="pdf-header__photo-placeholder">
          <i class="pi pi-user text-4xl" />
        </div>
      </div>
    </div>

    <!-- Divider -->
    <div class="pdf-divider" />

    <!-- Student Identity Section -->
    <div class="pdf-section">
      <h2 class="pdf-section__title">{{ t('preschoolReportsPage.studentInformation') || 'Student Information' }}</h2>

      <div class="pdf-grid pdf-grid--2col">
        <!-- Row 1: Names -->
        <div class="pdf-grid__item">
          <label class="pdf-label">{{ t('preschoolReportsPage.khmerName') || 'Khmer Name' }}</label>
          <p class="pdf-value">{{ student.fullName || '—' }}</p>
        </div>
        <div class="pdf-grid__item">
          <label class="pdf-label">{{ t('preschoolReportsPage.latinName') || 'Latin Name' }}</label>
          <p class="pdf-value">{{ student.latinName || '—' }}</p>
        </div>

        <!-- Row 2: Code & Gender -->
        <div class="pdf-grid__item">
          <label class="pdf-label">{{ t('preschoolReportsPage.studentCode') || 'Student Code' }}</label>
          <p class="pdf-value">{{ student.studentCode || student.publicId || '—' }}</p>
        </div>
        <div class="pdf-grid__item">
          <label class="pdf-label">{{ t('preschoolReportsPage.gender') || 'Gender' }}</label>
          <p class="pdf-value">{{ student.gender || '—' }}</p>
        </div>

        <!-- Row 3: DOB & Nationality -->
        <div class="pdf-grid__item">
          <label class="pdf-label">{{ t('preschoolReportsPage.dateOfBirth') || 'Date of Birth' }}</label>
          <p class="pdf-value">{{ formatDate(student.dateOfBirth) }}</p>
        </div>
        <div class="pdf-grid__item">
          <label class="pdf-label">{{ t('preschoolReportsPage.nationality') || 'Nationality' }}</label>
          <p class="pdf-value">{{ student.nationality || '—' }}</p>
        </div>

        <!-- Row 4: Ethnicity & Religion (if available) -->
        <div class="pdf-grid__item">
          <label class="pdf-label">{{ t('preschoolReportsPage.ethnicity') || 'Ethnicity' }}</label>
          <p class="pdf-value">{{ student.ethnicity || '—' }}</p>
        </div>
        <div class="pdf-grid__item">
          <label class="pdf-label">{{ t('preschoolReportsPage.status') || 'Status' }}</label>
          <p class="pdf-value">{{ student.status || '—' }}</p>
        </div>

        <!-- Row 5: Class & Academic Year -->
        <div class="pdf-grid__item">
          <label class="pdf-label">{{ t('preschoolReportsPage.class') || 'Class' }}</label>
          <p class="pdf-value">{{ student.classes?.[0]?.name || '—' }}</p>
        </div>
        <div class="pdf-grid__item">
          <label class="pdf-label">{{ t('preschoolReportsPage.academicYear') || 'Academic Year' }}</label>
          <p class="pdf-value">{{ student.classes?.[0]?.academicYear || '—' }}</p>
        </div>

        <!-- Row 6: Enrollment Date -->
        <div class="pdf-grid__item pdf-grid__item--full">
          <label class="pdf-label">{{ t('preschoolReportsPage.enrollmentDate') || 'Enrollment Date' }}</label>
          <p class="pdf-value">{{ formatDate(student.classes?.[0]?.enrolledAt) }}</p>
        </div>
      </div>
    </div>

    <!-- Guardian Section -->
    <div class="pdf-section">
      <h2 class="pdf-section__title">{{ t('preschoolReportsPage.guardianInformation') || 'Guardian Information' }}</h2>

      <div class="pdf-grid pdf-grid--2col">
        <div class="pdf-grid__item">
          <label class="pdf-label">{{ t('preschoolReportsPage.guardianName') || 'Guardian Name' }}</label>
          <p class="pdf-value">{{ student.guardianName || '—' }}</p>
        </div>
        <div class="pdf-grid__item">
          <label class="pdf-label">{{ t('preschoolReportsPage.relationship') || 'Relationship' }}</label>
          <p class="pdf-value">{{ student.guardianType || '—' }}</p>
        </div>

        <div class="pdf-grid__item">
          <label class="pdf-label">{{ t('preschoolReportsPage.phone') || 'Phone' }}</label>
          <p class="pdf-value">{{ student.guardianPhone || '—' }}</p>
        </div>
        <div class="pdf-grid__item">
          <label class="pdf-label">{{ t('preschoolReportsPage.placeOfBirth') || 'Place of Birth' }}</label>
          <p class="pdf-value">{{ student.placeOfBirth || '—' }}</p>
        </div>

        <div class="pdf-grid__item pdf-grid__item--full">
          <label class="pdf-label">{{ t('preschoolReportsPage.address') || 'Address' }}</label>
          <p class="pdf-value">{{ student.address || student.currentResidenceDisplay || '—' }}</p>
        </div>
      </div>
    </div>

    <!-- Attendance Summary Section -->
    <div v-if="props.attendance" class="pdf-section">
      <h2 class="pdf-section__title">{{ t('preschoolReportsPage.attendanceSummary') || 'Attendance Summary' }}</h2>

      <div class="pdf-grid pdf-grid--2col">
        <div class="pdf-grid__item">
          <label class="pdf-label">{{ t('preschoolReportsPage.attendancePercentage') || 'Attendance %' }}</label>
          <p class="pdf-value pdf-value--large">{{ attendanceSummary.percentage }}%</p>
        </div>
        <div class="pdf-grid__item">
          <label class="pdf-label">{{ t('preschoolReportsPage.totalRecords') || 'Total Records' }}</label>
          <p class="pdf-value pdf-value--large">{{ attendanceSummary.total }}</p>
        </div>

        <div class="pdf-grid__item">
          <label class="pdf-label">{{ t('preschoolReportsPage.present') || 'Present' }}</label>
          <p class="pdf-value">{{ attendanceSummary.present }}</p>
        </div>
        <div class="pdf-grid__item">
          <label class="pdf-label">{{ t('preschoolReportsPage.absent') || 'Absent' }}</label>
          <p class="pdf-value">{{ attendanceSummary.absent }}</p>
        </div>

        <div class="pdf-grid__item">
          <label class="pdf-label">{{ t('preschoolReportsPage.late') || 'Late' }}</label>
          <p class="pdf-value">{{ attendanceSummary.late }}</p>
        </div>
        <div class="pdf-grid__item">
          <label class="pdf-label">{{ t('preschoolReportsPage.excused') || 'Excused' }}</label>
          <p class="pdf-value">{{ attendanceSummary.excused }}</p>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div class="pdf-footer">
      <p class="pdf-footer__text">
        {{ t('preschoolReportsPage.generatedBy') || 'Generated by' }} HFCCF Preschool Management System
      </p>
      <p class="pdf-footer__text">
        {{ t('preschoolReportsPage.generatedDate') || 'Generated on' }} {{ formatDate(new Date().toISOString()) }}
      </p>
    </div>
  </div>
</template>

<style scoped>
.pdf-document {
  background: white;
  color: #000;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  max-width: 210mm;
  margin: 0 auto;
  padding: 0;
}

/* Header Section */
.pdf-header {
  display: grid;
  grid-template-columns: 80px 1fr 100px;
  gap: 1rem;
  align-items: center;
  border-bottom: 2px solid #000;
  padding: 1.5rem 2rem;
  margin-bottom: 1rem;
}

.pdf-header__logo-section {
  display: flex;
  justify-content: flex-start;
}

.pdf-header__logo {
  width: 60px;
  height: 60px;
  object-fit: contain;
}

.pdf-header__center {
  text-align: center;
}

.pdf-header__org-name {
  margin: 0;
  font-size: 18pt;
  font-weight: bold;
  color: #000;
  letter-spacing: 0.05em;
}

.pdf-header__org-name-kh {
  margin: 0.25rem 0 0 0;
  font-size: 14pt;
  font-weight: bold;
  color: #000;
}

.pdf-header__title {
  margin: 0.5rem 0 0 0;
  font-size: 14pt;
  font-weight: bold;
  color: #333;
}

.pdf-header__title-kh {
  margin: 0.25rem 0 0 0;
  font-size: 12pt;
  font-weight: bold;
  color: #333;
}

.pdf-header__photo-section {
  display: flex;
  justify-content: flex-end;
}

.pdf-header__photo {
  width: 90px !important;
  height: 90px !important;
  object-fit: cover;
  border: 1px solid #ccc;
}

.pdf-header__photo-placeholder {
  width: 90px;
  height: 90px;
  border: 1px solid #ccc;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f5f5;
  color: #999;
}

/* Divider */
.pdf-divider {
  height: 0;
  border-top: 1px solid #ccc;
  margin: 0.5rem 2rem;
}

/* Section Styling */
.pdf-section {
  margin: 1.5rem 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e0e0e0;
}

.pdf-section:last-of-type {
  border-bottom: none;
}

.pdf-section__title {
  margin: 0 0 1rem 0;
  font-size: 11pt;
  font-weight: bold;
  color: #000;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  border-bottom: 1px solid #000;
  padding-bottom: 0.5rem;
}

/* Grid Layout */
.pdf-grid {
  display: grid;
  gap: 1rem;
  margin: 0;
}

.pdf-grid--2col {
  grid-template-columns: 1fr 1fr;
}

.pdf-grid__item {
  display: flex;
  flex-direction: column;
}

.pdf-grid__item--full {
  grid-column: 1 / -1;
}

.pdf-label {
  display: block;
  font-size: 8pt;
  font-weight: bold;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.25rem;
}

.pdf-value {
  display: block;
  margin: 0;
  font-size: 10pt;
  color: #000;
  font-weight: 500;
  line-height: 1.4;
  word-wrap: break-word;
}

.pdf-value--large {
  font-size: 14pt;
  font-weight: bold;
}

/* Footer */
.pdf-footer {
  margin-top: 2rem;
  padding: 1rem 2rem;
  border-top: 1px solid #000;
  text-align: center;
  font-size: 8pt;
  color: #666;
}

.pdf-footer__text {
  margin: 0.25rem 0;
}

/* Print Media Query */
@media print {
  .pdf-document {
    max-width: 100%;
    margin: 0;
    padding: 0;
    background: white;
  }

  .pdf-header,
  .pdf-section,
  .pdf-footer {
    page-break-inside: avoid;
  }

  /* Ensure no extra spacing in print */
  body {
    margin: 0;
    padding: 0;
  }

  .pdf-header {
    padding: 12.7mm 12.7mm;
  }

  .pdf-section {
    margin: 10mm 12.7mm;
  }

  .pdf-footer {
    margin-top: 10mm;
    padding: 8mm 12.7mm;
  }
}
</style>
