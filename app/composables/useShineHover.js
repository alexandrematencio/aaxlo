import { gsap } from 'gsap'

const SPARKLE_COUNT = 8

/**
 * Adds a GSAP-powered shine sweep + sparkle burst hover effect to accent CTA buttons.
 */
export function useShineHover(containerRef, selector = '[data-shine]') {
  const cleanups = []

  onMounted(() => {
    const container = containerRef.value
    if (!container) return

    const buttons = container.querySelectorAll(selector)

    buttons.forEach(btn => {
      // ── Shine element ──
      const shine = document.createElement('span')
      shine.className = 'btn-shine'
      shine.setAttribute('aria-hidden', 'true')
      btn.appendChild(shine)
      gsap.set(shine, { xPercent: -250 })

      // ── Sparkle container ──
      const sparkleWrap = document.createElement('span')
      sparkleWrap.className = 'btn-sparkle-wrap'
      sparkleWrap.setAttribute('aria-hidden', 'true')
      btn.appendChild(sparkleWrap)

      // Pre-create sparkle elements
      const sparkles = []
      for (let i = 0; i < SPARKLE_COUNT; i++) {
        const s = document.createElement('span')
        s.className = 'btn-sparkle'
        s.textContent = '✦'
        sparkleWrap.appendChild(s)
        sparkles.push(s)
        gsap.set(s, { opacity: 0, scale: 0 })
      }

      // Detect if button has dark background → swap to accent on hover, else swap to dark
      const computed = getComputedStyle(btn)
      const bgRgb = computed.backgroundColor
      // Parse rgb values to detect dark bg (r < 80 means dark)
      const rgbMatch = bgRgb.match(/\d+/g)
      const isDark = rgbMatch && parseInt(rgbMatch[0]) < 80
      const hoverBg = isDark ? '#FF8270' : '#24272e'
      const hoverColor = isDark ? '#24272e' : '#fff1ef'
      const origBg = bgRgb
      const origColor = computed.color

      // Collect all child elements that have an explicit color set
      const children = btn.querySelectorAll('*')
      const coloredChildren = []
      children.forEach(child => {
        if (child === shine || child === sparkleWrap || child.classList.contains('btn-sparkle')) return
        coloredChildren.push({ el: child, origColor: getComputedStyle(child).color })
      })

      function onEnter() {
        // ── Background + text color swap ──
        gsap.to(btn, {
          backgroundColor: hoverBg,
          color: hoverColor,
          duration: 0.3,
          ease: 'power2.out',
        })
        // Also swap all child element colors
        coloredChildren.forEach(({ el }) => {
          gsap.to(el, { color: hoverColor, duration: 0.3, ease: 'power2.out' })
        })

        // ── Shine sweep — fully exits on the right ──
        gsap.killTweensOf(shine)
        gsap.set(shine, { xPercent: -250 })
        gsap.to(shine, {
          xPercent: 350,
          duration: 0.5,
          ease: 'power2.out',
        })

        // ── Sparkle burst ──
        sparkles.forEach((s, i) => {
          gsap.killTweensOf(s)

          // Random position within the button
          const x = 15 + Math.random() * 70  // % from left
          const y = 10 + Math.random() * 80  // % from top

          gsap.set(s, {
            left: `${x}%`,
            top: `${y}%`,
            opacity: 0,
            scale: 0,
            rotation: Math.random() * 180,
          })

          // Pop in
          gsap.to(s, {
            opacity: 0.8 + Math.random() * 0.2,
            scale: 0.6 + Math.random() * 0.8,
            duration: 0.15,
            delay: 0.05 + i * 0.03,
            ease: 'back.out(3)',
          })

          // Drift and fade out
          gsap.to(s, {
            opacity: 0,
            scale: 0,
            y: -8 - Math.random() * 16,
            rotation: `+=${60 + Math.random() * 120}`,
            duration: 0.35,
            delay: 0.2 + i * 0.03,
            ease: 'power2.in',
          })
        })
      }

      function onLeave() {
        gsap.to(btn, {
          backgroundColor: origBg,
          color: origColor,
          duration: 0.25,
          ease: 'power2.out',
        })
        coloredChildren.forEach(({ el, origColor: oc }) => {
          gsap.to(el, { color: oc, duration: 0.25, ease: 'power2.out' })
        })
      }

      btn.addEventListener('mouseenter', onEnter)
      btn.addEventListener('mouseleave', onLeave)
      cleanups.push(() => {
        btn.removeEventListener('mouseenter', onEnter)
        btn.removeEventListener('mouseleave', onLeave)
        if (shine.parentNode) shine.remove()
        if (sparkleWrap.parentNode) sparkleWrap.remove()
      })
    })
  })

  onBeforeUnmount(() => {
    cleanups.forEach(fn => fn())
    cleanups.length = 0
  })
}
