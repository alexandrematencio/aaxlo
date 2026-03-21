<script setup>
import { gsap } from 'gsap'

useHead({ title: 'Visibility — AAXLO' })

const page = ref(null)

const features = [
  {
    title: 'GBP Optimization',
    description: 'We transform your Google Business Profile into a conversion machine — optimized photos, posts, Q&A, categories, and attributes that make you rank higher and get more clicks.',
  },
  {
    title: 'Local SEO',
    description: 'On-page optimization, local keyword targeting, schema markup, and Google Maps ranking strategies designed specifically for businesses that serve a local area.',
  },
  {
    title: 'Directory Listings',
    description: 'Consistent NAP data across 60+ directories including Yelp, TripAdvisor, Apple Maps, and industry-specific platforms. No more conflicting information hurting your rankings.',
  },
  {
    title: 'Review Generation',
    description: 'Automated review request sequences via SMS and email, review response templates powered by AI, and reputation monitoring that alerts you in real time.',
  },
]

const faqs = [
  {
    question: 'How long before I see results from local SEO?',
    answer: 'Most businesses see measurable improvements in Google Maps rankings within 4-8 weeks. Full SEO results typically take 3-6 months, but we focus on quick wins first — like GBP optimization — that can drive calls and visits within days.',
    open: ref(false),
  },
  {
    question: 'Do I need a website for local visibility?',
    answer: 'Not necessarily. A fully optimized Google Business Profile can generate significant leads on its own. However, having a website strengthens your overall presence and gives you more control over your brand narrative. We can help with both.',
    open: ref(false),
  },
  {
    question: 'What happens to my existing reviews?',
    answer: 'Nothing — we never touch existing reviews. Our review generation system encourages new happy customers to leave reviews organically. We also set up AI-enhanced response templates so you can reply to every review (positive or negative) professionally and fast.',
    open: ref(false),
  },
]

onMounted(() => {
  const el = page.value
  if (!el) return

  const tl = gsap.timeline({ defaults: { ease: 'power2.inOut' } })

  /* Back link */
  tl.to(el.querySelector('.back-link'), { clipPath: 'inset(-0.1em 0% -0.25em 0)', duration: 0.2, ease: 'steps(8)' }, '-=0.1')

  /* Logo */
  tl.to(el.querySelector('.hero-logo'), { clipPath: 'inset(-0.1em 0% -0.25em 0)', duration: 0.25, ease: 'power2.out' }, '-=0.15')

  /* Label */
  tl.to(el.querySelector('.hero-label'), { clipPath: 'inset(-0.1em 0% -0.25em 0)', duration: 0.2, ease: 'steps(10)' }, '-=0.1')

  /* Title */
  tl.to(el.querySelector('.hero-title'), { clipPath: 'inset(-0.1em 0% -0.25em 0)', duration: 0.45, ease: 'steps(30)' }, '-=0.1')

  /* Description */
  tl.to(el.querySelector('.hero-desc'), { clipPath: 'inset(-0.1em 0% -0.25em 0)', duration: 0.35, ease: 'steps(40)' }, '-=0.2')

  /* Index */
  const idx = el.querySelector('.hero-index')
  if (idx) tl.to(idx, { opacity: 1, duration: 0.3 }, '-=0.2')

  /* Features section — IntersectionObserver */
  const featSection = el.querySelector('.features-section')
  if (featSection) {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const ftl = gsap.timeline({ defaults: { ease: 'power2.out' } })
          ftl.to(featSection.querySelector('.section-label'), { clipPath: 'inset(-0.1em 0% -0.25em 0)', duration: 0.2, ease: 'steps(10)' })
          ftl.to(featSection.querySelectorAll('.feat-card'), { clipPath: 'inset(-0.1em 0% -0.25em 0)', duration: 0.3, stagger: 0.08 }, '-=0.1')
          obs.disconnect()
        }
      })
    }, { threshold: 0.15 })
    obs.observe(featSection)
  }

  /* FAQ section */
  const faqSection = el.querySelector('.faq-section')
  if (faqSection) {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const ftl = gsap.timeline({ defaults: { ease: 'power2.out' } })
          ftl.to(faqSection.querySelector('.section-label'), { clipPath: 'inset(-0.1em 0% -0.25em 0)', duration: 0.2, ease: 'steps(10)' })
          ftl.to(faqSection.querySelector('.faq-title'), { clipPath: 'inset(-0.1em 0% -0.25em 0)', duration: 0.15, ease: 'steps(20)' }, '-=0.1')
          ftl.to(faqSection.querySelectorAll('.faq-item'), { clipPath: 'inset(-0.1em 0% -0.25em 0)', duration: 0.25, stagger: 0.06 }, '-=0.1')
          obs.disconnect()
        }
      })
    }, { threshold: 0.15 })
    obs.observe(faqSection)
  }

  /* CTA section */
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
  <div ref="page" class="detail-page">
    <!-- Hero -->
    <section class="hero">

      <!-- Header bar -->
      <div class="hero-header">
        <NuxtLink to="/services" class="back-link tw-hide">&larr; ALL SERVICES</NuxtLink>
        <NuxtLink to="/">
          <img src="/axxlo-logo.svg" alt="AAXLO" class="hero-logo tw-hide" />
        </NuxtLink>
      </div>

      <!-- Service navigation -->
      <ServiceNav current="visibility" />

      <!-- Content grid -->
      <div class="hero-grid">
        <div class="hero-meta">
          <span class="hero-label tw-hide">VISIBILITY</span>
          <span class="hero-index">01</span>
        </div>
        <div class="hero-body">
          <h1 class="hero-title tw-hide">Get found everywhere your customers are looking.</h1>
          <p class="hero-desc tw-hide">Your customers are searching for businesses like yours right now. We make sure they find you first — on Google, Maps, directories, and review platforms. No more invisible storefronts.</p>
        </div>
      </div>
    </section>

    <!-- Features -->
    <section class="features-section">
      <span class="section-label tw-hide">WHAT'S INCLUDED</span>
      <div class="feat-grid">
        <div v-for="feat in features" :key="feat.title" class="feat-card tw-hide">
          <h3 class="feat-title">{{ feat.title }}</h3>
          <p class="feat-desc">{{ feat.description }}</p>
        </div>
      </div>
    </section>

    <!-- FAQ -->
    <section class="faq-section">
      <div class="faq-container">
        <div class="faq-label-cell">
          <span class="section-label tw-hide">FREQUENTLY ASKED</span>
          <h2 class="faq-title tw-hide">Questions &amp; Answers</h2>
        </div>
        <div class="faq-list">
          <div
            v-for="faq in faqs"
            :key="faq.question"
            class="faq-item tw-hide"
            :class="{ 'faq-open': faq.open.value }"
            @click="faq.open.value = !faq.open.value"
          >
            <div class="faq-question">
              <span>{{ faq.question }}</span>
              <span class="faq-toggle">{{ faq.open.value ? '&minus;' : '+' }}</span>
            </div>
            <div v-show="faq.open.value" class="faq-answer">
              <p>{{ faq.answer }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="cta-section">
      <h2 class="cta-title tw-hide">Ready to be found?</h2>
      <p class="cta-text tw-hide">Get a free visibility audit and see exactly where you're missing out.</p>
      <NuxtLink to="/audit" class="cta-btn tw-hide">Get your free audit &rarr;</NuxtLink>
    </section>
  </div>
</template>

<style scoped>
.detail-page {
  position: relative;
  min-height: 100vh;
  background: var(--color-cream);
}

.tw-hide { clip-path: inset(-0.1em 100% -0.25em 0); }

/* ── HERO HEADER ── */
.hero { position: relative; }

.hero-header {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 32px;

}

.back-link {
  font-family: var(--font);
  font-size: 12px;
  font-weight: 300;
  color: var(--color-muted);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  text-decoration: none;
  transition: color 0.3s;
}
.back-link:hover { color: var(--color-dark); }

.hero-logo { height: 28px; width: auto; }

/* ── HERO GRID ── */
.hero-grid {
  display: grid;
  grid-template-columns: 240px 1fr;
}

.hero-meta {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 48px 32px;
  border-right: 0.5px solid #24272e;
}

.hero-label {
  font-family: var(--font);
  font-size: 11px;
  font-weight: 300;
  color: var(--color-accent);
  letter-spacing: 0.15em;
  text-transform: uppercase;
}

.hero-index {
  font-family: var(--font);
  font-size: 140px;
  font-weight: 700;
  color: rgba(36, 39, 46, 0.04);
  line-height: 1;
  opacity: 0;
}

.hero-body {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 32px;
  padding: 64px 80px;
  max-width: 720px;
}

.hero-title {
  font-family: var(--font);
  font-size: 48px;
  font-weight: 600;
  color: var(--color-dark);
  line-height: 1.05;
  letter-spacing: -0.02em;
}

.hero-desc {
  font-family: var(--font);
  font-size: 18px;
  font-weight: 300;
  color: var(--color-muted);
  line-height: 1.6;
}

/* ── FEATURES ── */
.features-section {
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

.feat-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 48px 64px;
}

.feat-card {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.feat-title {
  font-family: var(--font);
  font-size: 22px;
  font-weight: 600;
  color: var(--color-dark);
  line-height: 1.2;
}

.feat-desc {
  font-family: var(--font);
  font-size: 15px;
  font-weight: 400;
  color: var(--color-muted);
  line-height: 1.6;
}

/* ── FAQ ── */
.faq-section {
  padding: 96px 80px;
  border-top: 0.5px solid #24272e;
  display: flex;
  justify-content: center;
}

.faq-container {
  max-width: 700px;
  width: 100%;
  display: flex;
  flex-direction: column;
}

.faq-label-cell {
  border: 0.5px solid #24272e;
  padding: 12px;
}

.faq-label-cell .section-label {
  margin-bottom: 8px;
}

.faq-title {
  font-family: var(--font);
  font-size: clamp(28px, 4vw, 44px);
  font-weight: 600;
  color: var(--color-dark);
  line-height: 1.15;
  letter-spacing: -0.02em;
  margin: 0;
}

.faq-list {
  display: flex;
  flex-direction: column;
}

.faq-item {
  border: 0.5px solid #24272e;
  border-top: none;
  cursor: pointer;
  padding: 14px 12px;
  transition: background 0.2s;
}

.faq-item:hover {
  background: var(--color-cream, #fff1ef);
}

.faq-question {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 24px;
  font-family: var(--font);
  font-size: 18px;
  font-weight: 500;
  color: var(--color-dark);
  line-height: 1.3;
}

.faq-toggle {
  font-size: 24px;
  font-weight: 300;
  color: var(--color-accent);
  flex-shrink: 0;
  width: 24px;
  text-align: center;
}

.faq-answer {
  padding-top: 12px;
}

.faq-answer p {
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
  max-width: 480px;
}

.cta-btn {
  font-family: var(--font);
  font-size: 16px;
  font-weight: 600;
  color: var(--color-cream);
  background: var(--color-dark);
  padding: 16px 40px;
  text-decoration: none;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  transition: background 0.4s, transform 0.3s;
}
.cta-btn:hover {
  background: var(--color-accent);
  transform: translateY(-2px);
}

/* ── RESPONSIVE ── */
@media (max-width: 768px) {
  .hero-grid { grid-template-columns: 1fr; }
  .hero-meta { padding: 24px 24px 0; flex-direction: row; align-items: center; gap: 16px; }
  .hero-index { font-size: 60px; }
  .hero-body { padding: 32px 24px 48px; }
  .hero-title { font-size: 32px; }
  .features-section { padding: 64px 24px; }
  .feat-grid { grid-template-columns: 1fr; gap: 32px; }
  .faq-section { padding: 64px 24px; }
  .faq-item { padding: 12px 10px; }
  .faq-label-cell { padding: 10px; }
  .cta-section { padding: 64px 24px; }
  .cta-title { font-size: 28px; }
}
</style>
