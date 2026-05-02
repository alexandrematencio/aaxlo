# AAXLO

Marketing site for AAXLO — *Human Expertise, eXpanded by AI*. Helps local businesses fix their online presence across visibility, web, content, automation, and consulting.

## Tech Stack

- **[Nuxt 4](https://nuxt.com/)** — Vue 3, file-based routing, SSR
- **[Nuxt Content](https://content.nuxt.com/) v3** — markdown-based CMS for page copy and blog articles
- **[@nuxtjs/i18n](https://i18n.nuxtjs.org/)** — multilingual routing (EN, FR populated; ES, DE, PT, RU, VI registered as placeholders)
- **[GSAP](https://gsap.com/)** 3.14 — scroll reveals, page transitions, micro-interactions (incl. MorphSVG and ScrambleText plugins)
- **Custom CSS** with design tokens — see `app/assets/css/main.css`. No Tailwind / UnoCSS.
- **Docker** (Node 20 Alpine, multi-stage) — see `Dockerfile`. Deployed to a Hostinger VPS on port 3000.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Root `/` redirects to the browser-detected locale (`/en/...` or `/fr/...`).

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Dev server with HMR |
| `npm run build` | Production build → `.output/` |
| `npm run generate` | Static site generation |
| `npm run preview` | Preview production build locally |

`postinstall` runs `nuxt prepare` automatically.

## Project Structure

```
app/
├── pages/                  # File-based routes
│   ├── index.vue           # Landing
│   ├── about.vue
│   ├── audit.vue           # Free digital audit
│   ├── contact.vue
│   ├── blog/
│   │   ├── index.vue       # Article listing
│   │   └── [slug].vue      # Article detail
│   ├── services/           # 5 service pages + index
│   └── legal/              # mentions / privacy / terms
├── components/
│   ├── Article/            # MDC components for blog (::ArticleLead, ::ArticleHeading, …)
│   ├── Home*.vue           # Homepage sections
│   └── App{Header,Footer}.vue
├── composables/            # useScrollReveal, useShineHover, useStripeTransition, useLocalizedContent
├── plugins/gsap.client.ts  # registers MorphSVG + ScrambleText
└── assets/css/main.css     # design tokens + global styles

content/
├── en/, fr/                # Per-locale page content (home, services, about, audit, contact, footer, legal, blog/*)
└── article-template.md     # Frontmatter + MDC scaffold for new blog posts

i18n/locales/               # UI strings (nav, forms, buttons, validation)
content.config.ts           # Nuxt Content collection definitions (one per locale)
nuxt.config.ts              # i18n locales + page transition
Dockerfile                  # Production image (multi-stage, port 3000)
```

## Content Authoring

Two layers:

- **Page copy / blog articles** → `content/{locale}/*.md` files. Fetched in pages via `useLocalizedContent('/path')` which falls back to English if a translation is missing.
- **UI strings** (nav labels, form placeholders, buttons) → `i18n/locales/{locale}.json`. Used in templates with `$t('nav.services')`.

New blog posts: copy `content/article-template.md` into `content/{locale}/blog/`, fill in frontmatter (`title`, `description`, `date`, `author`, `category`, `readTime`), and use the `::ArticleLead`, `::ArticleHeading`, `::ArticleParagraph`, `::ArticleList`, `::ArticlePullquote`, `::ArticleStat`, `::ArticleStatRow` MDC components.

## Deployment

```bash
docker build -t aaxlo .
docker run -p 3000:3000 aaxlo
```

The image runs `node .output/server/index.mjs` with `NUXT_HOST=0.0.0.0` and `NUXT_PORT=3000`.

## Further Reading

See `CLAUDE.md` for architecture details: i18n strategy, content schema gotchas, animation system, design tokens, and adding a new language.

## License

Private — All rights reserved.
