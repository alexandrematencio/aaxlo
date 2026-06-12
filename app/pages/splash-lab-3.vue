<script setup>
/**
 * /splash-lab-3 — banc d'essai local du SplashScreenV4 (« LA FORGE »).
 * Page interne, noindex. À supprimer une fois un splash promu dans index.vue.
 */
useSeoMeta({
  title: 'Splash Lab 3 — AAXLO',
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

const phases = [
  { t: 'auto', name: 'Le Lingot', desc: 'Une barre brute #24272E — l\'empreinte exacte du logo, 5 blocs contigus sans le moindre trou — se révèle par wipe horizontal. Hint « Scrollez pour forger », readout mono « FORGE — 0% ».' },
  { t: 'scroll', name: 'La Forge', desc: 'Premier splash INTERACTIF : le scroll (virtuel, la page ne bouge pas) scrubbe le morph MorphSVG de chaque bloc vers sa lettre — A1 → A2 → X → L → O, segments qui se chevauchent. Scroll up = les lettres refondent en barre. Le contre-poinçon blanc du O est poinçonné en fin de course. Budget ~960px ; flèches/espace marchent aussi ; idle 2.5s → autoplay.' },
  { t: '100%', name: 'O → Disque', desc: 'Point de non-retour : input verrouillé, le O morphe en disque parfait.' },
  { t: '+0.36s', name: 'Découpe', desc: 'Les 10 stripes (mêmes rects que l\'original) cascadent et découpent le disque.' },
  { t: '+0.60s', name: 'Rotation', desc: 'Le disque découpé tourne de -45° (elastic).' },
  { t: '+1.00s', name: 'Glyph', desc: 'Crossfade vers le glyph orange #FF8270.' },
  { t: '+1.25s', name: 'Collapse', desc: 'Le logo file se loger dans le header, le splash se clippe et révèle la page.' },
]
</script>

<template>
  <div class="splash-lab">
    <SplashScreenV4 :key="runId" @complete="onComplete" />

    <section class="lab-content">
      <p class="lab-tag">Lab interne — ne pas publier</p>
      <h1>Splash V4 — « La Forge »</h1>
      <p class="lab-lead">
        Concept : la barre brute est le lingot, votre scroll est le marteau. Premier
        splash interactif — le visiteur forge le logo lui-même, lettre par lettre,
        en scrubbant un morph GSAP réversible. Rejoint le thème « forge » de la home.
        La fin (O → disque → stripes → -45° → glyph orange → header) est
        géométriquement identique à l'original.
      </p>

      <div class="lab-controls">
        <button type="button" class="lab-replay" @click="replay">
          ⟳ Rejouer le splash
        </button>
        <span class="lab-status" :data-status="status">
          {{ status === 'running' ? 'En cours…' : `Terminé${lastDuration ? ` — ${lastDuration}s` : ''}` }}
        </span>
        <NuxtLink :to="localePath('/splash-lab-2')" class="lab-link">← V3 « L'Objectif »</NuxtLink>
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
        <li>Composant : <code>app/components/SplashScreenV4.vue</code> — GSAP + MorphSVG + SVG pur, zéro dépendance ajoutée.</li>
        <li>Scroll virtuel : wheel/touch capturés par l'overlay (<code>preventDefault</code>), lissés par lerp dans <code>gsap.ticker</code> — la page derrière ne bouge jamais.</li>
        <li>Pour promouvoir : remplacer <code>&lt;SplashScreen&gt;</code> par <code>&lt;SplashScreenV4&gt;</code> dans <code>app/pages/index.vue</code> (mêmes events <code>@reveal</code> / <code>@complete</code>), puis supprimer cette page.</li>
        <li>Accessibilité : bouton Skip, touche Échap, flèches/espace pour forger sans souris, <code>prefers-reduced-motion</code> → skip immédiat.</li>
        <li>Le collapse cible <code>.header-logo .logo-img</code> mesuré au runtime — fallback coin haut-gauche si absent.</li>
        <li>Spec : <code>docs/superpowers/specs/2026-06-13-splash-v4-forge-design.md</code> (idée B « fill progressif » en appendice).</li>
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
