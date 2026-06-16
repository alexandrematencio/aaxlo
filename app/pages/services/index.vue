<script setup>
import { gsap } from 'gsap'

const { t } = useI18n()
const localePath = useLocalePath()
const { data: servicesData } = await useLocalizedContent('/services')

useContentSeo(servicesData)

const page = ref(null)

// Diagonal wipe hover handled via CSS

const services = computed(() => servicesData.value?.overview?.services || [])

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
      <span class="hero-label tw-hide">{{ servicesData?.overview?.label }}</span>
      <h1 class="hero-title tw-hide">{{ servicesData?.overview?.title }}</h1>
    </section>

    <!-- Service cards grid -->
    <section class="svc-grid">
      <NuxtLink
        v-for="svc in services"
        :key="svc.label"
        :to="localePath(svc.to)"
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
      <p class="cta-text tw-hide">{{ servicesData?.overview?.ctaText }}</p>
      <NuxtLink
        :to="localePath('/audit')"
        class="cta-link tw-hide"
        data-umami-event="audit-cta-click"
        data-umami-event-location="services-overview"
      >
        {{ servicesData?.overview?.ctaLink }}
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
  font-weight: 300;
  color: var(--color-accent-text);
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

.svc-card::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background: var(--color-dark);
  transform: translate(-101%, 101%);
  transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
  z-index: -1;
}
.svc-card:hover::before {
  transform: translate(0, 0);
}
.svc-card:hover .svc-title {
  color: #FF8270;
}
.svc-card:hover .svc-desc,
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
  font-weight: 300;
  color: var(--color-accent-text);
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
  font-weight: 300;
  color: var(--color-muted);
  line-height: 1.5;
  position: relative;
  z-index: 1;
  transition: color 0.4s;
}

.svc-arrow {
  font-family: var(--font);
  font-size: 20px;
  color: var(--color-accent-text);
  margin-top: auto;
  position: relative;
  z-index: 1;
  transition: color 0.4s, transform 0.3s;
}
.svc-card:hover .svc-arrow {
  transform: translateX(6px);
  color: var(--color-accent-text);
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
  font-weight: 300;
  color: var(--color-muted);
}

.cta-link {
  font-family: var(--font);
  font-size: 18px;
  font-weight: 600;
  color: var(--color-dark);
  text-decoration: none;
  text-transform: uppercase;
  letter-spacing: 0.05em;
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
  .svc-card,
  .svc-card:nth-child(3n) {
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
