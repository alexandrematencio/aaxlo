<script setup>
const props = defineProps({
  status: { type: String, required: true },
})

const STEPS = ['gbp', 'website', 'reviews', 'social', 'scoring']
const visualStep = ref(0)
let stepTimer = null

onMounted(() => {
  stepTimer = setInterval(() => {
    if (visualStep.value < STEPS.length - 1) {
      visualStep.value++
    } else if (stepTimer) {
      clearInterval(stepTimer)
    }
  }, 18000)
})

onBeforeUnmount(() => {
  if (stepTimer) clearInterval(stepTimer)
})

watch(() => props.status, (s) => {
  if (['teaser_ready', 'pdf_ready', 'delivered'].includes(s)) {
    visualStep.value = STEPS.length
    if (stepTimer) clearInterval(stepTimer)
  }
})
</script>

<template>
  <div class="processing-steps">
    <div
      v-for="(stepKey, i) in STEPS"
      :key="stepKey"
      class="processing-step"
      :class="{
        'is-done': i < visualStep,
        'is-running': i === visualStep && !['teaser_ready', 'pdf_ready', 'delivered'].includes(status),
      }"
    >
      <span class="step-num">0{{ i + 1 }}</span>
      <span class="step-label">{{ $t('audit_processing.step_' + stepKey) }}</span>
      <span class="step-status">
        {{ i < visualStep
            ? $t('audit_processing.status_done')
            : (i === visualStep ? $t('audit_processing.status_running') : '') }}
      </span>
    </div>
  </div>
</template>

<style scoped>
.processing-steps { display: flex; flex-direction: column; gap: 0; margin-top: 32px; }
.processing-step { display: grid; grid-template-columns: 48px 1fr auto; align-items: center; gap: 16px; padding: 20px 16px; border: 0.5px solid var(--color-border); border-bottom: none; font-family: var(--font); transition: background 0.3s, opacity 0.3s; opacity: 0.4; }
.processing-step:last-child { border-bottom: 0.5px solid var(--color-border); }
.processing-step.is-done { opacity: 1; }
.processing-step.is-running { opacity: 1; background: var(--color-peach); }
.step-num { font-size: 11px; font-weight: 500; letter-spacing: 0.15em; color: var(--color-muted); }
.step-label { font-size: 16px; font-weight: 500; color: var(--color-dark); }
.step-status { font-family: monospace; font-size: 12px; color: var(--color-muted); text-transform: uppercase; letter-spacing: 0.1em; }
.is-done .step-status { color: var(--color-accent); }
.is-running .step-status { color: var(--color-dark); }
</style>
