<script setup lang="ts">
withDefaults(
  defineProps<{
    as?: 'div' | 'section' | 'article'
    padded?: boolean
    interactive?: boolean
  }>(),
  { as: 'div', padded: true, interactive: false },
)
</script>

<template>
  <component
    :is="as"
    class="rounded-2xl border border-border bg-surface-raised transition-colors"
    :class="[
      padded && 'p-6',
      interactive && 'hover:border-border-strong hover:bg-surface-overlay/40',
    ]"
  >
    <slot />
  </component>
</template>
