<script setup>
import { gsap } from 'gsap'

const props = defineProps({ skip: { type: Boolean, default: false } })
const section = ref(null)

const steps = [
  { label: 'DIGITAL AUDIT', title: '24 hours.', number: '01' },
  { label: 'WEBSITE LIVE', title: 'Under two weeks.', number: '02' },
  { label: 'SOCIAL MEDIA READY', title: 'One week.', number: '03' },
]

function showFinalState() {
  const el = section.value
  if (!el) return
  el.querySelectorAll('.step-item').forEach(c => gsap.set(c, { clipPath: 'inset(0 0 0 0)' }))
  el.querySelectorAll('.step-label').forEach(s => gsap.set(s, { clipPath: 'inset(-0.1em 0% -0.25em 0)' }))
  el.querySelectorAll('.step-title').forEach(t => gsap.set(t, { clipPath: 'inset(-0.1em 0% -0.25em 0)' }))
  el.querySelectorAll('.step-number').forEach(n => gsap.set(n, { opacity: 1 }))
}

onMounted(() => {
  const el = section.value
  if (!el) return

  if (props.skip) { showFinalState(); return }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const tl = gsap.timeline({ defaults: { ease: 'power2.out' } })

          /* Cells clip-path reveal staggered */
          const cells = el.querySelectorAll('.step-item')
          tl.to(cells, {
            clipPath: 'inset(0 0 0 0)', duration: 0.15, stagger: 0.015,
          }, '-=0.15')

          /* Step labels typewriter */
          const labels = el.querySelectorAll('.step-label')
          tl.to(labels, {
            clipPath: 'inset(-0.1em 0% -0.25em 0)', duration: 0.2, stagger: 0.03, ease: 'steps(6)',
          }, '-=0.2')

          /* Titles typewriter */
          const titles = el.querySelectorAll('.step-title')
          tl.to(titles, {
            clipPath: 'inset(-0.1em 0% -0.25em 0)', duration: 0.18, stagger: 0.03, ease: 'steps(15)',
          }, '-=0.15')

          /* Numbers fade in */
          const numbers = el.querySelectorAll('.step-number')
          tl.to(numbers, { opacity: 1, duration: 0.2, stagger: 0.06 }, '-=0.2')

          observer.disconnect()
        }
      })
    },
    { threshold: 0.1 }
  )
  observer.observe(el)
})
</script>

<template>
  <section ref="section" class="how-section">
    <div class="how-grid">
      <div
        v-for="step in steps"
        :key="step.number"
        class="step-item"
        style="clip-path: inset(0 100% 0 0)"
      >
        <div class="step-content">
          <span class="step-label tw-hide">{{ step.label }}</span>
          <p class="step-title tw-hide">{{ step.title }}</p>
        </div>
        <span class="step-number" aria-hidden="true">{{ step.number }}</span>
      </div>
    </div>

  </section>
</template>

<style scoped>
.how-section {
  position: relative;
  background: var(--color-white);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  border-top: 0.5px solid #24272e;
}

.tw-hide { clip-path: inset(-0.1em 100% -0.25em 0); }

/* ── Grid ── */
.how-grid {
  display: flex;
  flex: 1;
}

/* ── Step items ── */
.step-item {
  position: relative;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0 64px;
  background: var(--color-white);
  overflow: hidden;
  color: var(--color-dark);
  border-right: 0.5px solid #24272e;
}
.step-item:last-child {
  border-right: none;
}

/* ── Content ── */
.step-content {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: 0;
}

.step-label {
  font-family: var(--font);
  font-size: 12px;
  font-weight: 400;
  line-height: 0.88;
  text-transform: uppercase;
  color: var(--color-dark);
}

.step-title {
  font-family: var(--font);
  font-size: 48px;
  font-weight: 600;
  line-height: 1;
  color: var(--color-dark);
  margin: 0;
}

/* ── Large faded number ── */
.step-number {
  position: absolute;
  bottom: 16px;
  right: 24px;
  font-family: var(--font);
  font-size: 120px;
  font-weight: 700;
  color: rgba(255, 130, 112, 0.15);
  z-index: 0;
  opacity: 0;
  line-height: 1;
  pointer-events: none;
}

/* ── Responsive ── */
@media (max-width: 1024px) {
  .how-grid {
    flex-direction: column;
  }
  .step-item {
    border-right: none;
    border-bottom: 0.5px solid #24272e;
    padding: 48px 32px;
    min-height: 250px;
  }
  .step-item:last-child {
    border-bottom: none;
  }
  .step-title {
    font-size: clamp(32px, 5vw, 44px);
  }
}
</style>
