<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import ToolLayout from '@/components/layout/ToolLayout.vue'
import UiInput from '@/components/ui/UiInput.vue'
import UiTextarea from '@/components/ui/UiTextarea.vue'
import UiAlert from '@/components/ui/UiAlert.vue'
import { useI18n } from '@/i18n'
import type { ToolMeta } from '@/types/tool'

const route = useRoute()
const tool = route.meta.tool as ToolMeta
const { t } = useI18n()

const pattern = ref('(\\w+)@(\\w+)\\.(\\w+)')
const flags = ref('g')
const text = ref(`联系我们:
support@mytoolbox.dev
hello@anthropic.com
Send any feedback to dev+feedback@example.org!`)

const error = ref('')
const matches = ref<{ match: string; index: number; groups: string[] }[]>([])

function highlight(): string {
  error.value = ''
  matches.value = []
  if (!pattern.value || !text.value) return text.value
  try {
    const re = new RegExp(pattern.value, flags.value.includes('g') ? flags.value : flags.value + 'g')
    let out = ''
    let last = 0
    let m: RegExpExecArray | null
    while ((m = re.exec(text.value)) !== null) {
      out += escape(text.value.slice(last, m.index))
      out += `<mark class="rounded bg-accent/30 px-0.5 text-accent">${escape(m[0])}</mark>`
      last = m.index + m[0].length
      matches.value.push({ match: m[0], index: m.index, groups: m.slice(1) })
      if (m.index === re.lastIndex) re.lastIndex++ // avoid infinite loop on zero-length
    }
    out += escape(text.value.slice(last))
    return out
  } catch (e) {
    error.value = (e as Error).message
    return escape(text.value)
  }
}

function escape(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\n/g, '<br>')
}

const rendered = computed(highlight)

const allFlags = ['g', 'i', 'm', 's', 'u', 'y']
function toggleFlag(f: string) {
  if (flags.value.includes(f)) flags.value = flags.value.replace(f, '')
  else flags.value += f
}
</script>

<template>
  <ToolLayout :tool="tool">
    <div class="space-y-4">
      <div class="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_auto]">
        <div>
          <label class="mb-1.5 block text-xs font-medium text-ink-muted">{{ t({ zh: '正则表达式', en: 'Regular expression' }) }}</label>
          <UiInput v-model="pattern" mono />
        </div>
        <div>
          <label class="mb-1.5 block text-xs font-medium text-ink-muted">{{ t({ zh: '标志', en: 'Flags' }) }}</label>
          <div class="flex h-11 items-center gap-1 rounded-lg border border-border bg-surface px-2">
            <button
              v-for="f in allFlags"
              :key="f"
              type="button"
              class="size-7 rounded font-mono text-sm transition-colors"
              :class="
                flags.includes(f)
                  ? 'bg-accent text-accent-fg'
                  : 'text-ink-muted hover:bg-surface-overlay hover:text-ink'
              "
              @click="toggleFlag(f)"
            >
              {{ f }}
            </button>
          </div>
        </div>
      </div>

      <UiAlert :message="error" />

      <div>
        <label class="mb-1.5 block text-xs font-medium text-ink-muted">{{ t({ zh: '测试文本', en: 'Test string' }) }}</label>
        <UiTextarea v-model="text" :rows="6" />
      </div>

      <div>
        <div class="mb-1.5 flex items-center justify-between">
          <span class="text-xs font-medium text-ink-muted">{{ t({ zh: '匹配结果', en: 'Highlighted matches' }) }}</span>
          <span class="text-xs text-ink-subtle">{{ matches.length }} {{ t({ zh: '处匹配', en: 'matches' }) }}</span>
        </div>
        <div
          class="min-h-32 whitespace-pre-wrap break-all rounded-xl border border-border bg-surface-raised p-4 font-mono text-sm leading-relaxed"
          v-html="rendered"
        />
      </div>

      <div v-if="matches.length" class="overflow-hidden rounded-xl border border-border bg-surface-raised">
        <table class="min-w-full text-left text-sm">
          <thead class="border-b border-border bg-surface-overlay text-xs text-ink-muted">
            <tr>
              <th class="px-3 py-2 font-medium">#</th>
              <th class="px-3 py-2 font-medium">Match</th>
              <th class="px-3 py-2 font-medium">Index</th>
              <th class="px-3 py-2 font-medium">Groups</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(m, i) in matches" :key="i" class="border-b border-border last:border-0">
              <td class="px-3 py-2 text-xs text-ink-subtle">{{ i + 1 }}</td>
              <td class="px-3 py-2 font-mono text-xs text-accent">{{ m.match }}</td>
              <td class="px-3 py-2 font-mono text-xs text-ink-muted">{{ m.index }}</td>
              <td class="px-3 py-2 font-mono text-xs text-ink-muted">{{ m.groups.join(' · ') || '—' }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </ToolLayout>
</template>
