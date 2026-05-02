import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

const root = createRoot(document.getElementById('root'))

root.render(
  <StrictMode>
    <App />
  </StrictMode>,
)

if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      const baseUrl = import.meta.env.BASE_URL
      const registration = await navigator.serviceWorker.register(`${baseUrl}sw.js`)

      await navigator.serviceWorker.ready

      const sameOriginResources = performance
        .getEntriesByType('resource')
        .map((entry) => entry.name)
        .filter((url) => new URL(url).origin === window.location.origin)

      registration.active?.postMessage({
        type: 'CACHE_URLS',
        urls: [baseUrl, `${baseUrl}index.html`, ...sameOriginResources],
      })
    } catch (error) {
      console.warn('ARIA offline support could not be enabled.', error)
    }
  })
}
