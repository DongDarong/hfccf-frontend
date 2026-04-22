<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import PrimeButton from 'primevue/button'
import SidebarBrand from '@/components/navigation/SidebarBrandHeader.vue'
import LogoutButton from '@/components/buttons/LogoutButton.vue'
import SidebarLink from '@/components/navigation/SidebarLink.vue'
import { useLanguage } from '@/composables/useLanguage'
import sidebarNavData from '@/data/sidebar-nav.json'
import HomeIcon from '@/assets/icons/Home.vue'
import UsersIcon from '@/assets/icons/Users.vue'
import { getCurrentUser, isSuperAdmin } from '@/services/auth'

defineOptions({
  name: 'MainSidebar',
})

const emit = defineEmits(['toggle-sidebar', 'logout'])

defineProps({
  collapsed: {
    type: Boolean,
    default: false,
  },
})

const route = useRoute()
const { t } = useLanguage()
// Map icon keys from JSON config to concrete Vue components.
const iconByName = {
  home: HomeIcon,
  info: UsersIcon,
}

const currentPath = computed(() => route.path)
const currentUser = computed(() => getCurrentUser() || {})
const canSeeUsersSection = computed(() => isSuperAdmin(currentUser.value))
const isEnglishAdmin = computed(
  () =>
    String(currentUser.value?.role || '')
      .trim()
      .toLowerCase() === 'adminenglish',
)
const isPreschoolAdmin = computed(
  () =>
    String(currentUser.value?.role || '')
      .trim()
      .toLowerCase() === 'adminpreschool',
)
const isScholarshipAdmin = computed(
  () =>
    String(currentUser.value?.role || '')
      .trim()
      .toLowerCase() === 'adminscholaship',
)
const isSportAdmin = computed(
  () =>
    String(currentUser.value?.role || '')
      .trim()
      .toLowerCase() === 'adminsport',
)
const navItems = computed(() =>
  // Resolve labels at render time so locale changes update menu text immediately.
  sidebarNavData
    .filter((item) => {
      if (item.to === '/users') {
        return (
          canSeeUsersSection.value ||
          isEnglishAdmin.value ||
          isPreschoolAdmin.value ||
          isScholarshipAdmin.value ||
          isSportAdmin.value
        )
      }
      return true
    })
    .map((item) => {
      const baseTo = item.to === '/dashboard' ? '/module/dashboard' : item.to
      let resolvedTo = baseTo

      if (item.to === '/users') {
        if (canSeeUsersSection.value) {
          resolvedTo = '/module/super-admin/users/manage'
        } else if (isEnglishAdmin.value) {
          resolvedTo = '/module/english-admin/users'
        } else if (isPreschoolAdmin.value) {
          resolvedTo = '/module/preschool-admin/users'
        } else if (isScholarshipAdmin.value) {
          resolvedTo = '/module/scholarship-admin/users'
        } else if (isSportAdmin.value) {
          resolvedTo = '/module/sport-admin/users'
        }
      }

      return {
        ...item,
        to: resolvedTo,
        label: t(item.labelKey),
        iconComponent: iconByName[item.icon] || null,
      }
    }),
)
const togglePt = {
  root: {
    class: [
      '!border',
      '!border-surface-200',
      '!bg-white',
      '!text-surface-500',
      '!shadow-[0_10px_22px_-22px_rgba(15,23,42,0.14)]',
      'transition-all',
      'duration-200',
      'hover:enabled:!border-brand-300',
      'hover:enabled:!bg-slate-100',
      'hover:enabled:!text-sky-800',
      'focus-visible:!outline-none',
      'focus-visible:!shadow-focus',
    ],
  },
}

function isActive(path) {
  return currentPath.value === path
}

function onToggleSidebar() {
  emit('toggle-sidebar')
}

function onLogout() {
  emit('logout')
}
</script>

<template>
  <aside class="h-full border-r border-surface-200 bg-[radial-gradient(circle_at_top_left,color-mix(in_srgb,var(--color-base)_10%,transparent),transparent_26%),linear-gradient(180deg,#ffffff_0%,#f8fbff_100%)] px-[0.8rem] pt-[0.95rem] pb-[0.8rem]">
    <nav class="flex h-full min-h-0 flex-col pb-2" aria-label="Main navigation">
      <div class="py-2 pb-4 sm:pb-5">
        <div class="mb-4 flex items-start justify-between" :class="{ 'justify-center': collapsed }">
          <div v-if="!collapsed" class="min-w-0 flex-1">
            <slot name="header">
              <SidebarBrand />
            </slot>
          </div>
          <PrimeButton
            type="button"
            severity="secondary"
            text
            rounded
            class="sidebar-toggle-btn hidden h-8 w-8 min-h-0 !p-1.5 min-[769px]:flex"
            :pt="togglePt"
            aria-label="Toggle sidebar"
            @click="onToggleSidebar"
          >
            <template #icon>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" class="h-full w-full">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </template>
          </PrimeButton>
        </div>
      </div>

      <div class="sidebar-scroll min-h-0 flex-1 overflow-y-auto overscroll-contain pr-1 pb-3">
        <div class="flex flex-col gap-[0.38rem]">
          <p v-if="!collapsed" class="mb-[0.35rem] px-[0.6rem] text-[0.68rem] font-extrabold tracking-[0.18em] text-surface-500 uppercase">Navigation</p>
          <SidebarLink
            v-for="item in navItems"
            :key="item.to"
            :to="item.to"
            :icon="item.iconComponent"
            :collapsed="collapsed"
            class="sidebar-nav-link"
            :class="{ 'sidebar-nav-link--active': isActive(item.to) }"
          >
            <span v-if="!collapsed">{{ item.label }}</span>
            <span v-else class="sr-only">{{ item.label }}</span>
          </SidebarLink>
        </div>
      </div>

      <div
        class="mt-3 bg-[linear-gradient(180deg,rgba(255,255,255,0.4)_0%,rgba(248,250,252,0.92)_100%)] pt-1 sm:pt-2"
        :class="{ 'flex justify-center': collapsed }"
      >
        <LogoutButton :collapsed="collapsed" @logout="onLogout" />
      </div>
    </nav>
  </aside>
</template>

<style scoped>
.sidebar-scroll {
  scrollbar-width: thin;
  scrollbar-color: #cbd5e1 transparent;
}

.sidebar-scroll::-webkit-scrollbar {
  width: 6px;
}

.sidebar-scroll::-webkit-scrollbar-track {
  background: transparent;
}

.sidebar-scroll::-webkit-scrollbar-thumb {
  border-radius: 999px;
  background: #cbd5e1;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  border: 0;
}
</style>



