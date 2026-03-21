<script setup>
import { gsap } from 'gsap'

const props = defineProps({
  current: { type: String, required: true },
})

const nav = ref(null)

const services = [
  { slug: 'visibility', label: 'Visibility', index: '01', to: '/services/visibility' },
  { slug: 'web', label: 'Web', index: '02', to: '/services/web' },
  { slug: 'content', label: 'Content', index: '03', to: '/services/content' },
  { slug: 'automation', label: 'Automation', index: '04', to: '/services/automation' },
  { slug: 'consulting', label: 'Consulting', index: '05', to: '/services/consulting' },
]

onMounted(() => {
  const el = nav.value
  if (!el) return

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const tl = gsap.timeline({ defaults: { ease: 'power2.out' } })

          // Draw top + bottom borders
          tl.to(el.querySelectorAll('.sn-border'), {
            scaleX: 1, duration: 0.3, stagger: 0.06, ease: 'power2.inOut',
          })

          // Reveal tabs left → right
          tl.to(el.querySelectorAll('.sn-tab'), {
            clipPath: 'inset(-0.1em 0% -0.25em 0)', duration: 0.2, stagger: 0.04,
          }, '-=0.15')

          // Index numbers fade in
          tl.to(el.querySelectorAll('.sn-index'), {
            opacity: 1, duration: 0.2, stagger: 0.03,
          }, '-=0.15')

          observer.disconnect()
        }
      })
    },
    { threshold: 0.5 }
  )
  if (el) observer.observe(el)
})
</script>

<template>
  <nav ref="nav" class="service-nav">
    <span class="sn-border sn-border--top" aria-hidden="true"></span>
    <div class="sn-track">
      <NuxtLink
        v-for="s in services"
        :key="s.slug"
        :to="s.to"
        class="sn-tab tw-hide"
        :class="{ 'sn-tab--active': s.slug === current }"
      >
        <span class="sn-index">{{ s.index }}</span>
        <span class="sn-label">{{ s.label }}</span>
        <span class="sn-arrow">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M3 11L11 3M11 3H5M11 3V9" stroke="currentColor" stroke-width="1.2"/>
          </svg>
        </span>
      </NuxtLink>
    </div>
    <span class="sn-border sn-border--bottom" aria-hidden="true"></span>
  </nav>
</template>

<style scoped>
.service-nav {
  position: relative;
  background: var(--color-cream);
}

/* ── Borders ── */
.sn-border {
  display: block;
  position: absolute;
  left: 0;
  width: 100%;
  height: 0.5px;
  background: #24272e;
  transform: scaleX(0);
  transform-origin: left;
  z-index: 2;
}
.sn-border--top { top: 0; }
.sn-border--bottom { bottom: 0; }

.tw-hide {
  clip-path: inset(-0.1em 100% -0.25em 0);
}

/* ── Track ── */
.sn-track {
  display: flex;
}

/* ── Tab ── */
.sn-tab {
  flex: 1;
  position: relative;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 16px 24px;
  text-decoration: none;
  color: var(--color-muted);
  overflow: hidden;
  transition: color 0.3s;
  border-right: 0.5px solid #24272e;
}

.sn-tab:last-child {
  border-right: none;
}

/* Active tab */
.sn-tab--active {
  color: var(--color-dark);
  background: var(--color-peach);
}

.sn-tab--active .sn-index {
  color: var(--color-accent);
}

.sn-tab--active .sn-label {
  font-weight: 600;
}

/* ── Hover overlay (non-active tabs only) ── */
.sn-tab:not(.sn-tab--active)::before {
  content: '';
  position: absolute;
  inset: 0;
  background: var(--color-dark);
  transform: translateY(100%);
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  z-index: 0;
}

.sn-tab:not(.sn-tab--active):hover::before {
  transform: translateY(0);
}

.sn-tab:not(.sn-tab--active):hover {
  color: var(--color-cream);
}

.sn-tab:not(.sn-tab--active):hover .sn-index {
  color: var(--color-accent);
}

/* ── Index ── */
.sn-index {
  position: relative;
  z-index: 1;
  font-family: var(--font);
  font-size: 11px;
  font-weight: 300;
  letter-spacing: 0.05em;
  color: var(--color-muted);
  opacity: 0;
  transition: color 0.3s;
}

/* ── Label ── */
.sn-label {
  position: relative;
  z-index: 1;
  font-family: var(--font);
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0.02em;
  text-transform: uppercase;
  transition: color 0.3s, transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.sn-tab:not(.sn-tab--active):hover .sn-label {
  transform: translateX(4px);
}

/* ── Arrow (visible on hover for non-active) ── */
.sn-arrow {
  position: relative;
  z-index: 1;
  margin-left: auto;
  opacity: 0;
  transform: translate(-6px, 6px);
  transition: opacity 0.3s, transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), color 0.3s;
}

.sn-tab:not(.sn-tab--active):hover .sn-arrow {
  opacity: 1;
  transform: translate(0, 0);
}

/* Active tab: show a subtle accent bar at top */
.sn-tab--active::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: var(--color-accent);
}

/* ── Active state ── */
.sn-tab:active {
  transform: scale(0.98);
  transition: transform 0.1s ease;
}

/* ── Responsive ── */
@media (max-width: 1024px) {
  .sn-tab {
    padding: 14px 16px;
    gap: 8px;
  }
  .sn-label {
    font-size: 12px;
  }
  .sn-index {
    display: none;
  }
}

@media (max-width: 768px) {
  .sn-track {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
  }
  .sn-track::-webkit-scrollbar {
    display: none;
  }
  .sn-tab {
    flex: 0 0 auto;
    padding: 12px 20px;
    white-space: nowrap;
  }
  .sn-arrow {
    display: none;
  }
}
</style>
