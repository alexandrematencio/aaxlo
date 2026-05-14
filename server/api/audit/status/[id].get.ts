import { getAuditLead } from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, statusMessage: 'id required' })
  if (!/^[0-9a-f-]{36}$/i.test(id)) throw createError({ statusCode: 404, statusMessage: 'not found' })

  const row = await getAuditLead(id)
  if (!row) throw createError({ statusCode: 404, statusMessage: 'not found' })

  // Public-safe projection — never leak email/phone
  return {
    audit_id: row.id,
    status: row.status,
    business_name: row.business_name,
    score_gbp: row.score_gbp,
    score_website: row.score_website,
    score_reviews: row.score_reviews,
    score_social: row.score_social,
    score_overall: row.score_overall,
  }
})
