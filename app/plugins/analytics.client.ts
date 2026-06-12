/**
 * Loads the self-hosted Umami analytics script ONLY after the visitor has
 * granted analytics consent, and only in production. Nothing is requested from
 * stats.aaxlo.com before opt-in (RGPD/ePrivacy: prior consent for non-essential
 * cookies).
 */
export default defineNuxtPlugin(() => {
  if (import.meta.server || import.meta.dev) return

  const { analyticsAllowed } = useConsent()

  function loadUmami() {
    if (document.getElementById('umami-script')) return
    const s = document.createElement('script')
    s.id = 'umami-script'
    s.src = 'https://stats.aaxlo.com/script.js'
    s.defer = true
    s.setAttribute('data-website-id', '1901d0b6-3115-415d-b76e-6d4ef2061f81')
    document.head.appendChild(s)
  }

  watch(
    analyticsAllowed,
    (allowed) => {
      if (allowed) loadUmami()
    },
    { immediate: true },
  )
})
