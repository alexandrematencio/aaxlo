// https://nuxt.com/docs/api/configuration/nuxt-config

// Base path piloté par env : '/' en prod (domaine racine / Vercel), '/<repo>/'
// sur GitHub Pages (sous-dossier). Posé par le script predeploy
// (NUXT_APP_BASE_URL=/aaxlo/) — voir package.json. Tout asset absolu
// (favicon, manifest, polices) doit être préfixé par cette base, sinon 404
// sur Pages. Nuxt préfixe déjà automatiquement les chunks `_nuxt/` et les
// <img src> du template, mais PAS les hrefs de head ni les @font-face.
const base = process.env.NUXT_APP_BASE_URL || '/'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxt/content', '@nuxtjs/i18n', '@nuxtjs/seo'],

  // Prod runs as an SSR Node server (Docker) via `nuxt build`. `nuxt generate`
  // (full SSG) is only used for the GitHub Pages demo build. The i18n crawler
  // follows locale-specific blog slugs (e.g. article_b_fr) into placeholder
  // locales where they 404; those routes are genuinely invalid, so we let the
  // Pages build skip them instead of failing. Strict everywhere else.
  ...(base !== '/'
    ? { nitro: { prerender: { failOnError: false } } }
    : {}),

  // Canonical site identity — feeds canonical URLs, OG tags, sitemap and robots.
  site: {
    url: 'https://aaxlo.com',
    name: 'AAXLO',
    defaultLocale: 'en',
  },

  // hreflang + canonical + <html lang> are owned by @nuxtjs/i18n (useLocaleHead in
  // app.vue) to avoid duplicate alternate links; Nuxt SEO handles sitemap/robots/schema/og.
  seo: {
    // i18n already emits canonical + hreflang; let it stay authoritative.
    canonicalLowercase: false,
  },

  // Dynamic OG image generation needs a native renderer (takumi/chromium); we use
  // a branded static default + per-page `seo.ogImage` overrides instead.
  ogImage: { enabled: false },

  // Single source of truth for the Organization identity used in JSON-LD.
  // Avoids duplicate Organization nodes; WebSite/WebPage are auto-generated.
  schemaOrg: {
    identity: {
      type: 'Organization',
      name: 'AAXLO',
      url: 'https://aaxlo.com',
      logo: 'https://aaxlo.com/images/axxlo-logo.svg',
      email: 'hi@aaxlo.com',
    },
  },

  sitemap: {
    // Static routes are auto-discovered with i18n alternates; dynamic blog routes
    // (locale-specific slugs) are supplied by the server source below.
    sources: ['/api/__sitemap__/urls'],
  },

  i18n: {
    locales: [
      { code: 'en', language: 'en-US', name: 'English', file: 'en.json' },
      { code: 'fr', language: 'fr-FR', name: 'Français', file: 'fr.json' },
      { code: 'es', language: 'es-ES', name: 'Español', file: 'es.json' },
      { code: 'de', language: 'de-DE', name: 'Deutsch', file: 'de.json' },
      { code: 'pt', language: 'pt-BR', name: 'Português', file: 'pt.json' },
      { code: 'ru', language: 'ru-RU', name: 'Русский', file: 'ru.json' },
      { code: 'vi', language: 'vi-VN', name: 'Tiếng Việt', file: 'vi.json' },
    ],
    lazy: true,
    defaultLocale: 'en',
    fallbackLocale: 'en',
    strategy: 'prefix',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      redirectOn: 'root',
    },
    baseUrl: 'https://aaxlo.com',
  },

  app: {
    baseURL: base,
    head: {
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'theme-color', content: '#24272e' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: `${base}favicon.ico` },
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: `${base}favicon-32x32.png` },
        { rel: 'icon', type: 'image/png', sizes: '16x16', href: `${base}favicon-16x16.png` },
        { rel: 'apple-touch-icon', sizes: '180x180', href: `${base}apple-touch-icon.png` },
        { rel: 'manifest', href: `${base}site.webmanifest` },
      ],
      // Umami is NOT loaded here. It is injected by app/plugins/analytics.client.ts
      // only after the visitor grants analytics consent (see useConsent).
    },
    pageTransition: {
      name: 'page',
      mode: 'out-in',
    },
  },
})
