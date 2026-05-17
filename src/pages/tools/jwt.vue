<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import ToolLayout from '@/components/layout/ToolLayout.vue'
import UiButton from '@/components/ui/UiButton.vue'
import UiTextarea from '@/components/ui/UiTextarea.vue'
import UiAlert from '@/components/ui/UiAlert.vue'
import CopyButton from '@/components/ui/CopyButton.vue'
import { useI18n, UI } from '@/i18n'
import type { ToolMeta } from '@/types/tool'

const route = useRoute()
const tool = route.meta.tool as ToolMeta
const { t } = useI18n()

const example =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6Ik15VG9vbEJveCIsImlhdCI6MTcxNzAwMDAwMCwiZXhwIjoxOTk5OTk5OTk5fQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'
const jwt = ref(example)

interface Decoded {
  header: string
  payload: string
  signature: string
  expIso?: string
  iatIso?: string
  expired?: boolean
}

function base64UrlDecode(input: string): string {
  let s = input.replace(/-/g, '+').replace(/_/g, '/')
  while (s.length % 4) s += '='
  const binary = atob(s)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
  return new TextDecoder().decode(bytes)
}

const error = ref('')
const decoded = computed<Decoded | null>(() => {
  if (!jwt.value.trim()) {
    error.value = ''
    return null
  }
  const parts = jwt.value.trim().split('.')
  if (parts.length !== 3) {
    error.value = t({ zh: 'JWT 必须包含三段(header.payload.signature)', en: 'JWT must have three parts (header.payload.signature)' })
    return null
  }
  try {
    const headerRaw = JSON.parse(base64UrlDecode(parts[0]))
    const payloadRaw = JSON.parse(base64UrlDecode(parts[1]))
    const header = JSON.stringify(headerRaw, null, 2)
    const payload = JSON.stringify(payloadRaw, null, 2)
    const now = Math.floor(Date.now() / 1000)
    error.value = ''
    return {
      header,
      payload,
      signature: parts[2],
      expIso: payloadRaw.exp ? new Date(payloadRaw.exp * 1000).toISOString() : undefined,
      iatIso: payloadRaw.iat ? new Date(payloadRaw.iat * 1000).toISOString() : undefined,
      expired: payloadRaw.exp ? payloadRaw.exp < now : undefined,
    }
  } catch {
    error.value = t({ zh: '解码失败:不是合法的 JWT', en: 'Decode failed — not a valid JWT' })
    return null
  }
})

function example2() {
  jwt.value = example
}
function clear() {
  jwt.value = ''
}
</script>

<template>
  <ToolLayout :tool="tool">
    <div class="space-y-4">
      <div>
        <div class="mb-2 flex items-center justify-between">
          <label class="text-sm font-medium text-ink">{{ t({ zh: 'JWT 令牌', en: 'JWT token' }) }}</label>
          <div class="flex gap-2">
            <UiButton size="sm" variant="secondary" @click="example2">{{ t(UI.loadExample) }}</UiButton>
            <UiButton size="sm" variant="ghost" @click="clear">{{ t(UI.clear) }}</UiButton>
          </div>
        </div>
        <UiTextarea v-model="jwt" :rows="5" placeholder="eyJhbGciOiJIUzI1NiIs..." />
      </div>

      <UiAlert :message="error" />

      <div v-if="decoded" class="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <div class="mb-2 flex items-center justify-between">
            <span class="text-sm font-medium text-ink">Header</span>
            <CopyButton :text="decoded.header" />
          </div>
          <pre class="overflow-auto rounded-xl border border-border bg-surface-raised p-4 font-mono text-xs text-cyan-400"><code>{{ decoded.header }}</code></pre>
        </div>
        <div>
          <div class="mb-2 flex items-center justify-between">
            <span class="text-sm font-medium text-ink">Payload</span>
            <CopyButton :text="decoded.payload" />
          </div>
          <pre class="overflow-auto rounded-xl border border-border bg-surface-raised p-4 font-mono text-xs text-violet-400"><code>{{ decoded.payload }}</code></pre>
        </div>
      </div>

      <div v-if="decoded" class="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div class="rounded-lg border border-border bg-surface-raised p-3">
          <div class="text-xs text-ink-subtle">Issued At (iat)</div>
          <div class="mt-1 font-mono text-sm">{{ decoded.iatIso || '—' }}</div>
        </div>
        <div class="rounded-lg border border-border bg-surface-raised p-3">
          <div class="text-xs text-ink-subtle">Expires At (exp)</div>
          <div class="mt-1 font-mono text-sm">{{ decoded.expIso || '—' }}</div>
        </div>
        <div
          class="rounded-lg border p-3"
          :class="
            decoded.expired === true
              ? 'border-red-500/30 bg-red-500/10'
              : decoded.expired === false
                ? 'border-green-500/30 bg-green-500/10'
                : 'border-border bg-surface-raised'
          "
        >
          <div class="text-xs text-ink-subtle">{{ t({ zh: '状态', en: 'Status' }) }}</div>
          <div class="mt-1 text-sm font-medium">
            <span v-if="decoded.expired === true" class="text-red-500">{{ t({ zh: '已过期', en: 'Expired' }) }}</span>
            <span v-else-if="decoded.expired === false" class="text-green-500">{{ t({ zh: '有效', en: 'Valid' }) }}</span>
            <span v-else class="text-ink-muted">{{ t({ zh: '无 exp 字段', en: 'No exp claim' }) }}</span>
          </div>
        </div>
      </div>

      <div v-if="decoded" class="rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-300">
        {{
          t({
            zh: '⚠️ 本工具仅做解码,不验证签名。永远不要把生产环境的 token 贴到任何在线工具(包括本工具)以外的地方。',
            en: '⚠️ This tool only decodes — it does not verify signatures. Never paste production tokens into any online tool (including this one) hosted on infrastructure you don\'t control.',
          })
        }}
      </div>
    </div>
  </ToolLayout>
</template>
