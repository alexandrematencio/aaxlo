/**
 * Reduced-motion detection. WCAG 2.3.3 (Animation from Interactions) /
 * 2.2.2 — animations must respect the user's OS-level "reduce motion" setting.
 *
 * `prefersReducedMotion()` is a synchronous one-shot check usable from plain
 * modules (e.g. the GSAP composables) and guards. `usePrefersReducedMotion()`
 * returns a reactive ref that tracks live changes for use inside components.
 */
export function prefersReducedMotion(): boolean {
  if (import.meta.server) return false
  return window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false
}

export function usePrefersReducedMotion() {
  const reduced = ref(false)
  let mq: MediaQueryList | null = null
  const update = () => { reduced.value = mq?.matches ?? false }

  onMounted(() => {
    if (!window.matchMedia) return
    mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    update()
    mq.addEventListener?.('change', update)
  })
  onUnmounted(() => mq?.removeEventListener?.('change', update))

  return reduced
}
