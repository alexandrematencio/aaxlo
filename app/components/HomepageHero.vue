<script setup>
import { gsap } from 'gsap'

const props = defineProps({
  content: { type: Object, default: null },
  animate: { type: Boolean, default: false },
  skip: { type: Boolean, default: false },
})

const section = ref(null)
const headlineRef = ref(null)
const trailRef = ref(null)
const heroSubRef = ref(null)
const glyphMaskRef = ref(null)
const { navigateWithStripes } = useStripeTransition()
const localePath = useLocalePath()

// ── Scramble text setup ──
const SCRAMBLE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
const TRAIL_COUNT = 10

// Group characters by word so the browser wraps at word boundaries
const headlineWords = computed(() => {
  const text = props.content?.headline || ''
  if (!text) return []
  const words = text.split(' ')
  let charIndex = 0
  return words.map((word, wi) => ({
    id: wi,
    chars: word.split('').map(char => ({
      char,
      id: charIndex++,
    })),
    // Increment charIndex for the space between words
    _: (() => { if (wi < words.length - 1) charIndex++ })(),
  }))
})

function randomChar() {
  return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)]
}

// Pre-compute trail positions (stable across renders)
const trailPositions = Array.from({ length: TRAIL_COUNT }, (_, i) => ({
  id: i,
  left: `${Math.random() * 100}%`,
  top: `${-20 + Math.random() * 140}%`,
  fontSize: `${0.3 + Math.random() * 0.4}em`,
}))

function handleNav(cell) {
  const path = localePath(cell.to)
  if (cell.stripe) {
    navigateWithStripes(path)
  } else {
    navigateTo(path)
  }
}

function showFinalState() {
  const el = section.value
  if (!el) return

  // Show headline chars at final state
  if (headlineRef.value) {
    headlineRef.value.querySelectorAll('.scramble-char').forEach(c => {
      gsap.set(c, { opacity: 1, y: 0 })
      c.textContent = c.dataset.final
    })
  }
  if (trailRef.value) gsap.set(trailRef.value, { opacity: 0 })

  gsap.set(el.querySelector('.hero-sub'), { clipPath: 'inset(-0.1em 0% -0.25em 0)' })
  if (glyphMaskRef.value) gsap.set(glyphMaskRef.value, { opacity: 0 })
  gsap.set(el.querySelector('.hero-cta'), { clipPath: 'inset(-0.1em 0% -0.25em 0)' })
  el.querySelectorAll('.nav-cell').forEach(c => {
    gsap.set(c, { clipPath: 'inset(0 0 0 0)' })
  })
  el.querySelectorAll('.nav-label').forEach(l => {
    gsap.set(l, { clipPath: 'inset(-0.1em 0% -0.25em 0)' })
  })
  el.querySelectorAll('.nav-index').forEach(n => {
    gsap.set(n, { opacity: 1 })
  })
}

function runAnimation() {
  const el = section.value
  if (!el) return

  const tl = gsap.timeline({ defaults: { ease: 'power2.inOut' } })

  /* 1. CTA reveal */
  tl.to(el.querySelector('.hero-cta'), {
    clipPath: 'inset(-0.1em 0% -0.25em 0)', duration: 0.2,
  }, '-=0.05')

  /* 3. Nav cells reveal, staggered */
  const cells = el.querySelectorAll('.nav-cell')
  tl.to(cells, {
    clipPath: 'inset(0 0 0 0)', duration: 0.2, stagger: 0.03,
  }, '-=0.05')

  /* 4. Nav labels typewriter */
  const labels = el.querySelectorAll('.nav-label')
  tl.to(labels, {
    clipPath: 'inset(-0.1em 0% -0.25em 0)', duration: 0.15, stagger: 0.02, ease: 'steps(10)',
  }, '-=0.1')

  /* 5. Nav indices fade in */
  const indices = el.querySelectorAll('.nav-index')
  tl.to(indices, {
    opacity: 1, duration: 0.15, stagger: 0.02,
  }, '-=0.1')

  /* 6. LAST STEP — Headline scramble reveal */
  const charEls = headlineRef.value?.querySelectorAll('.scramble-char') || []
  const trailEls = trailRef.value?.querySelectorAll('.trail-char') || []

  // Mark the scramble start point on the timeline
  tl.addLabel('scramble', '+=0.2')

  // Trail characters — cycle and fade around the heading
  if (trailRef.value && trailEls.length) {
    gsap.set(trailRef.value, { opacity: 1 })
    trailEls.forEach((trail, i) => {
      gsap.set(trail, { opacity: 0 })
      tl.to(trail, { opacity: 0.15, duration: 0.1, ease: 'power2.out' }, `scramble+=${i * 0.06}`)
      tl.to({}, {
        duration: 0.5 + Math.random() * 0.4,
        ease: 'none',
        onUpdate() { trail.textContent = randomChar() },
      }, `scramble+=${i * 0.06}`)
      tl.to(trail, {
        opacity: 0, y: -10 + Math.random() * 20,
        duration: 0.3, ease: 'power2.in',
      }, `scramble+=${i * 0.06 + 0.3 + Math.random() * 0.3}`)
    })
  }

  // Main character scramble + staggered slide-up (1.3x speed)
  const staggerGap = 0.04 / 1.3    // ~0.031s between chars
  const baseDuration = 0.4 / 1.3   // ~0.308s scramble per char
  const slideDuration = 0.25 / 1.3 // ~0.192s slide-up

  charEls.forEach((charEl, i) => {
    const finalChar = charEl.dataset.final
    const offset = i * staggerGap
    const scrambleDuration = baseDuration + Math.random() * (0.15 / 1.3)

    // Start scrambling (direct DOM — bypasses Vue reactivity)
    tl.call(() => {
      charEl._scrambleInterval = setInterval(() => {
        charEl.textContent = randomChar()
      }, 35)
    }, null, `scramble+=${offset}`)

    // Fade in + slide up (transform + opacity only)
    tl.fromTo(charEl,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: slideDuration, ease: 'power3.out' },
      `scramble+=${offset}`
    )

    // Lock to final character
    tl.call(() => {
      clearInterval(charEl._scrambleInterval)
      delete charEl._scrambleInterval
      charEl.textContent = finalChar
    }, null, `scramble+=${offset + scrambleDuration}`)
  })

  // Fade out trail after all chars have locked
  const lastCharLock = charEls.length * staggerGap + (0.55 / 1.3)
  if (trailRef.value) {
    tl.to(trailRef.value, { opacity: 0, duration: 0.15 }, `scramble+=${lastCharLock}`)
  }

  // ── 7. Subtitle glyph-mask reveal (right after headline scramble) ──
  tl.addLabel('subReveal', `scramble+=${lastCharLock + 0.1}`)

  const subEl = heroSubRef.value
  const glyphEl = glyphMaskRef.value
  if (subEl && glyphEl) {
    // Measure subtitle height and position the glyph to match
    const subRect = subEl.getBoundingClientRect()
    const subHeight = subRect.height
    const glyphSize = subHeight // glyph sized to text height

    // Position glyph but keep hidden until animation starts
    gsap.set(glyphEl, {
      width: glyphSize,
      height: glyphSize,
      top: 0,
      left: -glyphSize - 4,
      opacity: 0,
      x: 0,
    })

    // Remove tw-hide clip on subtitle
    gsap.set(subEl, { clipPath: 'inset(0 100% 0 0)' })

    // Glyph sweeps left to right across the subtitle, revealing text behind it
    const sweepDistance = subRect.width + glyphSize + 8

    // Glyph appears only when this step starts
    tl.set(glyphEl, { opacity: 1 }, 'subReveal')

    tl.to(glyphEl, {
      x: sweepDistance,
      duration: 0.6,
      ease: 'power2.inOut',
    }, 'subReveal')

    // Subtitle clip reveals in sync with glyph position
    tl.to(subEl, {
      clipPath: 'inset(-0.1em 0% -0.25em 0)',
      duration: 0.6,
      ease: 'power2.inOut',
    }, 'subReveal')

    // Glyph fades out at the end
    tl.to(glyphEl, {
      opacity: 0,
      duration: 0.15,
      ease: 'power2.in',
    }, 'subReveal+=0.5')
  }
}

onBeforeUnmount(() => {
  // Clean up any lingering scramble intervals
  if (headlineRef.value) {
    headlineRef.value.querySelectorAll('.scramble-char').forEach(c => {
      if (c._scrambleInterval) clearInterval(c._scrambleInterval)
    })
  }
})

onMounted(() => {
  if (props.skip) {
    showFinalState()
    return
  }
  if (props.animate) {
    runAnimation()
  }
})

watch(() => props.animate, (val) => {
  if (val && !props.skip) runAnimation()
})
</script>

<template>
  <section v-if="content" ref="section" class="homepage-hero">
    <!-- Top half -->
    <div class="hero-upper">
      <!-- Copy area -->
      <div class="hero-copy-area">
        <div class="hero-copy">
          <h1 class="hero-headline">
            <!-- Trail / decorative scramble characters -->
            <span ref="trailRef" class="trail-layer" aria-hidden="true">
              <span
                v-for="t in trailPositions"
                :key="t.id"
                class="trail-char"
                :style="{ left: t.left, top: t.top, fontSize: t.fontSize }"
              >{{ randomChar() }}</span>
            </span>
            <!-- Main characters (split by word for correct line-breaking) -->
            <span ref="headlineRef" class="chars-layer">
              <span
                v-for="(word, wi) in headlineWords"
                :key="word.id"
                class="scramble-word"
              ><span
                  v-for="c in word.chars"
                  :key="c.id"
                  class="scramble-char"
                  :data-final="c.char"
                  style="opacity: 0"
                >{{ c.char }}</span></span>
            </span>
          </h1>
          <div class="hero-sub-wrap">
            <p ref="heroSubRef" class="hero-sub hero-sub-delayed tw-hide">
              {{ content?.subheadline }}
            </p>
            <!-- Glyph mask — sweeps across to reveal subtitle -->
            <svg
              ref="glyphMaskRef"
              class="glyph-mask"
              viewBox="0 0 37 37"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path d="M0.179 24.7734C1.073 27.2357 2.506 29.5471 4.48 31.5229C6.454 33.4971 8.765 34.9312 11.229 35.8236L0.179 24.7734Z" fill="#FF8270"/>
              <path d="M-0.926 18.6797C-0.916 19.6106 -0.835 20.5398 -0.684 21.4607L14.54 36.6856C15.461 36.8366 16.391 36.9171 17.321 36.9272L-0.926 18.6797Z" fill="#FF8270"/>
              <path d="M-0.428 14.1895C-0.597 14.9023 -0.723 15.6236 -0.807 16.3498L19.651 36.808C20.378 36.7241 21.099 36.5983 21.812 36.4289L-0.428 14.1895Z" fill="#FF8270"/>
              <path d="M0.87 10.502C0.59 11.089 0.342 11.6895 0.127 12.2967L23.703 35.873C24.312 35.6583 24.911 35.41 25.498 35.1299L0.87 10.502Z" fill="#FF8270"/>
              <path d="M2.752 7.39648C2.383 7.88794 2.041 8.39448 1.729 8.9111L27.09 34.2721C27.608 33.9584 28.113 33.6162 28.605 33.2489L2.752 7.39648Z" fill="#FF8270"/>
              <path d="M5.131 4.78516C4.911 4.98476 4.693 5.19107 4.48 5.40408C4.267 5.6171 4.061 5.83348 3.861 6.05488L29.945 32.1388C30.165 31.9392 30.383 31.7328 30.596 31.5198C30.809 31.3068 31.015 31.0904 31.215 30.869L5.131 4.78516Z" fill="#FF8270"/>
              <path d="M7.987 2.65625C7.469 2.96991 6.962 3.3104 6.471 3.67941L32.322 29.5301C32.691 29.0387 33.031 28.5321 33.345 28.0138L7.987 2.65625Z" fill="#FF8270"/>
              <path d="M11.374 1.05469C10.765 1.26938 10.166 1.51763 9.577 1.79774L34.204 26.424C34.484 25.837 34.732 25.2365 34.947 24.6276L11.374 1.05469Z" fill="#FF8270"/>
              <path d="M15.426 0.119141C14.7 0.203006 13.978 0.327127 13.266 0.496536L35.503 22.7343C35.673 22.0215 35.799 21.2986 35.881 20.574L15.426 0.119141Z" fill="#FF8270"/>
              <path d="M34.896 12.1536C34.004 9.69135 32.572 7.38002 30.596 5.40414C28.621 3.42995 26.31 1.99585 23.846 1.10352L34.895 12.152L34.896 12.1536Z" fill="#FF8270"/>
              <path d="M20.537 0.24321C19.616 0.0922522 18.685 0.0100639 17.754 0L36 18.2458C35.99 17.3149 35.908 16.384 35.757 15.4631L20.537 0.24321Z" fill="#FF8270"/>
            </svg>
          </div>
          <a
            :href="localePath('/audit')"
            class="hero-cta tw-hide"
            @click.prevent="navigateWithStripes(localePath('/audit'))"
          >
            {{ content?.cta }}
          </a>
        </div>
      </div>
    </div>

    <!-- Bottom half — nav grid -->
    <div class="hero-nav">
      <div class="hero-nav-grid">
        <a
          v-for="(cell, ci) in (content?.navCells || [])"
          :key="ci"
          :href="localePath(cell.to)"
          class="nav-cell"
          :class="{ 'nav-cell--accent nav-cta': cell.accent }"
          style="clip-path: inset(0 100% 0 0)"
          @click.prevent="handleNav(cell)"
        >
          <template v-if="cell.accent">
            <span class="nav-arrow-icon" aria-hidden="true">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M1 11L11 1M11 1H3M11 1V9" stroke="currentColor" stroke-width="1.5"/>
              </svg>
            </span>
            <span class="nav-plus" aria-hidden="true">+</span>
            <span class="nav-label tw-hide">{{ cell.label }}</span>
            <span class="nav-plus" aria-hidden="true">+</span>
          </template>
          <template v-else>
            <span class="nav-index" style="opacity: 0">{{ cell.index }}</span>
            <span class="nav-label tw-hide">{{ cell.label }}</span>
          </template>
        </a>
      </div>
    </div>
  </section>
</template>

<style scoped>
.homepage-hero {
  position: relative;
  display: flex;
  flex-direction: column;
  min-height: 100dvh;
  background: var(--color-cream);
}



/* ── tw-hide ── */
.tw-hide {
  clip-path: inset(-0.1em 100% -0.25em 0);
}

/* ── Scramble text characters ── */
.chars-layer {
  position: relative;
  display: inline;
  z-index: 2;
}

.scramble-word {
  display: inline-block;
  white-space: nowrap;
  margin-right: 0.25em;
}

.scramble-word:last-child {
  margin-right: 0;
}

.scramble-char {
  display: inline-block;
  will-change: transform, opacity;
}

.trail-layer {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 1;
  overflow: visible;
}

.trail-char {
  position: absolute;
  display: inline-block;
  font-family: var(--font);
  font-weight: 300;
  color: var(--color-dark);
  opacity: 0;
  will-change: transform, opacity;
  user-select: none;
}

@media (prefers-reduced-motion: reduce) {
  .scramble-char {
    opacity: 1 !important;
    transform: none !important;
  }
  .trail-layer {
    display: none;
  }
}

/* ── TOP HALF ── */
.hero-upper {
  display: flex;
  flex-direction: column;
  flex: 1;
}

/* Copy area */
.hero-copy-area {
  position: relative;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-cream);
  padding: 64px clamp(32px, 6vw, 96px);
}

.hero-copy {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
  gap: 24px;
  max-width: 780px;
  width: 100%;
}

.hero-headline {
  position: relative;
  font-family: var(--font);
  font-size: clamp(40px, 5.5vw, 64px);
  font-weight: 600;
  color: var(--color-dark);
  line-height: 1.05;
  letter-spacing: -0.02em;
  margin: 0;
  text-align: left;
}

.hero-sub-wrap {
  position: relative;
  display: inline-block;
  overflow: visible;
}

.hero-sub {
  font-family: var(--font);
  font-size: clamp(18px, 2vw, 24px);
  font-weight: 300;
  color: var(--color-dark);
  line-height: 1.35;
  max-width: 600px;
  margin: 0;
}

.glyph-mask {
  position: absolute;
  top: 0;
  left: 0;
  opacity: 0;
  pointer-events: none;
  will-change: transform, opacity;
  z-index: 2;
}

/* ── CTA Button ── */
.hero-cta {
  display: inline-block;
  position: relative;
  font-family: var(--font);
  font-size: 16px;
  font-weight: 500;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  padding: 16px 40px;
  background: var(--color-accent);
  color: var(--color-dark);
  text-decoration: none;
  border: 0.5px solid #24272e;
  border-radius: 0;
  cursor: pointer;
  overflow: hidden;
  z-index: 1;
  transition: color 0.4s;
}
.hero-cta::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background: var(--color-dark);
  transform: translate(-101%, 101%);
  transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
  z-index: -1;
}
.hero-cta:hover::before {
  transform: translate(0, 0);
}
.hero-cta:hover {
  color: var(--color-cream);
}

/* ── BOTTOM HALF — Nav ── */
.hero-nav {
  position: relative;
  flex: 1;
  display: flex;
  flex-direction: column;
  background: var(--color-dark);
  border-top: 0.5px solid #24272e;
}

.hero-nav-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: 1fr 1fr;
  flex: 1;
}

/* ── Nav cells ── */
.nav-cell {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 24px;
  background: var(--color-accent);
  text-decoration: none;
  cursor: pointer;
  overflow: hidden;
  z-index: 1;
  transition: color 0.4s;
  min-height: 120px;
  border-right: 0.5px solid #24272e;
  color: var(--color-dark);
}

/* Remove right border on last column */
.nav-cell:nth-child(3n) {
  border-right: none;
}

/* Bottom border on row 1 */
.nav-cell:nth-child(-n+3) {
  border-bottom: 0.5px solid #24272e;
}

.nav-cell::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background: var(--color-dark);
  transform: translate(-101%, 101%);
  transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
  z-index: -1;
}
.nav-cell:hover::before {
  transform: translate(0, 0);
}
.nav-cell:hover .nav-label,
.nav-cell:hover .nav-index,
.nav-cell:hover .nav-plus,
.nav-cell:hover .nav-arrow-icon {
  color: var(--color-cream);
}

/* Accent cell (START A PROJECT) */
.nav-cell--accent {
  flex-direction: row;
  gap: 16px;
}

.nav-arrow-icon {
  position: absolute;
  top: 10px;
  left: 10px;
  color: var(--color-dark);
  transition: color 0.4s;
  z-index: 1;
}

.nav-plus {
  font-family: var(--font);
  font-size: 64px;
  font-weight: 100;
  color: var(--color-dark);
  transition: color 0.4s;
  line-height: 1;
  z-index: 1;
}

.nav-label {
  font-family: var(--font);
  font-size: clamp(14px, 1.4vw, 20px);
  font-weight: 300;
  letter-spacing: 0.03em;
  text-transform: uppercase;
  color: var(--color-dark);
  transition: color 0.4s;
  position: relative;
  z-index: 1;
  text-align: center;
  line-height: 1.2;
  max-width: 80%;
}

.nav-cell:not(.nav-cell--accent) .nav-label {
  font-weight: 300;
}

.nav-index {
  position: absolute;
  top: 10px;
  left: 10px;
  font-family: var(--font);
  font-size: 12px;
  font-weight: 300;
  color: var(--color-dark);
  transition: color 0.4s;
  z-index: 1;
}

/* ── Responsive ── */
@media (max-width: 1024px) {
  .hero-nav-grid {
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: auto;
  }
  /* Reset desktop border rules */
  .nav-cell:nth-child(3n) {
    border-right: 0.5px solid #24272e;
  }
  /* Remove right border on last column (every 2nd child) */
  .nav-cell:nth-child(2n) {
    border-right: none;
  }
  /* Bottom border on all cells except last row (children 5 & 6) */
  .nav-cell {
    border-bottom: 0.5px solid #24272e;
  }
  .nav-cell:nth-child(n+5) {
    border-bottom: none;
  }
}

@media (max-width: 768px) {
  .homepage-hero {
    min-height: auto;
  }
  .hero-copy-area {
    padding: 48px 20px;
  }
  .hero-headline {
    font-size: clamp(32px, 7vw, 44px);
  }
  .hero-sub {
    font-size: clamp(16px, 3.5vw, 20px);
  }
  .hero-cta {
    padding: 14px 32px;
    font-size: 14px;
  }
  .hero-nav-grid {
    grid-template-columns: 1fr;
    grid-template-rows: auto;
  }
  .nav-cell,
  .nav-cell:nth-child(2n),
  .nav-cell:nth-child(3n),
  .nav-cell:nth-child(-n+3),
  .nav-cell:nth-child(n+5) {
    border: none;
    border-bottom: 0.5px solid #24272e;
    padding: 32px 20px;
    min-height: 80px;
  }
  .nav-label {
    font-size: 18px;
  }
  .nav-plus {
    font-size: 40px;
  }
}
</style>
