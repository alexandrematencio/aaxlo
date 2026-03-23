<script setup>
import { gsap } from 'gsap'
import { VueTelInput } from 'vue-tel-input'
import 'vue-tel-input/vue-tel-input.css'

const { t } = useI18n()
const localePath = useLocalePath()

const props = defineProps({
  mode: {
    type: String,
    default: 'full',
    validator: v => ['teaser', 'full'].includes(v),
  },
  skip: { type: Boolean, default: false },
})

const section = ref(null)
useShineHover(section, '.popup-submit')

const formData = reactive({
  businessName: '',
  websiteUrl: '',
  email: '',
  phone: '',
  phoneFormatted: '',
  name: '',
})

const telInputOptions = computed(() => ({
  mode: 'international',
  preferredCountries: ['FR', 'US', 'GB', 'DE', 'ES', 'IT', 'SG'],
  defaultCountry: 'FR',
  dropdownOptions: { showSearchBox: true, showFlags: true },
  inputOptions: { placeholder: t('audit_form.phone') },
}))

function onPhoneInput(phone, phoneObject) {
  formData.phone = phone
  if (phoneObject?.formatted) {
    formData.phoneFormatted = phoneObject.formatted
  }
}

const route = useRoute()
const currentStep = ref(1)
const submitted = ref(false)
const errors = reactive({})
const stepContainer = ref(null)

const { navigateWithStripes } = useStripeTransition()

/* ── Teaser mode ── */
const showPopup = ref(false)

function onTeaserSubmit() {
  if (formData.businessName.trim().length < 2) return
  // If URL is also filled, show popup for contact details
  if (formData.websiteUrl.trim().length > 0) {
    showPopup.value = true
    return
  }
  // Otherwise navigate to audit with pre-filled data
  const params = new URLSearchParams({ business: formData.businessName.trim() })
  navigateWithStripes(localePath('/audit') + '?' + params.toString())
}

function submitPopup() {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(formData.email)) {
    errors.email = t('audit_form.invalidEmail')
    return
  }
  // Submit complete — show success
  submitted.value = true
  showPopup.value = false
}

function closePopup() {
  showPopup.value = false
}

function showFinalState() {
  const el = section.value
  if (!el) return

  const label = el.querySelector('.audit-label')
  if (label) gsap.set(label, { clipPath: 'inset(-0.1em 0% -0.25em 0)' })
  gsap.set(el.querySelector('.cta-headline'), { clipPath: 'inset(-0.1em 0% -0.25em 0)' })
  gsap.set(el.querySelector('.cta-subtitle'), { clipPath: 'inset(-0.1em 0% -0.25em 0)' })
  el.querySelectorAll('.audit-input').forEach(input => {
    gsap.set(input, { opacity: 1, y: 0 })
  })
  gsap.set(el.querySelector('.cta-button'), { opacity: 1, y: 0 })
  gsap.set(el.querySelector('.cta-small'), { opacity: 1 })
}

/* ── Full mode ── */
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
      errors.businessName = t('audit_form.invalidBusinessName')
      animateError('err-business')
      return false
    }
    // URL is optional — validate only if filled
    if (formData.websiteUrl.trim().length > 0) {
      try {
        new URL(formData.websiteUrl)
      } catch {
        errors.websiteUrl = t('audit_form.invalidUrl')
        animateError('err-url')
        return false
      }
    }
  } else if (step === 2) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      errors.email = t('audit_form.invalidEmail')
      animateError('err-email')
      return false
    }
  }
  // Step 3 — name is optional, always valid
  return true
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

function goNext() {
  if (!validateStep(currentStep.value)) return
  if (currentStep.value === 3) {
    // Final step — submit
    submitted.value = true
    showSuccess()
    return
  }
  animateStepForward(() => {
    currentStep.value++
    nextTick(() => {
      const el = stepContainer.value
      if (el) {
        const firstInput = el.querySelector('input')
        firstInput?.focus()
      }
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
        const firstInput = el.querySelector('input')
        firstInput?.focus()
      }
    })
  })
}

const progressWidth = computed(() => {
  if (submitted.value) return '100%'
  return `${(currentStep.value / 3) * 100}%`
})

const summaryLines = computed(() => {
  const lines = []
  if (currentStep.value > 1 && formData.businessName) lines.push(formData.businessName)
  if (currentStep.value > 1 && formData.websiteUrl) lines.push(formData.websiteUrl)
  if (currentStep.value > 2 && formData.email) lines.push(formData.email)
  return lines
})

onMounted(() => {
  if (props.mode === 'full') {
    isMobile.value = window.innerWidth <= 768
    const business = route.query.business
    const url = route.query.url
    if (business && typeof business === 'string' && business.trim().length >= 2) {
      formData.businessName = business.trim()
      if (url && typeof url === 'string') formData.websiteUrl = url.trim()
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

          /* Label typewriter */
          const label = el.querySelector('.audit-label')
          if (label) {
            tl.to(label, {
              clipPath: 'inset(-0.1em 0% -0.25em 0)', duration: 0.1, ease: 'steps(10)',
            })
          }

          /* Headline typewriter */
          tl.to(el.querySelector('.cta-headline'), {
            clipPath: 'inset(-0.1em 0% -0.25em 0)', duration: 0.12, ease: 'steps(28)',
          }, '-=0.05')

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
  <!-- ═══ TEASER MODE ═══ -->
  <section v-if="mode === 'teaser'" ref="section" class="audit-cta-section">
    <div class="audit-cta-inner">
      <div class="audit-cell">
        <span class="audit-label tw-hide">{{ $t('audit_form.teaserLabel') }}</span>
        <h2 class="cta-headline tw-hide">
          {{ $t('audit_form.teaserHeadline') }}
        </h2>
      </div>

      <div class="audit-cell">
        <p class="cta-subtitle tw-hide">
          {{ $t('audit_form.teaserSubtitle') }}
        </p>
      </div>

      <div v-if="!submitted" class="audit-cell">
        <form class="audit-form" @submit.prevent="onTeaserSubmit">
          <div class="audit-form-fields">
            <input
              v-model="formData.businessName"
              type="text"
              class="audit-input"
              :placeholder="$t('audit_form.teaserBusinessPlaceholder')"
              style="opacity: 0; transform: translateY(8px)"
            />
            <input
              v-model="formData.websiteUrl"
              type="url"
              class="audit-input"
              :placeholder="$t('audit_form.teaserUrlPlaceholder')"
              style="opacity: 0; transform: translateY(8px)"
            />
          </div>
          <button
            type="submit"
            class="cta-button"
            style="opacity: 0; transform: translateY(8px)"
          >
            {{ $t('audit_form.teaserSubmit') }}
          </button>
        </form>
      </div>

      <div v-if="!submitted" class="audit-cell">
        <p class="cta-small" style="opacity: 0">
          {{ $t('audit_form.teaserDisclaimer') }}
        </p>
      </div>

      <!-- Success state (teaser popup submit) -->
      <div v-if="submitted" class="audit-cell success-cell">
        <img src="/images/logo-glyph.svg" alt="" class="success-glyph" />
        <h3 class="success-title tw-hide">{{ $t('audit_form.successTitle') }}</h3>
        <p class="success-text">{{ $t('audit_form.successText', { email: formData.email }) }}</p>
        <p class="success-trust">{{ $t('audit_form.successTrust') }}</p>
      </div>
    </div>

    <!-- Popup overlay for contact details -->
    <Teleport to="body">
      <Transition name="popup">
        <div v-if="showPopup" class="popup-overlay" @click.self="closePopup">
          <div class="popup-card">
            <button type="button" class="popup-close" @click="closePopup" aria-label="Close">&times;</button>
            <span class="popup-label">{{ $t('audit_form.popupTitle') }}</span>
            <h3 class="popup-title">{{ $t('audit_form.popupDesc') }}</h3>
            <p class="popup-summary">
              <strong>{{ formData.businessName }}</strong>
              <span v-if="formData.websiteUrl"> · {{ formData.websiteUrl }}</span>
            </p>
            <form class="popup-form" @submit.prevent="submitPopup">
              <input
                v-model="formData.email"
                type="email"
                class="popup-input"
                :placeholder="$t('audit_form.emailPlaceholder')"
                required
              />
              <span v-if="errors.email" class="flow-error">{{ errors.email }}</span>
              <VueTelInput
                v-model="formData.phone"
                v-bind="telInputOptions"
                class="tel-input-wrap"
                @on-input="onPhoneInput"
              />
              <input
                v-model="formData.name"
                type="text"
                class="popup-input"
                :placeholder="$t('audit_form.namePlaceholder')"
              />
              <button type="submit" class="popup-submit">{{ $t('audit_form.submit') }}</button>
            </form>
          </div>
        </div>
      </Transition>
    </Teleport>
  </section>

  <!-- ═══ FULL MODE (3 steps) ═══ -->
  <div v-else class="flow-card">
    <!-- Progress bar -->
    <div class="progress-track" role="progressbar" :aria-valuenow="currentStep" aria-valuemin="1" aria-valuemax="3" aria-label="Form progress">
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
      <!-- Step 1: Business Name + URL -->
      <div v-if="currentStep === 1 && !submitted" class="step">
        <label for="flow-business" class="step-label">{{ $t('audit_form.step1Label') }}</label>
        <input
          id="flow-business"
          v-model="formData.businessName"
          type="text"
          class="flow-input"
          :placeholder="$t('audit_form.teaserBusinessPlaceholder')"
          :aria-describedby="errors.businessName ? 'err-business' : undefined"
        />
        <span v-if="errors.businessName" id="err-business" class="flow-error" role="alert">{{ errors.businessName }}</span>
        <input
          id="flow-url"
          v-model="formData.websiteUrl"
          type="url"
          class="flow-input"
          :placeholder="$t('audit_form.teaserUrlPlaceholder')"
          :aria-describedby="errors.websiteUrl ? 'err-url' : undefined"
        />
        <span v-if="errors.websiteUrl" id="err-url" class="flow-error" role="alert">{{ errors.websiteUrl }}</span>
        <button type="button" class="flow-next" @click="goNext">{{ $t('audit_form.next') }}</button>
      </div>

      <!-- Step 2: Email + Phone -->
      <div v-if="currentStep === 2 && !submitted" class="step">
        <label for="flow-email" class="step-label">{{ $t('audit_form.step2Label') }}</label>
        <input
          id="flow-email"
          v-model="formData.email"
          type="email"
          class="flow-input"
          :placeholder="$t('audit_form.emailPlaceholder')"
          :aria-describedby="errors.email ? 'err-email' : undefined"
        />
        <span v-if="errors.email" id="err-email" class="flow-error" role="alert">{{ errors.email }}</span>
        <VueTelInput
          v-model="formData.phone"
          v-bind="telInputOptions"
          class="tel-input-wrap"
          @on-input="onPhoneInput"
        />
        <button type="button" class="flow-next" @click="goNext">{{ $t('audit_form.next') }}</button>
      </div>

      <!-- Step 3: Name + Submit -->
      <div v-if="currentStep === 3 && !submitted" class="step">
        <label for="flow-name" class="step-label">{{ $t('audit_form.step3Label') }}</label>
        <input
          id="flow-name"
          v-model="formData.name"
          type="text"
          class="flow-input"
          :placeholder="$t('audit_form.nameOptionalPlaceholder')"
        />
        <button type="button" class="flow-next flow-next--submit" @click="goNext">{{ $t('audit_form.submit') }}</button>
      </div>

      <!-- Success State -->
      <div v-if="showingSuccess" class="step success-step">
        <img src="/images/logo-glyph.svg" alt="" class="success-glyph" />
        <h3 class="success-title tw-hide">{{ $t('audit_form.successTitle') }}</h3>
        <p class="success-text">{{ $t('audit_form.successText', { email: formData.email }) }}</p>
        <p class="success-trust">{{ $t('audit_form.successTrust') }}</p>
        <NuxtLink :to="localePath('/')" class="success-link">{{ $t('audit_form.backHome') }}</NuxtLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* ═══ TEASER MODE ═══ */
.audit-cta-section {
  position: relative;
  background: #FFDAD4;
  padding: 120px clamp(32px, 6vw, 96px);
  border-top: 0.5px solid #24272e;
  display: flex;
  justify-content: center;
}

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
  padding: 16px;
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

/* -- Teaser Form -- */
.audit-form {
  width: 100%;
}

.audit-form-fields {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.audit-input {
  width: 100%;
  padding: 14px 16px;
  font-family: var(--font);
  font-size: 16px;
  font-weight: 300;
  background: transparent;
  border: 0.5px solid #24272e;
  border-radius: 0;
  color: var(--color-dark);
  outline: none;
  transition: border-color 0.25s;
  -webkit-appearance: none;
  appearance: none;
}
.audit-input::placeholder { color: var(--color-muted, #6e7381); }
.audit-input:focus { border-color: var(--color-accent); }

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
  border: 0.5px solid #24272e;
  border-radius: 0;
  cursor: pointer;
  transition: background 0.3s;
  margin-top: 12px;
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

/* -- Teaser Success -- */
.success-cell {
  text-align: center;
  padding: 32px 12px;
}

/* ═══ POPUP ═══ */
.popup-overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;
  background: rgba(36, 39, 46, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}

.popup-card {
  position: relative;
  background: var(--color-white, #fcfcfc);
  border: 0.5px solid #24272e;
  padding: 48px;
  max-width: 480px;
  width: 100%;
}

.popup-close {
  position: absolute;
  top: 16px;
  right: 16px;
  background: none;
  border: none;
  font-size: 24px;
  color: var(--color-muted);
  cursor: pointer;
  padding: 4px 8px;
  transition: color 0.2s;
}
.popup-close:hover { color: var(--color-dark); }

.popup-label {
  display: block;
  font-family: var(--font);
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--color-accent);
  margin-bottom: 8px;
}

.popup-title {
  font-family: var(--font);
  font-size: 24px;
  font-weight: 600;
  color: var(--color-dark);
  line-height: 1.2;
  margin: 0 0 16px 0;
}

.popup-summary {
  font-family: var(--font);
  font-size: 14px;
  font-weight: 300;
  color: var(--color-muted);
  margin: 0 0 24px 0;
}

.popup-form {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.popup-input {
  width: 100%;
  padding: 14px 16px;
  font-family: var(--font);
  font-size: 16px;
  font-weight: 300;
  background: var(--color-cream);
  border: 0.5px solid #24272e;
  border-radius: 0;
  color: var(--color-dark);
  outline: none;
  transition: border-color 0.25s;
}
.popup-input::placeholder { color: var(--color-muted); opacity: 0.5; }
.popup-input:focus { border-color: var(--color-accent); }

/* ── Tel input overrides ── */
.tel-input-wrap {
  border: none !important;
  box-shadow: none !important;
  background: none !important;
  padding: 0 !important;
}
.tel-input-wrap :deep(.vti__input) {
  font-family: var(--font);
  font-size: 16px;
  font-weight: 300;
  color: var(--color-dark);
  border: 0.5px solid #24272e;
  border-radius: 0;
  padding: 14px 16px;
  outline: none;
  transition: border-color 0.25s;
  background: transparent;
}
.tel-input-wrap :deep(.vti__input:focus) {
  border-color: var(--color-accent);
  box-shadow: none;
}
.tel-input-wrap :deep(.vti__dropdown) {
  border: 0.5px solid #24272e;
  border-right: none;
  border-radius: 0;
  background: var(--color-cream);
  padding: 0 12px;
}
.tel-input-wrap :deep(.vti__dropdown:hover) {
  background: var(--color-white);
}
.tel-input-wrap :deep(.vti__dropdown-list) {
  border: 0.5px solid #24272e;
  border-radius: 0;
  background: var(--color-white);
  z-index: 1010;
}
.tel-input-wrap :deep(.vti__search_box) {
  font-family: var(--font);
  border: 0.5px solid #24272e;
  border-radius: 0;
  padding: 8px 12px;
  margin: 8px;
}
.tel-input-wrap :deep(.vti__dropdown-item) {
  font-family: var(--font);
  font-size: 14px;
  padding: 8px 12px;
}
.tel-input-wrap :deep(.vti__dropdown-item.highlighted) {
  background: var(--color-cream);
}

.popup-submit {
  width: 100%;
  font-family: var(--font);
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  padding: 16px;
  background: #FF8270;
  color: var(--color-dark);
  border: none;
  border-radius: 0;
  cursor: pointer;
  margin-top: 4px;
}
/* Shine hover — handled by useShineHover composable */

/* Popup transition */
.popup-enter-active,
.popup-leave-active {
  transition: opacity 0.25s ease;
}
.popup-enter-active .popup-card,
.popup-leave-active .popup-card {
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.25s ease;
}
.popup-enter-from,
.popup-leave-to {
  opacity: 0;
}
.popup-enter-from .popup-card {
  transform: translateY(20px);
  opacity: 0;
}
.popup-leave-to .popup-card {
  transform: translateY(10px);
  opacity: 0;
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
  .popup-card {
    padding: 32px 24px;
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

.flow-next--submit {
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

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
}
</style>
