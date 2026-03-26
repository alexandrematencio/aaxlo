<template>
  <div class="stat-item">
    <div
      class="stat-value"
      :data-value="numericValue"
      :data-suffix="suffix"
    >{{ value }}</div>
    <p class="stat-label">{{ label }}</p>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  value: string
  label: string
}>()

const numericValue = computed(() => props.value.replace(/[^0-9.]/g, ''))
const suffix = computed(() => props.value.replace(/[0-9.]/g, ''))
</script>

<style scoped>
.stat-item {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 28px 20px;
  border-right: 0.5px solid rgba(36, 39, 46, 0.12);
}
.stat-item:last-child { border-right: none; }
.stat-value {
  font-family: var(--font);
  font-size: clamp(30px, 3vw, 44px);
  font-weight: 700;
  color: var(--color-dark);
  letter-spacing: -0.04em;
  line-height: 1;
}
.stat-label {
  font-family: var(--font);
  font-size: 11px;
  font-weight: 300;
  color: var(--color-muted);
  line-height: 1.5;
}
</style>
