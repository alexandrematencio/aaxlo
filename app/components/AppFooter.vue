<script setup>
import { gsap } from 'gsap'

const props = defineProps({ skip: { type: Boolean, default: false } })
const footer = ref(null)

onMounted(() => {
  const el = footer.value
  if (!el) return

  if (props.skip) {
    const logo = el.querySelector('.footer-logo')
    if (logo) gsap.set(logo, { clipPath: 'inset(-0.1em 0% -0.25em 0)', opacity: 1 })
    const tag = el.querySelector('.footer-tagline')
    if (tag) gsap.set(tag, { clipPath: 'inset(-0.1em 0% -0.25em 0)' })
    el.querySelectorAll('.footer-contact > *').forEach(c => gsap.set(c, { clipPath: 'inset(-0.1em 0% -0.25em 0)' }))
    el.querySelectorAll('.footer-col').forEach(c => gsap.set(c, { clipPath: 'inset(-0.1em 0% -0.25em 0)' }))
    const bottom = el.querySelector('.footer-bottom')
    if (bottom) gsap.set(bottom, { opacity: 1 })
    return
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const tl = gsap.timeline({ defaults: { ease: 'power2.out' } })

          // 1. Logo reveal
          tl.to(el.querySelector('.footer-logo'), {
            clipPath: 'inset(-0.1em 0% -0.25em 0)',
            opacity: 1,
            duration: 0.3,
          }, '-=0.1')

          // 3. Tagline typewriter
          tl.to(el.querySelector('.footer-tagline'), {
            clipPath: 'inset(-0.1em 0% -0.25em 0)',
            duration: 0.35,
            ease: 'steps(30)',
          }, '-=0.15')

          // 4. Contact info stagger
          const contacts = el.querySelectorAll('.footer-contact > *')
          tl.to(contacts, {
            clipPath: 'inset(-0.1em 0% -0.25em 0)',
            duration: 0.2,
            stagger: 0.06,
            ease: 'steps(12)',
          }, '-=0.15')

          // 5. Nav columns stagger
          const cols = el.querySelectorAll('.footer-col')
          tl.to(cols, {
            clipPath: 'inset(-0.1em 0% -0.25em 0)',
            duration: 0.3,
            stagger: 0.06,
          }, '-=0.2')

          // 6. Bottom row fade
          tl.to(el.querySelector('.footer-bottom'), {
            opacity: 1,
            duration: 0.4,
          }, '-=0.15')

          observer.disconnect()
        }
      })
    },
    { threshold: 0.15 }
  )
  observer.observe(el)
})
</script>

<template>
  <footer ref="footer" class="footer">
    <div class="footer-inner">
      <!-- Left: Logo + tagline + contact -->
      <div class="footer-brand">
        <img
          src="/images/axxlo-logo.svg"
          alt="AAXLO"
          class="footer-logo tw-hide"
        />
        <div class="footer-info">
          <p class="footer-tagline tw-hide">
            Your local business, amplified by AI.
          </p>
          <div class="footer-contact">
            <a href="mailto:hi@axxlo.com" class="footer-email tw-hide">hi@axxlo.com</a>
            <span class="footer-location tw-hide">Based in Singapore</span>
          </div>
        </div>
      </div>

      <!-- Right: 4 nav columns -->
      <div class="footer-nav">
        <!-- Services -->
        <div class="footer-col tw-hide">
          <h4 class="footer-col-title">Services</h4>
          <ul class="footer-links">
            <li><NuxtLink to="/services/visibility">Visibility</NuxtLink></li>
            <li><NuxtLink to="/services/web">Web</NuxtLink></li>
            <li><NuxtLink to="/services/content">Content</NuxtLink></li>
            <li><NuxtLink to="/services/automation">Automation</NuxtLink></li>
            <li><NuxtLink to="/services/consulting">Consulting</NuxtLink></li>
          </ul>
        </div>

        <!-- About / Resources -->
        <div class="footer-col tw-hide">
          <h4 class="footer-col-title">About</h4>
          <ul class="footer-links">
            <li><NuxtLink to="/about">Who we are</NuxtLink></li>
          </ul>
          <h4 class="footer-col-title footer-col-title--spaced">Resources</h4>
          <ul class="footer-links">
            <li><NuxtLink to="/blog">Blog</NuxtLink></li>
          </ul>
        </div>

        <!-- Legal -->
        <div class="footer-col tw-hide">
          <h4 class="footer-col-title">Legal</h4>
          <ul class="footer-links">
            <li><NuxtLink to="/legal/privacy">Privacy policy</NuxtLink></li>
            <li><NuxtLink to="/legal/terms">Terms of service</NuxtLink></li>
            <li><NuxtLink to="/legal/mentions">Mentions l&eacute;gales</NuxtLink></li>
          </ul>
        </div>

        <!-- Contact -->
        <div class="footer-col tw-hide">
          <h4 class="footer-col-title">Contact</h4>
          <ul class="footer-links">
            <li><a href="mailto:hi@axxlo.com">Email: hi@axxlo.com</a></li>
            <li><a href="https://cal.com/aaxlo" target="_blank" rel="noopener">Book a call</a></li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Bottom row -->
    <div class="footer-bottom">
      <span class="footer-copyright">&copy; 2026 AAXLO Pte. Ltd.</span>
      <div class="footer-lang">
        <NuxtLink to="/" class="footer-lang-link footer-lang-link--active">EN</NuxtLink>
        <span class="footer-lang-sep">/</span>
        <NuxtLink to="/fr" class="footer-lang-link">FR</NuxtLink>
      </div>
    </div>
  </footer>
</template>

<style scoped>
/* ── TYPEWRITER HIDE ──────────── */
.tw-hide {
  clip-path: inset(-0.1em 100% -0.25em 0);
}

/* ── FOOTER ───────────────────── */
.footer {
  position: relative;
  background: var(--color-dark);
  padding: 96px;
  border-top: 0.5px solid #24272e;
}

.footer-inner {
  display: flex;
  gap: 64px;
  justify-content: space-between;
  align-items: flex-start;
}

/* ── BRAND ────────────────────── */
.footer-brand {
  display: flex;
  flex-direction: column;
  gap: 16px;
  flex-shrink: 0;
  max-width: 320px;
}

.footer-logo {
  width: 100px;
  height: auto;
  opacity: 0;
  clip-path: inset(-0.1em 100% -0.25em 0);
  filter: brightness(0) invert(1);
}

.footer-info {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.footer-tagline {
  font-family: var(--font);
  font-size: 16px;
  font-weight: 300;
  color: rgba(238, 238, 238, 0.66);
  line-height: 1.4;
}

.footer-contact {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.footer-email {
  font-family: var(--font);
  font-size: 16px;
  font-weight: 300;
  color: #ffffff;
  line-height: 1;
  position: relative;
  display: inline-block;
  width: fit-content;
}
.footer-email::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 100%;
  height: 1px;
  background: var(--color-accent);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
.footer-email:hover::after {
  transform: scaleX(1);
}

.footer-location {
  font-family: var(--font);
  font-size: 16px;
  font-weight: 300;
  color: var(--color-muted);
  line-height: 1;
}

/* ── NAV COLUMNS ──────────────── */
.footer-nav {
  display: flex;
  gap: 48px;
  align-items: flex-start;
}

.footer-col {
  display: flex;
  flex-direction: column;
  gap: 24px;
  min-width: 120px;
}

.footer-col-title {
  font-family: var(--font);
  font-size: 14px;
  font-weight: 500;
  color: var(--color-white);
  line-height: 1;
  letter-spacing: 0.5px;
  text-transform: uppercase;
}

.footer-col-title--spaced {
  margin-top: 16px;
}

.footer-links {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.footer-links a {
  font-family: var(--font);
  font-size: 15px;
  font-weight: 300;
  color: rgba(238, 238, 238, 0.66);
  line-height: 1;
  transition: color 0.3s, transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  display: inline-block;
}
.footer-links a:hover {
  color: #ffffff;
  transform: translateX(4px);
}

/* ── BOTTOM ROW ───────────────── */
.footer-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 64px;
  padding-top: 32px;
  border-top: 0.5px solid #24272e;
  opacity: 0;
}

.footer-copyright {
  font-family: var(--font);
  font-size: 14px;
  font-weight: 300;
  color: var(--color-muted);
  line-height: 1;
}

.footer-lang {
  display: flex;
  align-items: center;
  gap: 6px;
  font-family: var(--font);
  font-size: 14px;
  font-weight: 300;
  color: var(--color-muted);
}

.footer-lang-link {
  color: var(--color-muted);
  transition: color 0.3s;
}
.footer-lang-link:hover,
.footer-lang-link--active {
  color: #ffffff;
}

.footer-lang-sep {
  color: var(--color-muted);
  user-select: none;
}

/* ── RESPONSIVE ───────────────── */
@media (max-width: 1024px) {
  .footer {
    padding: 64px 48px;
  }
  .footer-inner {
    flex-direction: column;
    gap: 48px;
  }
  .footer-nav {
    flex-wrap: wrap;
    gap: 32px;
  }
}

@media (max-width: 640px) {
  .footer {
    padding: 48px 24px;
  }
  .footer-nav {
    flex-direction: column;
    gap: 32px;
  }
  .footer-bottom {
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
  }
}
</style>
