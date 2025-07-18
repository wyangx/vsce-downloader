const id = import.meta.env.VITE_UMAMI_WEBSITE_ID
const src = import.meta.env.VITE_UMAMI_SCRIPT_SRC

export const useUmami = () => {
  if (!id || !src) return

  if (import.meta.env.PROD) {
    const script = document.createElement('script')
    script.defer = true
    script.src = src
    script.setAttribute('data-website-id', id)
    document.head.appendChild(script)
  }
}
