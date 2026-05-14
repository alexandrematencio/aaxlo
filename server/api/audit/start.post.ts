import { createAuditLead } from '~/server/utils/db'
import { triggerAuditPipeline } from '~/server/utils/n8n'

type StartBody = {
  business_name?: string
  website_url?: string
  email?: string
  phone?: string
  name?: string
  locale?: string
  source_cta?: string
}

function isValidEmail(s: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s)
}

function isValidUrl(s: string): boolean {
  try { new URL(s); return true } catch { return false }
}

export default defineEventHandler(async (event) => {
  const body = await readBody<StartBody>(event)

  const business_name = (body.business_name || '').trim()
  const email = (body.email || '').trim().toLowerCase()
  const locale = body.locale === 'fr' ? 'fr' : 'en'
  const website_url = (body.website_url || '').trim()
  const phone = (body.phone || '').trim()
  const name = (body.name || '').trim()
  const source_cta = (body.source_cta || '').trim()

  if (business_name.length < 2) {
    throw createError({ statusCode: 400, statusMessage: 'business_name required' })
  }
  if (!isValidEmail(email)) {
    throw createError({ statusCode: 400, statusMessage: 'valid email required' })
  }
  if (website_url && !isValidUrl(website_url)) {
    throw createError({ statusCode: 400, statusMessage: 'website_url must be a valid URL' })
  }

  const { id } = await createAuditLead({
    business_name,
    website_url: website_url || undefined,
    email,
    phone: phone || undefined,
    name: name || undefined,
    locale,
    source_cta: source_cta || undefined,
  })

  triggerAuditPipeline({
    audit_id: id,
    business_name,
    website_url: website_url || undefined,
    email,
    phone: phone || undefined,
    name: name || undefined,
    locale,
  })

  return { audit_id: id }
})
