<template>
  <div class="reveal-section content-section">
    <blockquote class="art-pullquote">
      <div class="pullquote-accent" aria-hidden="true">
        <svg width="24" height="18" viewBox="0 0 24 18" fill="none">
          <path d="M0 18V10.5C0 7.5 0.833 5.167 2.5 3.5L4.5 5.5C3.667 6.5 3.167 7.667 3 9H6V18H0ZM14 18V10.5C14 7.5 14.833 5.167 16.5 3.5L18.5 5.5C17.667 6.5 17.167 7.667 17 9H20V18H14Z" fill="var(--color-accent)"/>
        </svg>
      </div>
      <p class="pullquote-text"><slot /></p>
      <cite v-if="attribution" class="pullquote-attribution">{{ attribution }}</cite>
    </blockquote>
  </div>
</template>

<script setup lang="ts">
defineProps<{ attribution?: string }>()
</script>

<style scoped>
.content-section { margin-bottom: clamp(36px, 5vw, 52px); }
.art-pullquote {
  position: relative;
  padding: 28px 32px;
  background: var(--color-peach);
  border-left: 2px solid var(--color-accent);
  margin: 4px 0;
}
.pullquote-accent { margin-bottom: 14px; opacity: 0.9; }
.pullquote-text {
  font-family: var(--font);
  font-size: clamp(16px, 1.4vw, 19px);
  font-weight: 500;
  color: var(--color-dark);
  line-height: 1.5;
  letter-spacing: -0.01em;
  font-style: italic;
}
.pullquote-attribution {
  display: block;
  margin-top: 14px;
  font-family: var(--font);
  font-size: 10px;
  font-weight: 500;
  color: var(--color-muted);
  letter-spacing: 0.08em;
  font-style: normal;
}
</style>
