<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import ToolLayout from '@/components/layout/ToolLayout.vue'
import UiButton from '@/components/ui/UiButton.vue'
import UiTextarea from '@/components/ui/UiTextarea.vue'
import CopyButton from '@/components/ui/CopyButton.vue'
import { useI18n, UI } from '@/i18n'
import type { ToolMeta } from '@/types/tool'

const route = useRoute()
const tool = route.meta.tool as ToolMeta
const { t } = useI18n()

const input = ref(`${Date.now()}\n${Math.floor(Date.now() / 1000)}`)

interface Row {
  raw: string
  unit: string
  date: string
  iso: string
  relative: string
}

function pad(n: number, w = 2): string {
  return String(n).padStart(w, '0')
}

function formatDate(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}.${pad(d.getMilliseconds(), 3)}`
}

function formatRelative(d: Date, lang: 'zh' | 'en'): string {
  const diff = d.getTime() - Date.now()
  const abs = Math.abs(diff)
  const sec = Math.floor(abs / 1000)
  const min = Math.floor(sec / 60)
  const hr = Math.floor(min / 60)
  const day = Math.floor(hr / 24)
  const future = diff > 0

  if (lang === 'zh') {
    if (sec < 60) return future ? `${sec} 秒后` : `${sec} 秒前`
    if (min < 60) return future ? `${min} 分钟后` : `${min} 分钟前`
    if (hr < 24) return future ? `${hr} 小时后` : `${hr} 小时前`
    if (day < 365) return future ? `${day} 天后` : `${day} 天前`
    return future ? `${Math.floor(day / 365)} 年后` : `${Math.floor(day / 365)} 年前`
  } else {
    if (sec < 60) return future ? `in ${sec}s` : `${sec}s ago`
    if (min < 60) return future ? `in ${min}m` : `${min}m ago`
    if (hr < 24) return future ? `in ${hr}h` : `${hr}h ago`
    if (day < 365) return future ? `in ${day}d` : `${day}d ago`
    return future ? `in ${Math.floor(day / 365)}y` : `${Math.floor(day / 365)}y ago`
  }
}

const { locale } = useI18n()

const rows = computed<Row[]>(() => {
  return input.value
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)
    .map((raw): Row | null => {
      const n = Number(raw)
      if (!Number.isFinite(n)) return null
      let ms: number
      let unit: string
      const abs = Math.abs(n)
      if (abs >= 1e18) {
        ms = n / 1e6
        unit = locale.value === 'zh' ? '纳秒' : 'ns'
      } else if (abs >= 1e15) {
        ms = n / 1e3
        unit = locale.value === 'zh' ? '微秒' : 'µs'
      } else if (abs >= 1e12) {
        ms = n
        unit = locale.value === 'zh' ? '毫秒' : 'ms'
      } else {
        ms = n * 1000
        unit = locale.value === 'zh' ? '秒' : 's'
      }
      const d = new Date(ms)
      if (Number.isNaN(d.getTime())) return null
      return {
        raw,
        unit,
        date: formatDate(d),
        iso: d.toISOString(),
        relative: formatRelative(d, locale.value),
      }
    })
    .filter((x): x is Row => x !== null)
})

function now() {
  input.value = `${Date.now()}\n${Math.floor(Date.now() / 1000)}`
}
function clear() {
  input.value = ''
}
const allText = computed(() =>
  rows.value.map((r) => `${r.raw}\t${r.unit}\t${r.date}\t${r.iso}\t${r.relative}`).join('\n'),
)
</script>

<template>
  <ToolLayout :tool="tool" variant="wide">
    <div class="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_2fr]">
      <div class="space-y-2">
        <div class="flex items-center justify-between">
          <label class="text-sm font-medium text-ink">
            {{ t({ zh: '时间戳(每行一个)', en: 'Timestamps (one per line)' }) }}
          </label>
        </div>
        <UiTextarea v-model="input" :rows="14" />
        <div class="flex gap-2">
          <UiButton variant="primary" size="sm" @click="now">{{ t({ zh: '当前时间', en: 'Now' }) }}</UiButton>
          <UiButton variant="ghost" size="sm" @click="clear">{{ t(UI.clear) }}</UiButton>
        </div>
      </div>
      <div class="space-y-2">
        <div class="flex items-center justify-between">
          <label class="text-sm font-medium text-ink">{{ t(UI.result) }}</label>
          <CopyButton :text="allText" />
        </div>
        <div class="overflow-hidden rounded-xl border border-border bg-surface-raised">
          <div class="max-h-[28rem] overflow-auto">
            <table class="min-w-full text-left text-sm">
              <thead class="border-b border-border bg-surface-overlay text-xs text-ink-muted">
                <tr>
                  <th class="px-3 py-2.5 font-medium">{{ t({ zh: '原始', en: 'Input' }) }}</th>
                  <th class="px-3 py-2.5 font-medium">{{ t({ zh: '单位', en: 'Unit' }) }}</th>
                  <th class="px-3 py-2.5 font-medium">{{ t({ zh: '本地时间', en: 'Local time' }) }}</th>
                  <th class="px-3 py-2.5 font-medium">ISO 8601</th>
                  <th class="px-3 py-2.5 font-medium">{{ t({ zh: '相对', en: 'Relative' }) }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="r in rows" :key="r.raw" class="border-b border-border last:border-0">
                  <td class="px-3 py-2 font-mono text-xs">{{ r.raw }}</td>
                  <td class="px-3 py-2 text-xs text-ink-muted">{{ r.unit }}</td>
                  <td class="px-3 py-2 font-mono text-xs">{{ r.date }}</td>
                  <td class="px-3 py-2 font-mono text-xs text-ink-muted">{{ r.iso }}</td>
                  <td class="px-3 py-2 text-xs text-ink-muted">{{ r.relative }}</td>
                </tr>
                <tr v-if="rows.length === 0">
                  <td colspan="5" class="px-3 py-10 text-center text-sm text-ink-subtle">
                    {{ t({ zh: '在左侧输入时间戳', en: 'Enter timestamps on the left' }) }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </ToolLayout>
</template>
