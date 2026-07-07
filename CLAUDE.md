# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

AAXLO is a premium marketing site for a local business growth platform ("Human Expertise, eXpanded by AI"). Built with **Nuxt 4 + Vue 3 + TypeScript**.

## Commands

```bash
npm run dev        # Dev server at http://localhost:3000
npm run build      # Production build → .output/
npm run generate   # Static site generation
npm run preview    # Preview production build
```

No test runner or linter is configured. `npm run postinstall` runs `nuxt prepare` automatically.

**Deployment:** Docker (Node 20 Alpine multi-stage, port 3000) on a Hostinger VPS. See `Dockerfile`.

## Architecture

### Tech Stack
- **Framework**: Nuxt 4.4.4 (Vue 3, file-based routing)
- **Content CMS**: @nuxt/content v3 — all page content in YAML frontmatter `.md` files, organized by locale
- **i18n**: @nuxtjs/i18n — multilingual routing (`/en/`, `/fr/`), locale detection, UI string translations
- **Animations**: GSAP 3.14 with MorphSVG and ScrambleText plugins (registered in `app/plugins/gsap.client.ts`)
- **Styling**: Custom CSS with design tokens (no Tailwind/UnoCSS) in `app/assets/css/main.css`
- **Deployment**: Docker multi-stage build (Node 20 Alpine), port 3000

### i18n Setup
- **Strategy**: `prefix` — all URLs prefixed with locale (`/en/services`, `/fr/services`)
- **Locales**: EN, FR (populated), ES, DE, PT, RU, VI (placeholder)
- **Locale detection**: Browser language → cookie-persisted, root `/` redirects to detected locale
- **UI strings**: `i18n/locales/en.json`, `fr.json` — nav labels, form strings, buttons, validation
- **Page content**: `content/en/*.md`, `content/fr/*.md` — marketing copy, FAQs, features, SEO meta

### Content Architecture
Content is split into two layers:
1. **`@nuxt/content` (`.md` files)** — CMS-style page content (headlines, paragraphs, service descriptions, FAQs, legal text). One folder per locale under `content/`.
2. **`@nuxtjs/i18n` (`.json` files)** — UI strings (nav labels, form placeholders, button text, validation messages). Under `i18n/locales/`.

Content collections defined in `content.config.ts` — one collection per locale (`content_en`, `content_fr`, etc.).

**Content files** (per locale):
- `home.md` — all homepage sections (hero, checklist, emotional, shift, social-proof, how-it-works, close)
- `services.md` — services overview + all 5 service detail pages (visibility, web, content, automation, consulting)
- `about.md`, `audit.md`, `contact.md`, `footer.md`, `legal.md`
- `blog/*.md` — individual blog articles using MDC syntax (see Blog System below)

**Schema gotcha:** `content.config.ts` only declares the `seo` field in its zod schema. All other frontmatter fields (`hero`, `sections`, etc.) land under `meta` in Nuxt Content v3. The `useLocalizedContent` composable spreads `meta` back to the top level so components can access `data.hero` directly — do not bypass it.

### Key Patterns

**Fetching content** — use `useLocalizedContent(path)` composable:
```javascript
const { data: home } = await useLocalizedContent('/home')
// Returns content for current locale, falls back to English
```

**Locale-aware links** — always use `localePath()`:
```html
<NuxtLink :to="localePath('/services')">...</NuxtLink>
```

**UI strings** — use `$t()` in templates, `t()` in script:
```html
<span>{{ $t('nav.services') }}</span>
```

**Note on `@` in i18n values**: The `@` character is reserved in vue-i18n. Escape as `{'@'}` in JSON values (e.g., email placeholders).

### Blog System (MDC Components)
Blog posts in `content/{locale}/blog/*.md` use MDC syntax with custom prose components from `app/components/Article/`. Each component file (e.g., `Article/Lead.vue`) is referenced in markdown with the `Article` prefix:

```markdown
::ArticleLead
Opening paragraph.
::

::ArticleHeading{content="Section Title" id="anchor-id"}
::ArticleParagraph
Body text.
::
::ArticleList
---
items:
  - label: "01"
    text: "Item body"
---
::
```

Available components: `ArticleLead`, `ArticleHeading`, `ArticleParagraph`, `ArticleList`, `ArticleListItem`, `ArticlePullquote`, `ArticleStat`, `ArticleStatRow`. Use `content/article-template.md` as a starting point for new posts.

**Article scroll-context gotcha:** the `.article-page` wrapper in `app/pages/blog/[slug].vue` is *not* a scroll container — it has no `overflow:auto` and no fixed height, so the document scrolls on `window`. Anything that needs scroll position on an article page (reading-progress bar, scroll spies, sticky offsets) must read `window.scrollY` / `document.documentElement.scrollHeight` and listen on `window`, not on `pageRef.value`. Listener attachment must also live OUTSIDE the `if (animsPlayed.value) return` one-shot guard, otherwise it stops re-binding on second-and-later article visits in the same session.

### Directory Layout
- `app/pages/` — File-based routes (homepage, services/*, legal/*, audit, contact, blog)
- `app/components/` — Vue SFCs using `<script setup>` syntax
- `app/composables/` — Reusable logic (animation systems, shared state, content fetching)
- `app/plugins/` — Client-side GSAP plugin registration
- `content/en/`, `content/fr/` — Locale-specific CMS content
- `i18n/locales/` — UI string translations per locale
- `content.config.ts` — Content collection definitions
- `public/images/` — Static images

### Animation System (Key Composables)
The site relies heavily on coordinated GSAP animations:

- **`useScrollReveal.js`** — Cinematic scroll-triggered reveals using `clip-path` + IntersectionObserver. 8 patterns: `curtain-tear`, `ignite`, `crack`, `breathe`, `melt`, `iris`, `slash`, `slash-reverse`. Uses `visibility: hidden` (not `opacity: 0`) to prevent layout gaps. Per-section `duration` / `ease` overrides are passed from `app/pages/index.vue` (`setupForge()`).
- **`HomeEmotional.vue` (S6) is a bespoke exception** — it does NOT use `useScrollReveal`. The wrapper still gets `slash-reverse` for its first-paint, but inside, the section runs its own scroll-driven reveal: makes itself `position: sticky`, *artificially extends its own height* by `cellCount × ~0.7vh` to create scroll budget, then reveals each paragraph as the user crosses fractional thresholds (`triggers = [0, 0.30, 0.65]`). When the last block is in, `deactivateSection()` removes the sticky + extra height in one rAF and re-anchors `window.scrollY` so the page doesn't jump. Don't try to "make it consistent" by porting it onto `useScrollReveal` — the sticky+extend trick is what gives the section its pacing.
- **`useShineHover.js`** — CTA button shine sweep + sparkle burst effects. Auto-detects dark/light button backgrounds.
- **`useStripeTransition.js`** — Shared reactive state for diagonal stripe page transitions. Guards against simultaneous transitions.
- **`useLocalizedContent.ts`** — Locale-aware content fetching with English fallback.

### State Management
Simple `useState()` composables (no Pinia):
- `splashPlayed` / `animsPlayed` — Track splash screen and animation initialization
- `stripeActive` / `stripeTarget` — Page transition coordination

### Design Tokens (CSS Variables)
```
--color-cream: #fff1ef    --color-accent: #ff8270
--color-peach: #ffdad4    --color-muted: #6e7381
--color-dark: #24272e     --color-border: rgba(36,39,46,0.18)
--color-white: #fcfcfc
```
Font: Switzer (FontShare CDN), fallback Inter. Mobile breakpoint: 860px.

### Adding a New Language

1. Create `i18n/locales/{code}.json` with translated UI strings (copy from `en.json`)
2. Create `content/{code}/` folder with all `.md` files (copy from `content/en/`)
3. The locale is already registered in `nuxt.config.ts` — no config changes needed for EN/FR/ES/DE/PT/RU/VI
4. For a new locale not in the list, add it to **both** `nuxt.config.ts` `i18n.locales` **and** `content.config.ts` (a new `content_{code}` collection is required — collections are statically defined per-locale)


When compacting, preserve:
- current task goal
- files changed
- commands already run
- failing tests and exact errors
- decisions made
- next action list

Drop:
- old exploration paths
- repeated logs
- irrelevant discussion