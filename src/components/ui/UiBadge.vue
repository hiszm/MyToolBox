<script setup lang="ts">
withDefaults(
  defineProps<{
    variant?: 'default' | 'accent' | 'success' | 'warning' | 'danger'
    size?: 'sm' | 'md'
  }>(),
  { variant: 'default', size: 'sm' },
)
</script>

<template>
  <span
    class="inline-flex items-center rounded-full border font-medium tracking-tight"
    :class="[
      size === 'sm' ? 'h-5 px-2 text-[10px]' : 'h-6 px-2.5 text-xs',
      variant === 'default' && 'border-border bg-surface-overlay text-ink-muted',
      variant === 'accent' && 'border-accent/30 bg-accent/10 text-accent',
      variant === 'success' && 'border-green-500/30 bg-green-500/10 text-green-500',
      variant === 'warning' && 'border-amber-500/30 bg-amber-500/10 text-amber-500',
      variant === 'danger' && 'border-red-500/30 bg-red-500/10 text-red-500',
    ]"
  >
    <slot />
  </span>
</template>
