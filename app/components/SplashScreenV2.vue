<script setup>
/**
 * SplashScreenV2 — « LE SCAN »
 *
 * Concept : le glyph AAXLO est un disque découpé par des stripes.
 * Ce splash fait de la stripe le fil narratif complet de l'intro :
 *
 *  PHASE 1 (0.00s) — IGNITION   : une ligne de scan orange, pleine hauteur,
 *                                 s'allume (draw + flicker néon) à gauche du logo.
 *  PHASE 2 (0.26s) — LE SCAN    : la ligne balaie l'écran sombre et IMPRIME les
 *                                 lettres blanches derrière elle (clip suit la ligne).
 *                                 Chaque lettre traversée flashe un fantôme orange
 *                                 décalé — misregistration d'impression. Une règle
 *                                 de ticks techniques se révèle sous le logo.
 *  PHASE 3 (0.88s) — LE FLIP    : la ligne finit de traverser le O → flip négatif
 *                                 en un cut dur (fond sombre→blanc, lettres
 *                                 blanches→dark) + flash + micro punch d'échelle.
 *  PHASE 4 (0.95s) — ENDGAME    : le O morphe en disque parfait pendant que la
 *                                 ligne de scan revient, rétrécit à la hauteur du
 *                                 disque, blanchit — et DEVIENT la première stripe
 *                                 de découpe. Les 10 stripes cascadent depuis elle.
 *  PHASE 5/6/7      — identiques à l'original : rotation -45°, crossfade vers le
 *                                 glyph orange #FF8270, collapse vers le header,
 *                                 clip-away du splash.
 *
 * Géométrie 100% identique à l'original : viewBox "0 0 177 37", mêmes paths de
 * lettres, mêmes 10 stripes de découpe, même clip circulaire, même glyph.
 */
import { gsap } from 'gsap'
import { MorphSVGPlugin } from 'gsap/MorphSVGPlugin'
import { prefersReducedMotion } from '~/composables/usePrefersReducedMotion'

const emit = defineEmits(['reveal', 'complete'])
const { t } = useI18n()

// ── Refs ──
const splash = ref(null)
const skipBtn = ref(null)
const bgDark = ref(null)
const flash = ref(null)
const scanline = ref(null)
const scanCore = ref(null)
const scanTrail = ref(null)
const logoGroup = ref(null)
const logoSvg = ref(null)
const scanClipRect = ref(null)
const lettersGroup = ref(null)
const oLetter = ref(null)
const oInner = ref(null)
const morphGroup = ref(null)
const solidDisk = ref(null)
const glyphGroup = ref(null)

// Règle de ticks techniques sous le logo (révélée par le scan, invisible après
// le flip : strokes blancs sur fond devenu blanc — aucune gestion nécessaire)
const TICKS = Array.from({ length: 33 }, (_, i) => ({
  x: (177 / 32) * i,
  major: i % 4 === 0,
}))

let tl = null
let finished = false

function finish() {
  if (finished) return
  finished = true
  if (tl) tl.kill()
  emit('reveal')
  if (splash.value) splash.value.style.display = 'none'
  if (import.meta.client) {
    document.removeEventListener('keydown', onKeydown)
    requestAnimationFrame(() => document.getElementById('main-content')?.focus?.())
  }
  emit('complete')
}

function onKeydown(e) {
  if (e.key === 'Escape') finish()
}

onMounted(async () => {
  await nextTick()
  if (!splash.value || !logoSvg.value) return

  if (prefersReducedMotion()) {
    finish()
    return
  }

  document.addEventListener('keydown', onKeydown)
  skipBtn.value?.focus?.()

  const vw = window.innerWidth
  const vh = window.innerHeight
  const headerH = 64

  // ══════════════════════════════════════════════════════
  // COORDINATE SYSTEM — viewBox "0 0 177 37"
  // A1: x 0–36, A2: x 37–74, X: x 75–109, L: x 110–138, O: x 141–176
  // ══════════════════════════════════════════════════════
  gsap.set(logoGroup.value, { xPercent: -50, yPercent: -50 })

  const svgRect = logoSvg.value.getBoundingClientRect()
  const pxPerUnit = svgRect.width / 177
  const diskCenterYpx = svgRect.top + 18.5 * pxPerUnit
  const diskHeightPx = 37 * pxPerUnit
  const stripeWpx = 1.762 * pxPerUnit

  // Géométrie du scan (la ligne vit en px viewport, le clip en unités SVG)
  const scanStartX = svgRect.left - Math.max(18, vw * 0.02)
  const scanEndX = svgRect.left + 177 * pxPerUnit + Math.max(14, vw * 0.012)
  // Centre de la première stripe de découpe (x=141.762, largeur 1.762)
  const stripe1CenterX = svgRect.left + 142.643 * pxPerUnit

  // ── États initiaux ──
  gsap.set(scanline.value, { x: scanStartX - 1, scaleY: 0, transformOrigin: '50% 50%' })
  gsap.set(morphGroup.value, { opacity: 0 })
  gsap.set(solidDisk.value, { opacity: 0 })
  gsap.set(glyphGroup.value, { opacity: 0 })
  scanClipRect.value.setAttribute('width', '0')

  // Déclencheurs par lettre pendant le balayage :
  //  - bord gauche → la lettre glisse en place (settle vertical subtil)
  //  - bord droit  → flash du fantôme orange (misregistration)
  const letterPaths = Array.from(logoSvg.value.querySelectorAll('.v2-letter'))
  const ghostEls = Array.from(logoSvg.value.querySelectorAll('.v2-ghost'))
  const settleTriggers = [0, 37, 75, 110, 141].map((at, i) => ({
    at: at - 0.5, el: letterPaths[i], fired: false,
  }))
  const ghostTriggers = [36.2, 73.7, 109.3, 138.2, 176].map((at, i) => ({
    at: at - 1, el: ghostEls[i], fired: false,
  }))

  tl = gsap.timeline({ onComplete: finish })

  // ══════════════════════════════════════════════════════
  // PHASE 1 — IGNITION (la ligne s'allume comme un néon)
  // ══════════════════════════════════════════════════════
  tl.to(scanline.value, { scaleY: 1, duration: 0.16, ease: 'power3.out' })
    .to(scanline.value, { opacity: 0.45, duration: 0.04, repeat: 3, yoyo: true, ease: 'none' }, '<+=0.06')

  // Le logo entier se pose doucement pendant le scan (settle d'échelle)
  tl.fromTo(logoGroup.value, { scale: 1.045 }, { scale: 1, duration: 0.72, ease: 'power2.out' }, 0.16)

  // ══════════════════════════════════════════════════════
  // PHASE 2 — LE SCAN (la ligne imprime les lettres)
  // ══════════════════════════════════════════════════════
  const scan = { x: scanStartX }
  tl.to(scan, {
    x: scanEndX,
    duration: 0.62,
    ease: 'power1.inOut',
    onUpdate: () => {
      gsap.set(scanline.value, { x: scan.x - 1 })
      const units = (scan.x - svgRect.left) / pxPerUnit
      scanClipRect.value.setAttribute('width', String(Math.max(0, Math.min(units + 3, 183))))

      for (const s of settleTriggers) {
        if (!s.fired && units >= s.at) {
          s.fired = true
          gsap.fromTo(s.el, { y: -1.2 }, { y: 0, duration: 0.28, ease: 'power3.out' })
        }
      }
      for (const g of ghostTriggers) {
        if (!g.fired && units >= g.at) {
          g.fired = true
          gsap.fromTo(g.el, { opacity: 0.85 }, { opacity: 0, duration: 0.13, ease: 'power1.in' })
        }
      }
    },
  }, 0.26)

  // ══════════════════════════════════════════════════════
  // PHASE 3 — LE FLIP NÉGATIF (cut dur, flash, punch)
  // ══════════════════════════════════════════════════════
  tl.addLabel('flip')
  tl.call(() => {
    bgDark.value.style.opacity = '0'
    lettersGroup.value.setAttribute('fill', '#24272E')
    oInner.value.setAttribute('fill', '#FFFFFF')
  }, null, 'flip')
    // immediateRender: false — sinon le "from" (flash blanc 0.95) s'applique
    // dès la construction de la timeline et lave toute la phase de scan
    .fromTo(flash.value, { opacity: 0.95 }, { opacity: 0, duration: 0.16, ease: 'power2.out', immediateRender: false }, 'flip')
    .fromTo(logoGroup.value, { scale: 1.03 }, { scale: 1, duration: 0.3, ease: 'power3.out', immediateRender: false }, 'flip')

  // ══════════════════════════════════════════════════════
  // PHASE 4 — ENDGAME : O → disque parfait, pendant que la
  // ligne de scan revient devenir la PREMIÈRE stripe de découpe
  // ══════════════════════════════════════════════════════
  tl.addLabel('endgame', 'flip+=0.07')

  tl.call(() => {
    const outerPath = oLetter.value.querySelector('.o-outer')
    if (outerPath) {
      gsap.to(outerPath, {
        morphSVG: {
          shape: 'M141,18.5 C141,7.14 147.664,0 158.5,0 C169.336,0 176,7.14 176,18.5 C176,29.86 169.336,37 158.5,37 C147.664,37 141,29.86 141,18.5 Z',
          shapeIndex: 0,
        },
        duration: 0.32, ease: 'power2.inOut',
      })
    }
    gsap.to(oInner.value, {
      scale: 0, opacity: 0, svgOrigin: '158.5 18.5',
      duration: 0.26, ease: 'power2.in',
    })
  }, null, 'endgame')

  // La ligne voyage vers le slot de la stripe 1, rétrécit à la hauteur du
  // disque, blanchit — le scan se réincarne en outil de découpe
  tl.to(scanline.value, {
    x: stripe1CenterX - 1,
    duration: 0.34, ease: 'power3.inOut',
  }, 'endgame')
    .to(scanline.value, {
      scaleY: diskHeightPx / vh,
      scaleX: stripeWpx / 2,
      transformOrigin: `50% ${diskCenterYpx}px`,
      duration: 0.34, ease: 'power3.inOut',
    }, 'endgame')
    .to(scanCore.value, {
      backgroundColor: '#FFFFFF',
      boxShadow: '0 0 0px 0px rgba(255,130,112,0)',
      duration: 0.3, ease: 'power2.inOut',
    }, 'endgame')
    .to(scanTrail.value, { opacity: 0, duration: 0.18 }, 'endgame')

  // ══════════════════════════════════════════════════════
  // PHASE 5 — LES STRIPES DÉCOUPENT LE DISQUE
  // Swap instantané O morphé → solidDisk (géométries identiques, invisible)
  // ══════════════════════════════════════════════════════
  tl.call(() => {
    gsap.set(morphGroup.value, { opacity: 1 })
    gsap.set(solidDisk.value, { opacity: 1 })
    gsap.set(oLetter.value, { opacity: 0 })
  }, null, 'endgame+=0.36')

  tl.call(() => {
    const stripes = morphGroup.value.querySelectorAll('.cutout-stripe')
    gsap.set(stripes, { scaleY: 0 })
    gsap.to(stripes, {
      scaleY: 1, duration: 0.06, stagger: 0.022, ease: 'back.out(3)',
    })
  }, null, 'endgame+=0.38')
    .to(scanline.value, { opacity: 0, duration: 0.12 }, 'endgame+=0.38')
    .to({}, { duration: 0.26 }, 'endgame+=0.38')

  // ══════════════════════════════════════════════════════
  // PHASE 6 — ROTATION -45° (identique à l'original)
  // ══════════════════════════════════════════════════════
  tl.to(morphGroup.value, {
    rotation: -45, svgOrigin: '158.5 18.5',
    duration: 0.42, ease: 'elastic.out(1, 0.7)',
  }, '+=0.04')

  // ══════════════════════════════════════════════════════
  // PHASE 7 — LE GLYPH ORANGE REMPLACE LE DISQUE
  // ══════════════════════════════════════════════════════
  tl.to(morphGroup.value, { opacity: 0, duration: 0.18, ease: 'power2.inOut' }, '-=0.05')
    .to(glyphGroup.value, { opacity: 1, duration: 0.2, ease: 'power2.out' }, '<+=0.04')

  // ══════════════════════════════════════════════════════
  // PHASE 8 — COLLAPSE VERS LE HEADER (identique à l'original)
  // ══════════════════════════════════════════════════════
  tl.call(() => emit('reveal'), null, '+=0.04')
    .call(() => {
      const headerLogo = document.querySelector('.header-logo .logo-img')
        || document.querySelector('.header-logo')
      const currentSvgRect = logoSvg.value.getBoundingClientRect()
      const groupRect = logoGroup.value.getBoundingClientRect()

      const scaleFactor = 28 / currentSvgRect.height

      let targetX = 0
      let targetY = -(vh / 2) + headerH / 2

      if (headerLogo) {
        const headerRect = headerLogo.getBoundingClientRect()
        const groupCenterX = groupRect.left + groupRect.width / 2
        const groupCenterY = groupRect.top + groupRect.height / 2
        const headerCenterX = headerRect.left + headerRect.width / 2
        const headerCenterY = headerRect.top + headerRect.height / 2

        targetX = headerCenterX - groupCenterX
        targetY = headerCenterY - groupCenterY
      }

      gsap.to(logoGroup.value, {
        scale: scaleFactor, x: targetX, y: targetY,
        duration: 0.5, ease: 'power3.inOut',
      })
    })

  tl.to({}, { duration: 0.42 })
    .to(splash.value, {
      clipPath: `inset(0 0 ${vh - headerH}px 0)`,
      duration: 0.36, ease: 'power3.inOut',
    })
})

onUnmounted(() => {
  if (tl) tl.kill()
  if (import.meta.client) document.removeEventListener('keydown', onKeydown)
})
</script>

<template>
  <div ref="splash" class="splash-v2" role="presentation">
    <button
      ref="skipBtn"
      type="button"
      class="splash-skip"
      @click="finish"
    >
      {{ t('a11y.skipIntro') }}
    </button>

    <!-- Fond sombre — tué net au flip -->
    <div ref="bgDark" class="bg-dark" aria-hidden="true" />

    <div ref="logoGroup" class="logo-group" aria-hidden="true">
      <svg
        ref="logoSvg"
        class="logo-svg"
        viewBox="0 0 177 37"
        fill="none"
        overflow="visible"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <!-- Le rect de ce clip suit exactement la ligne de scan -->
          <clipPath id="v2-scan-clip">
            <rect ref="scanClipRect" x="-3" y="-7" width="0" height="56" />
          </clipPath>
          <clipPath id="v2-glyph-clip">
            <circle cx="158.5" cy="18.5" r="18.5" />
          </clipPath>
        </defs>

        <!-- Tout ce qui est "imprimé" par le scan vit sous ce clip -->
        <g clip-path="url(#v2-scan-clip)">
          <!-- Lettres : blanches sur fond sombre, flippées en dark au cut -->
          <g ref="lettersGroup" fill="#FFFFFF">
            <path id="v2-a1" class="v2-letter" d="M25.735 29.2004H10.089L7.28289 36.807H0L13.811 0.119141H22.3888L36.1997 36.807H28.5395L25.7333 29.2004H25.735ZM12.1924 23.5881H23.63L18.9905 11.0166L17.912 7.23933L16.8335 11.0166L12.1941 23.5881H12.1924Z" />
            <path id="v2-a2" class="v2-letter" d="M63.2313 29.2004H47.5854L44.7792 36.807H37.4963L51.309 0.119141H59.8868L73.6978 36.807H66.0358L63.2297 29.2004H63.2313ZM49.6904 23.5881H61.128L56.4885 11.0166L55.41 7.23933L54.3315 11.0166L49.6921 23.5881H49.6904Z" />
            <path id="v2-x" class="v2-letter" d="M93.4447 26.1242L91.9335 23.5344L90.3685 26.1242L82.9229 36.807H75.261L88.1562 17.8701L76.1801 0.119141H84.5969L91.0713 9.23701L92.7436 12.0968L94.4159 9.23701L100.781 0.119141H108.388L96.4656 17.7611L109.305 36.8053H100.889L93.443 26.1225L93.4447 26.1242Z" />
            <path id="v2-l" class="v2-letter" d="M113.891 0.119141H121.174V30.9263H138.168V36.807H113.889V0.119141H113.891Z" />
            <g ref="oLetter" class="v2-letter">
              <path id="v2-o" class="o-outer" d="M141 18.553C141 7.1401 147.664 0 158.473 0C169.283 0 176 7.1401 176 18.553C176 29.9659 169.283 37.002 158.473 37.002C147.664 37.002 141 29.9659 141 18.553Z" />
              <path ref="oInner" class="o-inner" d="M148.241 18.553C148.241 26.474 152.02 31.164 158.473 31.164C164.927 31.164 168.759 26.422 168.759 18.553C168.759 10.684 164.929 5.837 158.473 5.837C152.018 5.837 148.241 10.632 148.241 18.553Z" fill="#24272E" />
            </g>
          </g>

          <!-- Fantômes orange — flash de misregistration quand le scan passe -->
          <g aria-hidden="true">
            <use class="v2-ghost" href="#v2-a1" fill="#FF8270" opacity="0" transform="translate(1.4 1.1)" />
            <use class="v2-ghost" href="#v2-a2" fill="#FF8270" opacity="0" transform="translate(-1.2 1.3)" />
            <use class="v2-ghost" href="#v2-x" fill="#FF8270" opacity="0" transform="translate(1.5 -1)" />
            <use class="v2-ghost" href="#v2-l" fill="#FF8270" opacity="0" transform="translate(-1.3 -1.1)" />
            <use class="v2-ghost" href="#v2-o" fill="#FF8270" opacity="0" transform="translate(1.4 1.2)" />
          </g>

          <!-- Règle de ticks techniques — révélée par le scan, blanche
               (devient invisible d'elle-même sur fond blanc après le flip) -->
          <g stroke="#FFFFFF" opacity="0.45" stroke-width="0.35">
            <line
              v-for="(tick, i) in TICKS"
              :key="i"
              :x1="tick.x"
              :x2="tick.x"
              y1="42.5"
              :y2="tick.major ? 47 : 45"
            />
          </g>
        </g>

        <!-- Morph group : disque + 10 stripes de découpe — IDENTIQUES à l'original -->
        <g ref="morphGroup" opacity="0">
          <g clip-path="url(#v2-glyph-clip)">
            <circle ref="solidDisk" cx="158.5" cy="18.5" r="18.5" fill="#24272E" opacity="0" />
            <rect class="cutout-stripe" x="141.762" y="0" width="1.762" height="37" fill="white" />
            <rect class="cutout-stripe" x="145.286" y="0" width="1.762" height="37" fill="white" />
            <rect class="cutout-stripe" x="148.810" y="0" width="1.762" height="37" fill="white" />
            <rect class="cutout-stripe" x="152.333" y="0" width="1.762" height="37" fill="white" />
            <rect class="cutout-stripe" x="155.857" y="0" width="1.762" height="37" fill="white" />
            <rect class="cutout-stripe" x="159.381" y="0" width="1.762" height="37" fill="white" />
            <rect class="cutout-stripe" x="162.905" y="0" width="1.762" height="37" fill="white" />
            <rect class="cutout-stripe" x="166.429" y="0" width="1.762" height="37" fill="white" />
            <rect class="cutout-stripe" x="169.952" y="0" width="1.762" height="37" fill="white" />
            <rect class="cutout-stripe" x="173.476" y="0" width="1.762" height="37" fill="white" />
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

    <!-- La ligne de scan — pleine hauteur, vit au-dessus du logo -->
    <div ref="scanline" class="scanline" aria-hidden="true">
      <span ref="scanTrail" class="scan-trail" />
      <span ref="scanCore" class="scan-core" />
    </div>

    <!-- Flash blanc du flip négatif -->
    <div ref="flash" class="flip-flash" aria-hidden="true" />
  </div>
</template>

<style scoped>
.splash-v2 {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100vw;
  height: 100vh;
  height: 100dvh; /* dynamic viewport height — iOS URL bar + safe areas */
  z-index: 9999;
  background: white;
  will-change: clip-path, opacity, transform;
  overflow: hidden;
}

/* Skip control — même pattern que l'original : blanc + difference reste
   lisible sur les deux phases (fond sombre puis blanc). */
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
  .splash-v2 { display: none !important; }
}

.bg-dark {
  position: absolute;
  inset: 0;
  background: #24272E;
  z-index: 0;
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
  width: clamp(280px, 55vw, 880px);
  max-width: calc(100vw - 32px);
  height: auto;
}

/* ── La ligne de scan ── */
.scanline {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  width: 2px;
  z-index: 2;
  will-change: transform, opacity;
  pointer-events: none;
}

.scan-core {
  position: absolute;
  inset: 0;
  background: #FF8270;
  box-shadow: 0 0 16px 2px rgba(255, 130, 112, 0.65);
}

/* Traînée derrière la ligne (à sa gauche pendant le balayage) */
.scan-trail {
  position: absolute;
  top: 0;
  bottom: 0;
  right: 100%;
  width: 90px;
  background: linear-gradient(to left, rgba(255, 130, 112, 0.28), rgba(255, 130, 112, 0));
}

.flip-flash {
  position: absolute;
  inset: 0;
  background: #fff;
  opacity: 0;
  z-index: 3;
  pointer-events: none;
}

.v2-letter {
  will-change: transform;
}

.cutout-stripe {
  transform-origin: center 0;
}
</style>
