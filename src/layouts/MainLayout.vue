<script setup>
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import Navbar from '@/components/layout/Navbar.vue'
import Sidebar from '@/components/layout/Sidebar.vue'

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
const isSidebarOpen = ref(false)
const isMobileViewport = ref(false)
const isDesktopSidebarVisible = ref(true)
const DESKTOP_SIDEBAR_STORAGE_KEY = 'main-layout-desktop-sidebar-visible'
const MOBILE_SWIPE_EDGE_PX = 28
const MOBILE_SWIPE_OPEN_THRESHOLD_PX = 64
let mediaQueryList = null
let previousBodyOverflow = ''
let swipeStartX = 0
let swipeStartY = 0
let isTrackingMobileOpenSwipe = false

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

function onSidebarLogout() {
  closeSidebar()
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
  <div class="min-h-screen bg-[var(--color-surface)]">
    <header
      class="sticky top-0 h-16 bg-white/95 border-b border-slate-100 flex items-center px-4 shadow-sm backdrop-blur z-[80] transition-all
             max-[768px]:h-[60px] max-[768px]:px-3
             max-[600px]:h-14 max-[600px]:px-2.5
             max-[480px]:h-[52px] max-[480px]:px-2
             max-[420px]:h-[50px] max-[420px]:px-1.5"
    >
      <slot name="navbar" :toggle-sidebar="toggleSidebar" :is-sidebar-open="isSidebarOpen">
        <Navbar @toggle-sidebar="toggleSidebar" />
      </slot>
    </header>

    <aside
      id="main-layout-sidebar-desktop"
      class="fixed top-16 left-0 z-[70] hidden h-[calc(100vh-64px)] overflow-y-auto border-r border-slate-100 bg-white p-4 pb-[calc(0.75rem+env(safe-area-inset-bottom))] transition-[width] duration-300 ease-in-out min-[769px]:block"
      :class="isDesktopSidebarVisible ? 'w-[268px]' : 'w-[84px]'"
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
          @close="closeSidebar"
          @toggle-sidebar="toggleSidebar"
          @logout="onSidebarLogout"
        />
      </slot>
    </aside>

    <button
      type="button"
      class="fixed inset-0 top-[60px] z-[60] bg-black/25 opacity-0 pointer-events-none transition-opacity duration-300
             max-[600px]:top-14 max-[480px]:top-[52px] max-[420px]:top-[50px] min-[769px]:hidden"
      :class="{ 'opacity-100 pointer-events-auto': isSidebarOpen }"
      aria-label="Close sidebar"
      :aria-hidden="!isSidebarOpen"
      @click="closeSidebar"
    />

    <button
      v-if="isMobileViewport && !isSidebarOpen"
      type="button"
      class="fixed left-0 z-[65] flex h-14 w-5 items-center justify-center rounded-r-xl border border-l-0 border-slate-200 bg-white/95 text-slate-500 shadow-sm backdrop-blur transition-all hover:w-6 hover:text-slate-800 min-[769px]:hidden
             top-[calc(60px+38vh)] max-[600px]:top-[calc(56px+38vh)] max-[480px]:top-[calc(52px+38vh)] max-[420px]:top-[calc(50px+38vh)]"
      aria-label="Open sidebar"
      @click="openSidebar"
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" class="h-4 w-4">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
      </svg>
    </button>

    <aside
      id="main-layout-sidebar-mobile"
      class="fixed left-0 z-[70] h-[calc(100vh-60px)] w-[min(85vw,320px)] -translate-x-full overflow-y-auto border-r-0 bg-white p-4 pb-[calc(0.75rem+env(safe-area-inset-bottom))] shadow-xl transition-transform duration-300 ease-in-out
             top-[60px] max-[600px]:top-14 max-[600px]:h-[calc(100vh-56px)] max-[600px]:p-3
             max-[480px]:top-[52px] max-[480px]:h-[calc(100vh-52px)] max-[480px]:p-2.5
             max-[420px]:top-[50px] max-[420px]:h-[calc(100vh-50px)] max-[420px]:p-2
             min-[769px]:hidden"
      :class="{ 'translate-x-0': isSidebarOpen }"
      :aria-hidden="!isSidebarOpen && isMobileViewport"
    >
      <slot
        name="sidebar"
        :close-sidebar="closeSidebar"
        :open-sidebar="openSidebar"
        :toggle-sidebar="toggleSidebar"
        :is-desktop-collapsed="false"
        :is-sidebar-open="isSidebarOpen"
      >
        <Sidebar
          :collapsed="false"
          @close="closeSidebar"
          @toggle-sidebar="toggleSidebar"
          @logout="onSidebarLogout"
        />
      </slot>
    </aside>

    <div
      class="min-h-screen transition-[padding] duration-300 ease-in-out"
      :class="isDesktopSidebarVisible ? 'min-[769px]:pl-[268px]' : 'min-[769px]:pl-[84px]'"
    >
      <main
        class="p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] transition-all
               max-[600px]:p-3
               max-[480px]:p-2.5
               max-[420px]:p-2"
        @click="onContentClick"
      >
        <slot>
          <div class="text-[var(--color-text)] text-sm font-medium opacity-60">Main content</div>
        </slot>
      </main>
    </div>
  </div>
</template>
