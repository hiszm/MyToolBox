<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import ToolLayout from '@/components/layout/ToolLayout.vue'
import UiButton from '@/components/ui/UiButton.vue'
import UiTextarea from '@/components/ui/UiTextarea.vue'
import UiSelect from '@/components/ui/UiSelect.vue'
import CopyButton from '@/components/ui/CopyButton.vue'
import { useI18n, UI } from '@/i18n'
import type { ToolMeta } from '@/types/tool'

const route = useRoute()
const tool = route.meta.tool as ToolMeta
const { t } = useI18n()

const mode = ref<'encode' | 'decode' | 'component-encode' | 'component-decode'>('component-encode')
const input = ref('https://hiszm.github.io/MyToolBox/?name=你好&category=工具')

const options = computed(() => [
  { value: 'component-encode' as const, label: t({ zh: 'encodeURIComponent', en: 'encodeURIComponent' }) },
  { value: 'component-decode' as const, label: t({ zh: 'decodeURIComponent', en: 'decodeURIComponent' }) },
  { value: 'encode' as const, label: t({ zh: 'encodeURI', en: 'encodeURI' }) },
  { value: 'decode' as const, label: t({ zh: 'decodeURI', en: 'decodeURI' }) },
])

const output = computed(() => {
  if (!input.value) return ''
  try {
    switch (mode.value) {
      case 'component-encode':
        return encodeURIComponent(input.value)
      case 'component-decode':
        return decodeURIComponent(input.value)
      case 'encode':
        return encodeURI(input.value)
      case 'decode':
        return decodeURI(input.value)
      default:
        return ''
    }
  } catch {
    return ''
  }
})

interface QueryRow {
  key: string
  value: string
}
const query = computed<QueryRow[]>(() => {
  try {
    let urlStr = input.value
    if (!/^https?:\/\//.test(urlStr) && urlStr.includes('?')) urlStr = 'http://x' + urlStr.slice(urlStr.indexOf('?'))
    if (!urlStr.startsWith('http')) return []
    const url = new URL(urlStr)
    const rows: QueryRow[] = []
    url.searchParams.forEach((v, k) => rows.push({ key: k, value: v }))
    return rows
  } catch {
    return []
  }
})

function clear() {
  input.value = ''
}
</script>

<template>
  <ToolLayout :tool="tool">
    <div class="mb-4">
      <label class="mb-1.5 block text-xs font-medium text-ink-muted">
        {{ t({ zh: '编码方式', en: 'Encoding mode' }) }}
      </label>
      <UiSelect v-model="mode" :options="options" />
    </div>

    <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
      <div class="space-y-2">
        <div class="flex items-center justify-between">
          <label class="text-sm font-medium text-ink">{{ t(UI.input) }}</label>
          <UiButton size="sm" variant="ghost" @click="clear">{{ t(UI.clear) }}</UiButton>
        </div>
        <UiTextarea v-model="input" :rows="8" />
      </div>
      <div class="space-y-2">
        <div class="flex items-center justify-between">
          <label class="text-sm font-medium text-ink">{{ t(UI.output) }}</label>
          <CopyButton :text="output" />
        </div>
        <UiTextarea :model-value="output" readonly :rows="8" />
      </div>
    </div>

    <div v-if="query.length" class="mt-6">
      <h3 class="mb-2 text-sm font-medium text-ink">{{ t({ zh: '解析的 Query 参数', en: 'Parsed query parameters' }) }}</h3>
      <div class="overflow-hidden rounded-xl border border-border bg-surface-raised">
        <table class="min-w-full text-left text-sm">
          <thead class="border-b border-border bg-surface-overlay text-xs text-ink-muted">
            <tr>
              <th class="px-3 py-2 font-medium">Key</th>
              <th class="px-3 py-2 font-medium">Value</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in query" :key="row.key" class="border-b border-border last:border-0">
              <td class="px-3 py-2 font-mono text-xs">{{ row.key }}</td>
              <td class="px-3 py-2 font-mono text-xs text-ink-muted">{{ row.value }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </ToolLayout>
</template>
