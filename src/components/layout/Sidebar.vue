<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import SidebarBrand from '@/components/ui/SidebarBrandHeader.vue'
import LogoutButton from '@/components/ui/LogoutButton.vue'
import SidebarLink from '@/components/layout/SidebarLink.vue'
import { useLanguage } from '@/composables/useLanguage'

const emit = defineEmits(['close', 'toggle-sidebar', 'logout'])

defineProps({
  collapsed: {
    type: Boolean,
    default: false,
  },
})

const route = useRoute()
const { t } = useLanguage()

const currentPath = computed(() => route.path)
const navItems = computed(() => [
  { to: '/', label: t('nav.dashboard') },
  { to: '/about', label: t('nav.about') },
])

function isActive(path) {
  return currentPath.value === path
}

function onClose() {
  emit('close')
}

function onToggleSidebar() {
  emit('toggle-sidebar')
}

function handleLogout() {
  emit('logout')
  onClose()
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
        class="min-h-0 flex-1 space-y-8 overflow-y-auto overscroll-contain pr-1 pb-3 [scrollbar-width:thin] [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-slate-200"
      >
        <div class="space-y-2">
          <SidebarLink
            v-for="item in navItems"
            :key="item.to"
            :to="item.to"
            class="sidebar-nav-link"
            :class="{ 'sidebar-nav-link--active': isActive(item.to) }"
          >
            <span v-if="!collapsed">{{ item.label }}</span>
            <span v-else class="sr-only">{{ item.label }}</span>
          </SidebarLink>
        </div>
      </div>

      <div class="mt-auto border-t border-slate-100 bg-white/95 pt-4 sm:pt-5" :class="{ 'flex justify-center': collapsed }">
        <LogoutButton :collapsed="collapsed" @logout="handleLogout" />
      </div>
    </nav>
  </aside>
</template>

<style scoped>
.sidebar-shell {
  background: #ffffff;
  border-right: 1px solid #dbe1e8;
  padding: 0.75rem;
}

.sidebar-nav-link {
  display: flex;
  align-items: center;
  min-height: 2.5rem;
  font-weight: 600;
  border: 1px solid transparent;
}

.sidebar-nav-link--active {
  background: #ecfdf5;
  color: #065f46;
  border-color: #bbf7d0;
}
</style>
