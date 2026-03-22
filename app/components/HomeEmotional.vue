<script setup>
import { gsap } from 'gsap'

const props = defineProps({
  skip: { type: Boolean, default: false },
})

const section = ref(null)
const stickyContainer = ref(null)

const SCRAMBLE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
function randomChar() {
  return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)]
}

/**
 * Word-safe scramble: splits text into word-level spans (no mid-word breaks),
 * then scrambles individual characters within each word.
 */
function scrambleElement(el, duration = 1.2) {
  const text = el.textContent.trim()
  const words = text.split(/(\s+)/) // split keeping whitespace
  el.textContent = ''

  const allCharSpans = []

  words.forEach(segment => {
    if (/^\s+$/.test(segment)) {
      // Whitespace — preserve as-is
      el.appendChild(document.createTextNode(segment))
      return
    }

    // Wrap each word in a non-breaking container
    const wordWrap = document.createElement('span')
    wordWrap.style.display = 'inline-block'
    wordWrap.style.whiteSpace = 'nowrap'

    segment.split('').forEach(char => {
      const charSpan = document.createElement('span')
      charSpan.style.display = 'inline-block'
      charSpan.dataset.final = char
      charSpan.textContent = randomChar()
      wordWrap.appendChild(charSpan)
      allCharSpans.push(charSpan)
    })

    el.appendChild(wordWrap)
  })

  // Stagger scramble across all characters
  const stagger = Math.min(0.012, duration / allCharSpans.length)
  allCharSpans.forEach((span, i) => {
    const finalChar = span.dataset.final
    const charDelay = i * stagger
    const scrambleDur = Math.min(0.2, duration * 0.3)

    setTimeout(() => {
      span._interval = setInterval(() => {
        span.textContent = randomChar()
      }, 30)
    }, charDelay * 1000)

    setTimeout(() => {
      if (span._interval) {
        clearInterval(span._interval)
        delete span._interval
      }
      span.textContent = finalChar
    }, (charDelay + scrambleDur) * 1000)
  })
}

function showFinalState() {
  const el = section.value
  if (!el) return

  el.querySelectorAll('.tw-hide').forEach(t => {
    gsap.set(t, { clipPath: 'inset(-0.1em 0% -0.25em 0)' })
  })
  el.querySelectorAll('.emotional-para').forEach(p => {
    gsap.set(p, { opacity: 1, x: 0, clipPath: 'none' })
  })
  // Remove extended height
  el.style.height = ''
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

  // ── Phase 2: Sticky container + scroll-driven paragraph reveals ──
  const paragraphs = Array.from(el.querySelectorAll('.emotional-para'))
  const paraCount = paragraphs.length
  const revealed = new Set()

  // Hide paragraphs, clear clip-path
  paragraphs.forEach((p, i) => {
    const fromX = i % 2 === 0 ? 80 : -80
    gsap.set(p, { opacity: 0, x: fromX, clipPath: 'none' })
  })

  // Extend section height to create scroll space for sticky pinning
  // Each paragraph gets ~60vh of scroll distance
  const scrollPerPara = window.innerHeight * 0.6
  const extraHeight = scrollPerPara * paraCount
  const naturalHeight = el.offsetHeight
  el.style.height = `${naturalHeight + extraHeight}px`

  // Scroll handler: map scroll progress through the section to paragraph reveals
  scrollHandler = () => {
    if (revealed.size >= paraCount) return

    const rect = el.getBoundingClientRect()
    const stickyTop = window.innerHeight * 0.1 // sticky starts at top: 10vh

    // How far the section has scrolled past the sticky point
    const scrolled = stickyTop - rect.top
    if (scrolled < 0) return

    // Progress through the extra scroll space (0 to 1)
    const progress = Math.min(scrolled / extraHeight, 1)

    // Which paragraph should be visible at this progress
    const targetIndex = Math.min(Math.floor(progress * paraCount), paraCount - 1)

    for (let i = 0; i <= targetIndex; i++) {
      if (revealed.has(i)) continue
      revealed.add(i)

      const para = paragraphs[i]
      const fromX = i % 2 === 0 ? 80 : -80

      gsap.fromTo(para,
        { opacity: 0, x: fromX },
        {
          opacity: 1, x: 0,
          duration: 0.6,
          ease: 'power3.out',
          onStart: () => scrambleElement(para, 1.2),
        }
      )
    }

    // Once all revealed, clean up
    if (revealed.size >= paraCount) {
      window.removeEventListener('scroll', scrollHandler)
    }
  }

  window.addEventListener('scroll', scrollHandler, { passive: true })
  // Check initial position
  scrollHandler()
})

onBeforeUnmount(() => {
  if (scrollHandler) {
    window.removeEventListener('scroll', scrollHandler)
  }
  if (section.value) {
    section.value.querySelectorAll('span[data-final]').forEach(s => {
      if (s._interval) clearInterval(s._interval)
    })
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

        <div class="emotional-cell">
          <p class="emotional-para tw-hide">
            You didn't start your business to learn about meta descriptions or manage a content calendar. You started it because you're good at something and you decided to bet on yourself.
          </p>
        </div>

        <div class="emotional-cell">
          <p class="emotional-para tw-hide">
            That bet — the late nights, the slow months, the figuring-it-out-as-you-go — that was the hard part. And that's yours.
          </p>
        </div>

        <div class="emotional-cell">
          <p class="emotional-para tw-hide">
            Getting people to find you online, keeping your social media alive, automating the stuff that eats your time — that's on us. And we care about getting it right. Not in an abstract "we value our clients" way. In a "we check if it's actually working three weeks later" way.
          </p>
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
  padding: 120px clamp(32px, 6vw, 96px);
  display: flex;
  justify-content: center;
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

.emotional-cell {
  border: 0.5px solid #24272e;
  border-top: none;
  padding: 16px;
}
.emotional-cell:first-child {
  border-top: 0.5px solid #24272e;
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
  will-change: transform, opacity;
}

@media (max-width: 768px) {
  .emotional-sticky {
    padding: 80px 20px;
  }
  .emotional-headline {
    font-size: clamp(26px, 6vw, 36px);
  }
  .emotional-para {
    font-size: 17px;
  }
  .emotional-cell {
    padding: 10px;
  }
}
</style>
