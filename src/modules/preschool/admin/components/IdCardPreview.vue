<script setup>
/**
 * IdCardPreview — renders one ID card as HTML, pixel-perfect relative to `width`.
 * All measurements derived from mm values (matching the PDF renderer).
 */
import { computed } from 'vue'
import logoSrc from '@/assets/images/logo.jpg'

const props = defineProps({
  student:      { type: Object,  required: true },
  className:    { type: String,  default: '' },
  classLevel:   { type: String,  default: '' },
  academicYear: { type: String,  default: '' },
  orientation:  { type: String,  default: 'landscape' }, // 'landscape' | 'portrait'
  width:        { type: Number,  default: 300 },         // rendered px width
})

// ── Shared constants ──────────────────────────────────────────────────────────
const ACCENT = ['#22c55e', '#f97316', '#ef4444', '#3b82f6']

// ── Geometry ──────────────────────────────────────────────────────────────────
const isPortrait = computed(() => props.orientation === 'portrait')
const cardWmm    = computed(() => isPortrait.value ? 54    : 85.6)
const cardHmm    = computed(() => isPortrait.value ? 85.6  : 54)
const ppm        = computed(() => props.width / cardWmm.value)   // pixels per mm

// Call these in the template — Vue tracks ppm.value inside the render effect
const mm    = (v) => `${v * ppm.value}px`   // mm → css px string
const mmn   = (v) => v * ppm.value           // mm → numeric px
// pt → css px (1 pt = 0.3528 mm)
const pt    = (v) => `${v * 0.3528 * ppm.value}px`

const cardPx = computed(() => ({
  width:  `${props.width}px`,
  height: `${mmn(cardHmm.value)}px`,
}))

// Section heights
const HEADER_H = computed(() => isPortrait.value ? 20   : 14.5)  // mm
const BAR_H    = 1.8
const FOOTER_H = 8.5
const BODY_H   = computed(() => cardHmm.value - HEADER_H.value - BAR_H - FOOTER_H)

// Avatar
const AV_R = computed(() => isPortrait.value ? 10 : 11.5)  // mm radius

// ── Student data ──────────────────────────────────────────────────────────────
const name      = computed(() => props.student.fullName || props.student.name || '—')
const sid       = computed(() => props.student.studentCode || props.student.id || '—')
const photoUrl  = computed(() => props.student.avatarUrl || '')
const initials  = computed(() =>
  name.value.split(' ').filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase() || '?',
)
const hasGender = computed(() => !!props.student.gender)
const isMale    = computed(() => props.student.gender?.toLowerCase().startsWith('m') ?? true)
</script>

<template>
  <!-- ── Card shell ─────────────────────────────────────────────────────────── -->
  <div
    class="relative overflow-hidden rounded-[3px] border border-slate-200 bg-white shadow select-none shrink-0"
    :style="cardPx"
  >

    <!-- ══ HEADER ════════════════════════════════════════════════════════════ -->
    <div
      class="absolute inset-x-0 top-0 bg-[#0a2450] overflow-hidden"
      :style="{ height: mm(HEADER_H) }"
    >

      <!-- Landscape header -->
      <div v-if="!isPortrait" class="flex items-center h-full" :style="{ gap: mm(1.5), padding: `0 ${mm(2)}` }">
        <img
          :src="logoSrc"
          class="object-contain shrink-0"
          :style="{ width: mm(10.5), height: mm(10.5) }"
        />
        <div class="flex-1 min-w-0 flex flex-col justify-center">
          <span class="font-bold text-white truncate leading-none" :style="{ fontSize: pt(7.5), marginBottom: mm(0.8) }">HFCCF PRESCHOOL</span>
          <span class="text-sky-300 truncate leading-none" :style="{ fontSize: pt(5.5) }">Hope for Cambodian Children</span>
        </div>
        <div
          class="border border-white/60 rounded font-bold text-white shrink-0"
          :style="{ fontSize: pt(4.8), padding: `${mmn(0.8)}px ${mmn(1.8)}px` }"
        >
          STUDENT ID CARD
        </div>
      </div>

      <!-- Portrait header — centred column -->
      <div v-else class="flex flex-col items-center justify-center h-full" :style="{ gap: mm(1) }">
        <img
          :src="logoSrc"
          class="object-contain shrink-0"
          :style="{ width: mm(10), height: mm(10) }"
        />
        <span class="font-bold text-white leading-none" :style="{ fontSize: pt(7.5) }">HFCCF PRESCHOOL</span>
        <span class="text-sky-300 leading-none" :style="{ fontSize: pt(5) }">Hope for Cambodian Children</span>
      </div>

    </div>

    <!-- ══ ACCENT BAR ════════════════════════════════════════════════════════ -->
    <div
      class="absolute inset-x-0 flex"
      :style="{ top: mm(HEADER_H), height: mm(BAR_H) }"
    >
      <div v-for="c in ACCENT" :key="c" class="flex-1" :style="{ background: c }" />
    </div>

    <!-- ══ BODY ══════════════════════════════════════════════════════════════ -->
    <div
      class="absolute inset-x-0 flex"
      :style="{ top: mm(HEADER_H + BAR_H), height: mm(BODY_H) }"
    >

      <!-- ── Landscape body ───────────────────────────────────────────────── -->
      <template v-if="!isPortrait">

        <!-- Avatar column -->
        <div class="flex flex-col items-center justify-center shrink-0" :style="{ width: mm(29.5) }">

          <!-- Circle photo / initials -->
          <div
            class="rounded-full overflow-hidden bg-blue-100 flex items-center justify-center ring-[1.5px] ring-blue-400"
            :style="{ width: mm(AV_R * 2), height: mm(AV_R * 2) }"
          >
            <img
              v-if="photoUrl"
              :src="photoUrl"
              class="w-full h-full object-cover"
            />
            <span
              v-else
              class="font-bold text-blue-800"
              :style="{ fontSize: pt(initials.length > 2 ? 8.5 : 11) }"
            >{{ initials }}</span>
          </div>

          <!-- Gender badge -->
          <div
            v-if="hasGender"
            class="rounded font-bold leading-none"
            :style="{
              fontSize:   pt(5),
              padding:    `${mmn(0.6)}px ${mmn(1.8)}px`,
              marginTop:  mm(1.5),
              background: isMale ? '#ede9fe' : '#fce7f3',
              color:      isMale ? '#6d28d9' : '#be185d',
            }"
          >{{ isMale ? 'MALE' : 'FEMALE' }}</div>

        </div>

        <!-- Vertical separator -->
        <div
          class="border-l border-slate-200 shrink-0"
          :style="{ margin: `${mmn(2)}px 0` }"
        />

        <!-- Info column -->
        <div
          class="flex-1 flex flex-col justify-center overflow-hidden"
          :style="{ padding: `${mmn(2)}px ${mmn(2)}px` }"
        >
          <!-- Name -->
          <p
            class="font-bold text-slate-900 truncate leading-tight"
            :style="{ fontSize: pt(8.5), marginBottom: mm(1.5) }"
          >{{ name }}</p>

          <!-- Divider -->
          <div class="border-t border-slate-200" :style="{ marginBottom: mm(2) }" />

          <!-- STUDENT ID -->
          <div :style="{ marginBottom: mm(2) }">
            <p class="font-semibold text-slate-400 uppercase tracking-wider leading-none" :style="{ fontSize: pt(4.8) }">Student ID</p>
            <p class="font-bold text-blue-800 leading-tight" :style="{ fontSize: pt(7) }">{{ sid }}</p>
          </div>

          <!-- CLASS | GRADE row -->
          <div class="flex" :style="{ gap: mm(5) }">
            <div>
              <p class="font-semibold text-slate-400 uppercase tracking-wider leading-none" :style="{ fontSize: pt(4.8) }">Class</p>
              <p class="font-bold text-blue-800 leading-tight" :style="{ fontSize: pt(7) }">{{ className || '—' }}</p>
            </div>
            <div v-if="classLevel">
              <p class="font-semibold text-slate-400 uppercase tracking-wider leading-none" :style="{ fontSize: pt(4.8) }">Grade</p>
              <p class="font-bold text-blue-800 leading-tight" :style="{ fontSize: pt(7) }">{{ classLevel }}</p>
            </div>
          </div>
        </div>

      </template>

      <!-- ── Portrait body ────────────────────────────────────────────────── -->
      <template v-else>
        <div
          class="w-full flex flex-col items-center overflow-hidden"
          :style="{ paddingTop: mm(2) }"
        >

          <!-- Avatar circle -->
          <div
            class="rounded-full overflow-hidden bg-blue-100 flex items-center justify-center ring-[1.5px] ring-blue-400 shrink-0"
            :style="{ width: mm(AV_R * 2), height: mm(AV_R * 2) }"
          >
            <img v-if="photoUrl" :src="photoUrl" class="w-full h-full object-cover" />
            <span
              v-else
              class="font-bold text-blue-800"
              :style="{ fontSize: pt(initials.length > 2 ? 7.5 : 9.5) }"
            >{{ initials }}</span>
          </div>

          <!-- Gender badge -->
          <div
            v-if="hasGender"
            class="rounded font-bold leading-none shrink-0"
            :style="{
              fontSize:   pt(5),
              padding:    `${mmn(0.5)}px ${mmn(2.5)}px`,
              marginTop:  mm(1.5),
              background: isMale ? '#ede9fe' : '#fce7f3',
              color:      isMale ? '#6d28d9' : '#be185d',
            }"
          >{{ isMale ? 'MALE' : 'FEMALE' }}</div>

          <!-- Name -->
          <p
            class="font-bold text-slate-900 truncate max-w-full leading-tight"
            :style="{ fontSize: pt(8), marginTop: mm(2), paddingInline: mm(3) }"
          >{{ name }}</p>

          <!-- Divider -->
          <div
            class="border-t border-slate-200 self-stretch"
            :style="{ margin: `${mmn(2)}px ${mmn(4)}px` }"
          />

          <!-- 2×2 info grid -->
          <div
            class="grid grid-cols-2 self-stretch"
            :style="{ paddingInline: mm(5), rowGap: mm(1.5), columnGap: mm(2) }"
          >
            <div>
              <p class="font-semibold text-slate-400 uppercase tracking-wider leading-none" :style="{ fontSize: pt(4.5) }">Student ID</p>
              <p class="font-bold text-blue-800 leading-tight" :style="{ fontSize: pt(6.5) }">{{ sid }}</p>
            </div>
            <div v-if="classLevel">
              <p class="font-semibold text-slate-400 uppercase tracking-wider leading-none" :style="{ fontSize: pt(4.5) }">Grade</p>
              <p class="font-bold text-blue-800 leading-tight" :style="{ fontSize: pt(6.5) }">{{ classLevel }}</p>
            </div>
            <div>
              <p class="font-semibold text-slate-400 uppercase tracking-wider leading-none" :style="{ fontSize: pt(4.5) }">Class</p>
              <p class="font-bold text-blue-800 leading-tight" :style="{ fontSize: pt(6.5) }">{{ className || '—' }}</p>
            </div>
            <div v-if="student.dateOfBirth">
              <p class="font-semibold text-slate-400 uppercase tracking-wider leading-none" :style="{ fontSize: pt(4.5) }">DOB</p>
              <p class="font-bold text-blue-800 leading-tight" :style="{ fontSize: pt(6.5) }">{{ student.dateOfBirth }}</p>
            </div>
          </div>

        </div>
      </template>

    </div>

    <!-- ══ FOOTER ════════════════════════════════════════════════════════════ -->
    <div
      class="absolute inset-x-0 bottom-0 flex items-center justify-center bg-blue-50 border-t border-blue-200"
      :style="{ height: mm(FOOTER_H) }"
    >
      <span class="font-bold text-blue-800" :style="{ fontSize: pt(isPortrait ? 5.5 : 6) }">
        Academic Year&nbsp;&nbsp;{{ academicYear }}
      </span>
    </div>

  </div>
</template>
