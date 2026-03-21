# AAXLO — Sitemap v1

Tech: Nuxt.js + Nuxt Content (Markdown-driven, SSG)
i18n: Built-in from day one. Each page = /en/page + /fr/page + future locales
Performance target: PageSpeed >95, Core Web Vitals green across the board

---

## URL Structure

```
aaxlo.com
│
├── /                                   ← Homepage (lead-gen focused)
│
├── /services/                          ← Services overview (index page)
│   ├── /services/visibility            ← GBP, local SEO, directory listings
│   ├── /services/web                   ← Websites, digital menus, booking systems
│   ├── /services/content               ← Social media, content repurposing, brand identity
│   ├── /services/automation            ← Chatbots, review bots, WhatsApp, email/SMS
│   └── /services/consulting            ← Custom AI workflows, MVPs, competitor monitoring, training
│
├── /audit                              ← Free audit lead magnet (standalone landing page)
│
├── /about                              ← Who we are
│
├── /blog/                              ← Blog index (placeholder at launch)
│   └── /blog/[slug]                    ← Individual posts (when ready)
│
├── /contact                            ← Contact form + booking embed
│
└── /legal/                             ← Legal pages
    ├── /legal/privacy                  ← Privacy policy (GDPR compliant)
    ├── /legal/terms                    ← Terms of service
    └── /legal/mentions                 ← Mentions légales (required under French law)
```

### i18n routing

```
/en/...                                 ← English (default)
/fr/...                                 ← French (launch)
/[future-locale]/...                    ← Add locales by dropping .md files in the right folder
```

Nuxt Content structure for this:

```
content/
├── en/
│   ├── index.md
│   ├── services/
│   │   ├── index.md
│   │   ├── visibility.md
│   │   ├── web.md
│   │   ├── content.md
│   │   ├── automation.md
│   │   └── consulting.md
│   ├── audit.md
│   ├── about.md
│   ├── contact.md
│   ├── blog/
│   │   └── (empty or placeholder post)
│   └── legal/
│       ├── privacy.md
│       ├── terms.md
│       └── mentions.md
└── fr/
    └── (mirror of /en/ structure)
```

---

## Page Index

Total pages at launch: 13 (× number of locales)

| # | Path | Purpose | Primary CTA | SEO target |
|---|---|---|---|---|
| 1 | `/` | Convert visitors into audit leads | "Get your free audit" | Brand + broad service terms |
| 2 | `/services/` | Overview of all service categories, internal linking hub | Navigate to category | "digital agency AI [locale]" |
| 3 | `/services/visibility` | GBP, local SEO, directories, review generation | "Get your free audit" | "google business profile optimization", "local SEO" |
| 4 | `/services/web` | Websites, digital menus, booking/ordering systems | "Let's talk about your project" | "website creation [industry]", "digital menu QR" |
| 5 | `/services/content` | Social media setup/management, content repurposing, brand identity, photo/video | "Let's talk about your content" | "social media management", "content creation AI" |
| 6 | `/services/automation` | Chatbots, review response bot, WhatsApp, email/SMS | "Automate your business" | "AI chatbot business", "WhatsApp automation" |
| 7 | `/services/consulting` | Custom AI workflows, app MVPs, competitor monitoring, AI training | "Book a discovery call" | "AI consulting", "custom AI workflow" |
| 8 | `/audit` | Standalone lead magnet landing page with form | "Run my free audit" | "digital audit business", "audit presence en ligne" |
| 9 | `/about` | Who we are, build trust | "Work with us" | Brand terms |
| 10 | `/blog/` | Blog index, placeholder at launch | Read articles | Long-tail SEO (future) |
| 11 | `/contact` | Form + calendar booking | Submit form / book call | "contact [brand]" |
| 12-14 | `/legal/*` | Privacy, terms, mentions légales | None | Not indexed (noindex) |

---

## Navigation

### Header nav

```
Services (dropdown)              About              Blog              [Audit CTA button]
  ├── Visibility
  ├── Web
  ├── Content
  ├── Automation
  └── Consulting
```

- "Audit" is styled as a button, not a regular nav link — it's the persistent CTA
- Services dropdown keeps the nav clean while giving access to all categories
- Contact is NOT in the main nav — it's accessible from CTAs on each page and from the footer
- Language switcher in header (flag icons or EN/FR toggle)

### Footer

```
Services                About       Resources        Legal              Contact
  Visibility            Who we are  Blog             Privacy policy     Email
  Web                               (future items)   Terms of service   Booking link
  Content                                            Mentions légales   Social links
  Automation
  Consulting

[Language switcher]                                  © AAXLO Pte. Ltd.
```

---

## Structured Data (per page type)

| Page type | Schema markup |
|---|---|
| Homepage | Organization, WebSite, SiteNavigationElement |
| Service category pages | Service, FAQ, BreadcrumbList |
| Audit landing page | Service, FAQ, BreadcrumbList |
| About | Organization, BreadcrumbList |
| Blog posts | Article, BreadcrumbList |
| Contact | LocalBusiness (or Organization), ContactPoint |

---

## Technical SEO Notes

- SSG (static site generation) via Nuxt — every page pre-rendered at build time, no client-side hydration penalty
- Sitemap.xml auto-generated from Nuxt Content, one per locale
- robots.txt: allow all except /legal/* (noindex via meta tag, not disallow)
- Canonical URLs with hreflang tags for each locale pair
- Open Graph + Twitter Card meta on every page (pulled from .md frontmatter)
- Favicon, web manifest, apple-touch-icon (Alexandre handles the assets)
- No JavaScript-dependent content in the initial render — everything in the .md is what Google sees
- Image optimization: Nuxt Image module, WebP/AVIF with fallback, lazy loading below the fold
- Font strategy: system font stack or single self-hosted variable font — no Google Fonts external call

## GEO / AI Indexing Notes

- Clean semantic HTML structure (proper heading hierarchy, landmark elements)
- FAQ schema on service pages helps AI models pull structured answers
- llms.txt at root (emerging standard for AI crawler guidance)
- Concise, factual meta descriptions — AI models use these as source snippets
- Service pages structured as problem → solution → specifics — matches how LLMs extract answers
