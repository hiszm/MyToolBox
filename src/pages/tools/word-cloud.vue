<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import ToolLayout from '@/components/layout/ToolLayout.vue'
import UiButton from '@/components/ui/UiButton.vue'
import UiTextarea from '@/components/ui/UiTextarea.vue'
import UiInput from '@/components/ui/UiInput.vue'
import { useI18n, UI } from '@/i18n'
import type { ToolMeta } from '@/types/tool'

const route = useRoute()
const tool = route.meta.tool as ToolMeta
const { t } = useI18n()

const sample = `MyToolBox is a modern, fast, privacy-first toolbox.
MyToolBox runs entirely in your browser.
All tools are local. No tracking. No telemetry.
21 tools, 4 categories: encoding, text, data, productivity.
Built with Vue 3, TypeScript, Vite and Tailwind CSS.
Open source. MIT license.`

const text = ref(sample)
const minLen = ref(3)
const minFreq = ref(1)

const STOP_EN = new Set([
  'the', 'a', 'an', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
  'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'should',
  'and', 'or', 'but', 'if', 'then', 'else', 'when', 'while', 'of', 'in',
  'on', 'at', 'to', 'for', 'with', 'by', 'from', 'as', 'it', 'this',
  'that', 'these', 'those', 'i', 'you', 'he', 'she', 'we', 'they',
])

const STOP_ZH = new Set([
  '的', '了', '和', '是', '就', '都', '而', '及', '与', '着', '之',
  '用', '于', '把', '被', '让', '给', '但', '却', '并', '很', '也',
  '这', '那', '有', '去', '来', '做', '可以', '能', '要', '会',
])

const frequencies = computed(() => {
  // Word boundary that supports CJK
  const tokens =
    text.value
      .toLowerCase()
      .match(/[a-zA-Z]+|[一-龥]+/g) ?? []
  const map = new Map<string, number>()
  for (const tok of tokens) {
    if (tok.length < minLen.value) continue
    if (STOP_EN.has(tok) || STOP_ZH.has(tok)) continue
    map.set(tok, (map.get(tok) ?? 0) + 1)
  }
  return Array.from(map.entries())
    .filter(([, f]) => f >= minFreq.value)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 80)
})

const maxFreq = computed(() => frequencies.value.reduce((m, [, f]) => Math.max(m, f), 1))

function fontSize(f: number): string {
  const min = 12,
    max = 56
  const t = f / maxFreq.value
  return `${min + (max - min) * Math.pow(t, 0.7)}px`
}

function color(i: number): string {
  const hues = [220, 250, 280, 310, 200, 170, 30, 350]
  return `hsl(${hues[i % hues.length]} 70% 60%)`
}

function loadExample() {
  text.value = sample
}
function clear() {
  text.value = ''
}
</script>

<template>
  <ToolLayout :tool="tool" variant="wide">
    <div class="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_2fr]">
      <div class="space-y-4">
        <div>
          <label class="mb-2 block text-sm font-medium text-ink">{{ t({ zh: '输入文本', en: 'Input text' }) }}</label>
          <UiTextarea v-model="text" :rows="14" />
        </div>
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="mb-1.5 block text-xs font-medium text-ink-muted">{{ t({ zh: '最小词长', en: 'Min length' }) }}</label>
            <UiInput v-model.number="minLen" type="number" mono />
          </div>
          <div>
            <label class="mb-1.5 block text-xs font-medium text-ink-muted">{{ t({ zh: '最小词频', en: 'Min freq' }) }}</label>
            <UiInput v-model.number="minFreq" type="number" mono />
          </div>
        </div>
        <div class="flex gap-2">
          <UiButton variant="ghost" @click="loadExample">{{ t(UI.loadExample) }}</UiButton>
          <UiButton variant="ghost" @click="clear">{{ t(UI.clear) }}</UiButton>
        </div>
      </div>

      <div>
        <div class="mb-2 flex items-center justify-between">
          <span class="text-sm font-medium text-ink">{{ t({ zh: '词云', en: 'Cloud' }) }}</span>
          <span class="text-xs text-ink-subtle">{{ frequencies.length }} {{ t({ zh: '词', en: 'terms' }) }}</span>
        </div>
        <div class="flex min-h-96 flex-wrap items-center justify-center gap-x-3 gap-y-1 rounded-2xl border border-border bg-surface-raised p-6">
          <span
            v-for="([w, f], i) in frequencies"
            :key="w"
            class="select-none font-semibold leading-none transition-transform hover:scale-110"
            :style="{ fontSize: fontSize(f), color: color(i) }"
            :title="`${w}: ${f}`"
          >
            {{ w }}
          </span>
        </div>
      </div>
    </div>
  </ToolLayout>
</template>
