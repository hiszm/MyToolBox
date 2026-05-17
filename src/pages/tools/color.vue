<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import ToolLayout from '@/components/layout/ToolLayout.vue'
import UiInput from '@/components/ui/UiInput.vue'
import CopyButton from '@/components/ui/CopyButton.vue'
import { useI18n } from '@/i18n'
import type { ToolMeta } from '@/types/tool'

const route = useRoute()
const tool = route.meta.tool as ToolMeta
const { t } = useI18n()

const hex = ref('#6366f1')

interface RGB {
  r: number
  g: number
  b: number
}
interface HSL {
  h: number
  s: number
  l: number
}

function hexToRgb(h: string): RGB | null {
  const s = h.replace('#', '').trim()
  if (s.length === 3) {
    return {
      r: parseInt(s[0] + s[0], 16),
      g: parseInt(s[1] + s[1], 16),
      b: parseInt(s[2] + s[2], 16),
    }
  }
  if (s.length !== 6) return null
  const n = parseInt(s, 16)
  if (Number.isNaN(n)) return null
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 }
}

function rgbToHex(r: number, g: number, b: number): string {
  return (
    '#' +
    [r, g, b]
      .map((v) =>
        Math.max(0, Math.min(255, Math.round(v)))
          .toString(16)
          .padStart(2, '0'),
      )
      .join('')
  )
}

function rgbToHsl(r: number, g: number, b: number): HSL {
  r /= 255
  g /= 255
  b /= 255
  const max = Math.max(r, g, b),
    min = Math.min(r, g, b)
  let h = 0,
    s = 0
  const l = (max + min) / 2
  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0)
        break
      case g:
        h = (b - r) / d + 2
        break
      case b:
        h = (r - g) / d + 4
        break
    }
    h /= 6
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) }
}

const rgb = computed<RGB>(() => hexToRgb(hex.value) || { r: 0, g: 0, b: 0 })
const hsl = computed<HSL>(() => rgbToHsl(rgb.value.r, rgb.value.g, rgb.value.b))

const rgbCss = computed(() => `rgb(${rgb.value.r}, ${rgb.value.g}, ${rgb.value.b})`)
const hslCss = computed(() => `hsl(${hsl.value.h}, ${hsl.value.s}%, ${hsl.value.l}%)`)

function adjust(l: number): string {
  const { r, g, b } = rgb.value
  // Mix the color with white or black based on l offset
  if (l > 0) {
    return rgbToHex(r + (255 - r) * l, g + (255 - g) * l, b + (255 - b) * l)
  } else {
    const a = 1 + l
    return rgbToHex(r * a, g * a, b * a)
  }
}

const palette = computed(() =>
  [-0.45, -0.3, -0.15, 0, 0.15, 0.3, 0.45].map((l) => ({
    weight: l === 0 ? '500' : l < 0 ? String(700 + Math.round(l * -1 * 200)) : String(300 - Math.round(l * 200)),
    color: adjust(l),
  })),
)
</script>

<template>
  <ToolLayout :tool="tool">
    <div class="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_2fr]">
      <div class="space-y-4">
        <div class="rounded-2xl border border-border bg-surface-raised p-6">
          <div class="aspect-square w-full rounded-xl border border-border" :style="{ backgroundColor: hex }" />
          <div class="mt-4 space-y-3">
            <div>
              <label class="mb-1 block text-xs font-medium text-ink-muted">HEX</label>
              <div class="flex gap-2">
                <UiInput v-model="hex" mono />
                <input type="color" :value="hex" class="h-11 w-12 cursor-pointer rounded-lg border border-border" @input="hex = ($event.target as HTMLInputElement).value" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="space-y-4">
        <div class="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div class="rounded-xl border border-border bg-surface-raised p-4">
            <div class="text-xs text-ink-subtle">HEX</div>
            <div class="mt-1 flex items-center justify-between gap-2">
              <code class="font-mono text-sm">{{ hex.toUpperCase() }}</code>
              <CopyButton :text="hex" />
            </div>
          </div>
          <div class="rounded-xl border border-border bg-surface-raised p-4">
            <div class="text-xs text-ink-subtle">RGB</div>
            <div class="mt-1 flex items-center justify-between gap-2">
              <code class="font-mono text-sm">{{ rgbCss }}</code>
              <CopyButton :text="rgbCss" />
            </div>
          </div>
          <div class="rounded-xl border border-border bg-surface-raised p-4">
            <div class="text-xs text-ink-subtle">HSL</div>
            <div class="mt-1 flex items-center justify-between gap-2">
              <code class="font-mono text-sm">{{ hslCss }}</code>
              <CopyButton :text="hslCss" />
            </div>
          </div>
        </div>

        <div>
          <h3 class="mb-3 text-sm font-medium text-ink">{{ t({ zh: '调色板(tint & shade)', en: 'Palette (tints & shades)' }) }}</h3>
          <div class="grid grid-cols-7 overflow-hidden rounded-xl border border-border">
            <button
              v-for="p in palette"
              :key="p.weight"
              type="button"
              class="group flex h-20 items-end justify-center pb-1 text-[10px] font-mono"
              :style="{ backgroundColor: p.color, color: p.weight >= '500' ? '#fff' : '#0a0a0a' }"
              :aria-label="`Use ${p.color}`"
              @click="hex = p.color"
            >
              <span class="opacity-70 transition-opacity group-hover:opacity-100">{{ p.weight }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </ToolLayout>
</template>
