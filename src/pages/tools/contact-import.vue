<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import ToolLayout from '@/components/layout/ToolLayout.vue'
import UiButton from '@/components/ui/UiButton.vue'
import UiTextarea from '@/components/ui/UiTextarea.vue'
import UiAlert from '@/components/ui/UiAlert.vue'
import { useI18n } from '@/i18n'
import type { ToolMeta } from '@/types/tool'

const route = useRoute()
const tool = route.meta.tool as ToolMeta
const { t } = useI18n()

const names = ref(`蔡一坤
蔡二坤
蔡三坤`)
const phones = ref(`13800000001
13800000002
13800000003`)

const error = ref('')

interface Contact {
  name: string
  phone: string
  valid: boolean
}

function isValidPhone(p: string): boolean {
  return /^\+?\d[\d\s-]{6,20}$/.test(p)
}

const contacts = computed<Contact[]>(() => {
  const ns = names.value.split('\n').map((s) => s.trim()).filter(Boolean)
  const ps = phones.value.split('\n').map((s) => s.trim()).filter(Boolean)
  const len = Math.max(ns.length, ps.length)
  const list: Contact[] = []
  for (let i = 0; i < len; i++) {
    const n = ns[i] ?? ''
    const p = ps[i] ?? ''
    list.push({ name: n, phone: p, valid: Boolean(n) && isValidPhone(p) })
  }
  return list
})

const validCount = computed(() => contacts.value.filter((c) => c.valid).length)

function download() {
  error.value = ''
  const valid = contacts.value.filter((c) => c.valid)
  if (!valid.length) {
    error.value = t({ zh: '没有有效的联系人', en: 'No valid contacts' })
    return
  }
  // CRLF endings — many phone apps require this
  const vcard = valid
    .map((c) => `BEGIN:VCARD\r\nVERSION:3.0\r\nFN:${c.name}\r\nTEL;TYPE=CELL:${c.phone.replace(/\s|-/g, '')}\r\nEND:VCARD`)
    .join('\r\n')
  const blob = new Blob([vcard + '\r\n'], { type: 'text/vcard;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `contacts-${valid.length}.vcf`
  a.click()
  setTimeout(() => URL.revokeObjectURL(url), 200)
}
</script>

<template>
  <ToolLayout :tool="tool">
    <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
      <div class="space-y-2">
        <label class="text-sm font-medium text-ink">{{ t({ zh: '姓名(每行一个)', en: 'Names (one per line)' }) }}</label>
        <UiTextarea v-model="names" :rows="10" />
      </div>
      <div class="space-y-2">
        <label class="text-sm font-medium text-ink">{{ t({ zh: '电话(每行一个,与姓名一一对应)', en: 'Phones (one per line, aligned)' }) }}</label>
        <UiTextarea v-model="phones" :rows="10" />
      </div>
    </div>

    <UiAlert :message="error" class="mt-4" />

    <div class="mt-6">
      <div class="mb-3 flex items-center justify-between">
        <h3 class="text-sm font-medium text-ink">
          {{ t({ zh: '联系人预览', en: 'Preview' }) }}
          <span class="ml-2 text-xs text-ink-subtle">{{ validCount }} / {{ contacts.length }} {{ t({ zh: '有效', en: 'valid' }) }}</span>
        </h3>
        <UiButton variant="primary" :disabled="!validCount" @click="download">
          {{ t({ zh: `下载 .vcf (${validCount})`, en: `Download .vcf (${validCount})` }) }}
        </UiButton>
      </div>

      <div class="overflow-hidden rounded-xl border border-border bg-surface-raised">
        <table class="min-w-full text-left text-sm">
          <thead class="border-b border-border bg-surface-overlay text-xs text-ink-muted">
            <tr>
              <th class="px-3 py-2 font-medium">#</th>
              <th class="px-3 py-2 font-medium">{{ t({ zh: '姓名', en: 'Name' }) }}</th>
              <th class="px-3 py-2 font-medium">{{ t({ zh: '电话', en: 'Phone' }) }}</th>
              <th class="px-3 py-2 font-medium">{{ t({ zh: '状态', en: 'Status' }) }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(c, i) in contacts" :key="i" class="border-b border-border last:border-0">
              <td class="px-3 py-2 text-xs text-ink-subtle">{{ i + 1 }}</td>
              <td class="px-3 py-2">{{ c.name || '—' }}</td>
              <td class="px-3 py-2 font-mono text-xs">{{ c.phone || '—' }}</td>
              <td class="px-3 py-2">
                <span v-if="c.valid" class="text-xs text-green-500">✓ {{ t({ zh: '有效', en: 'OK' }) }}</span>
                <span v-else class="text-xs text-red-500">✗ {{ t({ zh: '格式错误', en: 'invalid' }) }}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="mt-6 rounded-2xl border border-border bg-surface-raised p-5 text-sm text-ink-muted">
        <h4 class="mb-2 text-base font-medium text-ink">{{ t({ zh: '使用说明', en: 'How to import' }) }}</h4>
        <ul class="space-y-1.5">
          <li>· <strong>iOS</strong> — {{ t({ zh: '把 .vcf 作为邮件附件发到 iPhone,点击附件 → 添加全部联系人', en: 'Email the .vcf to your iPhone and tap the attachment → Add All Contacts' }) }}</li>
          <li>· <strong>Android</strong> — {{ t({ zh: '把文件传到手机,通讯录 → 导入 → 选择 .vcf', en: 'Copy the file to your phone, open Contacts → Import → choose the .vcf' }) }}</li>
          <li>· <strong>Google Contacts</strong> — {{ t({ zh: 'contacts.google.com → 导入 → 上传 .vcf', en: 'contacts.google.com → Import → upload the .vcf' }) }}</li>
        </ul>
      </div>
    </div>
  </ToolLayout>
</template>
