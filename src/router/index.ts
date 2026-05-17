import { createRouter, createWebHashHistory, type RouteRecordRaw } from 'vue-router'
import { TOOLS } from '@/data/tools'

// Vite glob: one lazy loader per file. Each loader resolves to a Vue SFC module
// whose default export is the page component. Vue Router auto-unwraps `.default`,
// but `import.meta.glob` types as `() => Promise<unknown>` so we narrow it.
type PageLoader = () => Promise<unknown>
const toolPages = import.meta.glob('../pages/tools/*.vue') as Record<string, PageLoader>

const toolRoutes: RouteRecordRaw[] = TOOLS.map((t) => {
  const path = `../pages/tools/${t.slug}.vue`
  const loader = toolPages[path]
  if (!loader && import.meta.env.DEV) {
    console.warn(
      `[router] No page module found for tool slug "${t.slug}" — expected ${path}. ` +
        `Falling back to placeholder. Existing keys: ${Object.keys(toolPages).join(', ')}`,
    )
  }
  return {
    path: `/tools/${t.slug}`,
    name: t.slug,
    component: loader ?? (() => import('@/pages/tools/Placeholder.vue')),
    meta: { tool: t },
  }
})

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/pages/Home.vue'),
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('@/pages/About.vue'),
  },
  ...toolRoutes,
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/pages/NotFound.vue'),
  },
]

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(_to, _from, saved) {
    return saved ?? { top: 0 }
  },
})

// Surface lazy-load failures instead of silently swallowing them
router.onError((err) => {
  console.error('[router] navigation failed:', err)
})

export default router
