type UmamiEventData = Record<string, string | number | boolean | null | undefined>

declare global {
  interface Window {
    umami?: {
      track: (eventName: string, data?: UmamiEventData) => void
      identify: (sessionId: string, data?: UmamiEventData) => void
    }
  }
}

export function useUmami() {
  const { analyticsAllowed } = useConsent()

  function track(eventName: string, data?: UmamiEventData) {
    if (import.meta.server) return
    // Defence in depth: never emit events without analytics consent, even if
    // the script were present for any reason.
    if (!analyticsAllowed.value) return
    window.umami?.track(eventName, data)
  }
  return { track }
}
