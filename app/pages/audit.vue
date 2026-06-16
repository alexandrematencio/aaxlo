<script setup>
import { gsap } from 'gsap'

const { t, locale } = useI18n()
const localePath = useLocalePath()
const { track } = useUmami()
const { data: auditData } = await useLocalizedContent('/audit')

useContentSeo(auditData)
useSchemaOrg([
  defineWebPage({ '@type': 'FAQPage' }),
  ...(auditData.value?.faqs || []).map((f) =>
    defineQuestion({ name: f.question, acceptedAnswer: f.answer }),
  ),
])

const page = ref(null)

const auditCovers = computed(() => auditData.value?.covers?.items || [])

const faqsData = computed(() => auditData.value?.faqs || [])
const faqOpen = ref(faqsData.value.map(() => false))
watch(faqsData, (val) => { faqOpen.value = val.map(() => false) })

function toggleFaq(index) {
  const wasOpen = !!faqOpen.value[index]
  faqOpen.value[index] = !wasOpen
  if (!wasOpen) track('faq-open', { index, locale: locale.value })
}

onMounted(() => {
  const el = page.value
  if (!el) return

  const tl = gsap.timeline({ defaults: { ease: 'power2.inOut' } })

  tl.to(el.querySelector('.hero-label'), { clipPath: 'inset(-0.1em 0% -0.25em 0)', duration: 0.2, ease: 'steps(8)' }, '-=0.1')
  tl.to(el.querySelector('.hero-title'), { clipPath: 'inset(-0.1em 0% -0.25em 0)', duration: 0.5, ease: 'steps(30)' }, '-=0.1')
  tl.to(el.querySelector('.hero-subtitle'), { clipPath: 'inset(-0.1em 0% -0.25em 0)', duration: 0.4, ease: 'steps(40)' }, '-=0.2')

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
          ftl.to(faqSection.querySelector('.faq-title'), { clipPath: 'inset(-0.1em 0% -0.25em 0)', duration: 0.15, ease: 'steps(20)' }, '-=0.1')
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
      <span class="hero-label tw-hide">{{ auditData?.hero?.label }}</span>
      <h1 class="hero-title tw-hide">{{ auditData?.hero?.title }}</h1>
      <p class="hero-subtitle tw-hide">{{ auditData?.hero?.subtitle }}</p>
    </section>

    <!-- Form -->
    <section class="form-section">
      <div class="form-layout">
        <AuditFlow mode="full" />
      </div>
    </section>

    <!-- What the audit covers -->
    <section class="covers-section">
      <span class="section-label tw-hide">{{ auditData?.covers?.label }}</span>
      <ul class="covers-list">
        <li v-for="item in auditCovers" :key="item" class="cover-item tw-hide">
          {{ item }}
        </li>
      </ul>
    </section>

    <!-- FAQ -->
    <section class="faq-section">
      <div class="faq-container">
        <div class="faq-label-cell">
          <span class="section-label tw-hide">{{ auditData?.faqSection?.label }}</span>
          <h2 class="faq-title tw-hide">{{ auditData?.faqSection?.title }}</h2>
        </div>
        <div class="faq-list">
          <div
            v-for="(faq, index) in faqsData"
            :key="faq.question"
            class="faq-item tw-hide"
            :class="{ 'faq-open': faqOpen[index] }"
          >
            <button
              :id="`faq-trigger-${index}`"
              type="button"
              class="faq-question"
              :aria-expanded="faqOpen[index]"
              :aria-controls="`faq-panel-${index}`"
              @click="toggleFaq(index)"
            >
              <span>{{ faq.question }}</span>
              <span class="faq-toggle" aria-hidden="true">{{ faqOpen[index] ? '−' : '+' }}</span>
            </button>
            <div
              v-show="faqOpen[index]"
              :id="`faq-panel-${index}`"
              role="region"
              :aria-labelledby="`faq-trigger-${index}`"
              class="faq-answer"
            >
              <p>{{ faq.answer }}</p>
            </div>
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
  font-weight: 300;
  color: var(--color-accent-text);
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
  font-weight: 300;
  color: var(--color-muted);
  line-height: 1.6;
  max-width: 600px;
}

/* ── FORM SECTION ── */
.form-section {
  padding: 96px 80px;
}

.form-layout {
  max-width: 640px;
  margin: 0 auto;
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
  font-weight: 300;
  color: var(--color-accent-text);
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
  font-weight: 300;
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
.faq-section { padding: 96px 80px; border-top: 0.5px solid #24272e; display: flex; justify-content: center; }
.faq-container { max-width: 700px; width: 100%; display: flex; flex-direction: column; }
.faq-label-cell { border: 0.5px solid #24272e; padding: 12px; }
.faq-label-cell .section-label { margin-bottom: 8px; }
.faq-title { font-family: var(--font); font-size: clamp(28px, 4vw, 44px); font-weight: 600; color: var(--color-dark); line-height: 1.15; letter-spacing: -0.02em; margin: 0; }
.faq-list { display: flex; flex-direction: column; }
.faq-item { border: 0.5px solid #24272e; border-top: none; padding: 14px 12px; transition: background 0.2s; } /* top edge owned by .faq-label-cell's border-bottom */
.faq-item:hover { background: var(--color-cream, #fff1ef); }
.faq-question { width: 100%; background: none; border: none; cursor: pointer; text-align: left; display: flex; justify-content: space-between; align-items: center; gap: 24px; font-family: var(--font); font-size: 18px; font-weight: 500; color: var(--color-dark); line-height: 1.3; }
.faq-toggle { font-size: 24px; font-weight: 300; color: var(--color-accent-text); flex-shrink: 0; width: 24px; text-align: center; }
.faq-answer { padding-top: 12px; }
.faq-answer p { font-family: var(--font); font-size: 15px; font-weight: 300; color: var(--color-muted); line-height: 1.6; }

/* ── RESPONSIVE ── */
@media (max-width: 768px) {
  .hero { padding: 48px 24px 32px; }
  .hero-title { font-size: 32px; }
  .form-section { padding: 64px 24px; }
  .covers-section { padding: 64px 24px; }
  .faq-section { padding: 64px 24px; }
  .faq-item { padding: 12px 10px; }
  .faq-label-cell { padding: 10px; }
}
</style>
