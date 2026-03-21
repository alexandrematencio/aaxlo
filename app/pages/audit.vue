<script setup>
import { gsap } from 'gsap'

useHead({
  title: 'Free AI Audit — AAXLO',
  meta: [
    { name: 'description', content: 'Get a free AI-enhanced audit of your Google Business Profile, SEO, social media, reviews, and competitor landscape. Results in 48 hours.' },
  ],
})

const page = ref(null)

const form = reactive({
  businessName: '',
  websiteUrl: '',
  name: '',
  email: '',
  phone: '',
})

const submitted = ref(false)

function handleSubmit() {
  submitted.value = true
}

const auditCovers = [
  'Google Business Profile completeness and optimization score',
  'Local SEO health check and keyword opportunities',
  'Social media presence and engagement analysis',
  'Online review sentiment and response rate',
  'Competitor landscape and positioning gaps',
  'Website performance and mobile usability',
  'Top 3 quick wins you can implement this week',
]

const faqs = [
  {
    question: 'Is this really free? What is the catch?',
    answer: 'There is no catch. The audit is 100% free with no obligation. We use it to demonstrate our expertise and build trust. If you like the results, we can discuss working together — but there is zero pressure.',
    open: ref(false),
  },
  {
    question: 'How do you get the results so fast?',
    answer: 'Our proprietary AI tools analyze publicly available data about your business, competitors, and market in minutes. A human strategist then reviews the findings, adds context, and prepares your personalized report. That is how we deliver in 48 hours.',
    open: ref(false),
  },
  {
    question: 'What do I need to provide?',
    answer: 'Just your business name and website URL. That is enough for us to run a comprehensive analysis. Your contact details let us send you the report and answer any questions you have about the findings.',
    open: ref(false),
  },
  {
    question: 'Will you share my data with anyone?',
    answer: 'Never. Your business data is used exclusively to generate your audit report. We do not sell, share, or repurpose it. See our privacy policy for full details.',
    open: ref(false),
  },
]

onMounted(() => {
  const el = page.value
  if (!el) return

  const tl = gsap.timeline({ defaults: { ease: 'power2.inOut' } })

  tl.to(el.querySelector('.hero-label'), { clipPath: 'inset(-0.1em 0% -0.25em 0)', duration: 0.2, ease: 'steps(8)' }, '-=0.1')
  tl.to(el.querySelector('.hero-title'), { clipPath: 'inset(-0.1em 0% -0.25em 0)', duration: 0.5, ease: 'steps(30)' }, '-=0.1')
  tl.to(el.querySelector('.hero-subtitle'), { clipPath: 'inset(-0.1em 0% -0.25em 0)', duration: 0.4, ease: 'steps(40)' }, '-=0.2')

  /* Form section */
  tl.to(el.querySelector('.audit-form-card'), { clipPath: 'inset(-0.1em 0% -0.25em 0)', duration: 0.35, ease: 'power2.out' }, '-=0.15')

  /* Covers list */
  const coversSection = el.querySelector('.covers-section')
  if (coversSection) {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const ftl = gsap.timeline({ defaults: { ease: 'power2.out' } })
          ftl.to(coversSection.querySelector('.section-label'), { clipPath: 'inset(-0.1em 0% -0.25em 0)', duration: 0.2, ease: 'steps(10)' })
          ftl.to(coversSection.querySelectorAll('.cover-item'), { clipPath: 'inset(-0.1em 0% -0.25em 0)', duration: 0.2, stagger: 0.05 }, '-=0.1')
          obs.disconnect()
        }
      })
    }, { threshold: 0.15 })
    obs.observe(coversSection)
  }

  /* FAQ */
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
})
</script>

<template>
  <div ref="page" class="audit-page">
    <!-- Hero -->
    <section class="hero">
      <span class="hero-label tw-hide">FREE AUDIT</span>
      <h1 class="hero-title tw-hide">See exactly what's holding your business back online.</h1>
      <p class="hero-subtitle tw-hide">Our AI-enhanced audit analyzes your Google Business Profile, SEO, social media, reviews, and competitor landscape — all in 48 hours.</p>
    </section>

    <!-- Form + Trust -->
    <section class="form-section">
      <div class="form-layout">
        <!-- Form card -->
        <div class="audit-form-card tw-hide">
          <div v-if="!submitted">
            <form @submit.prevent="handleSubmit" class="audit-form">
              <div class="form-group">
                <label for="businessName" class="form-label">Business Name *</label>
                <input
                  id="businessName"
                  v-model="form.businessName"
                  type="text"
                  class="form-input"
                  required
                  placeholder="e.g. Joe's Coffee House"
                />
              </div>
              <div class="form-group">
                <label for="websiteUrl" class="form-label">Website URL *</label>
                <input
                  id="websiteUrl"
                  v-model="form.websiteUrl"
                  type="url"
                  class="form-input"
                  required
                  placeholder="https://example.com"
                />
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label for="name" class="form-label">Your Name *</label>
                  <input
                    id="name"
                    v-model="form.name"
                    type="text"
                    class="form-input"
                    required
                    placeholder="Jane Doe"
                  />
                </div>
                <div class="form-group">
                  <label for="email" class="form-label">Email *</label>
                  <input
                    id="email"
                    v-model="form.email"
                    type="email"
                    class="form-input"
                    required
                    placeholder="jane@example.com"
                  />
                </div>
              </div>
              <div class="form-group">
                <label for="phone" class="form-label">Phone (optional)</label>
                <input
                  id="phone"
                  v-model="form.phone"
                  type="tel"
                  class="form-input"
                  placeholder="+65 9123 4567"
                />
              </div>
              <button type="submit" class="form-submit">Run my free audit &rarr;</button>
            </form>
            <div class="trust-signals">
              <span class="trust-item">100% free</span>
              <span class="trust-sep">&middot;</span>
              <span class="trust-item">No credit card</span>
              <span class="trust-sep">&middot;</span>
              <span class="trust-item">Results in 48 hours</span>
            </div>
          </div>

          <!-- Success state -->
          <div v-else class="form-success">
            <h3 class="success-title">Audit requested!</h3>
            <p class="success-text">We'll analyze your business and send your personalized report to <strong>{{ form.email }}</strong> within 48 hours.</p>
            <NuxtLink to="/" class="success-link">&larr; Back to homepage</NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <!-- What the audit covers -->
    <section class="covers-section">
      <span class="section-label tw-hide">WHAT YOUR AUDIT COVERS</span>
      <ul class="covers-list">
        <li v-for="item in auditCovers" :key="item" class="cover-item tw-hide">
          {{ item }}
        </li>
      </ul>
    </section>

    <!-- FAQ -->
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
  </div>
</template>

<style scoped>
.audit-page { position: relative; min-height: 100vh; background: var(--color-cream); }
.tw-hide { clip-path: inset(-0.1em 100% -0.25em 0); }

/* ── HERO ── */
.hero {
  position: relative;
  padding: 96px 80px 64px;
  border-bottom: 0.5px solid #24272e;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
}

.hero-label {
  font-family: var(--font);
  font-size: 11px;
  font-weight: 400;
  color: var(--color-accent);
  letter-spacing: 0.15em;
  text-transform: uppercase;
}

.hero-title {
  font-family: var(--font);
  font-size: 48px;
  font-weight: 600;
  color: var(--color-dark);
  line-height: 1.1;
  letter-spacing: -0.02em;
  max-width: 700px;
}

.hero-subtitle {
  font-family: var(--font);
  font-size: 18px;
  font-weight: 400;
  color: var(--color-muted);
  line-height: 1.6;
  max-width: 600px;
}

/* ── FORM SECTION ── */
.form-section {
  padding: 0 80px 96px;
}

.form-layout {
  max-width: 640px;
  margin: 0 auto;
}

.audit-form-card {
  background: var(--color-white);
  border: 0.5px solid #24272e;
  padding: 48px;
}

.audit-form {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-label {
  font-family: var(--font);
  font-size: 12px;
  font-weight: 500;
  color: var(--color-dark);
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.form-input {
  font-family: var(--font);
  font-size: 16px;
  font-weight: 400;
  color: var(--color-dark);
  background: var(--color-cream);
  border: 0.5px solid #24272e;
  padding: 14px 16px;
  outline: none;
  transition: border-color 0.3s;
}
.form-input::placeholder {
  color: var(--color-muted);
  opacity: 0.5;
}
.form-input:focus {
  border-color: var(--color-accent);
}

.form-submit {
  font-family: var(--font);
  font-size: 16px;
  font-weight: 600;
  color: var(--color-cream);
  background: var(--color-dark);
  border: none;
  padding: 18px 40px;
  cursor: pointer;
  transition: background 0.4s, transform 0.3s;
  margin-top: 8px;
}
.form-submit:hover {
  background: var(--color-accent);
  transform: translateY(-2px);
}

.trust-signals {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  margin-top: 24px;
  font-family: var(--font);
  font-size: 13px;
  font-weight: 400;
  color: var(--color-muted);
}

.trust-sep {
  color: var(--color-border);
}

/* ── SUCCESS STATE ── */
.form-success {
  text-align: center;
  padding: 32px 0;
}

.success-title {
  font-family: var(--font);
  font-size: 28px;
  font-weight: 600;
  color: var(--color-dark);
  margin-bottom: 16px;
}

.success-text {
  font-family: var(--font);
  font-size: 16px;
  font-weight: 400;
  color: var(--color-muted);
  line-height: 1.6;
  margin-bottom: 32px;
}

.success-link {
  font-family: var(--font);
  font-size: 14px;
  font-weight: 500;
  color: var(--color-accent);
  text-decoration: none;
}

/* ── COVERS ── */
.covers-section {
  padding: 96px 80px;
  border-top: 0.5px solid #24272e;
}

.section-label {
  display: block;
  font-family: var(--font);
  font-size: 11px;
  font-weight: 400;
  color: var(--color-accent);
  letter-spacing: 0.15em;
  text-transform: uppercase;
  margin-bottom: 48px;
}

.covers-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-width: 640px;
}

.cover-item {
  font-family: var(--font);
  font-size: 16px;
  font-weight: 400;
  color: var(--color-dark);
  line-height: 1.4;
  padding-left: 24px;
  position: relative;
}
.cover-item::before {
  content: '';
  position: absolute;
  left: 0;
  top: 8px;
  width: 8px;
  height: 8px;
  background: var(--color-accent);
  border-radius: 50%;
}

/* ── FAQ ── */
.faq-section { padding: 96px 80px; border-top: 0.5px solid #24272e; }
.faq-list { display: flex; flex-direction: column; max-width: 720px; }
.faq-item { border-bottom: 0.5px solid #24272e; cursor: pointer; padding: 24px 0; }
.faq-question { display: flex; justify-content: space-between; align-items: center; gap: 24px; font-family: var(--font); font-size: 18px; font-weight: 500; color: var(--color-dark); line-height: 1.3; }
.faq-toggle { font-size: 24px; font-weight: 300; color: var(--color-accent); flex-shrink: 0; width: 24px; text-align: center; }
.faq-answer { padding-top: 16px; }
.faq-answer p { font-family: var(--font); font-size: 15px; font-weight: 400; color: var(--color-muted); line-height: 1.6; max-width: 640px; }

/* ── RESPONSIVE ── */
@media (max-width: 768px) {
  .hero { padding: 48px 24px 32px; }
  .hero-title { font-size: 32px; }
  .form-section { padding: 0 24px 64px; }
  .audit-form-card { padding: 32px 24px; }
  .form-row { grid-template-columns: 1fr; }
  .covers-section { padding: 64px 24px; }
  .faq-section { padding: 64px 24px; }
  .trust-signals { flex-direction: column; gap: 8px; }
  .trust-sep { display: none; }
}
</style>
