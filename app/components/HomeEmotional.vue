<script setup>
import { gsap } from 'gsap'

const props = defineProps({
  content: { type: Object, default: null },
  skip: { type: Boolean, default: false },
})

const section = ref(null)
const scrollArrow = ref(null)

let scrollHandler = null

function showFinalState() {
  const el = section.value
  if (!el) return
  el.querySelectorAll('.tw-hide').forEach(t => {
    gsap.set(t, { clipPath: 'inset(-0.1em 0% -0.25em 0)' })
  })
  el.querySelectorAll('.emotional-cell-slide').forEach(c => {
    gsap.set(c, { opacity: 1, x: 0 })
  })
}

function positionArrow(container, anchor) {
  if (!scrollArrow.value) return
  const containerRect = container.getBoundingClientRect()
  const anchorRect = anchor.getBoundingClientRect()
  gsap.set(scrollArrow.value, {
    top: anchorRect.bottom - containerRect.top + 48,
    left: '50%',
  })
}

/**
 * Deactivate the scroll-driven section after all blocks are revealed.
 * Remove sticky + extra height in one rAF so browser paints once.
 */
function deactivateSection(el) {
  requestAnimationFrame(() => {
    const stickyEl = el.querySelector('.emotional-sticky')
    if (!stickyEl) return

    // 1. Where is the sticky content on screen RIGHT NOW? (before any DOM changes)
    const stickyScreenY = stickyEl.getBoundingClientRect().top

    // 2. Remove sticky + extra height (no paint yet — all synchronous)
    stickyEl.style.position = 'relative'
    stickyEl.style.overflow = 'visible'
    stickyEl.style.top = '0'
    el.style.height = ''

    // 3. Get section's true document position in the new layout
    //    (use getBoundingClientRect, NOT offsetTop which is relative to offsetParent)
    const sectionDocTop = el.getBoundingClientRect().top + window.scrollY

    // 4. Scroll so stickyEl stays at the same screen position
    //    stickyEl is at sectionDocTop (first child, position: relative)
    //    Screen pos = sectionDocTop - scrollY → we want this = stickyScreenY
    const targetScroll = sectionDocTop - stickyScreenY
    window.scrollTo(0, Math.max(0, targetScroll))
  })
}

onMounted(() => {
  const el = section.value
  if (!el) return

  if (props.skip) {
    showFinalState()
    return
  }

  const slideCells = Array.from(el.querySelectorAll('.emotional-cell-slide'))
  const cellCount = slideCells.length
  const container = el.querySelector('.emotional-container')
  const titleCell = el.querySelector('.emotional-cell')
  const revealed = new Set()

  // Alternate slide direction: right, left, right
  const slideDirections = [1, -1, 1]
  const slideOffset = Math.min(120, window.innerWidth * 0.3)

  slideCells.forEach((cell, i) => {
    gsap.set(cell, { opacity: 0, x: slideOffset * (slideDirections[i] || 1) })
  })

  // ── Phase 1: Title reveal on section enter ──
  const introObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const tl = gsap.timeline({ defaults: { ease: 'power2.out' } })

          tl.to(el.querySelector('.emotional-label'), {
            clipPath: 'inset(-0.1em 0% -0.25em 0)', duration: 0.15, ease: 'steps(10)',
          }, '-=0.15')

          tl.to(el.querySelector('.emotional-headline'), {
            clipPath: 'inset(-0.1em 0% -0.25em 0)', duration: 0.15, ease: 'steps(26)',
          }, '-=0.1')

          if (scrollArrow.value) {
            tl.call(() => positionArrow(container, titleCell))
            tl.to(scrollArrow.value, { opacity: 1, duration: 0.4, ease: 'power2.out' }, '+=0.15')
          }

          introObserver.disconnect()
        }
      })
    },
    { threshold: 0.15 }
  )
  introObserver.observe(el)

  // ── Phase 2: Scroll-driven block reveals ──
  const isMobile = window.innerWidth < 768
  const scrollPerBlock = window.innerHeight * (isMobile ? 0.65 : 0.7)
  const totalScrollDist = scrollPerBlock * cellCount

  // Add scroll distance
  const naturalHeight = el.offsetHeight
  el.style.height = `${naturalHeight + totalScrollDist}px`

  // Trigger thresholds: last one near the end for minimal dead space
  const triggers = [0, 0.30, 0.65]

  scrollHandler = () => {
    if (revealed.size >= cellCount) return

    const rect = el.getBoundingClientRect()
    const stickyTop = window.innerHeight * (isMobile ? 0.05 : 0.1)
    const scrolled = stickyTop - rect.top
    if (scrolled < 0) return

    const progress = Math.min(scrolled / totalScrollDist, 1)

    for (let i = 0; i < cellCount; i++) {
      if (revealed.has(i)) continue
      if (progress < triggers[i]) break

      revealed.add(i)
      const cell = slideCells[i]
      const isLast = revealed.size >= cellCount

      // Hide arrow during slide-in
      if (scrollArrow.value) {
        gsap.set(scrollArrow.value, { opacity: 0 })
      }

      gsap.to(cell, {
        opacity: 1,
        x: 0,
        duration: 0.9,
        ease: 'power3.out',
        onComplete() {
          if (!isLast && scrollArrow.value) {
            positionArrow(container, cell)
            gsap.to(scrollArrow.value, { opacity: 1, duration: 0.3, ease: 'power2.out' })
          }
          // Last block done — deactivate the section
          if (isLast) {
            deactivateSection(el)
          }
        },
      })
    }

    if (revealed.size >= cellCount) {
      window.removeEventListener('scroll', scrollHandler)
      scrollHandler = null
    }
  }

  window.addEventListener('scroll', scrollHandler, { passive: true })
  scrollHandler()
})

onBeforeUnmount(() => {
  if (scrollHandler) {
    window.removeEventListener('scroll', scrollHandler)
  }
})
</script>

<template>
  <section ref="section" class="home-emotional">
    <div class="emotional-sticky">
      <div class="emotional-container">
        <div class="emotional-cell">
          <span class="emotional-label tw-hide">{{ content?.label }}</span>
          <h2 class="emotional-headline tw-hide">
            {{ content?.headline }}
          </h2>
        </div>

        <div v-for="(para, pi) in (content?.paragraphs || [])" :key="pi" class="emotional-cell-slide">
          <div class="emotional-cell">
            <p class="emotional-para">
              {{ para }}
            </p>
          </div>
        </div>

        <!-- Scroll hint arrow -->
        <span ref="scrollArrow" class="scroll-arrow" aria-hidden="true">
          <svg width="28" height="28" viewBox="0 0 16 16" fill="none">
            <path d="M8 2V14M8 14L3 9M8 14L13 9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </span>
      </div>
    </div>
  </section>
</template>

<style scoped>
.home-emotional {
  position: relative;
  background: #FFF1EF;
  border-top: 0.5px solid #24272e;
}

.emotional-sticky {
  position: sticky;
  top: 10vh;
  padding: 120px clamp(32px, 6vw, 96px);
  display: flex;
  justify-content: center;
  overflow: hidden;
}

.tw-hide {
  clip-path: inset(-0.1em 100% -0.25em 0);
}

.emotional-container {
  position: relative;
  max-width: 700px;
  width: 100%;
  display: flex;
  flex-direction: column;
}

/* Title cell — standalone, has all 4 borders */
.emotional-cell {
  border: 0.5px solid #24272e;
  padding: 16px;
}

/* Slide wrapper — carries the border so it slides in with the content.
   border-top: none to collapse with the cell above (title or prev slide). */
.emotional-cell-slide {
  will-change: transform, opacity;
  border: 0.5px solid #24272e;
  border-top: none;
}
/* Inner cell inside slide — no border of its own, the wrapper handles it */
.emotional-cell-slide .emotional-cell {
  border: none;
}

.emotional-label {
  display: block;
  font-family: var(--font);
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: rgba(36, 39, 46, 0.7);
  margin-bottom: 8px;
}

.emotional-headline {
  font-family: var(--font);
  font-size: clamp(32px, 5vw, 48px);
  font-weight: 600;
  color: var(--color-dark);
  line-height: 1.1;
  letter-spacing: -0.02em;
  margin: 0;
}

.emotional-para {
  font-family: var(--font);
  font-size: 20px;
  font-weight: 300;
  color: var(--color-dark);
  line-height: 1.6;
  margin: 0;
}

/* ── Scroll hint arrow ── */
.scroll-arrow {
  position: absolute;
  top: 0;
  left: 50%;
  opacity: 0;
  color: var(--color-dark);
  animation: scroll-bounce 1.8s ease-in-out infinite;
  pointer-events: none;
}

@keyframes scroll-bounce {
  0%, 100% { transform: translate(-50%, 0); }
  50% { transform: translate(-50%, 6px); }
}

@media (max-width: 768px) {
  .emotional-sticky {
    top: 5vh;
    padding: 80px 20px;
  }
  .emotional-headline {
    font-size: clamp(22px, 5.5vw, 32px);
  }
  .emotional-para {
    font-size: 15px;
    line-height: 1.5;
  }
  .emotional-cell {
    padding: 10px;
  }
  .emotional-label {
    font-size: 10px;
    margin-bottom: 6px;
  }
}
</style>
