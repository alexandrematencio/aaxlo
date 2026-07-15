export default defineEventHandler(async (event) => {
  const url = event.path || ''

  // Only gate /admin/* and /api/admin/* — leave /admin/unauthorized public
  const isAdminRoute = (url.startsWith('/admin') || url.startsWith('/api/admin'))
    && !url.startsWith('/admin/unauthorized')
  if (!isAdminRoute) return

  const session = await getUserSession(event)
  const email = session?.user?.email
  const isAllowed = typeof email === 'string' && email.endsWith('@aaxlo.com')

  if (!isAllowed) {
    // For API routes, return 401 (browser will get redirected by the page)
    if (url.startsWith('/api/admin')) {
      throw createError({ statusCode: 401, statusMessage: 'unauthorized' })
    }
    // For page routes, kick to OAuth start
    return sendRedirect(event, '/api/auth/google')
  }
})
