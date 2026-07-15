type PatchBody = {
  on_hold?: boolean
  nurture_halted_reason?: 'replied' | 'booked' | null
  mark_converted?: boolean
}

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, statusMessage: 'id required' })

  const body = await readBody<PatchBody>(event)
  const patch: Parameters<typeof updateAuditLeadAdmin>[1] = {}

  if (typeof body.on_hold === 'boolean') patch.on_hold = body.on_hold
  if (body.nurture_halted_reason === 'replied' || body.nurture_halted_reason === 'booked' || body.nurture_halted_reason === null) {
    patch.nurture_halted_reason = body.nurture_halted_reason
  }
  if (body.mark_converted === true) {
    patch.converted_at = new Date().toISOString()
  }

  await updateAuditLeadAdmin(id, patch)
  return { ok: true }
})
