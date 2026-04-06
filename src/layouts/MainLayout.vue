<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Drawer from 'primevue/drawer'
import Card from 'primevue/card'
import BlockUI from 'primevue/blockui'
import Navbar from '@/components/navigation/Navbar.vue'
import Sidebar from '@/components/navigation/Sidebar.vue'
import Loading from '@/components/feedback/Loading.vue'
import { logout as clearAuthSession } from '@/services/auth'

const props = defineProps({
  mobileBreakpoint: {
    type: Number,
    default: 768,
  },
  closeOnNavigation: {
    type: Boolean,
    default: true,
  },
  closeOnContentClick: {
    type: Boolean,
    default: true,
  },
})

const route = useRoute()
const router = useRouter()
const isSidebarOpen = ref(false)
const isMobileViewport = ref(false)
const isDesktopSidebarVisible = ref(true)
const DESKTOP_SIDEBAR_STORAGE_KEY = 'main-layout-desktop-sidebar-visible'
const DESKTOP_SIDEBAR_EXPANDED_WIDTH = 268
const DESKTOP_SIDEBAR_COLLAPSED_WIDTH = 84
const MOBILE_SWIPE_EDGE_PX = 28
const MOBILE_SWIPE_OPEN_THRESHOLD_PX = 64
let mediaQueryList = null
let previousBodyOverflow = ''
let swipeStartX = 0
let swipeStartY = 0
let isTrackingMobileOpenSwipe = false

const desktopSidebarWidth = computed(
  () =>
    `${isDesktopSidebarVisible.value ? DESKTOP_SIDEBAR_EXPANDED_WIDTH : DESKTOP_SIDEBAR_COLLAPSED_WIDTH}px`,
)

const desktopContentPaddingLeft = computed(() => {
  if (isMobileViewport.value) return '0px'
  return desktopSidebarWidth.value
})

function openSidebar() {
  isSidebarOpen.value = true
}

function closeSidebar() {
  isSidebarOpen.value = false
}

function toggleSidebar() {
  if (isMobileViewport.value) {
    isSidebarOpen.value = !isSidebarOpen.value
    return
  }

  isDesktopSidebarVisible.value = !isDesktopSidebarVisible.value
}

function loadDesktopSidebarPreference() {
  if (typeof window === 'undefined') return
  const saved = window.localStorage.getItem(DESKTOP_SIDEBAR_STORAGE_KEY)
  if (saved === null) return
  isDesktopSidebarVisible.value = saved !== 'false'
}

function saveDesktopSidebarPreference(value) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(DESKTOP_SIDEBAR_STORAGE_KEY, String(value))
}

function onContentClick() {
  if (isMobileViewport.value && props.closeOnContentClick && isSidebarOpen.value) {
    closeSidebar()
  }
}

async function onSidebarLogout() {
  clearAuthSession()
  closeSidebar()
  if (route.name !== 'login') {
    await router.push({ name: 'login' })
  }
}

function onKeydown(event) {
  if (event.key === 'Escape' && isSidebarOpen.value) {
    closeSidebar()
  }
}

function onTouchStart(event) {
  if (!isMobileViewport.value || isSidebarOpen.value) return
  const touch = event.touches?.[0]
  if (!touch) return
  if (touch.clientX > MOBILE_SWIPE_EDGE_PX) return

  swipeStartX = touch.clientX
  swipeStartY = touch.clientY
  isTrackingMobileOpenSwipe = true
}

function onTouchEnd(event) {
  if (!isTrackingMobileOpenSwipe || !isMobileViewport.value || isSidebarOpen.value) {
    isTrackingMobileOpenSwipe = false
    return
  }

  const touch = event.changedTouches?.[0]
  if (!touch) {
    isTrackingMobileOpenSwipe = false
    return
  }

  const deltaX = touch.clientX - swipeStartX
  const deltaY = Math.abs(touch.clientY - swipeStartY)
  if (deltaX >= MOBILE_SWIPE_OPEN_THRESHOLD_PX && deltaX > deltaY) {
    openSidebar()
  }

  isTrackingMobileOpenSwipe = false
}

function syncViewport() {
  if (typeof window === 'undefined') return
  isMobileViewport.value = window.innerWidth <= props.mobileBreakpoint
}

function lockBodyScroll() {
  if (typeof document === 'undefined') return
  if (!isMobileViewport.value) return

  if (isSidebarOpen.value) {
    previousBodyOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return
  }

  document.body.style.overflow = previousBodyOverflow
}

watch(
  () => route.fullPath,
  () => {
    if (props.closeOnNavigation) {
      closeSidebar()
    }
  },
)

watch(isSidebarOpen, () => {
  lockBodyScroll()
})

watch(isDesktopSidebarVisible, (value) => {
  saveDesktopSidebarPreference(value)
})

watch(isMobileViewport, (isMobile) => {
  if (!isMobile) {
    if (typeof document !== 'undefined') {
      document.body.style.overflow = previousBodyOverflow
    }
    isSidebarOpen.value = false
    return
  }

  lockBodyScroll()
})

onMounted(() => {
  loadDesktopSidebarPreference()
  syncViewport()
  document.addEventListener('keydown', onKeydown)
  document.addEventListener('touchstart', onTouchStart, { passive: true })
  document.addEventListener('touchend', onTouchEnd, { passive: true })

  if (typeof window !== 'undefined') {
    mediaQueryList = window.matchMedia(`(max-width: ${props.mobileBreakpoint}px)`)

    if (typeof mediaQueryList.addEventListener === 'function') {
      mediaQueryList.addEventListener('change', syncViewport)
    } else {
      mediaQueryList.addListener(syncViewport)
    }
  }
})

onBeforeUnmount(() => {
  document.removeEventListener('keydown', onKeydown)
  document.removeEventListener('touchstart', onTouchStart)
  document.removeEventListener('touchend', onTouchEnd)

  if (mediaQueryList) {
    if (typeof mediaQueryList.removeEventListener === 'function') {
      mediaQueryList.removeEventListener('change', syncViewport)
    } else {
      mediaQueryList.removeListener(syncViewport)
    }
  }

  if (typeof document !== 'undefined') {
    document.body.style.overflow = previousBodyOverflow
  }
})
</script>

<template>
  <div
    class="min-h-screen w-full overflow-x-hidden bg-[var(--color-surface)] pt-16 max-[768px]:pt-[60px] max-[600px]:pt-14 max-[480px]:pt-[52px] max-[420px]:pt-[50px]"
  >
    <header
      class="main-layout-header fixed inset-x-0 top-0 z-[80] flex h-16 w-full items-center border-b border-slate-100 bg-white/95 px-4 shadow-sm backdrop-blur transition-all max-[768px]:h-[60px] max-[768px]:px-3 max-[600px]:h-14 max-[600px]:px-2.5 max-[480px]:h-[52px] max-[480px]:px-2 max-[420px]:h-[50px] max-[420px]:px-1.5"
    >
      <slot name="navbar" :toggle-sidebar="toggleSidebar" :is-sidebar-open="isSidebarOpen">
        <Navbar @toggle-sidebar="toggleSidebar" />
      </slot>
    </header>

    <aside
      id="main-layout-sidebar-desktop"
      class="fixed top-16 left-0 z-[70] hidden h-[calc(100vh-64px)] overflow-y-auto border-r border-slate-100 bg-white transition-[width] duration-300 ease-in-out box-border min-[769px]:block"
      :style="{ width: desktopSidebarWidth }"
      :aria-hidden="false"
    >
      <slot
        name="sidebar"
        :close-sidebar="closeSidebar"
        :open-sidebar="openSidebar"
        :toggle-sidebar="toggleSidebar"
        :is-desktop-collapsed="!isDesktopSidebarVisible"
        :is-sidebar-open="isSidebarOpen"
      >
        <Sidebar
          :collapsed="!isDesktopSidebarVisible"
          @toggle-sidebar="toggleSidebar"
          @logout="onSidebarLogout"
        />
      </slot>
    </aside>

    <button
      v-if="isMobileViewport && !isSidebarOpen"
      type="button"
      class="fixed left-0 z-[65] flex h-14 w-5 items-center justify-center rounded-r-xl border border-l-0 border-slate-200 bg-white/95 text-slate-500 shadow-sm backdrop-blur transition-all hover:w-6 hover:text-slate-800 min-[769px]:hidden top-[calc(60px+38vh)] max-[600px]:top-[calc(56px+38vh)] max-[480px]:top-[calc(52px+38vh)] max-[420px]:top-[calc(50px+38vh)]"
      aria-label="Open sidebar"
      @click="openSidebar"
    >
      <i class="pi pi-angle-right text-sm" />
    </button>

    <Drawer
      v-model:visible="isSidebarOpen"
      position="left"
      :show-close-icon="false"
      :modal="true"
      class="main-layout-drawer min-[769px]:hidden"
      :pt="{
        root: { class: 'w-[min(85vw,320px)] mt-[60px] max-[600px]:mt-14 max-[480px]:mt-[52px] max-[420px]:mt-[50px]' },
        content: { class: 'p-0' },
        mask: { class: 'min-[769px]:hidden' },
      }"
    >
      <slot
        name="sidebar"
        :close-sidebar="closeSidebar"
        :open-sidebar="openSidebar"
        :toggle-sidebar="toggleSidebar"
        :is-desktop-collapsed="false"
        :is-sidebar-open="isSidebarOpen"
      >
        <Sidebar :collapsed="false" @toggle-sidebar="toggleSidebar" @logout="onSidebarLogout" />
      </slot>
    </Drawer>

    <div
      class="min-h-screen w-full transition-[padding] duration-300 ease-in-out"
      :style="{ paddingLeft: desktopContentPaddingLeft }"
    >
      <BlockUI :blocked="false">
        <main
          class="p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] transition-all max-[600px]:p-3 max-[480px]:p-2.5 max-[420px]:p-2"
          @click="onContentClick"
        >
          <slot>
            <Card class="main-layout-card">
              <template #content>
                <Loading label="Loading content..." size="md" />
              </template>
            </Card>
          </slot>
        </main>
      </BlockUI>
    </div>
  </div>
</template>

<style scoped>
.main-layout-header {
  -webkit-app-region: no-drag;
  app-region: no-drag;
}

.main-layout-header * {
  -webkit-app-region: no-drag;
  app-region: no-drag;
}

:deep(.main-layout-card.p-card) {
  border-radius: 1rem;
  border: 1px solid #e2e8f0;
}
</style>

