<script setup>
/**
 * /splash-lab-3-2 — banc d'essai local du SplashScreenV5 (« LE MORPH »).
 * Variante de splash-lab-3 : hint souris animé, readout « MORPHING » au-dessus
 * du logo, skip « Skip animation / Passer l'animation », scroll plus lent (44%).
 * Page interne, noindex. À supprimer une fois un splash promu dans index.vue.
 */
useSeoMeta({
  title: 'Splash Lab 3.2 — AAXLO',
  robots: 'noindex, nofollow',
})

const localePath = useLocalePath()

const runId = ref(0)
const status = ref('running') // 'running' | 'done'
const lastDuration = ref(null)
let startedAt = 0

onMounted(() => { startedAt = performance.now() })

function onComplete() {
  status.value = 'done'
  lastDuration.value = ((performance.now() - startedAt) / 1000).toFixed(2)
}

function replay() {
  status.value = 'running'
  lastDuration.value = null
  startedAt = performance.now()
  runId.value++
}

const changes = [
  { name: 'Hint souris', desc: 'Le hint « Scrollez pour forger » et la ligne verticale qui coule sont remplacés par l\'icône souris (cursor-mouse.svg) qui oscille doucement de haut en bas pour suggérer le scroll.' },
  { name: 'Readout au-dessus', desc: '« FORGE — 00% » devient « MORPHING — 00% » et passe au-dessus du logo, à la distance symétrique du hint sous le logo.' },
  { name: 'Skip localisé', desc: 'Le bouton skip dit « Skip animation » (EN) / « Passer l\'animation » (FR).' },
  { name: 'Scroll plus lent', desc: 'À intensité de scroll égale, on révèle 44% là où V4 révélait 50% (budget 960 → 1091).' },
]
</script>

<template>
  <div class="splash-lab">
    <SplashScreenV5 :key="runId" @complete="onComplete" />

    <section class="lab-content">
      <p class="lab-tag">Lab interne — ne pas publier</p>
      <h1>Splash V5 — « Le Morph »</h1>
      <p class="lab-lead">
        Variante de « La Forge » (splash-lab-3) avec quatre ajustements UX : hint
        souris animé à la place du texte + ligne, readout « MORPHING » repositionné
        au-dessus du logo, bouton skip localisé, et un scroll plus lent. La mécanique
        de morph et l'endgame (O → disque → stripes → -45° → glyph orange → header)
        sont identiques.
      </p>

      <div class="lab-controls">
        <button type="button" class="lab-replay" @click="replay">
          ⟳ Rejouer le splash
        </button>
        <span class="lab-status" :data-status="status">
          {{ status === 'running' ? 'En cours…' : `Terminé${lastDuration ? ` — ${lastDuration}s` : ''}` }}
        </span>
        <NuxtLink :to="localePath('/splash-lab-3')" class="lab-link">← V4 « La Forge »</NuxtLink>
      </div>

      <h2>Changements vs V4</h2>
      <ol class="lab-phases">
        <li v-for="c in changes" :key="c.name">
          <span class="phase-name">{{ c.name }}</span>
          <span class="phase-desc">{{ c.desc }}</span>
        </li>
      </ol>

      <h2>Notes d'intégration</h2>
      <ul class="lab-notes">
        <li>Composant : <code>app/components/SplashScreenV5.vue</code> — copie de V4 ; mêmes events <code>@reveal</code> / <code>@complete</code>.</li>
        <li>Hint : <code>public/images/cursor-mouse.svg</code> animé en CSS (<code>cursor-bob</code>), désactivé sous <code>prefers-reduced-motion</code>.</li>
        <li>Clés i18n ajoutées : <code>splash.skipAnimation</code> (en/fr ; fallback EN pour les autres locales).</li>
        <li>Scroll : <code>SCROLL_BUDGET</code> passe de 960 à 1091 (×50/44).</li>
        <li>Pour promouvoir : remplacer <code>&lt;SplashScreen&gt;</code> par <code>&lt;SplashScreenV5&gt;</code> dans <code>app/pages/index.vue</code>, puis supprimer cette page.</li>
      </ul>
    </section>
  </div>
</template>

<style scoped>
.splash-lab {
  min-height: 100vh;
  background: var(--color-cream);
}

.lab-content {
  max-width: 760px;
  margin: 0 auto;
  padding: 120px 24px 96px;
  font-family: var(--font, sans-serif);
  color: var(--color-dark);
}

.lab-tag {
  display: inline-block;
  font-size: 11px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--color-accent);
  border: 0.5px solid var(--color-accent);
  padding: 6px 12px;
  border-radius: 999px;
  margin-bottom: 24px;
}

h1 {
  font-size: clamp(32px, 5vw, 52px);
  line-height: 1.05;
  margin: 0 0 16px;
}

.lab-lead {
  font-size: 17px;
  line-height: 1.6;
  color: var(--color-muted);
  margin-bottom: 32px;
}

.lab-controls {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 56px;
}

.lab-replay {
  font-family: inherit;
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0.04em;
  padding: 14px 26px;
  background: var(--color-dark);
  color: var(--color-cream);
  border: none;
  border-radius: 999px;
  cursor: pointer;
  transition: transform 0.2s, opacity 0.2s;
}
.lab-replay:hover { transform: translateY(-2px); opacity: 0.9; }

.lab-status {
  font-size: 13px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--color-muted);
}
.lab-status[data-status='done'] { color: var(--color-accent); }

.lab-link {
  font-size: 13px;
  letter-spacing: 0.06em;
  color: var(--color-muted);
  text-decoration: none;
  border-bottom: 0.5px solid var(--color-border);
  transition: color 0.2s;
}
.lab-link:hover { color: var(--color-accent); }

h2 {
  font-size: 20px;
  margin: 48px 0 18px;
}

.lab-phases {
  list-style: none;
  padding: 0;
  margin: 0;
  border-top: 0.5px solid var(--color-border);
}

.lab-phases li {
  display: grid;
  grid-template-columns: 150px 1fr;
  gap: 16px;
  padding: 14px 0;
  border-bottom: 0.5px solid var(--color-border);
  font-size: 14px;
  line-height: 1.5;
}

.phase-name {
  font-weight: 600;
}

.phase-desc {
  color: var(--color-muted);
}

.lab-notes {
  padding-left: 18px;
  font-size: 14px;
  line-height: 1.7;
  color: var(--color-muted);
}

.lab-notes code {
  font-size: 12.5px;
  background: var(--color-peach);
  padding: 2px 6px;
  border-radius: 4px;
  color: var(--color-dark);
}

@media (max-width: 860px) {
  .lab-phases li {
    grid-template-columns: 1fr;
  }
  .phase-desc {
    grid-column: 1 / -1;
  }
}
</style>
