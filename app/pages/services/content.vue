<script setup>
import { gsap } from 'gsap'

useHead({ title: 'Content — AAXLO' })

const page = ref(null)

const features = [
  {
    title: 'Social Media Management',
    description: 'Strategy, content calendar, copywriting, and publishing across Instagram, Facebook, TikTok, and LinkedIn. We handle everything so you can focus on your craft.',
  },
  {
    title: 'Content Repurposing',
    description: 'One video becomes 10 pieces of content. We slice, dice, and redistribute your best content across every platform — maximizing reach without multiplying your workload.',
  },
  {
    title: 'Brand Identity',
    description: 'Logo, color palette, typography, brand voice guidelines, and visual templates that make your business instantly recognizable and professionally consistent.',
  },
  {
    title: 'Photo & Video',
    description: 'Professional photography, short-form video production, and AI-enhanced editing. Content that looks premium without the premium agency price tag.',
  },
]

const faqs = [
  {
    question: 'How many posts per week do you create?',
    answer: 'Our standard plans include 3-5 posts per week across your chosen platforms. Each post is strategically timed and crafted with your brand voice. We also create stories, reels, and carousel content as part of the mix.',
    open: ref(false),
  },
  {
    question: 'Do you need access to our social media accounts?',
    answer: 'Yes, we use secure platform-native tools to manage your accounts. We never share credentials and you maintain full ownership. We can also work through Meta Business Suite or other collaboration tools if you prefer.',
    open: ref(false),
  },
  {
    question: 'Can you work with content we already have?',
    answer: 'Absolutely — that is actually our specialty. We take your existing photos, videos, blog posts, and customer testimonials and repurpose them into fresh, platform-optimized content. Nothing goes to waste.',
    open: ref(false),
  },
]

onMounted(() => {
  const el = page.value
  if (!el) return

  const tl = gsap.timeline({ defaults: { ease: 'power2.inOut' } })

  tl.to(el.querySelector('.back-link'), { clipPath: 'inset(-0.1em 0% -0.25em 0)', duration: 0.2, ease: 'steps(8)' }, '-=0.1')
  tl.to(el.querySelector('.hero-logo'), { clipPath: 'inset(-0.1em 0% -0.25em 0)', duration: 0.25, ease: 'power2.out' }, '-=0.15')
  tl.to(el.querySelector('.hero-label'), { clipPath: 'inset(-0.1em 0% -0.25em 0)', duration: 0.2, ease: 'steps(10)' }, '-=0.1')
  tl.to(el.querySelector('.hero-title'), { clipPath: 'inset(-0.1em 0% -0.25em 0)', duration: 0.45, ease: 'steps(30)' }, '-=0.1')
  tl.to(el.querySelector('.hero-desc'), { clipPath: 'inset(-0.1em 0% -0.25em 0)', duration: 0.35, ease: 'steps(40)' }, '-=0.2')
  const idx = el.querySelector('.hero-index')
  if (idx) tl.to(idx, { opacity: 1, duration: 0.3 }, '-=0.2')

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

  const faqSection = el.querySelector('.faq-section')
  if (faqSection) {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const ftl = gsap.timeline({ defaults: { ease: 'power2.out' } })
          ftl.to(faqSection.querySelector('.section-label'), { clipPath: 'inset(-0.1em 0% -0.25em 0)', duration: 0.2, ease: 'steps(10)' })
          ftl.to(faqSection.querySelectorAll('.faq-item'), { clipPath: 'inset(-0.1em 0% -0.25em 0)', duration: 0.25, stagger: 0.06 }, '-=0.1')
          obs.disconnect()
        }
      })
    }, { threshold: 0.15 })
    obs.observe(faqSection)
  }

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
    <section class="hero">
      <div class="hero-header">
        <NuxtLink to="/services" class="back-link tw-hide">&larr; ALL SERVICES</NuxtLink>
        <NuxtLink to="/">
          <img src="/axxlo-logo.svg" alt="AAXLO" class="hero-logo tw-hide" />
        </NuxtLink>
      </div>

      <!-- Service navigation -->
      <ServiceNav current="content" />

      <div class="hero-grid">
        <div class="hero-meta">
          <span class="hero-label tw-hide">CONTENT</span>
          <span class="hero-index">03</span>
        </div>
        <div class="hero-body">
          <h1 class="hero-title tw-hide">Content that converts strangers into customers.</h1>
          <p class="hero-desc tw-hide">Great content is not about going viral — it is about building trust, staying top of mind, and giving people a reason to choose you. We create content that does all three, consistently.</p>
        </div>
      </div>
    </section>

    <section class="features-section">
      <span class="section-label tw-hide">WHAT'S INCLUDED</span>
      <div class="feat-grid">
        <div v-for="feat in features" :key="feat.title" class="feat-card tw-hide">
          <h3 class="feat-title">{{ feat.title }}</h3>
          <p class="feat-desc">{{ feat.description }}</p>
        </div>
      </div>
    </section>

    <section class="faq-section">
      <div class="faq-container">
        <div class="faq-label-cell">
          <span class="section-label tw-hide">FREQUENTLY ASKED</span>
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

    <section class="cta-section">
      <h2 class="cta-title tw-hide">Ready to level up your content?</h2>
      <p class="cta-text tw-hide">Get a free audit and see what your content strategy is missing.</p>
      <NuxtLink to="/audit" class="cta-btn tw-hide">Get your free audit &rarr;</NuxtLink>
    </section>
  </div>
</template>

<style scoped>
.detail-page { position: relative; min-height: 100vh; background: var(--color-cream); }
.tw-hide { clip-path: inset(-0.1em 100% -0.25em 0); }

.hero { position: relative; }
.hero-header { position: relative; display: flex; justify-content: space-between; align-items: center; padding: 24px 32px; }
.back-link { font-family: var(--font); font-size: 12px; font-weight: 300; color: var(--color-muted); letter-spacing: 0.08em; text-transform: uppercase; text-decoration: none; transition: color 0.3s; }
.back-link:hover { color: var(--color-dark); }
.hero-logo { height: 28px; width: auto; }
.hero-grid { display: grid; grid-template-columns: 240px 1fr; }
.hero-meta { position: relative; display: flex; flex-direction: column; justify-content: space-between; padding: 48px 32px; border-right: 0.5px solid #24272e; }
.hero-label { font-family: var(--font); font-size: 11px; font-weight: 300; color: var(--color-accent); letter-spacing: 0.15em; text-transform: uppercase; }
.hero-index { font-family: var(--font); font-size: 140px; font-weight: 700; color: rgba(36, 39, 46, 0.04); line-height: 1; opacity: 0; }
.hero-body { display: flex; flex-direction: column; justify-content: center; gap: 32px; padding: 64px 80px; max-width: 720px; }
.hero-title { font-family: var(--font); font-size: 48px; font-weight: 600; color: var(--color-dark); line-height: 1.05; letter-spacing: -0.02em; }
.hero-desc { font-family: var(--font); font-size: 18px; font-weight: 300; color: var(--color-muted); line-height: 1.6; }

.features-section { padding: 96px 80px; border-top: 0.5px solid #24272e; }
.section-label { display: block; font-family: var(--font); font-size: 11px; font-weight: 300; color: var(--color-accent); letter-spacing: 0.15em; text-transform: uppercase; margin-bottom: 48px; }
.feat-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 48px 64px; }
.feat-card { display: flex; flex-direction: column; gap: 12px; }
.feat-title { font-family: var(--font); font-size: 22px; font-weight: 600; color: var(--color-dark); line-height: 1.2; }
.feat-desc { font-family: var(--font); font-size: 15px; font-weight: 400; color: var(--color-muted); line-height: 1.6; }

.faq-section { padding: 96px 80px; border-top: 0.5px solid #24272e; display: flex; justify-content: center; }
.faq-container { max-width: 700px; width: 100%; display: flex; flex-direction: column; }
.faq-label-cell { border: 0.5px solid #24272e; padding: 12px; }
.faq-list { display: flex; flex-direction: column; }
.faq-item { border: 0.5px solid #24272e; border-top: none; cursor: pointer; padding: 14px 12px; transition: background 0.2s; }
.faq-item:hover { background: var(--color-cream, #fff1ef); }
.faq-question { display: flex; justify-content: space-between; align-items: center; gap: 24px; font-family: var(--font); font-size: 18px; font-weight: 500; color: var(--color-dark); line-height: 1.3; }
.faq-toggle { font-size: 24px; font-weight: 300; color: var(--color-accent); flex-shrink: 0; width: 24px; text-align: center; }
.faq-answer { padding-top: 12px; }
.faq-answer p { font-family: var(--font); font-size: 15px; font-weight: 300; color: var(--color-muted); line-height: 1.6; }

.cta-section { display: flex; flex-direction: column; align-items: center; gap: 24px; padding: 96px 48px; text-align: center; border-top: 0.5px solid #24272e; }
.cta-title { font-family: var(--font); font-size: 36px; font-weight: 600; color: var(--color-dark); line-height: 1.1; }
.cta-text { font-family: var(--font); font-size: 18px; font-weight: 300; color: var(--color-muted); max-width: 480px; }
.cta-btn { font-family: var(--font); font-size: 16px; font-weight: 600; color: var(--color-cream); background: var(--color-dark); padding: 16px 40px; text-decoration: none; text-transform: uppercase; letter-spacing: 0.05em; transition: background 0.4s, transform 0.3s; }
.cta-btn:hover { background: var(--color-accent); transform: translateY(-2px); }

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
