<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import SidebarBrand from '@/components/ui/SidebarBrandHeader.vue'
import LogoutButton from '@/components/ui/LogoutButton.vue'
import SidebarLink from '@/components/layout/SidebarLink.vue'
import { useLanguage } from '@/composables/useLanguage'
import sidebarNavData from '@/data/sidebar-nav.json'
import HomeIcon from '@/components/icons/Home.vue'
import InfoIcon from '@/components/icons/Info.vue'
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
  info: InfoIcon,
}

const currentPath = computed(() => route.path)
const currentUser = computed(() => getCurrentUser() || {})
const canSeeUsersSection = computed(() => isSuperAdmin(currentUser.value))
const isEnglishAdmin = computed(() => String(currentUser.value?.role || '').trim().toLowerCase() === 'adminenglish')
const isPreschoolAdmin = computed(() => String(currentUser.value?.role || '').trim().toLowerCase() === 'adminpreschool')
const isScholarshipAdmin = computed(() => String(currentUser.value?.role || '').trim().toLowerCase() === 'adminscholaship')
const isSportAdmin = computed(() => String(currentUser.value?.role || '').trim().toLowerCase() === 'adminsport')
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
    .map((item) => ({
      ...item,
      to:
        item.to === '/users' && !canSeeUsersSection.value
          ? isEnglishAdmin.value
            ? '/dashboard/english-admin/users'
            : isPreschoolAdmin.value
              ? '/dashboard/preschool-admin/users'
              : isScholarshipAdmin.value
                ? '/dashboard/scholarship-admin/users'
                : isSportAdmin.value
                  ? '/dashboard/sport-admin/users'
                  : item.to
          : item.to,
      label: t(item.labelKey),
      iconComponent: iconByName[item.icon] || null,
    })),
)

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
  <aside class="sidebar-shell">
    <nav class="flex h-full min-h-0 flex-col pb-2" aria-label="Main navigation">
      <div class="py-2 pb-4 sm:pb-6">
        <div class="mb-5 flex items-start justify-between" :class="{ 'justify-center': collapsed }">
          <slot v-if="!collapsed" name="header">
            <SidebarBrand />
          </slot>
          <button
            type="button"
            class="hidden h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-slate-100 p-1.5 text-slate-500 transition-all hover:bg-slate-200 hover:text-slate-900 min-[769px]:flex"
            aria-label="Toggle sidebar"
            @click="onToggleSidebar"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" class="h-full w-full">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      <div
        class="sidebar-scroll min-h-0 flex-1 overflow-y-auto overscroll-contain pr-1 pb-3"
      >
        <div class="sidebar-section">
          <p v-if="!collapsed" class="sidebar-section__label">Navigation</p>
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

      <div class="sidebar-footer mt-auto pt-4 sm:pt-5" :class="{ 'flex justify-center': collapsed }">
        <LogoutButton :collapsed="collapsed" @logout="onLogout" />
      </div>
    </nav>
  </aside>
</template>

<style scoped>
.sidebar-shell {
  height: 100%;
  background:
    radial-gradient(circle at top left, color-mix(in srgb, var(--color-base) 14%, transparent), transparent 28%),
    linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
  border-right: 1px solid #dbe1e8;
  padding: 0.9rem 0.8rem 0.8rem;
}

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

.sidebar-section {
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
}

.sidebar-section__label {
  margin: 0 0 0.35rem;
  padding: 0 0.55rem;
  color: #64748b;
  font-size: 0.68rem;
  font-weight: 800;
  letter-spacing: 0.18em;
  text-transform: uppercase;
}

.sidebar-nav-link {
  display: flex;
  align-items: center;
  min-height: 2.8rem;
  font-weight: 700;
  border: 1px solid transparent;
}

.sidebar-nav-link--active {
  background: linear-gradient(
    180deg,
    color-mix(in srgb, var(--color-base) 10%, white) 0%,
    color-mix(in srgb, var(--color-base) 18%, white) 100%
  );
  color: #0f172a;
  border-color: color-mix(in srgb, var(--color-base) 35%, white);
  box-shadow: 0 12px 24px -22px color-mix(in srgb, var(--color-base) 60%, transparent);
}

.sidebar-footer {
  margin-top: 1rem;
  border-top: 1px solid rgba(148, 163, 184, 0.18);
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.35) 0%, rgba(248, 250, 252, 0.85) 100%);
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





