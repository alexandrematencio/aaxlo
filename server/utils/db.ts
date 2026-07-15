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

