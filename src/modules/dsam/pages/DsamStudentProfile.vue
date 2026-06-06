<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import http from '@/services/http'
import MainLayout from '@/layouts/MainLayout.vue'
import HeaderSection from '@/components/navigation/HeaderSection.vue'
import Button from '@/components/buttons/Button.vue'
import Tag from 'primevue/tag'
import { dsamCoreApi } from '../services/dsamCoreApi'
import { dsamSubmissionApi } from '../services/dsamSubmissionApi'
import RiskBadge from '../components/shared/RiskBadge.vue'

defineOptions({ name: 'DsamStudentProfilePage' })

const route  = useRoute()
const router = useRouter()

const student     = ref(null)
const profile     = ref(null)
const histories   = ref([])
const submissions = ref([])
const loading     = ref(true)
const activeTab   = ref('overview')

const tabs = [
  { id: 'overview',    label: 'Overview',          icon: 'pi-user' },
  { id: 'assessments', label: 'Assessment History', icon: 'pi-list' },
  { id: 'school',      label: 'School History',     icon: 'pi-book' },
]

const statusSeverity = {
  draft: 'secondary', in_progress: 'warn', submitted: 'info',
  under_review: 'warn', approved: 'success', rejected: 'danger',
}

const riskOrder = { critical: 0, high: 1, medium: 2, low: 3 }

const latestSubmission = computed(() =>
  [...submissions.value]
    .filter(s => s.status === 'approved')
    .sort((a, b) => new Date(b.submitted_at) - new Date(a.submitted_at))[0] ?? null
)

const riskTrend = computed(() =>
  [...submissions.value]
    .filter(s => s.status === 'approved' && s.risk_level)
    .sort((a, b) => new Date(a.submitted_at) - new Date(b.submitted_at))
    .map(s => ({ label: s.form_template?.name ?? '—', risk: s.risk_level, score: s.score_percentage, date: s.submitted_at }))
)

const studentName = computed(() => {
  if (!student.value) return ''
  return student.value.full_name
    ?? [student.value.first_name, student.value.last_name].filter(Boolean).join(' ')
})

async function load() {
  loading.value = true
  const id = route.params.id
  try {
    const [studentRes, profileRes, historiesRes, submissionsRes] = await Promise.all([
      http.get(`/preschool/students/${id}`),
      dsamCoreApi.getProfile(id),
      dsamCoreApi.listHistories(id),
      dsamSubmissionApi.list({ student_id: id, per_page: 100 }),
    ])
    student.value     = studentRes.data.data ?? studentRes.data
    profile.value     = profileRes.data.data
    histories.value   = historiesRes.data.data ?? []
    submissions.value = submissionsRes.data.data ?? []
  } finally {
    loading.value = false
  }
}

function fmt(val) { return val ?? '—' }
function fmtDate(d) { return d ? new Date(d).toLocaleDateString() : '—' }
function fmtCurrency(v) { return v != null ? '$' + Number(v).toLocaleString() : '—' }

const riskBarColor = { low: 'bg-green-500', medium: 'bg-amber-500', high: 'bg-orange-500', critical: 'bg-red-500' }
const riskDotColor = { low: 'bg-green-500', medium: 'bg-amber-500', high: 'bg-orange-500', critical: 'bg-red-500' }

onMounted(load)
</script>

<template>
  <MainLayout>
    <div v-if="loading" class="flex justify-center py-20 text-slate-400">
      <i class="pi pi-spin pi-spinner text-3xl" />
    </div>

    <template v-else-if="student">
      <div class="flex flex-col gap-6">

        <!-- Header -->
        <HeaderSection :title="studentName">
          <template #subtitle>
            <span class="text-slate-400 text-sm">{{ fmt(student.student_code) }}</span>
          </template>
          <template #actions>
            <Button
              label="Start Assessment"
              icon="pi pi-plus"
              @click="router.push({ name: 'dsam-submission-list' })"
            />
          </template>
        </HeaderSection>

        <!-- Student summary card -->
        <div class="grid gap-4 lg:grid-cols-4">
          <div class="lg:col-span-1 rounded-xl border border-slate-200 bg-white p-5 flex flex-col items-center text-center gap-3">
            <div class="h-16 w-16 rounded-full bg-violet-100 flex items-center justify-center text-2xl font-bold text-violet-600">
              {{ studentName.charAt(0) }}
            </div>
            <div>
              <p class="font-semibold text-slate-800">{{ studentName }}</p>
              <p class="text-xs text-slate-400 mt-0.5">{{ fmt(student.student_code) }}</p>
            </div>
            <div class="flex flex-col gap-1 text-xs text-slate-500 w-full">
              <div class="flex justify-between">
                <span class="text-slate-400">Class</span>
                <span>{{ fmt(student.current_class?.name ?? student.class_name) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-slate-400">Gender</span>
                <span class="capitalize">{{ fmt(student.gender) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-slate-400">DOB</span>
                <span>{{ fmtDate(student.date_of_birth) }}</span>
              </div>
            </div>
          </div>

          <!-- KPI mini-cards -->
          <div class="lg:col-span-3 grid grid-cols-3 gap-4">
            <div class="rounded-xl border border-slate-200 bg-white p-4">
              <p class="text-xs font-medium text-slate-400">Total Assessments</p>
              <p class="mt-1.5 text-2xl font-bold text-slate-900">{{ submissions.length }}</p>
            </div>
            <div class="rounded-xl border border-slate-200 bg-white p-4">
              <p class="text-xs font-medium text-slate-400">Latest Score</p>
              <p class="mt-1.5 text-2xl font-bold text-slate-900">
                {{ latestSubmission ? latestSubmission.score_percentage?.toFixed(1) + '%' : '—' }}
              </p>
            </div>
            <div class="rounded-xl border border-slate-200 bg-white p-4">
              <p class="text-xs font-medium text-slate-400 mb-2">Latest Risk</p>
              <RiskBadge :level="latestSubmission?.risk_level ?? null" />
            </div>
          </div>
        </div>

        <!-- Tabs -->
        <div class="border-b border-slate-200 bg-white rounded-t-xl -mb-6">
          <nav class="flex gap-0 px-4">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              :class="[
                'flex items-center gap-1.5 px-4 py-3 text-sm font-medium border-b-2 transition-colors',
                activeTab === tab.id
                  ? 'border-violet-600 text-violet-700'
                  : 'border-transparent text-slate-500 hover:text-slate-700',
              ]"
              @click="activeTab = tab.id"
            >
              <i :class="['pi text-xs', tab.icon]" />
              {{ tab.label }}
            </button>
          </nav>
        </div>

        <!-- ── Tab: Overview ───────────────────────────────────────────── -->
        <div v-if="activeTab === 'overview'" class="grid gap-4 lg:grid-cols-2 pt-6">

          <!-- Score trend -->
          <div class="rounded-xl border border-slate-200 bg-white p-5 lg:col-span-2">
            <h3 class="mb-4 text-sm font-semibold text-slate-800">Assessment Score Trend</h3>
            <div v-if="riskTrend.length" class="space-y-3">
              <div v-for="(entry, i) in riskTrend" :key="i" class="flex items-center gap-3">
                <div :class="['h-2.5 w-2.5 rounded-full shrink-0', riskDotColor[entry.risk] ?? 'bg-slate-300']" />
                <span class="w-40 text-xs text-slate-500 truncate">{{ entry.label }}</span>
                <div class="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    :class="['h-full rounded-full transition-all', riskBarColor[entry.risk] ?? 'bg-slate-400']"
                    :style="{ width: (entry.score ?? 0).toFixed(1) + '%' }"
                  />
                </div>
                <span class="w-12 text-right text-xs font-medium text-slate-700">
                  {{ entry.score != null ? entry.score.toFixed(1) + '%' : '—' }}
                </span>
              </div>
            </div>
            <p v-else class="text-sm text-slate-400">No approved assessments yet.</p>
          </div>

          <!-- Family -->
          <div class="rounded-xl border border-slate-200 bg-white p-5">
            <h3 class="mb-4 text-sm font-semibold text-slate-800">Family</h3>
            <div class="space-y-4 text-sm">
              <div v-if="profile?.father?.name || profile?.mother?.name">
                <template v-for="(parent, key) in { Father: profile?.father, Mother: profile?.mother }" :key="key">
                  <div v-if="parent?.name" class="mb-3">
                    <p class="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-1">{{ key }}</p>
                    <div class="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                      <div><span class="text-slate-400">Name</span><br><span class="text-slate-700">{{ fmt(parent.name) }}</span></div>
                      <div><span class="text-slate-400">Phone</span><br><span class="text-slate-700">{{ fmt(parent.phone) }}</span></div>
                      <div><span class="text-slate-400">Occupation</span><br><span class="text-slate-700">{{ fmt(parent.occupation) }}</span></div>
                      <div><span class="text-slate-400">Status</span><br><span class="capitalize text-slate-700">{{ fmt(parent.status) }}</span></div>
                    </div>
                  </div>
                </template>
                <div v-if="profile?.guardian?.name">
                  <p class="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-1">Guardian</p>
                  <div class="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                    <div><span class="text-slate-400">Name</span><br><span class="text-slate-700">{{ fmt(profile.guardian.name) }}</span></div>
                    <div><span class="text-slate-400">Relation</span><br><span class="text-slate-700">{{ fmt(profile.guardian.relation) }}</span></div>
                    <div><span class="text-slate-400">Phone</span><br><span class="text-slate-700">{{ fmt(profile.guardian.phone) }}</span></div>
                  </div>
                </div>
              </div>
              <p v-else class="text-slate-400 text-xs">No family data on file.</p>
            </div>
          </div>

          <!-- Household & Housing -->
          <div class="rounded-xl border border-slate-200 bg-white p-5">
            <h3 class="mb-4 text-sm font-semibold text-slate-800">Household & Housing</h3>
            <div class="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
              <div><span class="text-slate-400">Household size</span><br><span class="text-slate-700">{{ fmt(profile?.household?.household_size) }}</span></div>
              <div><span class="text-slate-400">Siblings</span><br><span class="text-slate-700">{{ fmt(profile?.household?.num_siblings) }}</span></div>
              <div><span class="text-slate-400">Monthly income</span><br><span class="text-slate-700">{{ fmtCurrency(profile?.household?.monthly_income) }}</span></div>
              <div><span class="text-slate-400">Housing</span><br><span class="capitalize text-slate-700">{{ fmt(profile?.housing?.type)?.replace('_', ' ') }}</span></div>
              <div><span class="text-slate-400">Electricity</span><br>
                <i :class="profile?.housing?.has_electricity ? 'pi-check-circle text-emerald-500' : 'pi-times-circle text-slate-300'" class="pi" />
              </div>
              <div><span class="text-slate-400">Clean water</span><br>
                <i :class="profile?.housing?.has_clean_water ? 'pi-check-circle text-emerald-500' : 'pi-times-circle text-slate-300'" class="pi" />
              </div>
              <div><span class="text-slate-400">Distance to school</span><br><span class="text-slate-700">{{ profile?.education?.distance_to_school != null ? profile.education.distance_to_school + ' km' : '—' }}</span></div>
              <div><span class="text-slate-400">Transport</span><br><span class="text-slate-700">{{ fmt(profile?.education?.transport_mode) }}</span></div>
            </div>

            <div class="mt-4 pt-4 border-t border-slate-100">
              <p class="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-2">Health</p>
              <div class="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                <div><span class="text-slate-400">Status</span><br><span class="capitalize text-slate-700">{{ fmt(profile?.health?.status) }}</span></div>
                <div><span class="text-slate-400">Insurance</span><br>
                  <i :class="profile?.health?.has_health_insurance ? 'pi-check-circle text-emerald-500' : 'pi-times-circle text-slate-300'" class="pi" />
                </div>
                <div v-if="profile?.health?.disabilities?.length" class="col-span-2">
                  <span class="text-slate-400">Disabilities</span><br>
                  <span class="text-slate-700">{{ profile.health.disabilities.join(', ') }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- ── Tab: Assessment History ─────────────────────────────────── -->
        <div v-else-if="activeTab === 'assessments'" class="pt-6 space-y-3">
          <div v-if="!submissions.length" class="rounded-xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-400">
            No assessments found for this student.
          </div>

          <div
            v-for="sub in [...submissions].sort((a,b) => new Date(b.updated_at) - new Date(a.updated_at))"
            :key="sub.id"
            class="rounded-xl border border-slate-200 bg-white p-4 flex items-center gap-4 hover:border-violet-200 transition-colors"
          >
            <div :class="['h-2.5 w-2.5 rounded-full shrink-0 mt-0.5', riskDotColor[sub.risk_level] ?? 'bg-slate-300']" />

            <div class="flex-1 min-w-0">
              <p class="font-medium text-slate-800 text-sm truncate">{{ sub.form_template?.name ?? '—' }}</p>
              <p class="text-xs text-slate-400 mt-0.5">{{ sub.academic_year?.name ?? '—' }}</p>
            </div>

            <div class="text-right shrink-0">
              <p class="text-sm font-semibold text-slate-800">
                {{ sub.score_percentage != null ? sub.score_percentage.toFixed(1) + '%' : '—' }}
              </p>
              <p class="text-xs text-slate-400">{{ fmtDate(sub.submitted_at ?? sub.updated_at) }}</p>
            </div>

            <RiskBadge :level="sub.risk_level" size="sm" class="shrink-0" />

            <Tag
              :severity="statusSeverity[sub.status] ?? 'secondary'"
              :value="sub.status?.replace('_', ' ')"
              class="shrink-0"
            />

            <button
              class="shrink-0 text-violet-600 hover:text-violet-800 text-xs font-medium"
              @click="router.push({ name: 'dsam-submission-detail', params: { id: sub.uuid } })"
            >
              View
            </button>
          </div>
        </div>

        <!-- ── Tab: School History ─────────────────────────────────────── -->
        <div v-else-if="activeTab === 'school'" class="pt-6">
          <div v-if="!histories.length" class="rounded-xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-400">
            No school history records found.
          </div>

          <div v-else class="rounded-xl border border-slate-200 bg-white overflow-hidden">
            <table class="w-full text-sm">
              <thead class="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th class="px-4 py-3 text-left text-xs font-semibold text-slate-500">Academic Year</th>
                  <th class="px-4 py-3 text-left text-xs font-semibold text-slate-500">School</th>
                  <th class="px-4 py-3 text-left text-xs font-semibold text-slate-500">Grade</th>
                  <th class="px-4 py-3 text-left text-xs font-semibold text-slate-500">Class</th>
                  <th class="px-4 py-3 text-left text-xs font-semibold text-slate-500">Status</th>
                  <th class="px-4 py-3 text-left text-xs font-semibold text-slate-500">Notes</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                <tr
                  v-for="h in [...histories].sort((a,b) => (b.academic_year?.name ?? '').localeCompare(a.academic_year?.name ?? ''))"
                  :key="h.id"
                  class="hover:bg-slate-50"
                >
                  <td class="px-4 py-3 font-medium text-slate-800">{{ h.academic_year?.name ?? '—' }}</td>
                  <td class="px-4 py-3 text-slate-600">{{ h.school?.name ?? '—' }}</td>
                  <td class="px-4 py-3 text-slate-600">{{ fmt(h.grade) }}</td>
                  <td class="px-4 py-3 text-slate-600">{{ fmt(h.class_name) }}</td>
                  <td class="px-4 py-3">
                    <span :class="[
                      'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset capitalize',
                      {
                        active:      'bg-green-50 text-green-700 ring-green-200',
                        graduated:   'bg-blue-50 text-blue-700 ring-blue-200',
                        dropped:     'bg-red-50 text-red-700 ring-red-200',
                        transferred: 'bg-amber-50 text-amber-700 ring-amber-200',
                        suspended:   'bg-orange-50 text-orange-700 ring-orange-200',
                      }[h.status] ?? 'bg-slate-100 text-slate-600 ring-slate-200',
                    ]">
                      {{ h.status }}
                    </span>
                  </td>
                  <td class="px-4 py-3 text-xs text-slate-400">{{ fmt(h.notes) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </template>
  </MainLayout>
</template>
