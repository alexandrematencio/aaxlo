<script setup>
const { user, clear } = useUserSession()

async function logout() {
  await $fetch('/api/auth/logout', { method: 'POST' })
  await clear()
  await navigateTo('/')
}
</script>

<template>
  <div class="admin-shell">
    <header class="admin-header">
      <span class="admin-brand">AAXLO · Admin</span>
      <div class="admin-user">
        <span class="user-email">{{ user?.email }}</span>
        <button class="logout-btn" @click="logout">Log out</button>
      </div>
    </header>
    <main class="admin-main">
      <slot />
    </main>
  </div>
</template>

<style scoped>
.admin-shell { min-height: 100vh; background: var(--color-cream); }
.admin-header { display: flex; justify-content: space-between; align-items: center; padding: 16px 32px; border-bottom: 0.5px solid var(--color-dark); background: var(--color-white); }
.admin-brand { font-family: var(--font); font-size: 14px; font-weight: 600; letter-spacing: 0.05em; color: var(--color-dark); }
.admin-user { display: flex; align-items: center; gap: 16px; }
.user-email { font-family: var(--font); font-size: 13px; color: var(--color-muted); }
.logout-btn { font-family: var(--font); font-size: 12px; padding: 6px 12px; background: transparent; border: 0.5px solid var(--color-dark); cursor: pointer; transition: background 0.2s; }
.logout-btn:hover { background: var(--color-dark); color: var(--color-cream); }
.admin-main { padding: 32px; }
</style>
