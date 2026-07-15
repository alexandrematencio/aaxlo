import postgres from 'postgres'

let _sql: ReturnType<typeof postgres> | null = null

function getSql() {
  if (_sql) return _sql
  const config = useRuntimeConfig()
  _sql = postgres({
    host: config.aaxloFunnelDbHost,
    port: Number(config.aaxloFunnelDbPort || 5432),
    database: config.aaxloFunnelDbName,
    user: config.aaxloFunnelDbUser,
    password: config.aaxloFunnelDbPassword,
    ssl: false,
    max: 5,
    idle_timeout: 30,
  })
  return _sql
}

export type AuditLeadInsert = {
  business_name: string
  website_url?: string
  email: string
  phone?: string
  name?: string
  locale: 'en' | 'fr'
  source_cta?: string
}

export type AuditLead = AuditLeadInsert & {
  id: string
  created_at: string
  status: string
  score_gbp: number | null
  score_website: number | null
  score_reviews: number | null
  score_social: number | null
  score_overall: number | null
  drive_doc_url: string | null
  drive_pdf_url: string | null
  on_hold: boolean
  hot_lead: boolean
  pdf_ready_at: string | null
  delivered_at: string | null
}

export async function createAuditLead(data: AuditLeadInsert): Promise<{ id: string }> {
  const sql = getSql()
  const [row] = await sql<{ id: string }[]>`
    INSERT INTO audit_leads (
      business_name, website_url, email, phone, name, locale, source_cta, status
    ) VALUES (
      ${data.business_name},
      ${data.website_url ?? null},
      ${data.email},
      ${data.phone ?? null},
      ${data.name ?? null},
      ${data.locale},
      ${data.source_cta ?? null},
      'queued'
    )
    RETURNING id
  `
  return { id: row.id }
}

export async function getAuditLead(id: string): Promise<AuditLead | null> {
  const sql = getSql()
  const [row] = await sql<AuditLead[]>`
    SELECT * FROM audit_leads WHERE id = ${id}
  `
  return row ?? null
}

type ListFilters = {
  status?: string
  hot_lead?: boolean
  on_hold?: boolean
  limit?: number
}

export async function listAuditLeads(filters: ListFilters = {}): Promise<AuditLead[]> {
  const sql = getSql()
  const conditions: any[] = []
  if (filters.status) conditions.push(sql`status = ${filters.status}`)
  if (filters.hot_lead !== undefined) conditions.push(sql`hot_lead = ${filters.hot_lead}`)
  if (filters.on_hold !== undefined) conditions.push(sql`on_hold = ${filters.on_hold}`)

  const limit = filters.limit ?? 100
  const where = conditions.length > 0
    ? sql`WHERE ${conditions.reduce((a, c) => sql`${a} AND ${c}`)}`
    : sql``

  return await sql<AuditLead[]>`
    SELECT * FROM audit_leads
    ${where}
    ORDER BY created_at DESC
    LIMIT ${limit}
  `
}

type AdminUpdate = {
  on_hold?: boolean
  nurture_halted_reason?: string | null
  converted_at?: string | null
}

export async function updateAuditLeadAdmin(id: string, patch: AdminUpdate): Promise<void> {
  const sql = getSql()
  // Build the SET clause dynamically and safely
  const updates: any[] = []
  if (patch.on_hold !== undefined) updates.push(sql`on_hold = ${patch.on_hold}`)
  if (patch.nurture_halted_reason !== undefined) updates.push(sql`nurture_halted_reason = ${patch.nurture_halted_reason}`)
  if (patch.converted_at !== undefined) {
    updates.push(sql`converted_at = ${patch.converted_at}`)
    updates.push(sql`status = 'converted'`)
  }
  if (updates.length === 0) return
  const setClause = updates.reduce((a, c) => sql`${a}, ${c}`)
  await sql`UPDATE audit_leads SET ${setClause} WHERE id = ${id}`
}
