<script setup>
import { gsap } from 'gsap'

const props = defineProps({
  skip: { type: Boolean, default: false },
})

const section = ref(null)
const { navigateWithStripes } = useStripeTransition()

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
      <span class="social-label tw-hide">EARLY ACCESS</span>
      <h2 class="social-headline tw-hide">
        We're onboarding our first clients in France right now.
      </h2>

      <p class="social-body tw-hide">
        We're staying small on purpose. Every early client works directly with the people who built this company, and gets more attention than they would anywhere else.
      </p>

      <p class="social-body tw-hide">
        If that sounds like what you've been looking for, this is a good time.
      </p>

      <a
        href="/contact"
        class="social-cta"
        style="opacity: 0; transform: translateY(12px)"
        @click.prevent="navigateWithStripes('/contact')"
      >
        Get in early →
      </a>
    </div>

  </section>
</template>

<style scoped>
.home-social-proof {
  position: relative;
  background: var(--color-cream);
  padding: 120px clamp(32px, 6vw, 96px);
  border-top: 0.5px solid #24272e;
}

.social-label {
  display: block;
  font-family: var(--font);
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--color-accent);
  margin-bottom: 32px;
}

.tw-hide {
  clip-path: inset(-0.1em 100% -0.25em 0);
}

.social-container {
  max-width: 640px;
}

.social-headline {
  font-family: var(--font);
  font-size: clamp(28px, 4vw, 44px);
  font-weight: 600;
  color: var(--color-dark);
  line-height: 1.15;
  letter-spacing: -0.02em;
  margin: 0;
}

.social-body {
  font-family: var(--font);
  font-size: 18px;
  font-weight: 400;
  color: var(--color-muted);
  line-height: 1.6;
  margin: 32px 0 0 0;
}

.social-body + .social-body {
  margin-top: 20px;
}

.social-cta {
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
  margin-top: 40px;
}
.social-cta::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background: var(--color-dark);
  transform: translate(-101%, 101%);
  transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
  z-index: -1;
}
.social-cta:hover::before {
  transform: translate(0, 0);
}
.social-cta:hover {
  color: var(--color-cream);
}

@media (max-width: 768px) {
  .home-social-proof {
    padding: 80px 20px;
  }
  .social-headline {
    font-size: clamp(24px, 6vw, 32px);
  }
  .social-body {
    font-size: 16px;
    margin-top: 24px;
  }
  .social-cta {
    padding: 14px 32px;
    font-size: 14px;
    margin-top: 32px;
  }
}
</style>
