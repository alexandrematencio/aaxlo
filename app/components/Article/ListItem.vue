<template>
  <li class="art-list-item reveal-section content-section">
    <span v-if="label" class="list-marker" aria-hidden="true">{{ label }}</span>
    <span class="list-text"><slot /></span>
  </li>
</template>

<script setup lang="ts">
defineProps<{
  label?: string
}>()
</script>

<style scoped>
.content-section { margin-bottom: 0; }
.art-list-item {
  display: flex;
  align-items: baseline;
  gap: 18px;
  padding: 22px 24px;
  border-bottom: 0.5px solid rgba(36, 39, 46, 0.12);
  list-style: none;
}
.art-list-item:last-child { border-bottom: none; }
.list-marker {
  font-family: var(--font);
  font-size: 14px;
  font-weight: 600;
  color: var(--color-accent);
  letter-spacing: 0.08em;
  flex-shrink: 0;
  line-height: 1.8;
}
.list-text {
  font-family: var(--font);
  font-size: clamp(14px, 1.1vw, 16px);
  font-weight: 400;
  color: var(--color-dark);
  line-height: 1.7;
  opacity: 0.88;
}
</style>
