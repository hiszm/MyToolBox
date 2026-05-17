import { ref, computed, watch } from 'vue'
import type { Locale, LocalizedString } from '@/types/tool'

const STORAGE_KEY = 'mtb:lang'

const browserLang = typeof navigator !== 'undefined' && navigator.language.startsWith('zh') ? 'zh' : 'en'
const stored = typeof localStorage !== 'undefined' ? (localStorage.getItem(STORAGE_KEY) as Locale | null) : null

const _locale = ref<Locale>(stored ?? browserLang)

watch(_locale, (v) => {
  try {
    localStorage.setItem(STORAGE_KEY, v)
    document.documentElement.lang = v === 'zh' ? 'zh-CN' : 'en'
  } catch {
    /* SSR / private mode */
  }
})

export function useI18n() {
  const locale = computed({
    get: () => _locale.value,
    set: (v: Locale) => {
      _locale.value = v
    },
  })

  function t(key: LocalizedString | string, fallback?: string): string {
    if (typeof key === 'string') return key
    return key[_locale.value] || fallback || key.zh || ''
  }

  function toggle() {
    _locale.value = _locale.value === 'zh' ? 'en' : 'zh'
  }

  return { locale, t, toggle }
}

// Common UI strings shared across components
export const UI = {
  myToolbox: { zh: 'MyToolBox', en: 'MyToolBox' },
  tagline: {
    zh: '一站式开发者工具集 · 完全本地运行,不收集任何数据',
    en: 'All-in-one developer toolbox — runs entirely in your browser',
  },
  searchPlaceholder: {
    zh: '搜索工具(支持中英文、标签)',
    en: 'Search tools by name, tag or description',
  },
  copy: { zh: '复制', en: 'Copy' },
  copied: { zh: '已复制', en: 'Copied' },
  clear: { zh: '清空', en: 'Clear' },
  reset: { zh: '重置', en: 'Reset' },
  generate: { zh: '生成', en: 'Generate' },
  convert: { zh: '转换', en: 'Convert' },
  download: { zh: '下载', en: 'Download' },
  upload: { zh: '上传', en: 'Upload' },
  paste: { zh: '粘贴', en: 'Paste' },
  loadExample: { zh: '加载示例', en: 'Load Example' },
  input: { zh: '输入', en: 'Input' },
  output: { zh: '输出', en: 'Output' },
  result: { zh: '结果', en: 'Result' },
  options: { zh: '选项', en: 'Options' },
  back: { zh: '返回', en: 'Back' },
  home: { zh: '首页', en: 'Home' },
  about: { zh: '关于', en: 'About' },
  github: { zh: 'GitHub', en: 'GitHub' },
  newBadge: { zh: '新', en: 'New' },
  noResults: { zh: '没有找到匹配的工具', en: 'No tools matched your search' },
  invalidInput: { zh: '输入无效', en: 'Invalid input' },
  category: {
    encoding: { zh: '编码与转换', en: 'Encoding & Conversion' },
    text: { zh: '文本处理', en: 'Text Processing' },
    data: { zh: '数据工具', en: 'Data Tools' },
    productivity: { zh: '效率工具', en: 'Productivity' },
  },
}
