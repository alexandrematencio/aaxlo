<script setup>
import { gsap } from 'gsap'

const { t } = useI18n()
const localePath = useLocalePath()
const { data: contactData } = await useLocalizedContent('/contact')

useHead({
  title: contactData.value?.seo?.title,
  meta: [{ name: 'description', content: contactData.value?.seo?.description }],
})

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
      <span class="hero-label tw-hide">{{ contactData?.hero?.label }}</span>
      <h1 class="hero-title tw-hide">{{ contactData?.hero?.title }}</h1>
    </section>

    <!-- Form + Info -->
    <section class="contact-section">
      <div class="contact-layout">
        <!-- Form -->
        <div class="contact-form-card tw-hide">
          <div v-if="!submitted">
            <form @submit.prevent="handleSubmit" class="contact-form">
              <div class="form-group">
                <label for="contact-name" class="form-label">{{ $t('contact_form.name') }}</label>
                <input
                  id="contact-name"
                  v-model="form.name"
                  type="text"
                  class="form-input"
                  required
                  :placeholder="$t('contact_form.namePlaceholder')"
                />
              </div>
              <div class="form-group">
                <label for="contact-email" class="form-label">{{ $t('contact_form.email') }}</label>
                <input
                  id="contact-email"
                  v-model="form.email"
                  type="email"
                  class="form-input"
                  required
                  :placeholder="$t('contact_form.emailPlaceholder')"
                />
              </div>
              <div class="form-group">
                <label for="contact-message" class="form-label">{{ $t('contact_form.message') }}</label>
                <textarea
                  id="contact-message"
                  v-model="form.message"
                  class="form-textarea"
                  required
                  rows="6"
                  :placeholder="$t('contact_form.messagePlaceholder')"
                ></textarea>
              </div>
              <button type="submit" class="form-submit">{{ $t('contact_form.submit') }}</button>
            </form>
          </div>

          <div v-else class="form-success">
            <h3 class="success-title">{{ $t('contact_form.successTitle') }}</h3>
            <p class="success-text">{{ $t('contact_form.successText') }} <strong>{{ form.email }}</strong>.</p>
            <NuxtLink :to="localePath('/')" class="success-link">{{ $t('contact_form.backHome') }}</NuxtLink>
          </div>
        </div>

        <!-- Info sidebar -->
        <div class="contact-info tw-hide">
          <div v-for="block in contactData?.info" :key="block.title" class="info-block">
            <h3 class="info-title">{{ block.title }}</h3>
            <a v-if="block.type === 'link'" :href="block.href" class="info-link" :target="block.external ? '_blank' : undefined" :rel="block.external ? 'noopener' : undefined">{{ block.text }}</a>
            <NuxtLink v-else-if="block.type === 'nuxtlink'" :to="localePath(block.to)" class="info-link">{{ block.text }}</NuxtLink>
            <p v-else class="info-text">{{ block.text }}</p>
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
