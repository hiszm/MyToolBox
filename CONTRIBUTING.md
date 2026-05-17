# Contributing to MyToolBox

Thanks for your interest in contributing! This document explains how to add a new tool, the conventions we follow, and how the review process works.

## Three rules for new tools

Every tool in MyToolBox must satisfy these three rules. PRs that violate them will be asked to revise.

1. **Local-only** — no backend calls, no third-party APIs, no telemetry. Everything must run in the browser.
2. **Single-purpose** — one tool solves one problem. If a feature has two distinct workflows, split it into two tools.
3. **Bilingual** — both the tool metadata (name, description) and the UI strings must be available in `zh` and `en`.

## Local setup

```bash
git clone https://github.com/hiszm/MyToolBox.git
cd MyToolBox
npm install
npm run dev
```

Required Node.js: ≥ 18

## Adding a new tool

The framework is designed so that **adding a tool is a single-SFC change**.

### 1. Register metadata

Add an entry to `src/data/tools.ts`:

```ts
{
  slug: 'my-new-tool',                       // becomes /tools/my-new-tool
  name: { zh: '我的新工具', en: 'My new tool' },
  description: {
    zh: '简短的中文描述,显示在卡片上',
    en: 'Short English description shown on the card',
  },
  category: 'encoding',                      // one of: encoding | text | data | productivity
  gradient: 'from-cyan-500 to-blue-500',     // tailwind gradient classes for the icon background
  icon: 'sparkles',                          // an existing icon name from src/components/ui/Icon.vue
  addedAt: '2026-05',
  tags: ['some', 'tags'],
  isNew: true,
}
```

If you need a new icon, add a `<g v-else-if="name === '...'">` block to `src/components/ui/Icon.vue` using a 24×24 1.5px-stroke Lucide-style path.

### 2. Create the page

Create `src/pages/tools/my-new-tool.vue`. The minimum scaffold:

```vue
<script setup lang="ts">
import { useRoute } from 'vue-router'
import ToolLayout from '@/components/layout/ToolLayout.vue'
import { useI18n } from '@/i18n'
import type { ToolMeta } from '@/types/tool'

const route = useRoute()
const tool = route.meta.tool as ToolMeta
const { t } = useI18n()
</script>

<template>
  <ToolLayout :tool="tool">
    <!-- your UI here -->
  </ToolLayout>
</template>
```

That's it. The route is auto-registered through `import.meta.glob`.

### 3. Use the design system

Prefer the existing UI primitives in `src/components/ui/`:

- `UiButton` — `primary`, `secondary`, `ghost`, `danger`
- `UiInput`, `UiTextarea`, `UiSelect`
- `UiCard`, `UiBadge`, `UiAlert`
- `CopyButton` — drop-in copy-to-clipboard
- `Icon` — `<Icon name="xxx" class="size-4" />`

Don't reach for `<button class="bg-blue-500 ...">` — the design tokens (`bg-surface`, `bg-accent`, `text-ink-muted`, etc.) keep light/dark mode working without manual work.

### 4. Bilingual strings

Use the `t()` helper from `useI18n()`:

```ts
t({ zh: '清空', en: 'Clear' })
```

For common UI words ("Copy", "Clear", "Input", "Output", "Download"), check `UI` in `src/i18n/index.ts` first.

## Code style

- TypeScript everywhere. Avoid `any`. Use `as const` for literal types.
- Composition API with `<script setup lang="ts">`.
- Tailwind for styling. CSS only when Tailwind genuinely doesn't fit.
- Run `npm run lint` and `npm run format` before pushing.

## Commit messages

We use [Conventional Commits](https://www.conventionalcommits.org/):

```
feat(tool): add base64 encoder
fix(json): handle empty input
docs(readme): update install instructions
chore(deps): bump tailwindcss
```

Common types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `chore`.

## PR checklist

- [ ] Changes follow the three rules (local-only, single-purpose, bilingual)
- [ ] `npm run typecheck` passes
- [ ] `npm run lint` passes with zero warnings
- [ ] Tested in both Chrome and Firefox at desktop and mobile widths
- [ ] Tested both dark and light themes
- [ ] Tested both Chinese and English UI strings
- [ ] No new third-party CDN scripts (use npm deps instead)

## Review SLA

We try to review PRs within 7 days. If your PR is sitting for longer, feel free to ping `@hiszm` directly.

## License

By contributing, you agree that your contributions will be licensed under the [MIT License](./LICENSE).
