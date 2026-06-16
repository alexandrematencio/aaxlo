// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxt/content', '@nuxtjs/i18n', '@nuxtjs/seo'],

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
    head: {
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'theme-color', content: '#24272e' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
        { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
        { rel: 'manifest', href: '/site.webmanifest' },
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
