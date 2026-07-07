import { gsap } from 'gsap'
import { prefersReducedMotion } from '~/composables/usePrefersReducedMotion'

/**
 * "The Forge" — cinematic scroll-reveal system.
 *
 * Strategy: sections start with `visibility: hidden` (take up layout space but invisible).
 * When the section enters the viewport (bottom edge), we set visibility to visible,
 * apply the hidden clip-path, and animate to revealed. This prevents blank gaps.
 */

const patterns = {
  'curtain-tear': {
    // 51% overlap past center prevents sub-pixel seam gap
    hidden: 'inset(0 51% 0 51%)',
    revealed: 'inset(0 0% 0 0%)',
  },
  'ignite': {
    hidden: 'circle(0% at 50% 50%)',
    revealed: 'circle(100% at 50% 50%)',
  },
  'crack': {
    hidden: 'polygon(50% 50%, 50% 50%, 50% 50%, 50% 50%)',
    revealed: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
  },
  'breathe': {
    // 51% overlap past center prevents sub-pixel seam gap
    hidden: 'inset(51% 0 51% 0)',
    revealed: 'inset(0% 0 0% 0)',
  },
  'melt': {
    hidden: 'inset(0 0 100% 0)',
    revealed: 'inset(0 0 0% 0)',
  },
  'iris': {
    hidden: 'circle(0% at 50% 80%)',
    revealed: 'circle(100% at 50% 80%)',
  },
  'slash': {
    hidden: 'polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)',
    revealed: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
  },
  'slash-reverse': {
    hidden: 'polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%)',
    revealed: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
  },
}

/**
 * Sets up a scroll-reveal on a DOM element.
 * Uses visibility:hidden instead of clip-path for the initial state,
 * so the element takes up space but doesn't show blank gaps.
 */
export function initScrollReveal(el, pattern = 'curtain-tear', options = {}) {
  if (!el) return

  const {
    duration = 0.8,
    ease = 'power3.inOut',
    delay = 0,
    onRevealed = null,
  } = options

  // Reduced motion: show the section immediately, no clip-path animation.
  if (prefersReducedMotion()) {
    el.style.visibility = 'visible'
    el.style.clipPath = 'none'
    if (onRevealed) onRevealed()
    return
  }

  const config = patterns[pattern] || patterns['curtain-tear']
  let revealed = false

  // Hide visually but keep layout — no blank gaps
  el.style.visibility = 'hidden'

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !revealed) {
          revealed = true

          // Make visible, apply hidden clip-path, then animate to revealed
          el.style.visibility = 'visible'
          gsap.set(el, { clipPath: config.hidden })

          gsap.to(el, {
            clipPath: config.revealed,
            duration,
            ease,
            delay,
            onComplete: () => {
              gsap.set(el, { clipPath: 'none' })
              if (onRevealed) onRevealed()
            },
          })

          observer.disconnect()
        }
      })
    },
    {
      // Trigger when the section's top edge is 50px from entering the viewport bottom
      rootMargin: '0px 0px -50px 0px',
      threshold: 0,
    }
  )

  observer.observe(el)
}

/**
 * Exit compression — section compresses as it scrolls above viewport.
 */
export function initScrollExit(el) {
  if (!el) return

  // Reduced motion: no scroll-driven scale/opacity compression.
  if (prefersReducedMotion()) return

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting && entry.boundingClientRect.top < 0) {
          gsap.to(el, {
            scale: 0.97,
            opacity: 0.3,
            duration: 0.4,
            ease: 'power2.out',
          })
        } else if (entry.isIntersecting) {
          gsap.to(el, {
            scale: 1,
            opacity: 1,
            duration: 0.3,
            ease: 'power2.out',
          })
        }
      })
    },
    { threshold: 0.05 }
  )

  observer.observe(el)
}
