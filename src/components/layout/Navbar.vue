<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import Aavtar from '@/components/ui/Aavtar.vue'
import Calendar from '@/components/icons/Calendar.vue'
import Notification from '@/components/icons/Notification.vue'

defineOptions({
  name: 'MainNavbar',
})

const emit = defineEmits(['toggle-sidebar'])
const { t, locale } = useI18n()

const currentLocale = computed({
  get: () => locale.value,
  set: (value) => {
    // Constrain locale values and persist selection across reloads.
    const next = value === 'kh' ? 'kh' : 'en'
    locale.value = next
    localStorage.setItem('locale', next)
  },
})

const brandCopy = computed(() =>
  locale.value === 'kh'
    ? {
        orgTop: 'អង្គការមូលនិធិក្តីសង្ឃឹម',
        orgBottom: 'នៃកុមារកម្ពុជា',
      }
    : {
        orgTop: "Organization for Children's",
        orgBottom: 'Hope Foundation of Cambodia',
      },
)
const isKh = computed(() => locale.value === 'kh')

function onToggleSidebar() {
  emit('toggle-sidebar')
}
</script>

<template>
  <nav class="navbar">
    <div class="navbar-left">
      <button type="button" class="menu-btn" aria-label="Open sidebar" @click="onToggleSidebar">
        <svg class="menu-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      <div class="brand" :class="{ 'brand--kh': isKh, 'brand--en': !isKh }">
        <img src="@/assets/images/logo.jpg" alt="HFCCF logo" class="brand-logo" />
        <div class="brand-copy" :class="{ 'brand-copy--kh': isKh, 'brand-copy--en': !isKh }">
          <span class="brand-text">{{ brandCopy.orgTop }}</span>
          <span class="brand-subtext">{{ brandCopy.orgBottom }}</span>
        </div>
      </div>
    </div>

    <div class="navbar-actions">
      <button type="button" class="icon-btn" aria-label="Calendar">
        <Calendar :size="18" />
      </button>

      <button type="button" class="icon-btn icon-btn--notification" :aria-label="t('common.notifications')">
        <Notification :size="18" />
        <span class="icon-badge">4</span>
      </button>

      <label class="locale-switcher">
        <span class="sr-only">{{ t('app.language') }}</span>
        <select v-model="currentLocale">
          <option value="en">EN</option>
          <option value="kh">KH</option>
        </select>
      </label>

      <Aavtar name="HFCCF User" size="sm" status="online" />
    </div>
  </nav>
</template>

<style scoped>
.navbar {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.15rem 0;
  -webkit-app-region: no-drag;
  app-region: no-drag;
}

.navbar-left {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  min-width: 0;
}

.menu-btn {
  display: none;
  border: 1px solid #d9e2ec;
  background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
  color: #334155;
  border-radius: 0.65rem;
  width: 38px;
  height: 38px;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.menu-btn:hover {
  border-color: #00aeef;
  color: #0c4a6e;
}

.menu-btn:focus-visible {
  outline: 2px solid #7dd3fc;
  outline-offset: 2px;
}

.menu-icon {
  width: 1.25rem;
  height: 1.25rem;
}

.brand {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  min-width: 0;
}

.brand-logo {
  width: 72px;
  height: 36px;
  object-fit: contain;
  flex-shrink: 0;
}

.brand-copy {
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-width: 0;
}

.brand-text {
  font-size: 1.08rem;
  font-weight: 800;
  letter-spacing: 0.01em;
  line-height: 1.1;
  white-space: nowrap;
}

.brand-subtext {
  font-size: 0.82rem;
  color: #64748b;
  line-height: 1.1;
  white-space: nowrap;
}

.brand--en .brand-copy {
  transform: translateY(1px);
}

.brand-copy--en .brand-text {
  color: #0f172a;
}

.brand-copy--en .brand-subtext {
  color: #475569;
}

.brand--kh .brand-copy {
  transform: translateY(0);
}

.brand-copy--kh .brand-text,
.brand-copy--kh .brand-subtext {
  font-family: 'Noto Sans Khmer', 'Khmer OS Siemreap', 'Khmer OS Battambang', 'Leelawadee UI', sans-serif;
  letter-spacing: 0;
  white-space: normal;
}

.brand-copy--kh .brand-text {
  font-size: 0.95rem;
  line-height: 1.25;
  font-weight: 700;
  color: #0b3f58;
}

.brand-copy--kh .brand-subtext {
  font-size: 0.82rem;
  line-height: 1.2;
  color: #1d6c8f;
}

.navbar-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-shrink: 0;
}

.icon-btn {
  position: relative;
  width: 36px;
  height: 36px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #dbe3ec;
  border-radius: 10px;
  background: #ffffff;
  color: #475569;
  transition: all 0.2s ease;
}

.icon-btn:hover {
  border-color: #00aeef;
  color: #0c4a6e;
}

.icon-btn--notification:hover {
  border-color: #ed1c24;
  color: #991b1b;
}

.icon-badge {
  position: absolute;
  top: -4px;
  right: -4px;
  min-width: 16px;
  height: 16px;
  padding: 0 4px;
  border-radius: 999px;
  background: #ed1c24;
  color: #ffffff;
  border: 2px solid #ffffff;
  font-size: 0.62rem;
  font-weight: 700;
  line-height: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.locale-switcher {
  display: inline-flex;
  align-items: center;
}

.locale-switcher select {
  border: 1px solid #d1d5db;
  border-radius: 999px;
  padding: 0.3rem 0.65rem;
  background: #ffffff;
  color: #0f172a;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.03em;
}

.locale-switcher select:focus-visible {
  outline: 2px solid #7dd3fc;
  outline-offset: 2px;
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

.navbar * {
  -webkit-app-region: no-drag;
  app-region: no-drag;
}

@media (max-width: 768px) {
  .navbar-actions {
    gap: 0.45rem;
  }

  .icon-btn {
    width: 34px;
    height: 34px;
  }
}

@media (max-width: 540px) {
  .brand-logo {
    width: 64px;
    height: 32px;
  }

  .brand-subtext {
    display: none;
  }

  .brand-copy--kh .brand-subtext {
    display: block;
    font-size: 0.74rem;
  }

  .navbar-actions {
    gap: 0.35rem;
  }

  .locale-switcher select {
    padding: 0.28rem 0.5rem;
  }
}

@media (max-width: 420px) {
  .brand-logo {
    width: 56px;
    height: 28px;
  }

  .brand-text {
    display: none;
  }

  .brand-copy--kh .brand-text {
    display: block;
    font-size: 0.82rem;
  }

  .brand-copy--kh .brand-subtext {
    display: none;
  }

  .icon-btn {
    width: 32px;
    height: 32px;
  }
}
</style>
