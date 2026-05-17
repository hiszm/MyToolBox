<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import QRCode from 'qrcode'
import ToolLayout from '@/components/layout/ToolLayout.vue'
import UiButton from '@/components/ui/UiButton.vue'
import UiTextarea from '@/components/ui/UiTextarea.vue'
import UiSelect from '@/components/ui/UiSelect.vue'
import UiInput from '@/components/ui/UiInput.vue'
import { useI18n } from '@/i18n'
import type { ToolMeta } from '@/types/tool'

const route = useRoute()
const tool = route.meta.tool as ToolMeta
const { t } = useI18n()

const text = ref('https://hiszm.github.io/MyToolBox/')
const size = ref(320)
const margin = ref(2)
const ec = ref<'L' | 'M' | 'Q' | 'H'>('M')
const fg = ref('#0a0a0a')
const bg = ref('#ffffff')

const ecOptions = [
  { value: 'L' as const, label: 'L — Low (7%)' },
  { value: 'M' as const, label: 'M — Medium (15%)' },
  { value: 'Q' as const, label: 'Q — Quartile (25%)' },
  { value: 'H' as const, label: 'H — High (30%)' },
]

const canvasRef = ref<HTMLCanvasElement | null>(null)
const svgString = ref('')

async function render() {
  if (!text.value || !canvasRef.value) return
  try {
    await QRCode.toCanvas(canvasRef.value, text.value, {
      width: size.value,
      margin: margin.value,
      errorCorrectionLevel: ec.value,
      color: { dark: fg.value, light: bg.value },
    })
    svgString.value = await QRCode.toString(text.value, {
      type: 'svg',
      margin: margin.value,
      errorCorrectionLevel: ec.value,
      color: { dark: fg.value, light: bg.value },
    })
  } catch {
    /* ignored */
  }
}

onMounted(render)
watch([text, size, margin, ec, fg, bg], render)

function downloadPng() {
  const url = canvasRef.value?.toDataURL('image/png')
  if (!url) return
  const a = document.createElement('a')
  a.href = url
  a.download = 'qrcode.png'
  a.click()
}

function downloadSvg() {
  const blob = new Blob([svgString.value], { type: 'image/svg+xml' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'qrcode.svg'
  a.click()
  setTimeout(() => URL.revokeObjectURL(url), 200)
}
</script>

<template>
  <ToolLayout :tool="tool">
    <div class="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
      <div class="space-y-4">
        <div>
          <label class="mb-2 block text-sm font-medium text-ink">{{ t({ zh: '内容', en: 'Content' }) }}</label>
          <UiTextarea v-model="text" :rows="6" />
        </div>

        <div class="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div>
            <label class="mb-1.5 block text-xs font-medium text-ink-muted">{{ t({ zh: '尺寸 (px)', en: 'Size (px)' }) }}</label>
            <UiInput v-model.number="size" type="number" mono />
          </div>
          <div>
            <label class="mb-1.5 block text-xs font-medium text-ink-muted">{{ t({ zh: '留白', en: 'Margin' }) }}</label>
            <UiInput v-model.number="margin" type="number" mono />
          </div>
          <div>
            <label class="mb-1.5 block text-xs font-medium text-ink-muted">{{ t({ zh: '前景色', en: 'Foreground' }) }}</label>
            <input v-model="fg" type="color" class="h-11 w-full cursor-pointer rounded-lg border border-border bg-surface" />
          </div>
          <div>
            <label class="mb-1.5 block text-xs font-medium text-ink-muted">{{ t({ zh: '背景色', en: 'Background' }) }}</label>
            <input v-model="bg" type="color" class="h-11 w-full cursor-pointer rounded-lg border border-border bg-surface" />
          </div>
        </div>

        <div>
          <label class="mb-1.5 block text-xs font-medium text-ink-muted">{{ t({ zh: '容错等级', en: 'Error correction' }) }}</label>
          <UiSelect v-model="ec" :options="ecOptions" />
        </div>
      </div>

      <div class="flex flex-col items-center gap-4">
        <div class="rounded-2xl border border-border bg-white p-4">
          <canvas ref="canvasRef" class="block" />
        </div>
        <div class="flex w-full gap-2">
          <UiButton variant="primary" block @click="downloadPng">PNG</UiButton>
          <UiButton block @click="downloadSvg">SVG</UiButton>
        </div>
      </div>
    </div>
  </ToolLayout>
</template>
