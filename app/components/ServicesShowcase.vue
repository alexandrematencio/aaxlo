<script setup>
import { gsap } from 'gsap'

const props = defineProps({
  skip: { type: Boolean, default: false },
  content: { type: Array, default: null },
})
const section = ref(null)
const { navigateWithStripes } = useStripeTransition()
const localePath = useLocalePath()

const cells = computed(() => props.content || [])

function showFinalState() {
  const el = section.value
  if (!el) return
  el.querySelectorAll('.grid-cell').forEach(c => gsap.set(c, { clipPath: 'inset(0 0 0 0)' }))
  el.querySelectorAll('.cell-category').forEach(c => gsap.set(c, { clipPath: 'inset(-0.1em 0% -0.25em 0)' }))
  el.querySelectorAll('.cell-title').forEach(t => gsap.set(t, { clipPath: 'inset(-0.1em 0% -0.25em 0)' }))
  el.querySelectorAll('.cell-desc').forEach(d => gsap.set(d, { opacity: 1 }))
  el.querySelectorAll('.cell-index').forEach(n => gsap.set(n, { opacity: 1 }))
}

onMounted(() => {
  const el = section.value
  if (!el) return

  if (props.skip) { showFinalState(); return }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const tl = gsap.timeline({ defaults: { ease: 'power2.out' } })

          const gridCells = el.querySelectorAll('.grid-cell')
          tl.to(gridCells, {
            clipPath: 'inset(0 0 0 0)', duration: 0.15, stagger: 0.025,
          }, '-=0.15')

          const cats = el.querySelectorAll('.cell-category')
          tl.to(cats, {
            clipPath: 'inset(-0.1em 0% -0.25em 0)', duration: 0.2, stagger: 0.015, ease: 'steps(10)',
          }, '-=0.2')

          const titles = el.querySelectorAll('.cell-title')
          tl.to(titles, {
            clipPath: 'inset(-0.1em 0% -0.25em 0)', duration: 0.18, stagger: 0.02, ease: 'steps(20)',
          }, '-=0.15')

          const descs = el.querySelectorAll('.cell-desc')
          tl.to(descs, {
            opacity: 1, duration: 0.15, stagger: 0.015,
          }, '-=0.15')

          const indices = el.querySelectorAll('.cell-index')
          tl.to(indices, {
            opacity: 1, duration: 0.12, stagger: 0.03,
          }, '-=0.2')

          observer.disconnect()
        }
      })
    },
    { threshold: 0.1 }
  )
  observer.observe(el)
})
</script>

<template>
  <section ref="section" class="features-section">
    <div class="features-grid">
      <!-- Row 1 -->
      <div class="grid-row">
        <a
          v-for="cell in cells.slice(0, 3)"
          :key="cell.slug"
          :href="localePath(cell.to)"
          class="grid-cell"
          :class="{ 'grid-cell--accent grid-cta': cell.accent }"
          style="clip-path: inset(0 100% 0 0)"
          @click.prevent="navigateWithStripes(localePath(cell.to))"
        >
          <span v-if="cell.index" class="cell-index" style="opacity:0">{{ cell.index }}</span>
          <div class="cell-content">
            <span class="cell-category tw-hide">{{ cell.category }}</span>
            <p class="cell-title tw-hide">{{ cell.title }}</p>
            <p class="cell-desc" style="opacity:0">{{ cell.desc }}</p>
          </div>
          <span class="cell-arrow" aria-hidden="true">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M4 16L16 4M16 4H6M16 4V14" stroke="currentColor" stroke-width="1.5"/>
            </svg>
          </span>
        </a>
      </div>

      <!-- Row 2 -->
      <div class="grid-row">
        <a
          v-for="cell in cells.slice(3, 6)"
          :key="cell.slug"
          :href="localePath(cell.to)"
          class="grid-cell"
          :class="{ 'grid-cell--accent grid-cta': cell.accent }"
          style="clip-path: inset(0 100% 0 0)"
          @click.prevent="navigateWithStripes(localePath(cell.to))"
        >
          <span v-if="cell.index" class="cell-index" style="opacity:0">{{ cell.index }}</span>
          <div class="cell-content">
            <span class="cell-category tw-hide">{{ cell.category }}</span>
            <p class="cell-title tw-hide">{{ cell.title }}</p>
            <p class="cell-desc" style="opacity:0">{{ cell.desc }}</p>
          </div>
          <span class="cell-arrow" aria-hidden="true">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M4 16L16 4M16 4H6M16 4V14" stroke="currentColor" stroke-width="1.5"/>
            </svg>
          </span>
        </a>
      </div>
    </div>

  </section>
</template>

<style scoped>
.features-section {
  position: relative;
  background: var(--color-peach);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  border-top: 0.5px solid #24272e;
}

.tw-hide { clip-path: inset(-0.1em 100% -0.25em 0); }

/* ── Grid ── */
.features-grid {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.grid-row {
  display: flex;
  flex: 1;
}

/* ── Grid cells ── */
.grid-cell {
  position: relative;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 48px 56px;
  background: var(--color-peach);
  text-decoration: none;
  overflow: hidden;
  color: var(--color-dark);
  cursor: pointer;
  border-right: 0.5px solid #24272e;
  border-bottom: 0.5px solid #24272e;
}
.grid-cell:last-child {
  border-right: none;
}
.grid-row:last-child .grid-cell {
  border-bottom: none;
}

/* Accent cell (audit CTA) */
.grid-cell--accent {
  background: var(--color-accent);
}

.grid-cell::after {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background: var(--color-dark);
  transform: translate(-101%, 101%);
  transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
  z-index: 0;
}
.grid-cell:hover::after {
  transform: translate(0, 0);
}
.grid-cell:hover .cell-category {
  color: var(--color-cream);
}
.grid-cell:hover .cell-title {
  color: var(--color-accent);
}
.grid-cell:hover .cell-desc {
  color: rgba(255, 255, 255, 0.5);
}
.grid-cell:hover .cell-index {
  color: var(--color-cream);
}

.grid-cell:active {
  transform: scale(0.98);
  transition: transform 0.1s ease;
}

/* ── Index number ── */
.cell-index {
  position: absolute;
  top: 16px;
  left: 20px;
  font-family: var(--font);
  font-size: 13px;
  font-weight: 400;
  color: var(--color-muted);
  z-index: 1;
  transition: color 0.4s;
}

/* ── Content ── */
.cell-content {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.cell-category {
  font-family: var(--font);
  font-size: 11px;
  font-weight: 400;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  line-height: 1;
  color: var(--color-dark);
  transition: color 0.4s;
}
.grid-cell--accent .cell-category {
  color: var(--color-dark);
}

.cell-title {
  font-family: var(--font);
  font-size: clamp(28px, 3vw, 40px);
  font-weight: 600;
  line-height: 1.05;
  letter-spacing: -0.01em;
  color: var(--color-dark);
  margin: 0;
  transition: color 0.4s;
}

.cell-desc {
  font-family: var(--font);
  font-size: 15px;
  font-weight: 400;
  line-height: 1.5;
  color: var(--color-muted);
  margin: 0;
  max-width: 360px;
  transition: color 0.4s;
}
.grid-cell--accent .cell-desc {
  color: rgba(36, 39, 46, 0.6);
}

/* ── Arrow indicator ── */
.cell-arrow {
  position: absolute;
  bottom: 20px;
  right: 20px;
  z-index: 1;
  opacity: 0;
  transform: translate(-8px, 8px);
  transition: opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1),
              transform 0.4s cubic-bezier(0.16, 1, 0.3, 1),
              color 0.4s;
  color: var(--color-cream);
}
.grid-cell:hover .cell-arrow {
  opacity: 1;
  transform: translate(0, 0);
}

/* ── Responsive ── */
@media (max-width: 1024px) {
  .grid-row {
    flex-direction: column;
  }
  .grid-cell,
  .grid-cell:last-child,
  .grid-row:last-child .grid-cell {
    border: 0.5px solid #24272e;
    border-top: none;
    padding: 40px 32px;
    min-height: 220px;
  }
  .grid-row:first-child .grid-cell:first-child {
    border-top: 0.5px solid #24272e;
  }
  .grid-row:last-child .grid-cell:last-child {
    border-bottom: 0.5px solid #24272e;
  }
  .cell-title {
    font-size: clamp(24px, 5vw, 32px);
  }
}

@media (max-width: 768px) {
  .grid-cell {
    padding: 32px 24px;
    min-height: 180px;
  }
  .cell-title {
    font-size: clamp(22px, 6vw, 28px);
  }
  .cell-desc {
    font-size: 14px;
  }
}
</style>
