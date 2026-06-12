<script setup>
import { gsap } from 'gsap'
import { initScrollReveal, initScrollExit } from '~/composables/useScrollReveal'

const { data: homeContent } = await useLocalizedContent('/home')
const { data: servicesContent } = await useLocalizedContent('/services')

useContentSeo(homeContent)

// Session cookie (SSR-aware) — the splash plays once per browser session and
// replays only on a genuinely fresh visit. Functional storage; no consent needed.
const splashSeen = useCookie('aaxlo_splash_seen', { sameSite: 'lax', path: '/' })
const splashPlayed = useState('splashPlayed', () => false)
const animsPlayed = useState('animsPlayed', () => false)

const showSplash = ref(!splashSeen.value && !splashPlayed.value)
const heroReady = ref(!showSplash.value)
const skipAnimations = computed(() => animsPlayed.value)
const showSocialProof = ref(false)

// When the splash won't show (returning this session), present the page in its
// already-played state so the header reveals at once and forge reveals are skipped.
if (!showSplash.value) splashPlayed.value = true

// Section refs for scroll reveal
const s2Ref = ref(null)
const s3Ref = ref(null)
const s4Ref = ref(null)
const s5Ref = ref(null)
const s6Ref = ref(null)
const s7Ref = ref(null)
const s9Ref = ref(null)

function onSplashReveal() {
  heroReady.value = true
}

function onSplashComplete() {
  splashSeen.value = '1' // remember for this session
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
      if (s2Ref.value) {
        initScrollReveal(s2Ref.value, 'curtain-tear', { duration: 1.3 })
        initScrollExit(s2Ref.value)
      }
      if (s3Ref.value) {
        initScrollReveal(s3Ref.value, 'ignite', { duration: 1.4, ease: 'power2.out' })
        initScrollExit(s3Ref.value)
      }
      if (s4Ref.value) {
        initScrollReveal(s4Ref.value, 'crack', { duration: 1.2 })
        initScrollExit(s4Ref.value)
      }
      if (s5Ref.value) {
        initScrollReveal(s5Ref.value, 'breathe', { duration: 1.3 })
        initScrollExit(s5Ref.value)
      }
      if (s6Ref.value) {
        initScrollReveal(s6Ref.value, 'slash-reverse', { duration: 1.3 })
        initScrollExit(s6Ref.value)
      }
      if (s7Ref.value) {
        initScrollReveal(s7Ref.value, 'melt', { duration: 1.2, ease: 'power2.inOut' })
        initScrollExit(s7Ref.value)
      }
      if (s9Ref.value) {
        initScrollReveal(s9Ref.value, 'iris', { duration: 1.4, ease: 'power2.out' })
      }
    }
  })
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

/* Forge section wrappers */
.forge-section {
  position: relative;
  will-change: clip-path, transform, opacity;
  transform-origin: center top;
  margin-top: -1px; /* Bridge micro-gaps between sections */
}
</style>
