<script setup>
import '~/assets/css/main.css'

useHead({
  title: 'AAXLO — Your local business, amplified by AI',
})
</script>

<template>
  <div id="app-root">
    <AppHeader />
    <NuxtPage />
    <AppFooter />
    <StripeTransition />
  </div>
</template>

<style>
/* Page transition: cinematic wipe */
.page-enter-active,
.page-leave-active {
  transition: clip-path 0.6s cubic-bezier(0.77, 0, 0.175, 1),
              opacity 0.6s cubic-bezier(0.77, 0, 0.175, 1);
}

.page-enter-from {
  clip-path: inset(0 0 100% 0);
  opacity: 0;
}
.page-enter-to {
  clip-path: inset(0 0 0% 0);
  opacity: 1;
}

.page-leave-from {
  clip-path: inset(0 0 0% 0);
  opacity: 1;
}
.page-leave-to {
  clip-path: inset(100% 0 0 0);
  opacity: 0;
}
</style>
