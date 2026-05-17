<script setup lang="ts">
import { useI18n } from '@/i18n'
import Icon from '@/components/ui/Icon.vue'

const { t } = useI18n()
</script>

<template>
  <section class="mx-auto max-w-3xl px-4 py-16 md:px-6">
    <h1 class="text-3xl font-semibold tracking-tight text-ink md:text-4xl">
      {{ t({ zh: '关于 MyToolBox', en: 'About MyToolBox' }) }}
    </h1>

    <div class="prose prose-invert mt-8 space-y-6 text-ink-muted">
      <p class="leading-relaxed">
        {{
          t({
            zh: 'MyToolBox 是一个开源的、零依赖后端的浏览器工具集,汇集了开发者和团队日常会用到的 21 个小工具。它从 2024 年作者的个人需求开始,2026 年重构为 Vue 3 + TypeScript 现代架构。',
            en: 'MyToolBox is an open-source, backend-less browser toolbox. It bundles 21 small utilities that developers and teams use day to day. It started as a personal project in 2024 and was rebuilt on Vue 3 + TypeScript in 2026.',
          })
        }}
      </p>

      <h2 class="mt-10 text-lg font-medium text-ink">{{ t({ zh: '设计原则', en: 'Design principles' }) }}</h2>
      <ul class="space-y-2.5 text-sm">
        <li class="flex gap-2"><span class="mt-1 text-accent">·</span>{{ t({ zh: '本地优先 — 所有运算在浏览器里完成', en: 'Local-first — all computation happens in the browser' }) }}</li>
        <li class="flex gap-2"><span class="mt-1 text-accent">·</span>{{ t({ zh: '简洁优先 — 每个工具只解决一个问题', en: 'Single-purpose — every tool solves exactly one problem' }) }}</li>
        <li class="flex gap-2"><span class="mt-1 text-accent">·</span>{{ t({ zh: '零网络请求 — 完全离线可用', en: 'Zero network calls — fully offline-capable' }) }}</li>
        <li class="flex gap-2"><span class="mt-1 text-accent">·</span>{{ t({ zh: '中英双语 — 默认匹配你的浏览器语言', en: 'Bilingual — defaults to your browser language' }) }}</li>
      </ul>

      <h2 class="mt-10 text-lg font-medium text-ink">{{ t({ zh: '技术栈', en: 'Tech stack' }) }}</h2>
      <div class="grid grid-cols-2 gap-2 text-sm sm:grid-cols-3">
        <span class="rounded-md border border-border bg-surface-raised px-3 py-1.5">Vue 3.5</span>
        <span class="rounded-md border border-border bg-surface-raised px-3 py-1.5">TypeScript</span>
        <span class="rounded-md border border-border bg-surface-raised px-3 py-1.5">Vite 5</span>
        <span class="rounded-md border border-border bg-surface-raised px-3 py-1.5">Tailwind CSS</span>
        <span class="rounded-md border border-border bg-surface-raised px-3 py-1.5">Vue Router 4</span>
        <span class="rounded-md border border-border bg-surface-raised px-3 py-1.5">@vueuse/core</span>
      </div>

      <h2 class="mt-10 text-lg font-medium text-ink">{{ t({ zh: '贡献', en: 'Contributing' }) }}</h2>
      <p class="text-sm leading-relaxed">
        {{
          t({
            zh: '欢迎提 issue 或 PR。新工具需符合"本地运行 + 单一职责 + 中英双语"三原则。详见仓库根目录的 CONTRIBUTING.md。',
            en: 'Issues and PRs are welcome. New tools must satisfy "local-only + single-purpose + bilingual". See CONTRIBUTING.md for details.',
          })
        }}
      </p>

      <div class="mt-8 flex flex-wrap gap-3">
        <a
          href="https://github.com/hiszm/MyToolBox"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex h-10 items-center gap-2 rounded-lg border border-border bg-surface-raised px-4 text-sm text-ink hover:bg-surface-overlay"
        >
          <Icon name="github" class="size-4" /> GitHub
        </a>
        <a
          href="https://github.com/hiszm/MyToolBox/issues/new/choose"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex h-10 items-center gap-2 rounded-lg border border-border bg-surface-raised px-4 text-sm text-ink hover:bg-surface-overlay"
        >
          <Icon name="external" class="size-4" /> {{ t({ zh: '提 Issue', en: 'Open an issue' }) }}
        </a>
      </div>
    </div>
  </section>
</template>
