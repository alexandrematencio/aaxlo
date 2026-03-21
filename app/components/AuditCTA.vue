<script setup>
import { gsap } from 'gsap'

const props = defineProps({
  skip: { type: Boolean, default: false },
})

const section = ref(null)
const formData = reactive({
  business: '',
  city: '',
  email: '',
})

function onSubmit() {
  // No backend — prevent default only
}

function showFinalState() {
  const el = section.value
  if (!el) return

  gsap.set(el.querySelector('.cta-headline'), { clipPath: 'inset(-0.1em 0% -0.25em 0)' })
  gsap.set(el.querySelector('.cta-subtitle'), { clipPath: 'inset(-0.1em 0% -0.25em 0)' })
  el.querySelectorAll('.audit-input').forEach(input => {
    gsap.set(input, { opacity: 1, y: 0 })
  })
  gsap.set(el.querySelector('.cta-button'), { opacity: 1, y: 0 })
  gsap.set(el.querySelector('.cta-small'), { opacity: 1 })
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
          tl.to(el.querySelector('.cta-headline'), {
            clipPath: 'inset(-0.1em 0% -0.25em 0)', duration: 0.12, ease: 'steps(28)',
          }, '-=0.15')

          /* Subheadline typewriter */
          tl.to(el.querySelector('.cta-subtitle'), {
            clipPath: 'inset(-0.1em 0% -0.25em 0)', duration: 0.2, ease: 'steps(30)',
          }, '-=0.1')

          /* Inputs stagger */
          const inputs = el.querySelectorAll('.audit-input')
          tl.to(inputs, {
            opacity: 1, y: 0, duration: 0.18, stagger: 0.015,
          }, '+=0.04')

          /* Button reveal */
          tl.to(el.querySelector('.cta-button'), {
            opacity: 1, y: 0, duration: 0.2,
          }, '+=0.05')

          /* Small text fade */
          tl.to(el.querySelector('.cta-small'), {
            opacity: 1, duration: 0.2,
          }, '+=0.06')

          observer.disconnect()
        }
      })
    },
    { threshold: 0.2 }
  )
  observer.observe(el)
})
</script>

<template>
  <section ref="section" class="audit-cta-section">
    <div class="audit-cta-inner">
      <span class="audit-label tw-hide">FREE AUDIT</span>
      <h2 class="cta-headline tw-hide">
        Find out what's costing you customers right now.
      </h2>
      <p class="cta-subtitle tw-hide">
        We scan your full digital presence — website, search visibility, reviews, social media, how you stack up against competitors — and put it in a clear report with scores and a plan. Takes us 24 hours. Costs you nothing.
      </p>

      <form class="audit-form" @submit.prevent="onSubmit">
        <div class="audit-form-fields">
          <input
            v-model="formData.business"
            type="text"
            class="audit-input"
            placeholder="Your business name"
            style="opacity: 0; transform: translateY(8px)"
          />
          <input
            v-model="formData.city"
            type="text"
            class="audit-input"
            placeholder="Your city"
            style="opacity: 0; transform: translateY(8px)"
          />
          <input
            v-model="formData.email"
            type="email"
            class="audit-input"
            placeholder="Your email"
            style="opacity: 0; transform: translateY(8px)"
          />
        </div>
        <button
          type="submit"
          class="cta-button"
          style="opacity: 0; transform: translateY(8px)"
        >
          Run my audit
        </button>
      </form>

      <p class="cta-small" style="opacity: 0">
        No commitment. No card. No calls unless you ask for them.<br />
        You get a full report with specific recommendations within 24 hours — whether you work with us after that or not.
      </p>
    </div>
  </section>
</template>

<style scoped>
.audit-cta-section {
  position: relative;
  background: var(--color-accent);
  padding: 120px clamp(32px, 6vw, 96px);
  border-top: 0.5px solid #24272e;
}

/* -- tw-hide -- */
.tw-hide {
  clip-path: inset(-0.1em 100% -0.25em 0);
}

.audit-label {
  display: block;
  font-family: var(--font);
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: rgba(36, 39, 46, 0.5);
  margin-bottom: 32px;
}

.audit-cta-inner {
  max-width: 720px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.cta-headline {
  font-family: var(--font);
  font-size: clamp(32px, 5vw, 52px);
  font-weight: 600;
  color: var(--color-dark);
  line-height: 1.1;
  letter-spacing: -0.02em;
}

.cta-subtitle {
  font-family: var(--font);
  font-size: 18px;
  font-weight: 400;
  color: rgba(36, 39, 46, 0.7);
  line-height: 1.5;
  max-width: 580px;
  margin-top: 24px;
}

/* -- Form -- */
.audit-form {
  width: 100%;
  max-width: 420px;
  margin-top: 48px;
}

.audit-form-fields {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.audit-input {
  width: 100%;
  padding: 16px 20px;
  font-family: var(--font);
  font-size: 16px;
  background: var(--color-white, #fcfcfc);
  border: 0.5px solid #24272e;
  border-radius: 0;
  color: var(--color-dark);
  outline: none;
  transition: border-color 0.25s;
  -webkit-appearance: none;
  appearance: none;
}

.audit-input::placeholder {
  color: var(--color-muted, #6e7381);
}

.audit-input:focus {
  border-color: var(--color-dark);
}

/* -- CTA Button -- */
.cta-button {
  display: block;
  width: 100%;
  position: relative;
  font-family: var(--font);
  font-size: 16px;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  padding: 18px;
  background: var(--color-dark);
  color: var(--color-cream);
  text-decoration: none;
  border: none;
  border-radius: 0;
  cursor: pointer;
  overflow: hidden;
  z-index: 1;
  transition: color 0.4s;
  margin-top: 24px;
}
.cta-button::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background: var(--color-accent);
  transform: translate(-101%, 101%);
  transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
  z-index: -1;
}
.cta-button:hover::before {
  transform: translate(0, 0);
}
.cta-button:hover {
  color: var(--color-dark);
  border: 0.5px solid #24272e;
}

.cta-small {
  font-family: var(--font);
  font-size: 14px;
  font-weight: 400;
  color: rgba(36, 39, 46, 0.5);
  line-height: 1.6;
  margin-top: 32px;
}

@media (max-width: 768px) {
  .audit-cta-section {
    padding: 80px 20px;
  }
  .cta-headline {
    font-size: clamp(26px, 6vw, 36px);
  }
  .cta-subtitle {
    font-size: 16px;
  }
  .audit-input {
    padding: 14px 16px;
    font-size: 15px;
  }
  .cta-button {
    padding: 16px;
    font-size: 14px;
  }
}
</style>
