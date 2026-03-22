<script setup>
import { gsap } from 'gsap'

const props = defineProps({
  animate: { type: Boolean, default: false },
  skip: { type: Boolean, default: false },
})

const section = ref(null)
const headlineRef = ref(null)
const trailRef = ref(null)
const { navigateWithStripes } = useStripeTransition()

// ── Scramble text setup ──
const SCRAMBLE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
const HEADLINE_TEXT = 'You might already know what\'s wrong with your online presence.'
const TRAIL_COUNT = 10

// Group characters by word so the browser wraps at word boundaries
const headlineWords = computed(() => {
  const words = HEADLINE_TEXT.split(' ')
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

const navCells = [
  { label: 'GET YOUR FREE AUDIT', accent: true, to: '/audit', stripe: true },
  { label: 'SERVICES', index: '01', to: '/services', stripe: true },
  { label: 'ABOUT US', index: '02', to: '/about', stripe: false },
  { label: 'BLOG', index: '03', to: '/blog', stripe: false },
  { label: 'AUDIT', index: '04', to: '/audit', stripe: true },
  { label: 'CONTACT', index: '05', to: '/contact', stripe: false },
]

function handleNav(cell) {
  if (cell.stripe) {
    navigateWithStripes(cell.to)
  } else {
    navigateTo(cell.to)
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

  /* 1. Subtitle typewriter */
  tl.to(el.querySelector('.hero-sub'), {
    clipPath: 'inset(-0.1em 0% -0.25em 0)', duration: 0.25, ease: 'steps(15)',
  }, '+=0.1')

  /* 2. CTA reveal */
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

  // Main character scramble + staggered slide-up
  charEls.forEach((charEl, i) => {
    const finalChar = charEl.dataset.final
    const offset = i * 0.04
    const scrambleDuration = 0.4 + Math.random() * 0.15

    // Start scrambling (direct DOM — bypasses Vue reactivity)
    tl.call(() => {
      charEl._scrambleInterval = setInterval(() => {
        charEl.textContent = randomChar()
      }, 35)
    }, null, `scramble+=${offset}`)

    // Fade in + slide up (transform + opacity only)
    tl.fromTo(charEl,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.25, ease: 'power3.out' },
      `scramble+=${offset}`
    )

    // Lock to final character — clearInterval FIRST, then set text
    tl.call(() => {
      clearInterval(charEl._scrambleInterval)
      delete charEl._scrambleInterval
      charEl.textContent = finalChar
    }, null, `scramble+=${offset + scrambleDuration}`)
  })

  // Fade out trail after all chars have locked
  const lastCharLock = charEls.length * 0.04 + 0.55
  if (trailRef.value) {
    tl.to(trailRef.value, { opacity: 0, duration: 0.2 }, `scramble+=${lastCharLock}`)
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
  <section ref="section" class="homepage-hero">
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
          <p class="hero-sub hero-sub-delayed tw-hide">
            You just haven't had time to fix it.
          </p>
          <a
            href="/audit"
            class="hero-cta tw-hide"
            @click.prevent="navigateWithStripes('/audit')"
          >
            Get your free audit →
          </a>
        </div>
      </div>
    </div>

    <!-- Bottom half — nav grid -->
    <div class="hero-nav">
      <div class="hero-nav-grid">
        <!-- Row 1 -->
        <a
          href="/audit"
          class="nav-cell nav-cell--accent nav-cta"
          style="clip-path: inset(0 100% 0 0)"
          @click.prevent="navigateWithStripes('/audit')"
        >
          <span class="nav-arrow-icon" aria-hidden="true">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M1 11L11 1M11 1H3M11 1V9" stroke="currentColor" stroke-width="1.5"/>
            </svg>
          </span>
          <span class="nav-plus" aria-hidden="true">+</span>
          <span class="nav-label tw-hide">GET YOUR FREE AUDIT</span>
          <span class="nav-plus" aria-hidden="true">+</span>
        </a>
        <a
          href="/services/visibility"
          class="nav-cell"
          style="clip-path: inset(0 100% 0 0)"
          @click.prevent="navigateWithStripes('/services/visibility')"
        >
          <span class="nav-index" style="opacity: 0">01</span>
          <span class="nav-label tw-hide">PEOPLE CAN'T FIND ME</span>
        </a>
        <a
          href="/services/web"
          class="nav-cell"
          style="clip-path: inset(0 100% 0 0)"
          @click.prevent="navigateWithStripes('/services/web')"
        >
          <span class="nav-index" style="opacity: 0">02</span>
          <span class="nav-label tw-hide">MY SITE DOESN'T REPRESENT ME</span>
        </a>

        <!-- Row 2 -->
        <a
          href="/services/content"
          class="nav-cell"
          style="clip-path: inset(0 100% 0 0)"
          @click.prevent="navigateWithStripes('/services/content')"
        >
          <span class="nav-index" style="opacity: 0">03</span>
          <span class="nav-label tw-hide">I'VE GONE QUIET ONLINE</span>
        </a>
        <a
          href="/services/automation"
          class="nav-cell"
          style="clip-path: inset(0 100% 0 0)"
          @click.prevent="navigateWithStripes('/services/automation')"
        >
          <span class="nav-index" style="opacity: 0">04</span>
          <span class="nav-label tw-hide">I'M DOING TOO MUCH BY HAND</span>
        </a>
        <a
          href="/services/consulting"
          class="nav-cell"
          style="clip-path: inset(0 100% 0 0)"
          @click.prevent="navigateWithStripes('/services/consulting')"
        >
          <span class="nav-index" style="opacity: 0">05</span>
          <span class="nav-label tw-hide">I NEED SOMETHING CUSTOM</span>
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

.hero-sub {
  font-family: var(--font);
  font-size: clamp(18px, 2vw, 24px);
  font-weight: 300;
  color: var(--color-dark);
  line-height: 1.35;
  max-width: 600px;
  margin: 0;
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
  .nav-cell:nth-child(3n) {
    border-right: 0.5px solid #24272e;
  }
  .nav-cell:nth-child(2n) {
    border-right: none;
  }
  .nav-cell:nth-child(-n+3) {
    border-bottom: 0.5px solid #24272e;
  }
  .nav-cell:nth-child(n+3):nth-child(-n+4) {
    border-bottom: 0.5px solid #24272e;
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
  .nav-cell {
    border-right: none !important;
    border-bottom: 0.5px solid #24272e;
    padding: 32px 20px;
    min-height: 80px;
  }
  .nav-cell:last-child {
    border-bottom: none;
  }
  .nav-label {
    font-size: 18px;
  }
  .nav-plus {
    font-size: 40px;
  }
}
</style>
