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
  <div class="pt-[0.15rem] pb-[0.3rem]">
    <div
      class="flex items-center gap-3 rounded-[1.1rem] border border-surface-200 bg-[radial-gradient(circle_at_top_right,rgba(14,165,233,0.1),transparent_40%),linear-gradient(180deg,#ffffff_0%,#f8fbff_100%)] px-[0.85rem] py-[0.8rem] shadow-[0_14px_28px_-24px_rgba(15,23,42,0.18)]"
    >
      <div
        class="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-[0.95rem] border border-white/20 bg-[linear-gradient(145deg,#1cb6ef_0%,#0b9ad6_58%,#0672a5_100%)] p-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_12px_22px_-18px_rgba(2,132,199,0.55)]"
      >
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
      <div class="flex min-w-0 flex-col gap-[0.38rem] leading-none">
        <span class="text-[0.64rem] font-black tracking-[0.22em] text-surface-500 uppercase">HFCCF</span>
        <span
          class="inline-flex min-h-[1.9rem] w-fit max-w-full items-center whitespace-nowrap rounded-full border px-[0.7rem] py-[0.38rem] text-[0.78rem] font-black tracking-[-0.025em] shadow-[inset_0_1px_0_rgba(255,255,255,0.45)]"
          :class="brandConfig.className"
        >{{ brandConfig.label }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.brand-header svg {
  width: 100%;
  height: 100%;
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
