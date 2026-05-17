/**
 * Tool registry types.
 */

export type Locale = 'zh' | 'en'

export interface LocalizedString {
  zh: string
  en: string
}

export type ToolCategory = 'encoding' | 'text' | 'data' | 'productivity'

export interface ToolMeta {
  /** URL slug. Used in routes: /tools/:slug */
  slug: string
  /** Internationalized display name */
  name: LocalizedString
  /** One-line description shown in the tool card */
  description: LocalizedString
  /** Category id */
  category: ToolCategory
  /** Tailwind classes for the icon background gradient */
  gradient: string
  /** SVG icon — single path-style symbol id from /src/components/ui/Icon.vue */
  icon: string
  /** When this tool was added (yyyy-mm) for the "New" badge */
  addedAt: string
  /** Tag list shown under the title */
  tags?: string[]
  /** Whether the tool was newly added vs migrated */
  isNew?: boolean
}
