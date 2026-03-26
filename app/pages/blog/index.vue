<script setup lang="ts">
import { gsap } from 'gsap'

useHead({ title: 'Blog — AAXLO' })

const localePath = useLocalePath()
const { locale } = useI18n()
const pageRef = ref<HTMLElement | null>(null)

const email = ref('')
const subscribed = ref(false)

function handleSubscribe() {
  if (email.value) subscribed.value = true
}

// Query articles from the blog folder via content_en
// Note: frontmatter fields like `date` are stored in `meta`, not direct columns,
// so we get all and sort client-side
const { data: articles } = await useAsyncData(
  `blog-index-${locale.value}`,
  async () => {
    const coll = locale.value === 'fr' ? 'content_fr' : 'content_en'
    // Get ALL items from collection and filter to /blog/ path
    let all = await queryCollection(coll).all()
    // Filter to blog articles (path starts with /blog/)
    all = all.filter((a: any) => a.path?.startsWith('/blog/'))
    // Sort by date descending (date is in frontmatter → access via path segment)
    all.sort((a: any, b: any) => {
      const dateA = new Date(a.date || a.path.split('/').pop() || 0).getTime()
      const dateB = new Date(b.date || b.path.split('/').pop() || 0).getTime()
      return dateB - dateA
    })
    return all
  }
)

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

onMounted(() => {
  const el = pageRef.value
  if (!el) return

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (prefersReduced) return

  const tl = gsap.timeline({ defaults: { ease: 'power2.inOut' } })
  tl.to(el.querySelector('.blog-label'), { clipPath: 'inset(-0.1em 0% -0.25em 0)', duration: 0.2, ease: 'steps(8)' }, '-=0.1')
  tl.to(el.querySelector('.blog-headline'), { clipPath: 'inset(-0.1em 0% -0.25em 0)', duration: 0.45, ease: 'steps(20)' }, '-=0.1')
  tl.to(el.querySelector('.blog-sub'), { clipPath: 'inset(-0.1em 0% -0.25em 0)', duration: 0.35, ease: 'steps(30)' }, '-=0.15')
  tl.to(el.querySelector('.hero-vert-rule'), { scaleY: 0, transformOrigin: 'top center', duration: 0.4 }, '-=0.2')
  tl.from(el.querySelector('.hero-count'), { opacity: 0, y: 10, duration: 0.3 }, '-=0.2')
})
</script>

<template>
  <div ref="pageRef" class="blog-page">

    <!-- ── HERO ── -->
    <header class="blog-hero">
      <span class="hero-rule hero-rule--top" aria-hidden="true"></span>

      <div class="hero-inner">
        <div class="hero-left">
          <span class="blog-label tw-hide">// BLOG</span>
          <h1 class="blog-headline tw-hide">Ideas that move<br>businesses forward.</h1>
          <p class="blog-sub tw-hide">Strategy, visibility, content, and automation — written for businesses that want to grow without losing what makes them distinct.</p>
        </div>

        <div class="hero-right">
          <span class="hero-vert-rule" aria-hidden="true"></span>
          <div class="hero-count">
            <span class="count-number">{{ articles?.length ?? 0 }}</span>
            <span class="count-label">articles</span>
          </div>
        </div>
      </div>

      <span class="hero-rule hero-rule--bottom" aria-hidden="true"></span>
    </header>

    <!-- ── FEATURED ── -->
    <section v-if="articles?.[0]" class="featured-section">
      <div class="featured-inner">
        <div class="featured-header">
          <span class="featured-rule" aria-hidden="true"></span>
          <div class="featured-header-inner">
            <span class="featured-label">// Editor's pick</span>
          </div>
        </div>

        <NuxtLink
          :to="localePath(`/blog/${articles[0].path.split('/').pop()}`)"
          class="featured-card"
        >
          <div class="featured-bg" aria-hidden="true">
            <div class="featured-bg-lines">
              <span v-for="n in 8" :key="n" class="bg-line"></span>
            </div>
            <span class="featured-index">01</span>
          </div>

          <div class="featured-content">
            <div class="featured-meta">
              <span class="featured-category-tag">{{ articles[0].category }}</span>
              <time class="feat-date" :datetime="articles[0].date">{{ formatDate(articles[0].date) }}</time>
              <span class="feat-read">{{ articles[0].readTime }} read</span>
            </div>
            <h2 class="featured-title">{{ articles[0].title }}</h2>
            <p class="featured-desc">{{ articles[0].description }}</p>
            <div class="featured-cta">
              <span class="featured-cta-text">Read article</span>
              <span class="feat-arrow" aria-hidden="true">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3 13L13 3M13 3H6M13 3V10" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </span>
            </div>
          </div>

          <div class="card-wipe" aria-hidden="true"><span class="card-read-label">Read article</span></div>
          <span class="card-border-h card-border-top"></span>
          <span class="card-border-h card-border-bottom"></span>
          <span class="card-border-v card-border-left"></span>
          <span class="card-border-v card-border-right"></span>
        </NuxtLink>
      </div>
    </section>

    <!-- ── ARTICLE GRID ── -->
    <section v-if="articles?.length" class="grid-section">
      <div class="grid-header">
        <span class="grid-rule" aria-hidden="true"></span>
        <span class="grid-label">// All articles</span>
      </div>
      <div class="articles-grid">
        <NuxtLink
          v-for="(article, i) in articles.slice(1)"
          :key="article.path"
          :to="localePath(`/blog/${article.path.split('/').pop()}`)"
          class="article-card"
          :data-index="i"
        >
          <span class="card-index" aria-hidden="true">0{{ i + 2 }}</span>

          <div class="card-meta-row">
            <span class="card-category">{{ article.category }}</span>
            <time class="card-date" :datetime="article.date">{{ formatDate(article.date) }}</time>
          </div>

          <h3 class="card-title">{{ article.title }}</h3>
          <p class="card-desc">{{ article.description }}</p>

          <div class="card-footer">
            <span class="card-read">{{ article.readTime }} read</span>
            <span class="card-arrow" aria-hidden="true">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M3 13L13 3M13 3H6M13 3V10" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </span>
          </div>

          <div class="card-wipe" aria-hidden="true"><span class="card-read-label">Read article</span></div>
          <span class="card-border-h card-border-top"></span>
          <span class="card-border-h card-border-bottom"></span>
          <span class="card-border-v card-border-left"></span>
          <span class="card-border-v card-border-right"></span>
        </NuxtLink>
      </div>
    </section>
  </div>
</template>

<style scoped>
.blog-page {
  position: relative;
  min-height: 100vh;
  background: var(--color-cream);
  display: flex;
  flex-direction: column;
}

/* ── HERO ── */
.blog-hero {
  border-bottom: 0.5px solid rgba(36, 39, 46, 0.15);
}
.hero-rule {
  display: block;
  height: 0.5px;
  background: rgba(36, 39, 46, 0.15);
}
.hero-inner {
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  gap: clamp(32px, 5vw, 64px);
  padding: clamp(64px, 8vw, 96px) clamp(32px, 6vw, 96px);
}
.hero-left { display: flex; flex-direction: column; gap: clamp(16px, 2vw, 24px); }
.blog-label {
  font-family: var(--font);
  font-size: 11px;
  font-weight: 500;
  color: var(--color-accent);
  letter-spacing: 0.15em;
}
.blog-headline {
  font-family: var(--font);
  font-size: clamp(36px, 5vw, 64px);
  font-weight: 600;
  color: var(--color-dark);
  line-height: 1.05;
  letter-spacing: -0.025em;
}
.blog-sub {
  font-family: var(--font);
  font-size: clamp(14px, 1.4vw, 18px);
  font-weight: 300;
  color: var(--color-muted);
  line-height: 1.65;
  max-width: 480px;
}
.hero-right {
  display: flex;
  align-items: center;
  gap: clamp(20px, 3vw, 32px);
}
.hero-vert-rule {
  display: block;
  width: 0.5px;
  height: clamp(48px, 6vw, 72px);
  background: rgba(36, 39, 46, 0.2);
  transform-origin: top center;
}
.hero-count {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
}
.count-number {
  font-family: var(--font);
  font-size: clamp(28px, 3.5vw, 52px);
  font-weight: 600;
  color: var(--color-dark);
  line-height: 1;
  letter-spacing: -0.03em;
}
.count-label {
  font-family: var(--font);
  font-size: 10px;
  font-weight: 500;
  color: var(--color-muted);
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

/* ── CLIP ANIMATION ── */
.tw-hide { clip-path: inset(-0.1em 100% -0.25em 0); }

/* ── FEATURED ── */
.featured-section {
  padding: 0 clamp(32px, 6vw, 96px) clamp(48px, 6vw, 72px);
  background: var(--color-cream);
}
.featured-inner { padding-top: 8px; }
.featured-header {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: clamp(24px, 3vw, 36px);
}
.featured-rule {
  display: block;
  width: 100%;
  height: 0.5px;
  background: rgba(36, 39, 46, 0.15);
}
.featured-header-inner { display: flex; align-items: center; gap: 16px; }
.featured-label {
  font-family: var(--font);
  font-size: 10px;
  font-weight: 600;
  color: var(--color-accent);
  letter-spacing: 0.18em;
  text-transform: uppercase;
  padding: 5px 12px;
  border: 0.5px solid var(--color-accent);
}
.featured-card {
  position: relative;
  display: grid;
  grid-template-columns: 280px 1fr;
  border: 0.5px solid #24272e;
  overflow: hidden;
  text-decoration: none;
  background: var(--color-dark);
  cursor: pointer;
}
.featured-bg {
  position: relative;
  background: var(--color-dark);
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 220px;
}
.featured-bg-lines {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  padding: 24px;
  opacity: 0.12;
}
.bg-line {
  display: block;
  height: 0.5px;
  background: var(--color-accent);
}
.featured-index {
  position: relative;
  z-index: 1;
  font-family: var(--font);
  font-size: clamp(64px, 8vw, 120px);
  font-weight: 800;
  color: rgba(255, 130, 112, 0.08);
  line-height: 1;
  letter-spacing: -0.05em;
  user-select: none;
}
.featured-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 20px;
  padding: clamp(32px, 4vw, 56px);
  border-left: 0.5px solid rgba(36, 39, 46, 0.4);
}
.featured-meta { display: flex; align-items: center; gap: 14px; flex-wrap: wrap; }
.featured-category-tag {
  font-family: var(--font);
  font-size: 9px;
  font-weight: 600;
  color: var(--color-cream);
  letter-spacing: 0.15em;
  text-transform: uppercase;
  background: rgba(255, 130, 112, 0.15);
  border: 0.5px solid var(--color-accent);
  padding: 4px 10px;
}
.feat-date,
.feat-read {
  font-family: var(--font);
  font-size: 12px;
  font-weight: 300;
  color: rgba(252, 252, 252, 0.45);
}
.featured-title {
  font-family: var(--font);
  font-size: clamp(22px, 2.5vw, 34px);
  font-weight: 600;
  color: var(--color-cream);
  line-height: 1.1;
  letter-spacing: -0.025em;
}
.featured-desc {
  font-family: var(--font);
  font-size: clamp(13px, 1.1vw, 15px);
  font-weight: 300;
  color: rgba(252, 252, 252, 0.5);
  line-height: 1.65;
}
.featured-card:hover .featured-title { color: #fff; }
.featured-card:hover .featured-desc { color: rgba(252, 252, 252, 0.7); }
.featured-cta {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 4px;
}
.featured-cta-text {
  font-family: var(--font);
  font-size: 10px;
  font-weight: 600;
  color: var(--color-accent);
  letter-spacing: 0.12em;
  text-transform: uppercase;
  transition: letter-spacing 0.3s ease;
}
.feat-arrow {
  color: var(--color-accent);
  display: flex;
  transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
}
.featured-card:hover .featured-cta-text { letter-spacing: 0.2em; }
.featured-card:hover .feat-arrow { transform: translate(4px, -4px); }

/* ── CARD WIPE ── */
.card-wipe {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  clip-path: polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%);
}
.featured-card .card-wipe { background: var(--color-accent); }
.article-card .card-wipe { background: transparent; }
.card-read-label {
  font-family: var(--font);
  font-size: clamp(40px, 10vw, 104px);
  font-weight: 600;
  color: #24272E;
  letter-spacing: -0.02em;
  white-space: nowrap;
  pointer-events: none;
  clip-path: inset(0 100% 0 0);
  line-height: 1;
}
.card-border-h,
.card-border-v {
  position: absolute;
  pointer-events: none;
  background: var(--color-accent);
  z-index: 2;
}
.card-border-h { height: 0.5px; left: 0; right: 0; transform: scaleX(0); transition: transform 0.3s ease; }
.card-border-v { width: 0.5px; top: 0; bottom: 0; transform: scaleY(0); transition: transform 0.3s ease; }
.card-border-top { top: 0; transform-origin: left; }
.card-border-bottom { bottom: 0; transform-origin: right; }
.card-border-left { left: 0; transform-origin: bottom; }
.card-border-right { right: 0; transform-origin: top; }
.featured-card:hover .card-border-top,
.featured-card:hover .card-border-bottom { transform: scaleX(1); }
.featured-card:hover .card-border-left,
.featured-card:hover .card-border-right { transform: scaleY(1); }

/* ── GRID ── */
.grid-section { padding: 0 clamp(32px, 6vw, 96px) clamp(48px, 6vw, 72px); }
.grid-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: clamp(24px, 3vw, 36px);
}
.grid-rule {
  display: block;
  flex: 1;
  height: 0.5px;
  background: rgba(36, 39, 46, 0.15);
}
.grid-label {
  font-family: var(--font);
  font-size: 10px;
  font-weight: 500;
  color: var(--color-muted);
  letter-spacing: 0.12em;
}
.articles-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  border-left: 0.5px solid rgba(36, 39, 46, 0.15);
}

/* ── ARTICLE CARD ── */
.article-card {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 36px 32px 32px;
  border-right: 0.5px solid rgba(36, 39, 46, 0.15);
  border-bottom: 0.5px solid rgba(36, 39, 46, 0.15);
  text-decoration: none;
  background: var(--color-white);
  cursor: pointer;
  overflow: hidden;
  transition: background 0.2s;
}
.article-card:hover { background: var(--color-cream); }
.article-card:hover .card-border-top,
.article-card:hover .card-border-bottom { transform: scaleX(1); }
.article-card:hover .card-border-left,
.article-card:hover .card-border-right { transform: scaleY(1); }
.card-index {
  position: absolute;
  top: 16px;
  right: 20px;
  font-family: var(--font);
  font-size: 10px;
  font-weight: 400;
  color: var(--color-muted);
  opacity: 0.3;
  letter-spacing: 0.1em;
}
.card-meta-row { display: flex; align-items: center; gap: 12px; }
.card-category {
  font-family: var(--font);
  font-size: 9px;
  font-weight: 600;
  color: var(--color-accent);
  letter-spacing: 0.12em;
  border: 0.5px solid var(--color-accent);
  padding: 2px 7px;
}
.card-date {
  font-family: var(--font);
  font-size: 12px;
  font-weight: 300;
  color: var(--color-muted);
}
.card-title {
  font-family: var(--font);
  font-size: clamp(18px, 1.6vw, 22px);
  font-weight: 600;
  color: var(--color-dark);
  line-height: 1.2;
  letter-spacing: -0.015em;
}
.card-desc {
  font-family: var(--font);
  font-size: 13px;
  font-weight: 300;
  color: var(--color-muted);
  line-height: 1.65;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 4px;
}
.card-read {
  font-family: var(--font);
  font-size: 10px;
  font-weight: 400;
  color: var(--color-muted);
  letter-spacing: 0.08em;
}
.card-arrow {
  color: var(--color-dark);
  display: flex;
  transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), color 0.3s;
}
.article-card:hover .card-arrow {
  transform: translate(4px, -4px);
  color: var(--color-accent);
}

/* ── RESPONSIVE ── */
@media (max-width: 860px) {
  .hero-inner { grid-template-columns: 1fr; gap: 24px; }
  .hero-right { display: none; }
  .featured-card { grid-template-columns: 1fr; }
  .featured-bg { min-height: 160px; }
  .featured-content { border-left: none; border-top: 0.5px solid rgba(36, 39, 46, 0.4); }
  .articles-grid { grid-template-columns: 1fr; }
}
@media (max-width: 480px) {
  .hero-inner { padding: 48px 24px; }
  .blog-headline { font-size: 32px; }
}
</style>
