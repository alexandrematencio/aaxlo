/**
 * RGPD/ePrivacy consent state for non-essential (analytics) cookies.
 *
 * Stored in a first-party `aaxlo_consent` cookie. Analytics (Umami) must stay
 * off until the visitor explicitly opts in. Bumping CONSENT_VERSION re-prompts
 * everyone (e.g. when the cookie inventory changes).
 */
export const CONSENT_VERSION = 1

export interface ConsentState {
  version: number
  analytics: boolean
  timestamp: string
}

export function useConsent() {
  const cookie = useCookie<ConsentState | null>('aaxlo_consent', {
    maxAge: 60 * 60 * 24 * 180, // 180 days
    sameSite: 'lax',
    path: '/',
    default: () => null,
  })

  // Shared reactive state so the banner, the analytics plugin and useUmami all
  // react to the same value within a session.
  const state = useState<ConsentState | null>('aaxlo-consent', () => cookie.value ?? null)

  const decided = computed(() => state.value?.version === CONSENT_VERSION)
  const analyticsAllowed = computed(
    () => state.value?.version === CONSENT_VERSION && state.value.analytics === true,
  )

  function persist(analytics: boolean) {
    const value: ConsentState = {
      version: CONSENT_VERSION,
      analytics,
      timestamp: new Date().toISOString(),
    }
    state.value = value
    cookie.value = value
  }

  const acceptAll = () => persist(true)
  const rejectAll = () => persist(false)

  return { state, decided, analyticsAllowed, acceptAll, rejectAll }
}
