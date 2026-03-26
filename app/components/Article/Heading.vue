<template>
  <div class="reveal-section content-section art-heading">
    <span class="heading-rule" aria-hidden="true"></span>
    <component :is="level" :id="id" class="heading-text">{{ content }}</component>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  content: string
  id: string
  level?: 'h2' | 'h3' | 'h4'
}>()
const level = computed(() => props.level || 'h2')
</script>

<style scoped>
.content-section { margin-bottom: clamp(24px, 3vw, 36px); }
.heading-rule {
  display: block;
  width: 32px;
  height: 0.5px;
  background: var(--color-accent);
  margin-bottom: clamp(10px, 1.5vw, 16px);
}
.heading-text {
  font-family: var(--font);
  font-size: clamp(20px, 2vw, 26px);
  font-weight: 600;
  color: var(--color-dark);
  line-height: 1.15;
  letter-spacing: -0.02em;
}
</style>
