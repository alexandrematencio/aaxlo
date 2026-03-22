<script setup>
import { gsap } from 'gsap'

const props = defineProps({
  skip: { type: Boolean, default: false },
})

const section = ref(null)
const stickyContainer = ref(null)

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

let scrollHandler = null

onMounted(() => {
  const el = section.value
  if (!el) return

  if (props.skip) {
    showFinalState()
    return
  }

  // ── Phase 1: Label + Headline on section enter ──
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

          introObserver.disconnect()
        }
      })
    },
    { threshold: 0.15 }
  )
  introObserver.observe(el)

  // ── Phase 2: Sticky container + scroll-driven block reveals ──
  // Each .emotional-cell-slide slides in from the right on its own scroll motion
  const slideCells = Array.from(el.querySelectorAll('.emotional-cell-slide'))
  const cellCount = slideCells.length
  const revealed = new Set()

  // Hide all slide cells off-screen to the right
  // Use viewport-relative offset so it works on all screen sizes
  const slideOffset = Math.min(120, window.innerWidth * 0.3)
  slideCells.forEach(cell => {
    gsap.set(cell, { opacity: 0, x: slideOffset })
  })

  // Each block needs a full viewport of scroll distance — forces deliberate scrolling
  // Slightly less on mobile (smaller fingers, shorter swipes)
  const isMobile = window.innerWidth < 768
  const scrollPerBlock = window.innerHeight * (isMobile ? 0.9 : 1.2)
  const extraHeight = scrollPerBlock * cellCount
  const naturalHeight = el.offsetHeight
  el.style.height = `${naturalHeight + extraHeight}px`

  // Scroll handler: one block per scroll motion
  scrollHandler = () => {
    if (revealed.size >= cellCount) return

    const rect = el.getBoundingClientRect()
    const stickyTop = window.innerHeight * 0.1

    const scrolled = stickyTop - rect.top
    if (scrolled < 0) return

    const progress = Math.min(scrolled / extraHeight, 1)

    // Each block triggers at its own threshold: 0/3, 1/3, 2/3
    const targetIndex = Math.min(Math.floor(progress * cellCount), cellCount - 1)

    for (let i = 0; i <= targetIndex; i++) {
      if (revealed.has(i)) continue
      revealed.add(i)

      const cell = slideCells[i]

      gsap.to(cell, {
        opacity: 1,
        x: 0,
        duration: 0.7,
        ease: 'power3.out',
      })
    }

    // Once all revealed, collapse extra height and free the scroll
    if (revealed.size >= cellCount) {
      window.removeEventListener('scroll', scrollHandler)

      // Wait for the last slide animation to finish
      setTimeout(() => {
        // Remove the extra scroll height and adjust scroll position
        // so the page doesn't jump
        const currentScroll = window.scrollY
        const sectionTop = el.offsetTop
        const currentSectionHeight = el.offsetHeight
        el.style.height = ''
        const newSectionHeight = el.offsetHeight
        const heightDiff = currentSectionHeight - newSectionHeight

        // If the user is scrolled past the section, adjust scroll to compensate
        if (currentScroll > sectionTop + newSectionHeight) {
          window.scrollTo({ top: currentScroll - heightDiff, behavior: 'instant' })
        }
      }, 800)
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
    <div ref="stickyContainer" class="emotional-sticky">
      <div class="emotional-container">
        <div class="emotional-cell">
          <span class="emotional-label tw-hide">THE REASON</span>
          <h2 class="emotional-headline tw-hide">
            You built something worth finding.
          </h2>
        </div>

        <div class="emotional-cell-slide">
          <div class="emotional-cell">
            <p class="emotional-para">
              You didn't start your business to learn about meta descriptions or manage a content calendar. You started it because you're good at something and you decided to bet on yourself.
            </p>
          </div>
        </div>

        <div class="emotional-cell-slide">
          <div class="emotional-cell">
            <p class="emotional-para">
              That bet — the late nights, the slow months, the figuring-it-out-as-you-go — that was the hard part. And that's yours.
            </p>
          </div>
        </div>

        <div class="emotional-cell-slide">
          <div class="emotional-cell">
            <p class="emotional-para">
              Getting people to find you online, keeping your social media alive, automating the stuff that eats your time — that's on us. And we care about getting it right. Not in an abstract "we value our clients" way. In a "we check if it's actually working three weeks later" way.
            </p>
          </div>
        </div>
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
  padding: clamp(48px, 10vh, 120px) clamp(16px, 6vw, 96px);
  display: flex;
  justify-content: center;
  overflow: hidden;
}

.tw-hide {
  clip-path: inset(-0.1em 100% -0.25em 0);
}

.emotional-container {
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
  color: rgba(36, 39, 46, 0.5);
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

@media (max-width: 768px) {
  .emotional-sticky {
    top: 5vh;
    padding: 48px 16px;
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
