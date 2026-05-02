import { defineContentConfig, defineCollection, z } from '@nuxt/content'

const commonSchema = z.object({
  // Blog article frontmatter (declared at top level so it's queryable
  // via .where() and accessible directly on the result, not under `meta`)
  title: z.string().optional(),
  description: z.string().optional(),
  date: z.string().optional(),
  author: z.string().optional(),
  category: z.string().optional(),
  readTime: z.string().optional(),
  seo: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    ogImage: z.string().optional(),
  }).optional(),
})

export default defineContentConfig({
  collections: {
    content_en: defineCollection({
      type: 'page',
      source: { include: 'en/**', prefix: '/' },
      schema: commonSchema,
    }),
    content_fr: defineCollection({
      type: 'page',
      source: { include: 'fr/**', prefix: '/' },
      schema: commonSchema,
    }),
    content_es: defineCollection({
      type: 'page',
      source: { include: 'es/**', prefix: '/' },
      schema: commonSchema,
    }),
    content_de: defineCollection({
      type: 'page',
      source: { include: 'de/**', prefix: '/' },
      schema: commonSchema,
    }),
    content_pt: defineCollection({
      type: 'page',
      source: { include: 'pt/**', prefix: '/' },
      schema: commonSchema,
    }),
    content_ru: defineCollection({
      type: 'page',
      source: { include: 'ru/**', prefix: '/' },
      schema: commonSchema,
    }),
    content_vi: defineCollection({
      type: 'page',
      source: { include: 'vi/**', prefix: '/' },
      schema: commonSchema,
    }),
  },
})
