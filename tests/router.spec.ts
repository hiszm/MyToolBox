import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'

// We use memory history for the test to avoid hash/location complexity.
// The tool list is the same shape the real router consumes.
import { TOOLS } from '@/data/tools'
import App from '@/App.vue'

const toolPages = import.meta.glob('../src/pages/tools/*.vue')

function makeRouter() {
  const toolRoutes = TOOLS.map((t) => {
    const path = `../src/pages/tools/${t.slug}.vue`
    const loader = toolPages[path]
    return {
      path: `/tools/${t.slug}`,
      name: t.slug,
      component: loader ?? (() => import('@/pages/tools/Placeholder.vue')),
      meta: { tool: t },
    }
  })

  return createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/', component: () => import('@/pages/Home.vue') },
      { path: '/about', component: () => import('@/pages/About.vue') },
      ...toolRoutes,
      { path: '/:pathMatch(.*)*', component: () => import('@/pages/NotFound.vue') },
    ],
  })
}

describe('routing', () => {
  it('mounts the Home page on /', async () => {
    const router = makeRouter()
    await router.push('/')
    await router.isReady()
    const wrapper = mount(App, { global: { plugins: [router] } })
    await wrapper.vm.$nextTick()
    expect(wrapper.html()).toContain('MyToolBox')
  })

  it('navigates to text-convert and renders ToolLayout heading', async () => {
    const router = makeRouter()
    await router.push('/tools/text-convert')
    await router.isReady()
    const wrapper = mount(App, { global: { plugins: [router] } })
    // wait a tick for async component to resolve
    await wrapper.vm.$nextTick()
    await new Promise((r) => setTimeout(r, 100))
    await wrapper.vm.$nextTick()
    const html = wrapper.html()
    // The ToolLayout renders the localized tool name as <h1>
    expect(html.toLowerCase()).toContain('text convert')
  })

  it('every registered tool has a matching .vue file', () => {
    const keys = Object.keys(toolPages)
    const missing: string[] = []
    for (const t of TOOLS) {
      const expected = `../src/pages/tools/${t.slug}.vue`
      if (!keys.includes(expected)) missing.push(t.slug)
    }
    expect(missing).toEqual([])
  })
})
