<script setup>
import { gsap } from 'gsap'

useHead({ title: 'About — AAXLO' })

const page = ref(null)

const values = [
  {
    title: 'AI-first, human-led',
    description: 'We use AI to multiply output, never to replace craft. Every deliverable is reviewed, refined, and approved by a human strategist before it reaches you.',
  },
  {
    title: 'Local obsession',
    description: 'Big agencies chase enterprise contracts. We chase the restaurant owner who deserves the same tools. Local businesses are the backbone of every economy — we give them an unfair advantage.',
  },
  {
    title: 'Radical transparency',
    description: 'No jargon, no hidden fees, no vanity metrics. You will always know what we are doing, why we are doing it, and what it costs. If something is not working, we will tell you first.',
  },
  {
    title: 'Speed as a feature',
    description: 'Our AI-assisted workflows mean we deliver in days what traditional agencies deliver in weeks. Speed is not about cutting corners — it is about removing bottlenecks.',
  },
]

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
      <span class="hero-label tw-hide">ABOUT US</span>
      <h1 class="hero-title tw-hide">A team wired differently.</h1>
    </section>

    <!-- Story -->
    <section class="story-section">
      <div class="story-grid">
        <div class="story-col">
          <p class="story-text tw-hide">AAXLO is an AI-enhanced agency based in Singapore, built to democratize the tools and strategies that were once reserved for companies with six-figure marketing budgets.</p>
          <p class="story-text tw-hide">We started with a simple observation: local businesses — restaurants, clinics, salons, shops — are the heartbeat of every neighborhood. But they are being left behind in the AI revolution.</p>
        </div>
        <div class="story-col">
          <p class="story-text tw-hide">The big agencies do not care about them. The freelancers cannot keep up. And the DIY tools are overwhelming. We exist to fill that gap.</p>
          <p class="story-text tw-hide">Our team combines deep AI expertise with real-world marketing experience. We do not just know what is technically possible — we know what actually moves the needle for businesses like yours.</p>
        </div>
      </div>
    </section>

    <!-- Values -->
    <section class="values-section">
      <span class="section-label tw-hide">HOW WE WORK</span>
      <div class="values-grid">
        <div v-for="val in values" :key="val.title" class="value-card tw-hide">
          <h3 class="value-title">{{ val.title }}</h3>
          <p class="value-desc">{{ val.description }}</p>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="cta-section">
      <h2 class="cta-title tw-hide">Ready to work with us?</h2>
      <p class="cta-text tw-hide">Start with a free audit or get in touch directly.</p>
      <div class="cta-links">
        <NuxtLink to="/audit" class="cta-btn cta-btn--primary tw-hide">Get your free audit &rarr;</NuxtLink>
        <NuxtLink to="/contact" class="cta-btn cta-btn--secondary tw-hide">Contact us &rarr;</NuxtLink>
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
  font-family: var(--font);
  font-size: 16px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 16px 36px;
  text-decoration: none;
  transition: background 0.4s, color 0.4s, transform 0.3s;
}

.cta-btn--primary {
  color: var(--color-cream);
  background: var(--color-dark);
}
.cta-btn--primary:hover {
  background: var(--color-accent);
  transform: translateY(-2px);
}

.cta-btn--secondary {
  color: var(--color-dark);
  background: transparent;
  border: 0.5px solid #24272e;
}
.cta-btn--secondary:hover {
  background: var(--color-dark);
  color: var(--color-cream);
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
