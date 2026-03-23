<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { getCurrentUser } from '@/services/auth'

const route = useRoute()
const currentUser = computed(() => getCurrentUser() || {})
const normalizedRole = computed(() =>
  String(currentUser.value?.role || '')
    .trim()
    .toLowerCase(),
)

function matchesSection(path, patterns) {
  return patterns.some((pattern) => path.startsWith(pattern))
}

const brandConfig = computed(() => {
  const path = route.path
  const role = normalizedRole.value

  if (role === 'adminenglish' || role === 'teacher-english') {
    return {
      label: 'English',
      className: 'brand-header__line--english',
    }
  }

  if (role === 'adminpreschool' || role === 'teacher-preschool') {
    return {
      label: 'Preschool',
      className: 'brand-header__line--preschool',
    }
  }

  if (role === 'adminscholaship' || role === 'teacher-scholarship') {
    return {
      label: 'Scholarship',
      className: 'brand-header__line--scholarship',
    }
  }

  if (role === 'adminsport' || role === 'coach') {
    return {
      label: 'EduSportPro',
      className: 'brand-header__line--sport-pro',
    }
  }

  if (
    matchesSection(path, [
      '/module/english-admin/dashboard',
      '/module/english-admin/teacher',
      '/dashboard/english-admin',
      '/dashboard/english-admin/teacher',
      '/dashboard/teacher-english',
      '/dashboard/english-teacher',
      '/dashboard/teachers/english',
    ])
  ) {
    return {
      label: 'English',
      className: 'brand-header__line--english',
    }
  }

  if (
    matchesSection(path, [
      '/module/preschool-admin/dashboard',
      '/dashboard/preschool-admin',
      '/dashboard/preschool-admin/teacher',
      '/dashboard/teacher-preschool',
      '/dashboard/preschool-teacher',
      '/dashboard/teachers/preschool',
    ])
  ) {
    return {
      label: 'Preschool',
      className: 'brand-header__line--preschool',
    }
  }

  if (
    matchesSection(path, [
      '/module/scholarship-admin/dashboard',
      '/dashboard/scholarship-admin',
      '/dashboard/scholarship-admin/teacher',
      '/dashboard/teacher-scholarship',
      '/dashboard/scholarship-teacher',
      '/dashboard/teachers/scholarship',
    ])
  ) {
    return {
      label: 'Scholarship',
      className: 'brand-header__line--scholarship',
    }
  }

  if (
    matchesSection(path, [
      '/module/sport-admin/dashboard',
      '/module/sport-admin/coach',
      '/dashboard/sport-admin',
      '/dashboard/sport-admin/coach',
      '/dashboard/coach',
      '/dashboard/sport-coach',
      '/dashboard/teachers/coach',
    ])
  ) {
    return {
      label: 'EduSportPro',
      className: 'brand-header__line--sport-pro',
    }
  }

  return {
    label: 'HFCCF Portal',
    className: 'brand-header__line--default',
  }
})
</script>

<template>
  <div class="brand-header">
    <div class="brand-header__logo">
      <div class="brand-header__icon">
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="white" />
          <path
            d="M2 17L12 22L22 17"
            stroke="white"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M2 12L12 17L22 12"
            stroke="white"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </div>
      <div class="brand-header__title">
        <span class="brand-header__eyebrow">HFCCF</span>
        <span class="brand-header__line" :class="brandConfig.className">{{ brandConfig.label }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.brand-header {
  padding: 0.15rem 0 0.3rem;
}

.brand-header__logo {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  padding: 0.8rem 0.85rem;
  border: 1px solid #dce5ee;
  border-radius: 1.1rem;
  background:
    radial-gradient(circle at top right, rgba(14, 165, 233, 0.1), transparent 40%),
    linear-gradient(180deg, #ffffff 0%, #f8fbff 100%);
  box-shadow: 0 14px 28px -24px rgba(15, 23, 42, 0.18);
}

.brand-header__icon {
  width: 42px;
  height: 42px;
  background: linear-gradient(145deg, #1cb6ef 0%, #0b9ad6 58%, #0672a5 100%);
  border-radius: 0.95rem;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  border: 1px solid rgba(255, 255, 255, 0.22);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.25),
    0 12px 22px -18px rgba(2, 132, 199, 0.55);
  flex-shrink: 0;
}

.brand-header__icon svg {
  width: 100%;
  height: 100%;
}

.brand-header__title {
  display: flex;
  flex-direction: column;
  gap: 0.38rem;
  min-width: 0;
  line-height: 1;
}

.brand-header__eyebrow {
  color: #64748b;
  font-size: 0.64rem;
  font-weight: 900;
  letter-spacing: 0.22em;
  text-transform: uppercase;
}

.brand-header__line {
  display: inline-flex;
  align-items: center;
  width: fit-content;
  max-width: 100%;
  min-height: 1.9rem;
  border-radius: 999px;
  padding: 0.38rem 0.7rem;
  border: 1px solid transparent;
  font-size: 0.78rem;
  font-weight: 900;
  letter-spacing: -0.025em;
  white-space: nowrap;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.45);
}

.brand-header__line--default {
  color: #0f172a;
  background: linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%);
  border-color: #dbe4ee;
}

.brand-header__line--english {
  color: #075985;
  background: linear-gradient(180deg, #e0f2fe 0%, #dbeafe 100%);
  border-color: #93c5fd;
}

.brand-header__line--preschool {
  color: #3f6212;
  background: linear-gradient(180deg, #ecfccb 0%, #dcfce7 100%);
  border-color: #bef264;
}

.brand-header__line--scholarship {
  color: #92400e;
  background: linear-gradient(180deg, #fef3c7 0%, #fde68a 100%);
  border-color: #fbbf24;
}

.brand-header__line--sport-pro {
  color: #991b1b;
  background: linear-gradient(180deg, #fee2e2 0%, #fecdd3 100%);
  border-color: #fda4af;
}
</style>

