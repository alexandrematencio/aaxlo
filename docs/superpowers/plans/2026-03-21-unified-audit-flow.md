# Unified Audit Flow Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace two fragmented audit forms with a single progressive, conversational form component used in teaser mode on the homepage and full mode on the /audit page.

**Architecture:** A single `AuditFlow.vue` component with `mode="teaser"|"full"` prop. Teaser mode shows one input + navigates to /audit with pre-fill. Full mode is a 6-step progressive form with GSAP animations. All site CTAs get standardized text.

**Tech Stack:** Vue 3 (Composition API), Nuxt 4, GSAP 3, existing `useStripeTransition` composable

**Spec:** `docs/superpowers/specs/2026-03-21-unified-audit-flow-design.md`

---

## File Structure

| File | Responsibility |
|------|---------------|
| `app/components/AuditFlow.vue` | **New** — Unified progressive form (teaser + full modes, all steps, validation, animations) |
| `app/components/AuditCTA.vue` | **Delete** — Replaced by AuditFlow |
| `app/pages/audit.vue` | **Modify** — Swap form card for `<AuditFlow mode="full" />`, update 48h→24h copy |
| `app/pages/index.vue` | **Modify** — Swap `<AuditCTA>` for `<AuditFlow mode="teaser" />` |
| 9 other files | **Modify** — CTA text standardization (one-line edits) |

---

## Task 1: Create AuditFlow.vue — Teaser Mode

**Files:**
- Create: `app/components/AuditFlow.vue`

This task builds the teaser mode first (replacing AuditCTA.vue), since it's simpler and validates the component structure.

- [ ] **Step 1: Create AuditFlow.vue with teaser mode template and script**

```vue
<script setup>
import { gsap } from 'gsap'

const props = defineProps({
  mode: { type: String, default: 'full', validator: v => ['teaser', 'full'].includes(v) },
  skip: { type: Boolean, default: false },
})

const { navigateWithStripes } = useStripeTransition()

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

/* ── Teaser mode ── */
function onTeaserSubmit() {
  if (formData.businessName.trim().length < 2) return
  navigateWithStripes('/audit?business=' + encodeURIComponent(formData.businessName.trim()))
}

function showTeaserFinalState() {
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

function animateTeaser() {
  const el = section.value
  if (!el) return

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const tl = gsap.timeline({ defaults: { ease: 'power2.out' } })
          tl.to(el.querySelector('.cta-headline'), {
            clipPath: 'inset(-0.1em 0% -0.25em 0)', duration: 0.12, ease: 'steps(28)',
          }, '-=0.15')
          tl.to(el.querySelector('.cta-subtitle'), {
            clipPath: 'inset(-0.1em 0% -0.25em 0)', duration: 0.2, ease: 'steps(30)',
          }, '-=0.1')
          const inputs = el.querySelectorAll('.audit-input')
          tl.to(inputs, {
            opacity: 1, y: 0, duration: 0.18, stagger: 0.015,
          }, '+=0.04')
          tl.to(el.querySelector('.cta-button'), {
            opacity: 1, y: 0, duration: 0.2,
          }, '+=0.05')
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
}

onMounted(() => {
  if (props.mode !== 'teaser') return
  if (props.skip) {
    showTeaserFinalState()
    return
  }
  animateTeaser()
})
</script>

<template>
  <!-- ═══ TEASER MODE ═══ -->
  <section v-if="mode === 'teaser'" ref="section" class="audit-cta-section">
    <div class="audit-cta-inner">
      <span class="audit-label tw-hide">FREE AUDIT</span>
      <h2 class="cta-headline tw-hide">
        Find out what's costing you customers right now.
      </h2>
      <p class="cta-subtitle tw-hide">
        We scan your full digital presence — website, search visibility, reviews, social media, how you stack up against competitors — and put it in a clear report with scores and a plan. Takes us 24 hours. Costs you nothing.
      </p>

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
          Start my free audit &rarr;
        </button>
      </form>

      <p class="cta-small" style="opacity: 0">
        No commitment. No card. No calls unless you ask for them.<br />
        You get a full report with specific recommendations within 24 hours — whether you work with us after that or not.
      </p>
    </div>
  </section>

  <!-- ═══ FULL MODE (placeholder for next task) ═══ -->
  <div v-else>
    <!-- Full mode will be built in Task 2 -->
  </div>
</template>
```

- [ ] **Step 2: Add teaser mode styles**

Add the `<style scoped>` block. Copy all styles from the existing `AuditCTA.vue` exactly — these are the teaser mode styles:

```css
<style scoped>
.audit-cta-section {
  position: relative;
  background: var(--color-accent);
  padding: 120px clamp(32px, 6vw, 96px);
  border-top: 0.5px solid #24272e;
}
.tw-hide { clip-path: inset(-0.1em 100% -0.25em 0); }
.audit-label {
  display: block;
  font-family: var(--font);
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: rgba(36, 39, 46, 0.5);
  margin-bottom: 32px;
}
.audit-cta-inner {
  max-width: 720px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}
.cta-headline {
  font-family: var(--font);
  font-size: clamp(32px, 5vw, 52px);
  font-weight: 600;
  color: var(--color-dark);
  line-height: 1.1;
  letter-spacing: -0.02em;
}
.cta-subtitle {
  font-family: var(--font);
  font-size: 18px;
  font-weight: 400;
  color: rgba(36, 39, 46, 0.7);
  line-height: 1.5;
  max-width: 580px;
  margin-top: 24px;
}
.audit-form {
  width: 100%;
  max-width: 420px;
  margin-top: 48px;
}
.audit-form-fields {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.audit-input {
  width: 100%;
  padding: 16px 20px;
  font-family: var(--font);
  font-size: 16px;
  background: var(--color-white, #fcfcfc);
  border: 0.5px solid #24272e;
  border-radius: 0;
  color: var(--color-dark);
  outline: none;
  transition: border-color 0.25s;
  -webkit-appearance: none;
  appearance: none;
}
.audit-input::placeholder { color: var(--color-muted, #6e7381); }
.audit-input:focus { border-color: var(--color-dark); }
.cta-button {
  display: block;
  width: 100%;
  position: relative;
  font-family: var(--font);
  font-size: 16px;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  padding: 18px;
  background: var(--color-dark);
  color: var(--color-cream);
  text-decoration: none;
  border: none;
  border-radius: 0;
  cursor: pointer;
  overflow: hidden;
  z-index: 1;
  transition: color 0.4s;
  margin-top: 24px;
}
.cta-button::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background: var(--color-accent);
  transform: translate(-101%, 101%);
  transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
  z-index: -1;
}
.cta-button:hover::before { transform: translate(0, 0); }
.cta-button:hover { color: var(--color-dark); border: 0.5px solid #24272e; }
.cta-small {
  font-family: var(--font);
  font-size: 14px;
  font-weight: 400;
  color: rgba(36, 39, 46, 0.5);
  line-height: 1.6;
  margin-top: 32px;
}
@media (max-width: 768px) {
  .audit-cta-section { padding: 80px 20px; }
  .cta-headline { font-size: clamp(26px, 6vw, 36px); }
  .cta-subtitle { font-size: 16px; }
  .audit-input { padding: 14px 16px; font-size: 15px; }
  .cta-button { padding: 16px; font-size: 14px; }
}
</style>
```

- [ ] **Step 3: Verify teaser mode renders on the dev server**

Open http://localhost:3003 and scroll to the audit section. It should look identical to the current AuditCTA.
The only visible difference: one input field instead of three, and the button text says "Start my free audit →".

- [ ] **Step 4: Commit**

```bash
git add app/components/AuditFlow.vue
git commit -m "feat: create AuditFlow component with teaser mode"
```

---

## Task 2: Swap AuditCTA for AuditFlow teaser on homepage

**Files:**
- Modify: `app/pages/index.vue` (line 53)
- Delete: `app/components/AuditCTA.vue`

- [ ] **Step 1: Update index.vue to use AuditFlow**

In `app/pages/index.vue`, line 53, replace:
```html
<AuditCTA :skip="skipAnimations" />
```
with:
```html
<AuditFlow mode="teaser" :skip="skipAnimations" />
```

- [ ] **Step 2: Delete AuditCTA.vue**

```bash
rm app/components/AuditCTA.vue
```

- [ ] **Step 3: Verify the homepage renders correctly**

Open http://localhost:3003 — scroll to the audit section. Should show the teaser with one input. Type a business name and submit — should navigate to /audit with `?business=` in the URL.

- [ ] **Step 4: Commit**

```bash
git add app/pages/index.vue
git rm app/components/AuditCTA.vue
git commit -m "feat: replace AuditCTA with AuditFlow teaser on homepage"
```

---

## Task 3: Build AuditFlow full mode — Steps 1-2 (text inputs)

**Files:**
- Modify: `app/components/AuditFlow.vue`

- [ ] **Step 1: Add full mode state and step navigation logic**

Add to the `<script setup>` section, after the teaser functions:

```js
/* ── Full mode ── */
const currentStep = ref(1)
const submitted = ref(false)
const errors = reactive({})
const stepContainer = ref(null)

const route = useRoute()

// Validation helpers
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

// Responsive step distance
const stepDistance = computed(() => window.innerWidth <= 768 ? 20 : 40)

// Step transition animations
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

// Animate chip stagger when step 3, 4, or 6 appears
function animateChipsIn() {
  nextTick(() => {
    const el = stepContainer.value
    if (!el) return
    const chips = el.querySelectorAll('.chip')
    if (!chips.length) return
    gsap.from(chips, { scale: 0.9, opacity: 0, duration: 0.2, stagger: 0.02, ease: 'power2.out' })
  })
}

// Animate error message slide-down
function animateError(fieldId) {
  nextTick(() => {
    const errEl = document.getElementById(fieldId)
    if (errEl) gsap.from(errEl, { y: -4, opacity: 0, duration: 0.15, ease: 'power2.out' })
  })
}

// Clear errors on input change
watch(() => formData.businessName, () => { errors.businessName = '' })
watch(() => formData.websiteUrl, () => { errors.websiteUrl = '' })
watch(() => formData.email, () => { errors.email = '' })

function goNext() {
  if (!validateStep(currentStep.value)) return
  if (currentStep.value === 5) {
    // Final submit
    submitted.value = true
    animateStepForward(() => {
      currentStep.value = 6
      nextTick(() => {
        const el = stepContainer.value
        if (el) {
          const firstInput = el.querySelector('input, button[type="button"]')
          firstInput?.focus()
        }
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
      // Animate chips if entering a chip step
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

// Progress bar width
const progressWidth = computed(() => {
  if (submitted.value) return '100%'
  return `${(currentStep.value / 5) * 100}%`
})

// Previous answers summary
const summaryLines = computed(() => {
  const lines = []
  if (currentStep.value > 1 && formData.businessName) lines.push(formData.businessName)
  if (currentStep.value > 2 && formData.websiteUrl) lines.push(formData.websiteUrl)
  if (currentStep.value > 3 && formData.businessType) lines.push(formData.businessType)
  if (currentStep.value > 4 && formData.challenges.length) lines.push(formData.challenges.join(', '))
  return lines
})

// Pre-fill from query param
onMounted(() => {
  if (props.mode !== 'full') return

  const business = route.query.business
  if (business && typeof business === 'string' && business.trim().length >= 2) {
    formData.businessName = business.trim()
    // Brief show then auto-advance
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
})
```

- [ ] **Step 2: Add full mode template for steps 1-2**

Replace the `<!-- Full mode will be built in Task 2 -->` placeholder with:

```html
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
  </div>
</div>
```

- [ ] **Step 3: Add full mode styles**

Append to `<style scoped>`:

```css
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
  font-weight: 400;
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

@media (max-width: 768px) {
  .flow-card { padding: 32px 24px; }
  .step-label { font-size: 20px; }
}
```

- [ ] **Step 4: Verify steps 1-2 work on /audit page**

Open http://localhost:3003/audit — the form card should show step 1. Type a business name, click Next, see step 2 animate in. Click back arrow, go back to step 1. Navigate from homepage teaser — step 1 should pre-fill and auto-advance.

- [ ] **Step 5: Commit**

```bash
git add app/components/AuditFlow.vue
git commit -m "feat: add full mode steps 1-2 (business name + URL) with validation and animations"
```

---

## Task 4: Build AuditFlow full mode — Steps 3-4 (chip selects)

**Files:**
- Modify: `app/components/AuditFlow.vue`

- [ ] **Step 1: Add chip selection logic to script**

Add after the `summaryLines` computed:

```js
// Business type options
const businessTypes = ['Restaurant', 'Retail', 'Salon/Spa', 'Clinic', 'Gym/Fitness', 'Professional Services', 'Other']

// Challenge options
const challengeOptions = ['Not enough traffic', 'Poor Google ranking', 'Low conversions', 'Outdated website', 'Not sure where to start', 'Help me figure it out']

function selectBusinessType(type) {
  formData.businessType = type
}

function toggleChallenge(challenge) {
  if (challenge === 'Help me figure it out') {
    // Mutually exclusive — selecting it clears others
    formData.challenges = formData.challenges.includes(challenge) ? [] : [challenge]
  } else {
    // Remove "Help me figure it out" if present, then toggle
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

// Chip shake animation for step 3 validation
const shakeChips = ref(false)
```

Update `validateStep` for step 3 to set `shakeChips`:

In the existing `validateStep` function, update the step 3 block:
```js
} else if (step === 3) {
  if (!formData.businessType) {
    shakeChips.value = true
    setTimeout(() => { shakeChips.value = false }, 400)
    return false
  }
}
```

- [ ] **Step 2: Add steps 3-4 templates**

Add after the Step 2 `</div>` in the template, inside `step-container`:

```html
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
```

- [ ] **Step 3: Add chip styles**

Append to `<style scoped>`:

```css
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

@media (max-width: 768px) {
  .chip { flex: 1 1 calc(50% - 5px); text-align: center; }
  /* Long chips (challenge options) go full width on mobile */
  .chip-grid--challenges .chip { flex: 1 1 100%; }
}
```

- [ ] **Step 4: Verify steps 3-4 in browser**

Navigate through steps 1-4 on http://localhost:3003/audit. Check: chips render, single-select works on step 3, multi-select works on step 4, "Help me figure it out" is mutually exclusive, shake animation fires on step 3 if nothing selected.

- [ ] **Step 5: Commit**

```bash
git add app/components/AuditFlow.vue
git commit -m "feat: add steps 3-4 (business type + challenges) with chip selects"
```

---

## Task 5: Build AuditFlow full mode — Step 5 (email), Step 6 (personalize), Success State

**Files:**
- Modify: `app/components/AuditFlow.vue`

- [ ] **Step 1: Add step 6 and success logic to script**

Add after the chip logic:

```js
// Referral options
const referralOptions = ['Word of mouth', 'Google', 'Social media', 'Other']

function selectReferral(source) {
  formData.referralSource = source
}

function handlePersonalizeDone() {
  // Just transition to success
  showSuccess()
}

function skipPersonalize() {
  showSuccess()
}

const showingSuccess = ref(false)

function showSuccess() {
  showingSuccess.value = true
  nextTick(() => {
    const el = stepContainer.value
    if (!el) return
    const tl = gsap.timeline({ defaults: { ease: 'power2.out' } })
    // Glyph scale in
    const glyph = el.querySelector('.success-glyph')
    if (glyph) tl.from(glyph, { scale: 0.8, opacity: 0, duration: 0.3 })
    // Headline typewriter
    const headline = el.querySelector('.success-title')
    if (headline) tl.to(headline, { clipPath: 'inset(-0.1em 0% -0.25em 0)', duration: 0.3, ease: 'steps(12)' }, '-=0.1')
    // Body fade
    const body = el.querySelector('.success-text')
    if (body) tl.from(body, { opacity: 0, y: 8, duration: 0.3 }, '-=0.1')
    // Trust + link
    const trust = el.querySelector('.success-trust')
    if (trust) tl.from(trust, { opacity: 0, duration: 0.25 }, '-=0.05')
    const link = el.querySelector('.success-link')
    if (link) tl.from(link, { opacity: 0, duration: 0.25 })
  })
}
```

The `goNext` step 5 block from Task 3 already handles the transition to step 6 correctly. In this task, update the `showSuccess` function to crossfade out step 6 before animating success elements in:

Update `showSuccess`:
```js
function showSuccess() {
  const el = stepContainer.value
  if (!el) { showingSuccess.value = true; return }
  // Crossfade out current content
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
```

Also update the step 5→6 transition in `goNext` to animate chips on step 6:
```js
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
      animateChipsIn() // referral chips on step 6
    })
  })
  return
}
```

- [ ] **Step 2: Add step 5, step 6, and success templates**

Add after the Step 4 template, inside `step-container`:

```html
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
```

- [ ] **Step 3: Add success and personalize styles**

Append to `<style scoped>`:

```css
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
```

- [ ] **Step 4: Verify the full 6-step flow in browser**

Walk through all steps on http://localhost:3003/audit. Verify: steps 1→2→3→4→5→submit→6 (personalize)→success. Also test: skip personalize, back navigation, pre-fill from `?business=TestBiz`.

- [ ] **Step 5: Commit**

```bash
git add app/components/AuditFlow.vue
git commit -m "feat: add steps 5-6 (email, personalize) and success state with animations"
```

---

## Task 6: Integrate AuditFlow full mode into audit.vue

**Files:**
- Modify: `app/pages/audit.vue`

- [ ] **Step 1: Replace the form card with AuditFlow**

In `app/pages/audit.vue`, replace the entire form section (lines 117-198 — from `<section class="form-section">` through its closing `</section>`) with:

```html
<section class="form-section">
  <div class="form-layout">
    <AuditFlow mode="full" />
  </div>
</section>
```

- [ ] **Step 2: Update 48h → 24h in all copy**

In `app/pages/audit.vue`, make these text replacements:

1. Meta description (line 7): `Results in 48 hours` → `Results in 24 hours`
2. Hero subtitle (line 113): `all in 48 hours` → `all in 24 hours`
3. FAQ answer (line 46): `deliver in 48 hours` → `deliver in 24 hours`
4. Trust signals (line 186): `Results in 48 hours` → `Results in 24 hours` (if this section is retained after form removal; if it's removed as part of the old form template, skip this)

- [ ] **Step 3: Remove the old form state and styles**

Remove from `<script setup>`:
- The `form` reactive object (lines 13-19)
- The `submitted` ref (line 21)
- The `handleSubmit` function (lines 23-25)
- The form-related GSAP animation (line 71: `.audit-form-card` animation)

Remove from `<style scoped>`:
- All `.audit-form-card`, `.audit-form`, `.form-group`, `.form-row`, `.form-label`, `.form-input`, `.form-submit`, `.trust-signals`, `.trust-sep`, `.trust-item`, `.form-success`, `.success-title`, `.success-text`, `.success-link` styles — these are now handled by AuditFlow.

Keep: `.form-section`, `.form-layout` (the wrapper styles), all hero, covers, and FAQ styles.

- [ ] **Step 4: Verify /audit page**

Open http://localhost:3003/audit — the progressive form should render inside the existing page layout (hero above, covers and FAQ below). Walk through all steps.

- [ ] **Step 5: Commit**

```bash
git add app/pages/audit.vue
git commit -m "feat: integrate AuditFlow into audit page, update copy to 24h"
```

---

## Task 7: Standardize all CTA text across the site

**Files:**
- Modify: `app/components/HomepageHero.vue` (lines 121, 143)
- Modify: `app/components/HomeChecklist.vue` (line 156)
- Modify: `app/pages/services/visibility.vue` (line 184)
- Modify: `app/pages/services/content.vue` (line 163)
- Modify: `app/pages/services/web.vue` (line 163)
- Modify: `app/pages/services/automation.vue` (line 163)
- Modify: `app/pages/services/index.vue` (lines 122-124)
- Modify: `app/pages/about.vue` (line 120)

- [ ] **Step 1: Update HomepageHero.vue**

Line 121 — replace:
```html
See what we'd fix first →
```
with:
```html
Get your free audit &rarr;
```

Line 143 — replace:
```html
SEE WHAT WE'D FIX FIRST
```
with:
```html
GET YOUR FREE AUDIT
```

- [ ] **Step 2: Update HomeChecklist.vue**

Line 156 — replace:
```html
See what we'd fix first →
```
with:
```html
Get your free audit &rarr;
```

- [ ] **Step 3: Update service pages**

In `visibility.vue` line 184, `content.vue` line 163, `web.vue` line 163, `automation.vue` line 163 — replace:
```html
Get my free audit &rarr;
```
with:
```html
Get your free audit &rarr;
```

In `services/index.vue` lines 122-124 — replace:
```html
Get a free audit and we'll tell you &rarr;
```
with:
```html
Get your free audit &rarr;
```

- [ ] **Step 4: Update about.vue**

Line 120 — replace:
```html
Get a free audit &rarr;
```
with:
```html
Get your free audit &rarr;
```

- [ ] **Step 5: Verify all CTAs across the site**

Check these pages in the browser — all audit CTAs should say "Get your free audit":
- Homepage hero (two locations)
- Homepage checklist section
- /services, /services/visibility, /services/content, /services/web, /services/automation
- /about

Also verify these are already correct (no changes needed):
- Header navigation CTA (`AppHeader.vue`)
- Homepage close section (`HomeClose.vue`)
- Contact page sidebar (`contact.vue`)

- [ ] **Step 6: Commit**

```bash
git add app/components/HomepageHero.vue app/components/HomeChecklist.vue app/pages/services/visibility.vue app/pages/services/content.vue app/pages/services/web.vue app/pages/services/automation.vue app/pages/services/index.vue app/pages/about.vue
git commit -m "chore: standardize all audit CTA text to 'Get your free audit'"
```

---

## Task 8: Final review and responsive polish

**Files:**
- Modify: `app/components/AuditFlow.vue` (responsive adjustments if needed)

- [ ] **Step 1: Test responsive behavior**

Open http://localhost:3003/audit in a 375px-wide viewport (mobile). Walk through all steps. Check:
- Form card padding is 32px 24px
- Chips stack correctly (50% or full width)
- Step labels are readable
- Back button + summary don't overflow
- Success state is centered

- [ ] **Step 2: Test homepage teaser on mobile**

Open http://localhost:3003 at 375px. Scroll to audit section. Check the single input + button layout is clean.

- [ ] **Step 3: Test the full flow end-to-end**

1. Homepage → type "Joe's Coffee House" → click "Start my free audit" → stripe transition → /audit loads with step 2 (URL input) pre-focused, step 1 summary shows "Joe's Coffee House"
2. Complete all steps → success state shows
3. Click "← Back to homepage" → returns to homepage

- [ ] **Step 4: Fix any issues found in steps 1-3**

Apply responsive or animation fixes as needed.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "polish: responsive fixes and final flow verification"
```
