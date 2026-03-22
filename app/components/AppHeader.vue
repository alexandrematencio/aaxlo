<script setup>
import { gsap } from 'gsap'

const header = ref(null)
const dropdownOpen = ref(false)
const mobileOpen = ref(false)
const lang = ref('EN')

// Check if splash screen is playing — if so, delay header animation
const splashPlayed = useState('splashPlayed', () => false)

let dropdownTimeout = null

const services = [
  { label: 'Visibility', desc: 'GBP, local SEO & directories', to: '/services/visibility' },
  { label: 'Web', desc: 'Websites, menus & booking', to: '/services/web' },
  { label: 'Content', desc: 'Social media & brand identity', to: '/services/content' },
  { label: 'Automation', desc: 'Chatbots, reviews & messaging', to: '/services/automation' },
  { label: 'Consulting', desc: 'Custom AI workflows & training', to: '/services/consulting' },
]

function toggleLang() {
  lang.value = lang.value === 'EN' ? 'FR' : 'EN'
}

function openDropdown() {
  clearTimeout(dropdownTimeout)
  dropdownOpen.value = true
}

function closeDropdown() {
  dropdownTimeout = setTimeout(() => {
    dropdownOpen.value = false
  }, 120)
}

function toggleMobile() {
  mobileOpen.value = !mobileOpen.value
  if (mobileOpen.value) {
    document.body.style.overflow = 'hidden'
    nextTick(() => {
      const overlay = header.value?.querySelector('.mobile-overlay')
      if (!overlay) return
      const tl = gsap.timeline({ defaults: { ease: 'power2.out' } })
      tl.fromTo(overlay, { clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)', duration: 0.4 })
      const items = overlay.querySelectorAll('.mobile-nav-item')
      tl.fromTo(items, { clipPath: 'inset(-0.1em 100% -0.25em 0)' }, { clipPath: 'inset(-0.1em 0% -0.25em 0)', duration: 0.25, stagger: 0.06, ease: 'steps(10)' }, '-=0.15')
      const cta = overlay.querySelector('.mobile-cta')
      if (cta) tl.fromTo(cta, { clipPath: 'inset(-0.1em 100% -0.25em 0)' }, { clipPath: 'inset(-0.1em 0% -0.25em 0)', duration: 0.3 }, '-=0.1')
    })
  } else {
    document.body.style.overflow = ''
  }
}

function closeMobile() {
  mobileOpen.value = false
  document.body.style.overflow = ''
}

function runHeaderReveal() {
  const el = header.value
  if (!el) return

  const tl = gsap.timeline({ defaults: { ease: 'power2.inOut' } })

  // 1. Draw-line border bottom
  tl.to(el.querySelector('.draw-h'), {
    scaleX: 1, duration: 0.35,
  })

  // 2. Logo clip-path reveal (skip if splash just landed the logo there)
  const logo = el.querySelector('.header-logo')
  if (logo) {
    tl.to(logo, {
      clipPath: 'inset(-0.1em 0% -0.25em 0)', duration: 0.3, ease: 'power2.out',
    }, '-=0.15')
  }

  // 3. Nav items stagger reveal
  const navItems = el.querySelectorAll('.nav-link')
  tl.to(navItems, {
    clipPath: 'inset(-0.1em 0% -0.25em 0)', duration: 0.25, stagger: 0.06, ease: 'steps(10)',
  }, '-=0.1')

  // 4. CTA reveal
  tl.to(el.querySelector('.header-cta'), {
    clipPath: 'inset(-0.1em 0% -0.25em 0)', duration: 0.3, ease: 'power2.out',
  }, '-=0.1')

  // 5. Lang switcher reveal
  tl.to(el.querySelector('.lang-toggle'), {
    clipPath: 'inset(-0.1em 0% -0.25em 0)', duration: 0.2, ease: 'power2.out',
  }, '-=0.15')
}

onMounted(() => {
  const route = useRoute()
  const isHomepage = route.path === '/'

  if (!isHomepage || splashPlayed.value) {
    // Non-homepage or splash already done — reveal immediately
    runHeaderReveal()
  } else {
    // Homepage with splash playing — wait for it to complete, then reveal header
    // The header logo stays hidden (tw-hide) while splash logo flies to its position
    const unwatch = watch(splashPlayed, (played) => {
      if (played) {
        // Splash just finished — logo already appears to be in place
        // Show the real header logo instantly, then animate the rest
        const el = header.value
        if (el) {
          const logo = el.querySelector('.header-logo')
          if (logo) gsap.set(logo, { clipPath: 'inset(-0.1em 0% -0.25em 0)' })
        }
        runHeaderReveal()
        unwatch()
      }
    })
  }
})

onUnmounted(() => {
  document.body.style.overflow = ''
})
</script>

<template>
  <header ref="header" class="header">
    <div class="header-inner">
      <!-- Logo -->
      <NuxtLink to="/" class="header-logo tw-hide" aria-label="AAXLO home">
        <img src="/images/axxlo-logo.svg" alt="AAXLO" class="logo-img" />
      </NuxtLink>

      <!-- Desktop Nav -->
      <nav class="header-nav">
        <div
          class="nav-link-wrap services-trigger"
          @mouseenter="openDropdown"
          @mouseleave="closeDropdown"
        >
          <NuxtLink to="/services" class="nav-link tw-hide">
            Services
            <svg class="chevron" :class="{ open: dropdownOpen }" width="10" height="6" viewBox="0 0 10 6" fill="none">
              <path d="M1 1L5 5L9 1" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </NuxtLink>

          <!-- Dropdown -->
          <Transition name="dropdown">
            <div v-if="dropdownOpen" class="dropdown" @mouseenter="openDropdown" @mouseleave="closeDropdown">
              <div class="dropdown-inner">
                <NuxtLink
                  v-for="s in services"
                  :key="s.label"
                  :to="s.to"
                  class="dropdown-item"
                  @click="dropdownOpen = false"
                >
                  <span class="dropdown-label">{{ s.label }}</span>
                  <span class="dropdown-desc">{{ s.desc }}</span>
                </NuxtLink>
              </div>
            </div>
          </Transition>
        </div>

        <NuxtLink to="/about" class="nav-link tw-hide">About</NuxtLink>
        <NuxtLink to="/blog" class="nav-link tw-hide">Blog</NuxtLink>
      </nav>

      <!-- Mobile CTA (between logo and burger) -->
      <NuxtLink to="/audit" class="mobile-header-cta">
        <span class="mobile-header-cta-label">Free Audit</span>
        <span class="mobile-header-cta-wipe" aria-hidden="true"></span>
      </NuxtLink>

      <!-- Right side -->
      <div class="header-right">
        <button class="lang-toggle tw-hide" @click="toggleLang" :aria-label="`Switch language to ${lang === 'EN' ? 'French' : 'English'}`">
          {{ lang }}
        </button>

        <NuxtLink to="/audit" class="header-cta tw-hide">
          <span class="cta-label">Get your free audit</span>
          <span class="cta-wipe" aria-hidden="true"></span>
        </NuxtLink>

        <!-- Hamburger -->
        <button class="hamburger" :class="{ active: mobileOpen }" @click="toggleMobile" aria-label="Menu">
          <span class="hamburger-line"></span>
          <span class="hamburger-line"></span>
        </button>
      </div>
    </div>

    <!-- Draw-line bottom border -->
    <span class="draw-h" aria-hidden="true"></span>

    <!-- Mobile overlay -->
    <Teleport to="body">
      <div v-if="mobileOpen" class="mobile-overlay" @click.self="closeMobile">
        <nav class="mobile-nav">
          <NuxtLink to="/services" class="mobile-nav-item" @click="closeMobile">Services</NuxtLink>
          <NuxtLink v-for="s in services" :key="s.label" :to="s.to" class="mobile-nav-item mobile-sub" @click="closeMobile">
            {{ s.label }}
            <span class="mobile-sub-desc">{{ s.desc }}</span>
          </NuxtLink>
          <NuxtLink to="/about" class="mobile-nav-item" @click="closeMobile">About</NuxtLink>
          <NuxtLink to="/blog" class="mobile-nav-item" @click="closeMobile">Blog</NuxtLink>

          <div class="mobile-bottom">
            <NuxtLink to="/contact" class="mobile-cta" @click="closeMobile">Get your free audit</NuxtLink>
            <button class="mobile-lang" @click="toggleLang">{{ lang === 'EN' ? 'FR' : 'EN' }}</button>
          </div>
        </nav>
      </div>
    </Teleport>
  </header>
</template>

<style scoped>
/* ─── Layout ─── */
.header {
  position: sticky;
  top: 0;
  z-index: 900;
  background: var(--color-white, #fcfcfc);
  font-family: var(--font, 'Switzer', sans-serif);
}

.header-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1320px;
  margin: 0 auto;
  padding: 0;
  height: 64px;
}

/* ─── Draw line ─── */
.draw-h {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 0.5px;
  background: var(--color-dark, #24272e);
  transform-origin: left center;
  transform: scaleX(0);
}

/* ─── Typewriter / clip hide ─── */
.tw-hide {
  clip-path: inset(-0.1em 100% -0.25em 0);
}

/* ─── Logo ─── */
.header-logo {
  display: flex;
  align-items: center;
  text-decoration: none;
  flex-shrink: 0;
  padding: 0 clamp(20px, 4vw, 48px);
  height: 100%;
  border-right: 0.5px solid #24272e;
}

.logo-img {
  height: 28px;
  width: auto;
  display: block;
}

/* ─── Nav ─── */
.header-nav {
  display: flex;
  align-items: center;
  gap: 0;
  height: 100%;
  flex: 1;
}

.nav-link-wrap {
  position: relative;
  height: 100%;
}

.nav-link {
  font-size: 14px;
  font-weight: 300;
  color: var(--color-dark, #24272e);
  text-decoration: none;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 0 24px;
  height: 100%;
  border-right: 0.5px solid #24272e;
  transition: color 0.2s;
}

.nav-link:hover {
  color: var(--color-accent, #ff8270);
}

.chevron {
  transition: transform 0.25s ease;
  margin-top: 1px;
}

.chevron.open {
  transform: rotate(180deg);
}

/* ─── Dropdown ─── */
.dropdown {
  position: absolute;
  top: 100%;
  left: -0.5px;
  width: 280px;
  background: var(--color-white, #fcfcfc);
  border: 0.5px solid #24272e;
  border-top: none;
  z-index: 910;
}

.dropdown-inner {
  display: flex;
  flex-direction: column;
}

.dropdown-item {
  display: flex;
  flex-direction: column;
  gap: 3px;
  padding: 14px 20px;
  text-decoration: none;
  color: var(--color-dark, #24272e);
  border-bottom: 0.5px solid #24272e;
  transition: background 0.2s;
}

.dropdown-item:last-child {
  border-bottom: none;
}

.dropdown-item:hover {
  background: var(--color-cream, #fff1ef);
}

.dropdown-label {
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0.01em;
}

.dropdown-desc {
  font-size: 12px;
  color: var(--color-muted, #6e7381);
  line-height: 1.4;
}

/* Dropdown transition */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: clip-path 0.25s ease, opacity 0.25s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  clip-path: inset(0 0 100% 0);
  opacity: 0;
}

.dropdown-enter-to,
.dropdown-leave-from {
  clip-path: inset(0 0 0% 0);
  opacity: 1;
}

/* ─── Right side ─── */
.header-right {
  display: flex;
  align-items: center;
  gap: 0;
  flex-shrink: 0;
  height: 100%;
}

/* ─── Language toggle ─── */
.lang-toggle {
  font-family: var(--font, 'Switzer', sans-serif);
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.06em;
  color: var(--color-muted, #6e7381);
  background: none;
  border: none;
  border-left: 0.5px solid #24272e;
  padding: 0 20px;
  height: 100%;
  cursor: pointer;
  transition: color 0.2s;
}

.lang-toggle:hover {
  color: var(--color-dark, #24272e);
}

/* ─── CTA button ─── */
.header-cta {
  position: relative;
  display: inline-flex;
  align-items: center;
  padding: 0 28px;
  height: 100%;
  font-family: var(--font, 'Switzer', sans-serif);
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: var(--color-dark, #24272e);
  background: #FF8270;
  border-left: 0.5px solid #24272e;
  text-decoration: none;
  overflow: hidden;
  transition: color 0.4s;
  cursor: pointer;
}

.header-cta:hover {
  color: var(--color-cream, #fff1ef);
}

.cta-label {
  position: relative;
  z-index: 2;
}

.cta-wipe {
  position: absolute;
  inset: 0;
  background: var(--color-dark, #24272e);
  transform: translate(-101%, 101%);
  transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
  z-index: 1;
}

.header-cta:hover .cta-wipe {
  transform: translate(0, 0);
}

/* ─── Hamburger ─── */
.hamburger {
  display: none;
  flex-direction: column;
  justify-content: center;
  gap: 6px;
  width: 64px;
  height: 100%;
  background: none;
  border: none;
  border-left: 0.5px solid #24272e;
  cursor: pointer;
  padding: 4px 16px;
}

.hamburger-line {
  display: block;
  width: 100%;
  height: 1.5px;
  background: var(--color-dark, #24272e);
  transition: transform 0.3s, opacity 0.3s;
  transform-origin: center;
}

.hamburger.active .hamburger-line:first-child {
  transform: translateY(3.75px) rotate(45deg);
}

.hamburger.active .hamburger-line:last-child {
  transform: translateY(-3.75px) rotate(-45deg);
}

/* ─── Mobile overlay ─── */
.mobile-overlay {
  position: fixed;
  inset: 0;
  top: 64px;
  z-index: 899;
  background: var(--color-white, #fcfcfc);
  overflow-y: auto;
  border-top: 0.5px solid #24272e;
}

.mobile-nav {
  display: flex;
  flex-direction: column;
  padding: 0;
}

.mobile-nav-item {
  display: block;
  padding: 16px 24px;
  font-size: 16px;
  font-weight: 300;
  color: var(--color-dark, #24272e);
  text-decoration: none;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border: 0.5px solid #24272e;
  border-top: none;
}

.mobile-nav-item:first-child {
  border-top: none;
}

.mobile-nav-item.mobile-sub {
  font-size: 14px;
  font-weight: 300;
  padding-left: 40px;
  display: flex;
  flex-direction: column;
  gap: 2px;
  background: var(--color-cream, #fff1ef);
}

.mobile-sub-desc {
  font-size: 12px;
  font-weight: 300;
  color: var(--color-muted, #6e7381);
  text-transform: none;
  letter-spacing: 0;
}

.mobile-bottom {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.mobile-cta {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 16px 28px;
  font-family: var(--font, 'Switzer', sans-serif);
  font-size: 14px;
  font-weight: 600;
  color: var(--color-dark, #24272e);
  background: #FF8270;
  border: 0.5px solid #24272e;
  border-top: none;
  text-decoration: none;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.mobile-lang {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  font-family: var(--font, 'Switzer', sans-serif);
  font-size: 12px;
  font-weight: 300;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: var(--color-muted, #6e7381);
  background: none;
  border: 0.5px solid #24272e;
  border-top: none;
  padding: 12px 14px;
  cursor: pointer;
}

/* ─── Mobile header CTA ─── */
.mobile-header-cta {
  display: none;
  position: relative;
  align-items: center;
  justify-content: center;
  margin: 10px;
  padding: 0;
  height: calc(100% - 20px);
  flex: 1;
  border-radius: 0;
  border: 0.5px solid #24272e;
  font-family: var(--font, 'Switzer', sans-serif);
  font-size: clamp(10px, 3vw, 14px);
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  white-space: nowrap;
  color: #24272e;
  background: #FF8270;
  text-decoration: none;
  overflow: hidden;
  transition: color 0.4s;
  cursor: pointer;
}

.mobile-header-cta:hover {
  color: var(--color-cream, #fff1ef);
}

.mobile-header-cta-label {
  position: relative;
  z-index: 2;
}

.mobile-header-cta-wipe {
  position: absolute;
  inset: 0;
  background: var(--color-dark, #24272e);
  transform: translate(-101%, 101%);
  transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
  z-index: 1;
}

.mobile-header-cta:hover .mobile-header-cta-wipe {
  transform: translate(0, 0);
}

/* ─── Responsive ─── */
@media (max-width: 860px) {
  .draw-h {
    transform: scaleX(1);
  }
  .header-nav,
  .header-cta,
  .lang-toggle {
    display: none;
  }

  .hamburger {
    display: flex;
  }

  .mobile-header-cta {
    display: inline-flex;
  }
}

@media (min-width: 861px) {
  .mobile-overlay {
    display: none;
  }
}
</style>
