<script setup>
const route = useRoute()

const auditId = computed(() => route.params.id)
const status = ref('queued')
const businessName = ref('')
const scores = ref(null)
const error = ref(null)

let pollInterval = null

async function pollStatus() {
  try {
    const res = await $fetch(`/api/audit/status/${auditId.value}`)
    status.value = res.status
    businessName.value = res.business_name
    if (['teaser_ready', 'pdf_ready', 'delivered'].includes(res.status)) {
      scores.value = {
        overall: res.score_overall,
        gbp: res.score_gbp,
        website: res.score_website,
        reviews: res.score_reviews,
        social: res.score_social,
      }
      clearInterval(pollInterval)
    }
  } catch (err) {
    error.value = err
    clearInterval(pollInterval)
  }
}

onMounted(() => {
  pollStatus()
  pollInterval = setInterval(pollStatus, 2000)
})

onBeforeUnmount(() => {
  if (pollInterval) clearInterval(pollInterval)
})

const showTeaser = computed(() => scores.value !== null)

useHead({ title: 'Recon report · AAXLO' })
</script>

<template>
  <main class="processing-page">
    <div class="processing-inner">
      <Transition name="fade" mode="out-in">
        <div v-if="!showTeaser && !error" key="progress">
          <span class="processing-label">01 / RECON</span>
          <h1 class="processing-title">{{ $t('audit_processing.title') }}</h1>
          <p class="processing-subtitle">{{ $t('audit_processing.subtitle') }}</p>
          <AuditProcessing :status="status" />
        </div>
        <AuditTeaserResult v-else-if="showTeaser" key="teaser" :business-name="businessName" :scores="scores" />
        <div v-else key="error" class="processing-error">
          <h2>{{ $t('audit_processing.error_title') }}</h2>
          <p>{{ $t('audit_processing.error_body') }}</p>
        </div>
      </Transition>
    </div>
  </main>
</template>

<style scoped>
.processing-page { min-height: 100vh; background: var(--color-cream); padding: 120px clamp(32px, 6vw, 96px); display: flex; justify-content: center; }
.processing-inner { max-width: 700px; width: 100%; }
.processing-label { display: block; font-family: var(--font); font-size: 11px; font-weight: 500; letter-spacing: 0.15em; text-transform: uppercase; color: rgba(36,39,46,0.5); margin-bottom: 8px; }
.processing-title { font-family: var(--font); font-size: clamp(32px, 5vw, 48px); font-weight: 600; color: var(--color-dark); line-height: 1.1; letter-spacing: -0.02em; margin: 0 0 16px 0; }
.processing-subtitle { font-family: var(--font); font-size: 20px; font-weight: 300; color: var(--color-dark); line-height: 1.6; margin: 0; }
.processing-error { margin-top: 32px; padding: 24px; border: 0.5px solid var(--color-accent); }
.fade-enter-active, .fade-leave-active { transition: opacity 0.4s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
