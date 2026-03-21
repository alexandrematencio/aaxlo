<script setup>
import { gsap } from 'gsap'

const STRIPE_COUNT = 160

const { isActive, target } = useStripeTransition()
const overlay = ref(null)

watch(isActive, async (active) => {
  if (!active || !overlay.value) return

  const el = overlay.value
  const darkStripes = el.querySelectorAll('.st-dark')
  const lightStripes = el.querySelectorAll('.st-light')
  const allStripes = el.querySelectorAll('.st-stripe')

  // ── Reset all stripes ──
  gsap.set(allStripes, { scaleY: 0, y: 0, yPercent: 0, opacity: 1, rotation: 0 })
  // Dark stripes grow from bottom (transform-origin: bottom)
  gsap.set(darkStripes, { transformOrigin: 'center bottom' })
  // Light stripes grow from top (transform-origin: top)
  gsap.set(lightStripes, { transformOrigin: 'center top' })
  gsap.set(el, { visibility: 'visible', pointerEvents: 'all' })

  // ══════════════════════════════════════════════════════
  // PHASE 1 — COVER
  // Dark stripes (odd): grow UP from bottom-left toward top-right
  // Light stripes (even): grow DOWN from top-right toward bottom-left
  // Both groups meet in the middle to fully cover the screen
  // ══════════════════════════════════════════════════════
  await new Promise((resolve) => {
    const tl = gsap.timeline({ onComplete: resolve })

    // Dark stripes: scaleY 0→1 from bottom, staggered
    tl.to(darkStripes, {
      scaleY: 1,
      duration: 0.45,
      stagger: 0.003,
      ease: 'power3.inOut',
    })

    // Light stripes: scaleY 0→1 from top, staggered (slight delay for weave effect)
    tl.to(lightStripes, {
      scaleY: 1,
      duration: 0.45,
      stagger: 0.003,
      ease: 'power3.inOut',
    }, 0.06)
  })

  // ══════════════════════════════════════════════════════
  // PHASE 2 — NAVIGATE
  // ══════════════════════════════════════════════════════
  await navigateTo(target.value)
  await nextTick()

  // Brief hold
  await new Promise((resolve) => gsap.delayedCall(0.1, resolve))

  // ══════════════════════════════════════════════════════
  // PHASE 3 — REVEAL: "curtain tear"
  //
  // Creative concept: the stripe wall cracks open from the center
  // seam, peeling outward like two curtain halves being ripped apart.
  //
  // - Center stripes depart FIRST with maximum travel + rotation
  // - Edge stripes follow with cascading delay, less travel
  // - Each stripe rotates as it peels (like a page turning)
  // - Scale compresses on the travel axis (depth illusion)
  // - Opacity ghosts out in the final 30% of each stripe's journey
  //
  // The result: a satisfying diagonal zipper that opens from
  // the center outward, with organic, physical motion.
  // ══════════════════════════════════════════════════════
  const allArr = Array.from(allStripes)
  const container = el.querySelector('.st-container')
  const containerH = container.getBoundingClientRect().height
  const halfH = containerH / 2
  const mid = STRIPE_COUNT / 2

  await new Promise((resolve) => {
    const tl = gsap.timeline({ onComplete: resolve })

    allArr.forEach((stripe, i) => {
      const isTop = i < mid

      // ── Distance from the center seam (0 = center, 1 = edge) ──
      const distFromCenter = isTop
        ? (mid - 1 - i) / (mid - 1)   // stripe 0 → 1 (edge), stripe mid-1 → 0 (center)
        : (i - mid) / (mid - 1)        // stripe mid → 0 (center), stripe last → 1 (edge)

      // ── Delay: center stripes go first, edges follow ──
      const delay = distFromCenter * 0.18

      // ── Travel: all stripes must fully exit the viewport ──
      // Center stripes travel halfH, edge stripes travel slightly less
      // but they start closer to the edge so they still clear
      const travel = halfH * (0.6 + 0.4 * (1 - distFromCenter))
      const direction = isTop ? -1 : 1

      // ── Rotation: center stripes rotate most (page-peel effect) ──
      const maxRotation = 3
      const rotation = direction * maxRotation * (1 - distFromCenter)

      // ── Scale: slight compression as stripes exit (depth) ──
      const scaleX = 0.7 + 0.3 * distFromCenter // center → 0.7, edge → 1.0

      // ── Duration: center stripes are slightly faster (whip away) ──
      const duration = 0.55 + distFromCenter * 0.25 // center: 0.55s, edge: 0.8s

      // Main motion: translate + rotate + scale
      tl.to(stripe, {
        y: direction * travel,
        rotation,
        scaleX,
        duration,
        ease: 'power3.in',
      }, delay)

      // Opacity fade in the last portion of each stripe's journey
      tl.to(stripe, {
        opacity: 0,
        duration: duration * 0.35,
        ease: 'power1.in',
      }, delay + duration * 0.65)
    })
  })

  // ── Cleanup ──
  gsap.set(el, { visibility: 'hidden', pointerEvents: 'none' })
  gsap.set(allStripes, {
    scaleX: 1, scaleY: 0, y: 0, yPercent: 0,
    opacity: 1, rotation: 0,
  })
  isActive.value = false
  target.value = ''
})
</script>

<template>
  <div ref="overlay" class="st-overlay">
    <div class="st-container">
      <template v-for="i in STRIPE_COUNT" :key="i">
        <div
          class="st-stripe"
          :class="i % 2 === 1 ? 'st-dark' : 'st-light'"
        />
      </template>
    </div>
  </div>
</template>

<style scoped>
.st-overlay {
  position: fixed;
  inset: 0;
  z-index: 10000;
  visibility: hidden;
  pointer-events: none;
  overflow: hidden;
}

.st-container {
  position: absolute;
  top: 50%;
  left: 50%;
  width: calc(71vw + 71vh);
  height: calc(71vw + 71vh);
  transform: translate(-50%, -50%) rotate(-45deg);
  display: flex;
  flex-direction: column;
}

.st-stripe {
  flex: 1;
  transform: scaleY(0);
  will-change: transform;
}

/* Dark charcoal — grows from bottom-left (the glyph's body) */
.st-dark {
  background: var(--color-dark, #24272e);
}

/* Accent coral — grows from top-right (the glyph's stripes) */
.st-light {
  background: var(--color-accent, #ff8270);
}
</style>
