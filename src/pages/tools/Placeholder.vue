<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import ToolLayout from '@/components/layout/ToolLayout.vue'
import { TOOLS } from '@/data/tools'
import type { ToolMeta } from '@/types/tool'
import { useI18n } from '@/i18n'

const route = useRoute()
const { t } = useI18n()
const fallback: ToolMeta = TOOLS[0]
const tool = computed<ToolMeta>(() => (route.meta?.tool as ToolMeta) ?? fallback)
</script>

<template>
  <ToolLayout :tool="tool">
    <div
      class="flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-border bg-surface-raised px-6 py-16 text-center"
    >
      <div class="text-4xl">🚧</div>
      <h2 class="text-lg font-medium text-ink">
        {{ t({ zh: '此工具页面正在搭建中', en: 'This tool page is under construction' }) }}
      </h2>
      <p class="max-w-md text-sm text-ink-muted">
        {{
          t({
            zh: '工具元数据已注册,但对应的页面文件还没创建。请查看仓库 README 跟进进度。',
            en: 'The tool metadata is registered but the page module is not yet wired up. See the README for status.',
          })
        }}
      </p>
    </div>
  </ToolLayout>
</template>
