<script setup lang="ts">
import { ref, watch } from 'vue'
import { useClipboard } from '@/composables/useClipboard'
import { useI18n, UI } from '@/i18n'
import Icon from '@/components/ui/Icon.vue'

const props = defineProps<{ text: string; label?: string }>()
const { copied, copy } = useClipboard()
const { t } = useI18n()
const _show = ref(false)
function handle() {
  copy(props.text)
}
watch(copied, (v) => (_show.value = v))
</script>

<template>
  <button
    type="button"
    class="inline-flex h-8 items-center gap-1.5 rounded-md border border-border bg-surface-raised px-2.5 text-xs text-ink-muted transition-colors hover:bg-surface-overlay hover:text-ink"
    @click="handle"
  >
    <Icon :name="copied ? 'check' : 'copy'" class="size-3.5" :class="copied ? 'text-green-500' : ''" />
    <span>{{ copied ? t(UI.copied) : label || t(UI.copy) }}</span>
  </button>
</template>
