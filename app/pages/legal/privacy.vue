<script setup>
import { gsap } from 'gsap'

useHead({ title: 'Privacy Policy — AAXLO' })

const page = ref(null)

onMounted(() => {
  const el = page.value
  if (!el) return

  const tl = gsap.timeline({ defaults: { ease: 'power2.inOut' } })

  tl.to(el.querySelector('.stub-back'), { clipPath: 'inset(-0.1em 0% -0.25em 0)', duration: 0.2, ease: 'steps(8)' }, '-=0.1')
  tl.to(el.querySelector('.stub-logo'), { clipPath: 'inset(-0.1em 0% -0.25em 0)', duration: 0.25, ease: 'power2.out' }, '-=0.15')
  tl.to(el.querySelector('.stub-label'), { clipPath: 'inset(-0.1em 0% -0.25em 0)', duration: 0.2, ease: 'steps(10)' }, '-=0.1')
  tl.to(el.querySelector('.stub-title'), { clipPath: 'inset(-0.1em 0% -0.25em 0)', duration: 0.4, ease: 'steps(25)' }, '-=0.1')
  tl.to(el.querySelector('.stub-text'), { clipPath: 'inset(-0.1em 0% -0.25em 0)', duration: 0.35, ease: 'steps(40)' }, '-=0.2')

  const content = el.querySelector('.legal-content')
  if (content) {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          gsap.to(content.querySelectorAll('.legal-block'), {
            clipPath: 'inset(-0.1em 0% -0.25em 0)', duration: 0.3, stagger: 0.06, ease: 'power2.out',
          })
          obs.disconnect()
        }
      })
    }, { threshold: 0.1 })
    obs.observe(content)
  }
})
</script>

<template>
  <div ref="page" class="stub-page">
    <header class="stub-header">
      <NuxtLink to="/" class="stub-back tw-hide">&larr; BACK TO HOME</NuxtLink>
      <NuxtLink to="/">
        <img src="/images/axxlo-logo.svg" alt="AAXLO" class="stub-logo tw-hide" />
      </NuxtLink>
    </header>

    <div class="stub-main">
      <div class="stub-content-grid">
        <div class="stub-meta">
          <span class="stub-label tw-hide">LEGAL</span>
        </div>
        <div class="stub-body">
          <h1 class="stub-title tw-hide">Privacy Policy</h1>
          <p class="stub-text tw-hide">Last updated: March 2026</p>
        </div>
      </div>
    </div>

    <div class="legal-content">
      <div class="legal-block tw-hide">
        <h2>1. Information We Collect</h2>
        <p>We collect information you provide directly, such as your name, email address, phone number, and business details when you submit forms on our website. We also collect usage data through cookies and analytics tools.</p>
      </div>
      <div class="legal-block tw-hide">
        <h2>2. How We Use Your Information</h2>
        <p>We use your information to provide our services, communicate with you, generate audit reports, and improve our offerings. We never sell your personal data to third parties.</p>
      </div>
      <div class="legal-block tw-hide">
        <h2>3. Data Storage & Security</h2>
        <p>Your data is stored securely using industry-standard encryption. We retain your data only as long as necessary to provide our services or as required by law.</p>
      </div>
      <div class="legal-block tw-hide">
        <h2>4. Your Rights</h2>
        <p>You have the right to access, correct, or delete your personal data at any time. To exercise these rights, contact us at hi@aaxlo.com.</p>
      </div>
      <div class="legal-block tw-hide">
        <h2>5. Contact</h2>
        <p>For any privacy-related inquiries, please contact us at <a href="mailto:hi@aaxlo.com">hi@aaxlo.com</a>.</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.stub-page { position: relative; display: flex; flex-direction: column; min-height: 100vh; background: var(--color-cream); }
.tw-hide { clip-path: inset(-0.1em 100% -0.25em 0); }

.stub-header { position: relative; display: flex; justify-content: space-between; align-items: center; padding: 24px 32px; background: white; border-bottom: 0.5px solid #24272e; }
.stub-back { font-family: var(--font); font-size: 12px; font-weight: 300; color: var(--color-muted); letter-spacing: 0.08em; text-transform: uppercase; text-decoration: none; transition: color 0.3s; }
.stub-back:hover { color: var(--color-dark); }
.stub-logo { height: 28px; width: auto; }

.stub-main { position: relative; border-bottom: 0.5px solid #24272e; }
.stub-content-grid { display: grid; grid-template-columns: 240px 1fr; }
.stub-meta { position: relative; display: flex; flex-direction: column; justify-content: space-between; padding: 48px 32px; border-right: 0.5px solid #24272e; }
.stub-label { font-family: var(--font); font-size: 11px; font-weight: 300; color: var(--color-accent); letter-spacing: 0.15em; text-transform: uppercase; }
.stub-body { display: flex; flex-direction: column; justify-content: center; gap: 16px; padding: 48px 80px; }
.stub-title { font-family: var(--font); font-size: 42px; font-weight: 600; color: var(--color-dark); line-height: 1.1; letter-spacing: -0.02em; }
.stub-text { font-family: var(--font); font-size: 14px; font-weight: 300; color: var(--color-muted); }

.legal-content { padding: 64px 80px 96px; padding-left: calc(240px + 80px); max-width: 900px; }
.legal-block { margin-bottom: 40px; }
.legal-block h2 { font-family: var(--font); font-size: 18px; font-weight: 600; color: var(--color-dark); margin-bottom: 12px; line-height: 1.3; }
.legal-block p { font-family: var(--font); font-size: 15px; font-weight: 300; color: var(--color-muted); line-height: 1.7; }
.legal-block a { color: var(--color-accent); text-decoration: none; }
.legal-block a:hover { text-decoration: underline; }

@media (max-width: 768px) {
  .stub-content-grid { grid-template-columns: 1fr; }
  .stub-meta { padding: 24px 24px 0; flex-direction: row; align-items: center; gap: 16px; }
  .stub-body { padding: 24px; }
  .stub-title { font-size: 28px; }
  .legal-content { padding: 32px 24px 64px; }
}
</style>
