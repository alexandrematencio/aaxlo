# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

AAXLO is a premium marketing site for a local business growth platform ("Human Expertise, eXpanded by AI"). Built with **Nuxt 4 + Vue 3 + TypeScript**.

## Commands

```bash
npm run dev        # Dev server at http://localhost:3000
npm run build      # Production build
npm run generate   # Static site generation
npm run preview    # Preview production build
```

No test runner or linter is configured.

## Architecture

### Tech Stack
- **Framework**: Nuxt 4.4.2 (Vue 3, file-based routing)
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

**Content files** (7 per locale):
- `home.md` — all homepage sections (hero, checklist, emotional, shift, social-proof, how-it-works, close)
- `services.md` — services overview + all 5 service detail pages (visibility, web, content, automation, consulting)
- `about.md`, `audit.md`, `contact.md`, `footer.md`, `legal.md`

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

- **`useScrollReveal.js`** — Cinematic scroll-triggered reveals using `clip-path` + IntersectionObserver. 8 patterns: `curtain-tear`, `ignite`, `crack`, `breathe`, `melt`, `iris`, `slash`, `slash-reverse`. Uses `visibility: hidden` (not `opacity: 0`) to prevent layout gaps.
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
2. Create `content/{code}/` folder with all 7 `.md` files (copy from `content/en/`)
3. The locale is already registered in `nuxt.config.ts` — no config changes needed for EN/FR/ES/DE/PT/RU/VI
4. For a new locale not in the list, add it to `nuxt.config.ts` `i18n.locales` and `content.config.ts`
