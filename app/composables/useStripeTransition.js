/**
 * Shared state for the AAXLO stripe page transition.
 * Any component can call navigateWithStripes(to) to trigger
 * the branded diagonal-stripe transition before navigation.
 */
export function useStripeTransition() {
  const isActive = useState('stripeActive', () => false)
  const target = useState('stripeTarget', () => '')

  function navigateWithStripes(to) {
    if (isActive.value) return
    target.value = to
    isActive.value = true
  }

  return { isActive, target, navigateWithStripes }
}
