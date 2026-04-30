<template>
  <div class="reveal-section content-section art-list">
    <ol class="art-list-items">
      <slot />
    </ol>
  </div>
</template>

<style scoped>
.content-section { margin-bottom: clamp(36px, 5vw, 52px); }
.art-list-items {
  list-style: none;
  margin: 0;
  padding: 0;
  border-top: 0.5px solid rgba(36, 39, 46, 0.15);
}
</style>
