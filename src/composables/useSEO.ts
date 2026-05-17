import { watchEffect } from 'vue'

interface SEOOptions {
  title?: string
  description?: string
}

function setMeta(name: string, content: string, attr: 'name' | 'property' = 'name') {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${name}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, name)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

export function useSEO(opts: () => SEOOptions) {
  watchEffect(() => {
    const { title, description } = opts()
    if (title) {
      document.title = title
      setMeta('og:title', title, 'property')
      setMeta('twitter:title', title)
    }
    if (description) {
      setMeta('description', description)
      setMeta('og:description', description, 'property')
      setMeta('twitter:description', description)
    }
  })
}
