<script setup>
import { gsap } from 'gsap'

const localePath = useLocalePath()

defineProps({
  label: { type: String, required: true },
  title: { type: String, required: true },
  text: { type: String, required: true },
  index: { type: String, default: '' },
})

const page = ref(null)
useShineHover(page, '.stub-footer-cell')

onMounted(() => {
  const el = page.value
  const tl = gsap.timeline({ defaults: { ease: 'power2.inOut' } })

  /* ── Back link typewriter ── */
  tl.to(el.querySelector('.stub-back'), {
    clipPath: 'inset(-0.1em 0% -0.25em 0)',
    duration: 0.2,
    ease: 'steps(8)',
  }, '-=0.1')

  /* ── Logo draws ── */
  tl.to(el.querySelector('.stub-logo'), {
    clipPath: 'inset(-0.1em 0% -0.25em 0)',
    duration: 0.25,
    ease: 'power2.out',
  }, '-=0.15')

  /* ── Label typewriter ── */
  tl.to(el.querySelector('.stub-label'), {
    clipPath: 'inset(-0.1em 0% -0.25em 0)',
    duration: 0.2,
    ease: 'steps(10)',
  }, '-=0.1')

  /* ── Title typewriter ── */
  tl.to(el.querySelector('.stub-title'), {
    clipPath: 'inset(-0.1em 0% -0.25em 0)',
    duration: 0.4,
    ease: 'steps(25)',
  }, '-=0.1')

  /* ── Body text typewriter ── */
  tl.to(el.querySelector('.stub-text'), {
    clipPath: 'inset(-0.1em 0% -0.25em 0)',
    duration: 0.35,
    ease: 'steps(40)',
  }, '-=0.2')

  /* ── Index number fades ── */
  const idx = el.querySelector('.stub-index')
  if (idx) {
    tl.to(idx, { opacity: 1, duration: 0.3 }, '-=0.2')
  }

  /* ── Footer cells reveal ── */
  const footerCells = el.querySelectorAll('.stub-footer-cell')
  tl.to(footerCells, {
    clipPath: 'inset(-0.1em 0% -0.25em 0)',
    duration: 0.2,
    stagger: 0.04,
    ease: 'power2.out',
  }, '-=0.15')
})
</script>

<template>
  <div ref="page" class="stub-page">
    <!-- Header bar -->
    <header class="stub-header">
      <NuxtLink :to="localePath('/')" class="stub-back tw-hide">&larr; BACK TO HOME</NuxtLink>
      <img src="/images/axxlo-logo.svg" alt="AAXL" class="stub-logo tw-hide" />
    </header>

    <!-- Main content area -->
    <div class="stub-main">
      <div class="stub-content-grid">
        <!-- Left: label + index -->
        <div class="stub-meta">
          <span class="stub-label tw-hide">{{ label }}</span>
          <span v-if="index" class="stub-index">{{ index }}</span>
        </div>
        <!-- Right: title + body -->
        <div class="stub-body">
          <h1 class="stub-title tw-hide">{{ title }}</h1>
          <p class="stub-text tw-hide">{{ text }}</p>
        </div>
      </div>
    </div>

    <!-- Footer bar (mini grid matching homepage style) -->
    <div class="stub-footer">
      <NuxtLink :to="localePath('/')" class="stub-footer-cell tw-hide">
        <span class="cell-label">HOME</span>
      </NuxtLink>
      <NuxtLink :to="localePath('/services')" class="stub-footer-cell tw-hide">
        <span class="cell-label">SERVICES</span>
      </NuxtLink>
      <NuxtLink :to="localePath('/audit')" class="stub-footer-cell stub-cta tw-hide">
        <span class="cell-label">FREE AUDIT</span>
      </NuxtLink>
      <NuxtLink :to="localePath('/contact')" class="stub-footer-cell tw-hide">
        <span class="cell-label">CONTACT</span>
      </NuxtLink>
    </div>
  </div>
</template>

<style scoped>
.stub-page {
  position: relative;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: var(--color-cream);
}

/* ── HEADER BAR ── */
.stub-header {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 32px;
  background: white;
  border-bottom: 0.5px solid #24272e;
}

.stub-back {
  font-family: var(--font);
  font-size: 12px;
  font-weight: 300;
  color: var(--color-muted);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  text-decoration: none;
  transition: color 0.3s;
}
.stub-back:hover {
  color: var(--color-dark);
}

.stub-logo {
  height: 28px;
  width: auto;
}

/* ── MAIN CONTENT ── */
.stub-main {
  position: relative;
  flex: 1;
  display: flex;
  flex-direction: column;
  border-bottom: 0.5px solid #24272e;
}

.stub-content-grid {
  display: grid;
  grid-template-columns: 240px 1fr;
  flex: 1;
}

/* Left meta column */
.stub-meta {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 48px 32px;
  border-right: 0.5px solid #24272e;
}

.stub-label {
  font-family: var(--font);
  font-size: 11px;
  font-weight: 300;
  color: var(--color-accent);
  letter-spacing: 0.15em;
  text-transform: uppercase;
}

.stub-index {
  font-family: var(--font);
  font-size: 140px;
  font-weight: 700;
  color: rgba(36, 39, 46, 0.04);
  line-height: 1;
  opacity: 0;
}

/* Right body column */
.stub-body {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 32px;
  padding: 64px 80px;
  max-width: 720px;
}

.stub-title {
  font-family: var(--font);
  font-size: 48px;
  font-weight: 600;
  color: var(--color-dark);
  line-height: 1.05;
  letter-spacing: -0.02em;
}

.stub-text {
  font-family: var(--font);
  font-size: 18px;
  font-weight: 300;
  color: var(--color-muted);
  line-height: 1.6;
}

/* ── FOOTER BAR (mini nav grid) ── */
.stub-footer {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1px;
  background: var(--color-dark);
}

.stub-footer-cell {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px 16px;
  background: var(--color-accent);
  text-decoration: none;
  color: var(--color-dark);
  overflow: hidden;
  position: relative;
  cursor: pointer;
}

/* Shine hover — handled by useShineHover composable */

.cell-label {
  position: relative;
  z-index: 1;
  font-family: var(--font);
  font-size: 13px;
  font-weight: 300;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  transition: color 0.4s, transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
.stub-footer-cell:hover .cell-label {
  transform: translateY(-2px);
}

.stub-footer-cell:active {
  transform: scale(0.97);
  transition: transform 0.1s ease;
}

/* ── RESPONSIVE ── */
@media (max-width: 768px) {
  .stub-content-grid {
    grid-template-columns: 1fr;
  }

  .stub-meta {
    padding: 24px 24px 0;
    flex-direction: row;
    align-items: center;
    gap: 16px;
  }

  .stub-index {
    font-size: 60px;
  }

  .stub-body {
    padding: 32px 24px 48px;
  }

  .stub-title {
    font-size: 32px;
  }

  .stub-footer {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
