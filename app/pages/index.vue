<script setup>
import { gsap } from 'gsap'
import { initScrollReveal, initScrollExit } from '~/composables/useScrollReveal'

const { data: homeContent } = await useLocalizedContent('/home')
const { data: servicesContent } = await useLocalizedContent('/services')

useHead({
  title: homeContent.value?.seo?.title || 'AAXLO',
  meta: [
    { name: 'description', content: homeContent.value?.seo?.description || '' },
  ],
})

const splashPlayed = useState('splashPlayed', () => false)
const animsPlayed = useState('animsPlayed', () => false)

const showSplash = ref(!splashPlayed.value)
const heroReady = ref(splashPlayed.value)
const skipAnimations = computed(() => animsPlayed.value)
const showSocialProof = ref(false)

// Section refs for scroll reveal
const s2Ref = ref(null)
const s3Ref = ref(null)
const s4Ref = ref(null)
const s5Ref = ref(null)
const s6Ref = ref(null)
const s7Ref = ref(null)
const s9Ref = ref(null)

// Energy line ref
const energyLine = ref(null)

function onSplashReveal() {
  heroReady.value = true
}

function onSplashComplete() {
  splashPlayed.value = true
  showSplash.value = false
  // Set up forge BEFORE marking anims as played
  setupForge(false)
  // Mark anims played after forge is set up
  animsPlayed.value = true
}

function setupForge(skip = false) {
  nextTick(() => {
    if (!skip) {
      // First visit: set up cinematic scroll reveals
      const pulse = pulseEnergyLine
      if (s2Ref.value) {
        initScrollReveal(s2Ref.value, 'curtain-tear', { duration: 1.3, onRevealed: pulse })
        initScrollExit(s2Ref.value)
      }
      if (s3Ref.value) {
        initScrollReveal(s3Ref.value, 'ignite', { duration: 1.4, ease: 'power2.out', onRevealed: pulse })
        initScrollExit(s3Ref.value)
      }
      if (s4Ref.value) {
        initScrollReveal(s4Ref.value, 'crack', { duration: 1.2, onRevealed: pulse })
        initScrollExit(s4Ref.value)
      }
      if (s5Ref.value) {
        initScrollReveal(s5Ref.value, 'breathe', { duration: 1.3, onRevealed: pulse })
        initScrollExit(s5Ref.value)
      }
      if (s6Ref.value) {
        initScrollReveal(s6Ref.value, 'slash-reverse', { duration: 1.3, onRevealed: pulse })
        initScrollExit(s6Ref.value)
      }
      if (s7Ref.value) {
        initScrollReveal(s7Ref.value, 'melt', { duration: 1.2, ease: 'power2.inOut', onRevealed: pulse })
        initScrollExit(s7Ref.value)
      }
      if (s9Ref.value) {
        initScrollReveal(s9Ref.value, 'iris', { duration: 1.4, ease: 'power2.out', onRevealed: pulse })
      }
    }

    // Energy line pulses are wired to onRevealed callbacks above
  })
}

function pulseEnergyLine() {
  const line = energyLine.value
  if (!line) return
  // Brief flash on section reveal — appears then fades
  line.style.visibility = 'visible'
  gsap.fromTo(line,
    { opacity: 0 },
    { opacity: 0.35, duration: 0.15, ease: 'power2.out',
      onComplete: () => {
        gsap.to(line, { opacity: 0, duration: 0.6, ease: 'power2.in',
          onComplete: () => { line.style.visibility = 'hidden' }
        })
      }
    }
  )
}

onMounted(() => {
  if (splashPlayed.value && !animsPlayed.value) {
    heroReady.value = true
  }
  // If splash already played (returning to page), skip forge reveals
  if (splashPlayed.value) {
    setupForge(true)
  }
})
</script>

<template>
  <div class="homepage">
    <SplashScreen
      v-if="showSplash"
      @reveal="onSplashReveal"
      @complete="onSplashComplete"
    />

    <!-- The Forge — energy line -->
    <div ref="energyLine" class="energy-line" aria-hidden="true"></div>

    <!-- S1: Hero (has its own splash animation) -->
    <HomepageHero :content="homeContent?.hero" :animate="heroReady" :skip="skipAnimations" />

    <!-- S2: Checklist — Curtain tear -->
    <div ref="s2Ref" class="forge-section">
      <HomeChecklist :content="homeContent?.checklist" :skip="skipAnimations" />
    </div>

    <!-- S3: The Shift — Ignite (dark) -->
    <div ref="s3Ref" class="forge-section">
      <HomeShift :content="homeContent?.shift" :skip="skipAnimations" />
    </div>

    <!-- S4: Services Grid — Crack -->
    <div ref="s4Ref" class="forge-section">
      <ServicesShowcase :content="servicesContent?.showcase" :skip="skipAnimations" />
    </div>

    <!-- S5: Speed — Breathe -->
    <div ref="s5Ref" class="forge-section">
      <HowItWorks :content="homeContent?.howItWorks" :skip="skipAnimations" />
    </div>

    <!-- S6: Emotional Beat — Slash reverse (dark) -->
    <div ref="s6Ref" class="forge-section">
      <HomeEmotional :content="homeContent?.emotional" :skip="skipAnimations" />
    </div>

    <!-- S7: Audit Form — Melt -->
    <div ref="s7Ref" class="forge-section">
      <AuditFlow mode="teaser" :skip="skipAnimations" />
    </div>

    <!-- S8: Social Proof (hidden) -->
    <HomeSocialProof v-if="showSocialProof" :content="homeContent?.socialProof" :skip="skipAnimations" />

    <!-- S9: The Close — Iris -->
    <div ref="s9Ref" class="forge-section">
      <HomeClose :content="homeContent?.close" :skip="skipAnimations" />
    </div>
  </div>
</template>

<style>
.homepage {
  min-height: 100vh;
  position: relative;
}

/* The Forge — energy line (subtle, only pulses during scroll) */
.energy-line {
  position: fixed;
  top: 64px;
  left: 50%;
  width: 1px;
  height: calc(100vh - 64px);
  background: linear-gradient(
    to bottom,
    transparent 0%,
    rgba(255, 130, 112, 0.4) 20%,
    rgba(255, 130, 112, 0.4) 80%,
    transparent 100%
  );
  z-index: 50;
  pointer-events: none;
  opacity: 0;
  visibility: hidden;
  will-change: opacity;
}

/* Forge section wrappers */
.forge-section {
  position: relative;
  will-change: clip-path, transform, opacity;
  transform-origin: center top;
  margin-top: -1px; /* Bridge micro-gaps between sections */
}
</style>
