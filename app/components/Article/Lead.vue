<template>
  <div class="reveal-section content-section art-lead">
    <p class="lead-text"><slot /></p>
  </div>
</template>

<style scoped>
.content-section { margin-bottom: clamp(32px, 4vw, 48px); }
.art-lead { padding-top: clamp(4px, 1vw, 8px); }
.lead-text {
  font-family: var(--font);
  font-size: clamp(18px, 1.6vw, 22px);
  font-weight: 500;
  color: var(--color-dark);
  line-height: 1.75;
  letter-spacing: -0.01em;
}
</style>
