<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  block?: boolean
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'secondary',
  size: 'md',
  type: 'button',
  disabled: false,
  block: false,
  loading: false,
})

defineEmits<{ (e: 'click', ev: MouseEvent): void }>()

const classes = computed(() => {
  const base =
    'relative inline-flex items-center justify-center font-medium tracking-tight ' +
    'rounded-lg transition-all duration-150 select-none ' +
    'focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface ' +
    'disabled:cursor-not-allowed disabled:opacity-50'

  const sizes = {
    sm: 'h-8 px-3 text-sm gap-1.5',
    md: 'h-10 px-4 text-sm gap-2',
    lg: 'h-12 px-6 text-base gap-2',
  }

  const variants = {
    primary:
      'bg-accent text-accent-fg shadow-sm hover:brightness-110 active:brightness-95',
    secondary:
      'border border-border bg-surface-raised text-ink hover:bg-surface-overlay hover:border-border-strong active:bg-surface',
    ghost: 'text-ink-muted hover:bg-surface-overlay hover:text-ink',
    danger:
      'bg-red-500 text-white hover:bg-red-600 active:bg-red-700 shadow-sm',
  }

  return [base, sizes[props.size], variants[props.variant], props.block && 'w-full'].filter(Boolean).join(' ')
})
</script>

<template>
  <button :type="type" :disabled="disabled || loading" :class="classes" @click="$emit('click', $event)">
    <span v-if="loading" class="absolute inset-0 flex items-center justify-center">
      <span class="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
    </span>
    <span :class="{ 'opacity-0': loading }" class="flex items-center gap-2">
      <slot />
    </span>
  </button>
</template>
