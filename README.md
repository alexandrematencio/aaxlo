# AAXLO

Digital agency website helping small businesses fix their online presence — visibility, web, content, automation, and custom builds. Serving local clients in France and beyond borders.

## Tech Stack

- **[Nuxt 4](https://nuxt.com/)** — Vue 3 framework with SSR
- **[GSAP](https://gsap.com/)** — Scroll-driven animations and micro-interactions
- **[Nuxt Content](https://content.nuxt.com/)** — Blog and content management
- **[Tailwind CSS](https://tailwindcss.com/)** — Utility-first styling
- **Deployed on [Vercel](https://vercel.com/)**

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
app/
├── pages/
│   ├── index.vue          # Landing page
│   ├── about.vue          # About AAXLO
│   ├── contact.vue        # Contact form
│   ├── audit.vue          # Free digital audit
│   ├── blog/              # Blog listing
│   ├── services/          # Service pages
│   │   ├── visibility.vue
│   │   ├── web.vue
│   │   ├── content.vue
│   │   ├── automation.vue
│   │   └── consulting.vue
│   └── legal/             # Legal pages
├── components/            # Reusable Vue components
├── composables/           # Vue composables
└── plugins/               # Nuxt plugins
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run preview` | Preview production build locally |
| `npm run generate` | Static site generation |

## Environment Variables

Copy `.env.example` to `.env` and fill in required values (if applicable).

## License

Private — All rights reserved.
