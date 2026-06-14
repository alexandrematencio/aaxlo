<script setup>
/**
 * PAGE DE TEST (non versionnée — gitignore) — cadence du splash sur tactile.
 *
 * Permet de comparer la cadence du SplashScreenV5 :
 *  • Auto      → détection réelle de l'appareil (média query pointer/hover)
 *  • Tactile   → force la réduction (budget de scroll −27,75 % + animation de fin −15 %)
 *  • Desktop   → cadence de référence (inchangée)
 *
 * Sur desktop, utilise « Forcer Tactile » pour ressentir la version tactile sans
 * avoir besoin d'un vrai smartphone.
 */
const TOUCH_FACTOR = 0.85 // animation de fin (glyph)
const SCROLL_TOUCH_FACTOR = (TOUCH_FACTOR * 0.85 * 0.85) / 1.05 // reveal scroll : +5 % vitesse ≈ 0.5849
const BASE_BUDGET = 1091

// Tampon de build figé à la main à chaque déploiement. Sert à vérifier, après
// avoir vidé le cache de Chrome sur mobile, qu'on charge bien le dernier bundle :
// si l'heure/version affichée correspond, le nouveau JS est actif.
const BUILD_VERSION = 'reveal scroll v5 · ×0,5849 (−41,5 %, +5 % vitesse) · +specs'
const BUILD_TIME = '2026-06-14 15:30 CEST'

const open = ref(false) // fermée par défaut : on l'ouvre via l'icône réglages
const mode = ref('auto') // 'auto' | 'touch' | 'desktop'
const splashKey = ref(0)
const detected = ref('—')
const state = ref('en cours')

const effectiveTouch = computed(() =>
  mode.value === 'auto' ? detected.value === 'tactile' : mode.value === 'touch',
)
const budget = computed(() =>
  Math.round(effectiveTouch.value ? BASE_BUDGET * SCROLL_TOUCH_FACTOR : BASE_BUDGET),
)
const endgame = computed(() =>
  effectiveTouch.value ? '−15 % (timeScale ×1.18)' : 'référence (×1)',
)

// ── Specs complètes du reveal scroll (formation) — reflètent 1:1 SplashScreenV5 ──
const scrollSpecs = computed(() => [
  ['Mécanique', 'Scroll virtuel — la page derrière ne bouge jamais ; le delta cumulé pilote input.t (0→1)'],
  ['Budget desktop/laptop', `${BASE_BUDGET} px de delta cumulé pour la formation complète`],
  ['Facteur tactile', `×${SCROLL_TOUCH_FACTOR.toFixed(4)} = (0,85 × 0,85 × 0,85) ÷ 1,05 → −41,5 % (+5 % vitesse)`],
  ['Budget tactile', `${Math.round(BASE_BUDGET * SCROLL_TOUCH_FACTOR)} px`],
  ['Budget actif (ici)', `${budget.value} px`],
  ['Détection tactile', '(hover: none) and (pointer: coarse) — exclut laptop/desktop tactiles'],
  ['Molette', 'px = deltaY × (mode ligne ? 16 : 1) → delta = px ÷ budget actif'],
  ['Swipe doigt', 'delta = (ΔY × 2) ÷ budget actif — le ×2 = un geste de pouce forge tout le logo'],
  ['Clavier', '↓ / PgDn / Espace = +0,12 · ↑ / PgUp = −0,12 · Échap = termine'],
  ['Lissage (lerp)', 'current += (input.t − current) × 0,14 à chaque frame du ticker GSAP'],
  ['Snap final', 'si |input.t − current| < 0,0005 → current = input.t'],
  ['Compteur', 'MORPHING — NN % (arrondi de current × 100)'],
  ['Hint masqué', 'dès que current > 5 % (fade y+8, 0,3 s, power2.in)'],
  ['Auto-play idle', 'après 2500 ms d\'inactivité → input.t →1, durée max(0,8 ; 2,2 × (1−t)), power1.inOut'],
  ['Formation (ftl)', 'timeline en pause, durée normalisée 1, scrubbée par le scroll'],
  ['Morph blocs', '5 segments bloc → A1 · A2 · X · L · O'],
  ['Timing segments', 'starts 0 / 0,185 / 0,37 / 0,555 / 0,74 · durée 0,26 · power2.inOut (chevauchement)'],
  ['Contre-poinçon O', 'oInner scale 0→1 + opacity 0→1 · durée 0,1 · power2.out @ 0,9'],
  ['Intro lingot', 'logoSvg scaleX 0→1 · 0,5 s · power3.out ; hint fade-in 0,4 s @ 0,35'],
  ['Déclenche l\'endgame', 'current ≥ 0,999 ET input.t ≥ 1'],
])

// ── Specs complètes de l'animation de fin (endgame) ──
const endgameSpecs = computed(() => [
  ['Timeline', 'autoplay · delay 0,15 s · onComplete → reveal du site'],
  ['Vitesse (timeScale)', effectiveTouch.value ? '×1,1765 = 1 ÷ 0,85 → joue 15 % plus vite (tactile)' : '×1 (desktop/laptop, référence)'],
  ['Fondu compteur', 'autoAlpha 0 · 0,3 s · delay 0,2'],
  ['1 · O → disque', 'block5 morph vers cercle parfait · 0,32 s · power2.inOut @ 0'],
  ['   oInner', 'scale 0 / opacity 0 · 0,26 s · power2.in @ 0'],
  ['2 · Swap disque', '@ 0,34 — morphGroup + solidDisk on, block5 off (géométries identiques)'],
  ['3 · 10 stripes', 'scaleY 0→1 · durée 0,06 · stagger 0,022 · back.out(3) @ 0,36'],
  ['4 · Rotation', '−45° · svgOrigin 158.5 18.5 · 0,42 s · elastic.out(1, 0.7)'],
  ['5 · Glyph orange', 'morphGroup opacity→0 (0,18 s) ; glyphGroup opacity→1 (0,2 s, power2.out)'],
  ['6 · Collapse header', 'logoGroup scale 28/hauteur + x/y vers logo header · 0,5 s · power3.inOut'],
  ['7 · Wipe final', 'splash clip-path inset(0 0 vh−64 0) · 0,4 s · power3.inOut'],
  ['Durée totale ≈', effectiveTouch.value ? '≈ 2,1 s (tactile, ×1,18)' : '≈ 2,5 s (desktop, ×1)'],
])

onMounted(() => {
  detected.value = window.matchMedia('(hover: none) and (pointer: coarse)').matches
    ? 'tactile'
    : 'desktop / laptop'
})

function replay() {
  state.value = 'en cours'
  splashKey.value++
}
function setMode(m) {
  mode.value = m
  replay()
}
function onComplete() {
  state.value = 'terminé'
}
</script>

<template>
  <div class="pace-test">
    <SplashScreenV5
      :key="splashKey"
      :pace="mode"
      @complete="onComplete"
    />

    <!-- Dock fixé en bas à droite : la carte de test s'y replie dans un bouton
         réglages. pointer-events:none sur le dock pour laisser passer le swipe du
         splash dans les zones vides ; réactivé sur la carte et le bouton. -->
    <div class="hud-dock">
      <Transition name="hud">
        <div v-if="open" class="hud" role="dialog" aria-label="Test de cadence du splash">
          <div class="hud-head">
            <p class="hud-title">Splash — test de cadence</p>
            <button class="hud-close" aria-label="Fermer la carte" @click="open = false">×</button>
          </div>

          <dl class="hud-stats">
            <div><dt>Appareil détecté</dt><dd>{{ detected }}</dd></div>
            <div><dt>Cadence active</dt><dd :class="effectiveTouch ? 'on' : ''">
              {{ effectiveTouch ? 'TACTILE' : 'DESKTOP (référence)' }}
            </dd></div>
            <div><dt>Budget de scroll</dt><dd>
              {{ budget }} px<template v-if="effectiveTouch"> (−41,5 %)</template>
            </dd></div>
            <div><dt>Animation de fin</dt><dd>{{ endgame }}</dd></div>
            <div><dt>État</dt><dd>{{ state }}</dd></div>
          </dl>

          <div class="hud-build">
            <span class="hud-build-dot" />
            <div>
              <p class="hud-build-version">{{ BUILD_VERSION }}</p>
              <p class="hud-build-time">build {{ BUILD_TIME }}</p>
            </div>
          </div>

          <details class="hud-specs" open>
            <summary>Reveal scroll — specs &amp; paramètres</summary>
            <dl>
              <div v-for="[k, v] in scrollSpecs" :key="k"><dt>{{ k }}</dt><dd>{{ v }}</dd></div>
            </dl>
          </details>

          <details class="hud-specs">
            <summary>Animation de fin (endgame) — specs &amp; paramètres</summary>
            <dl>
              <div v-for="[k, v] in endgameSpecs" :key="k"><dt>{{ k }}</dt><dd>{{ v }}</dd></div>
            </dl>
          </details>

          <div class="hud-modes">
            <button :class="{ sel: mode === 'auto' }" @click="setMode('auto')">Auto</button>
            <button :class="{ sel: mode === 'touch' }" @click="setMode('touch')">Forcer tactile</button>
            <button :class="{ sel: mode === 'desktop' }" @click="setMode('desktop')">Forcer desktop</button>
          </div>

          <button class="hud-replay" @click="replay">↻ Rejouer le splash</button>

          <p class="hud-hint">
            Scrolle (molette/touchpad) ou swipe (doigt) pour former le logo, puis
            l'animation de fin (glyph) se déclenche automatiquement.
          </p>
        </div>
      </Transition>

      <Transition name="fab">
        <button
          v-if="!open"
          class="hud-fab"
          aria-label="Ouvrir le test de cadence"
          @click="open = true"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path
              fill="currentColor"
              d="M19.14 12.94a7.5 7.5 0 0 0 .05-.94 7.5 7.5 0 0 0-.05-.94l2.03-1.58a.5.5 0 0 0 .12-.62l-1.92-3.32a.5.5 0 0 0-.6-.22l-2.39.96a7 7 0 0 0-1.62-.94l-.36-2.54a.5.5 0 0 0-.5-.42h-3.84a.5.5 0 0 0-.5.42l-.36 2.54a7 7 0 0 0-1.62.94l-2.39-.96a.5.5 0 0 0-.6.22L2.71 8.86a.5.5 0 0 0 .12.62l2.03 1.58a7.5 7.5 0 0 0 0 1.88l-2.03 1.58a.5.5 0 0 0-.12.62l1.92 3.32a.5.5 0 0 0 .6.22l2.39-.96a7 7 0 0 0 1.62.94l.36 2.54a.5.5 0 0 0 .5.42h3.84a.5.5 0 0 0 .5-.42l.36-2.54a7 7 0 0 0 1.62-.94l2.39.96a.5.5 0 0 0 .6-.22l1.92-3.32a.5.5 0 0 0-.12-.62l-2.03-1.58ZM12 15.5A3.5 3.5 0 1 1 12 8.5a3.5 3.5 0 0 1 0 7Z"
            />
          </svg>
        </button>
      </Transition>
    </div>
  </div>
</template>

<style scoped>
.pace-test {
  min-height: 100vh;
  background: #fff1ef;
}

/* Dock fixé en bas à droite, au-dessus du splash (skip btn = z 10001).
   Marge cohérente contre les bords + safe-area iOS pour que la carte/le bouton
   respirent et restent accessibles (pas collés sous l'encoche / barre gestuelle). */
.hud-dock {
  position: fixed;
  right: 0;
  bottom: 0;
  z-index: 10020;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 12px;
  padding: 20px;
  padding-right: max(20px, env(safe-area-inset-right));
  padding-bottom: max(20px, env(safe-area-inset-bottom));
  /* Les zones vides du dock laissent passer le swipe vers le splash */
  pointer-events: none;
}

/* HUD : carte de test de cadence */
.hud {
  pointer-events: auto;
  width: 280px;
  max-width: calc(100vw - 40px);
  max-height: calc(100vh - 40px);
  overflow-y: auto;
  padding: 16px 18px;
  background: rgba(252, 252, 252, 0.94);
  backdrop-filter: blur(6px);
  border: 0.5px solid #24272e;
  box-shadow: 0 10px 34px rgba(36, 39, 46, 0.22);
  font-family: ui-monospace, 'SF Mono', Menlo, monospace;
  color: #24272e;
}

.hud-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 12px;
}

.hud-title {
  margin: 0;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.hud-close {
  flex: none;
  width: 26px;
  height: 26px;
  margin: -4px -4px 0 0;
  display: grid;
  place-items: center;
  font-size: 18px;
  line-height: 1;
  cursor: pointer;
  background: transparent;
  border: 0.5px solid #24272e;
  color: #24272e;
  transition: background 0.2s, color 0.2s;
}
.hud-close:hover {
  background: #24272e;
  color: #fcfcfc;
}

/* Bouton réglages (FAB) : la carte s'y replie */
.hud-fab {
  pointer-events: auto;
  width: 48px;
  height: 48px;
  display: grid;
  place-items: center;
  cursor: pointer;
  background: #24272e;
  border: 0.5px solid #24272e;
  border-radius: 50%;
  color: #fcfcfc;
  box-shadow: 0 6px 20px rgba(36, 39, 46, 0.3);
  transition: transform 0.2s ease;
}
.hud-fab:hover {
  transform: rotate(40deg);
}
.hud-fab svg {
  width: 22px;
  height: 22px;
}

/* Transitions ouverture / repli */
.hud-enter-active,
.hud-leave-active,
.fab-enter-active,
.fab-leave-active {
  transition: opacity 0.22s ease, transform 0.22s ease;
}
.hud-enter-from,
.hud-leave-to {
  opacity: 0;
  transform: translateY(8px) scale(0.98);
}
.fab-enter-from,
.fab-leave-to {
  opacity: 0;
  transform: scale(0.6);
}

.hud-stats {
  margin: 0 0 14px;
  font-size: 11px;
}
.hud-stats > div {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  padding: 4px 0;
  border-bottom: 0.5px solid rgba(36, 39, 46, 0.15);
}
.hud-stats dt {
  color: rgba(36, 39, 46, 0.6);
}
.hud-stats dd {
  margin: 0;
  text-align: right;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
}
.hud-stats dd.on {
  color: #c44530;
}

.hud-build {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0 0 14px;
  padding: 9px 10px;
  background: #24272e;
  color: #fcfcfc;
}
.hud-build-dot {
  flex: none;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #ff8270;
}
.hud-build-version {
  margin: 0;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.03em;
}
.hud-build-time {
  margin: 2px 0 0;
  font-size: 10px;
  font-variant-numeric: tabular-nums;
  color: rgba(252, 252, 252, 0.6);
}

/* Specs détaillées (scroll + endgame), repliables */
.hud-specs {
  margin: 0 0 10px;
  border: 0.5px solid rgba(36, 39, 46, 0.2);
}
.hud-specs > summary {
  padding: 8px 10px;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  cursor: pointer;
  list-style: none;
  background: rgba(36, 39, 46, 0.05);
}
.hud-specs > summary::-webkit-details-marker {
  display: none;
}
.hud-specs > summary::before {
  content: '▸ ';
  color: #ff8270;
}
.hud-specs[open] > summary::before {
  content: '▾ ';
}
.hud-specs > dl {
  margin: 0;
  padding: 4px 10px 8px;
  font-size: 10px;
  line-height: 1.4;
}
.hud-specs > dl > div {
  padding: 5px 0;
  border-bottom: 0.5px solid rgba(36, 39, 46, 0.12);
}
.hud-specs > dl > div:last-child {
  border-bottom: 0;
}
.hud-specs dt {
  font-weight: 600;
  color: rgba(36, 39, 46, 0.55);
  white-space: pre;
}
.hud-specs dd {
  margin: 2px 0 0;
  color: #24272e;
}

.hud-modes {
  display: flex;
  gap: 6px;
  margin-bottom: 10px;
}
.hud-modes button {
  flex: 1;
  padding: 7px 4px;
  font-family: inherit;
  font-size: 10px;
  letter-spacing: 0.04em;
  cursor: pointer;
  background: transparent;
  border: 0.5px solid #24272e;
  color: #24272e;
  transition: background 0.2s, color 0.2s;
}
.hud-modes button.sel {
  background: #24272e;
  color: #fcfcfc;
}

.hud-replay {
  width: 100%;
  padding: 9px;
  font-family: inherit;
  font-size: 11px;
  letter-spacing: 0.04em;
  cursor: pointer;
  background: #ff8270;
  border: 0.5px solid #24272e;
  color: #24272e;
}

.hud-hint {
  margin: 12px 0 0;
  font-size: 10px;
  line-height: 1.5;
  color: rgba(36, 39, 46, 0.6);
}
</style>
