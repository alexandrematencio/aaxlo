<script setup>
/**
 * SplashScreenV4 — « LA FORGE »
 *
 * Premier splash INTERACTIF : le visiteur forge le logo lui-même.
 * Une barre rectangulaire brute (le lingot, #24272E, empreinte exacte du logo
 * 0→176 × 0→37) est découpée en 5 blocs contigus — ensemble un rectangle
 * parfait, sans trous. Le scroll (virtuel : la page ne bouge pas) scrubbe une
 * timeline GSAP où chaque bloc morphe en sa lettre via MorphSVG :
 * A1 → A2 → X → L → O. Scroll up = les lettres refondent en barre.
 *
 *  PHASE 0 — INTRO (~0.45s auto) : le lingot se révèle par wipe horizontal
 *            depuis le centre. Hint « Scrollez pour forger » + chevron,
 *            readout mono « FORGE — 0% » (continuité avec le viseur V3).
 *  PHASE 1 — FORMATION (scrub réversible) : budget ~960px de scroll → progress
 *            0→1 lissé par lerp dans gsap.ticker. 5 segments qui se chevauchent.
 *            Le contre-poinçon blanc du O scale-in en fin de course (un rect ne
 *            peut pas morpher vers 2 paths). Idle 2.5s → autoplay vers 1 ;
 *            toute interaction reprend la main.
 *  PHASE 2 — ENDGAME (auto, point de non-retour à progress=1) : identique à
 *            l'original — le O morphe en disque parfait, les 10 stripes
 *            découpent, rotation -45°, glyph orange #FF8270, collapse vers le
 *            header, reveal de la page.
 *
 * Géométrie 100% identique à l'original : viewBox "0 0 177 37", mêmes paths
 * de lettres, mêmes 10 stripes, même clip circulaire, même glyph.
 */
import { gsap } from 'gsap'
import { MorphSVGPlugin } from 'gsap/MorphSVGPlugin'
import { prefersReducedMotion } from '~/composables/usePrefersReducedMotion'

gsap.registerPlugin(MorphSVGPlugin)

const emit = defineEmits(['reveal', 'complete'])
const { t } = useI18n()

// ── Refs ──
const splash = ref(null)
const skipBtn = ref(null)
const logoGroup = ref(null)
const logoSvg = ref(null)
const block1 = ref(null)
const block2 = ref(null)
const block3 = ref(null)
const block4 = ref(null)
const block5 = ref(null)
const oInner = ref(null)
const morphGroup = ref(null)
const solidDisk = ref(null)
const glyphGroup = ref(null)
const hintEl = ref(null)
const readoutEl = ref(null)

// ── State ──
let ftl = null          // formation timeline (paused, scrubbed)
let endTl = null        // endgame timeline (autoplay)
let introTl = null
let autoTween = null    // idle autoplay tween on input.t
let idleTimer = null
let tickerFn = null
let finished = false
let endgameStarted = false
let hintHidden = false
const input = { t: 0 }  // target progress (0–1), driven by wheel/touch/keys
let current = 0         // lerped progress applied to ftl

const SCROLL_BUDGET = 960 // px of accumulated delta for full formation

const clamp01 = v => Math.min(1, Math.max(0, v))

function finish() {
  if (finished) return
  finished = true
  removeInput()
  if (idleTimer) clearTimeout(idleTimer)
  if (autoTween) autoTween.kill()
  if (tickerFn) gsap.ticker.remove(tickerFn)
  if (introTl) introTl.kill()
  if (ftl) ftl.kill()
  if (endTl) endTl.kill()
  emit('reveal')
  if (splash.value) splash.value.style.display = 'none'
  if (import.meta.client) {
    requestAnimationFrame(() => document.getElementById('main-content')?.focus?.())
  }
  emit('complete')
}

// ── Input handling (virtual scroll: the page behind never moves) ──
function interact(delta) {
  if (finished || endgameStarted) return
  if (autoTween) { autoTween.kill(); autoTween = null }
  input.t = clamp01(input.t + delta)
  armIdle()
}

function onWheel(e) {
  e.preventDefault()
  const px = e.deltaY * (e.deltaMode === 1 ? 16 : 1)
  interact(px / SCROLL_BUDGET)
}

let lastTouchY = null
function onTouchStart(e) {
  lastTouchY = e.touches[0]?.clientY ?? null
}
function onTouchMove(e) {
  if (lastTouchY == null) return
  e.preventDefault()
  const y = e.touches[0].clientY
  // ×2 : un geste de pouce confortable doit suffire à forger le logo entier
  interact(((lastTouchY - y) * 2) / SCROLL_BUDGET)
  lastTouchY = y
}

function onKeydown(e) {
  if (e.key === 'Escape') { finish(); return }
  if (finished || endgameStarted) return
  if (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ') {
    e.preventDefault()
    interact(0.12)
  } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
    e.preventDefault()
    interact(-0.12)
  }
}

function addInput() {
  const el = splash.value
  el.addEventListener('wheel', onWheel, { passive: false })
  el.addEventListener('touchstart', onTouchStart, { passive: true })
  el.addEventListener('touchmove', onTouchMove, { passive: false })
  document.addEventListener('keydown', onKeydown)
}
function removeInput() {
  const el = splash.value
  if (el) {
    el.removeEventListener('wheel', onWheel)
    el.removeEventListener('touchstart', onTouchStart)
    el.removeEventListener('touchmove', onTouchMove)
  }
  if (import.meta.client) document.removeEventListener('keydown', onKeydown)
}

// ── Idle autoplay : personne ne reste bloqué devant le lingot ──
function armIdle() {
  if (idleTimer) clearTimeout(idleTimer)
  idleTimer = setTimeout(() => {
    if (finished || endgameStarted) return
    autoTween = gsap.to(input, {
      t: 1,
      duration: Math.max(0.8, 2.2 * (1 - input.t)),
      ease: 'power1.inOut',
    })
  }, 2500)
}

function hideHint() {
  hintHidden = true
  gsap.to(hintEl.value, { autoAlpha: 0, y: 8, duration: 0.3, ease: 'power2.in' })
}

onMounted(async () => {
  await nextTick()
  if (!splash.value || !logoSvg.value) return

  if (prefersReducedMotion()) {
    finish()
    return
  }

  skipBtn.value?.focus?.()

  const vw = window.innerWidth
  const vh = window.innerHeight
  const headerH = 64

  // Centre le logo-group via GSAP (pas CSS) pour composer avec x/y du collapse
  gsap.set(logoGroup.value, { xPercent: -50, yPercent: -50 })
  gsap.set(morphGroup.value, { opacity: 0 })
  gsap.set(solidDisk.value, { opacity: 0 })
  gsap.set(glyphGroup.value, { opacity: 0 })

  const blocks = [block1.value, block2.value, block3.value, block4.value, block5.value]
  const targets = ['#v4-t-a1', '#v4-t-a2', '#v4-t-x', '#v4-t-l', '#v4-t-o']

  // ══════════════════════════════════════════════════════
  // FORMATION TIMELINE — paused, durée normalisée 1, scrubbée par le scroll.
  // 5 segments qui se chevauchent : starts 0/.185/.37/.555/.74, durée .26.
  // ══════════════════════════════════════════════════════
  ftl = gsap.timeline({ paused: true })
  blocks.forEach((b, i) => {
    ftl.to(b, {
      morphSVG: { shape: targets[i], shapeIndex: 'auto' },
      duration: 0.26,
      ease: 'power2.inOut',
    }, i * 0.185)
  })
  // Contre-poinçon blanc du O — poinçonné en toute fin de course
  ftl.fromTo(oInner.value,
    { scale: 0, opacity: 0, svgOrigin: '158.5 18.5' },
    { scale: 1, opacity: 1, duration: 0.1, ease: 'power2.out', svgOrigin: '158.5 18.5' },
    0.9)

  // ══════════════════════════════════════════════════════
  // PHASE 0 — INTRO : le lingot se révèle, le hint s'allume
  // ══════════════════════════════════════════════════════
  gsap.set(hintEl.value, { autoAlpha: 0, y: 8 })
  introTl = gsap.timeline()
  introTl.from(logoSvg.value, {
    scaleX: 0, transformOrigin: '50% 50%',
    duration: 0.5, ease: 'power3.out',
  })
  introTl.to(hintEl.value, { autoAlpha: 1, y: 0, duration: 0.4, ease: 'power2.out' }, 0.35)

  // ══════════════════════════════════════════════════════
  // PHASE 1 — LE SCROLL FORGE : lerp input.t → current → ftl.progress()
  // ══════════════════════════════════════════════════════
  tickerFn = () => {
    if (finished || endgameStarted) return
    current += (input.t - current) * 0.14
    if (Math.abs(input.t - current) < 0.0005) current = input.t
    ftl.progress(current)
    if (readoutEl.value) {
      readoutEl.value.textContent = `FORGE — ${String(Math.round(current * 100)).padStart(2, '0')}%`
    }
    if (!hintHidden && current > 0.05) hideHint()
    if (current >= 0.999 && input.t >= 1) startEndgame()
  }
  gsap.ticker.add(tickerFn)

  addInput()
  armIdle()

  // ══════════════════════════════════════════════════════
  // PHASE 2 — ENDGAME : identique à l'original (O → disque → stripes →
  // -45° → glyph orange → collapse header → reveal)
  // ══════════════════════════════════════════════════════
  function startEndgame() {
    if (endgameStarted || finished) return
    endgameStarted = true
    removeInput()
    document.addEventListener('keydown', onKeydown) // garder Échap actif
    if (idleTimer) clearTimeout(idleTimer)
    if (autoTween) { autoTween.kill(); autoTween = null }
    ftl.progress(1)
    if (readoutEl.value) readoutEl.value.textContent = 'FORGE — 100%'
    gsap.to(readoutEl.value, { autoAlpha: 0, duration: 0.3, delay: 0.2 })

    endTl = gsap.timeline({ onComplete: finish, delay: 0.15 })

    // O → disque parfait (block5 porte désormais la forme du O)
    endTl.to(block5.value, {
      morphSVG: {
        shape: 'M141,18.5 C141,7.14 147.664,0 158.5,0 C169.336,0 176,7.14 176,18.5 C176,29.86 169.336,37 158.5,37 C147.664,37 141,29.86 141,18.5 Z',
        shapeIndex: 0,
      },
      duration: 0.32, ease: 'power2.inOut',
    }, 0)
    endTl.to(oInner.value, {
      scale: 0, opacity: 0, svgOrigin: '158.5 18.5',
      duration: 0.26, ease: 'power2.in',
    }, 0)

    // Swap instantané disque morphé → solidDisk (géométries identiques)
    endTl.call(() => {
      gsap.set(morphGroup.value, { opacity: 1 })
      gsap.set(solidDisk.value, { opacity: 1 })
      gsap.set(block5.value, { opacity: 0 })
    }, null, 0.34)

    // Les 10 stripes découpent le disque
    endTl.call(() => {
      const stripes = morphGroup.value.querySelectorAll('.cutout-stripe')
      gsap.set(stripes, { scaleY: 0 })
      gsap.to(stripes, {
        scaleY: 1, duration: 0.06, stagger: 0.022, ease: 'back.out(3)',
      })
    }, null, 0.36)
    endTl.to({}, { duration: 0.2 }, 0.36)

    // Rotation -45°
    endTl.to(morphGroup.value, {
      rotation: -45, svgOrigin: '158.5 18.5',
      duration: 0.42, ease: 'elastic.out(1, 0.7)',
    }, '+=0.04')

    // Glyph orange
    endTl.to(morphGroup.value, { opacity: 0, duration: 0.18, ease: 'power2.inOut' }, '-=0.05')
    endTl.to(glyphGroup.value, { opacity: 1, duration: 0.2, ease: 'power2.out' }, '<+=0.04')

    // Collapse vers le header + reveal
    endTl.call(() => emit('reveal'), null, '+=0.04')
    endTl.call(() => {
      const headerLogo = document.querySelector('.header-logo .logo-img')
        || document.querySelector('.header-logo')
      const currentSvgRect = logoSvg.value.getBoundingClientRect()
      const groupRect = logoGroup.value.getBoundingClientRect()
      const scaleFactor = 28 / currentSvgRect.height

      let targetX = 0
      let targetY = -(vh / 2) + headerH / 2

      if (headerLogo) {
        const headerRect = headerLogo.getBoundingClientRect()
        targetX = headerRect.left + headerRect.width / 2 - (groupRect.left + groupRect.width / 2)
        targetY = headerRect.top + headerRect.height / 2 - (groupRect.top + groupRect.height / 2)
      }

      gsap.to(logoGroup.value, {
        scale: scaleFactor, x: targetX, y: targetY,
        duration: 0.5, ease: 'power3.inOut',
      })
    })

    endTl.to({}, { duration: 0.55 })
    endTl.to(splash.value, {
      clipPath: `inset(0 0 ${vh - headerH}px 0)`,
      duration: 0.4, ease: 'power3.inOut',
    })
  }
})

onUnmounted(() => {
  removeInput()
  if (idleTimer) clearTimeout(idleTimer)
  if (autoTween) autoTween.kill()
  if (tickerFn) gsap.ticker.remove(tickerFn)
  if (introTl) introTl.kill()
  if (ftl) ftl.kill()
  if (endTl) endTl.kill()
})
</script>

<template>
  <div ref="splash" class="splash-v4" role="presentation">
    <button
      ref="skipBtn"
      type="button"
      class="splash-skip"
      @click="finish"
    >
      {{ t('a11y.skipIntro') }}
    </button>

    <div ref="logoGroup" class="logo-group" aria-hidden="true">
      <!--
        LE LINGOT : 5 blocs contigus aux frontières médianes entre lettres —
        [0, 36.85] [36.85, 74.5] [74.5, 111.6] [111.6, 139.6] [139.6, 176].
        Chevauchement de 0.2 unité sur les arêtes internes pour éviter les
        coutures d'antialiasing (même couleur, invisible). Chaque bloc morphe
        vers son path de lettre (cibles cachées dans <defs>).
      -->
      <svg
        ref="logoSvg"
        class="logo-svg"
        viewBox="0 0 177 37"
        fill="none"
        overflow="visible"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <clipPath id="v4-glyph-clip">
            <circle cx="158.5" cy="18.5" r="18.5" />
          </clipPath>
          <!-- Cibles de morph — jamais rendues, mêmes paths que l'original -->
          <path id="v4-t-a1" d="M25.735 29.2004H10.089L7.28289 36.807H0L13.811 0.119141H22.3888L36.1997 36.807H28.5395L25.7333 29.2004H25.735ZM12.1924 23.5881H23.63L18.9905 11.0166L17.912 7.23933L16.8335 11.0166L12.1941 23.5881H12.1924Z" />
          <path id="v4-t-a2" d="M63.2313 29.2004H47.5854L44.7792 36.807H37.4963L51.309 0.119141H59.8868L73.6978 36.807H66.0358L63.2297 29.2004H63.2313ZM49.6904 23.5881H61.128L56.4885 11.0166L55.41 7.23933L54.3315 11.0166L49.6921 23.5881H49.6904Z" />
          <path id="v4-t-x" d="M93.4447 26.1242L91.9335 23.5344L90.3685 26.1242L82.9229 36.807H75.261L88.1562 17.8701L76.1801 0.119141H84.5969L91.0713 9.23701L92.7436 12.0968L94.4159 9.23701L100.781 0.119141H108.388L96.4656 17.7611L109.305 36.8053H100.889L93.443 26.1225L93.4447 26.1242Z" />
          <path id="v4-t-l" d="M113.891 0.119141H121.174V30.9263H138.168V36.807H113.889V0.119141H113.891Z" />
          <path id="v4-t-o" d="M141 18.553C141 7.1401 147.664 0 158.473 0C169.283 0 176 7.1401 176 18.553C176 29.9659 169.283 37.002 158.473 37.002C147.664 37.002 141 29.9659 141 18.553Z" />
        </defs>

        <!-- Les 5 blocs du lingot -->
        <g fill="#24272E">
          <path ref="block1" d="M0 0H37.05V37H0Z" />
          <path ref="block2" d="M36.85 0H74.7V37H36.85Z" />
          <path ref="block3" d="M74.5 0H111.8V37H74.5Z" />
          <path ref="block4" d="M111.6 0H139.8V37H111.6Z" />
          <path ref="block5" d="M139.6 0H176V37H139.6Z" />
        </g>

        <!-- Contre-poinçon du O — poinçonné en fin de formation -->
        <path ref="oInner" class="o-inner" d="M148.241 18.553C148.241 26.474 152.02 31.164 158.473 31.164C164.927 31.164 168.759 26.422 168.759 18.553C168.759 10.684 164.929 5.837 158.473 5.837C152.018 5.837 148.241 10.632 148.241 18.553Z" fill="#FCFCFC" opacity="0" />

        <!-- Morph group : disque + 10 stripes de découpe — IDENTIQUES à l'original -->
        <g ref="morphGroup" opacity="0">
          <g clip-path="url(#v4-glyph-clip)">
            <circle ref="solidDisk" cx="158.5" cy="18.5" r="18.5" fill="#24272E" opacity="0" />
            <rect class="cutout-stripe" x="141.762" y="0" width="1.762" height="37" fill="#FCFCFC" />
            <rect class="cutout-stripe" x="145.286" y="0" width="1.762" height="37" fill="#FCFCFC" />
            <rect class="cutout-stripe" x="148.810" y="0" width="1.762" height="37" fill="#FCFCFC" />
            <rect class="cutout-stripe" x="152.333" y="0" width="1.762" height="37" fill="#FCFCFC" />
            <rect class="cutout-stripe" x="155.857" y="0" width="1.762" height="37" fill="#FCFCFC" />
            <rect class="cutout-stripe" x="159.381" y="0" width="1.762" height="37" fill="#FCFCFC" />
            <rect class="cutout-stripe" x="162.905" y="0" width="1.762" height="37" fill="#FCFCFC" />
            <rect class="cutout-stripe" x="166.429" y="0" width="1.762" height="37" fill="#FCFCFC" />
            <rect class="cutout-stripe" x="169.952" y="0" width="1.762" height="37" fill="#FCFCFC" />
            <rect class="cutout-stripe" x="173.476" y="0" width="1.762" height="37" fill="#FCFCFC" />
          </g>
        </g>

        <!-- Glyph final orange — IDENTIQUE à l'original -->
        <g ref="glyphGroup" opacity="0">
          <path d="M141.179 24.7734C142.073 27.2357 143.506 29.5471 145.48 31.5229C147.454 33.4971 149.765 34.9312 152.229 35.8236L141.179 24.7734Z" fill="#FF8270" />
          <path d="M140.074 18.6797C140.084 19.6106 140.165 20.5398 140.316 21.4607L155.54 36.6856C156.461 36.8366 157.391 36.9171 158.321 36.9272L140.074 18.6797Z" fill="#FF8270" />
          <path d="M140.572 14.1895C140.403 14.9023 140.277 15.6236 140.193 16.3498L160.651 36.808C161.378 36.7241 162.099 36.5983 162.812 36.4289L140.572 14.1895Z" fill="#FF8270" />
          <path d="M141.87 10.502C141.59 11.089 141.342 11.6895 141.127 12.2967L164.703 35.873C165.312 35.6583 165.911 35.41 166.498 35.1299L141.87 10.502Z" fill="#FF8270" />
          <path d="M143.752 7.39648C143.383 7.88794 143.041 8.39448 142.729 8.9111L168.09 34.2721C168.608 33.9584 169.113 33.6162 169.605 33.2489L143.752 7.39648Z" fill="#FF8270" />
          <path d="M146.131 4.78516C145.911 4.98476 145.693 5.19107 145.48 5.40408C145.267 5.6171 145.061 5.83348 144.861 6.05488L170.945 32.1388C171.165 31.9392 171.383 31.7328 171.596 31.5198C171.809 31.3068 172.015 31.0904 172.215 30.869L146.131 4.78516Z" fill="#FF8270" />
          <path d="M148.987 2.65625C148.469 2.96991 147.962 3.3104 147.471 3.67941L173.322 29.5301C173.691 29.0387 174.031 28.5321 174.345 28.0138L148.987 2.65625Z" fill="#FF8270" />
          <path d="M152.374 1.05469C151.765 1.26938 151.166 1.51763 150.577 1.79774L175.204 26.424C175.484 25.837 175.732 25.2365 175.947 24.6276L152.374 1.05469Z" fill="#FF8270" />
          <path d="M156.426 0.119141C155.7 0.203006 154.978 0.327127 154.266 0.496536L176.503 22.7343C176.673 22.0215 176.799 21.2986 176.881 20.574L156.426 0.119141Z" fill="#FF8270" />
          <path d="M175.896 12.1536C175.004 9.69135 173.572 7.38002 171.596 5.40414C169.621 3.42995 167.31 1.99585 164.846 1.10352L175.895 12.152L175.896 12.1536Z" fill="#FF8270" />
          <path d="M161.537 0.24321C160.616 0.0922522 159.685 0.0100639 158.754 0L177 18.2458C176.99 17.3149 176.908 16.384 176.757 15.4631L161.537 0.24321Z" fill="#FF8270" />
        </g>
      </svg>
    </div>

    <!-- Hint scroll — disparaît dès que le geste est acquis -->
    <div ref="hintEl" class="forge-hint" aria-hidden="true">
      <span class="hint-label">{{ t('splash.scrollHint') }}</span>
      <span class="hint-chevron" />
    </div>

    <!-- Readout mono façon lab — suit le progress -->
    <span ref="readoutEl" class="forge-readout" aria-hidden="true">FORGE — 00%</span>
  </div>
</template>

<style scoped>
.splash-v4 {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100vw;
  height: 100vh;
  height: 100dvh; /* dynamic viewport height — iOS URL bar + safe areas */
  z-index: 9999;
  background: #fcfcfc;
  will-change: clip-path, opacity, transform;
  overflow: hidden;
  touch-action: none; /* le scroll est virtuel — aucun pan natif */
  overscroll-behavior: contain;
}

.splash-skip {
  position: absolute;
  bottom: max(28px, env(safe-area-inset-bottom, 28px));
  left: 50%;
  transform: translateX(-50%);
  z-index: 10001;
  padding: 10px 18px;
  font-family: var(--font, sans-serif);
  font-size: 11px;
  font-weight: 400;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #fff;
  mix-blend-mode: difference;
  opacity: 0.55;
  background: transparent;
  border: none;
  cursor: pointer;
  transition: opacity 0.25s;
}
.splash-skip:hover,
.splash-skip:focus-visible { opacity: 1; }

@media (prefers-reduced-motion: reduce) {
  .splash-v4 { display: none !important; }
}

.logo-group {
  position: absolute;
  top: 50%;
  left: 50%;
  z-index: 1;
  will-change: transform;
}

.logo-svg {
  display: block;
  width: clamp(200px, 55vw, 880px);
  height: auto;
  will-change: transform;
}

/* ── Hint « Scrollez pour forger » ── */
.forge-hint {
  position: absolute;
  top: calc(50% + clamp(48px, 9vw, 130px));
  left: 50%;
  transform: translateX(-50%);
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  pointer-events: none;
}

.hint-label {
  font-family: var(--font, sans-serif);
  font-size: 11px;
  font-weight: 400;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: #6e7381;
}

/* Chevron : une ligne verticale qui « coule » en boucle */
.hint-chevron {
  width: 1px;
  height: 28px;
  background: #24272e;
  opacity: 0.55;
  animation: forge-drip 1.5s cubic-bezier(0.65, 0, 0.35, 1) infinite;
  transform-origin: top center;
}

@keyframes forge-drip {
  0% { transform: scaleY(0); transform-origin: top center; }
  45% { transform: scaleY(1); transform-origin: top center; }
  55% { transform: scaleY(1); transform-origin: bottom center; }
  100% { transform: scaleY(0); transform-origin: bottom center; }
}

/* ── Readout mono ── */
.forge-readout {
  position: absolute;
  bottom: max(30px, env(safe-area-inset-bottom, 30px));
  left: clamp(18px, 5vw, 56px);
  z-index: 2;
  font-family: ui-monospace, 'SF Mono', Menlo, monospace;
  font-size: clamp(10px, 1.1vw, 12px);
  letter-spacing: 0.1em;
  color: #24272e;
  opacity: 0.85;
  font-variant-numeric: tabular-nums;
  pointer-events: none;
}
</style>
