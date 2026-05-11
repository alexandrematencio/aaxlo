<script setup>
import { gsap } from 'gsap'

const props = defineProps({
  content: { type: Object, default: null },
  skip: { type: Boolean, default: false },
})

const section = ref(null)
useShineHover(section, '.checklist-cta')
const { navigateWithStripes } = useStripeTransition()
const localePath = useLocalePath()
const { t } = useI18n()

const statements = computed(() => props.content?.statements || [])
const checked = ref([false, false, false, false, false, false])

function toggleCard(index) {
  checked.value[index] = !checked.value[index]

  // Animate the fix cell if opening
  if (checked.value[index]) {
    nextTick(() => {
      const el = section.value
      if (!el) return
      const fixCells = el.querySelectorAll('.card-fix')
      const fixCell = fixCells[index]
      if (fixCell) {
        gsap.from(fixCell, {
          clipPath: 'inset(0 0 100% 0)',
          duration: 0.3,
          ease: 'power2.out',
        })
      }
    })
  }
}

const hasAnyChecked = computed(() => checked.value.some(Boolean))

function showFinalState() {
  const el = section.value
  if (!el) return

  const headline = el.querySelector('.checklist-headline')
  if (headline) gsap.set(headline, { clipPath: 'inset(-0.1em 0% -0.25em 0)' })
  el.querySelectorAll('.checklist-card').forEach(c => {
    gsap.set(c, { opacity: 1, y: 0, scale: 1 })
  })
  el.querySelectorAll('.checklist-check').forEach(c => {
    gsap.set(c, { opacity: 1, y: 0 })
  })
}

onMounted(() => {
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

          /* Headline typewriter */
          tl.to(el.querySelector('.checklist-headline'), {
            clipPath: 'inset(-0.1em 0% -0.25em 0)', duration: 0.12, ease: 'steps(30)',
          }, '-=0.1')

          /* Cards fade in */
          const cards = el.querySelectorAll('.checklist-card')
          tl.to(cards, {
            opacity: 1, y: 0, duration: 0.18, stagger: 0.03,
          }, '+=0.04')

          observer.disconnect()

          /* Checkbox boxes — scroll-driven bomber drop, one per scroll step */
          const checks = Array.from(el.querySelectorAll('.checklist-check'))
          const revealed = new Set()
          checks.forEach(check => gsap.set(check, { opacity: 0, y: -40 }))

          function dropCheck(check) {
            gsap.to(check, {
              opacity: 1, y: 0,
              duration: 0.25,
              ease: 'power3.in',
              onComplete: () => {
                gsap.to(check, {
                  y: 2, duration: 0.05, ease: 'power1.in',
                  onComplete: () => {
                    gsap.to(check, { y: 0, duration: 0.12, ease: 'elastic.out(1, 0.45)' })
                  },
                })
              },
            })
          }

          function onScroll() {
            if (revealed.size >= checks.length) {
              window.removeEventListener('scroll', onScroll)
              return
            }

            const sectionRect = el.getBoundingClientRect()
            const vh = window.innerHeight

            // Map scroll progress through the section to checkbox index
            // Start revealing when section is 70% visible, finish when 30% from top
            const scrollStart = vh * 0.7
            const scrollEnd = vh * 0.1
            const progress = (scrollStart - sectionRect.top) / (scrollStart - scrollEnd)
            const clamped = Math.max(0, Math.min(1, progress))

            // How many should be revealed at this scroll position
            const targetCount = Math.floor(clamped * checks.length)

            // Reveal any new ones
            for (let i = 0; i < targetCount; i++) {
              if (!revealed.has(i)) {
                revealed.add(i)
                dropCheck(checks[i])
              }
            }
          }

          window.addEventListener('scroll', onScroll, { passive: true })
          // Check initial position in case already scrolled
          onScroll()
        }
      })
    },
    { threshold: 0.15 }
  )
  observer.observe(el)
})
</script>

<template>
  <section ref="section" class="home-checklist">
    <div class="checklist-container">
      <div class="checklist-cell">
        <h2 class="checklist-headline tw-hide">
          {{ content?.headline }}
        </h2>
      </div>

      <div class="checklist-cards">
        <div v-for="(statement, i) in statements" :key="i" class="card-group">
          <button
            class="checklist-card"
            :class="{ 'checklist-card--checked': checked[i] }"
            style="opacity: 0; transform: translateY(8px)"
            @click="toggleCard(i)"
          >
            <span class="checklist-check" aria-hidden="true">
              <svg v-if="checked[i]" width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 8.5L6.5 12L13 4" stroke="var(--color-accent)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </span>
            <span class="checklist-text">{{ statement.text }}</span>
          </button>

          <!-- Fix suggestion cell — appears when checked -->
          <div v-if="checked[i]" class="card-fix">
            <span class="fix-service">{{ statement.service }}</span>
            <p class="fix-text">{{ statement.fix }}</p>
            <a
              :href="localePath(statement.link)"
              class="fix-link"
              @click.prevent="navigateWithStripes(localePath(statement.link))"
            >
              {{ statement.service === 'Free Audit' ? $t('common.getAudit') : $t('common.learnMore') }}
            </a>
          </div>
        </div>
      </div>

      <!-- Bottom CTA — appears when any checkbox is checked -->
      <div v-if="hasAnyChecked" class="checklist-bottom">
        <div class="checklist-cell">
          <p class="checklist-summary">
            {{ content?.summary }}
          </p>
        </div>
        <a
          :href="localePath('/audit')"
          class="checklist-cta"
          data-umami-event="audit-cta-click"
          data-umami-event-location="checklist"
          @click.prevent="navigateWithStripes(localePath('/audit'))"
        >
          {{ $t('common.getAudit') }}
        </a>
      </div>
    </div>

  </section>
</template>

<style scoped>
.home-checklist {
  position: relative;
  background: var(--color-white);
  padding: 120px clamp(32px, 6vw, 96px);
  border-top: 0.5px solid #24272e;
  display: flex;
  justify-content: center;
}

.tw-hide {
  clip-path: inset(-0.1em 100% -0.25em 0);
}

.checklist-container {
  max-width: 700px;
  width: 100%;
  display: flex;
  flex-direction: column;
}

.checklist-cell {
  border: 0.5px solid #24272e;
  border-top: none;
  padding: 16px;
}
.checklist-cell:first-child {
  border-top: 0.5px solid #24272e;
}

.checklist-headline {
  font-family: var(--font);
  font-size: clamp(28px, 4vw, 44px);
  font-weight: 600;
  color: var(--color-dark);
  line-height: 1.15;
  letter-spacing: -0.02em;
  margin: 0;
}

/* ── Card grid ── */
.checklist-cards {
  display: flex;
  flex-direction: column;
}

.card-group {
  display: flex;
  flex-direction: column;
}

.checklist-card {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 14px 16px;
  border: 0.5px solid #24272e;
  border-top: none;
  background: transparent;
  cursor: pointer;
  text-align: left;
  font-family: var(--font);
  font-size: 16px;
  font-weight: 300;
  color: var(--color-dark);
  line-height: 1.5;
  transition: background 0.25s;
}

.card-group:first-child .checklist-card {
  border-top: none; /* headline cell above handles top border */
}

.checklist-card:hover {
  background: rgba(36, 39, 46, 0.03);
}

.checklist-card--checked,
.checklist-card--checked:hover {
  background: var(--color-cream);
}

.checklist-check {
  flex-shrink: 0;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 2px;
  border: 0.5px solid #24272e;
  will-change: transform, opacity;
}

.checklist-text {
  flex: 1;
}

/* ── Fix suggestion cell ── */
.card-fix {
  border: 0.5px solid #24272e;
  border-top: none;
  padding: 16px 16px 16px 52px; /* 48px left = aligns with text after checkbox */
  background: var(--color-cream);
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.fix-service {
  font-family: var(--font);
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--color-accent);
}

.fix-text {
  font-family: var(--font);
  font-size: 15px;
  font-weight: 300;
  color: var(--color-dark);
  line-height: 1.5;
  margin: 0;
}

.fix-link {
  display: inline-block;
  font-family: var(--font);
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: var(--color-accent);
  text-decoration: none;
  margin-top: 4px;
  transition: color 0.2s;
}
.fix-link:hover {
  color: var(--color-dark);
}

/* ── Bottom CTA section ── */
.checklist-bottom {
  display: flex;
  flex-direction: column;
  margin-top: 0;
}

.checklist-summary {
  font-family: var(--font);
  font-size: 18px;
  font-weight: 300;
  color: var(--color-dark);
  line-height: 1.5;
  margin: 0;
}

.checklist-cta {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  font-family: var(--font);
  font-size: 16px;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  padding: 16px 40px;
  background: #FF8270;
  color: var(--color-dark);
  text-decoration: none;
  border: 0.5px solid #24272e;
  border-top: none;
  border-radius: 0;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  z-index: 1;
  transition: color 0.4s;
}
/* Shine hover — handled by useShineHover composable */

@media (max-width: 768px) {
  .home-checklist {
    padding: 80px 20px;
  }
  .checklist-headline {
    font-size: clamp(24px, 6vw, 32px);
  }
  .checklist-card {
    padding: 12px 10px;
    font-size: 15px;
  }
  .card-fix {
    padding: 10px 10px 10px 38px;
  }
  .fix-text {
    font-size: 14px;
  }
  .checklist-cta {
    padding: 14px 32px;
    font-size: 14px;
  }
  .checklist-cell {
    padding: 10px;
  }
}
</style>
