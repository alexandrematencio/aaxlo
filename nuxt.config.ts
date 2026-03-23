// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxt/content', '@nuxtjs/i18n'],

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
        { name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=1' },
      ],
    },
    pageTransition: {
      name: 'page',
      mode: 'out-in',
    },
  },
})
