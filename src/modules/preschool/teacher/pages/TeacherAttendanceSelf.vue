<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import MainLayout from '@/layouts/MainLayout.vue'
import HeaderSection from '@/components/navigation/HeaderSection.vue'
import Button from '@/components/buttons/Button.vue'
import Toast from 'primevue/toast'
import { useToast } from 'primevue/usetoast'
import { useLanguage } from '@/composables/useLanguage'
import { saveTeacherSelfAttendance } from '@/modules/preschool/services/preschoolApi'

defineOptions({ name: 'PreschoolTeacherSelfAttendancePage' })

const { t } = useLanguage()
const toast = useToast()
const router = useRouter()

const selectedDate = ref(new Date().toISOString().slice(0, 10))
const selectedStatus = ref('')
const note = ref('')
const saving = ref(false)
const errorMessage = ref('')

const statusOptions = computed(() => [
  { value: 'present', label: t('preschoolAdminAttendancePage.status.present'), active: 'border-emerald-300 bg-emerald-50 text-emerald-700', ring: 'ring-emerald-200' },
  { value: 'absent', label: t('preschoolAdminAttendancePage.status.absent'), active: 'border-rose-300 bg-rose-50 text-rose-700', ring: 'ring-rose-200' },
  { value: 'late', label: t('preschoolAdminAttendancePage.status.late'), active: 'border-amber-300 bg-amber-50 text-amber-700', ring: 'ring-amber-200' },
  { value: 'excused', label: t('preschoolAdminAttendancePage.status.excused'), active: 'border-sky-300 bg-sky-50 text-sky-700', ring: 'ring-sky-200' },
])

const canSave = computed(() => !!selectedStatus.value && !!selectedDate.value && !saving.value)

async function save() {
  if (!canSave.value) {
    errorMessage.value = t('preschoolTeacherSelfAttendancePage.messages.selectStatus')
    return
  }
  saving.value = true
  errorMessage.value = ''
  try {
    await saveTeacherSelfAttendance({
      attendance_date: selectedDate.value,
      status: selectedStatus.value,
      note: note.value.trim() || null,
    })
    toast.add({ severity: 'success', summary: t('preschoolTeacherSelfAttendancePage.messages.saved'), life: 3000 })
    selectedStatus.value = ''
    note.value = ''
  } catch (e) {
    errorMessage.value = e?.message || t('preschoolTeacherSelfAttendancePage.messages.saveFailed')
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <MainLayout>
    <Toast />
    <section class="space-y-4">
      <HeaderSection
        :title="t('preschoolTeacherSelfAttendancePage.title')"
        :subtitle="t('preschoolTeacherSelfAttendancePage.subtitle')"
      />

      <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div class="mx-auto max-w-md space-y-5">

          <!-- Date -->
          <label class="flex flex-col gap-1.5">
            <span class="text-sm font-semibold text-slate-700">
              {{ t('preschoolTeacherSelfAttendancePage.fields.date') }}
            </span>
            <input
              v-model="selectedDate"
              type="date"
              class="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-300"
            >
          </label>

          <!-- Status -->
          <div>
            <p class="mb-2 text-sm font-semibold text-slate-700">
              {{ t('preschoolTeacherSelfAttendancePage.fields.status') }}
            </p>
            <div class="grid grid-cols-2 gap-2 sm:grid-cols-4">
              <button
                v-for="opt in statusOptions"
                :key="opt.value"
                type="button"
                class="rounded-xl border px-3 py-2.5 text-sm font-semibold transition-colors focus:outline-none focus:ring-2"
                :class="selectedStatus === opt.value
                  ? `${opt.active} ${opt.ring}`
                  : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:text-slate-700'"
                @click="selectedStatus = selectedStatus === opt.value ? '' : opt.value"
              >
                {{ opt.label }}
              </button>
            </div>
          </div>

          <!-- Note -->
          <label class="flex flex-col gap-1.5">
            <span class="text-sm font-semibold text-slate-700">
              {{ t('preschoolTeacherSelfAttendancePage.fields.note') }}
            </span>
            <textarea
              v-model="note"
              rows="3"
              class="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-300 focus:border-violet-300 focus:outline-none focus:ring-2 focus:ring-violet-200 resize-none"
              :placeholder="t('preschoolTeacherSelfAttendancePage.placeholders.note')"
            />
          </label>

          <div v-if="errorMessage" class="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
            {{ errorMessage }}
          </div>

          <!-- Actions -->
          <div class="flex gap-3">
            <Button type="button" variant="primary" size="md" rounded="xl" :loading="saving" :disabled="!canSave" class="flex-1" @click="save">
              {{ saving ? t('preschoolTeacherSelfAttendancePage.actions.saving') : t('preschoolTeacherSelfAttendancePage.actions.save') }}
            </Button>
            <Button type="button" variant="ghost" size="md" rounded="xl" @click="router.push({ name: 'dashboard-preschool-teacher-attendance' })">
              {{ t('preschoolTeacherSelfAttendancePage.actions.back') }}
            </Button>
          </div>
        </div>
      </div>
    </section>
  </MainLayout>
</template>
