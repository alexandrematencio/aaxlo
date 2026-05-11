<script setup>
import { gsap } from 'gsap'

const { t } = useI18n()
const localePath = useLocalePath()
const { data: aboutData } = await useLocalizedContent('/about')

useHead({
  title: aboutData.value?.seo?.title,
  meta: [{ name: 'description', content: aboutData.value?.seo?.description }],
})

const page = ref(null)
useShineHover(page, '.cta-btn')

const values = computed(() => aboutData.value?.values?.items || [])

onMounted(() => {
  const el = page.value
  if (!el) return

  const tl = gsap.timeline({ defaults: { ease: 'power2.inOut' } })

  tl.to(el.querySelector('.hero-label'), { clipPath: 'inset(-0.1em 0% -0.25em 0)', duration: 0.2, ease: 'steps(8)' }, '-=0.1')
  tl.to(el.querySelector('.hero-title'), { clipPath: 'inset(-0.1em 0% -0.25em 0)', duration: 0.5, ease: 'steps(20)' }, '-=0.1')

  /* Story section */
  const storySection = el.querySelector('.story-section')
  if (storySection) {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          gsap.to(storySection.querySelectorAll('.tw-hide'), { clipPath: 'inset(-0.1em 0% -0.25em 0)', duration: 0.4, stagger: 0.08, ease: 'steps(30)' })
          obs.disconnect()
        }
      })
    }, { threshold: 0.15 })
    obs.observe(storySection)
  }

  /* Values section */
  const valuesSection = el.querySelector('.values-section')
  if (valuesSection) {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const ftl = gsap.timeline({ defaults: { ease: 'power2.out' } })
          ftl.to(valuesSection.querySelector('.section-label'), { clipPath: 'inset(-0.1em 0% -0.25em 0)', duration: 0.2, ease: 'steps(10)' })
          ftl.to(valuesSection.querySelectorAll('.value-card'), { clipPath: 'inset(-0.1em 0% -0.25em 0)', duration: 0.3, stagger: 0.08 }, '-=0.1')
          obs.disconnect()
        }
      })
    }, { threshold: 0.15 })
    obs.observe(valuesSection)
  }

  /* CTA */
  const ctaSection = el.querySelector('.cta-section')
  if (ctaSection) {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          gsap.to(ctaSection.querySelectorAll('.tw-hide'), { clipPath: 'inset(-0.1em 0% -0.25em 0)', duration: 0.35, stagger: 0.06, ease: 'steps(20)' })
          obs.disconnect()
        }
      })
    }, { threshold: 0.2 })
    obs.observe(ctaSection)
  }
})
</script>

<template>
  <div ref="page" class="about-page">
    <!-- Hero -->
    <section class="hero">
      <span class="hero-label tw-hide">{{ aboutData?.hero?.label }}</span>
      <h1 class="hero-title tw-hide">{{ aboutData?.hero?.title }}</h1>
    </section>

    <!-- Story -->
    <section class="story-section">
      <div class="story-grid">
        <div class="story-col">
          <p v-for="(paragraph, i) in aboutData?.story?.left" :key="'left-' + i" class="story-text tw-hide">{{ paragraph }}</p>
        </div>
        <div class="story-col">
          <p v-for="(paragraph, i) in aboutData?.story?.right" :key="'right-' + i" class="story-text tw-hide">{{ paragraph }}</p>
        </div>
      </div>
    </section>

    <!-- Values -->
    <section class="values-section">
      <span class="section-label tw-hide">{{ aboutData?.values?.label }}</span>
      <div class="values-grid">
        <div v-for="val in values" :key="val.title" class="value-card tw-hide">
          <h3 class="value-title">{{ val.title }}</h3>
          <p class="value-desc">{{ val.description }}</p>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="cta-section">
      <h2 class="cta-title tw-hide">{{ aboutData?.cta?.title }}</h2>
      <p class="cta-text tw-hide">{{ aboutData?.cta?.text }}</p>
      <div class="cta-links">
        <NuxtLink
          v-for="btn in aboutData?.cta?.buttons"
          :key="btn.to"
          :to="localePath(btn.to)"
          class="cta-btn tw-hide"
          :class="btn.variant === 'primary' ? 'cta-btn--primary' : 'cta-btn--secondary'"
          :data-umami-event="btn.to.includes('audit') ? 'audit-cta-click' : btn.to.includes('contact') ? 'contact-cta-click' : 'about-cta-click'"
          :data-umami-event-location="`about-${btn.variant || 'secondary'}`"
          v-html="btn.label"
        />
      </div>
    </section>
  </div>
</template>

<style scoped>
.about-page { position: relative; min-height: 100vh; background: var(--color-cream); }
.tw-hide { clip-path: inset(-0.1em 100% -0.25em 0); }

/* ── HERO ── */
.hero {
  position: relative;
  padding: 96px 80px 64px;
  border-bottom: 0.5px solid #24272e;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.hero-label {
  font-family: var(--font);
  font-size: 11px;
  font-weight: 300;
  color: var(--color-accent);
  letter-spacing: 0.15em;
  text-transform: uppercase;
}

.hero-title {
  font-family: var(--font);
  font-size: 56px;
  font-weight: 600;
  color: var(--color-dark);
  line-height: 1.05;
  letter-spacing: -0.02em;
  max-width: 600px;
}

/* ── STORY ── */
.story-section {
  padding: 96px 80px;
  border-top: 0.5px solid #24272e;
}

.story-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 64px;
}

.story-col {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.story-text {
  font-family: var(--font);
  font-size: 17px;
  font-weight: 300;
  color: var(--color-muted);
  line-height: 1.7;
}

/* ── VALUES ── */
.values-section {
  padding: 96px 80px;
  border-top: 0.5px solid #24272e;
}

.section-label {
  display: block;
  font-family: var(--font);
  font-size: 11px;
  font-weight: 300;
  color: var(--color-accent);
  letter-spacing: 0.15em;
  text-transform: uppercase;
  margin-bottom: 48px;
}

.values-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 48px 64px;
}

.value-card {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.value-title {
  font-family: var(--font);
  font-size: 22px;
  font-weight: 600;
  color: var(--color-dark);
  line-height: 1.2;
}

.value-desc {
  font-family: var(--font);
  font-size: 15px;
  font-weight: 300;
  color: var(--color-muted);
  line-height: 1.6;
}

/* ── CTA ── */
.cta-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  padding: 96px 48px;
  text-align: center;
  border-top: 0.5px solid #24272e;
}

.cta-title {
  font-family: var(--font);
  font-size: 36px;
  font-weight: 600;
  color: var(--color-dark);
  line-height: 1.1;
}

.cta-text {
  font-family: var(--font);
  font-size: 18px;
  font-weight: 300;
  color: var(--color-muted);
}

.cta-links {
  display: flex;
  gap: 16px;
  margin-top: 8px;
}

.cta-btn {
  position: relative;
  overflow: hidden;
  font-family: var(--font);
  font-size: 16px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 16px 36px;
  text-decoration: none;
}

.cta-btn--primary {
  color: var(--color-cream);
  background: var(--color-dark);
}
.cta-btn--primary:hover {
  /* Shine hover — handled by useShineHover composable */
}

.cta-btn--secondary {
  color: var(--color-dark);
  background: transparent;
  border: 0.5px solid #24272e;
}
.cta-btn--secondary:hover {
  /* Shine hover — handled by useShineHover composable */
  transform: translateY(-2px);
}

/* ── RESPONSIVE ── */
@media (max-width: 768px) {
  .hero { padding: 48px 24px 32px; }
  .hero-title { font-size: 36px; }
  .story-section { padding: 64px 24px; }
  .story-grid { grid-template-columns: 1fr; gap: 24px; }
  .values-section { padding: 64px 24px; }
  .values-grid { grid-template-columns: 1fr; gap: 32px; }
  .cta-section { padding: 64px 24px; }
  .cta-title { font-size: 28px; }
  .cta-links { flex-direction: column; width: 100%; }
  .cta-btn { text-align: center; }
}
</style>
