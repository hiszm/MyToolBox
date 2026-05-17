<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { useI18n } from '@/i18n'
import Icon from '@/components/ui/Icon.vue'
const { t } = useI18n()
</script>

<template>
  <section class="mx-auto flex max-w-2xl flex-col items-center px-4 py-32 text-center md:px-6">
    <div class="text-7xl font-bold tracking-tighter text-accent/40">404</div>
    <h1 class="mt-4 text-2xl font-semibold text-ink">
      {{ t({ zh: '页面不见了', en: 'Page not found' }) }}
    </h1>
    <p class="mt-3 max-w-md text-ink-muted">
      {{
        t({
          zh: '你访问的工具可能被改名、归档了,或者从未存在过。返回首页看看其他工具吧。',
          en: 'The tool you tried to open might have been renamed, archived, or never existed. Head home and try another one.',
        })
      }}
    </p>
    <RouterLink
      to="/"
      class="mt-8 inline-flex h-11 items-center gap-2 rounded-lg bg-accent px-6 text-sm font-medium text-accent-fg hover:brightness-110"
    >
      <Icon name="arrow-left" class="size-4" />
      {{ t({ zh: '回首页', en: 'Back home' }) }}
    </RouterLink>
  </section>
</template>
