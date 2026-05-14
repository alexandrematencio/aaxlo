<script setup>
defineProps({
  businessName: { type: String, required: true },
  scores: { type: Object, required: true },
})

function scoreBand(score) {
  if (score >= 75) return 'good'
  if (score >= 50) return 'mid'
  return 'low'
}
</script>

<template>
  <section class="teaser">
    <span class="teaser-label">{{ $t('audit_teaser.label') }}</span>
    <h2 class="teaser-headline">{{ $t('audit_teaser.headline_prefix', { business: businessName }) }}</h2>

    <div class="teaser-overall" :class="`band-${scoreBand(scores.overall)}`">
      <span class="overall-label">{{ $t('audit_teaser.score_label_overall') }}</span>
      <span class="overall-value">{{ scores.overall }}<span class="overall-max">/100</span></span>
    </div>

    <div class="teaser-grid">
      <div class="teaser-cell" :class="`band-${scoreBand(scores.gbp)}`">
        <span class="cell-label">{{ $t('audit_teaser.score_label_gbp') }}</span>
        <span class="cell-value">{{ scores.gbp }}</span>
      </div>
      <div class="teaser-cell" :class="`band-${scoreBand(scores.website)}`">
        <span class="cell-label">{{ $t('audit_teaser.score_label_website') }}</span>
        <span class="cell-value">{{ scores.website }}</span>
      </div>
      <div class="teaser-cell" :class="`band-${scoreBand(scores.reviews)}`">
        <span class="cell-label">{{ $t('audit_teaser.score_label_reviews') }}</span>
        <span class="cell-value">{{ scores.reviews }}</span>
      </div>
      <div class="teaser-cell" :class="`band-${scoreBand(scores.social)}`">
        <span class="cell-label">{{ $t('audit_teaser.score_label_social') }}</span>
        <span class="cell-value">{{ scores.social }}</span>
      </div>
    </div>

    <p class="teaser-inbox">{{ $t('audit_teaser.inbox_note') }}</p>

    <div class="teaser-upsell">
      <span class="upsell-label">{{ $t('audit_teaser.upsell_label') }}</span>
      <p class="upsell-body">{{ $t('audit_teaser.upsell_body') }}</p>
      <a :href="$t('audit_teaser.booking_url')" target="_blank" rel="noopener" class="upsell-cta">
        {{ $t('audit_teaser.upsell_cta') }}
      </a>
    </div>
  </section>
</template>

<style scoped>
.teaser { display: flex; flex-direction: column; }
.teaser-label { font-family: var(--font); font-size: 11px; font-weight: 500; letter-spacing: 0.15em; text-transform: uppercase; color: var(--color-accent); margin-bottom: 8px; }
.teaser-headline { font-family: var(--font); font-size: clamp(32px, 5vw, 48px); font-weight: 600; color: var(--color-dark); line-height: 1.1; letter-spacing: -0.02em; margin: 0 0 32px 0; }
.teaser-overall { border: 0.5px solid var(--color-dark); padding: 24px; display: flex; flex-direction: column; gap: 4px; }
.overall-label { font-family: var(--font); font-size: 11px; letter-spacing: 0.15em; text-transform: uppercase; color: var(--color-muted); }
.overall-value { font-family: var(--font); font-size: clamp(60px, 10vw, 96px); font-weight: 600; letter-spacing: -0.04em; color: var(--color-dark); line-height: 1; }
.overall-max { font-size: 0.4em; color: var(--color-muted); margin-left: 8px; }
.teaser-grid { display: grid; grid-template-columns: repeat(4, 1fr); border: 0.5px solid var(--color-dark); border-top: none; }
.teaser-cell { padding: 16px; border-right: 0.5px solid var(--color-border); display: flex; flex-direction: column; gap: 8px; }
.teaser-cell:last-child { border-right: none; }
.cell-label { font-family: var(--font); font-size: 10px; letter-spacing: 0.12em; text-transform: uppercase; color: var(--color-muted); }
.cell-value { font-family: var(--font); font-size: 28px; font-weight: 600; color: var(--color-dark); }
.band-low .cell-value, .band-low .overall-value { color: var(--color-accent); }
.teaser-inbox { font-family: var(--font); font-size: 14px; color: var(--color-muted); margin: 24px 0 32px 0; }
.teaser-upsell { border: 0.5px solid var(--color-dark); background: var(--color-peach); padding: 32px; }
.upsell-label { display: block; font-family: var(--font); font-size: 11px; font-weight: 500; letter-spacing: 0.15em; text-transform: uppercase; color: var(--color-accent); margin-bottom: 8px; }
.upsell-body { font-family: var(--font); font-size: 17px; line-height: 1.5; color: var(--color-dark); margin: 0 0 24px 0; }
.upsell-cta { display: inline-block; font-family: var(--font); font-size: 14px; font-weight: 600; letter-spacing: 0.05em; text-transform: uppercase; padding: 16px 32px; background: var(--color-dark); color: var(--color-cream); text-decoration: none; transition: background 0.3s; }
.upsell-cta:hover { background: var(--color-accent); color: var(--color-dark); }
@media (max-width: 768px) {
  .teaser-grid { grid-template-columns: repeat(2, 1fr); }
  .teaser-cell:nth-child(2) { border-right: none; }
  .teaser-cell:nth-child(1), .teaser-cell:nth-child(2) { border-bottom: 0.5px solid var(--color-border); }
  .teaser-upsell { padding: 24px; }
}
</style>
