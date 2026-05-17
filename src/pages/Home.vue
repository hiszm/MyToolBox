<script setup lang="ts">
import { computed, ref } from 'vue'
import { RouterLink } from 'vue-router'
import Icon from '@/components/ui/Icon.vue'
import UiBadge from '@/components/ui/UiBadge.vue'
import { TOOLS, CATEGORIES } from '@/data/tools'
import { useI18n, UI } from '@/i18n'

const { t, locale } = useI18n()
const query = ref('')

const filtered = computed(() => {
  const q = query.value.trim().toLowerCase()
  return CATEGORIES.map((cat) => ({
    ...cat,
    tools: TOOLS.filter((tool) => tool.category === cat.id).filter((tool) => {
      if (!q) return true
      const fields = [
        tool.name[locale.value],
        tool.name.zh,
        tool.name.en,
        tool.description[locale.value],
        tool.description.zh,
        tool.description.en,
        tool.slug,
        ...(tool.tags ?? []),
      ]
      return fields.some((f) => f && f.toLowerCase().includes(q))
    }),
  })).filter((cat) => cat.tools.length > 0)
})

const totalCount = computed(() => TOOLS.length)
const newCount = computed(() => TOOLS.filter((t) => t.isNew).length)
</script>

<template>
  <!-- Hero -->
  <section
    class="relative overflow-hidden border-b border-border bg-surface bg-gradient-radial"
  >
    <div
      class="absolute inset-0 bg-grid-pattern bg-grid opacity-40 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_70%)]"
      aria-hidden="true"
    />
    <div class="relative mx-auto max-w-7xl px-4 py-20 md:px-6 md:py-28">
      <div class="mx-auto max-w-3xl text-center">
        <span
          class="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface-raised/60 px-3 py-1 text-xs text-ink-muted backdrop-blur"
        >
          <span class="size-1.5 animate-pulse rounded-full bg-accent" />
          {{ t({ zh: 'v2.0 已发布 · 21 个工具', en: 'v2.0 released — 21 tools' }) }}
        </span>
        <h1
          class="mt-6 text-balance bg-gradient-to-b from-ink to-ink-muted bg-clip-text text-4xl font-bold tracking-tight text-transparent md:text-6xl"
        >
          {{ t({ zh: '一个工具集 ·', en: 'One toolbox.' }) }}
          <br />
          <span class="bg-gradient-to-br from-accent to-fuchsia-400 bg-clip-text text-transparent">{{
            t({ zh: '解决重复劳动', en: 'Stop repeating yourself.' })
          }}</span>
        </h1>
        <p class="mx-auto mt-5 max-w-2xl text-balance text-base text-ink-muted md:text-lg">
          {{
            t({
              zh: '为开发者和团队精心打磨的 21 个浏览器端工具 · 完全本地运行,零网络请求,零数据采集',
              en: '21 carefully crafted browser-side tools for developers and teams — fully local, zero network calls, zero tracking.',
            })
          }}
        </p>

        <div class="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a
            href="#tools"
            class="inline-flex h-11 items-center gap-2 rounded-lg bg-accent px-6 text-sm font-medium text-accent-fg shadow-md transition hover:brightness-110"
          >
            <Icon name="sparkles" class="size-4" />
            {{ t({ zh: '开始使用', en: 'Get started' }) }}
          </a>
          <a
            href="https://github.com/hiszm/MyToolBox"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex h-11 items-center gap-2 rounded-lg border border-border bg-surface-raised px-6 text-sm font-medium text-ink hover:border-border-strong hover:bg-surface-overlay"
          >
            <Icon name="github" class="size-4" />
            {{ t({ zh: '查看源码', en: 'View source' }) }}
          </a>
        </div>

        <dl class="mt-14 grid grid-cols-3 gap-4 text-center">
          <div>
            <dt class="text-3xl font-semibold tabular-nums text-ink">{{ totalCount }}</dt>
            <dd class="mt-1 text-xs text-ink-subtle">{{ t({ zh: '工具数', en: 'Tools' }) }}</dd>
          </div>
          <div>
            <dt class="text-3xl font-semibold tabular-nums text-ink">{{ newCount }}</dt>
            <dd class="mt-1 text-xs text-ink-subtle">{{ t({ zh: 'v2.0 新增', en: 'New in v2.0' }) }}</dd>
          </div>
          <div>
            <dt class="text-3xl font-semibold tabular-nums text-ink">0</dt>
            <dd class="mt-1 text-xs text-ink-subtle">{{ t({ zh: '网络请求', en: 'Network calls' }) }}</dd>
          </div>
        </dl>
      </div>
    </div>
  </section>

  <!-- Search + Tools -->
  <section id="tools" class="mx-auto max-w-7xl px-4 py-14 md:px-6">
    <div class="mx-auto mb-10 max-w-2xl">
      <label class="relative block">
        <span class="sr-only">{{ t(UI.searchPlaceholder) }}</span>
        <span class="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-subtle">
          <Icon name="search" class="size-4" />
        </span>
        <input
          v-model="query"
          type="search"
          :placeholder="t(UI.searchPlaceholder)"
          class="h-12 w-full rounded-xl border border-border bg-surface-raised pl-11 pr-4 text-sm text-ink placeholder:text-ink-subtle transition-colors focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
        />
      </label>
    </div>

    <div v-if="filtered.length === 0" class="rounded-2xl border border-dashed border-border bg-surface-raised p-16 text-center">
      <p class="text-ink-muted">{{ t(UI.noResults) }}</p>
    </div>

    <div v-else class="space-y-12">
      <div v-for="cat in filtered" :key="cat.id">
        <div class="mb-5 flex items-end justify-between">
          <div>
            <h2 class="text-xl font-semibold tracking-tight text-ink md:text-2xl">{{ t(cat.name) }}</h2>
            <p class="mt-1 text-sm text-ink-subtle">{{ t(cat.description) }}</p>
          </div>
          <span class="text-xs text-ink-subtle">{{ cat.tools.length }} {{ t({ zh: '项', en: 'items' }) }}</span>
        </div>
        <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <RouterLink
            v-for="tool in cat.tools"
            :key="tool.slug"
            :to="`/tools/${tool.slug}`"
            class="group flex flex-col rounded-2xl border border-border bg-surface-raised p-5 transition-all hover:-translate-y-0.5 hover:border-border-strong hover:bg-surface-overlay/30 hover:shadow-lg"
          >
            <div class="mb-4 flex items-center justify-between">
              <span
                :class="[
                  'inline-flex size-10 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-sm',
                  tool.gradient,
                ]"
              >
                <Icon :name="tool.icon" class="size-5" />
              </span>
              <UiBadge v-if="tool.isNew" variant="accent">{{ t(UI.newBadge) }}</UiBadge>
            </div>
            <h3 class="text-base font-medium tracking-tight text-ink">{{ t(tool.name) }}</h3>
            <p class="mt-1 line-clamp-2 text-sm text-ink-muted">{{ t(tool.description) }}</p>
            <div class="mt-4 flex items-center justify-between text-xs text-ink-subtle">
              <div class="flex gap-1.5">
                <span v-for="tag in (tool.tags || []).slice(0, 2)" :key="tag" class="rounded bg-surface-overlay px-1.5 py-0.5 font-mono">{{ tag }}</span>
              </div>
              <span class="inline-flex items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
                {{ t({ zh: '打开', en: 'Open' }) }}
                <Icon name="arrow-right" class="size-3.5" />
              </span>
            </div>
          </RouterLink>
        </div>
      </div>
    </div>
  </section>

  <!-- Features -->
  <section class="border-t border-border bg-surface-raised/30">
    <div class="mx-auto max-w-7xl px-4 py-16 md:px-6">
      <div class="mx-auto mb-12 max-w-2xl text-center">
        <h2 class="text-2xl font-semibold tracking-tight text-ink md:text-3xl">
          {{ t({ zh: '为什么选择 MyToolBox', en: 'Why MyToolBox' }) }}
        </h2>
      </div>
      <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div class="rounded-2xl border border-border bg-surface p-6">
          <Icon name="shield" class="size-5 text-accent" />
          <h3 class="mt-3 text-base font-medium text-ink">{{ t({ zh: '隐私优先', en: 'Privacy first' }) }}</h3>
          <p class="mt-1 text-sm text-ink-muted">
            {{
              t({
                zh: '所有计算在你的浏览器里完成,数据从未离开设备',
                en: 'Everything happens in your browser. Your data never leaves the device.',
              })
            }}
          </p>
        </div>
        <div class="rounded-2xl border border-border bg-surface p-6">
          <Icon name="sparkles" class="size-5 text-accent" />
          <h3 class="mt-3 text-base font-medium text-ink">{{ t({ zh: '现代技术栈', en: 'Modern stack' }) }}</h3>
          <p class="mt-1 text-sm text-ink-muted">
            {{
              t({
                zh: 'Vue 3 + TypeScript + Vite,代码可读、可贡献,工具按需懒加载',
                en: 'Vue 3 + TypeScript + Vite. Readable code, easy to contribute, lazy-loaded tools.',
              })
            }}
          </p>
        </div>
        <div class="rounded-2xl border border-border bg-surface p-6">
          <Icon name="github" class="size-5 text-accent" />
          <h3 class="mt-3 text-base font-medium text-ink">{{ t({ zh: '开源 & 免费', en: 'Open source & free' }) }}</h3>
          <p class="mt-1 text-sm text-ink-muted">
            {{
              t({
                zh: 'MIT 协议,无广告,无追踪,无套路。欢迎 PR 加新工具',
                en: 'MIT-licensed. No ads, no tracking, no gimmicks. Pull requests welcome.',
              })
            }}
          </p>
        </div>
      </div>
    </div>
  </section>
</template>
