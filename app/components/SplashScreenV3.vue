<script setup>
/**
 * SplashScreenV3 — « L'OBJECTIF »
 *
 * Concept : double sens français — l'objectif (la lentille) et l'objectif
 * (le but business). L'agence met votre activité au point, recule pour
 * révéler la vue d'ensemble, déclenche — et la prise devient la marque.
 *
 * Inversion totale de la V2 (« Le Scan ») : plus de balayage 2D sombre→clair,
 * mais UN SEUL mouvement de caméra sur l'axe Z, en pleine lumière.
 *
 *  PHASE 1 (0.00s) — MISE AU POINT : on est À L'INTÉRIEUR du O (zoom ×8–×16
 *                                    selon viewport), image floue, cadre
 *                                    abstrait — une simple courbe sombre. Le
 *                                    viseur photo s'allume (collimateurs,
 *                                    grille des tiers, lecture « MAP ··· /
 *                                    ƒ/2.8 / ~400 mm »). La mise au point se
 *                                    fait : flou → net, « NET ».
 *  PHASE 2 (0.28s) — LE TRAVELLING : travelling arrière vectoriel — c'est le
 *                                    viewBox du SVG (plein viewport) qui est
 *                                    animé : re-rendu vectoriel à chaque
 *                                    frame, net à toutes les échelles, aucun
 *                                    bitmap scale. La caméra est VERROUILLÉE
 *                                    sur le O (fraction d'écran constante) —
 *                                    vrai dolly-out, le O ne quitte jamais le
 *                                    cadre. La focale affichée est calculée en
 *                                    live depuis la fenêtre. Les lettres
 *                                    A A X L glissent en parallaxe factice et
 *                                    s'alignent quand la caméra se pose.
 *  PHASE 3 (1.02s) — LE DÉCLIC     : obturateur — frame noire 1/20s, le viseur
 *                                    disparaît. La photo est prise.
 *  PHASE 4 (1.10s) — ENDGAME       : identique à l'original — le O morphe en
 *                                    disque, les 10 stripes découpent,
 *                                    rotation -45°, glyph orange #FF8270,
 *                                    collapse vers le header, reveal.
 *
 * Géométrie 100% identique à l'original : viewBox final "0 0 177 37",
 * mêmes paths de lettres, mêmes 10 stripes, même clip circulaire, même glyph.
 */
import { gsap } from 'gsap'
import { MorphSVGPlugin } from 'gsap/MorphSVGPlugin'
import { prefersReducedMotion } from '~/composables/usePrefersReducedMotion'

const emit = defineEmits(['reveal', 'complete'])
const { t } = useI18n()

// ── Refs ──
const splash = ref(null)
const skipBtn = ref(null)
const logoGroup = ref(null)
const logoSvg = ref(null)
const lettersGroup = ref(null)
const oLetter = ref(null)
const oInner = ref(null)
const morphGroup = ref(null)
const solidDisk = ref(null)
const glyphGroup = ref(null)
const viewfinder = ref(null)
const shutter = ref(null)
const readoutFocal = ref(null)

const afLocked = ref(false)
const afStatus = ref('MAP ···')

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
  // COORDINATE SYSTEM — la caméra est le viewBox.
  // Le SVG occupe TOUT le viewport ; les fenêtres de viewBox sont calculées
  // au runtime avec le ratio exact vw/vh — le cadre couvre donc 100% de
  // l'écran à chaque frame, du zoom ×42 jusqu'au logo posé à sa taille design.
  // A1: x 0–36, A2: x 37–74, X: x 75–109, L: x 110–138, O: x 141–176
  // ══════════════════════════════════════════════════════
  // Taille design du logo posé : clamp(280px, 55vw, 880px), max vw-32
  const logoWpx = Math.min(Math.max(280, vw * 0.55), 880, vw - 32)
  const vbW = 177 * (vw / logoWpx)
  const vbH = vbW * (vh / vw)

  // CAMÉRA VERROUILLÉE SUR LE O — vrai dolly-out : le centre du O (158.5, 18.5)
  // garde la MÊME fraction d'écran pendant tout le dézoom. Le monde grandit
  // autour de lui, il ne quitte jamais le cadre, zéro pan perçu.
  // xFrac est dérivé de la fenêtre finale (donc exact à tous les viewports).
  const xFrac = (158.5 - (177 - vbW) / 2) / vbW
  // Fenêtre de départ : assez large pour cadrer le bord interne gauche de
  // l'anneau du O (x=148.24) à ~35% du cadre — courbe abstraite, plein écran.
  const w0 = 10.26 / (xFrac - 0.35)
  const cam = { w: w0, yF: 0.40 }
  const applyCam = () => {
    const h = cam.w * (vh / vw)
    logoSvg.value.setAttribute(
      'viewBox',
      `${158.5 - xFrac * cam.w} ${18.5 - cam.yF * h} ${cam.w} ${h}`,
    )
    // La focale affichée est dérivée de la fenêtre réelle — pas une fausse anim
    if (readoutFocal.value) {
      readoutFocal.value.textContent = `${Math.max(35, Math.round((35 * vbW) / cam.w))} mm`
    }
  }
  applyCam()
  gsap.set(logoSvg.value, { rotation: -3.5, transformOrigin: '50% 50%', filter: 'blur(16px)' })
  gsap.set(morphGroup.value, { opacity: 0 })
  gsap.set(solidDisk.value, { opacity: 0 })
  gsap.set(glyphGroup.value, { opacity: 0 })

  // Parallaxe factice : chaque lettre vit à une "profondeur" différente —
  // pendant le travelling arrière elles convergent vers leur alignement.
  // Le O est l'ancre de la caméra : il ne bouge jamais.
  const parallax = [
    { el: logoSvg.value.querySelector('#v3-a1'), off: -22 },
    { el: logoSvg.value.querySelector('#v3-a2'), off: -15 },
    { el: logoSvg.value.querySelector('#v3-x'), off: -9 },
    { el: logoSvg.value.querySelector('#v3-l'), off: -4 },
  ]
  parallax.forEach(p => gsap.set(p.el, { x: p.off }))

  tl = gsap.timeline({ onComplete: finish })

  // ══════════════════════════════════════════════════════
  // PHASE 1 — MISE AU POINT (le viseur s'allume, l'image devient nette)
  // ══════════════════════════════════════════════════════
  tl.to(viewfinder.value, { opacity: 1, duration: 0.18, ease: 'power2.out' }, 0)
    .to(logoSvg.value, { filter: 'blur(0px)', duration: 0.34, ease: 'power2.inOut' }, 0)
    // micro-glissement vertical le long de la courbe — jamais de frame statique
    .to(cam, { yF: 0.5, duration: 0.26, ease: 'power1.inOut', onUpdate: applyCam }, 0)
    .call(() => {
      afStatus.value = 'NET'
      afLocked.value = true
    }, null, 0.30)

  // ══════════════════════════════════════════════════════
  // PHASE 2 — LE TRAVELLING ARRIÈRE (dolly-out vectoriel, ancré sur le O)
  // ══════════════════════════════════════════════════════
  tl.to(cam, { w: vbW, duration: 0.72, ease: 'power3.inOut', onUpdate: applyCam }, 0.28)
    .to(logoSvg.value, { rotation: 0, duration: 0.74, ease: 'power2.out' }, 0.26)

  parallax.forEach((p, i) => {
    tl.to(p.el, { x: 0, duration: 0.66 + i * 0.04, ease: 'power3.out' }, 0.30)
  })

  // ══════════════════════════════════════════════════════
  // PHASE 3 — LE DÉCLIC (obturateur : frame noire, le viseur s'éteint)
  // ══════════════════════════════════════════════════════
  tl.addLabel('declic', 1.02)
  tl.call(() => {
    shutter.value.style.opacity = '1'
    viewfinder.value.style.opacity = '0'
  }, null, 'declic')
    .to(shutter.value, { opacity: 0, duration: 0.16, ease: 'power2.out' }, 'declic+=0.05')
    // immediateRender: false — sinon le "from" s'applique dès t=0 (cf. playbook)
    .fromTo(logoGroup.value, { scale: 1.014 }, { scale: 1, duration: 0.3, ease: 'power3.out', immediateRender: false }, 'declic+=0.05')

  // ══════════════════════════════════════════════════════
  // PHASE 4 — ENDGAME : O → disque parfait (identique à l'original)
  // ══════════════════════════════════════════════════════
  tl.addLabel('endgame', 'declic+=0.08')

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

  // ══════════════════════════════════════════════════════
  // PHASE 5 — LES STRIPES DÉCOUPENT LE DISQUE
  // Swap instantané O morphé → solidDisk (géométries identiques, invisible)
  // ══════════════════════════════════════════════════════
  tl.call(() => {
    gsap.set(morphGroup.value, { opacity: 1 })
    gsap.set(solidDisk.value, { opacity: 1 })
    gsap.set(oLetter.value, { opacity: 0 })
  }, null, 'endgame+=0.34')

  tl.call(() => {
    const stripes = morphGroup.value.querySelectorAll('.cutout-stripe')
    gsap.set(stripes, { scaleY: 0 })
    gsap.to(stripes, {
      scaleY: 1, duration: 0.06, stagger: 0.022, ease: 'back.out(3)',
    })
  }, null, 'endgame+=0.36')
    .to({}, { duration: 0.20 }, 'endgame+=0.36')

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

      // Le SVG est plein écran : la taille écran du logo se déduit du viewBox
      // final (centré sur le logo → centre du logo = centre du viewport).
      const logoHpx = 37 * (vw / vbW)
      const scaleFactor = 28 / logoHpx

      let targetX = 0
      let targetY = -(vh / 2) + headerH / 2

      if (headerLogo) {
        const headerRect = headerLogo.getBoundingClientRect()
        targetX = headerRect.left + headerRect.width / 2 - vw / 2
        targetY = headerRect.top + headerRect.height / 2 - vh / 2
      }

      gsap.to(logoGroup.value, {
        scale: scaleFactor, x: targetX, y: targetY,
        transformOrigin: '50% 50%',
        duration: 0.5, ease: 'power3.inOut',
      })
    })

  tl.to({}, { duration: 0.28 })
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
  <div ref="splash" class="splash-v3" role="presentation">
    <button
      ref="skipBtn"
      type="button"
      class="splash-skip"
      @click="finish"
    >
      {{ t('a11y.skipIntro') }}
    </button>

    <div ref="logoGroup" class="logo-group" aria-hidden="true">
      <!-- Le viewBox est la caméra : il démarre À L'INTÉRIEUR du O et le travelling
           le tire en arrière. Plein viewport, re-rendu vectoriel à chaque frame.
           Les fenêtres exactes (ratio vw/vh) sont posées au mount. -->
      <svg
        ref="logoSvg"
        class="logo-svg"
        viewBox="138 11 28 17.5"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <clipPath id="v3-glyph-clip">
            <circle cx="158.5" cy="18.5" r="18.5" />
          </clipPath>
        </defs>

        <!-- Lettres dark sur fond blanc — le O est l'ancre de la caméra -->
        <g ref="lettersGroup" fill="#24272E">
          <path id="v3-a1" class="v3-letter" d="M25.735 29.2004H10.089L7.28289 36.807H0L13.811 0.119141H22.3888L36.1997 36.807H28.5395L25.7333 29.2004H25.735ZM12.1924 23.5881H23.63L18.9905 11.0166L17.912 7.23933L16.8335 11.0166L12.1941 23.5881H12.1924Z" />
          <path id="v3-a2" class="v3-letter" d="M63.2313 29.2004H47.5854L44.7792 36.807H37.4963L51.309 0.119141H59.8868L73.6978 36.807H66.0358L63.2297 29.2004H63.2313ZM49.6904 23.5881H61.128L56.4885 11.0166L55.41 7.23933L54.3315 11.0166L49.6921 23.5881H49.6904Z" />
          <path id="v3-x" class="v3-letter" d="M93.4447 26.1242L91.9335 23.5344L90.3685 26.1242L82.9229 36.807H75.261L88.1562 17.8701L76.1801 0.119141H84.5969L91.0713 9.23701L92.7436 12.0968L94.4159 9.23701L100.781 0.119141H108.388L96.4656 17.7611L109.305 36.8053H100.889L93.443 26.1225L93.4447 26.1242Z" />
          <path id="v3-l" class="v3-letter" d="M113.891 0.119141H121.174V30.9263H138.168V36.807H113.889V0.119141H113.891Z" />
          <g ref="oLetter" class="v3-letter">
            <path class="o-outer" d="M141 18.553C141 7.1401 147.664 0 158.473 0C169.283 0 176 7.1401 176 18.553C176 29.9659 169.283 37.002 158.473 37.002C147.664 37.002 141 29.9659 141 18.553Z" />
            <path ref="oInner" class="o-inner" d="M148.241 18.553C148.241 26.474 152.02 31.164 158.473 31.164C164.927 31.164 168.759 26.422 168.759 18.553C168.759 10.684 164.929 5.837 158.473 5.837C152.018 5.837 148.241 10.632 148.241 18.553Z" fill="#FCFCFC" />
          </g>
        </g>

        <!-- Morph group : disque + 10 stripes de découpe — IDENTIQUES à l'original -->
        <g ref="morphGroup" opacity="0">
          <g clip-path="url(#v3-glyph-clip)">
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

    <!-- Le viseur photo — collimateurs, grille des tiers, lecture technique -->
    <div ref="viewfinder" class="viewfinder" aria-hidden="true">
      <span class="vf-corner vf-tl" />
      <span class="vf-corner vf-tr" />
      <span class="vf-corner vf-bl" />
      <span class="vf-corner vf-br" />
      <span class="vf-grid vf-grid-v1" />
      <span class="vf-grid vf-grid-v2" />
      <span class="vf-grid vf-grid-h1" />
      <span class="vf-grid vf-grid-h2" />
      <span class="vf-cross" />
      <span class="vf-meta vf-meta-tl">PRISE 001 — AAXLO</span>
      <span class="vf-meta vf-meta-tr">RAW</span>
      <div class="vf-readout">
        <span class="vf-af" :data-locked="afLocked">{{ afStatus }}</span>
        <span class="vf-sep">·</span>
        <span>ƒ/2.8</span>
        <span class="vf-sep">·</span>
        <span ref="readoutFocal" class="vf-focal">1470 mm</span>
      </div>
    </div>

    <!-- L'obturateur — frame noire du déclic -->
    <div ref="shutter" class="shutter" aria-hidden="true" />
  </div>
</template>

<style scoped>
.splash-v3 {
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
  .splash-v3 { display: none !important; }
}

.logo-group {
  position: absolute;
  inset: 0;
  z-index: 1;
  will-change: transform;
}

.logo-svg {
  display: block;
  width: 100%;
  height: 100%;
  will-change: transform, filter;
}

/* ── Le viseur photo ── */
.viewfinder {
  position: absolute;
  inset: 0;
  z-index: 2;
  opacity: 0;
  pointer-events: none;
  font-family: ui-monospace, 'SF Mono', Menlo, monospace;
  font-size: clamp(10px, 1.1vw, 12px);
  letter-spacing: 0.1em;
  color: #24272e;
  --vf-inset: clamp(18px, 5vw, 56px);
}

.vf-corner {
  position: absolute;
  width: clamp(18px, 2.6vw, 30px);
  height: clamp(18px, 2.6vw, 30px);
}
.vf-tl { top: var(--vf-inset); left: var(--vf-inset); border-top: 1.5px solid currentColor; border-left: 1.5px solid currentColor; }
.vf-tr { top: var(--vf-inset); right: var(--vf-inset); border-top: 1.5px solid currentColor; border-right: 1.5px solid currentColor; }
.vf-bl { bottom: var(--vf-inset); left: var(--vf-inset); border-bottom: 1.5px solid currentColor; border-left: 1.5px solid currentColor; }
.vf-br { bottom: var(--vf-inset); right: var(--vf-inset); border-bottom: 1.5px solid currentColor; border-right: 1.5px solid currentColor; }

/* Grille des tiers */
.vf-grid {
  position: absolute;
  background: currentColor;
  opacity: 0.1;
}
.vf-grid-v1 { top: var(--vf-inset); bottom: var(--vf-inset); left: 33.33%; width: 0.5px; }
.vf-grid-v2 { top: var(--vf-inset); bottom: var(--vf-inset); left: 66.66%; width: 0.5px; }
.vf-grid-h1 { left: var(--vf-inset); right: var(--vf-inset); top: 33.33%; height: 0.5px; }
.vf-grid-h2 { left: var(--vf-inset); right: var(--vf-inset); top: 66.66%; height: 0.5px; }

/* Croix de visée centrale */
.vf-cross {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 16px;
  height: 16px;
  transform: translate(-50%, -50%);
  opacity: 0.5;
}
.vf-cross::before,
.vf-cross::after {
  content: '';
  position: absolute;
  background: currentColor;
}
.vf-cross::before { top: 50%; left: 0; right: 0; height: 1px; margin-top: -0.5px; }
.vf-cross::after { left: 50%; top: 0; bottom: 0; width: 1px; margin-left: -0.5px; }

.vf-meta {
  position: absolute;
  opacity: 0.6;
}
.vf-meta-tl { top: calc(var(--vf-inset) + 6px); left: calc(var(--vf-inset) + 42px); }
.vf-meta-tr { top: calc(var(--vf-inset) + 6px); right: calc(var(--vf-inset) + 42px); }

.vf-readout {
  position: absolute;
  bottom: calc(var(--vf-inset) + 6px);
  left: calc(var(--vf-inset) + 42px);
  display: flex;
  gap: 10px;
  opacity: 0.85;
}

.vf-sep { opacity: 0.4; }

.vf-af[data-locked='true'] { color: #ff8270; }

.vf-focal {
  font-variant-numeric: tabular-nums;
  min-width: 7ch;
}

/* L'obturateur */
.shutter {
  position: absolute;
  inset: 0;
  background: #24272e;
  opacity: 0;
  z-index: 3;
  pointer-events: none;
}

.v3-letter {
  will-change: transform;
}

.cutout-stripe {
  transform-origin: center 0;
}
</style>
