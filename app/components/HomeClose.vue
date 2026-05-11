<script setup>
import { gsap } from 'gsap'

const props = defineProps({
  content: { type: Object, default: null },
  skip: { type: Boolean, default: false },
})

const section = ref(null)
const { navigateWithStripes } = useStripeTransition()
const localePath = useLocalePath()

function showFinalState() {
  const el = section.value
  if (!el) return

  el.querySelectorAll('.tw-hide').forEach(t => {
    gsap.set(t, { clipPath: 'inset(-0.1em 0% -0.25em 0)' })
  })
  const btn = el.querySelector('.close-cta')
  if (btn) gsap.set(btn, { opacity: 1, y: 0 })
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
          tl.to(el.querySelector('.close-label'), {
            clipPath: 'inset(-0.1em 0% -0.25em 0)', duration: 0.15, ease: 'steps(10)',
          }, '-=0.15')

          /* Headline typewriter */
          tl.to(el.querySelector('.close-headline'), {
            clipPath: 'inset(-0.1em 0% -0.25em 0)', duration: 0.2, ease: 'steps(10)',
          }, '-=0.1')

          /* Paragraphs stagger typewriter */
          const paras = el.querySelectorAll('.close-para')
          paras.forEach((p, i) => {
            tl.to(p, {
              clipPath: 'inset(-0.1em 0% -0.25em 0)',
              duration: 0.7,
              ease: 'steps(45)',
            }, i === 0 ? '+=0.06' : '-=0.1')
          })

          /* CTA fade in */
          tl.to(el.querySelector('.close-cta'), {
            opacity: 1, y: 0, duration: 0.2,
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
  <section ref="section" class="home-close">
    <div class="close-container">
      <div class="close-cell">
        <span class="close-label tw-hide">{{ content?.label }}</span>
        <h2 class="close-headline tw-hide">
          {{ content?.headline }}
        </h2>
      </div>

      <div v-for="(para, pi) in (content?.paragraphs || [])" :key="pi" class="close-cell">
        <p class="close-para tw-hide">
          {{ para }}
        </p>
      </div>

      <div class="close-cell close-cell--cta">
        <a
          :href="localePath('/audit')"
          class="close-cta"
          style="opacity: 0; transform: translateY(12px)"
          data-umami-event="audit-cta-click"
          data-umami-event-location="close"
          @click.prevent="navigateWithStripes(localePath('/audit'))"
        >
          {{ content?.cta }}
        </a>
      </div>
    </div>

  </section>
</template>

<style scoped>
.home-close {
  position: relative;
  background: #24272e;
  padding: 120px clamp(32px, 6vw, 96px);
  border-top: 0.5px solid #24272e;
  display: flex;
  justify-content: center;
}

.tw-hide {
  clip-path: inset(-0.1em 100% -0.25em 0);
}

.close-container {
  max-width: 700px;
  width: 100%;
  display: flex;
  flex-direction: column;
}

.close-cell {
  border: 0.5px solid rgba(255, 255, 255, 0.15);
  border-top: none;
  padding: 16px;
}
.close-cell:first-child {
  border-top: 0.5px solid rgba(255, 255, 255, 0.15);
}
.close-cell--cta {
  padding: 0;
}

.close-label {
  display: block;
  font-family: var(--font);
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.3);
  margin-bottom: 8px;
}

.close-headline {
  font-family: var(--font);
  font-size: clamp(32px, 5vw, 48px);
  font-weight: 600;
  color: var(--color-cream);
  line-height: 1.1;
  letter-spacing: -0.02em;
  margin: 0;
}

.close-para {
  font-family: var(--font);
  font-size: 20px;
  font-weight: 300;
  color: rgba(238, 238, 238, 0.7);
  line-height: 1.6;
  margin: 0;
}

.close-cta {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  width: 100%;
  font-family: var(--font);
  font-size: 16px;
  font-weight: 500;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  padding: 16px 40px;
  background: #FF8270;
  color: var(--color-dark);
  text-decoration: none;
  border: none;
  border-radius: 0;
  cursor: pointer;
  overflow: hidden;
  z-index: 1;
  transition: color 0.4s;
}
.close-cta::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background: var(--color-cream);
  transform: translate(-101%, 101%);
  transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
  z-index: -1;
}
.close-cta:hover::before {
  transform: translate(0, 0);
}
.close-cta:hover {
  color: var(--color-dark);
}

@media (max-width: 768px) {
  .home-close {
    padding: 80px 20px;
  }
  .close-headline {
    font-size: clamp(28px, 7vw, 38px);
  }
  .close-para {
    font-size: 17px;
  }
  .close-cell {
    padding: 10px;
  }
}
</style>
