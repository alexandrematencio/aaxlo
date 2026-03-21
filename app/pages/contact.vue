<script setup>
import { gsap } from 'gsap'

useHead({ title: 'Contact — AAXLO' })

const page = ref(null)

const form = reactive({
  name: '',
  email: '',
  message: '',
})

const submitted = ref(false)

function handleSubmit() {
  submitted.value = true
}

onMounted(() => {
  const el = page.value
  if (!el) return

  const tl = gsap.timeline({ defaults: { ease: 'power2.inOut' } })

  tl.to(el.querySelector('.hero-label'), { clipPath: 'inset(-0.1em 0% -0.25em 0)', duration: 0.2, ease: 'steps(8)' }, '-=0.1')
  tl.to(el.querySelector('.hero-title'), { clipPath: 'inset(-0.1em 0% -0.25em 0)', duration: 0.45, ease: 'steps(20)' }, '-=0.1')

  tl.to(el.querySelector('.contact-form-card'), { clipPath: 'inset(-0.1em 0% -0.25em 0)', duration: 0.35, ease: 'power2.out' }, '-=0.15')
  tl.to(el.querySelector('.contact-info'), { clipPath: 'inset(-0.1em 0% -0.25em 0)', duration: 0.3, ease: 'power2.out' }, '-=0.2')
})
</script>

<template>
  <div ref="page" class="contact-page">
    <!-- Hero -->
    <section class="hero">
      <span class="hero-label tw-hide">CONTACT</span>
      <h1 class="hero-title tw-hide">Let's talk about your business.</h1>
    </section>

    <!-- Form + Info -->
    <section class="contact-section">
      <div class="contact-layout">
        <!-- Form -->
        <div class="contact-form-card tw-hide">
          <div v-if="!submitted">
            <form @submit.prevent="handleSubmit" class="contact-form">
              <div class="form-group">
                <label for="contact-name" class="form-label">Name *</label>
                <input
                  id="contact-name"
                  v-model="form.name"
                  type="text"
                  class="form-input"
                  required
                  placeholder="Your name"
                />
              </div>
              <div class="form-group">
                <label for="contact-email" class="form-label">Email *</label>
                <input
                  id="contact-email"
                  v-model="form.email"
                  type="email"
                  class="form-input"
                  required
                  placeholder="your@email.com"
                />
              </div>
              <div class="form-group">
                <label for="contact-message" class="form-label">Message *</label>
                <textarea
                  id="contact-message"
                  v-model="form.message"
                  class="form-textarea"
                  required
                  rows="6"
                  placeholder="Tell us about your project or question..."
                ></textarea>
              </div>
              <button type="submit" class="form-submit">Send message &rarr;</button>
            </form>
          </div>

          <div v-else class="form-success">
            <h3 class="success-title">Message sent!</h3>
            <p class="success-text">We will get back to you within 24 hours at <strong>{{ form.email }}</strong>.</p>
            <NuxtLink to="/" class="success-link">&larr; Back to homepage</NuxtLink>
          </div>
        </div>

        <!-- Info sidebar -->
        <div class="contact-info tw-hide">
          <div class="info-block">
            <h3 class="info-title">Email</h3>
            <a href="mailto:hi@axxlo.com" class="info-link">hi@axxlo.com</a>
          </div>
          <div class="info-block">
            <h3 class="info-title">Location</h3>
            <p class="info-text">Singapore</p>
          </div>
          <div class="info-block">
            <h3 class="info-title">Prefer to talk?</h3>
            <a href="https://cal.com/aaxlo" target="_blank" rel="noopener" class="info-link">Book a free 15-min call &rarr;</a>
          </div>
          <div class="info-block">
            <h3 class="info-title">Want a free audit instead?</h3>
            <NuxtLink to="/audit" class="info-link">Get your free audit &rarr;</NuxtLink>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.contact-page { position: relative; min-height: 100vh; background: var(--color-cream); }
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
  font-size: 48px;
  font-weight: 600;
  color: var(--color-dark);
  line-height: 1.05;
  letter-spacing: -0.02em;
  max-width: 600px;
}

/* ── CONTACT SECTION ── */
.contact-section {
  padding: 0 80px 96px;
}

.contact-layout {
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: 64px;
  align-items: flex-start;
}

/* ── FORM ── */
.contact-form-card {
  background: var(--color-white);
  border: 0.5px solid #24272e;
  padding: 48px;
}

.contact-form {
  display: flex;
  flex-direction: column;
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

.form-input,
.form-textarea {
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
.form-input::placeholder,
.form-textarea::placeholder {
  color: var(--color-muted);
  opacity: 0.5;
}
.form-input:focus,
.form-textarea:focus {
  border-color: var(--color-accent);
}

.form-textarea {
  resize: vertical;
  min-height: 140px;
  line-height: 1.5;
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

/* ── SUCCESS ── */
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
  font-weight: 300;
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

/* ── INFO SIDEBAR ── */
.contact-info {
  display: flex;
  flex-direction: column;
  gap: 32px;
  padding-top: 16px;
}

.info-block {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.info-title {
  font-family: var(--font);
  font-size: 12px;
  font-weight: 500;
  color: var(--color-dark);
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.info-text {
  font-family: var(--font);
  font-size: 16px;
  font-weight: 300;
  color: var(--color-muted);
  line-height: 1.4;
}

.info-link {
  font-family: var(--font);
  font-size: 16px;
  font-weight: 300;
  color: var(--color-dark);
  text-decoration: none;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  transition: color 0.3s;
}
.info-link:hover {
  color: var(--color-accent);
}

/* ── RESPONSIVE ── */
@media (max-width: 768px) {
  .hero { padding: 48px 24px 32px; }
  .hero-title { font-size: 32px; }
  .contact-section { padding: 0 24px 64px; }
  .contact-layout { grid-template-columns: 1fr; gap: 48px; }
  .contact-form-card { padding: 32px 24px; }
}
</style>
