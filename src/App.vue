<script setup lang="ts">
import { ref, onErrorCaptured } from 'vue'
import { useRouter, RouterView } from 'vue-router'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
// Initialise the theme composable so it applies the `dark` class on <html>
import { useTheme } from '@/composables/useTheme'

useTheme()

// Surface runtime failures instead of leaving the page silently blank
const runtimeError = ref<string>('')

onErrorCaptured((err) => {
  console.error('[App] captured error in child component:', err)
  runtimeError.value = (err as Error).message || String(err)
  return false
})

const router = useRouter()
router.onError((err) => {
  console.error('[router] navigation error:', err)
  runtimeError.value = (err as Error).message || String(err)
})

function dismiss() {
  runtimeError.value = ''
}
</script>

<template>
  <div class="flex min-h-screen flex-col">
    <AppHeader />
    <main class="flex-1">
      <RouterView />
    </main>
    <AppFooter />

    <!-- Floating error banner — only renders when something has gone wrong -->
    <div
      v-if="runtimeError"
      class="fixed inset-x-4 bottom-4 z-50 mx-auto max-w-2xl rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200 shadow-lg backdrop-blur-md md:inset-x-auto md:right-4"
      role="alert"
    >
      <div class="flex items-start gap-3">
        <span class="select-none">⚠</span>
        <div class="flex-1">
          <div class="font-medium">Runtime error</div>
          <div class="mt-1 break-all font-mono text-xs opacity-80">{{ runtimeError }}</div>
        </div>
        <button
          type="button"
          class="rounded-md px-2 py-1 text-xs hover:bg-red-500/20"
          aria-label="Dismiss"
          @click="dismiss"
        >
          ✕
        </button>
      </div>
    </div>
  </div>
</template>
