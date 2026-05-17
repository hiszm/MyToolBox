import { ref } from 'vue'

export function useClipboard() {
  const copied = ref(false)
  let timer: number | undefined

  async function copy(text: string): Promise<boolean> {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text)
      } else {
        const textarea = document.createElement('textarea')
        textarea.value = text
        textarea.style.position = 'fixed'
        textarea.style.opacity = '0'
        document.body.appendChild(textarea)
        textarea.select()
        document.execCommand('copy')
        document.body.removeChild(textarea)
      }
      copied.value = true
      window.clearTimeout(timer)
      timer = window.setTimeout(() => {
        copied.value = false
      }, 1800)
      return true
    } catch {
      return false
    }
  }

  return { copied, copy }
}
