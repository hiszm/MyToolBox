<script setup lang="ts">
interface Props {
  modelValue?: string
  placeholder?: string
  rows?: number
  disabled?: boolean
  readonly?: boolean
  mono?: boolean
  resize?: 'none' | 'vertical' | 'horizontal' | 'both'
  ariaLabel?: string
}

withDefaults(defineProps<Props>(), {
  modelValue: '',
  rows: 8,
  disabled: false,
  readonly: false,
  mono: true,
  resize: 'vertical',
  placeholder: undefined,
  ariaLabel: undefined,
})

defineEmits<{ (e: 'update:modelValue', v: string): void }>()
</script>

<template>
  <textarea
    :value="modelValue"
    :rows="rows"
    :placeholder="placeholder"
    :disabled="disabled"
    :readonly="readonly"
    :aria-label="ariaLabel"
    class="w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-sm leading-relaxed text-ink placeholder:text-ink-subtle transition-colors focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30 disabled:cursor-not-allowed disabled:opacity-60"
    :class="[
      mono && 'font-mono',
      resize === 'none' && 'resize-none',
      resize === 'vertical' && 'resize-y',
      resize === 'horizontal' && 'resize-x',
      resize === 'both' && 'resize',
    ]"
    @input="$emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
  />
</template>
