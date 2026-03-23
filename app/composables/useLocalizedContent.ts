import type { Collections } from '@nuxt/content'

export function useLocalizedContent(path: string) {
  const { locale } = useI18n()

  return useAsyncData(`content-${path}-${locale.value}`, async () => {
    const collection = ('content_' + locale.value) as keyof Collections
    let content = await queryCollection(collection).path(path).first()

    // Fallback to English if content missing in current locale
    if (!content && locale.value !== 'en') {
      content = await queryCollection('content_en').path(path).first()
    }

    if (!content) return null

    // Nuxt Content v3 stores custom frontmatter fields (not in schema) under `meta`.
    // Spread meta into top-level so components can access e.g. `data?.hero` directly.
    const { meta, ...rest } = content as any
    return { ...rest, ...(meta || {}) }
  }, {
    watch: [locale],
  })
}
