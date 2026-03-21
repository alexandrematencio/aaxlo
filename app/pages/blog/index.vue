<script setup>
import { gsap } from 'gsap'

useHead({ title: 'Blog — AAXLO' })

const page = ref(null)
const email = ref('')
const subscribed = ref(false)

function handleSubscribe() {
  if (email.value) {
    subscribed.value = true
  }
}

onMounted(() => {
  const el = page.value
  if (!el) return

  const tl = gsap.timeline({ defaults: { ease: 'power2.inOut' } })

  tl.to(el.querySelector('.hero-label'), { clipPath: 'inset(-0.1em 0% -0.25em 0)', duration: 0.2, ease: 'steps(8)' }, '-=0.1')
  tl.to(el.querySelector('.hero-title'), { clipPath: 'inset(-0.1em 0% -0.25em 0)', duration: 0.45, ease: 'steps(20)' }, '-=0.1')
  tl.to(el.querySelector('.hero-subtitle'), { clipPath: 'inset(-0.1em 0% -0.25em 0)', duration: 0.35, ease: 'steps(30)' }, '-=0.15')
  tl.to(el.querySelector('.subscribe-form'), { clipPath: 'inset(-0.1em 0% -0.25em 0)', duration: 0.3, ease: 'power2.out' }, '-=0.1')
})
</script>

<template>
  <div ref="page" class="blog-page">
    <section class="hero">
      <div class="hero-content">
        <span class="hero-label tw-hide">BLOG</span>
        <h1 class="hero-title tw-hide">Insights & Resources</h1>
        <p class="hero-subtitle tw-hide">Articles coming soon. Subscribe to be the first to know when we publish.</p>

        <div class="subscribe-form tw-hide">
          <div v-if="!subscribed" class="subscribe-row">
            <input
              v-model="email"
              type="email"
              class="subscribe-input"
              placeholder="your@email.com"
              required
            />
            <button class="subscribe-btn" @click="handleSubscribe">Notify me &rarr;</button>
          </div>
          <p v-else class="subscribe-success">You are on the list. We will be in touch.</p>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.blog-page {
  position: relative;
  min-height: 100vh;
  background: var(--color-cream);
  display: flex;
  flex-direction: column;
}

.tw-hide { clip-path: inset(-0.1em 100% -0.25em 0); }

.hero {
  position: relative;
  border-bottom: 0.5px solid #24272e;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 96px 80px;
}

.hero-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 24px;
  max-width: 560px;
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
  line-height: 1.1;
  letter-spacing: -0.02em;
}

.hero-subtitle {
  font-family: var(--font);
  font-size: 18px;
  font-weight: 300;
  color: var(--color-muted);
  line-height: 1.6;
}

.subscribe-form {
  width: 100%;
  margin-top: 16px;
}

.subscribe-row {
  display: flex;
  gap: 0;
  border: 0.5px solid #24272e;
}

.subscribe-input {
  flex: 1;
  font-family: var(--font);
  font-size: 16px;
  font-weight: 300;
  color: var(--color-dark);
  background: var(--color-white);
  border: none;
  padding: 16px 20px;
  outline: none;
}
.subscribe-input::placeholder {
  color: var(--color-muted);
  opacity: 0.5;
}

.subscribe-btn {
  font-family: var(--font);
  font-size: 14px;
  font-weight: 600;
  color: var(--color-cream);
  background: var(--color-dark);
  border: none;
  padding: 16px 32px;
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.4s;
}
.subscribe-btn:hover {
  background: var(--color-accent);
}

.subscribe-success {
  font-family: var(--font);
  font-size: 16px;
  font-weight: 300;
  color: var(--color-accent);
  padding: 16px 0;
}

@media (max-width: 768px) {
  .hero { padding: 48px 24px; }
  .hero-title { font-size: 32px; }
  .subscribe-row { flex-direction: column; }
}
</style>
