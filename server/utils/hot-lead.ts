/**
 * Pure function: evaluate whether an audit lead should be flagged hot.
 * Mirrors the logic in the n8n audit_delivery workflow's evaluate_hot_lead node.
 * Kept in sync manually — both encode spec §6 rules.
 */

type AuditRow = {
  gbp_data?: any
  score_overall?: number | null
}

const HOT_VERTICALS = [
  'dentist', 'doctor', 'medical_clinic', 'hospital',
  'lawyer', 'accounting', 'consultant',
  'real_estate_agency', 'insurance_agency',
  'general_contractor', 'roofing_contractor', 'plumber', 'electrician',
]

export function evaluateHotLead(row: AuditRow): { hot: boolean, reason: string | null } {
  const gbp = row.gbp_data || {}
  const reviewCount: number = gbp.user_ratings_total ?? 0
  const types: string[] = Array.isArray(gbp.types) ? gbp.types : []
  const score = row.score_overall ?? null

  if (reviewCount > 50) {
    return { hot: true, reason: `${reviewCount} GBP reviews — established business` }
  }
  const verticalMatch = types.find(t => HOT_VERTICALS.includes(t))
  if (verticalMatch) {
    return { hot: true, reason: `vertical: ${verticalMatch}` }
  }
  if (score !== null && score < 50) {
    return { hot: true, reason: `score ${score} — high pain` }
  }

  let compoundHits = 0
  const reasons: string[] = []
  if (reviewCount >= 100) { compoundHits++; reasons.push(`${reviewCount} reviews`) }
  if (score !== null && score < 60) { compoundHits++; reasons.push(`score ${score}`) }
  if (compoundHits >= 2) {
    return { hot: true, reason: `compound: ${reasons.join(' + ')}` }
  }

  return { hot: false, reason: null }
}
