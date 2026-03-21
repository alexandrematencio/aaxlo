<script setup>
import { gsap } from 'gsap'

useHead({ title: 'Web — AAXLO' })

const page = ref(null)

const features = [
  {
    title: 'Modern Websites',
    description: 'Fast, mobile-first websites built with performance and conversion in mind. No bloated templates — every page is crafted to turn visitors into customers.',
  },
  {
    title: 'Digital Menus & QR',
    description: 'Beautiful, updatable digital menus with QR code access. Perfect for restaurants, cafes, and bars that want to ditch the paper and impress their guests.',
  },
  {
    title: 'Booking & Ordering Systems',
    description: 'Online booking, table reservations, and ordering systems integrated directly into your site. Reduce no-shows and let customers self-serve 24/7.',
  },
  {
    title: 'E-commerce',
    description: 'Sell products online with a store that matches your brand. Inventory management, payment processing, and shipping — all set up and ready to go.',
  },
]

const faqs = [
  {
    question: 'How long does it take to build a website?',
    answer: 'A standard business website takes 2-4 weeks from kickoff to launch. More complex projects with booking systems or e-commerce typically take 4-8 weeks. We move fast because our AI-assisted workflows handle the repetitive work, so our team can focus on strategy and design.',
    open: ref(false),
  },
  {
    question: 'Will I be able to update the website myself?',
    answer: 'Absolutely. Every site we build comes with a simple content management system. We also provide a 30-minute walkthrough so you feel confident making changes. And if you ever get stuck, we are one message away.',
    open: ref(false),
  },
  {
    question: 'Do you handle hosting and maintenance?',
    answer: 'Yes. We offer managed hosting with SSL, daily backups, uptime monitoring, and monthly security updates. You focus on running your business — we keep your site fast, secure, and online.',
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
      <ServiceNav current="web" />

      <div class="hero-grid">
        <div class="hero-meta">
          <span class="hero-label tw-hide">WEB</span>
          <span class="hero-index">02</span>
        </div>
        <div class="hero-body">
          <h1 class="hero-title tw-hide">Your digital storefront, reimagined.</h1>
          <p class="hero-desc tw-hide">Your website is your hardest-working employee — it never sleeps, never takes a day off, and talks to every single potential customer. We make sure it's doing that job brilliantly.</p>
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
      <span class="section-label tw-hide">FREQUENTLY ASKED</span>
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
    </section>

    <section class="cta-section">
      <h2 class="cta-title tw-hide">Need a new website?</h2>
      <p class="cta-text tw-hide">Let us audit your current site and show you what's possible.</p>
      <NuxtLink to="/audit" class="cta-btn tw-hide">Get my free audit &rarr;</NuxtLink>
    </section>
  </div>
</template>

<style scoped>
.detail-page { position: relative; min-height: 100vh; background: var(--color-cream); }
.tw-hide { clip-path: inset(-0.1em 100% -0.25em 0); }

.hero { position: relative; border-bottom: 0.5px solid #24272e; }
.hero-header { position: relative; display: flex; justify-content: space-between; align-items: center; padding: 24px 32px; }
.back-link { font-family: var(--font); font-size: 12px; font-weight: 400; color: var(--color-muted); letter-spacing: 0.08em; text-transform: uppercase; text-decoration: none; transition: color 0.3s; }
.back-link:hover { color: var(--color-dark); }
.hero-logo { height: 28px; width: auto; }
.hero-grid { display: grid; grid-template-columns: 240px 1fr; }
.hero-meta { position: relative; display: flex; flex-direction: column; justify-content: space-between; padding: 48px 32px; border-right: 0.5px solid #24272e; }
.hero-label { font-family: var(--font); font-size: 11px; font-weight: 400; color: var(--color-accent); letter-spacing: 0.15em; text-transform: uppercase; }
.hero-index { font-family: var(--font); font-size: 140px; font-weight: 700; color: rgba(36, 39, 46, 0.04); line-height: 1; opacity: 0; }
.hero-body { display: flex; flex-direction: column; justify-content: center; gap: 32px; padding: 64px 80px; max-width: 720px; }
.hero-title { font-family: var(--font); font-size: 48px; font-weight: 600; color: var(--color-dark); line-height: 1.05; letter-spacing: -0.02em; }
.hero-desc { font-family: var(--font); font-size: 18px; font-weight: 400; color: var(--color-muted); line-height: 1.6; }

.features-section { padding: 96px 80px; }
.section-label { display: block; font-family: var(--font); font-size: 11px; font-weight: 400; color: var(--color-accent); letter-spacing: 0.15em; text-transform: uppercase; margin-bottom: 48px; }
.feat-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 48px 64px; }
.feat-card { display: flex; flex-direction: column; gap: 12px; }
.feat-title { font-family: var(--font); font-size: 22px; font-weight: 600; color: var(--color-dark); line-height: 1.2; }
.feat-desc { font-family: var(--font); font-size: 15px; font-weight: 400; color: var(--color-muted); line-height: 1.6; }

.faq-section { padding: 96px 80px; border-top: 0.5px solid #24272e; }
.faq-list { display: flex; flex-direction: column; }
.faq-item { border-bottom: 0.5px solid #24272e; cursor: pointer; padding: 24px 0; }
.faq-question { display: flex; justify-content: space-between; align-items: center; gap: 24px; font-family: var(--font); font-size: 18px; font-weight: 500; color: var(--color-dark); line-height: 1.3; }
.faq-toggle { font-size: 24px; font-weight: 300; color: var(--color-accent); flex-shrink: 0; width: 24px; text-align: center; }
.faq-answer { padding-top: 16px; }
.faq-answer p { font-family: var(--font); font-size: 15px; font-weight: 400; color: var(--color-muted); line-height: 1.6; max-width: 640px; }

.cta-section { display: flex; flex-direction: column; align-items: center; gap: 24px; padding: 96px 48px; text-align: center; border-top: 0.5px solid #24272e; }
.cta-title { font-family: var(--font); font-size: 36px; font-weight: 600; color: var(--color-dark); line-height: 1.1; }
.cta-text { font-family: var(--font); font-size: 18px; font-weight: 400; color: var(--color-muted); max-width: 480px; }
.cta-btn { font-family: var(--font); font-size: 16px; font-weight: 600; color: var(--color-cream); background: var(--color-dark); padding: 16px 40px; text-decoration: none; transition: background 0.4s, transform 0.3s; }
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
  .cta-section { padding: 64px 24px; }
  .cta-title { font-size: 28px; }
}
</style>
