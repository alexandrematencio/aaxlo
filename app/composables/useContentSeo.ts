import type { MaybeRefOrGetter } from 'vue'

/**
 * Maps a @nuxt/content document's `seo` frontmatter (with sensible fallbacks to
 * the document's own title/description) onto title + meta description + Open Graph
 * + Twitter card tags via `useSeoMeta`.
 *
 * Pass the reactive content source (the ref returned by `useLocalizedContent` /
 * `useAsyncData`) so titles update on locale switch. Canonical + hreflang are
 * handled separately by @nuxtjs/i18n in app.vue.
 */
const DEFAULT_OG_IMAGE = '/og/aaxlo-default.png'

export function useContentSeo(source: MaybeRefOrGetter<any>) {
  const title = () => {
    const d = toValue(source)
    return d?.seo?.title || d?.title || undefined
  }
  const description = () => {
    const d = toValue(source)
    return d?.seo?.description || d?.description || undefined
  }
  const ogImage = () => {
    const d = toValue(source)
    return d?.seo?.ogImage || DEFAULT_OG_IMAGE
  }

  useSeoMeta({
    title,
    description,
    ogTitle: title,
    ogDescription: description,
    ogImage,
    ogType: 'website',
    twitterCard: 'summary_large_image',
    twitterTitle: title,
    twitterDescription: description,
    twitterImage: ogImage,
  })
}
