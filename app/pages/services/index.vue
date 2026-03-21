<script setup>
import { gsap } from 'gsap'

useHead({ title: 'Services — AAXLO' })

const page = ref(null)

const services = [
  {
    label: 'VISIBILITY',
    index: '01',
    title: 'Get found everywhere',
    description: 'Google Business Profile, local SEO, directory listings, and review generation to dominate local search.',
    to: '/services/visibility',
  },
  {
    label: 'WEB',
    index: '02',
    title: 'Your digital storefront',
    description: 'Modern websites, digital menus, booking systems, and e-commerce built for conversion.',
    to: '/services/web',
  },
  {
    label: 'CONTENT',
    index: '03',
    title: 'Content that converts',
    description: 'Social media management, content repurposing, brand identity, and professional media.',
    to: '/services/content',
  },
  {
    label: 'AUTOMATION',
    index: '04',
    title: 'Automate the busywork',
    description: 'AI chatbots, review response bots, WhatsApp automation, and email campaigns on autopilot.',
    to: '/services/automation',
  },
  {
    label: 'CONSULTING',
    index: '05',
    title: 'Custom AI for your business',
    description: 'Custom AI workflows, app MVPs, competitor monitoring, and AI training tailored to you.',
    to: '/services/consulting',
  },
]

onMounted(() => {
  const el = page.value
  if (!el) return

  const tl = gsap.timeline({ defaults: { ease: 'power2.inOut' } })

  /* Label typewriter */
  tl.to(el.querySelector('.hero-label'), {
    clipPath: 'inset(-0.1em 0% -0.25em 0)', duration: 0.2, ease: 'steps(8)',
  }, '-=0.1')

  /* Title typewriter */
  tl.to(el.querySelector('.hero-title'), {
    clipPath: 'inset(-0.1em 0% -0.25em 0)', duration: 0.45, ease: 'steps(30)',
  }, '-=0.1')

  /* Service cards stagger */
  tl.to(el.querySelectorAll('.svc-card'), {
    clipPath: 'inset(-0.1em 0% -0.25em 0)', duration: 0.3, stagger: 0.06, ease: 'power2.out',
  }, '-=0.15')

  /* Card labels */
  tl.to(el.querySelectorAll('.svc-label'), {
    clipPath: 'inset(-0.1em 0% -0.25em 0)', duration: 0.2, stagger: 0.04, ease: 'steps(10)',
  }, '-=0.2')

  /* CTA */
  const cta = el.querySelector('.cta-section')
  if (cta) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            gsap.to(cta.querySelectorAll('.tw-hide'), {
              clipPath: 'inset(-0.1em 0% -0.25em 0)', duration: 0.35, stagger: 0.06, ease: 'steps(20)',
            })
            observer.disconnect()
          }
        })
      },
      { threshold: 0.2 }
    )
    observer.observe(cta)
  }
})
</script>

<template>
  <div ref="page" class="services-page">
    <!-- Hero -->
    <section class="hero">
      <span class="hero-label tw-hide">SERVICES</span>
      <h1 class="hero-title tw-hide">Full-spectrum AI solutions<br>for local businesses.</h1>
    </section>

    <!-- Service cards grid -->
    <section class="svc-grid">
      <NuxtLink
        v-for="svc in services"
        :key="svc.label"
        :to="svc.to"
        class="svc-card tw-hide"
      >
        <div class="svc-top">
          <span class="svc-label tw-hide">{{ svc.label }}</span>
          <span class="svc-index">{{ svc.index }}</span>
        </div>
        <h2 class="svc-title">{{ svc.title }}</h2>
        <p class="svc-desc">{{ svc.description }}</p>
        <span class="svc-arrow">&rarr;</span>
      </NuxtLink>
    </section>

    <!-- Bottom CTA -->
    <section class="cta-section">
      <p class="cta-text tw-hide">Not sure which service you need?</p>
      <NuxtLink to="/audit" class="cta-link tw-hide">
        Get your free audit &rarr;
      </NuxtLink>
    </section>
  </div>
</template>

<style scoped>
.services-page {
  position: relative;
  min-height: 100vh;
  background: var(--color-cream);
}

/* ── HERO ── */
.hero {
  position: relative;
  padding: 96px 80px 64px;
  border-bottom: 0.5px solid #24272e;
}

.hero-label {
  display: block;
  font-family: var(--font);
  font-size: 11px;
  font-weight: 400;
  color: var(--color-accent);
  letter-spacing: 0.15em;
  text-transform: uppercase;
  margin-bottom: 24px;
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

/* ── SERVICE CARDS GRID ── */
.svc-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
}

.svc-card {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 40px;
  text-decoration: none;
  color: var(--color-dark);
  border-right: 0.5px solid #24272e;
  border-bottom: 0.5px solid #24272e;
  overflow: hidden;
  transition: background 0.4s;
}
.svc-card:nth-child(3n) {
  border-right: none;
}
.svc-card:hover {
  background: var(--color-peach);
}

/* Diagonal wipe on hover */
.svc-card::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background: var(--color-dark);
  transform: translate(-101%, 101%);
  transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
  z-index: 0;
}
.svc-card:hover::before {
  transform: translate(0, 0);
}
.svc-card:hover .svc-title,
.svc-card:hover .svc-desc,
.svc-card:hover .svc-arrow,
.svc-card:hover .svc-label {
  color: var(--color-cream);
}
.svc-card:hover .svc-index {
  color: rgba(255, 255, 255, 0.08);
}

.svc-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  position: relative;
  z-index: 1;
}

.svc-label {
  font-family: var(--font);
  font-size: 11px;
  font-weight: 400;
  color: var(--color-accent);
  letter-spacing: 0.15em;
  text-transform: uppercase;
  transition: color 0.4s;
}

.svc-index {
  font-family: var(--font);
  font-size: 48px;
  font-weight: 700;
  color: rgba(36, 39, 46, 0.06);
  line-height: 1;
  transition: color 0.4s;
}

.svc-title {
  font-family: var(--font);
  font-size: 24px;
  font-weight: 600;
  color: var(--color-dark);
  line-height: 1.15;
  letter-spacing: -0.01em;
  position: relative;
  z-index: 1;
  transition: color 0.4s;
}

.svc-desc {
  font-family: var(--font);
  font-size: 15px;
  font-weight: 400;
  color: var(--color-muted);
  line-height: 1.5;
  position: relative;
  z-index: 1;
  transition: color 0.4s;
}

.svc-arrow {
  font-family: var(--font);
  font-size: 20px;
  color: var(--color-accent);
  margin-top: auto;
  position: relative;
  z-index: 1;
  transition: color 0.4s, transform 0.3s;
}
.svc-card:hover .svc-arrow {
  transform: translateX(6px);
  color: var(--color-accent);
}

/* ── CTA ── */
.cta-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  padding: 96px 48px;
  text-align: center;
}

.cta-text {
  font-family: var(--font);
  font-size: 20px;
  font-weight: 400;
  color: var(--color-muted);
}

.cta-link {
  font-family: var(--font);
  font-size: 18px;
  font-weight: 600;
  color: var(--color-dark);
  text-decoration: none;
  padding: 16px 40px;
  border: 0.5px solid #24272e;
  transition: background 0.4s, color 0.4s;
}
.cta-link:hover {
  background: var(--color-dark);
  color: var(--color-cream);
}

/* ── TYPEWRITER ── */
.tw-hide {
  clip-path: inset(-0.1em 100% -0.25em 0);
}

/* ── RESPONSIVE ── */
@media (max-width: 1024px) {
  .svc-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .svc-card:nth-child(3n) {
    border-right: 0.5px solid #24272e;
  }
  .svc-card:nth-child(2n) {
    border-right: none;
  }
  .hero {
    padding: 64px 48px 48px;
  }
  .hero-title {
    font-size: 36px;
  }
}

@media (max-width: 640px) {
  .svc-grid {
    grid-template-columns: 1fr;
  }
  .svc-card {
    border-right: none;
  }
  .hero {
    padding: 48px 24px 32px;
  }
  .hero-title {
    font-size: 28px;
  }
  .cta-section {
    padding: 64px 24px;
  }
}
</style>
