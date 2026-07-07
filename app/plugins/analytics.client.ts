/**
 * Loads the self-hosted Umami analytics script in production.
 *
 * Umami runs cookieless (no persistent identifiers, anonymised data), which the
 * CNIL exempts from prior consent — so the script loads unconditionally rather
 * than waiting on an opt-in banner.
 */
export default defineNuxtPlugin(() => {
  if (import.meta.server || import.meta.dev) return

  if (document.getElementById('umami-script')) return
  const s = document.createElement('script')
  s.id = 'umami-script'
  s.src = 'https://stats.aaxlo.com/script.js'
  s.defer = true
  s.setAttribute('data-website-id', '1901d0b6-3115-415d-b76e-6d4ef2061f81')
  document.head.appendChild(s)
})
