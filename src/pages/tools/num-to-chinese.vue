<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import ToolLayout from '@/components/layout/ToolLayout.vue'
import UiButton from '@/components/ui/UiButton.vue'
import UiInput from '@/components/ui/UiInput.vue'
import UiAlert from '@/components/ui/UiAlert.vue'
import CopyButton from '@/components/ui/CopyButton.vue'
import { useI18n, UI } from '@/i18n'
import type { ToolMeta } from '@/types/tool'

const route = useRoute()
const tool = route.meta.tool as ToolMeta
const { t } = useI18n()

const raw = ref('1234567890')
const error = ref('')

const DIGITS = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九']
const SMALL = ['', '十', '百', '千']
const BIG = ['', '万', '亿', '兆', '京', '垓', '秭', '穰', '沟', '涧']

function toChinese(num: string): string {
  if (!/^-?\d+$/.test(num)) throw new Error('not a number')
  let negative = false
  if (num.startsWith('-')) {
    negative = true
    num = num.slice(1)
  }
  if (num === '0') return '零'
  // remove leading zeros
  num = num.replace(/^0+/, '')
  if (num.length > 40) throw new Error('too long')

  // Process in groups of 4 from right to left
  const groups: string[] = []
  for (let i = num.length; i > 0; i -= 4) groups.push(num.slice(Math.max(0, i - 4), i))

  let result = ''
  for (let g = groups.length - 1; g >= 0; g--) {
    const chunk = groups[g]
    let chunkStr = ''
    for (let i = 0; i < chunk.length; i++) {
      const d = parseInt(chunk[i], 10)
      const unit = SMALL[chunk.length - 1 - i]
      if (d === 0) {
        if (chunkStr && !chunkStr.endsWith('零')) chunkStr += '零'
      } else {
        chunkStr += DIGITS[d] + unit
      }
    }
    chunkStr = chunkStr.replace(/零+$/, '')
    if (chunkStr) result += chunkStr + BIG[g]
    else if (result && !result.endsWith('零')) result += '零'
  }

  result = result.replace(/零+/g, '零').replace(/零$/, '')
  if (result.startsWith('一十')) result = result.slice(1)
  return (negative ? '负' : '') + (result || '零')
}

const chinese = computed(() => {
  const n = raw.value.trim()
  if (!n) {
    error.value = ''
    return ''
  }
  try {
    const r = toChinese(n)
    error.value = ''
    return r
  } catch {
    error.value = t({ zh: '请输入有效的整数', en: 'Please enter a valid integer' })
    return ''
  }
})

function example() {
  raw.value = '1234567890987'
}
function clear() {
  raw.value = ''
}
</script>

<template>
  <ToolLayout :tool="tool">
    <div class="space-y-4">
      <div>
        <label class="mb-2 block text-sm font-medium text-ink">
          {{ t({ zh: '输入数字', en: 'Input number' }) }}
        </label>
        <UiInput v-model="raw" :placeholder="t({ zh: '例如 1234567', en: 'e.g. 1234567' })" mono />
      </div>

      <UiAlert :message="error" />

      <div>
        <div class="mb-2 flex items-center justify-between">
          <span class="text-sm font-medium text-ink">{{ t({ zh: '中文读法', en: 'Chinese reading' }) }}</span>
          <CopyButton :text="chinese" />
        </div>
        <div
          class="min-h-14 break-all rounded-xl border border-border bg-surface-raised px-4 py-3 text-2xl font-medium text-ink"
        >
          {{ chinese || '—' }}
        </div>
      </div>

      <div class="flex gap-2">
        <UiButton variant="secondary" @click="example">{{ t(UI.loadExample) }}</UiButton>
        <UiButton variant="ghost" @click="clear">{{ t(UI.clear) }}</UiButton>
      </div>
    </div>
  </ToolLayout>
</template>
