<script setup lang="ts">
defineProps<{ message?: string }>()
</script>

<template>
  <div
    v-if="message"
    role="alert"
    class="flex items-start gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-500"
  >
    <svg viewBox="0 0 24 24" class="mt-0.5 size-4 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 8v4M12 16h.01" stroke-linecap="round" />
    </svg>
    <span>{{ message }}</span>
  </div>
</template>
