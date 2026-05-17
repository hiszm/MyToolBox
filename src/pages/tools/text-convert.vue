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

const input = ref('Hello-World_FROM-MyToolBox')
const mode = ref<
  | 'dashToUnderscore'
  | 'underscoreToDash'
  | 'camelToUnderscore'
  | 'underscoreToCamel'
  | 'camelToDash'
  | 'dashToCamel'
  | 'capitalizeFirst'
  | 'lowercaseFirst'
  | 'uppercase'
  | 'lowercase'
  | 'titleCase'
>('camelToUnderscore')

const options = computed(() => [
  { value: 'camelToUnderscore', label: t({ zh: '驼峰 → 下划线', en: 'camelCase → snake_case' }) },
  { value: 'underscoreToCamel', label: t({ zh: '下划线 → 驼峰', en: 'snake_case → camelCase' }) },
  { value: 'camelToDash', label: t({ zh: '驼峰 → 短横线', en: 'camelCase → kebab-case' }) },
  { value: 'dashToCamel', label: t({ zh: '短横线 → 驼峰', en: 'kebab-case → camelCase' }) },
  { value: 'dashToUnderscore', label: t({ zh: '短横线 → 下划线', en: 'kebab-case → snake_case' }) },
  { value: 'underscoreToDash', label: t({ zh: '下划线 → 短横线', en: 'snake_case → kebab-case' }) },
  { value: 'uppercase', label: t({ zh: '全部大写', en: 'UPPERCASE' }) },
  { value: 'lowercase', label: t({ zh: '全部小写', en: 'lowercase' }) },
  { value: 'capitalizeFirst', label: t({ zh: '首字母大写', en: 'Capitalize first' }) },
  { value: 'lowercaseFirst', label: t({ zh: '首字母小写', en: 'lowercase first' }) },
  { value: 'titleCase', label: t({ zh: '标题格式', en: 'Title Case' }) },
])

const output = computed(() => transform(input.value, mode.value))

function transform(src: string, m: typeof mode.value): string {
  if (!src) return ''
  switch (m) {
    case 'dashToUnderscore':
      return src.replace(/-/g, '_')
    case 'underscoreToDash':
      return src.replace(/_/g, '-')
    case 'camelToUnderscore':
      return src.replace(/([a-z0-9])([A-Z])/g, '$1_$2').toLowerCase()
    case 'underscoreToCamel':
      return src.replace(/_([a-z0-9])/g, (_, c: string) => c.toUpperCase())
    case 'camelToDash':
      return src.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()
    case 'dashToCamel':
      return src.replace(/-([a-z0-9])/g, (_, c: string) => c.toUpperCase())
    case 'uppercase':
      return src.toUpperCase()
    case 'lowercase':
      return src.toLowerCase()
    case 'capitalizeFirst':
      return src.charAt(0).toUpperCase() + src.slice(1)
    case 'lowercaseFirst':
      return src.charAt(0).toLowerCase() + src.slice(1)
    case 'titleCase':
      return src.replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
  }
}

function clear() {
  input.value = ''
}
</script>

<template>
  <ToolLayout :tool="tool">
    <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
      <div class="space-y-2">
        <div class="flex items-center justify-between">
          <label class="text-sm font-medium text-ink">{{ t(UI.input) }}</label>
          <UiButton size="sm" variant="ghost" @click="clear">{{ t(UI.clear) }}</UiButton>
        </div>
        <UiTextarea v-model="input" :rows="10" :placeholder="t({ zh: '输入要转换的文本', en: 'Text to transform' })" />
      </div>
      <div class="space-y-2">
        <div class="flex items-center justify-between">
          <label class="text-sm font-medium text-ink">{{ t(UI.output) }}</label>
          <CopyButton :text="output" />
        </div>
        <UiTextarea :model-value="output" readonly :rows="10" :placeholder="t({ zh: '结果', en: 'Result' })" />
      </div>
    </div>

    <div class="mt-4">
      <label class="mb-2 block text-sm font-medium text-ink">
        {{ t({ zh: '转换方式', en: 'Transformation' }) }}
      </label>
      <UiSelect v-model="mode" :options="options" />
    </div>
  </ToolLayout>
</template>
