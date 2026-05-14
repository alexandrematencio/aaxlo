<script setup>
definePageMeta({ layout: false })
useHead({ title: 'Unauthorized · AAXLO Admin' })
</script>

<template>
  <main class="unauth-page">
    <div class="unauth-card">
      <span class="unauth-label">401</span>
      <h1 class="unauth-title">Unauthorized</h1>
      <p class="unauth-body">This area is restricted to AAXLO Workspace accounts.</p>
      <a href="/api/auth/google" class="unauth-cta">Try a different account</a>
    </div>
  </main>
</template>

<style scoped>
.unauth-page { min-height: 100vh; background: var(--color-cream); display: flex; align-items: center; justify-content: center; padding: 32px; }
.unauth-card { max-width: 480px; padding: 48px; border: 0.5px solid var(--color-dark); background: var(--color-white); text-align: center; }
.unauth-label { display: block; font-family: var(--font); font-size: 11px; letter-spacing: 0.15em; text-transform: uppercase; color: var(--color-accent); margin-bottom: 16px; }
.unauth-title { font-family: var(--font); font-size: 32px; font-weight: 600; color: var(--color-dark); margin: 0 0 16px 0; }
.unauth-body { font-family: var(--font); font-size: 16px; color: var(--color-muted); margin: 0 0 32px 0; }
.unauth-cta { display: inline-block; font-family: var(--font); font-size: 14px; font-weight: 600; letter-spacing: 0.05em; text-transform: uppercase; padding: 14px 28px; background: var(--color-dark); color: var(--color-cream); text-decoration: none; }
.unauth-cta:hover { background: var(--color-accent); color: var(--color-dark); }
</style>
