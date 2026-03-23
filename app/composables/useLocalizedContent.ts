import type { Collections } from '@nuxt/content'

export function useLocalizedContent(path: string) {
  const { locale } = useI18n()

  return useAsyncData(`content-${path}-${locale.value}`, async () => {
    const collection = ('content_' + locale.value) as keyof Collections
    const content = await queryCollection(collection).path(path).first()

    // Fallback to English if content missing in current locale
    if (!content && locale.value !== 'en') {
      return await queryCollection('content_en').path(path).first()
    }

    return content
  }, {
    watch: [locale],
  })
}
