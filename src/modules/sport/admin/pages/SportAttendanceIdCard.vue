<script setup>
import { computed, createApp, h, nextTick, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { toCanvas } from 'html-to-image'
import MainLayout from '@/layouts/MainLayout.vue'
import HeaderSection from '@/components/navigation/HeaderSection.vue'
import Button from '@/components/buttons/Button.vue'
import Select from 'primevue/select'
import { useLanguage } from '@/composables/useLanguage'
import { fetchSportTeams } from '@/modules/sport/services/api/sportTeamsApi'
import { fetchSportPlayers } from '@/modules/sport/services/api/sportPlayersApi'
import SportIdCardPreview from '@/modules/sport/admin/components/SportIdCardPreview.vue'
import SportIdCardBackPreview from '@/modules/sport/admin/components/SportIdCardBackPreview.vue'
import { buildBackQrDataUrl } from '@/modules/sport/admin/pages/sportIdCardBack'

defineOptions({ name: 'SportAdminAttendanceIdCardPage' })

const { t } = useLanguage()
const router = useRouter()

const teamOptions = ref([])
const players = ref([])
const selectedTeamId = ref('')
const selectedPlayerIds = ref([])
const selectedFormat = ref('pdf')
const selectedOrientation = ref('landscape')
const selectedSize = ref('standard')
const selectedLang = ref('en')
const selectedGapMm = ref(4)
const loadingTeams = ref(false)
const loadingPlayers = ref(false)
const generating = ref(false)

const LANG_OPTIONS = [
  { value: 'en', label: 'EN', desc: 'English' },
  { value: 'kh', label: 'ខ្មែរ', desc: 'Khmer' },
]

const FORMAT_OPTIONS = [
  { value: 'pdf', label: 'PDF', icon: 'pi-file-pdf', desc: 'Print-ready A4 sheet' },
  { value: 'png', label: 'PNG', icon: 'pi-image', desc: 'Transparent background' },
  { value: 'jpg', label: 'JPG', icon: 'pi-image', desc: 'Smaller file size' },
]

const ORIENT_OPTIONS = [
  { value: 'landscape', label: 'Landscape', icon: 'pi-stop', desc: 'Wider than tall' },
  { value: 'portrait', label: 'Portrait', icon: 'pi-tablet-phone', desc: 'Taller than wide' },
]

const CARD_SIZES = [
  {
    value: 'small',
    label: 'Small',
    icon: 'pi-minus-circle',
    landscape: { W: 70, H: 44 },
    portrait: { W: 44, H: 70 },
  },
  {
    value: 'standard',
    label: 'Standard',
    icon: 'pi-id-card',
    landscape: { W: 85.6, H: 54 },
    portrait: { W: 54, H: 85.6 },
  },
  {
    value: 'large',
    label: 'Large',
    icon: 'pi-plus-circle',
    landscape: { W: 100, H: 63 },
    portrait: { W: 63, H: 100 },
  },
]

const currentSizeConfig = computed(() => {
  const s = CARD_SIZES.find((s) => s.value === selectedSize.value) || CARD_SIZES[1]
  return s[selectedOrientation.value]
})

const allSelected = computed(() =>
  players.value.length > 0 && selectedPlayerIds.value.length === players.value.length,
)

function toggleSelectAll() {
  if (allSelected.value) selectedPlayerIds.value = []
  else selectedPlayerIds.value = players.value.map((p) => p.id)
}

function togglePlayer(id) {
  const idx = selectedPlayerIds.value.indexOf(id)
  if (idx === -1) selectedPlayerIds.value.push(id)
  else selectedPlayerIds.value.splice(idx, 1)
}

function getInitials(player) {
  return (player.fullName || player.name || '')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase() || '?'
}

function getSeasonYear() {
  const now = new Date()
  const y = now.getFullYear()
  return now.getMonth() >= 8 ? `${y}-${y + 1}` : `${y - 1}-${y}`
}

async function loadTeams() {
  loadingTeams.value = true
  try {
    const res = await fetchSportTeams({ page: 1, perPage: 100 })
    teamOptions.value = (res.items || []).map((t) => ({
      label: t.name || t.code || String(t.id),
      value: t.id,
      division: t.division || '',
    }))
  } catch {
    teamOptions.value = []
  } finally {
    loadingTeams.value = false
  }
}

async function loadPlayers() {
  if (!selectedTeamId.value) {
    players.value = []
    return
  }
  loadingPlayers.value = true
  selectedPlayerIds.value = []
  try {
    const res = await fetchSportPlayers({ page: 1, perPage: 200, teamId: selectedTeamId.value })
    players.value = res.items || []
  } catch {
    players.value = []
  } finally {
    loadingPlayers.value = false
  }
}

async function renderCardComponentToCanvas(component, props, widthPx) {
  const host = document.createElement('div')
  host.style.position = 'fixed'
  host.style.left = '-10000px'
  host.style.top = '0'
  host.style.width = `${widthPx}px`
  host.style.pointerEvents = 'none'
  host.style.opacity = '0'
  host.style.zIndex = '-1'
  document.body.appendChild(host)

  const app = createApp({
    render: () => h(component, props),
  })

  try {
    app.mount(host)
    await nextTick()

    const node = host.firstElementChild || host
    return await toCanvas(node, {
      backgroundColor: '#ffffff',
      cacheBust: true,
      pixelRatio: 1,
    })
  } finally {
    app.unmount()
    host.remove()
  }
}

async function loadStudentPhoto(avatarUrl) {
  if (!avatarUrl) throw new Error('no url')
  const res = await fetch(avatarUrl, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('hfccf-auth-token') || sessionStorage.getItem('hfccf-auth-token') || ''}`,
    },
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)

  const blob = await res.blob()
  const objectUrl = URL.createObjectURL(blob)

  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve({ img, objectUrl })
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl)
      reject(new Error('img load'))
    }
    img.src = objectUrl
  })
}

function imgToDataUrl(img) {
  const c = document.createElement('canvas')
  c.width = img.naturalWidth || 200
  c.height = img.naturalHeight || 200
  c.getContext('2d').drawImage(img, 0, 0)
  return c.toDataURL('image/jpeg', 0.85)
}

async function generateCards() {
  if (!selectedPlayerIds.value.length) return

  generating.value = true
  const blobUrls = []

  try {
    const chosen = players.value.filter((p) => selectedPlayerIds.value.includes(p.id))
    const teamObj = teamOptions.value.find((t) => t.value === selectedTeamId.value)
    const teamName = teamObj?.label || ''
    const division = teamObj?.division || ''
    const season = getSeasonYear()
    const fmt = selectedFormat.value
    const batchFmt = chosen.length > 1 ? 'pdf' : fmt
    const orient = selectedOrientation.value
    const lang = selectedLang.value
    const { W: CARD_W, H: CARD_H } =
      (CARD_SIZES.find((s) => s.value === selectedSize.value) || CARD_SIZES[1])[orient]
    const exportWidthPx = Math.round(CARD_W * (300 / 25.4))
    const gapMm = Math.max(0, Number(selectedGapMm.value) || 0)
    const gapPx = Math.round(gapMm * (300 / 25.4))

    // Load photos
    const photoImgCache = new Map()
    await Promise.allSettled(
      chosen.map(async (p) => {
        if (!p.avatarUrl) return
        try {
          const { img, objectUrl } = await loadStudentPhoto(p.avatarUrl)
          photoImgCache.set(p.id, img)
          blobUrls.push(objectUrl)
        } catch (error) {
          console.warn(`[ID Card] Photo failed for "${p.fullName || p.id}":`, error)
        }
      }),
    )

    // Convert photos to data URLs
    const photoDataUrlCache = new Map()
    for (const [playerId, photoImg] of photoImgCache.entries()) {
      try {
        photoDataUrlCache.set(playerId, imgToDataUrl(photoImg))
      } catch (error) {
        console.warn(`[ID Card] Photo data URL failed for "${playerId}":`, error)
      }
    }

    // Generate QR codes
    const qrDataCache = new Map()
    await Promise.allSettled(
      chosen.map(async (p) => {
        try {
          qrDataCache.set(p.id, await buildBackQrDataUrl(p))
        } catch (error) {
          console.warn(`[ID Card] QR generation failed for "${p.fullName || p.id}":`, error)
        }
      }),
    )

    console.log('ID card generation:', {
      players: chosen.length,
      format: fmt,
      orientation: orient,
      size: selectedSize.value,
    })
    console.log('Photo cache:', photoDataUrlCache.size, 'QR cache:', qrDataCache.size)
  } catch (error) {
    console.error('[ID Card] Generation error:', error)
  } finally {
    generating.value = false
    blobUrls.forEach((url) => URL.revokeObjectURL(url))
  }
}

onMounted(() => {
  loadTeams()
})
</script>

<template>
  <MainLayout>
    <section class="space-y-6">
      <HeaderSection title="Generate Player ID Cards" subtitle="Create and export ID cards for team members" />

      <!-- Team & Player Selection -->
      <div class="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <h3 class="mb-4 text-lg font-semibold text-slate-900">Select Team & Players</h3>

        <div class="grid gap-4 sm:grid-cols-2">
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-2">Team</label>
            <Select
              v-model="selectedTeamId"
              :options="teamOptions"
              option-label="label"
              option-value="value"
              :loading="loadingTeams"
              placeholder="Select a team..."
              class="w-full"
              @change="loadPlayers"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-700 mb-2">
              Players
              <span v-if="players.length" class="text-slate-500">({{ selectedPlayerIds.length }} selected)</span>
            </label>
            <button
              v-if="players.length"
              type="button"
              class="mb-2 text-sm font-medium text-blue-600 hover:text-blue-700"
              @click="toggleSelectAll"
            >
              {{ allSelected ? 'Deselect All' : 'Select All' }}
            </button>
            <div
              class="max-h-64 overflow-y-auto border border-slate-200 rounded-lg bg-slate-50 p-3"
            >
              <div v-if="!loadingPlayers && players.length === 0" class="py-6 text-center text-sm text-slate-500">
                Select a team to load players
              </div>
              <div v-else-if="loadingPlayers" class="py-6 text-center text-sm text-slate-500">
                Loading players...
              </div>
              <div v-else class="space-y-2">
                <label
                  v-for="player in players"
                  :key="player.id"
                  class="flex items-center gap-3 p-2 hover:bg-white rounded cursor-pointer"
                >
                  <input
                    type="checkbox"
                    :checked="selectedPlayerIds.includes(player.id)"
                    class="rounded"
                    @change="togglePlayer(player.id)"
                  />
                  <span class="flex-1">
                    <span class="font-medium text-slate-900">{{ player.fullName || player.name }}</span>
                    <span class="text-sm text-slate-500 ml-2">#{{ player.publicId || player.playerCode || player.id }}</span>
                  </span>
                  <span class="text-xs bg-slate-200 text-slate-700 px-2 py-1 rounded">
                    {{ getInitials(player) }}
                  </span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Export Options -->
      <div class="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <h3 class="mb-4 text-lg font-semibold text-slate-900">Export Options</h3>

        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-2">Format</label>
            <div class="space-y-2">
              <label v-for="opt in FORMAT_OPTIONS" :key="opt.value" class="flex items-center gap-2 cursor-pointer">
                <input type="radio" v-model="selectedFormat" :value="opt.value" />
                <span>{{ opt.label }}</span>
              </label>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-700 mb-2">Orientation</label>
            <div class="space-y-2">
              <label v-for="opt in ORIENT_OPTIONS" :key="opt.value" class="flex items-center gap-2 cursor-pointer">
                <input type="radio" v-model="selectedOrientation" :value="opt.value" />
                <span>{{ opt.label }}</span>
              </label>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-700 mb-2">Size</label>
            <Select
              v-model="selectedSize"
              :options="CARD_SIZES"
              option-label="label"
              option-value="value"
              placeholder="Select size..."
              class="w-full"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-700 mb-2">Language</label>
            <Select
              v-model="selectedLang"
              :options="LANG_OPTIONS"
              option-label="label"
              option-value="value"
              placeholder="Select language..."
              class="w-full"
            />
          </div>

          <div class="col-span-full sm:col-span-1">
            <label class="block text-sm font-medium text-slate-700 mb-2">Gap (mm)</label>
            <input
              v-model.number="selectedGapMm"
              type="number"
              min="0"
              max="20"
              class="w-full px-3 py-2 border border-slate-300 rounded-lg"
            />
          </div>
        </div>
      </div>

      <!-- Generate Button -->
      <div class="flex gap-3">
        <Button
          :disabled="!selectedPlayerIds.length || generating"
          :loading="generating"
          @click="generateCards"
        >
          {{ generating ? 'Generating...' : 'Generate Cards' }}
        </Button>
        <Button variant="secondary" @click="router.back()">
          Cancel
        </Button>
      </div>
    </section>
  </MainLayout>
</template>

<style scoped>
/* Custom styles if needed */
</style>
