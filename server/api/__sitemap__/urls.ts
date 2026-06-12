import { defineSitemapEventHandler } from '#imports'
import { queryCollection } from '@nuxt/content/server'
import type { Collections } from '@nuxt/content'

// Locales that ship real content. Blog slugs differ per locale
// (e.g. /en/blog/article_b_en vs /fr/blog/article_b_fr), so the sitemap's
// automatic i18n route multiplication cannot derive them — we enumerate
// each locale's actual blog documents here.
const LOCALES = ['en', 'fr'] as const

export default defineSitemapEventHandler(async (event) => {
  const urls = []

  for (const locale of LOCALES) {
    const collection = ('content_' + locale) as keyof Collections
    const docs = await queryCollection(event, collection)
      .where('path', 'LIKE', '/blog/%')
      .all()

    for (const doc of docs as Array<{ path?: string; date?: string }>) {
      if (!doc.path) continue
      urls.push({
        loc: `/${locale}${doc.path}`,
        lastmod: doc.date || undefined,
        changefreq: 'monthly',
        priority: 0.7,
      })
    }
  }

  return urls
})
