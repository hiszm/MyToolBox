<script setup lang="ts">
import { useRouter } from 'vue-router'
import Icon from '@/components/ui/Icon.vue'
import UiBadge from '@/components/ui/UiBadge.vue'
import { useI18n, UI } from '@/i18n'
import type { ToolMeta } from '@/types/tool'

interface Props {
  tool: ToolMeta
  /** Optional layout: 'narrow' (default tool page), 'wide' */
  variant?: 'narrow' | 'wide'
}

withDefaults(defineProps<Props>(), { variant: 'narrow' })

const { t } = useI18n()
const router = useRouter()
function goHome() {
  router.push('/')
}
</script>

<template>
  <section class="mx-auto px-4 py-8 md:px-6 md:py-12" :class="variant === 'wide' ? 'max-w-7xl' : 'max-w-5xl'">
    <button
      type="button"
      class="mb-6 inline-flex items-center gap-1.5 rounded-md text-sm text-ink-muted hover:text-ink"
      @click="goHome"
    >
      <Icon name="arrow-left" class="size-4" />
      {{ t(UI.back) }}
    </button>

    <header class="mb-8 flex items-start gap-4">
      <span
        :class="[
          'inline-flex size-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-md',
          tool.gradient,
        ]"
      >
        <Icon :name="tool.icon" class="size-6" />
      </span>
      <div class="flex-1">
        <div class="flex flex-wrap items-center gap-2">
          <h1 class="text-2xl font-semibold tracking-tight text-ink md:text-3xl">{{ t(tool.name) }}</h1>
          <UiBadge v-if="tool.isNew" variant="accent">{{ t(UI.newBadge) }}</UiBadge>
        </div>
        <p class="mt-1.5 text-ink-muted">{{ t(tool.description) }}</p>
        <div v-if="tool.tags?.length" class="mt-3 flex flex-wrap gap-1.5">
          <UiBadge v-for="tag in tool.tags" :key="tag">{{ tag }}</UiBadge>
        </div>
      </div>
    </header>

    <slot />
  </section>
</template>
