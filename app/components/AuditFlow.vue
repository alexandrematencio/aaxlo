<script setup>
import { gsap } from 'gsap'

const props = defineProps({
  mode: {
    type: String,
    default: 'full',
    validator: v => ['teaser', 'full'].includes(v),
  },
  skip: { type: Boolean, default: false },
})

const section = ref(null)

const formData = reactive({
  businessName: '',
  websiteUrl: '',
  businessType: '',
  challenges: [],
  email: '',
  name: '',
  referralSource: '',
})

const route = useRoute()
const currentStep = ref(1)
const submitted = ref(false)
const errors = reactive({})
const stepContainer = ref(null)

const { navigateWithStripes } = useStripeTransition()

const isMobile = ref(false)
const stepDistance = computed(() => isMobile.value ? 20 : 40)

function animateStepForward(onComplete) {
  const el = stepContainer.value
  if (!el) { onComplete?.(); return }
  const d = stepDistance.value
  const tl = gsap.timeline({ onComplete })
  tl.to(el, { x: -d, opacity: 0, duration: 0.25, ease: 'power2.in' })
  tl.set(el, { x: d })
  tl.to(el, { x: 0, opacity: 1, duration: 0.3, ease: 'power2.out' })
}

function animateStepBackward(onComplete) {
  const el = stepContainer.value
  if (!el) { onComplete?.(); return }
  const d = stepDistance.value
  const tl = gsap.timeline({ onComplete })
  tl.to(el, { x: d, opacity: 0, duration: 0.25, ease: 'power2.in' })
  tl.set(el, { x: -d })
  tl.to(el, { x: 0, opacity: 1, duration: 0.3, ease: 'power2.out' })
}

function animateChipsIn() {
  nextTick(() => {
    const el = stepContainer.value
    if (!el) return
    const chips = el.querySelectorAll('.chip')
    if (!chips.length) return
    gsap.from(chips, { scale: 0.9, opacity: 0, duration: 0.2, stagger: 0.02, ease: 'power2.out' })
  })
}

function animateError(fieldId) {
  nextTick(() => {
    const errEl = document.getElementById(fieldId)
    if (errEl) gsap.from(errEl, { y: -4, opacity: 0, duration: 0.15, ease: 'power2.out' })
  })
}

watch(() => formData.businessName, () => { errors.businessName = '' })
watch(() => formData.websiteUrl, () => { errors.websiteUrl = '' })
watch(() => formData.email, () => { errors.email = '' })

function validateStep(step) {
  if (step === 1) {
    if (formData.businessName.trim().length < 2) {
      errors.businessName = 'Please enter your business name'
      animateError('err-business')
      return false
    }
  } else if (step === 2) {
    try {
      new URL(formData.websiteUrl)
    } catch {
      errors.websiteUrl = 'Please enter a valid URL (e.g. https://example.com)'
      animateError('err-url')
      return false
    }
  } else if (step === 3) {
    if (!formData.businessType) {
      shakeChips.value = true
      setTimeout(() => { shakeChips.value = false }, 400)
      return false
    }
  } else if (step === 5) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      errors.email = 'Please enter a valid email'
      animateError('err-email')
      return false
    }
  }
  return true
}

function goNext() {
  if (!validateStep(currentStep.value)) return
  if (currentStep.value === 5) {
    submitted.value = true
    animateStepForward(() => {
      currentStep.value = 6
      nextTick(() => {
        const el = stepContainer.value
        if (el) {
          const firstInput = el.querySelector('input, button[type="button"]')
          firstInput?.focus()
        }
        animateChipsIn()
      })
    })
    return
  }
  animateStepForward(() => {
    currentStep.value++
    nextTick(() => {
      const el = stepContainer.value
      if (el) {
        const firstInput = el.querySelector('input, button[type="button"]')
        firstInput?.focus()
      }
      if ([3, 4].includes(currentStep.value)) animateChipsIn()
    })
  })
}

function goBack() {
  if (currentStep.value <= 1) return
  animateStepBackward(() => {
    currentStep.value--
    nextTick(() => {
      const el = stepContainer.value
      if (el) {
        const firstInput = el.querySelector('input, button[type="button"]')
        firstInput?.focus()
      }
    })
  })
}

const progressWidth = computed(() => {
  if (submitted.value) return '100%'
  return `${(currentStep.value / 5) * 100}%`
})

const summaryLines = computed(() => {
  const lines = []
  if (currentStep.value > 1 && formData.businessName) lines.push(formData.businessName)
  if (currentStep.value > 2 && formData.websiteUrl) lines.push(formData.websiteUrl)
  if (currentStep.value > 3 && formData.businessType) lines.push(formData.businessType)
  if (currentStep.value > 4 && formData.challenges.length) lines.push(formData.challenges.join(', '))
  return lines
})

// Business type options
const businessTypes = ['Restaurant', 'Retail', 'Salon/Spa', 'Clinic', 'Gym/Fitness', 'Professional Services', 'Other']

// Challenge options
const challengeOptions = ['Not enough traffic', 'Poor Google ranking', 'Low conversions', 'Outdated website', 'Not sure where to start', 'Help me figure it out']

function selectBusinessType(type) {
  formData.businessType = type
}

function toggleChallenge(challenge) {
  if (challenge === 'Help me figure it out') {
    formData.challenges = formData.challenges.includes(challenge) ? [] : [challenge]
  } else {
    const filtered = formData.challenges.filter(c => c !== 'Help me figure it out')
    const idx = filtered.indexOf(challenge)
    if (idx >= 0) {
      filtered.splice(idx, 1)
    } else {
      filtered.push(challenge)
    }
    formData.challenges = filtered
  }
}

const shakeChips = ref(false)

// Referral options
const referralOptions = ['Word of mouth', 'Google', 'Social media', 'Other']

function selectReferral(source) {
  formData.referralSource = source
}

const showingSuccess = ref(false)

function showSuccess() {
  const el = stepContainer.value
  if (!el) { showingSuccess.value = true; return }
  gsap.to(el, { opacity: 0, duration: 0.2, ease: 'power2.in', onComplete: () => {
    showingSuccess.value = true
    gsap.set(el, { opacity: 1 })
    nextTick(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power2.out' } })
      const glyph = el.querySelector('.success-glyph')
      if (glyph) tl.from(glyph, { scale: 0.8, opacity: 0, duration: 0.3 })
      const headline = el.querySelector('.success-title')
      if (headline) tl.to(headline, { clipPath: 'inset(-0.1em 0% -0.25em 0)', duration: 0.3, ease: 'steps(12)' }, '-=0.1')
      const body = el.querySelector('.success-text')
      if (body) tl.from(body, { opacity: 0, y: 8, duration: 0.3 }, '-=0.1')
      const trust = el.querySelector('.success-trust')
      if (trust) tl.from(trust, { opacity: 0, duration: 0.25 }, '-=0.05')
      const link = el.querySelector('.success-link')
      if (link) tl.from(link, { opacity: 0, duration: 0.25 })
    })
  }})
}

function handlePersonalizeDone() {
  showSuccess()
}

function skipPersonalize() {
  showSuccess()
}

function onTeaserSubmit() {
  if (formData.businessName.trim().length >= 2) {
    navigateWithStripes('/audit?business=' + encodeURIComponent(formData.businessName.trim()))
  }
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
  if (props.mode === 'full') {
    isMobile.value = window.innerWidth <= 768
    const business = route.query.business
    if (business && typeof business === 'string' && business.trim().length >= 2) {
      formData.businessName = business.trim()
      setTimeout(() => {
        animateStepForward(() => {
          currentStep.value = 2
          nextTick(() => {
            const el = stepContainer.value
            if (el) el.querySelector('input')?.focus()
          })
        })
      }, 300)
    }
    return
  }

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
  <section v-if="mode === 'teaser'" ref="section" class="audit-cta-section">
    <div class="audit-cta-inner">
      <div class="audit-cell">
        <span class="audit-label tw-hide">FREE AUDIT</span>
        <h2 class="cta-headline tw-hide">
          Find out what's costing you customers right now.
        </h2>
      </div>

      <div class="audit-cell">
        <p class="cta-subtitle tw-hide">
          We scan your full digital presence — website, search visibility, reviews, social media, how you stack up against competitors — and put it in a clear report with scores and a plan. Takes us 24 hours. Costs you nothing.
        </p>
      </div>

      <div class="audit-cell">
        <form class="audit-form" @submit.prevent="onTeaserSubmit">
          <div class="audit-form-fields">
            <input
              v-model="formData.businessName"
              type="text"
              class="audit-input"
              placeholder="Your business name"
              style="opacity: 0; transform: translateY(8px)"
            />
          </div>
          <button
            type="submit"
            class="cta-button"
            style="opacity: 0; transform: translateY(8px)"
          >
            Start my free audit →
          </button>
        </form>
      </div>

      <div class="audit-cell">
        <p class="cta-small" style="opacity: 0">
          No commitment. No card. No calls unless you ask for them.<br />
          You get a full report with specific recommendations within 24 hours — whether you work with us after that or not.
        </p>
      </div>
    </div>
  </section>

  <div v-else class="flow-card">
    <!-- Progress bar -->
    <div class="progress-track" role="progressbar" :aria-valuenow="currentStep" aria-valuemin="1" aria-valuemax="5" aria-label="Form progress">
      <div class="progress-fill" :style="{ width: progressWidth }" />
    </div>

    <!-- Back + Summary -->
    <div v-if="currentStep > 1 && !submitted" class="flow-nav">
      <button type="button" class="back-btn" aria-label="Go to previous step" @click="goBack">&larr;</button>
      <div class="summary-lines">
        <span v-for="line in summaryLines" :key="line" class="summary-line">{{ line }}</span>
      </div>
    </div>

    <div ref="stepContainer" class="step-container" aria-live="polite">
      <!-- Step 1: Business Name -->
      <div v-if="currentStep === 1 && !submitted" class="step">
        <label for="flow-business" class="step-label">What's your business called?</label>
        <input
          id="flow-business"
          v-model="formData.businessName"
          type="text"
          class="flow-input"
          placeholder="e.g. Joe's Coffee House"
          :aria-describedby="errors.businessName ? 'err-business' : undefined"
          @keydown.enter.prevent="goNext"
        />
        <span v-if="errors.businessName" id="err-business" class="flow-error" role="alert">{{ errors.businessName }}</span>
        <button type="button" class="flow-next" @click="goNext">Next &rarr;</button>
      </div>

      <!-- Step 2: Website URL -->
      <div v-if="currentStep === 2 && !submitted" class="step">
        <label for="flow-url" class="step-label">What's your website?</label>
        <input
          id="flow-url"
          v-model="formData.websiteUrl"
          type="url"
          class="flow-input"
          placeholder="https://example.com"
          :aria-describedby="errors.websiteUrl ? 'err-url' : undefined"
          @keydown.enter.prevent="goNext"
        />
        <span v-if="errors.websiteUrl" id="err-url" class="flow-error" role="alert">{{ errors.websiteUrl }}</span>
        <button type="button" class="flow-next" @click="goNext">Next &rarr;</button>
      </div>

      <!-- Step 3: Business Type -->
      <div v-if="currentStep === 3 && !submitted" class="step">
        <span class="step-label">What type of business?</span>
        <div class="chip-grid" :class="{ 'chip-shake': shakeChips }">
          <button
            v-for="type in businessTypes"
            :key="type"
            type="button"
            class="chip"
            :class="{ 'chip-selected': formData.businessType === type }"
            :aria-pressed="formData.businessType === type"
            @click="selectBusinessType(type)"
          >
            {{ type }}
          </button>
        </div>
        <button type="button" class="flow-next" @click="goNext">Next &rarr;</button>
      </div>

      <!-- Step 4: Biggest Challenge (optional) -->
      <div v-if="currentStep === 4 && !submitted" class="step">
        <span class="step-label">What's your biggest challenge right now?</span>
        <p class="step-hint">Select all that apply, or skip to continue.</p>
        <div class="chip-grid chip-grid--challenges">
          <button
            v-for="challenge in challengeOptions"
            :key="challenge"
            type="button"
            class="chip"
            :class="{ 'chip-selected': formData.challenges.includes(challenge) }"
            :aria-pressed="formData.challenges.includes(challenge)"
            @click="toggleChallenge(challenge)"
          >
            {{ challenge }}
          </button>
        </div>
        <button type="button" class="flow-next" @click="goNext">Next &rarr;</button>
      </div>

      <!-- Step 5: Email -->
      <div v-if="currentStep === 5 && !submitted" class="step">
        <label for="flow-email" class="step-label">Where should we send your report?</label>
        <input
          id="flow-email"
          v-model="formData.email"
          type="email"
          class="flow-input"
          placeholder="you@example.com"
          :aria-describedby="errors.email ? 'err-email' : undefined"
          @keydown.enter.prevent="goNext"
        />
        <span v-if="errors.email" id="err-email" class="flow-error" role="alert">{{ errors.email }}</span>
        <button type="button" class="flow-next flow-next--submit" @click="goNext">Run my free audit &rarr;</button>
      </div>

      <!-- Step 6: Personalize (post-submit, optional) -->
      <div v-if="currentStep === 6 && submitted && !showingSuccess" class="step">
        <span class="step-label">Want us to personalize the report?</span>
        <input
          v-model="formData.name"
          type="text"
          class="flow-input"
          placeholder="Your name"
        />
        <span class="step-hint">How did you hear about us?</span>
        <div class="chip-grid">
          <button
            v-for="source in referralOptions"
            :key="source"
            type="button"
            class="chip"
            :class="{ 'chip-selected': formData.referralSource === source }"
            :aria-pressed="formData.referralSource === source"
            @click="selectReferral(source)"
          >
            {{ source }}
          </button>
        </div>
        <div class="personalize-actions">
          <button type="button" class="flow-next" @click="handlePersonalizeDone">Done</button>
          <button type="button" class="skip-link" @click="skipPersonalize">No thanks, I'm good</button>
        </div>
      </div>

      <!-- Success State -->
      <div v-if="showingSuccess" class="step success-step">
        <img src="/logo-glyph.svg" alt="" class="success-glyph" />
        <h3 class="success-title tw-hide">We're on it.</h3>
        <p class="success-text">Your personalized audit will land in <strong>{{ formData.email }}</strong> within 24 hours.</p>
        <p class="success-trust">No commitment. No card. No calls unless you ask.</p>
        <NuxtLink to="/" class="success-link">&larr; Back to homepage</NuxtLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
.audit-cta-section {
  position: relative;
  background: #FFDAD4;
  padding: 120px clamp(32px, 6vw, 96px);
  border-top: 0.5px solid #24272e;
  display: flex;
  justify-content: center;
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
  margin-bottom: 8px;
}

.audit-cta-inner {
  max-width: 700px;
  width: 100%;
  display: flex;
  flex-direction: column;
}

.audit-cell {
  border: 0.5px solid #24272e;
  border-top: none;
  padding: 12px;
}
.audit-cell:first-child {
  border-top: 0.5px solid #24272e;
}

.cta-headline {
  font-family: var(--font);
  font-size: clamp(32px, 5vw, 48px);
  font-weight: 600;
  color: var(--color-dark);
  line-height: 1.1;
  letter-spacing: -0.02em;
}

.cta-subtitle {
  font-family: var(--font);
  font-size: 20px;
  font-weight: 300;
  color: var(--color-dark);
  line-height: 1.6;
  margin: 0;
}

/* -- Form -- */
.audit-form {
  width: 100%;
}

.audit-form-fields {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.audit-input {
  width: 100%;
  padding: 14px 16px;
  font-family: var(--font);
  font-size: 16px;
  background: transparent;
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
  font-family: var(--font);
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  padding: 16px;
  background: var(--color-dark);
  color: var(--color-cream);
  text-decoration: none;
  border: none;
  border-radius: 0;
  cursor: pointer;
  transition: background 0.3s;
  margin-top: 16px;
}
.cta-button:hover {
  background: var(--color-accent);
  color: var(--color-dark);
}

.cta-small {
  font-family: var(--font);
  font-size: 14px;
  font-weight: 300;
  color: rgba(36, 39, 46, 0.5);
  line-height: 1.6;
  margin: 0;
}

@media (max-width: 768px) {
  .audit-cta-section {
    padding: 80px 20px;
  }
  .cta-headline {
    font-size: clamp(26px, 6vw, 36px);
  }
  .cta-subtitle {
    font-size: 17px;
  }
  .audit-cell {
    padding: 10px;
  }
}

/* ═══ FULL MODE ═══ */
.flow-card {
  background: var(--color-white);
  border: 0.5px solid #24272e;
  padding: 48px;
  position: relative;
  overflow: hidden;
}
.progress-track {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: var(--color-border, #d4d4d4);
}
.progress-fill {
  height: 100%;
  background: var(--color-accent);
  transition: width 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
.flow-nav {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 32px;
}
.back-btn {
  background: none;
  border: none;
  font-family: var(--font);
  font-size: 20px;
  color: var(--color-muted);
  cursor: pointer;
  padding: 4px 8px;
  transition: color 0.2s;
}
.back-btn:hover { color: var(--color-dark); }
.summary-lines {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.summary-line {
  font-family: var(--font);
  font-size: 13px;
  color: var(--color-muted);
  opacity: 0.5;
}
.summary-line + .summary-line::before {
  content: '·';
  margin-right: 8px;
}
.step-container {
  min-height: 180px;
}
.step {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.step-label {
  font-family: var(--font);
  font-size: 24px;
  font-weight: 600;
  color: var(--color-dark);
  line-height: 1.2;
  letter-spacing: -0.01em;
}
.flow-input {
  font-family: var(--font);
  font-size: 16px;
  font-weight: 300;
  color: var(--color-dark);
  background: var(--color-cream);
  border: 0.5px solid #24272e;
  padding: 14px 16px;
  outline: none;
  transition: border-color 0.3s;
}
.flow-input::placeholder { color: var(--color-muted); opacity: 0.5; }
.flow-input:focus { border-color: var(--color-accent); }
.flow-error {
  font-family: var(--font);
  font-size: 13px;
  color: #c0392b;
  margin-top: -8px;
}
.flow-next {
  align-self: flex-start;
  font-family: var(--font);
  font-size: 16px;
  font-weight: 600;
  color: var(--color-cream);
  background: var(--color-dark);
  border: none;
  padding: 14px 32px;
  cursor: pointer;
  transition: background 0.4s, transform 0.3s;
  margin-top: 8px;
}
.flow-next:hover { background: var(--color-accent); color: var(--color-dark); transform: translateY(-2px); }

/* ── Chips ── */
.chip-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}
.chip {
  background: var(--color-cream);
  border: 0.5px solid #24272e;
  color: var(--color-dark);
  padding: 12px 20px;
  font-family: var(--font);
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  border-radius: 0;
  transition: border-color 0.25s, background 0.2s, color 0.2s;
}
.chip:hover { border-color: var(--color-accent); }
.chip-selected {
  background: var(--color-dark);
  color: var(--color-cream);
  border-color: var(--color-dark);
}
.chip-shake {
  animation: chipShake 0.3s ease-in-out;
}
@keyframes chipShake {
  0% { transform: translateX(0); }
  25% { transform: translateX(-4px); }
  50% { transform: translateX(4px); }
  75% { transform: translateX(-2px); }
  100% { transform: translateX(0); }
}
.step-hint {
  font-family: var(--font);
  font-size: 14px;
  color: var(--color-muted);
  margin-top: -8px;
}

/* ── Submit button variant ── */
.flow-next--submit {
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
/* ── Personalize ── */
.personalize-actions {
  display: flex;
  align-items: center;
  gap: 24px;
  margin-top: 8px;
}
.skip-link {
  background: none;
  border: none;
  font-family: var(--font);
  font-size: 14px;
  color: var(--color-muted);
  cursor: pointer;
  text-decoration: underline;
  text-underline-offset: 3px;
}
.skip-link:hover { color: var(--color-dark); }
/* ── Success ── */
.success-step {
  text-align: center;
  align-items: center;
  padding: 32px 0;
}
.success-glyph {
  width: 48px;
  height: 48px;
  margin-bottom: 24px;
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
  color: var(--color-muted);
  line-height: 1.6;
}
.success-trust {
  font-family: var(--font);
  font-size: 14px;
  color: var(--color-muted);
  opacity: 0.6;
  margin-top: 16px;
}
.success-link {
  display: inline-block;
  font-family: var(--font);
  font-size: 14px;
  font-weight: 500;
  color: var(--color-accent);
  text-decoration: none;
  margin-top: 24px;
}
.success-link:hover { text-decoration: underline; }

@media (max-width: 768px) {
  .flow-card { padding: 32px 24px; }
  .step-label { font-size: 20px; }
  .chip { flex: 1 1 calc(50% - 5px); text-align: center; }
  .chip-grid--challenges .chip { flex: 1 1 100%; }
}
</style>
