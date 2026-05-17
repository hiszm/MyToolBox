import { ref, watch } from 'vue'

const STORAGE_KEY = 'mtb:theme'
export type Theme = 'dark' | 'light'

function getInitialTheme(): Theme {
  if (typeof window === 'undefined') return 'dark'
  const stored = localStorage.getItem(STORAGE_KEY) as Theme | null
  if (stored) return stored
  const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches
  return prefersDark ? 'dark' : 'dark' // dark-first
}

const _theme = ref<Theme>(getInitialTheme())

function apply(t: Theme) {
  const root = document.documentElement
  if (t === 'dark') root.classList.add('dark')
  else root.classList.remove('dark')
}

watch(
  _theme,
  (t) => {
    try {
      localStorage.setItem(STORAGE_KEY, t)
    } catch {
      /* ignore */
    }
    apply(t)
  },
  { immediate: true },
)

export function useTheme() {
  function toggle() {
    _theme.value = _theme.value === 'dark' ? 'light' : 'dark'
  }
  return { theme: _theme, toggle }
}
