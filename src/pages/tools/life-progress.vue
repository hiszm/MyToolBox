<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import ToolLayout from '@/components/layout/ToolLayout.vue'
import UiSelect from '@/components/ui/UiSelect.vue'
import { useI18n } from '@/i18n'
import type { ToolMeta } from '@/types/tool'

const route = useRoute()
const tool = route.meta.tool as ToolMeta
const { t, locale } = useI18n()

const birthYear = ref(1995)
const lifespan = ref(80)
const now = ref(Date.now())

let timer: number | undefined
onMounted(() => {
  timer = window.setInterval(() => (now.value = Date.now()), 1000)
})
onUnmounted(() => {
  if (timer) window.clearInterval(timer)
})

const yearOptions = computed(() => {
  const arr: { value: number; label: string }[] = []
  const max = new Date().getFullYear()
  for (let y = max; y >= 1950; y--) arr.push({ value: y, label: String(y) })
  return arr
})
const lifespanOptions = computed(() =>
  [60, 65, 70, 75, 80, 85, 90, 95, 100].map((y) => ({ value: y, label: t({ zh: `${y} 岁`, en: `${y} years` }) })),
)

const nowDate = computed(() => new Date(now.value))

function pad(n: number, w = 2): string {
  return String(n).padStart(w, '0')
}

const fullDate = computed(() => {
  const d = nowDate.value
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
})

const age = computed(() => nowDate.value.getFullYear() - birthYear.value)
const lifeProgress = computed(() => Math.min(100, (age.value / lifespan.value) * 100))
const remainingYears = computed(() => Math.max(0, lifespan.value - age.value))

const dayProgress = computed(() => {
  const d = nowDate.value
  const start = d.getHours() * 3600 + d.getMinutes() * 60 + d.getSeconds()
  return (start / 86400) * 100
})

const weekProgress = computed(() => {
  const d = nowDate.value
  const day = (d.getDay() + 6) % 7 // Monday = 0
  return ((day * 86400 + d.getHours() * 3600 + d.getMinutes() * 60) / (7 * 86400)) * 100
})

const monthProgress = computed(() => {
  const d = nowDate.value
  const daysInMonth = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate()
  return ((d.getDate() - 1 + d.getHours() / 24) / daysInMonth) * 100
})

const yearProgress = computed(() => {
  const d = nowDate.value
  const start = new Date(d.getFullYear(), 0, 1)
  const end = new Date(d.getFullYear() + 1, 0, 1)
  return ((d.getTime() - start.getTime()) / (end.getTime() - start.getTime())) * 100
})

interface Bar {
  id: string
  label: string
  hint: string
  value: number
  color: string
}

const bars = computed<Bar[]>(() => [
  {
    id: 'day',
    label: t({ zh: '今天', en: 'Today' }),
    hint: t({
      zh: `还剩 ${(24 - dayProgress.value * 24 / 100).toFixed(1)} 小时`,
      en: `${(24 - (dayProgress.value * 24) / 100).toFixed(1)} h remaining`,
    }),
    value: dayProgress.value,
    color: 'from-blue-500 to-cyan-500',
  },
  {
    id: 'week',
    label: t({ zh: '本周', en: 'This week' }),
    hint: t({ zh: `进度 ${weekProgress.value.toFixed(0)}%`, en: `${weekProgress.value.toFixed(0)}% complete` }),
    value: weekProgress.value,
    color: 'from-green-500 to-emerald-500',
  },
  {
    id: 'month',
    label: t({ zh: '本月', en: 'This month' }),
    hint: t({ zh: `进度 ${monthProgress.value.toFixed(0)}%`, en: `${monthProgress.value.toFixed(0)}% complete` }),
    value: monthProgress.value,
    color: 'from-amber-500 to-orange-500',
  },
  {
    id: 'year',
    label: t({ zh: '本年', en: 'This year' }),
    hint: t({ zh: `进度 ${yearProgress.value.toFixed(0)}%`, en: `${yearProgress.value.toFixed(0)}% complete` }),
    value: yearProgress.value,
    color: 'from-purple-500 to-fuchsia-500',
  },
])

const lifeBar = computed<Bar>(() => ({
  id: 'life',
  label: t({ zh: '人生', en: 'Life' }),
  hint: t({
    zh: `${lifeProgress.value.toFixed(1)}% · 你还剩 ${remainingYears.value} 年`,
    en: `${lifeProgress.value.toFixed(1)}% · ${remainingYears.value} years remaining`,
  }),
  value: lifeProgress.value,
  color: 'from-rose-500 to-pink-500',
}))

const fortune = computed(() => {
  const remaining = remainingYears.value
  if (locale.value === 'zh') {
    return [
      { label: '顿饭', value: (remaining * 365 * 3).toLocaleString() },
      { label: '个周末', value: (remaining * 52).toLocaleString() },
      { label: '次日落', value: (remaining * 365).toLocaleString() },
      { label: '本好书', value: (remaining * 12).toLocaleString() },
    ]
  }
  return [
    { label: 'meals', value: (remaining * 365 * 3).toLocaleString() },
    { label: 'weekends', value: (remaining * 52).toLocaleString() },
    { label: 'sunsets', value: (remaining * 365).toLocaleString() },
    { label: 'books (1/mo)', value: (remaining * 12).toLocaleString() },
  ]
})
</script>

<template>
  <ToolLayout :tool="tool">
    <div class="space-y-8">
      <div class="rounded-2xl border border-border bg-surface-raised p-6 text-center">
        <div class="font-mono text-3xl tabular-nums text-ink md:text-5xl">{{ fullDate }}</div>
      </div>

      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="mb-1.5 block text-xs font-medium text-ink-muted">{{ t({ zh: '出生年份', en: 'Birth year' }) }}</label>
          <UiSelect v-model="birthYear" :options="yearOptions" />
        </div>
        <div>
          <label class="mb-1.5 block text-xs font-medium text-ink-muted">{{ t({ zh: '预期寿命', en: 'Expected lifespan' }) }}</label>
          <UiSelect v-model="lifespan" :options="lifespanOptions" />
        </div>
      </div>

      <div>
        <div class="mb-2 flex items-baseline justify-between">
          <h3 class="text-lg font-medium text-ink">{{ lifeBar.label }}</h3>
          <span class="text-xs text-ink-muted">{{ lifeBar.hint }}</span>
        </div>
        <div class="h-3 overflow-hidden rounded-full bg-surface-overlay">
          <div :class="['h-full rounded-full bg-gradient-to-r transition-all duration-500', lifeBar.color]" :style="{ width: `${lifeBar.value}%` }" />
        </div>
      </div>

      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div v-for="bar in bars" :key="bar.id">
          <div class="mb-2 flex items-baseline justify-between">
            <span class="text-sm font-medium text-ink">{{ bar.label }}</span>
            <span class="text-xs text-ink-muted">{{ bar.hint }}</span>
          </div>
          <div class="h-2 overflow-hidden rounded-full bg-surface-overlay">
            <div :class="['h-full rounded-full bg-gradient-to-r transition-all', bar.color]" :style="{ width: `${bar.value}%` }" />
          </div>
        </div>
      </div>

      <div>
        <h3 class="mb-3 text-sm font-medium text-ink">{{ t({ zh: '如果寿数照预期, 你大约还能享受', en: 'If your lifespan holds, you still have' }) }}</h3>
        <div class="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div v-for="f in fortune" :key="f.label" class="rounded-xl border border-border bg-surface-raised p-4">
            <div class="text-2xl font-semibold tabular-nums text-accent">{{ f.value }}</div>
            <div class="mt-0.5 text-xs text-ink-subtle">{{ f.label }}</div>
          </div>
        </div>
      </div>
    </div>
  </ToolLayout>
</template>
