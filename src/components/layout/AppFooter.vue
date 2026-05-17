<script setup lang="ts">
import { useI18n } from '@/i18n'
const { t } = useI18n()
const year = new Date().getFullYear()
</script>

<template>
  <footer class="border-t border-border bg-surface">
    <div
      class="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 md:flex-row md:items-center md:justify-between md:px-6"
    >
      <p class="text-sm text-ink-muted">
        {{
          t({
            zh: `© ${year} MyToolBox · MIT License · 完全本地运行,无追踪`,
            en: `© ${year} MyToolBox · MIT License · Runs locally — no tracking, no telemetry`,
          })
        }}
      </p>
      <div class="flex items-center gap-5 text-sm text-ink-muted">
        <a
          href="https://github.com/hiszm/MyToolBox"
          target="_blank"
          rel="noopener noreferrer"
          class="hover:text-ink"
        >
          GitHub
        </a>
        <a
          href="https://github.com/hiszm/MyToolBox/issues/new/choose"
          target="_blank"
          rel="noopener noreferrer"
          class="hover:text-ink"
        >
          {{ t({ zh: '反馈', en: 'Feedback' }) }}
        </a>
        <a
          href="https://github.com/hiszm/MyToolBox/blob/main/CHANGELOG.md"
          target="_blank"
          rel="noopener noreferrer"
          class="hover:text-ink"
        >
          {{ t({ zh: '更新日志', en: 'Changelog' }) }}
        </a>
      </div>
    </div>
  </footer>
</template>
