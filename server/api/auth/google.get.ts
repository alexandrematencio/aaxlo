export default defineOAuthGoogleEventHandler({
  config: {
    scope: ['email', 'profile'],
  },
  async onSuccess(event, { user }) {
    const email: string = user.email
    const isWorkspaceMember = email.endsWith('@aaxlo.com') && user.email_verified === true

    if (!isWorkspaceMember) {
      await clearUserSession(event)
      return sendRedirect(event, '/admin/unauthorized')
    }

    await setUserSession(event, {
      user: {
        email,
        name: user.name,
        picture: user.picture,
      },
      loggedInAt: new Date().toISOString(),
    })

    return sendRedirect(event, '/admin/leads')
  },
  onError(event, error) {
    console.error('[oauth] google error', error)
    return sendRedirect(event, '/admin/unauthorized')
  },
})
