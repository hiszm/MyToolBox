<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import ToolLayout from '@/components/layout/ToolLayout.vue'
import UiInput from '@/components/ui/UiInput.vue'
import UiTextarea from '@/components/ui/UiTextarea.vue'
import UiSelect from '@/components/ui/UiSelect.vue'
import CopyButton from '@/components/ui/CopyButton.vue'
import { useI18n } from '@/i18n'
import type { ToolMeta } from '@/types/tool'

const route = useRoute()
const tool = route.meta.tool as ToolMeta
const { t, locale } = useI18n()

const staff = ref(`Alice
Bob
Charlie
Diana
Evan`)
const startDate = ref(new Date().toISOString().slice(0, 10))
const startIndex = ref(0)
const skipWeekends = ref(false)
const monthsToShow = ref(2)

const staffList = computed(() => staff.value.split('\n').map((s) => s.trim()).filter(Boolean))

const monthOptions = [
  { value: 1, label: '1' },
  { value: 2, label: '2' },
  { value: 3, label: '3' },
  { value: 6, label: '6' },
]

interface Cell {
  date: Date
  inMonth: boolean
  staff: string | null
  isToday: boolean
  isWeekend: boolean
}

interface MonthGrid {
  label: string
  cells: Cell[]
}

const today = new Date()
today.setHours(0, 0, 0, 0)

function startOfMonth(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), 1)
}

function addMonths(d: Date, n: number): Date {
  return new Date(d.getFullYear(), d.getMonth() + n, 1)
}

function sameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}

function fmtMonth(d: Date): string {
  if (locale.value === 'zh') return `${d.getFullYear()} 年 ${d.getMonth() + 1} 月`
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long' })
}

const months = computed<MonthGrid[]>(() => {
  if (!staffList.value.length) return []
  const start = new Date(startDate.value)
  if (Number.isNaN(start.getTime())) return []
  start.setHours(0, 0, 0, 0)

  const result: MonthGrid[] = []
  let staffIdx = startIndex.value % staffList.value.length

  // Build assignment map by date string
  const assignments = new Map<string, string>()
  const horizon = new Date(start)
  horizon.setMonth(horizon.getMonth() + monthsToShow.value + 1)
  const cursor = new Date(start)
  while (cursor < horizon) {
    const day = cursor.getDay()
    if (!skipWeekends.value || (day !== 0 && day !== 6)) {
      assignments.set(cursor.toISOString().slice(0, 10), staffList.value[staffIdx % staffList.value.length])
      staffIdx++
    }
    cursor.setDate(cursor.getDate() + 1)
  }

  for (let m = 0; m < monthsToShow.value; m++) {
    const first = addMonths(startOfMonth(start), m)
    const firstDow = first.getDay()
    const daysInMonth = new Date(first.getFullYear(), first.getMonth() + 1, 0).getDate()
    const cells: Cell[] = []

    // leading
    for (let i = 0; i < firstDow; i++) {
      const d = new Date(first)
      d.setDate(d.getDate() - (firstDow - i))
      cells.push({ date: d, inMonth: false, staff: null, isToday: false, isWeekend: d.getDay() === 0 || d.getDay() === 6 })
    }
    // in month
    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(first.getFullYear(), first.getMonth(), d)
      const key = date.toISOString().slice(0, 10)
      cells.push({
        date,
        inMonth: true,
        staff: assignments.get(key) ?? null,
        isToday: sameDay(date, today),
        isWeekend: date.getDay() === 0 || date.getDay() === 6,
      })
    }
    // trailing
    while (cells.length % 7 !== 0) {
      const last = cells[cells.length - 1].date
      const d = new Date(last)
      d.setDate(d.getDate() + 1)
      cells.push({ date: d, inMonth: false, staff: null, isToday: false, isWeekend: d.getDay() === 0 || d.getDay() === 6 })
    }
    result.push({ label: fmtMonth(first), cells })
  }
  return result
})

const csv = computed(() => {
  const lines: string[] = ['date,staff']
  for (const m of months.value) {
    for (const c of m.cells) {
      if (c.inMonth && c.staff) lines.push(`${c.date.toISOString().slice(0, 10)},${c.staff}`)
    }
  }
  return lines.join('\n')
})

const dayHeaders = computed(() =>
  locale.value === 'zh'
    ? ['日', '一', '二', '三', '四', '五', '六']
    : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
)
</script>

<template>
  <ToolLayout :tool="tool" variant="wide">
    <div class="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_2fr]">
      <div class="space-y-4">
        <div>
          <label class="mb-1.5 block text-sm font-medium text-ink">{{ t({ zh: '值班人员(每行一个)', en: 'Staff (one per line)' }) }}</label>
          <UiTextarea v-model="staff" :rows="8" />
        </div>
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="mb-1.5 block text-xs font-medium text-ink-muted">{{ t({ zh: '开始日期', en: 'Start date' }) }}</label>
            <UiInput v-model="startDate" type="date" />
          </div>
          <div>
            <label class="mb-1.5 block text-xs font-medium text-ink-muted">{{ t({ zh: '从第 N 位开始', en: 'Start at position' }) }}</label>
            <UiInput v-model.number="startIndex" type="number" mono />
          </div>
        </div>
        <div>
          <label class="mb-1.5 block text-xs font-medium text-ink-muted">{{ t({ zh: '展示月数', en: 'Months to show' }) }}</label>
          <UiSelect v-model="monthsToShow" :options="monthOptions" />
        </div>
        <label class="flex items-center gap-2 text-sm text-ink-muted">
          <input v-model="skipWeekends" type="checkbox" class="size-4 rounded border-border text-accent" />
          {{ t({ zh: '跳过周末', en: 'Skip weekends' }) }}
        </label>
        <CopyButton :text="csv" :label="t({ zh: '导出 CSV', en: 'Export CSV' })" />
      </div>

      <div class="space-y-8">
        <div v-for="m in months" :key="m.label">
          <h3 class="mb-2 text-base font-medium tracking-tight text-ink">{{ m.label }}</h3>
          <div class="grid grid-cols-7 overflow-hidden rounded-xl border border-border bg-surface-raised text-xs">
            <div
              v-for="(h, i) in dayHeaders"
              :key="h"
              class="border-b border-border bg-surface-overlay px-2 py-1.5 text-center font-medium text-ink-muted"
              :class="[i === 0 || i === 6 ? 'text-red-400' : '']"
            >
              {{ h }}
            </div>
            <div
              v-for="(c, i) in m.cells"
              :key="i"
              class="flex h-20 flex-col gap-0.5 border-r border-t border-border p-1.5 transition-colors"
              :class="[
                c.inMonth ? 'bg-surface' : 'bg-surface-raised opacity-40',
                c.isToday && 'ring-2 ring-accent ring-inset',
              ]"
            >
              <span class="text-[10px] text-ink-subtle" :class="c.isWeekend && c.inMonth ? 'text-red-400' : ''">
                {{ c.date.getDate() }}
              </span>
              <span v-if="c.staff && c.inMonth" class="mt-auto truncate rounded bg-accent/15 px-1 py-0.5 text-[10px] font-medium text-accent">
                {{ c.staff }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </ToolLayout>
</template>
