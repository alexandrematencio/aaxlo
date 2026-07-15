export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const filters: Parameters<typeof listAuditLeads>[0] = {}

  if (typeof query.status === 'string' && query.status.length > 0) {
    filters.status = query.status
  }
  if (query.hot_lead === 'true') filters.hot_lead = true
  if (query.hot_lead === 'false') filters.hot_lead = false
  if (query.on_hold === 'true') filters.on_hold = true
  if (query.on_hold === 'false') filters.on_hold = false

  const limit = Number(query.limit ?? 100)
  if (Number.isFinite(limit) && limit > 0 && limit <= 500) {
    filters.limit = limit
  }

  const rows = await listAuditLeads(filters)
  return { leads: rows }
})
