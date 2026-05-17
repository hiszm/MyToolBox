import type { ToolMeta } from '@/types/tool'

/**
 * Registry of all tools. Each entry maps to a Vue page lazily loaded by the router.
 *
 * Adding a new tool:
 *   1. Add an entry here
 *   2. Create src/pages/tools/<slug>.vue
 *   3. Add the route in src/router/index.ts (or rely on the auto-generated one)
 */
export const TOOLS: ToolMeta[] = [
  // ───────────────────────────── Encoding & Conversion ─────────────────────────────
  {
    slug: 'text-convert',
    name: { zh: '字符转换', en: 'Text Convert' },
    description: {
      zh: '大小写、驼峰、下划线、短横线之间互转',
      en: 'Convert between case, camelCase, snake_case and kebab-case',
    },
    category: 'encoding',
    gradient: 'from-cyan-500 to-blue-500',
    icon: 'type',
    addedAt: '2024-01',
    tags: ['case', 'string'],
  },
  {
    slug: 'num-to-chinese',
    name: { zh: '数字转中文', en: 'Number to Chinese' },
    description: {
      zh: '把阿拉伯数字转成中文读法,支持万亿大数',
      en: 'Convert Arabic numerals to Chinese readings',
    },
    category: 'encoding',
    gradient: 'from-green-500 to-emerald-500',
    icon: 'languages',
    addedAt: '2024-02',
    tags: ['number', 'chinese'],
  },
  {
    slug: 'timestamp',
    name: { zh: '时间戳格式化', en: 'Timestamp Formatter' },
    description: {
      zh: '毫秒/秒/微秒/纳秒时间戳互转,批量格式化',
      en: 'Convert and format timestamps in ms / s / µs / ns',
    },
    category: 'encoding',
    gradient: 'from-indigo-500 to-violet-500',
    icon: 'clock',
    addedAt: '2024-03',
    tags: ['time', 'unix'],
  },
  {
    slug: 'base64',
    name: { zh: 'Base64 编解码', en: 'Base64 Encode/Decode' },
    description: {
      zh: '字符串和文件的 Base64 编码/解码',
      en: 'Encode and decode strings or files with Base64',
    },
    category: 'encoding',
    gradient: 'from-amber-500 to-orange-500',
    icon: 'binary',
    addedAt: '2026-05',
    tags: ['encode', 'string'],
    isNew: true,
  },
  {
    slug: 'url-encode',
    name: { zh: 'URL 编解码', en: 'URL Encode/Decode' },
    description: {
      zh: 'URL 安全编码、解码,支持 query 解析',
      en: 'URL-safe encode and decode with query parsing',
    },
    category: 'encoding',
    gradient: 'from-pink-500 to-rose-500',
    icon: 'link',
    addedAt: '2026-05',
    tags: ['url', 'encode'],
    isNew: true,
  },
  {
    slug: 'jwt',
    name: { zh: 'JWT 解码', en: 'JWT Decoder' },
    description: {
      zh: '解码 JWT header & payload,本地验签',
      en: 'Decode JWT header & payload and verify signatures locally',
    },
    category: 'encoding',
    gradient: 'from-teal-500 to-cyan-500',
    icon: 'shield',
    addedAt: '2026-05',
    tags: ['jwt', 'token', 'auth'],
    isNew: true,
  },
  {
    slug: 'uuid',
    name: { zh: 'UUID 生成器', en: 'UUID Generator' },
    description: {
      zh: '批量生成 UUID v4 / v7 / ULID',
      en: 'Generate UUID v4 / v7 / ULID in batch',
    },
    category: 'encoding',
    gradient: 'from-purple-500 to-fuchsia-500',
    icon: 'hash',
    addedAt: '2026-05',
    tags: ['uuid', 'id'],
    isNew: true,
  },
  {
    slug: 'hash',
    name: { zh: '哈希计算', en: 'Hash Calculator' },
    description: {
      zh: 'MD5 / SHA-1 / SHA-256 / SHA-512 哈希',
      en: 'MD5 / SHA-1 / SHA-256 / SHA-512 digests',
    },
    category: 'encoding',
    gradient: 'from-red-500 to-orange-500',
    icon: 'fingerprint',
    addedAt: '2026-05',
    tags: ['hash', 'crypto'],
    isNew: true,
  },
  {
    slug: 'qrcode',
    name: { zh: '二维码生成', en: 'QR Code Generator' },
    description: {
      zh: '生成二维码,支持下载 PNG / SVG',
      en: 'Generate QR codes — download as PNG or SVG',
    },
    category: 'encoding',
    gradient: 'from-slate-500 to-zinc-500',
    icon: 'qrcode',
    addedAt: '2026-05',
    tags: ['qrcode', 'image'],
    isNew: true,
  },
  {
    slug: 'color',
    name: { zh: '颜色转换', en: 'Color Converter' },
    description: {
      zh: 'HEX / RGB / HSL 互转,调色板生成',
      en: 'Convert HEX / RGB / HSL and generate palettes',
    },
    category: 'encoding',
    gradient: 'from-fuchsia-500 to-pink-500',
    icon: 'palette',
    addedAt: '2026-05',
    tags: ['color', 'css'],
    isNew: true,
  },

  // ───────────────────────────── Text Processing ─────────────────────────────
  {
    slug: 'json',
    name: { zh: 'JSON 格式化', en: 'JSON Formatter' },
    description: {
      zh: '格式化 / 压缩 / 按 key 提取 JSON 数据',
      en: 'Format, minify and extract values from JSON',
    },
    category: 'text',
    gradient: 'from-emerald-500 to-teal-500',
    icon: 'braces',
    addedAt: '2024-04',
    tags: ['json'],
  },
  {
    slug: 'code-format',
    name: { zh: '代码格式化', en: 'Code Formatter' },
    description: {
      zh: 'SQL / JSON / JavaScript 等多语言格式化',
      en: 'Format SQL / JSON / JavaScript and more',
    },
    category: 'text',
    gradient: 'from-red-500 to-rose-500',
    icon: 'code',
    addedAt: '2024-04',
    tags: ['format', 'code'],
  },
  {
    slug: 'regex',
    name: { zh: '正则测试', en: 'Regex Tester' },
    description: {
      zh: '实时正则匹配、高亮、分组捕获',
      en: 'Live regex matching with highlights and groups',
    },
    category: 'text',
    gradient: 'from-yellow-500 to-amber-500',
    icon: 'search',
    addedAt: '2026-05',
    tags: ['regex', 'string'],
    isNew: true,
  },
  {
    slug: 'doc-diff',
    name: { zh: '文档对比', en: 'Document Diff' },
    description: {
      zh: '逐行对比两段文本/文档差异',
      en: 'Line-by-line diff between two texts or documents',
    },
    category: 'text',
    gradient: 'from-blue-500 to-indigo-500',
    icon: 'diff',
    addedAt: '2024-03',
    tags: ['diff'],
  },
  {
    slug: 'word-cloud',
    name: { zh: '词云生成', en: 'Word Cloud' },
    description: {
      zh: '中文/英文文本词云可视化',
      en: 'Generate word cloud visualization from text',
    },
    category: 'text',
    gradient: 'from-violet-500 to-purple-500',
    icon: 'cloud',
    addedAt: '2024-05',
    tags: ['nlp', 'viz'],
  },

  // ───────────────────────────── Data Tools ─────────────────────────────
  {
    slug: 'set-calc',
    name: { zh: '集合计算器', en: 'Set Calculator' },
    description: {
      zh: '集合的交集、并集、差集计算',
      en: 'Union, intersection and difference for two sets',
    },
    category: 'data',
    gradient: 'from-pink-500 to-purple-500',
    icon: 'set',
    addedAt: '2024-06',
    tags: ['set', 'math'],
  },
  {
    slug: 'hive-sql-merge',
    name: { zh: 'Hive 增量合并', en: 'Hive Incremental Merge' },
    description: {
      zh: '生成 ODS → DW 增量合并 SQL',
      en: 'Generate ODS → DW incremental merge SQL',
    },
    category: 'data',
    gradient: 'from-orange-500 to-red-500',
    icon: 'database',
    addedAt: '2024-04',
    tags: ['hive', 'sql'],
  },
  {
    slug: 'table-diff',
    name: { zh: '表数据比对', en: 'Table Data Diff' },
    description: {
      zh: '主键模式 + MD5 全字段模式,支持 Hive/Spark/Trino',
      en: 'Compare tables by primary key or full-field MD5 — Hive/Spark/Trino',
    },
    category: 'data',
    gradient: 'from-cyan-500 to-teal-500',
    icon: 'rows',
    addedAt: '2024-05',
    tags: ['hive', 'spark', 'trino'],
  },

  // ───────────────────────────── Productivity ─────────────────────────────
  {
    slug: 'contact-import',
    name: { zh: '通讯录生成器', en: 'Contact (vCard) Builder' },
    description: {
      zh: '从姓名+电话批量生成 .vcf,导入手机通讯录',
      en: 'Build a .vcf from names + phones for phone import',
    },
    category: 'productivity',
    gradient: 'from-purple-500 to-indigo-500',
    icon: 'contacts',
    addedAt: '2024-02',
    tags: ['vcard', 'contacts'],
  },
  {
    slug: 'duty-schedule',
    name: { zh: '值班排班表', en: 'Duty Schedule' },
    description: {
      zh: '基于人员列表自动生成轮班日历',
      en: 'Auto-generate rotating duty calendars',
    },
    category: 'productivity',
    gradient: 'from-yellow-500 to-orange-500',
    icon: 'calendar',
    addedAt: '2024-02',
    tags: ['rotation', 'team'],
  },
  {
    slug: 'life-progress',
    name: { zh: '人生进度条', en: 'Life Progress' },
    description: {
      zh: '可视化你的日/周/月/年/人生剩余时间',
      en: 'Visualize day / week / month / year / life remaining',
    },
    category: 'productivity',
    gradient: 'from-pink-500 to-red-500',
    icon: 'progress',
    addedAt: '2024-05',
    tags: ['mindfulness'],
  },
]

export const CATEGORIES = [
  {
    id: 'encoding' as const,
    name: { zh: '编码与转换', en: 'Encoding & Conversion' },
    description: {
      zh: '编码、解码、格式互转,处理日常的数据搬运',
      en: 'Encode, decode, convert between formats',
    },
  },
  {
    id: 'text' as const,
    name: { zh: '文本处理', en: 'Text Processing' },
    description: {
      zh: '文档对比、格式化、正则、词云等文本工具',
      en: 'Diff, format, regex, word cloud and more',
    },
  },
  {
    id: 'data' as const,
    name: { zh: '数据工具', en: 'Data Tools' },
    description: {
      zh: '集合运算、SQL 生成、表数据比对',
      en: 'Set operations, SQL generation, table comparison',
    },
  },
  {
    id: 'productivity' as const,
    name: { zh: '效率工具', en: 'Productivity' },
    description: {
      zh: '通讯录、排班、人生计时',
      en: 'Contacts, rotation, time progress',
    },
  },
] as const
