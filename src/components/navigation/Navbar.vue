<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import Select from 'primevue/select'
import Button from 'primevue/button'
import Aavtar from '@/components/navigation/Aavtar.vue'
import Calendar from '@/assets/icons/Calendar.vue'
import Notification from '@/assets/icons/Notification.vue'

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

const isKh = computed(() => locale.value === 'kh')

const localeOptions = [
  { label: 'EN', value: 'en' },
  { label: 'KH', value: 'kh' },
]

function onToggleSidebar() {
  emit('toggle-sidebar')
}
</script>

<template>
  <nav class="navbar">
    <div class="navbar-left">
      <Button
        type="button"
        icon="pi pi-bars"
        severity="secondary"
        text
        rounded
        class="menu-btn !flex lg:!hidden"
        aria-label="Open sidebar"
        @click="onToggleSidebar"
      />

      <div class="brand" :class="{ 'brand--kh': isKh, 'brand--en': !isKh }">
        <img src="@/assets/images/logo.jpg" alt="HFCCF logo" class="brand-logo" />
        <div class="brand-copy" :class="{ 'brand-copy--kh': isKh, 'brand-copy--en': !isKh }">
          <span class="brand-text">{{ t('nav.brand.orgTop') }}</span>
          <span class="brand-subtext">{{ t('nav.brand.orgBottom') }}</span>
        </div>
      </div>
    </div>

    <div class="navbar-actions">
      <Button
        type="button"
        severity="secondary"
        text
        rounded
        class="icon-btn"
        aria-label="Calendar"
      >
        <template #icon>
          <Calendar :size="18" />
        </template>
      </Button>

      <Button
        type="button"
        severity="secondary"
        text
        rounded
        class="icon-btn icon-btn--notification"
        :aria-label="t('common.notifications')"
      >
        <template #icon>
          <div class="relative flex items-center justify-center">
            <Notification :size="18" />
            <span class="icon-badge">4</span>
          </div>
        </template>
      </Button>

      <Select
        v-model="currentLocale"
        :options="localeOptions"
        option-label="label"
        option-value="value"
        class="locale-switcher"
        aria-label="Language Switcher"
      />

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

:deep(.menu-btn.p-button) {
  border: 1px solid #d9e2ec;
  background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
  color: #334155;
  width: 38px;
  height: 38px;
}

:deep(.menu-btn.p-button:hover) {
  border-color: var(--hope-cyan);
  color: #0c4a6e;
  background: #f1f5f9;
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
  font-family:
    'Noto Sans Khmer', 'Khmer OS Siemreap', 'Khmer OS Battambang', 'Leelawadee UI', sans-serif;
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

:deep(.icon-btn.p-button) {
  width: 36px;
  height: 36px;
  border: 1px solid #dbe3ec;
  background: #ffffff;
  color: #475569;
}

:deep(.icon-btn.p-button:hover) {
  border-color: var(--hope-cyan);
  color: #0c4a6e;
  background: #f8fafc;
}

:deep(.icon-btn--notification.p-button:hover) {
  border-color: #ed1c24;
  color: #991b1b;
}

.icon-badge {
  position: absolute;
  top: -8px;
  right: -8px;
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

:deep(.locale-switcher.p-select) {
  border-radius: 999px;
  background: #ffffff;
  border-color: #d1d5db;
}

:deep(.locale-switcher.p-select .p-select-label) {
  padding: 0.3rem 0.65rem;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.03em;
  color: #0f172a;
}

.navbar * {
  -webkit-app-region: no-drag;
  app-region: no-drag;
}

@media (max-width: 768px) {
  .navbar-actions {
    gap: 0.45rem;
  }

  :deep(.icon-btn.p-button) {
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

  :deep(.icon-btn.p-button) {
    width: 32px;
    height: 32px;
  }
}
</style>





