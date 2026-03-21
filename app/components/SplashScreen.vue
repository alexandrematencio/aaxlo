<script setup>
import { gsap } from 'gsap'

const emit = defineEmits(['reveal', 'complete'])

const splash = ref(null)
const logoGroup = ref(null)
const logoSvg = ref(null)
const a1 = ref(null)
const a2 = ref(null)
const xLetter = ref(null)
const lLetter = ref(null)
const oLetter = ref(null)
const glyphGroup = ref(null)
const morphGroup = ref(null)
const solidDisk = ref(null)
const labOps = ref(null)
const cursorEl = ref(null)
const multiEl = ref(null)

onMounted(async () => {
  await nextTick()
  if (!logoSvg.value || !splash.value) return

  const vw = window.innerWidth
  const vh = window.innerHeight
  const headerH = 64

  // ══════════════════════════════════════════════════════
  // SVG COORDINATE SYSTEM — all positions derived from the logo viewBox
  // viewBox is 0 0 177 37. The SVG scales uniformly via CSS.
  // Convert viewport coords ↔ SVG coords using the rendered scale.
  // ══════════════════════════════════════════════════════
  const svgEl = logoSvg.value
  const svgRect = svgEl.getBoundingClientRect()
  const pxPerUnit = svgRect.width / 177
  const groupRect = logoGroup.value.getBoundingClientRect()

  // A1 center in SVG coords: ~18
  const a1Center = 18
  // Viewport center in SVG coords (SVG is centered on screen)
  const svgCenterX = 88.5
  // Right viewport edge in SVG coords
  const rightEdge = (vw - svgRect.left) / pxPerUnit
  // Impact point: A1 center reaches near the right viewport edge
  const impactX = rightEdge - a1Center - 5

  // ── Position HTML overlays relative to SVG coords ──
  // × overlay: positioned at X letter center (SVG x≈92)
  const multiLeftPx = svgRect.left + 92 * pxPerUnit - groupRect.left
  const multiTopPx = svgRect.top + 18.5 * pxPerUnit - groupRect.top
  const multiFontSize = 37 * pxPerUnit * 1.1

  // Lab Ops: positioned right of X (SVG x≈120, past the X letter's right edge)
  const labLeftPx = svgRect.left + 120 * pxPerUnit - groupRect.left
  const labTopPx = svgRect.top + 18.5 * pxPerUnit - groupRect.top
  const labFontSize = Math.max(12, 8 * pxPerUnit)

  // Set overlay positions and sizes
  gsap.set(multiEl.value, {
    left: multiLeftPx, top: multiTopPx, fontSize: multiFontSize, opacity: 0,
  })
  gsap.set(labOps.value, {
    left: labLeftPx, top: labTopPx, fontSize: labFontSize, opacity: 0,
  })
  gsap.set(cursorEl.value, {
    left: labLeftPx, top: labTopPx, fontSize: labFontSize, opacity: 0,
  })

  const tl = gsap.timeline({
    onComplete: () => {
      if (splash.value) splash.value.style.display = 'none'
      emit('complete')
    },
  })

  // ══════════════════════════════════════════════════════
  // PHASE 1: A1 appears at viewport center, accelerates to right wall
  // ══════════════════════════════════════════════════════
  // A1 starts at center of viewport (translated from its natural x=0 position)
  const a1ToCenterX = svgCenterX - a1Center
  gsap.set(a1.value, { opacity: 1, x: a1ToCenterX })

  // ~0.0s
  tl.to(a1.value, { opacity: 1, duration: 0.2, ease: 'power2.out' })
  .to(a1.value, { x: impactX, duration: 0.7, ease: 'power2.in' })    // ~0.9s

  // PHASE 2 ~0.9s
  gsap.set(a2.value, { opacity: 0, scale: 0, svgOrigin: '55.6 18.5' })

  tl.to(a1.value, { x: 0, duration: 0.5, ease: 'power2.out' })
  .to(a2.value, {
    opacity: 1, scale: 1, duration: 0.3, ease: 'back.out(2.5)',
  }, '<+=0.05')                                                        // ~1.45s

  // PHASE 3 ~1.45s
  gsap.set(xLetter.value, { opacity: 0 })
  gsap.set(multiEl.value, { scale: 0, rotation: -180 })

  tl.to(multiEl.value, {
    opacity: 1, scale: 1.1, rotation: 0,
    duration: 0.25, ease: 'back.out(1.7)',
  }, '+=0.08')
  .to(multiEl.value, {
    rotation: 360 * 3 + 45, scale: 0.7, opacity: 0,
    duration: 0.4, ease: 'power2.inOut',
  }, '+=0.08')
  .to(xLetter.value, { opacity: 1, duration: 0.15, ease: 'power2.out' }, '-=0.15')  // ~2.26s

  // PHASE 4: "Lab Operations" typewriter ~2.26s
  gsap.set(labOps.value, { opacity: 1, clipPath: 'inset(-0.1em 100% -0.25em 0)' })
  let cursorBlink = null
  const labWidth = labOps.value.getBoundingClientRect().width

  tl.call(() => {
    gsap.set(cursorEl.value, { opacity: 1 })
    cursorBlink = gsap.to(cursorEl.value, {
      opacity: 0, duration: 0.4, yoyo: true, repeat: -1, ease: 'steps(1)',
    })
  }, null, '+=0.05')
  .to(labOps.value, { clipPath: 'inset(0 0% 0 0)', duration: 0.4, ease: 'steps(15)' })
  .to(cursorEl.value, {
    left: labLeftPx + labWidth + 4,
    duration: 0.4, ease: 'steps(15)',
  }, '<')                                                              // ~2.71s

  // PHASE 5: "ab" and "perations" disappear, L and O scale up + relocate
  const labFadeEls = labOps.value.querySelectorAll('.lab-fade')
  const labSpaceEl = labOps.value.querySelector('.lab-space')
  const labKeepL = labOps.value.querySelectorAll('.lab-keep')[0]
  const labKeepO = labOps.value.querySelectorAll('.lab-keep')[1]

  // Prepare: hide SVG L and O (they appear after the HTML ones arrive)
  gsap.set(lLetter.value, { opacity: 0 })
  gsap.set(oLetter.value, { opacity: 0 })

  // Kill cursor
  tl.call(() => { if (cursorBlink) cursorBlink.kill() }, null, '+=0.15')
  .to(cursorEl.value, { opacity: 0, duration: 0.08 }, '<')

  // Fade out "ab", " ", "perations"
  .to(labFadeEls, { opacity: 0, duration: 0.2, ease: 'power2.in' })
  .to(labSpaceEl, { opacity: 0, duration: 0.2, ease: 'power2.in' }, '<')

  // Promote L and O to independent absolutely-positioned elements,
  // then animate font-size + position with a smooth continuous flow.
  // We use independent gsap.to() calls but reserve matching time on the timeline.
  .call(() => {
    const groupRect = logoGroup.value.getBoundingClientRect()
    const svgRect = logoSvg.value.getBoundingClientRect()
    const pxPerUnit = svgRect.width / 177

    const targetFontSize = 37 * pxPerUnit
    const currentFontSize = parseFloat(getComputedStyle(labKeepL).fontSize)

    // Measure current positions BEFORE reparenting
    const lRect = labKeepL.getBoundingClientRect()
    const oRect = labKeepO.getBoundingClientRect()

    // Reparent L and O into logoGroup (out of labOps) so absolute positioning
    // is relative to logoGroup, not the labOps container
    logoGroup.value.appendChild(labKeepL)
    logoGroup.value.appendChild(labKeepO)

    const lStartLeft = lRect.left - groupRect.left
    const lStartTop = lRect.top - groupRect.top
    const oStartLeft = oRect.left - groupRect.left
    const oStartTop = oRect.top - groupRect.top

    // Place them at their current screen positions (now relative to logoGroup)
    gsap.set(labKeepL, {
      position: 'absolute',
      left: lStartLeft,
      top: lStartTop,
      fontSize: currentFontSize,
      fontWeight: 600,
      color: '#24272E',
      fontFamily: 'var(--font)',
    })
    gsap.set(labKeepO, {
      position: 'absolute',
      left: oStartLeft,
      top: oStartTop,
      fontSize: currentFontSize,
      fontWeight: 600,
      color: '#24272E',
      fontFamily: 'var(--font)',
    })

    // Hide the empty labOps container
    gsap.set(labOps.value, { opacity: 0 })

    // SVG L target: center x≈126, O target: center x≈158.5
    const lTargetLeft = svgRect.left + 114 * pxPerUnit - groupRect.left
    const oTargetLeft = svgRect.left + 141 * pxPerUnit - groupRect.left
    const targetTop = svgRect.top - groupRect.top

    // Single smooth scale+reposition using transform only (GPU-accelerated)
    // Animating fontSize/left/top causes layout thrashing and stutters.
    const scaleDur = 0.6
    const scaleEase = 'power3.inOut'
    const scaleFactor = targetFontSize / currentFontSize

    // Calculate translation needed (from current position to target position)
    // After scaling, the origin shifts — account for scale offset
    const lDx = lTargetLeft - lStartLeft
    const lDy = targetTop - lStartTop
    const oDx = oTargetLeft - oStartLeft
    const oDy = targetTop - oStartTop

    gsap.to(labKeepL, {
      scale: scaleFactor,
      x: lDx,
      y: lDy,
      duration: scaleDur,
      ease: scaleEase,
      transformOrigin: '0 0',
    })

    gsap.to(labKeepO, {
      scale: scaleFactor,
      x: oDx,
      y: oDy,
      duration: scaleDur,
      ease: scaleEase,
      transformOrigin: '0 0',
    })

    // Cross-fade near end of scale: HTML letters → SVG letters
    gsap.to(labKeepL, { opacity: 0, duration: 0.15, delay: scaleDur - 0.18, ease: 'power1.in' })
    gsap.to(labKeepO, { opacity: 0, duration: 0.15, delay: scaleDur - 0.18, ease: 'power1.in' })
    gsap.to(lLetter.value, { opacity: 1, duration: 0.15, delay: scaleDur - 0.18, ease: 'power1.out' })
    gsap.to(oLetter.value, { opacity: 1, duration: 0.15, delay: scaleDur - 0.18, ease: 'power1.out' })
  })

  // Reserve time on the timeline matching the scale animation duration
  tl.to({}, { duration: 0.65 })

  // PHASE 6: O → disk → stripes → tilt → glyph
  const stripeRects = morphGroup.value.querySelectorAll('.cutout-stripe')
  gsap.set(morphGroup.value, { opacity: 1 })
  gsap.set(solidDisk.value, { opacity: 0 })
  gsap.set(stripeRects, { scaleY: 0 })
  gsap.set(glyphGroup.value, { opacity: 0 })

  tl.to(solidDisk.value, { opacity: 1, duration: 0.25, ease: 'power2.inOut' }, '+=0.1')
  .to(oLetter.value, { opacity: 0, duration: 0.2, ease: 'power2.in' }, '-=0.15')
  .to(stripeRects, {
    scaleY: 1, duration: 0.03, stagger: 0.02, ease: 'power1.out',
  }, '+=0.08')
  .to(morphGroup.value, {
    rotation: -45, svgOrigin: '158.5 18.5',
    duration: 0.35, ease: 'power3.inOut',
  }, '+=0.08')
  .to(morphGroup.value, { opacity: 0, duration: 0.2, ease: 'power2.inOut' }, '+=0.05')
  .to(glyphGroup.value, { opacity: 1, duration: 0.2, ease: 'power2.inOut' }, '<')  // ~4.1s

  // PHASE 8: Logo scales down and flies to the header logo position
  tl.call(() => emit('reveal'), null, '+=0.15')
  .call(() => {
    // Find the actual header logo element to get its exact position
    const headerLogo = document.querySelector('.header-logo .logo-img')
      || document.querySelector('.header-logo')
    const currentSvgRect = logoSvg.value.getBoundingClientRect()
    const groupRect = logoGroup.value.getBoundingClientRect()

    // Target: 28px height logo in the header
    const scaleFactor = 28 / currentSvgRect.height

    // Calculate where the logo needs to land
    let targetX = 0
    let targetY = -(vh / 2) + headerH / 2

    if (headerLogo) {
      const headerRect = headerLogo.getBoundingClientRect()
      // The logo group is centered in viewport. We need to translate it
      // so the scaled SVG's center lands on the header logo's center.
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

  // Wait for scale-down to finish, then clip away immediately
  tl.to({}, { duration: 0.55 })
  .to(splash.value, {
    clipPath: `inset(0 0 ${vh - headerH}px 0)`,
    duration: 0.4, ease: 'power3.inOut',
  })
})
</script>

<template>
  <div ref="splash" class="splash">
    <div ref="logoGroup" class="logo-group">

      <!-- ═══ MAIN SVG — the single source of truth for all letter positions ═══ -->
      <svg
        ref="logoSvg"
        class="logo-svg"
        viewBox="0 0 177 37"
        fill="none"
        overflow="visible"
        xmlns="http://www.w3.org/2000/svg"
      >
        <!-- A1 (paths from full logo, x: 0–36) -->
        <g ref="a1" opacity="0">
          <path d="M25.735 29.2004H10.089L7.28289 36.807H0L13.811 0.119141H22.3888L36.1997 36.807H28.5395L25.7333 29.2004H25.735ZM12.1924 23.5881H23.63L18.9905 11.0166L17.912 7.23933L16.8335 11.0166L12.1941 23.5881H12.1924Z" fill="#24272E"/>
        </g>

        <!-- A2 (paths from full logo, x: 37–74) -->
        <g ref="a2" opacity="0">
          <path d="M63.2313 29.2004H47.5854L44.7792 36.807H37.4963L51.309 0.119141H59.8868L73.6978 36.807H66.0358L63.2297 29.2004H63.2313ZM49.6904 23.5881H61.128L56.4885 11.0166L55.41 7.23933L54.3315 11.0166L49.6921 23.5881H49.6904Z" fill="#24272E"/>
        </g>

        <!-- X (paths from full logo, x: 75–109) -->
        <g ref="xLetter" opacity="0">
          <path d="M93.4447 26.1242L91.9335 23.5344L90.3685 26.1242L82.9229 36.807H75.261L88.1562 17.8701L76.1801 0.119141H84.5969L91.0713 9.23701L92.7436 12.0968L94.4159 9.23701L100.781 0.119141H108.388L96.4656 17.7611L109.305 36.8053H100.889L93.443 26.1225L93.4447 26.1242Z" fill="#24272E"/>
        </g>

        <!-- L (paths from full logo, x: 114–138) -->
        <g ref="lLetter" opacity="0">
          <path d="M113.891 0.119141H121.174V30.9263H138.168V36.807H113.889V0.119141H113.891Z" fill="#24272E"/>
        </g>

        <!-- O letter (standalone, translated to glyph position x=141) -->
        <g ref="oLetter" opacity="0" transform="translate(141, 0)">
          <path d="M0 18.553C0 7.1401 6.66389 0 17.4733 0C28.2827 0 35 7.1401 35 18.553C35 29.9659 28.2827 37.0016 17.4733 37.0016C6.66389 37.0016 0 29.9659 0 18.553ZM27.7587 18.553C27.7587 10.6836 23.9286 5.83737 17.4733 5.83737C11.0181 5.83737 7.24132 10.6322 7.24132 18.553C7.24132 26.4738 11.0197 31.1642 17.4733 31.1642C23.9269 31.1642 27.7587 26.4224 27.7587 18.553Z" fill="#24272E"/>
        </g>

        <!-- ═══ MORPH GROUP (disk + stripe cutouts, clipped to circle) ═══ -->
        <defs>
          <clipPath id="glyph-clip">
            <circle cx="158.5" cy="18.5" r="18.5"/>
          </clipPath>
        </defs>

        <g ref="morphGroup" opacity="0">
          <g clip-path="url(#glyph-clip)">
            <!-- Solid dark disk -->
            <circle ref="solidDisk" cx="158.5" cy="18.5" r="18.5" fill="#24272E" opacity="0"/>
            <!-- 10 white stripe cutouts (parts 2,4,6,8,10,12,14,16,18,20 of 21) -->
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

        <!-- ═══ REAL GLYPH (final state — orange stripes) ═══ -->
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

      <!-- HTML overlays (×, Lab Ops, cursor) — positioned relative to SVG at runtime -->
      <span ref="multiEl" class="sp-overlay sp-multi" style="opacity:0">&times;</span>
      <span ref="labOps" class="sp-overlay sp-lab" style="opacity:0"><span class="lab-keep">L</span><span class="lab-fade">ab</span><span class="lab-space">&nbsp;</span><span class="lab-keep">O</span><span class="lab-fade">perations</span></span>
      <span ref="cursorEl" class="sp-overlay sp-cursor" style="opacity:0">|</span>
    </div>
  </div>
</template>

<style scoped>
.splash {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  will-change: clip-path, opacity, transform;
}

.logo-group {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  will-change: transform;
}

/* The SVG scales uniformly — this is the responsive magic */
.logo-svg {
  width: clamp(320px, 55vw, 880px);
  height: auto;
}

/* HTML overlays positioned absolutely relative to logo-group */
.sp-overlay {
  position: absolute;
  font-family: var(--font);
  color: var(--color-dark);
  white-space: nowrap;
  will-change: transform, opacity;
  transform: translate(-50%, -50%);
  pointer-events: none;
}

.sp-multi {
  font-weight: 300;
}

.sp-lab {
  font-weight: 600;
  letter-spacing: 0.08em;
  transform: translate(0, -50%);
  display: inline-flex;
  overflow: visible;
}

.sp-lab .lab-keep {
  display: inline-block;
  will-change: transform, opacity;
}

.sp-lab .lab-fade {
  display: inline-block;
  will-change: transform, opacity;
}

.sp-lab .lab-space {
  display: inline-block;
  will-change: transform, opacity;
}

.sp-cursor {
  font-weight: 200;
  color: var(--color-accent);
}

/* SVG stripe cutouts — transform-origin at top for scaleY animation */
.cutout-stripe {
  transform-origin: 0 0;
}
</style>
