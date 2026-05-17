<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import ToolLayout from '@/components/layout/ToolLayout.vue'
import UiButton from '@/components/ui/UiButton.vue'
import UiTextarea from '@/components/ui/UiTextarea.vue'
import UiSelect from '@/components/ui/UiSelect.vue'
import UiAlert from '@/components/ui/UiAlert.vue'
import CopyButton from '@/components/ui/CopyButton.vue'
import { useI18n, UI } from '@/i18n'
import type { ToolMeta } from '@/types/tool'

const route = useRoute()
const tool = route.meta.tool as ToolMeta
const { t } = useI18n()

const direction = ref<'encode' | 'decode'>('encode')
const urlSafe = ref(false)
const input = ref('Hello, MyToolBox!')
const error = ref('')

const dirOptions = computed(() => [
  { value: 'encode' as const, label: t({ zh: '编码 (Encode)', en: 'Encode' }) },
  { value: 'decode' as const, label: t({ zh: '解码 (Decode)', en: 'Decode' }) },
])

function encode(text: string, safe: boolean): string {
  // Handle Unicode properly
  const bytes = new TextEncoder().encode(text)
  let binary = ''
  for (const byte of bytes) binary += String.fromCharCode(byte)
  let result = btoa(binary)
  if (safe) result = result.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
  return result
}

function decode(text: string, safe: boolean): string {
  let t = text.trim()
  if (safe) {
    t = t.replace(/-/g, '+').replace(/_/g, '/')
    while (t.length % 4) t += '='
  }
  const binary = atob(t)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
  return new TextDecoder().decode(bytes)
}

const output = computed(() => {
  error.value = ''
  if (!input.value) return ''
  try {
    return direction.value === 'encode'
      ? encode(input.value, urlSafe.value)
      : decode(input.value, urlSafe.value)
  } catch {
    error.value = t({ zh: '解码失败:输入不是合法的 Base64', en: 'Decode failed — input is not valid Base64' })
    return ''
  }
})

function swap() {
  direction.value = direction.value === 'encode' ? 'decode' : 'encode'
  input.value = output.value
}

async function handleFile(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  const buf = await file.arrayBuffer()
  const bytes = new Uint8Array(buf)
  let binary = ''
  for (const b of bytes) binary += String.fromCharCode(b)
  input.value = btoa(binary)
  direction.value = 'decode'
}

function clear() {
  input.value = ''
}
</script>

<template>
  <ToolLayout :tool="tool">
    <div class="mb-4 grid grid-cols-1 gap-3 md:grid-cols-3">
      <div>
        <label class="mb-1.5 block text-xs font-medium text-ink-muted">
          {{ t({ zh: '方向', en: 'Direction' }) }}
        </label>
        <UiSelect v-model="direction" :options="dirOptions" />
      </div>
      <label class="flex cursor-pointer items-end gap-2 text-sm text-ink-muted">
        <input v-model="urlSafe" type="checkbox" class="size-4 rounded border-border text-accent" />
        <span class="pb-2">{{ t({ zh: 'URL-safe 变体', en: 'URL-safe variant' }) }}</span>
      </label>
      <div class="flex items-end">
        <label class="block w-full">
          <span class="mb-1.5 block text-xs font-medium text-ink-muted">
            {{ t({ zh: '从文件加载', en: 'Load from file' }) }}
          </span>
          <input
            type="file"
            class="block w-full text-sm text-ink-muted file:mr-3 file:rounded-md file:border-0 file:bg-surface-overlay file:px-3 file:py-1.5 file:text-sm file:text-ink hover:file:bg-surface-overlay"
            @change="handleFile"
          />
        </label>
      </div>
    </div>

    <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
      <div class="space-y-2">
        <div class="flex items-center justify-between">
          <label class="text-sm font-medium text-ink">{{ t(UI.input) }}</label>
          <UiButton size="sm" variant="ghost" @click="clear">{{ t(UI.clear) }}</UiButton>
        </div>
        <UiTextarea v-model="input" :rows="10" />
      </div>
      <div class="space-y-2">
        <div class="flex items-center justify-between">
          <label class="text-sm font-medium text-ink">{{ t(UI.output) }}</label>
          <div class="flex gap-2">
            <UiButton size="sm" variant="ghost" @click="swap">{{
              t({ zh: '⇅ 互换', en: '⇅ Swap' })
            }}</UiButton>
            <CopyButton :text="output" />
          </div>
        </div>
        <UiTextarea :model-value="output" readonly :rows="10" />
      </div>
    </div>

    <UiAlert :message="error" class="mt-3" />
  </ToolLayout>
</template>
