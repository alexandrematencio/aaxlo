<template>
  <div class="reveal-section content-section art-stat-row">
    <div class="stat-row">
      <ArticleStat
        v-for="stat in stats"
        :key="stat.label"
        :value="stat.value"
        :label="stat.label"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  stats: Array<{ value: string; label: string }>
}>()
</script>

<style scoped>
.content-section { margin-bottom: clamp(36px, 5vw, 52px); }
.stat-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  border: 0.5px solid rgba(36, 39, 46, 0.15);
}

@media (max-width: 860px) {
  .stat-row { grid-template-columns: 1fr; }
}
</style>
