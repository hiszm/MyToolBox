<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import ToolLayout from '@/components/layout/ToolLayout.vue'
import UiButton from '@/components/ui/UiButton.vue'
import UiTextarea from '@/components/ui/UiTextarea.vue'
import UiInput from '@/components/ui/UiInput.vue'
import UiAlert from '@/components/ui/UiAlert.vue'
import CopyButton from '@/components/ui/CopyButton.vue'
import { useI18n, UI } from '@/i18n'
import type { ToolMeta } from '@/types/tool'

const route = useRoute()
const tool = route.meta.tool as ToolMeta
const { t } = useI18n()

const input = ref(`{"name":"MyToolBox","version":"2.0.0","tags":["dev","tools"],"meta":{"local":true,"tracking":false}}`)
const output = ref('')
const error = ref('')
const searchKeys = ref('')

function format() {
  error.value = ''
  try {
    output.value = JSON.stringify(JSON.parse(input.value), null, 2)
  } catch (e) {
    error.value = (e as Error).message
  }
}
function minify() {
  error.value = ''
  try {
    output.value = JSON.stringify(JSON.parse(input.value))
  } catch (e) {
    error.value = (e as Error).message
  }
}
function sortKeys() {
  error.value = ''
  try {
    const obj = JSON.parse(input.value)
    output.value = JSON.stringify(sortDeep(obj), null, 2)
  } catch (e) {
    error.value = (e as Error).message
  }
}
function sortDeep(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(sortDeep)
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([k, v]) => [k, sortDeep(v)]),
    )
  }
  return value
}
function extract() {
  error.value = ''
  const keys = searchKeys.value
    .split(',')
    .map((k) => k.trim())
    .filter(Boolean)
  if (!keys.length) {
    error.value = t({ zh: '请输入要提取的 key', en: 'Enter at least one key to extract' })
    return
  }
  try {
    const obj = JSON.parse(input.value)
    const matches: Record<string, unknown>[] = []
    const walk = (v: unknown) => {
      if (Array.isArray(v)) v.forEach(walk)
      else if (v && typeof v === 'object') {
        const o = v as Record<string, unknown>
        const picked: Record<string, unknown> = {}
        let any = false
        for (const k of keys) if (k in o) {
          picked[k] = o[k]
          any = true
        }
        if (any) matches.push(picked)
        Object.values(o).forEach(walk)
      }
    }
    walk(obj)
    output.value = JSON.stringify(matches, null, 2)
  } catch (e) {
    error.value = (e as Error).message
  }
}

function loadExample() {
  input.value = '{"user":{"id":42,"name":"Aki","roles":["admin","editor"]},"flags":{"beta":true},"updatedAt":1717000000}'
  output.value = ''
  error.value = ''
}
function clear() {
  input.value = ''
  output.value = ''
  error.value = ''
}

const inputSize = computed(() => new Blob([input.value]).size)
const outputSize = computed(() => new Blob([output.value]).size)
</script>

<template>
  <ToolLayout :tool="tool" variant="wide">
    <div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <div class="space-y-2">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <label class="text-sm font-medium text-ink">{{ t(UI.input) }}</label>
            <span class="text-xs text-ink-subtle">{{ inputSize }} bytes</span>
          </div>
          <UiButton size="sm" variant="ghost" @click="clear">{{ t(UI.clear) }}</UiButton>
        </div>
        <UiTextarea v-model="input" :rows="14" />
      </div>
      <div class="space-y-2">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <label class="text-sm font-medium text-ink">{{ t(UI.output) }}</label>
            <span class="text-xs text-ink-subtle">{{ outputSize }} bytes</span>
          </div>
          <CopyButton :text="output" />
        </div>
        <UiTextarea :model-value="output" readonly :rows="14" />
      </div>
    </div>

    <UiAlert :message="error" class="mt-4" />

    <div class="mt-4 flex flex-wrap items-end gap-3">
      <UiButton variant="primary" @click="format">{{ t({ zh: '格式化', en: 'Format' }) }}</UiButton>
      <UiButton @click="minify">{{ t({ zh: '压缩', en: 'Minify' }) }}</UiButton>
      <UiButton @click="sortKeys">{{ t({ zh: '按 key 排序', en: 'Sort keys' }) }}</UiButton>
      <UiButton variant="ghost" @click="loadExample">{{ t(UI.loadExample) }}</UiButton>
      <div class="ml-auto flex items-end gap-2">
        <div class="w-56">
          <label class="mb-1 block text-xs text-ink-muted">{{ t({ zh: '按 key 提取', en: 'Extract by key' }) }}</label>
          <UiInput v-model="searchKeys" mono :placeholder="t({ zh: 'name,version', en: 'name,version' })" size="sm" />
        </div>
        <UiButton size="sm" @click="extract">{{ t({ zh: '提取', en: 'Extract' }) }}</UiButton>
      </div>
    </div>
  </ToolLayout>
</template>
