<template>
  <div class="reveal-section content-section art-paragraph">
    <p class="paragraph-text"><slot /></p>
  </div>
</template>

<style scoped>
.content-section { margin-bottom: clamp(16px, 2.5vw, 24px); }
.paragraph-text {
  font-family: var(--font);
  font-size: clamp(16px, 1.25vw, 18px);
  font-weight: 400;
  color: var(--color-dark);
  line-height: 1.82;
  opacity: 0.88;
}
</style>
