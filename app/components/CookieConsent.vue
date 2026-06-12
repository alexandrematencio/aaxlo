<script setup>
const { t } = useI18n()
const localePath = useLocalePath()
const { decided, acceptAll, rejectAll } = useConsent()
</script>

<template>
  <Transition name="consent-fade">
    <section
      v-if="!decided"
      class="consent"
      role="region"
      :aria-label="$t('consent.ariaLabel')"
    >
      <div class="consent-inner">
        <div class="consent-copy">
          <p class="consent-title">{{ $t('consent.title') }}</p>
          <p class="consent-message">
            {{ $t('consent.message') }}
            <NuxtLink :to="localePath('/legal/privacy')" class="consent-link">
              {{ $t('consent.learnMore') }}
            </NuxtLink>
          </p>
        </div>
        <div class="consent-actions">
          <button type="button" class="consent-btn consent-btn--ghost" @click="rejectAll">
            {{ $t('consent.reject') }}
          </button>
          <button type="button" class="consent-btn consent-btn--solid" @click="acceptAll">
            {{ $t('consent.accept') }}
          </button>
        </div>
      </div>
    </section>
  </Transition>
</template>

<style scoped>
.consent {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9500;
  background: var(--color-white, #fcfcfc);
  border-top: 0.5px solid var(--color-dark, #24272e);
  box-shadow: 0 -8px 30px rgba(36, 39, 46, 0.08);
}

.consent-inner {
  max-width: 1320px;
  margin: 0 auto;
  padding: 20px clamp(20px, 4vw, 48px);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 32px;
}

.consent-copy { max-width: 720px; }

.consent-title {
  font-family: var(--font, sans-serif);
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--color-dark, #24272e);
  margin-bottom: 6px;
}

.consent-message {
  font-family: var(--font, sans-serif);
  font-size: 14px;
  font-weight: 300;
  line-height: 1.6;
  color: var(--color-muted, #5e6370);
}

.consent-link {
  color: var(--color-accent-text, #c44530);
  text-decoration: underline;
}

.consent-actions {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
}

.consent-btn {
  font-family: var(--font, sans-serif);
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.03em;
  padding: 12px 22px;
  cursor: pointer;
  white-space: nowrap;
  border: 0.5px solid var(--color-dark, #24272e);
  transition: background 0.25s, color 0.25s;
}

.consent-btn--ghost {
  background: transparent;
  color: var(--color-dark, #24272e);
}
.consent-btn--ghost:hover {
  background: var(--color-dark, #24272e);
  color: var(--color-cream, #fff1ef);
}

.consent-btn--solid {
  background: var(--color-dark, #24272e);
  color: var(--color-cream, #fff1ef);
}
.consent-btn--solid:hover {
  background: var(--color-accent, #ff8270);
  color: var(--color-dark, #24272e);
}

.consent-fade-enter-active,
.consent-fade-leave-active {
  transition: transform 0.35s ease, opacity 0.35s ease;
}
.consent-fade-enter-from,
.consent-fade-leave-to {
  transform: translateY(100%);
  opacity: 0;
}

@media (max-width: 720px) {
  .consent-inner {
    flex-direction: column;
    align-items: stretch;
    gap: 16px;
  }
  .consent-actions {
    justify-content: stretch;
  }
  .consent-btn {
    flex: 1;
    text-align: center;
  }
}

@media (prefers-reduced-motion: reduce) {
  .consent-fade-enter-active,
  .consent-fade-leave-active {
    transition: none;
  }
  .consent-fade-enter-from,
  .consent-fade-leave-to {
    transform: none;
  }
}
</style>
