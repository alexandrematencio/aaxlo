<script setup>
import { gsap } from 'gsap'

const props = defineProps({
  skip: { type: Boolean, default: false },
})

const section = ref(null)

function showFinalState() {
  const el = section.value
  if (!el) return

  el.querySelectorAll('.tw-hide').forEach(t => {
    gsap.set(t, { clipPath: 'inset(-0.1em 0% -0.25em 0)' })
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

          /* Label typewriter */
          tl.to(el.querySelector('.shift-label'), {
            clipPath: 'inset(-0.1em 0% -0.25em 0)', duration: 0.15, ease: 'steps(10)',
          }, '-=0.15')

          /* Headline typewriter */
          tl.to(el.querySelector('.shift-headline'), {
            clipPath: 'inset(-0.1em 0% -0.25em 0)', duration: 0.12, ease: 'steps(22)',
          }, '-=0.1')

          /* Block A typewriter (all .shift-block-a elements) */
          const blocks = el.querySelectorAll('.shift-block-a')
          blocks.forEach((b, i) => {
            tl.to(b, {
              clipPath: 'inset(-0.1em 0% -0.25em 0)', duration: 0.45, ease: 'steps(60)',
            }, i === 0 ? '+=0.08' : '-=0.1')
          })

          /* Standalone line typewriter */
          tl.to(el.querySelector('.shift-standalone'), {
            clipPath: 'inset(-0.1em 0% -0.25em 0)', duration: 0.2, ease: 'steps(30)',
          }, '+=0.08')

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
  <section ref="section" class="home-shift">
    <div class="shift-container">
      <div class="shift-cell">
        <span class="shift-label tw-hide">THE SHIFT</span>
        <h2 class="shift-headline tw-hide">
          Something changed recently.
        </h2>
      </div>

      <div class="shift-cell">
        <p class="shift-block-a tw-hide">
          Two years ago, getting a decent website built, your social media running properly, your search rankings sorted, and your customer communications automated would have meant hiring four or five people. The bill would have looked like it.
        </p>
        <p class="shift-block-a tw-hide" style="margin-top: 24px">
          Today, AI does roughly 80% of that production work. Not the thinking. Not the decisions about what makes sense for your business. The repetitive, time-heavy part that used to eat most of the budget.
        </p>
      </div>

      <div class="shift-cell">
        <p class="shift-standalone tw-hide">
          Some businesses have already figured this out.
        </p>
      </div>
    </div>

  </section>
</template>

<style scoped>
.home-shift {
  position: relative;
  background: var(--color-cream);
  padding: 120px clamp(32px, 6vw, 96px);
  border-top: 0.5px solid #24272e;
  display: flex;
  justify-content: center;
}

.tw-hide {
  clip-path: inset(-0.1em 100% -0.25em 0);
}

.shift-container {
  max-width: 700px;
  width: 100%;
  display: flex;
  flex-direction: column;
}

.shift-cell {
  border: 0.5px solid #24272e;
  padding: 12px;
}

.shift-label {
  display: block;
  font-family: var(--font);
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: rgba(36, 39, 46, 0.5);
  margin-bottom: 8px;
}

.shift-headline {
  font-family: var(--font);
  font-size: clamp(32px, 4.5vw, 48px);
  font-weight: 600;
  color: var(--color-dark);
  line-height: 1.1;
  letter-spacing: -0.02em;
  margin: 0;
}

.shift-block-a {
  font-family: var(--font);
  font-size: 20px;
  font-weight: 300;
  color: var(--color-dark);
  line-height: 1.6;
  margin: 0;
}

.shift-standalone {
  font-family: var(--font);
  font-size: 20px;
  font-weight: 500;
  color: var(--color-dark);
  line-height: 1.6;
  margin: 0;
}

@media (max-width: 768px) {
  .home-shift {
    padding: 80px 20px;
  }
  .shift-headline {
    font-size: clamp(26px, 6vw, 36px);
  }
  .shift-block-a,
  .shift-standalone {
    font-size: 17px;
  }
  .shift-cell {
    padding: 10px;
  }
}
</style>
