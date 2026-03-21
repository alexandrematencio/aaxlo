<script setup>
const splashPlayed = useState('splashPlayed', () => false)
const animsPlayed = useState('animsPlayed', () => false)

const showSplash = ref(!splashPlayed.value)
const heroReady = ref(splashPlayed.value)
const skipAnimations = computed(() => animsPlayed.value)

function onSplashReveal() {
  heroReady.value = true
}

function onSplashComplete() {
  splashPlayed.value = true
  animsPlayed.value = true
  showSplash.value = false
}

onMounted(() => {
  if (splashPlayed.value && !animsPlayed.value) {
    heroReady.value = true
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

    <!-- S1: Hero — Focus -->
    <HomepageHero :animate="heroReady" :skip="skipAnimations" />

    <!-- S2: Checklist — Self-recognition -->
    <HomeChecklist :skip="skipAnimations" />

    <!-- S3: The Shift — Insight (dark) -->
    <HomeShift :skip="skipAnimations" />

    <!-- S4: Services Grid — What we do -->
    <ServicesShowcase :skip="skipAnimations" />

    <!-- S5: Speed — Proof of pace -->
    <HowItWorks :skip="skipAnimations" />

    <!-- S6: Emotional Beat (dark) -->
    <HomeEmotional :skip="skipAnimations" />

    <!-- S7: Audit Form — Conversion -->
    <AuditFlow mode="teaser" :skip="skipAnimations" />

    <!-- S8: Social Proof — Trust -->
    <HomeSocialProof :skip="skipAnimations" />

    <!-- S9: The Close — Final push -->
    <HomeClose :skip="skipAnimations" />
  </div>
</template>

<style>
.homepage { min-height: 100vh; }
</style>
