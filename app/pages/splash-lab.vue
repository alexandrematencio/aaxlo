<script setup>
/**
 * /splash-lab — banc d'essai local du SplashScreenV2 (« LE SCAN »).
 * Page interne, noindex. À supprimer une fois le V2 promu à la place
 * de SplashScreen.vue dans index.vue.
 */
useSeoMeta({
  title: 'Splash Lab — AAXLO',
  robots: 'noindex, nofollow',
})

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

const phases = [
  { t: '0.00s', name: 'Ignition', desc: 'Une ligne de scan orange pleine hauteur s\'allume à gauche du logo — draw vertical + flicker néon.' },
  { t: '0.30s', name: 'Le Scan', desc: 'La ligne balaie l\'écran sombre et imprime les lettres blanches derrière elle. Chaque lettre traversée : settle vertical + flash d\'un fantôme orange décalé (misregistration d\'impression). Une règle de ticks techniques se révèle sous le logo.' },
  { t: '0.88s', name: 'Le Flip', desc: 'La ligne finit de traverser le O → flip négatif en un cut dur : fond sombre → blanc, lettres blanches → dark, flash 1 frame + micro punch d\'échelle.' },
  { t: '0.95s', name: 'O → Disque', desc: 'Le O morphe en disque parfait pendant que la ligne de scan revient, rétrécit à la hauteur du disque et blanchit — elle devient la première stripe de découpe.' },
  { t: '1.33s', name: 'Découpe', desc: 'Les 10 stripes (mêmes rects que l\'original) cascadent depuis la ligne et découpent le disque.' },
  { t: '1.63s', name: 'Rotation', desc: 'Le disque découpé tourne de -45° (elastic).' },
  { t: '2.05s', name: 'Glyph', desc: 'Crossfade vers le glyph orange #FF8270.' },
  { t: '2.28s', name: 'Collapse', desc: 'Le logo file se loger dans le header, le splash se clippe et révèle la page.' },
]
</script>

<template>
  <div class="splash-lab">
    <SplashScreenV2 :key="runId" @complete="onComplete" />

    <section class="lab-content">
      <p class="lab-tag">Lab interne — ne pas publier</p>
      <h1>Splash V2 — « Le Scan »</h1>
      <p class="lab-lead">
        Concept : le glyph AAXLO est un disque découpé par des stripes. Ce splash fait
        de la stripe le fil narratif complet — une ligne de scan imprime le logo, puis
        se réincarne en première stripe de découpe du glyph. La fin (O → disque →
        stripes → -45° → glyph orange → header) est géométriquement identique à l'original.
      </p>

      <div class="lab-controls">
        <button type="button" class="lab-replay" @click="replay">
          ⟳ Rejouer le splash
        </button>
        <span class="lab-status" :data-status="status">
          {{ status === 'running' ? 'En cours…' : `Terminé${lastDuration ? ` — ${lastDuration}s` : ''}` }}
        </span>
      </div>

      <h2>Storyboard</h2>
      <ol class="lab-phases">
        <li v-for="p in phases" :key="p.name">
          <span class="phase-t">{{ p.t }}</span>
          <span class="phase-name">{{ p.name }}</span>
          <span class="phase-desc">{{ p.desc }}</span>
        </li>
      </ol>

      <h2>Notes d'intégration</h2>
      <ul class="lab-notes">
        <li>Composant : <code>app/components/SplashScreenV2.vue</code> — GSAP + SVG pur, zéro dépendance ajoutée.</li>
        <li>Pour promouvoir : remplacer <code>&lt;SplashScreen&gt;</code> par <code>&lt;SplashScreenV2&gt;</code> dans <code>app/pages/index.vue</code> (mêmes events <code>@reveal</code> / <code>@complete</code>), puis supprimer cette page.</li>
        <li>Accessibilité conservée : bouton Skip, touche Échap, <code>prefers-reduced-motion</code> → skip immédiat.</li>
        <li>Le collapse cible <code>.header-logo .logo-img</code> mesuré au runtime — fallback coin haut-gauche si absent.</li>
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
  grid-template-columns: 64px 110px 1fr;
  gap: 16px;
  padding: 14px 0;
  border-bottom: 0.5px solid var(--color-border);
  font-size: 14px;
  line-height: 1.5;
}

.phase-t {
  font-variant-numeric: tabular-nums;
  color: var(--color-accent);
  font-weight: 600;
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
    grid-template-columns: 56px 1fr;
  }
  .phase-desc {
    grid-column: 1 / -1;
  }
}
</style>
