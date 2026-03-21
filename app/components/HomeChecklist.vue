<script setup>
import { gsap } from 'gsap'

const props = defineProps({
  skip: { type: Boolean, default: false },
})

const section = ref(null)
const { navigateWithStripes } = useStripeTransition()

const checked = ref([false, false, false, false, false, false])
const revealVisible = ref(false)
const untilNowVisible = ref(false)
const ctaVisible = ref(false)

const statements = [
  "Your website exists, but you wouldn't point a new customer to it right now.",
  "You meant to post on social media this month. You didn't.",
  "There are reviews about your business sitting unanswered.",
  "You're not totally sure what comes up when someone Googles your business.",
  "You've looked into getting help before. The quotes felt like they were meant for a bigger company.",
  "You know something needs to change. You just don't know what to tackle first.",
]

function toggleCard(index) {
  checked.value[index] = !checked.value[index]
}

watch(checked, (val) => {
  if (val.some(Boolean) && !revealVisible.value) {
    revealVisible.value = true
    nextTick(() => {
      const el = section.value
      if (!el) return
      const revealEl = el.querySelector('.checklist-reveal')
      const untilEl = el.querySelector('.checklist-until')
      const ctaEl = el.querySelector('.checklist-cta')
      if (revealEl) {
        gsap.to(revealEl, {
          clipPath: 'inset(-0.1em 0% -0.25em 0)',
          duration: 0.18,
          ease: 'steps(60)',
        })
      }
      if (untilEl) {
        gsap.to(untilEl, {
          clipPath: 'inset(-0.1em 0% -0.25em 0)',
          duration: 0.15,
          ease: 'steps(8)',
          delay: 0.25,
          onComplete: () => {
            untilNowVisible.value = true
          },
        })
      }
      if (ctaEl) {
        gsap.to(ctaEl, {
          opacity: 1,
          y: 0,
          duration: 0.2,
          delay: 0.4,
          onComplete: () => {
            ctaVisible.value = true
          },
        })
      }
    })
  }
}, { deep: true })

function showFinalState() {
  const el = section.value
  if (!el) return

  const headline = el.querySelector('.checklist-headline')
  if (headline) gsap.set(headline, { clipPath: 'inset(-0.1em 0% -0.25em 0)' })
  el.querySelectorAll('.checklist-card').forEach(c => {
    gsap.set(c, { opacity: 1, y: 0 })
  })
}

onMounted(() => {
  const el = section.value
  if (!el) return

  if (props.skip) {
    showFinalState()
    return
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const tl = gsap.timeline({ defaults: { ease: 'power2.out' } })

          /* Headline typewriter */
          tl.to(el.querySelector('.checklist-headline'), {
            clipPath: 'inset(-0.1em 0% -0.25em 0)', duration: 0.12, ease: 'steps(30)',
          }, '-=0.1')

          /* Cards stagger fade in */
          const cards = el.querySelectorAll('.checklist-card')
          tl.to(cards, {
            opacity: 1, y: 0, duration: 0.18, stagger: 0.03,
          }, '+=0.04')

          observer.disconnect()
        }
      })
    },
    { threshold: 0.15 }
  )
  observer.observe(el)
})
</script>

<template>
  <section ref="section" class="home-checklist">
    <div class="checklist-container">
      <h2 class="checklist-headline tw-hide">
        Does any of this sound familiar?
      </h2>

      <div class="checklist-cards">
        <button
          v-for="(statement, i) in statements"
          :key="i"
          class="checklist-card"
          :class="{ 'checklist-card--checked': checked[i] }"
          style="opacity: 0; transform: translateY(8px)"
          @click="toggleCard(i)"
        >
          <span class="checklist-check" aria-hidden="true">
            <svg v-if="checked[i]" width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 8.5L6.5 12L13 4" stroke="var(--color-accent)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </span>
          <span class="checklist-text">{{ statement }}</span>
        </button>
      </div>

      <div v-if="revealVisible" class="checklist-reveal-wrap">
        <p class="checklist-reveal tw-hide">
          If even one of those hit home — you're not behind because you've been careless. You're behind because nobody gave you a realistic way to catch up.
        </p>
        <p class="checklist-until tw-hide">
          Until now.
        </p>
        <a
          href="/audit"
          class="checklist-cta"
          style="opacity: 0; transform: translateY(12px)"
          @click.prevent="navigateWithStripes('/audit')"
        >
          Get your free audit →
        </a>
      </div>
    </div>

  </section>
</template>

<style scoped>
.home-checklist {
  position: relative;
  background: var(--color-white);
  padding: 120px clamp(32px, 6vw, 96px);
  border-top: 0.5px solid #24272e;
}

.tw-hide {
  clip-path: inset(-0.1em 100% -0.25em 0);
}

.checklist-container {
  max-width: 720px;
  margin: 0 auto;
}

.checklist-headline {
  font-family: var(--font);
  font-size: clamp(28px, 4vw, 44px);
  font-weight: 600;
  color: var(--color-dark);
  line-height: 1.15;
  letter-spacing: -0.02em;
  margin: 0 0 48px 0;
  text-align: left;
}

.checklist-cards {
  display: flex;
  flex-direction: column;
}

.checklist-card {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 20px 24px;
  border: 0.5px solid #24272e;
  background: transparent;
  cursor: pointer;
  margin-bottom: 12px;
  text-align: left;
  font-family: var(--font);
  font-size: 16px;
  font-weight: 300;
  color: var(--color-dark);
  line-height: 1.5;
  transition: background 0.25s, border-color 0.25s, border-left-width 0.25s;
}

.checklist-card--checked {
  border-left: 0.5px solid #24272e;
  background: var(--color-cream);
}

.checklist-check {
  flex-shrink: 0;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 2px;
}

.checklist-text {
  flex: 1;
}

.checklist-reveal-wrap {
  margin-top: 48px;
  display: flex;
  flex-direction: column;
  gap: 0;
}

.checklist-reveal {
  font-family: var(--font);
  font-size: 18px;
  font-weight: 300;
  color: var(--color-dark);
  line-height: 1.6;
  margin: 0;
}

.checklist-until {
  font-family: var(--font);
  font-size: 18px;
  font-weight: 600;
  color: var(--color-accent);
  line-height: 1.6;
  margin: 12px 0 0 0;
}

.checklist-cta {
  display: inline-block;
  position: relative;
  font-family: var(--font);
  font-size: 16px;
  font-weight: 500;
  letter-spacing: 0.05em;
  padding: 16px 40px;
  background: var(--color-accent);
  color: var(--color-dark);
  text-decoration: none;
  border: none;
  border-radius: 0;
  cursor: pointer;
  overflow: hidden;
  z-index: 1;
  transition: color 0.4s;
  margin-top: 32px;
  align-self: flex-start;
}
.checklist-cta::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background: var(--color-dark);
  transform: translate(-101%, 101%);
  transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
  z-index: -1;
}
.checklist-cta:hover::before {
  transform: translate(0, 0);
}
.checklist-cta:hover {
  color: var(--color-cream);
}

@media (max-width: 768px) {
  .home-checklist {
    padding: 80px 20px;
  }
  .checklist-headline {
    font-size: clamp(24px, 6vw, 32px);
    margin-bottom: 32px;
  }
  .checklist-card {
    padding: 16px 18px;
    font-size: 15px;
  }
  .checklist-cta {
    padding: 14px 32px;
    font-size: 14px;
  }
}
</style>
