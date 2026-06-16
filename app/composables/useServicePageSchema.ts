import type { MaybeRefOrGetter } from 'vue'

/**
 * Adds BreadcrumbList + (when present) FAQPage structured data to a service
 * detail page. `serviceKey` maps to the `services_dropdown.<key>` i18n label.
 *
 * Content is awaited before setup, so nodes are built synchronously for correct
 * per-locale SSR output (each locale is its own crawlable URL).
 */
export function useServicePageSchema(svc: MaybeRefOrGetter<any>, serviceKey: string) {
  const { t } = useI18n()
  const localePath = useLocalePath()
  const route = useRoute()

  const s = toValue(svc)
  const nodes: any[] = [
    defineBreadcrumb({
      itemListElement: [
        { name: t('nav.home'), item: localePath('/') },
        { name: t('nav.services'), item: localePath('/services') },
        { name: t(`services_dropdown.${serviceKey}.label`), item: route.path },
      ],
    }),
  ]

  if (Array.isArray(s?.faqs) && s.faqs.length) {
    nodes.push(defineWebPage({ '@type': 'FAQPage' }))
    for (const f of s.faqs) {
      nodes.push(defineQuestion({ name: f.question, acceptedAnswer: f.answer }))
    }
  }

  useSchemaOrg(nodes)
}
