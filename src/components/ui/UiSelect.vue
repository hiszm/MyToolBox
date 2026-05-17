<script setup lang="ts" generic="T extends string | number">
interface Option {
  label: string
  value: T
}

interface Props {
  modelValue: T
  options: Option[]
  size?: 'sm' | 'md'
  disabled?: boolean
  ariaLabel?: string
}

withDefaults(defineProps<Props>(), {
  size: 'md',
  disabled: false,
  ariaLabel: undefined,
})

defineEmits<{ (e: 'update:modelValue', v: T): void }>()
</script>

<template>
  <select
    :value="modelValue"
    :disabled="disabled"
    :aria-label="ariaLabel"
    class="w-full rounded-lg border border-border bg-surface px-3 pr-8 text-ink transition-colors focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30 disabled:cursor-not-allowed disabled:opacity-60"
    :class="size === 'sm' ? 'h-9 text-sm' : 'h-11 text-sm'"
    @change="$emit('update:modelValue', ($event.target as HTMLSelectElement).value as T)"
  >
    <option v-for="opt in options" :key="String(opt.value)" :value="opt.value">{{ opt.label }}</option>
  </select>
</template>
