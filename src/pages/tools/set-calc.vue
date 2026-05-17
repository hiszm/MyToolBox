<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import ToolLayout from '@/components/layout/ToolLayout.vue'
import UiTextarea from '@/components/ui/UiTextarea.vue'
import UiSelect from '@/components/ui/UiSelect.vue'
import CopyButton from '@/components/ui/CopyButton.vue'
import { useI18n } from '@/i18n'
import type { ToolMeta } from '@/types/tool'

const route = useRoute()
const tool = route.meta.tool as ToolMeta
const { t } = useI18n()

const setA = ref('1, 2, 3, 4, 5')
const setB = ref('4, 5, 6, 7, 8')
const op = ref<'union' | 'intersection' | 'difference' | 'symmetric'>('intersection')

const opOptions = computed(() => [
  { value: 'intersection' as const, label: t({ zh: 'A ∩ B  交集', en: 'A ∩ B  Intersection' }) },
  { value: 'union' as const, label: t({ zh: 'A ∪ B  并集', en: 'A ∪ B  Union' }) },
  { value: 'difference' as const, label: t({ zh: 'A − B  差集', en: 'A − B  Difference' }) },
  { value: 'symmetric' as const, label: t({ zh: 'A △ B  对称差集', en: 'A △ B  Symmetric difference' }) },
])

function parse(s: string): Set<string> {
  return new Set(s.split(/[\s,;|\n]+/).map((x) => x.trim()).filter(Boolean))
}

const a = computed(() => parse(setA.value))
const b = computed(() => parse(setB.value))

const result = computed(() => {
  const setAv = a.value
  const setBv = b.value
  switch (op.value) {
    case 'union':
      return new Set([...setAv, ...setBv])
    case 'intersection':
      return new Set([...setAv].filter((x) => setBv.has(x)))
    case 'difference':
      return new Set([...setAv].filter((x) => !setBv.has(x)))
    case 'symmetric':
      return new Set([
        ...[...setAv].filter((x) => !setBv.has(x)),
        ...[...setBv].filter((x) => !setAv.has(x)),
      ])
    default:
      return new Set<string>()
  }
})

const resultText = computed(() => [...result.value].sort().join(', '))
</script>

<template>
  <ToolLayout :tool="tool">
    <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
      <div class="space-y-2">
        <div class="flex items-center justify-between">
          <label class="text-sm font-medium text-ink">{{ t({ zh: '集合 A', en: 'Set A' }) }}</label>
          <span class="text-xs text-ink-subtle">{{ a.size }} {{ t({ zh: '元素', en: 'items' }) }}</span>
        </div>
        <UiTextarea v-model="setA" :rows="8" :placeholder="t({ zh: '逗号 / 空格 / 换行 分隔', en: 'Separate by comma / space / newline' })" />
      </div>
      <div class="space-y-2">
        <div class="flex items-center justify-between">
          <label class="text-sm font-medium text-ink">{{ t({ zh: '集合 B', en: 'Set B' }) }}</label>
          <span class="text-xs text-ink-subtle">{{ b.size }} {{ t({ zh: '元素', en: 'items' }) }}</span>
        </div>
        <UiTextarea v-model="setB" :rows="8" :placeholder="t({ zh: '逗号 / 空格 / 换行 分隔', en: 'Separate by comma / space / newline' })" />
      </div>
    </div>

    <div class="mt-4">
      <label class="mb-1.5 block text-sm font-medium text-ink">{{ t({ zh: '运算', en: 'Operation' }) }}</label>
      <UiSelect v-model="op" :options="opOptions" />
    </div>

    <div class="mt-6 rounded-2xl border border-border bg-surface-raised p-5">
      <div class="mb-3 flex items-center justify-between">
        <h3 class="text-sm font-medium text-ink">
          {{ t({ zh: '结果', en: 'Result' }) }}
          <span class="ml-2 text-xs text-ink-subtle">({{ result.size }} {{ t({ zh: '元素', en: 'items' }) }})</span>
        </h3>
        <CopyButton :text="resultText" />
      </div>
      <div class="flex flex-wrap gap-1.5">
        <span
          v-for="item in [...result].sort()"
          :key="item"
          class="rounded-md border border-border bg-surface px-2 py-1 font-mono text-xs text-ink"
        >
          {{ item }}
        </span>
        <span v-if="!result.size" class="text-sm text-ink-subtle">{{ t({ zh: '(空集)', en: '(empty set)' }) }}</span>
      </div>
    </div>
  </ToolLayout>
</template>
