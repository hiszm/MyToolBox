<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import diff_match_patch from 'diff-match-patch'
import ToolLayout from '@/components/layout/ToolLayout.vue'
import UiButton from '@/components/ui/UiButton.vue'
import UiTextarea from '@/components/ui/UiTextarea.vue'
import { useI18n, UI } from '@/i18n'
import type { ToolMeta } from '@/types/tool'

const route = useRoute()
const tool = route.meta.tool as ToolMeta
const { t } = useI18n()

const left = ref(`MyToolBox v1.0
Built with Vue 2 + Tailwind via CDN
14 tools across 3 categories`)

const right = ref(`MyToolBox v2.0
Built with Vue 3 + TypeScript + Vite
21 tools across 4 categories`)

const dmp = new diff_match_patch()

interface Chunk {
  type: -1 | 0 | 1
  text: string
}

const chunks = computed<Chunk[]>(() => {
  if (!left.value && !right.value) return []
  const arr = dmp.diff_main(left.value, right.value)
  dmp.diff_cleanupSemantic(arr)
  return arr.map(([op, text]) => ({ type: op as -1 | 0 | 1, text }))
})

const stats = computed(() => {
  let added = 0,
    removed = 0,
    same = 0
  for (const c of chunks.value) {
    if (c.type === 1) added += c.text.length
    else if (c.type === -1) removed += c.text.length
    else same += c.text.length
  }
  return { added, removed, same }
})

function swap() {
  ;[left.value, right.value] = [right.value, left.value]
}
function clear() {
  left.value = ''
  right.value = ''
}
</script>

<template>
  <ToolLayout :tool="tool" variant="wide">
    <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
      <div class="space-y-2">
        <label class="text-sm font-medium text-ink">{{ t({ zh: '左侧文本(原始)', en: 'Left (original)' }) }}</label>
        <UiTextarea v-model="left" :rows="10" />
      </div>
      <div class="space-y-2">
        <label class="text-sm font-medium text-ink">{{ t({ zh: '右侧文本(变更)', en: 'Right (changed)' }) }}</label>
        <UiTextarea v-model="right" :rows="10" />
      </div>
    </div>

    <div class="mt-4 flex flex-wrap items-center gap-2">
      <UiButton variant="ghost" @click="swap">{{ t({ zh: '⇄ 互换', en: '⇄ Swap' }) }}</UiButton>
      <UiButton variant="ghost" @click="clear">{{ t(UI.clear) }}</UiButton>
      <span class="ml-auto flex gap-2 text-xs">
        <span class="rounded bg-green-500/10 px-2 py-1 text-green-500">+{{ stats.added }}</span>
        <span class="rounded bg-red-500/10 px-2 py-1 text-red-500">−{{ stats.removed }}</span>
        <span class="rounded bg-surface-overlay px-2 py-1 text-ink-muted">={{ stats.same }}</span>
      </span>
    </div>

    <div class="mt-6">
      <h3 class="mb-2 text-sm font-medium text-ink">{{ t({ zh: '差异结果', en: 'Diff result' }) }}</h3>
      <div class="overflow-hidden rounded-xl border border-border bg-surface-raised">
        <pre class="whitespace-pre-wrap break-all p-4 font-mono text-sm leading-relaxed"><template v-for="(c, i) in chunks" :key="i"><span v-if="c.type === 1" class="rounded bg-green-500/15 text-green-400">{{ c.text }}</span><span v-else-if="c.type === -1" class="rounded bg-red-500/15 text-red-400 line-through decoration-red-400/40">{{ c.text }}</span><span v-else class="text-ink">{{ c.text }}</span></template></pre>
      </div>
    </div>
  </ToolLayout>
</template>
