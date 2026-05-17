<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  modelValue?: string | number
  type?: string
  placeholder?: string
  disabled?: boolean
  readonly?: boolean
  size?: 'sm' | 'md'
  mono?: boolean
  ariaLabel?: string
}

withDefaults(defineProps<Props>(), {
  modelValue: '',
  type: 'text',
  size: 'md',
  disabled: false,
  readonly: false,
  mono: false,
  placeholder: undefined,
  ariaLabel: undefined,
})

defineEmits<{ (e: 'update:modelValue', v: string): void }>()

const sizeClasses = computed(() => '') // placeholder for future
</script>

<template>
  <input
    :type="type"
    :value="modelValue"
    :placeholder="placeholder"
    :disabled="disabled"
    :readonly="readonly"
    :aria-label="ariaLabel"
    class="w-full rounded-lg border border-border bg-surface px-3 text-ink placeholder:text-ink-subtle transition-colors focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30 disabled:cursor-not-allowed disabled:opacity-60"
    :class="[
      size === 'sm' ? 'h-9 text-sm' : 'h-11 text-sm',
      mono && 'font-mono',
      sizeClasses,
    ]"
    @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
  />
</template>
