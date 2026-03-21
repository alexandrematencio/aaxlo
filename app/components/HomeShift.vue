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
  const standaloneLine = el.querySelector('.shift-standalone')
  if (standaloneLine) gsap.set(standaloneLine, { opacity: 1 })
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

          /* Block A typewriter (slower) */
          tl.to(el.querySelector('.shift-block-a'), {
            clipPath: 'inset(-0.1em 0% -0.25em 0)', duration: 0.45, ease: 'steps(60)',
          }, '+=0.08')

          /* Block B typewriter */
          tl.to(el.querySelector('.shift-block-b'), {
            clipPath: 'inset(-0.1em 0% -0.25em 0)', duration: 0.2, ease: 'steps(50)',
          }, '+=0.06')

          /* Standalone line fade in */
          tl.to(el.querySelector('.shift-standalone'), {
            opacity: 1, duration: 0.12,
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
      <span class="shift-label tw-hide">THE SHIFT</span>
      <h2 class="shift-headline tw-hide">
        Something changed recently.
      </h2>

      <p class="shift-block-a tw-hide">
        Two years ago, getting a decent website built, your social media running properly, your search rankings sorted, and your customer communications automated would have meant hiring four or five people. The bill would have looked like it.
      </p>

      <p class="shift-block-b tw-hide">
        Today, AI does roughly 80% of that production work. Not the thinking. Not the decisions about what makes sense for your business. The repetitive, time-heavy part that used to eat most of the budget.
      </p>

      <p class="shift-standalone" style="opacity: 0">
        Some businesses have already figured this out.
      </p>
    </div>

  </section>
</template>

<style scoped>
.home-shift {
  position: relative;
  background: var(--color-dark);
  padding: 160px clamp(32px, 6vw, 96px);
  border-top: 0.5px solid #24272e;
}

.shift-label {
  display: block;
  font-family: var(--font);
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.3);
  margin-bottom: 32px;
}

.tw-hide {
  clip-path: inset(-0.1em 100% -0.25em 0);
}

.shift-container {
  max-width: 680px;
}

.shift-headline {
  font-family: var(--font);
  font-size: clamp(32px, 4.5vw, 52px);
  font-weight: 600;
  color: var(--color-cream);
  line-height: 1.1;
  letter-spacing: -0.02em;
  margin: 0;
}

.shift-block-a {
  font-family: var(--font);
  font-size: 20px;
  font-weight: 400;
  color: rgba(238, 238, 238, 0.7);
  line-height: 1.6;
  margin: 48px 0 0 0;
}

.shift-block-b {
  font-family: var(--font);
  font-size: 20px;
  font-weight: 400;
  color: rgba(238, 238, 238, 0.7);
  line-height: 1.6;
  margin: 64px 0 0 0;
}

.shift-standalone {
  font-family: var(--font);
  font-size: 20px;
  font-weight: 500;
  color: var(--color-cream);
  line-height: 1.6;
  margin: 80px 0 0 0;
}

@media (max-width: 768px) {
  .home-shift {
    padding: 100px 20px;
  }
  .shift-headline {
    font-size: clamp(26px, 6vw, 36px);
  }
  .shift-block-a,
  .shift-block-b,
  .shift-standalone {
    font-size: 17px;
  }
  .shift-block-a {
    margin-top: 36px;
  }
  .shift-block-b {
    margin-top: 48px;
  }
  .shift-standalone {
    margin-top: 56px;
  }
}
</style>
