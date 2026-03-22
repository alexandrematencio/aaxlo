<script setup>
import { gsap } from 'gsap'
import { MorphSVGPlugin } from 'gsap/MorphSVGPlugin'
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin'

definePageMeta({ layout: false })

// ── Refs ──
const splash = ref(null)
const bgRect = ref(null)
const logoGroup = ref(null)
const logoSvg = ref(null)
const morphRect = ref(null)
const a1 = ref(null)
const a2 = ref(null)
const xLetter = ref(null)
const lLetter = ref(null)
const oLetter = ref(null)
const morphGroup = ref(null)
const solidDisk = ref(null)
const glyphGroup = ref(null)
const multiEl = ref(null)
const localOpsEl = ref(null)

onMounted(async () => {
  await nextTick()
  if (!splash.value || !logoSvg.value) return

  const vw = window.innerWidth
  const vh = window.innerHeight

  // ══════════════════════════════════════════════════════
  // COORDINATE SYSTEM
  // Full logo viewBox = "0 0 177 37"
  // A1: x 0–36, A2: x 37–74, X: x 75–109, L: x 110–138, O: x 141–176
  // A1 center: x≈18, A2 center: x≈55.5
  // Midpoint between both As: x≈37
  // ══════════════════════════════════════════════════════
  const svgEl = logoSvg.value
  const svgRect = svgEl.getBoundingClientRect()
  const pxPerUnit = svgRect.width / 177
  const groupRect = logoGroup.value.getBoundingClientRect()

  // ── Position HTML overlays relative to SVG coords ──
  const multiLeftPx = svgRect.left + 92 * pxPerUnit - groupRect.left
  const multiTopPx = svgRect.top + 18.5 * pxPerUnit - groupRect.top
  const multiFontSize = 37 * pxPerUnit * 1.1

  const labLeftPx = svgRect.left + 115 * pxPerUnit - groupRect.left
  const labTopPx = svgRect.top + 18.5 * pxPerUnit - groupRect.top
  const labFontSize = Math.max(10, 8 * pxPerUnit)

  gsap.set(multiEl.value, {
    left: multiLeftPx, top: multiTopPx, fontSize: multiFontSize, opacity: 0,
    scale: 0, rotation: -720,
  })
  gsap.set(localOpsEl.value, {
    left: labLeftPx, top: labTopPx, fontSize: labFontSize, opacity: 0,
  })

  // ── Initial state: hide all SVG letters ──
  gsap.set([a1.value, a2.value, xLetter.value, lLetter.value, oLetter.value], { opacity: 0 })
  gsap.set(morphGroup.value, { opacity: 0 })
  gsap.set(solidDisk.value, { opacity: 0 })
  gsap.set(glyphGroup.value, { opacity: 0 })

  // ── morphRect: starts as a rounded rectangle, will morph into A shape ──
  // Position it centered between where A1 and A2 will land (x≈37 center)
  // The A letter is ~36 wide, ~37 tall. Rounded rect same size.
  gsap.set(morphRect.value, { opacity: 0 })

  // ── Background rect: compute target for a SINGLE A-sized rectangle ──
  // Exact from logo: A1 is 36.2 units wide, midpoint of both As at x=36.849
  const singleAWidth = 36.2 * pxPerUnit
  const singleAHeight = 37 * pxPerUnit
  const aCenterXpx = svgRect.left + 36.849 * pxPerUnit
  const aCenterYpx = svgRect.top + 18.5 * pxPerUnit

  const insetTop = aCenterYpx - singleAHeight / 2
  const insetRight = vw - (aCenterXpx + singleAWidth / 2)
  const insetBottom = vh - (aCenterYpx + singleAHeight / 2)
  const insetLeft = aCenterXpx - singleAWidth / 2

  gsap.set(bgRect.value, { clipPath: 'inset(0px 0px 0px 0px)', opacity: 1 })

  // ══════════════════════════════════════════════════════
  // TIMELINE
  // ══════════════════════════════════════════════════════
  const tl = gsap.timeline()

  // ══════════════════════════════════════════════════════
  // PHASE 1: Full #24272E screen → shrinks to single-A-sized rectangle
  // ══════════════════════════════════════════════════════
  tl.to(bgRect.value, {
    clipPath: `inset(${insetTop}px ${insetRight}px ${insetBottom}px ${insetLeft}px)`,
    duration: 0.9,
    ease: 'power2.inOut',
  })

  // ══════════════════════════════════════════════════════
  // PHASE 1b: Rectangle → rounds corners → morphs into A shape
  // Crossfade from CSS bg-rect to SVG morphRect (rounded rect path),
  // then morphSVG into the A letter outline.
  // ══════════════════════════════════════════════════════

  // Add border-radius to the bg-rect as it finishes shrinking
  .to(bgRect.value, {
    borderRadius: '6px',
    duration: 0.3,
    ease: 'power2.inOut',
  }, '-=0.3')

  // Show the SVG rounded-rect path (positioned to overlap the bg-rect)
  // and fade out the bg-rect
  .call(() => {
    gsap.set(morphRect.value, { opacity: 1 })
  })
  .to(bgRect.value, { opacity: 0, duration: 0.15, ease: 'power2.in' })

  // MorphSVG: rounded rectangle → A letter shape
  // The rect path is centered at x≈36.85, but A1's path coords are at x: 0–36.2
  // Compensate with x: 18.749 so visually the shape stays centered during morph
  .to(morphRect.value, {
    morphSVG: {
      shape: a1.value.querySelector('path'),
      shapeIndex: 'auto',
    },
    x: 18.749,
    duration: 0.7,
    ease: 'power2.inOut',
  }, '-=0.05')

  // ══════════════════════════════════════════════════════
  // PHASE 2: CELL DIVISION — seamless from morph completion
  // morphRect is already A-shaped. We place A1 and A2 beneath it
  // at the same center position, then instantly swap and split.
  // No gap, no flash — the morphRect IS the first A.
  // ══════════════════════════════════════════════════════
  .call(() => {
    // EXACT logo coordinates:
    // A1 bbox: x 0 → 36.1997, center = 18.1
    // A2 bbox: x 37.4963 → 73.6978, center = 55.597
    // Midpoint between both A centers = 36.8485
    // A1 offset to overlap at midpoint = +18.749
    // A2 offset to overlap at midpoint = -18.749
    // NO svgOrigin — it leaves residual transform offsets even at scale 1
    gsap.set(a1.value, { opacity: 1, x: 18.749 })
    gsap.set(a2.value, { opacity: 1, x: -18.749 })
    gsap.set(morphRect.value, { opacity: 0 })
  })

  // Squeeze before split — organic cell division tension
  .to(a1.value, { scaleX: 1.15, scaleY: 0.92, duration: 0.15, ease: 'power2.in' })
  .to(a2.value, { scaleX: 1.15, scaleY: 0.92, duration: 0.15, ease: 'power2.in' }, '<')

  // Split apart! Each A springs to its EXACT logo position
  .to(a1.value, {
    x: 0, scaleX: 1, scaleY: 1,
    duration: 0.65,
    ease: 'elastic.out(1, 0.55)',
  })
  .to(a2.value, {
    x: 0, scaleX: 1, scaleY: 1,
    duration: 0.65,
    ease: 'elastic.out(1, 0.55)',
  }, '<')

  // Clear ALL transforms so the <g> elements sit at pure path coordinates
  .call(() => {
    a1.value.removeAttribute('transform')
    a2.value.removeAttribute('transform')
    gsap.set(a1.value, { opacity: 1 })
    gsap.set(a2.value, { opacity: 1 })
  })

  // ══════════════════════════════════════════════════════
  // PHASE 3: × rotates in — fast and snappy
  // ══════════════════════════════════════════════════════
  .to(multiEl.value, {
    opacity: 1, scale: 1, rotation: 0,
    duration: 0.35, ease: 'back.out(1.7)',
  }, '+=0.05')

  // ══════════════════════════════════════════════════════
  // PHASE 4: "Local Operations" scramble text reveal — follows quickly
  // ══════════════════════════════════════════════════════
  .to(localOpsEl.value, { opacity: 1, duration: 0.01 }, '+=0.08')
  .to(localOpsEl.value, {
    scrambleText: {
      text: 'Local Operations',
      chars: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
      speed: 0.5,
      revealDelay: 0.3,
    },
    duration: 1.2,
    ease: 'none',
  })

  // ══════════════════════════════════════════════════════
  // PHASE 5: "Local" → "L", "Operations" → "O", snap to "LO"
  // ══════════════════════════════════════════════════════
  .call(() => {
    const localText = 'Local'
    const opsText = 'Operations'
    localOpsEl.value.innerHTML =
      localText.split('').map((ch, i) =>
        `<span class="char-el ${i === 0 ? 'keep-char' : 'fade-char'}" style="display:inline-block">${ch}</span>`
      ).join('') +
      '<span class="space-char" style="display:inline-block">&nbsp;</span>' +
      opsText.split('').map((ch, i) =>
        `<span class="char-el ${i === 0 ? 'keep-char' : 'fade-char'}" style="display:inline-block">${ch}</span>`
      ).join('')
  }, null, '+=0.35')

  .call(() => {
    const fadeChars = localOpsEl.value.querySelectorAll('.fade-char')
    const spaceChar = localOpsEl.value.querySelector('.space-char')

    gsap.to(fadeChars, {
      opacity: 0,
      width: 0,
      marginRight: 0,
      paddingRight: 0,
      duration: 0.45,
      ease: 'power2.inOut',
      stagger: 0.02,
    })
    gsap.to(spaceChar, {
      width: 0, opacity: 0,
      duration: 0.35, delay: 0.15,
      ease: 'power2.inOut',
    })
  })
  .to({}, { duration: 0.5 })

  // ── PHASE 5b: "LO" scales up via SVG letters (crisp, no blur) ──
  .call(() => {
    const svgRect = logoSvg.value.getBoundingClientRect()
    const pxPerUnit = svgRect.width / 177
    const targetHeight = 37 * pxPerUnit
    const textHeight = parseFloat(getComputedStyle(localOpsEl.value).fontSize)
    const startScale = textHeight / targetHeight

    gsap.set(lLetter.value, { opacity: 0, scale: startScale, svgOrigin: '126 18.5' })
    gsap.set(oLetter.value, { opacity: 0, scale: startScale, svgOrigin: '158.5 18.5' })
  })

  // Crossfade HTML "LO" → SVG L + O and scale up
  .to(localOpsEl.value, { opacity: 0, duration: 0.15, ease: 'power2.in' })
  .to(lLetter.value, { opacity: 1, duration: 0.15, ease: 'power2.out' }, '<')
  .to(oLetter.value, { opacity: 1, duration: 0.15, ease: 'power2.out' }, '<+=0.02')

  .to(lLetter.value, {
    scale: 1,
    svgOrigin: '126 18.5',
    duration: 0.5,
    ease: 'elastic.out(1, 0.6)',
  }, '-=0.12')
  .to(oLetter.value, {
    scale: 1,
    svgOrigin: '158.5 18.5',
    duration: 0.5,
    ease: 'elastic.out(1, 0.6)',
  }, '<+=0.03')

  // ── PHASE 5c: × spins out → becomes SVG X letter ──
  // After LO is scaled up, right before O morphs to glyph
  .to(multiEl.value, {
    rotation: 360 * 2 + 45, scale: 0.6, opacity: 0,
    duration: 0.3, ease: 'power2.inOut',
  }, '+=0.05')
  .to(xLetter.value, {
    opacity: 1, duration: 0.2, ease: 'power2.out',
  }, '-=0.1')

  // ══════════════════════════════════════════════════════
  // PHASE 6: O → morphs to perfect circle
  // ══════════════════════════════════════════════════════
  .to({}, { duration: 0.1 })
  .call(() => {
    const outerPath = oLetter.value.querySelector('.o-outer')
    if (outerPath) {
      gsap.to(outerPath, {
        morphSVG: {
          shape: `M141,18.5 C141,7.14 147.664,0 158.5,0 C169.336,0 176,7.14 176,18.5 C176,29.86 169.336,37 158.5,37 C147.664,37 141,29.86 141,18.5 Z`,
          shapeIndex: 0,
        },
        duration: 0.5,
        ease: 'power2.inOut',
      })
    }
    const innerPath = oLetter.value.querySelector('.o-inner')
    if (innerPath) {
      gsap.to(innerPath, {
        scale: 0, opacity: 0,
        svgOrigin: '158.5 18.5',
        duration: 0.4,
        ease: 'power2.in',
      })
    }
  })
  .to({}, { duration: 0.4 })

  // ── PHASE 6b: Crossfade morphed O → disk with stripe cutouts ──
  .to(oLetter.value, { opacity: 0, duration: 0.15, ease: 'power2.in' })
  .call(() => {
    gsap.set(morphGroup.value, { opacity: 1 })
    gsap.set(solidDisk.value, { opacity: 1 })
  })

  .call(() => {
    const stripes = morphGroup.value.querySelectorAll('.cutout-stripe')
    gsap.set(stripes, { scaleY: 0 })
    gsap.to(stripes, {
      scaleY: 1,
      duration: 0.06,
      stagger: 0.025,
      ease: 'back.out(3)',
    })
  })
  .to({}, { duration: 0.35 })

  // ── PHASE 6c: Rotate disk 45° anticlockwise ──
  .to(morphGroup.value, {
    rotation: -45,
    svgOrigin: '158.5 18.5',
    duration: 0.5,
    ease: 'elastic.out(1, 0.7)',
  })

  // ── PHASE 7: Glyph replaces disk (glyph is NOT rotated) ──
  .to(morphGroup.value, { opacity: 0, duration: 0.2, ease: 'power2.inOut' }, '+=0.15')
  .to(glyphGroup.value, {
    opacity: 1,
    duration: 0.25,
    ease: 'power2.out',
  }, '<+=0.05')

  // Hold final state
  .to({}, { duration: 2.0 })
})
</script>

<template>
  <div ref="splash" class="splash-review">
    <!-- Full-screen bg that shrinks -->
    <div ref="bgRect" class="bg-rect" />

    <!-- Logo group (centered in viewport) -->
    <div ref="logoGroup" class="logo-group">

      <svg
        ref="logoSvg"
        class="logo-svg"
        viewBox="0 0 177 37"
        fill="none"
        overflow="visible"
        xmlns="http://www.w3.org/2000/svg"
      >
        <!-- morphRect: rounded rectangle centered at midpoint of both As (x=36.849) -->
        <!-- A1 width = 36.2, so rect spans x: 18.749 to 54.949, height 0–37 -->
        <path
          ref="morphRect"
          d="M22.749,0 L50.949,0 Q54.949,0 54.949,4 L54.949,33 Q54.949,37 50.949,37 L22.749,37 Q18.749,37 18.749,33 L18.749,4 Q18.749,0 22.749,0 Z"
          fill="#24272E"
          opacity="0"
        />

        <!-- A1 (x: 0–36) -->
        <g ref="a1" opacity="0">
          <path d="M25.735 29.2004H10.089L7.28289 36.807H0L13.811 0.119141H22.3888L36.1997 36.807H28.5395L25.7333 29.2004H25.735ZM12.1924 23.5881H23.63L18.9905 11.0166L17.912 7.23933L16.8335 11.0166L12.1941 23.5881H12.1924Z" fill="#24272E"/>
        </g>

        <!-- A2 (x: 37–74) -->
        <g ref="a2" opacity="0">
          <path d="M63.2313 29.2004H47.5854L44.7792 36.807H37.4963L51.309 0.119141H59.8868L73.6978 36.807H66.0358L63.2297 29.2004H63.2313ZM49.6904 23.5881H61.128L56.4885 11.0166L55.41 7.23933L54.3315 11.0166L49.6921 23.5881H49.6904Z" fill="#24272E"/>
        </g>

        <!-- X (x: 75–109) -->
        <g ref="xLetter" opacity="0">
          <path d="M93.4447 26.1242L91.9335 23.5344L90.3685 26.1242L82.9229 36.807H75.261L88.1562 17.8701L76.1801 0.119141H84.5969L91.0713 9.23701L92.7436 12.0968L94.4159 9.23701L100.781 0.119141H108.388L96.4656 17.7611L109.305 36.8053H100.889L93.443 26.1225L93.4447 26.1242Z" fill="#24272E"/>
        </g>

        <!-- L (x: 114–138) -->
        <g ref="lLetter" opacity="0">
          <path d="M113.891 0.119141H121.174V30.9263H138.168V36.807H113.889V0.119141H113.891Z" fill="#24272E"/>
        </g>

        <!-- O letter with separate outer/inner for morphSVG -->
        <g ref="oLetter" opacity="0">
          <path class="o-outer" d="M141 18.553C141 7.1401 147.664 0 158.473 0C169.283 0 176 7.1401 176 18.553C176 29.9659 169.283 37.002 158.473 37.002C147.664 37.002 141 29.9659 141 18.553Z" fill="#24272E"/>
          <path class="o-inner" d="M148.241 18.553C148.241 26.474 152.02 31.164 158.473 31.164C164.927 31.164 168.759 26.422 168.759 18.553C168.759 10.684 164.929 5.837 158.473 5.837C152.018 5.837 148.241 10.632 148.241 18.553Z" fill="white"/>
        </g>

        <!-- MORPH GROUP: disk + stripe cutouts -->
        <defs>
          <clipPath id="review-glyph-clip">
            <circle cx="158.5" cy="18.5" r="18.5"/>
          </clipPath>
        </defs>

        <g ref="morphGroup" opacity="0">
          <g clip-path="url(#review-glyph-clip)">
            <circle ref="solidDisk" cx="158.5" cy="18.5" r="18.5" fill="#24272E" opacity="0"/>
            <rect class="cutout-stripe" x="141.762" y="0" width="1.762" height="37" fill="white"/>
            <rect class="cutout-stripe" x="145.286" y="0" width="1.762" height="37" fill="white"/>
            <rect class="cutout-stripe" x="148.810" y="0" width="1.762" height="37" fill="white"/>
            <rect class="cutout-stripe" x="152.333" y="0" width="1.762" height="37" fill="white"/>
            <rect class="cutout-stripe" x="155.857" y="0" width="1.762" height="37" fill="white"/>
            <rect class="cutout-stripe" x="159.381" y="0" width="1.762" height="37" fill="white"/>
            <rect class="cutout-stripe" x="162.905" y="0" width="1.762" height="37" fill="white"/>
            <rect class="cutout-stripe" x="166.429" y="0" width="1.762" height="37" fill="white"/>
            <rect class="cutout-stripe" x="169.952" y="0" width="1.762" height="37" fill="white"/>
            <rect class="cutout-stripe" x="173.476" y="0" width="1.762" height="37" fill="white"/>
          </g>
        </g>

        <!-- REAL GLYPH (final state — orange diagonal stripes) -->
        <g ref="glyphGroup" opacity="0">
          <path d="M141.179 24.7734C142.073 27.2357 143.506 29.5471 145.48 31.5229C147.454 33.4971 149.765 34.9312 152.229 35.8236L141.179 24.7734Z" fill="#FF8270"/>
          <path d="M140.074 18.6797C140.084 19.6106 140.165 20.5398 140.316 21.4607L155.54 36.6856C156.461 36.8366 157.391 36.9171 158.321 36.9272L140.074 18.6797Z" fill="#FF8270"/>
          <path d="M140.572 14.1895C140.403 14.9023 140.277 15.6236 140.193 16.3498L160.651 36.808C161.378 36.7241 162.099 36.5983 162.812 36.4289L140.572 14.1895Z" fill="#FF8270"/>
          <path d="M141.87 10.502C141.59 11.089 141.342 11.6895 141.127 12.2967L164.703 35.873C165.312 35.6583 165.911 35.41 166.498 35.1299L141.87 10.502Z" fill="#FF8270"/>
          <path d="M143.752 7.39648C143.383 7.88794 143.041 8.39448 142.729 8.9111L168.09 34.2721C168.608 33.9584 169.113 33.6162 169.605 33.2489L143.752 7.39648Z" fill="#FF8270"/>
          <path d="M146.131 4.78516C145.911 4.98476 145.693 5.19107 145.48 5.40408C145.267 5.6171 145.061 5.83348 144.861 6.05488L170.945 32.1388C171.165 31.9392 171.383 31.7328 171.596 31.5198C171.809 31.3068 172.015 31.0904 172.215 30.869L146.131 4.78516Z" fill="#FF8270"/>
          <path d="M148.987 2.65625C148.469 2.96991 147.962 3.3104 147.471 3.67941L173.322 29.5301C173.691 29.0387 174.031 28.5321 174.345 28.0138L148.987 2.65625Z" fill="#FF8270"/>
          <path d="M152.374 1.05469C151.765 1.26938 151.166 1.51763 150.577 1.79774L175.204 26.424C175.484 25.837 175.732 25.2365 175.947 24.6276L152.374 1.05469Z" fill="#FF8270"/>
          <path d="M156.426 0.119141C155.7 0.203006 154.978 0.327127 154.266 0.496536L176.503 22.7343C176.673 22.0215 176.799 21.2986 176.881 20.574L156.426 0.119141Z" fill="#FF8270"/>
          <path d="M175.896 12.1536C175.004 9.69135 173.572 7.38002 171.596 5.40414C169.621 3.42995 167.31 1.99585 164.846 1.10352L175.895 12.152L175.896 12.1536Z" fill="#FF8270"/>
          <path d="M161.537 0.24321C160.616 0.0922522 159.685 0.0100639 158.754 0L177 18.2458C176.99 17.3149 176.908 16.384 176.757 15.4631L161.537 0.24321Z" fill="#FF8270"/>
        </g>
      </svg>

      <!-- HTML overlays -->
      <span ref="multiEl" class="sp-overlay sp-multi" style="opacity:0">&times;</span>
      <span ref="localOpsEl" class="sp-overlay sp-local-ops" style="opacity:0">&nbsp;</span>
    </div>
  </div>
</template>

<style scoped>
.splash-review {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.bg-rect {
  position: absolute;
  inset: 0;
  background: #24272E;
  will-change: clip-path;
  z-index: 0;
}

.logo-group {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
  will-change: transform;
}

.logo-svg {
  width: clamp(320px, 55vw, 880px);
  height: auto;
}

.sp-overlay {
  position: absolute;
  font-family: var(--font);
  color: #24272E;
  white-space: nowrap;
  will-change: transform, opacity;
  transform: translate(-50%, -50%);
  pointer-events: none;
}

.sp-multi {
  font-weight: 300;
}

.sp-local-ops {
  font-weight: 400;
  letter-spacing: 0.08em;
  transform: translate(0, -50%);
}

.cutout-stripe {
  transform-origin: center 0;
}
</style>
