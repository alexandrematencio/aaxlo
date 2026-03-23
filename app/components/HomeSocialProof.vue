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
  const btn = el.querySelector('.social-cta')
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
          tl.to(el.querySelector('.social-label'), {
            clipPath: 'inset(-0.1em 0% -0.25em 0)', duration: 0.15, ease: 'steps(10)',
          }, '-=0.15')

          /* Headline typewriter */
          tl.to(el.querySelector('.social-headline'), {
            clipPath: 'inset(-0.1em 0% -0.25em 0)', duration: 0.15, ease: 'steps(40)',
          }, '-=0.1')

          /* Body paragraphs typewriter */
          const paras = el.querySelectorAll('.social-body')
          paras.forEach((p, i) => {
            tl.to(p, {
              clipPath: 'inset(-0.1em 0% -0.25em 0)',
              duration: 0.7,
              ease: 'steps(45)',
            }, i === 0 ? '+=0.04' : '-=0.15')
          })

          /* CTA fade in */
          tl.to(el.querySelector('.social-cta'), {
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
  <section ref="section" class="home-social-proof">
    <div class="social-container">
      <div class="social-cell">
        <span class="social-label tw-hide">{{ content?.label }}</span>
        <h2 class="social-headline tw-hide">
          {{ content?.headline }}
        </h2>
      </div>

      <div v-for="(para, pi) in (content?.paragraphs || [])" :key="pi" class="social-cell">
        <p class="social-body tw-hide">
          {{ para }}
        </p>
      </div>

      <div class="social-cell">
        <a
          :href="localePath('/contact')"
          class="social-cta"
          style="opacity: 0; transform: translateY(12px)"
          @click.prevent="navigateWithStripes(localePath('/contact'))"
        >
          {{ content?.cta }}
        </a>
      </div>
    </div>

  </section>
</template>

<style scoped>
.home-social-proof {
  position: relative;
  background: #F2F3F5;
  padding: 120px clamp(32px, 6vw, 96px);
  border-top: 0.5px solid #24272e;
  display: flex;
  justify-content: center;
}

.tw-hide {
  clip-path: inset(-0.1em 100% -0.25em 0);
}

.social-container {
  max-width: 700px;
  width: 100%;
  display: flex;
  flex-direction: column;
}

.social-cell {
  border: 0.5px solid #24272e;
  border-top: none;
  padding: 16px;
}
.social-cell:first-child {
  border-top: 0.5px solid #24272e;
}

.social-label {
  display: block;
  font-family: var(--font);
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: rgba(36, 39, 46, 0.5);
  margin-bottom: 8px;
}

.social-headline {
  font-family: var(--font);
  font-size: clamp(28px, 4vw, 48px);
  font-weight: 600;
  color: var(--color-dark);
  line-height: 1.1;
  letter-spacing: -0.02em;
  margin: 0;
}

.social-body {
  font-family: var(--font);
  font-size: 20px;
  font-weight: 300;
  color: var(--color-dark);
  line-height: 1.6;
  margin: 0;
}

.social-cta {
  display: inline-block;
  font-family: var(--font);
  font-size: 18px;
  font-weight: 500;
  color: var(--color-dark);
  text-decoration: none;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  transition: color 0.3s;
}
.social-cta:hover {
  color: var(--color-accent);
}

@media (max-width: 768px) {
  .home-social-proof {
    padding: 80px 20px;
  }
  .social-headline {
    font-size: clamp(24px, 6vw, 32px);
  }
  .social-body {
    font-size: 17px;
  }
  .social-cell {
    padding: 10px;
  }
}
</style>
