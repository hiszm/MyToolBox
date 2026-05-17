<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import ToolLayout from '@/components/layout/ToolLayout.vue'
import UiButton from '@/components/ui/UiButton.vue'
import UiSelect from '@/components/ui/UiSelect.vue'
import UiInput from '@/components/ui/UiInput.vue'
import CopyButton from '@/components/ui/CopyButton.vue'
import { useI18n, UI } from '@/i18n'
import type { ToolMeta } from '@/types/tool'

const route = useRoute()
const tool = route.meta.tool as ToolMeta
const { t } = useI18n()

type Variant = 'v4' | 'v7' | 'ulid' | 'nano'
const variant = ref<Variant>('v4')
const count = ref(10)
const upper = ref(false)
const hyphens = ref(true)

const options = computed(() => [
  { value: 'v4' as const, label: 'UUID v4 — random' },
  { value: 'v7' as const, label: 'UUID v7 — time-ordered' },
  { value: 'ulid' as const, label: 'ULID — Crockford base32' },
  { value: 'nano' as const, label: 'Nano ID — 21 chars' },
])

function uuidV4(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(16))
  bytes[6] = (bytes[6] & 0x0f) | 0x40
  bytes[8] = (bytes[8] & 0x3f) | 0x80
  const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, '0'))
  return `${hex.slice(0, 4).join('')}-${hex.slice(4, 6).join('')}-${hex.slice(6, 8).join('')}-${hex.slice(8, 10).join('')}-${hex.slice(10).join('')}`
}

function uuidV7(): string {
  const ms = BigInt(Date.now())
  const random = crypto.getRandomValues(new Uint8Array(10))
  const bytes = new Uint8Array(16)
  // 48-bit big-endian timestamp
  bytes[0] = Number((ms >> 40n) & 0xffn)
  bytes[1] = Number((ms >> 32n) & 0xffn)
  bytes[2] = Number((ms >> 24n) & 0xffn)
  bytes[3] = Number((ms >> 16n) & 0xffn)
  bytes[4] = Number((ms >> 8n) & 0xffn)
  bytes[5] = Number(ms & 0xffn)
  for (let i = 0; i < 10; i++) bytes[6 + i] = random[i]
  bytes[6] = (bytes[6] & 0x0f) | 0x70 // version 7
  bytes[8] = (bytes[8] & 0x3f) | 0x80 // variant
  const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, '0'))
  return `${hex.slice(0, 4).join('')}-${hex.slice(4, 6).join('')}-${hex.slice(6, 8).join('')}-${hex.slice(8, 10).join('')}-${hex.slice(10).join('')}`
}

const ULID_ALPHABET = '0123456789ABCDEFGHJKMNPQRSTVWXYZ'
function ulid(): string {
  const time = Date.now()
  let timeStr = ''
  let t = time
  for (let i = 0; i < 10; i++) {
    timeStr = ULID_ALPHABET[t % 32] + timeStr
    t = Math.floor(t / 32)
  }
  const random = crypto.getRandomValues(new Uint8Array(10))
  let rand = ''
  for (const b of random) rand += ULID_ALPHABET[b % 32]
  return timeStr + rand.slice(0, 16)
}

const NANO_ALPHABET = 'ModuleSymbhasOwnPr-0123456789ABCDEFGHIJKLMNQRTUVWXYZ_cfgijkpqtvxyz'
function nanoid(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(21))
  let id = ''
  for (const b of bytes) id += NANO_ALPHABET[b & 63]
  return id
}

function generateOne(): string {
  let id: string
  switch (variant.value) {
    case 'v4':
      id = uuidV4()
      break
    case 'v7':
      id = uuidV7()
      break
    case 'ulid':
      return ulid()
    case 'nano':
      return nanoid()
  }
  if (!hyphens.value) id = id.replace(/-/g, '')
  if (upper.value) id = id.toUpperCase()
  return id
}

const ids = ref<string[]>([])
function generate() {
  const n = Math.max(1, Math.min(1000, count.value | 0))
  ids.value = Array.from({ length: n }, () => generateOne())
}
generate()

const allText = computed(() => ids.value.join('\n'))
const isUUID = computed(() => variant.value === 'v4' || variant.value === 'v7')
</script>

<template>
  <ToolLayout :tool="tool">
    <div class="space-y-6">
      <div class="grid grid-cols-1 gap-3 sm:grid-cols-4">
        <div class="sm:col-span-2">
          <label class="mb-1.5 block text-xs font-medium text-ink-muted">{{ t({ zh: '类型', en: 'Type' }) }}</label>
          <UiSelect v-model="variant" :options="options" />
        </div>
        <div>
          <label class="mb-1.5 block text-xs font-medium text-ink-muted">{{ t({ zh: '数量', en: 'Count' }) }}</label>
          <UiInput v-model.number="count" type="number" mono />
        </div>
        <div class="flex flex-col justify-end gap-1.5 text-sm">
          <label v-if="isUUID" class="flex items-center gap-2 text-ink-muted">
            <input v-model="hyphens" type="checkbox" class="size-4 rounded border-border text-accent" />
            {{ t({ zh: '保留连字符', en: 'Keep hyphens' }) }}
          </label>
          <label v-if="isUUID" class="flex items-center gap-2 text-ink-muted">
            <input v-model="upper" type="checkbox" class="size-4 rounded border-border text-accent" />
            {{ t({ zh: '大写', en: 'Uppercase' }) }}
          </label>
        </div>
      </div>

      <div class="flex gap-2">
        <UiButton variant="primary" @click="generate">{{ t(UI.generate) }}</UiButton>
        <CopyButton :text="allText" :label="t({ zh: '复制全部', en: 'Copy all' })" />
      </div>

      <div class="overflow-hidden rounded-xl border border-border bg-surface-raised">
        <div class="max-h-[28rem] overflow-auto">
          <ul class="divide-y divide-border font-mono text-sm">
            <li v-for="(id, i) in ids" :key="`${id}-${i}`" class="flex items-center justify-between px-4 py-2.5 text-ink hover:bg-surface-overlay/40">
              <span class="tabular-nums text-xs text-ink-subtle">{{ String(i + 1).padStart(3, '0') }}</span>
              <span class="ml-3 flex-1 break-all">{{ id }}</span>
              <CopyButton :text="id" />
            </li>
          </ul>
        </div>
      </div>
    </div>
  </ToolLayout>
</template>
