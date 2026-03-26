---
title: Article Title Here
description: One-sentence description for SEO and article card preview.
date: 2026-01-01
author: AAXLO Editorial
category: STRATEGY
readTime: 5 min
seo:
  title: SEO Title Override (optional — defaults to frontmatter title)
  description: SEO meta description (optional — defaults to frontmatter description)
  ogImage: /images/article-og.jpg (optional, 1200×630px recommended)
---

::ArticleLead
Your compelling opening paragraph here. This is the lead — the first thing readers see after the hero. Keep it to 2–3 punchy sentences maximum. State the problem or the surprising fact. Make them want to keep reading.
::

::ArticleHeading{content="Your First Section Title" id="first-section"}

::ArticleParagraph
Your paragraph text here. Write in clear, direct prose. Aim for 2–4 sentences per paragraph. Be specific — use numbers, names, concrete outcomes. Avoid generic claims that could apply to any business in any industry.
::

::ArticleParagraph
Second paragraph continues the same thought. Each paragraph should advance the argument or add a new piece of information. If a paragraph does not add anything new, cut it.
::

::ArticlePullquote{attribution="— Source Name, Year"}
This is a pull quote — a key insight, a surprising stat, or a statement worth pausing on. Use 1–2 per article maximum.
::

::ArticleHeading{content="Your Second Section Title" id="second-section"}

::ArticleParagraph
New section, new argument. Keep each section focused on one idea. If you are covering two topics under one heading, split them.
::

::ArticleStatRow
---
stats:
  - value: "38%"
    label: "Short label for this metric (under 80 characters)"
  - value: "3.2×"
    label: "Second metric with clear context"
  - value: "$1T+"
    label: "Third metric — ties to the article's core argument"
---
::

::ArticleHeading{content="Your Third Section" id="third-section"}

::ArticleParagraph
Statistics land harder when you present them clearly. The stat-row component is designed for 3 data points that support your argument. Each stat has a large number and a one-line label.
::

::ArticleList
---
items:
  - label: "01"
    text: "First item — be specific and action-oriented. State the concrete step or insight, not a vague principle."
  - label: "02"
    text: "Second item — continue the logic naturally. Each item should build on the previous one."
  - label: "03"
    text: "Third item — build toward a conclusion. The last item should feel like a resolution, not an afterthought."
  - label: "04"
    text: "Fourth item — close the loop. If you are listing a process, the last item completes it."
---
::

::ArticleHeading{content="Your Fourth Section" id="fourth-section"}

::ArticleParagraph
Lists work well for frameworks, checklists, processes, and step-by-step content. Each item should be a single, well-formed sentence or short paragraph. Number markers are accent-colored (#ff8270).
::

::ArticlePullquote{attribution="— AAXLO Editorial"}
End with a strong pull quote that reframes the article's central argument or states the one thing you want readers to remember.
::

---

## Content Block Reference

All article body content uses Markdown Component (MDC) block syntax — `::BlockName` with `::` delimiters.
Each block maps directly to a styled section in the article layout.

Place files in:
- **English:** `content/en/blog/your-article-slug.md`
- **French:** `content/fr/blog/your-article-slug.md`

---

### ArticleLead

Standalone opening paragraph in larger type (clamp(18px, 1.6vw, 22px)), font-weight 500. Use once, at the top of the article body, immediately after the hero. States the problem or the surprising fact that justifies reading the article.

```
::ArticleLead
Your opening paragraph here. 2–3 sentences maximum.
::
```

---

### ArticleHeading

Section heading with a 32px accent rule above it. Links to the sidebar table of contents for scroll navigation. Font: clamp(20px, 2vw, 26px), font-weight 600, line-height 1.15.

```
::ArticleHeading{content="Your Section Title Here" id="anchor-slug"}
::

**Attributes:**
- `content` — required. The heading text.
- `id` — required. Lowercase, hyphenated. Used for deep-linking and the sidebar TOC.
```

---

### ArticleParagraph

Standard body text. The workhorse of every article. Font: clamp(16px, 1.25vw, 18px), font-weight 400, line-height 1.82, opacity 0.88. Consecutive paragraphs separated by clamp(16px, 2.5vw, 24px) top margin.

```
::ArticleParagraph
Your paragraph text here. Be specific. Use concrete examples, named numbers, real outcomes.
::
```

---

### ArticlePullquote

A key insight or callout, displayed in a peach (#ffdad4) background box with a 2px orange left border. Use 1–2 per article — the most impactful statements only.

```
::ArticlePullquote{attribution="— Source or Author"}
Your quote text here.
::

**Attributes:**
- `attribution` — optional. Defaults to no attribution.
```

---

### ArticleStatRow

A 3-column grid of statistics. Each stat has a large display value and a one-line label. Designed for data-driven arguments. Always provide exactly 3 stats.

```
::ArticleStatRow
---
stats:
  - value: "71%"
    label: "Short label for this metric"
  - value: "3.2×"
    label: "Second metric with context"
  - value: "$1T+"
    label: "Third metric, clearly stated"
---
::
```

**Rules:**
- Values can include % signs, × symbols, dollar signs, or plain numbers
- Labels must be under 80 characters and readable at small sizes
- Provide exactly 3 stats — if you only have 2, frame the first differently

---

### ArticleList

A numbered list with accent-colored markers. Use for frameworks, processes, checklists, or step-by-step content. List text: clamp(14px, 1.1vw, 16px), font-weight 400, line-height 1.7, opacity 0.88.

```
::ArticleList
---
items:
  - label: "01"
    text: "First item — specific, action-oriented, concrete."
  - label: "02"
    text: "Second item — continues the logic naturally."
  - label: "03"
    text: "Third item — builds toward a conclusion."
  - label: "04"
    text: "Fourth item — closes the loop."
---
::
```

**Rules:**
- `label` — the accent-colored number/marker (e.g. "01", "A", "a")
- `text` — the item content. Each item should be a single, well-formed sentence or short paragraph
- Items should build logically — do not front-load all the easy points
- The last item should feel like a resolution, not an afterthought
- Consecutive lists get automatic top spacing via sibling selector

---

## Frontmatter Schema

```yaml
---
title: Article Headline Here
description: One-sentence summary for SEO and article card preview.
date: 2026-01-01
author: AAXLO Editorial
category: STRATEGY
readTime: 5 min
seo:
  title: SEO Title Override (optional)
  description: SEO meta description override (optional)
  ogImage: /images/article-og.jpg (optional)
---
```

| Field | Required | Description |
|---|---|---|
| `title` | Yes | Article headline. Used in hero, browser tab, and OG title. |
| `description` | Yes | 1–2 sentence summary. Used in article card and OG description. |
| `date` | Yes | Publication date in `YYYY-MM-DD` format. |
| `author` | Yes | Byline. Use `AAXLO Editorial` for general content. |
| `category` | Yes | One of: `STRATEGY`, `VISIBILITY`, `CONTENT`, `AUTOMATION`, `SECURITY`, `CONSULTING` |
| `readTime` | Yes | Estimated read time in minutes, e.g. `5 min` |
| `seo.title` | No | Override for the `<title>` tag. |
| `seo.description` | No | Override for the meta description tag. |
| `seo.ogImage` | No | Open Graph image path. 1200×630px recommended. |

---

## Writing Guidelines

- **Be specific.** Use concrete examples, named numbers, real outcomes. "71% of businesses saw X" beats "many businesses experienced X."
- **Lead with the point.** Do not warm up. Open with the most important idea — the problem, the surprising fact, the thing that justifies the read.
- **Avoid filler.** Every sentence should add a fact, a perspective, or a concrete step. If a sentence does not earn its place, cut it.
- **One idea per section.** If a heading covers two topics, split it. Readers should be able to skim headings and understand the article's structure.
- **Cite sources.** Use `{attribution="— Source, Year"}` on pullquotes drawn from data or expert opinion.
- **Category labels** are uppercase monospace: `STRATEGY`, `VISIBILITY`, `CONTENT`, `AUTOMATION`, `SECURITY`, `CONSULTING`.
- **Treat AI as a drafting tool.** Edit AI outputs heavily. Add original research, local expertise, and personal voice. The more human modification, the stronger the IP claim.

## Formatting Specs (as of March 2026)

| Element | Font Size | Font Weight | Line Height | Opacity/Notes |
|---|---|---|---|---|
| Lead | clamp(18px, 1.6vw, 22px) | 500 | 1.75 | — |
| Heading | clamp(20px, 2vw, 26px) | 600 | 1.15 | accent rule: 32×0.5px |
| Paragraph | clamp(16px, 1.25vw, 18px) | 400 | 1.82 | 0.88 |
| Pullquote | clamp(16px, 1.4vw, 19px) | 500 italic | 1.5 | peach bg, accent left border |
| List item | clamp(14px, 1.1vw, 16px) | 400 | 1.7 | 0.88 |
| Stat value | — | 700 | — | 14px Courier New |
