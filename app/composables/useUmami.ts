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
  function track(eventName: string, data?: UmamiEventData) {
    if (import.meta.server) return
    window.umami?.track(eventName, data)
  }
  return { track }
}
