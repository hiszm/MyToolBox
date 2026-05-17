<script setup lang="ts">
import { ref } from 'vue'
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

type Lang = 'json' | 'sql' | 'xml' | 'css' | 'js'
const lang = ref<Lang>('json')
const code = ref(`{"name":"MyToolBox","version":"2.0.0","categories":["text","data","productivity"]}`)
const error = ref('')

const langOptions = [
  { value: 'json' as const, label: 'JSON' },
  { value: 'sql' as const, label: 'SQL' },
  { value: 'xml' as const, label: 'XML / HTML' },
  { value: 'css' as const, label: 'CSS' },
  { value: 'js' as const, label: 'JavaScript' },
]

function formatJson(src: string): string {
  return JSON.stringify(JSON.parse(src), null, 2)
}

function formatSql(src: string): string {
  const keywords = [
    'SELECT', 'FROM', 'WHERE', 'AND', 'OR', 'NOT', 'INSERT', 'INTO', 'VALUES',
    'UPDATE', 'SET', 'DELETE', 'CREATE', 'TABLE', 'ALTER', 'DROP', 'INDEX', 'JOIN',
    'LEFT', 'RIGHT', 'INNER', 'OUTER', 'FULL', 'ON', 'GROUP BY', 'ORDER BY', 'LIMIT',
    'HAVING', 'AS', 'WITH', 'UNION', 'CASE', 'WHEN', 'THEN', 'ELSE', 'END', 'IS NULL',
    'IS NOT NULL', 'IN', 'EXISTS', 'BETWEEN', 'LIKE',
  ]
  let s = src.replace(/\s+/g, ' ').trim()
  for (const kw of keywords) {
    const re = new RegExp(`\\b${kw.replace(/\s/g, '\\s+')}\\b`, 'gi')
    s = s.replace(re, kw)
  }
  // Newline before main clauses
  const newlineBefore = ['FROM', 'WHERE', 'AND', 'OR', 'GROUP BY', 'ORDER BY', 'LIMIT', 'HAVING', 'UNION', 'LEFT JOIN', 'RIGHT JOIN', 'INNER JOIN', 'JOIN', 'ON', 'SET', 'VALUES']
  for (const kw of newlineBefore) {
    const re = new RegExp(`\\s+${kw.replace(/\s/g, '\\s+')}\\b`, 'g')
    s = s.replace(re, `\n${kw}`)
  }
  // Indent fields after SELECT
  s = s.replace(/SELECT\s+/, 'SELECT\n  ')
  s = s.replace(/,(?=[^()]*(?:\(|$))/g, ',\n  ')
  return s
}

function formatXml(src: string): string {
  let formatted = ''
  let indent = 0
  src = src.replace(/>\s*</g, '><').replace(/></g, '>\n<')
  for (const line of src.split('\n')) {
    const trimmed = line.trim()
    if (!trimmed) continue
    if (trimmed.startsWith('</')) indent--
    formatted += '  '.repeat(Math.max(0, indent)) + trimmed + '\n'
    if (trimmed.startsWith('<') && !trimmed.startsWith('</') && !trimmed.endsWith('/>') && !trimmed.includes('</')) indent++
  }
  return formatted.trim()
}

function formatCss(src: string): string {
  return src
    .replace(/\s*{\s*/g, ' {\n  ')
    .replace(/;\s*/g, ';\n  ')
    .replace(/\s*}\s*/g, '\n}\n\n')
    .replace(/\n  \n/g, '\n')
    .replace(/  ([}])/g, '$1')
    .trim()
}

function formatJs(src: string): string {
  let indent = 0
  let out = ''
  let inString: string | null = null
  for (let i = 0; i < src.length; i++) {
    const c = src[i]
    if (inString) {
      out += c
      if (c === inString && src[i - 1] !== '\\') inString = null
      continue
    }
    if (c === '"' || c === "'" || c === '`') {
      inString = c
      out += c
      continue
    }
    if (c === '{' || c === '[') {
      out += c + '\n' + '  '.repeat(++indent)
    } else if (c === '}' || c === ']') {
      indent = Math.max(0, indent - 1)
      out += '\n' + '  '.repeat(indent) + c
    } else if (c === ';') {
      out += c + '\n' + '  '.repeat(indent)
    } else if (c === ',') {
      out += c + '\n' + '  '.repeat(indent)
    } else if (c === '\n' || c === ' ' && (out.endsWith(' ') || out.endsWith('\n'))) {
      // collapse extra whitespace
    } else {
      out += c
    }
  }
  return out.replace(/\n\s*\n/g, '\n').trim()
}

function format() {
  error.value = ''
  try {
    switch (lang.value) {
      case 'json':
        code.value = formatJson(code.value)
        break
      case 'sql':
        code.value = formatSql(code.value)
        break
      case 'xml':
        code.value = formatXml(code.value)
        break
      case 'css':
        code.value = formatCss(code.value)
        break
      case 'js':
        code.value = formatJs(code.value)
        break
    }
  } catch (e) {
    error.value = (e as Error).message
  }
}

function minify() {
  error.value = ''
  if (lang.value === 'json') {
    try {
      code.value = JSON.stringify(JSON.parse(code.value))
      return
    } catch (e) {
      error.value = (e as Error).message
      return
    }
  }
  code.value = code.value.replace(/\s+/g, ' ').trim()
}

function loadExample() {
  const samples: Record<Lang, string> = {
    json: '{"name":"MyToolBox","version":"2.0.0"}',
    sql: 'SELECT id, name, email FROM users WHERE age > 18 AND city = "NYC" ORDER BY name ASC LIMIT 10',
    xml: '<root><user id="1"><name>Aki</name><role>admin</role></user></root>',
    css: 'body{margin:0;padding:0}h1{color:#333;font-size:2rem}',
    js: 'const greet=(name)=>{console.log("Hello, "+name);return name.length>0;};greet("MyToolBox");',
  }
  code.value = samples[lang.value]
}
function clear() {
  code.value = ''
  error.value = ''
}
</script>

<template>
  <ToolLayout :tool="tool" variant="wide">
    <div class="space-y-3">
      <div class="flex flex-wrap items-end gap-3">
        <div class="w-44">
          <label class="mb-1.5 block text-xs font-medium text-ink-muted">{{ t({ zh: '语言', en: 'Language' }) }}</label>
          <UiSelect v-model="lang" :options="langOptions" size="sm" />
        </div>
        <UiButton size="sm" variant="primary" @click="format">{{ t({ zh: '格式化', en: 'Format' }) }}</UiButton>
        <UiButton size="sm" @click="minify">{{ t({ zh: '压缩', en: 'Minify' }) }}</UiButton>
        <UiButton size="sm" variant="ghost" @click="loadExample">{{ t(UI.loadExample) }}</UiButton>
        <UiButton size="sm" variant="ghost" @click="clear">{{ t(UI.clear) }}</UiButton>
        <div class="ml-auto"><CopyButton :text="code" /></div>
      </div>

      <UiAlert :message="error" />

      <UiTextarea v-model="code" :rows="22" />
    </div>
  </ToolLayout>
</template>
