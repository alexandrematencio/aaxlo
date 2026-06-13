<script setup>
import '~/assets/css/main.css'

const { t } = useI18n()

// Self-hosted Switzer @font-face — injected here (not in main.css) because the
// src url() must carry the runtime base path (e.g. '/aaxlo/' on GitHub Pages),
// which a static stylesheet can't pick up. Nuxt does not auto-prefix @font-face.
const fontBase = `${useRuntimeConfig().app.baseURL}fonts`
const switzerWeights = [100, 300, 400, 500, 600, 700, 800]
useHead({
  style: [
    {
      key: 'switzer-fonts',
      innerHTML: switzerWeights
        .map(
          (w) =>
            `@font-face{font-family:'Switzer';src:url('${fontBase}/switzer-${w}.woff2') format('woff2');font-weight:${w};font-style:normal;font-display:swap;}`,
        )
        .join(''),
    },
  ],
})

// i18n owns <html lang/dir>, hreflang alternates and the canonical link.
// Nuxt SEO handles sitemap/robots/schema/og-image instead, so they don't collide.
const i18nHead = useLocaleHead({ dir: true, lang: true, seo: true })

useHead(() => ({
  htmlAttrs: {
    lang: i18nHead.value.htmlAttrs?.lang,
    dir: i18nHead.value.htmlAttrs?.dir,
  },
  link: i18nHead.value.link,
  meta: i18nHead.value.meta,
  // Content `seo.title` values already include the brand suffix (e.g. "About — AAXLO"),
  // so keep titles verbatim rather than appending the site name again.
  titleTemplate: (title) => title || 'AAXLO',
}))

// Organization identity + WebSite/WebPage schema are emitted globally by Nuxt SEO
// (configured via `schemaOrg.identity` in nuxt.config). Per-page schema (Article,
// Breadcrumb, Service, FAQ) is added in the individual pages.
</script>

<template>
  <div id="app-root">
    <a href="#main-content" class="skip-link">{{ t('a11y.skipToContent') }}</a>
    <AppHeader />
    <main id="main-content" tabindex="-1">
      <NuxtPage />
    </main>
    <AppFooter />
    <StripeTransition />
  </div>
</template>

<style>
/* Skip-to-content link — visible only when focused */
.skip-link {
  position: fixed;
  top: -100%;
  left: 16px;
  z-index: 10000;
  padding: 10px 18px;
  background: var(--color-dark);
  color: var(--color-cream);
  font-family: var(--font, sans-serif);
  font-size: 13px;
  font-weight: 600;
  text-decoration: none;
  border-radius: 0 0 4px 4px;
  transition: top 0.2s ease;
}
.skip-link:focus { top: 0; }

/* Programmatic focus target — no visible ring when focused via script */
#main-content:focus { outline: none; }

/* Page transition: cinematic wipe */
.page-enter-active,
.page-leave-active {
  transition: clip-path 0.6s cubic-bezier(0.77, 0, 0.175, 1),
              opacity 0.6s cubic-bezier(0.77, 0, 0.175, 1);
}

.page-enter-from {
  clip-path: inset(0 0 100% 0);
  opacity: 0;
}
.page-enter-to {
  clip-path: inset(0 0 0% 0);
  opacity: 1;
}

.page-leave-from {
  clip-path: inset(0 0 0% 0);
  opacity: 1;
}
.page-leave-to {
  clip-path: inset(100% 0 0 0);
  opacity: 0;
}

/* Reduced motion: drop the page-transition wipe entirely */
@media (prefers-reduced-motion: reduce) {
  .page-enter-active,
  .page-leave-active {
    transition: none !important;
  }
  .page-enter-from,
  .page-leave-to {
    clip-path: none !important;
    opacity: 1 !important;
  }
}
</style>
