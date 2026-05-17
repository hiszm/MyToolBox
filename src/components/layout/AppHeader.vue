<script setup lang="ts">
import { RouterLink } from 'vue-router'
import Icon from '@/components/ui/Icon.vue'
import { useTheme } from '@/composables/useTheme'
import { useI18n, UI } from '@/i18n'

const { theme, toggle: toggleTheme } = useTheme()
const { locale, t, toggle: toggleLang } = useI18n()
</script>

<template>
  <header class="sticky top-0 z-30 border-b border-border bg-surface/85 backdrop-blur-lg">
    <div class="mx-auto flex h-14 max-w-7xl items-center justify-between gap-4 px-4 md:px-6">
      <RouterLink
        to="/"
        class="flex items-center gap-2 font-semibold tracking-tight text-ink hover:text-accent"
        aria-label="MyToolBox home"
      >
        <span
          class="inline-flex size-7 items-center justify-center rounded-md bg-gradient-to-br from-indigo-500 to-violet-500 text-white shadow-sm"
        >
          <Icon name="sparkles" class="size-4" />
        </span>
        <span class="text-base">MyToolBox</span>
        <span class="hidden text-xs font-normal text-ink-subtle md:inline">/ v2.0</span>
      </RouterLink>

      <nav class="hidden items-center gap-1 md:flex">
        <RouterLink
          to="/"
          class="rounded-md px-3 py-1.5 text-sm text-ink-muted hover:bg-surface-overlay hover:text-ink"
          active-class="text-ink"
        >
          {{ t(UI.home) }}
        </RouterLink>
        <RouterLink
          to="/about"
          class="rounded-md px-3 py-1.5 text-sm text-ink-muted hover:bg-surface-overlay hover:text-ink"
          active-class="text-ink"
        >
          {{ t(UI.about) }}
        </RouterLink>
        <a
          href="https://github.com/hiszm/MyToolBox"
          target="_blank"
          rel="noopener noreferrer"
          class="rounded-md px-3 py-1.5 text-sm text-ink-muted hover:bg-surface-overlay hover:text-ink"
        >
          {{ t(UI.github) }}
        </a>
      </nav>

      <div class="flex items-center gap-1">
        <button
          type="button"
          class="inline-flex size-9 items-center justify-center rounded-md text-ink-muted hover:bg-surface-overlay hover:text-ink"
          :aria-label="locale === 'zh' ? 'Switch to English' : '切换到中文'"
          @click="toggleLang"
        >
          <span class="text-xs font-medium tabular-nums">{{ locale === 'zh' ? 'EN' : '中' }}</span>
        </button>
        <button
          type="button"
          class="inline-flex size-9 items-center justify-center rounded-md text-ink-muted hover:bg-surface-overlay hover:text-ink"
          :aria-label="theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'"
          @click="toggleTheme"
        >
          <Icon v-if="theme === 'dark'" name="sun" class="size-4" />
          <Icon v-else name="moon" class="size-4" />
        </button>
        <a
          href="https://github.com/hiszm/MyToolBox"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex size-9 items-center justify-center rounded-md text-ink-muted hover:bg-surface-overlay hover:text-ink"
          aria-label="GitHub repository"
        >
          <Icon name="github" class="size-4" />
        </a>
      </div>
    </div>
  </header>
</template>
