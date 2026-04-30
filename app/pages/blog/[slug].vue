<script setup lang="ts">
import { gsap } from 'gsap'
import type { Collections } from '@nuxt/content'

const localePath = useLocalePath()
const route = useRoute()
const { locale } = useI18n()
const pageRef = ref<HTMLElement | null>(null)
const animsPlayed = useState('article-anims', () => false)
const progressPct = ref(0)

const { data: article } = await useAsyncData(
  `blog-${route.params.slug}-${locale.value}`,
  async () => {
    const coll = ('content_' + locale.value) as keyof Collections
    const targetPath = `/blog/${route.params.slug}`
    let res = await queryCollection(coll).path(targetPath).first()

    // Fallback to English if article missing in current locale
    if (!res && locale.value !== 'en') {
      res = await queryCollection('content_en').path(targetPath).first()
    }
    return res
  },
  { watch: [locale] }
)

if (!article.value) {
  throw createError({ statusCode: 404, statusMessage: 'Article not found' })
}

// SEO
useHead({
  title: article.value.seo?.title || article.value.title,
  meta: [
    { name: 'description', content: article.value.seo?.description || article.value.description },
  ],
})

// Scroll progress
function updateProgress() {
  if (!pageRef.value) return
  const el = pageRef.value
  const scrolled = el.scrollTop
  const total = el.scrollHeight - el.clientHeight
  progressPct.value = total > 0 ? Math.round((scrolled / total) * 100) : 0
}

onMounted(() => {
  const el = pageRef.value
  if (!el) return

  // Respect reduced motion
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (prefersReduced) {
    animsPlayed.value = true
    return
  }

  if (animsPlayed.value) return

  const sections = el.querySelectorAll('.reveal-section')
  const obs = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        gsap.from(entry.target, {
          opacity: 0,
          y: 28,
          duration: 0.6,
          ease: 'power3.out',
        })
        obs.unobserve(entry.target)
      }
    })
  }, { threshold: 0.08 })

  sections.forEach((s) => obs.observe(s))
  el.addEventListener('scroll', updateProgress, { passive: true })
  animsPlayed.value = true
})

onUnmounted(() => {
  if (pageRef.value) {
    pageRef.value.removeEventListener('scroll', updateProgress)
  }
})

// Extract TOC headings from article body
const tocItems = computed(() => {
  if (!article.value?.body?.toc?.links) return []
  return article.value.body.toc.links
})

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
}
</script>

<template>
  <div ref="pageRef" class="article-page">

    <!-- Skip link -->
    <a href="#article-content" class="skip-link">Skip to content</a>

    <!-- Progress bar -->
    <div
      class="reading-progress"
      role="progressbar"
      :aria-valuenow="progressPct"
      aria-valuemin="0"
      aria-valuemax="100"
      :aria-label="`Reading progress: ${progressPct}%`"
    >
      <div class="progress-fill" :style="{ width: `${progressPct}%` }"></div>
    </div>

    <!-- Article layout -->
    <div class="article-layout">

      <!-- Sidebar -->
      <aside class="article-sidebar" aria-label="Article navigation">
        <div class="sidebar-inner">
          <div class="sidebar-reading">
            <span class="sidebar-label">// Reading</span>
            <span class="sidebar-progress">{{ progressPct }}%</span>
          </div>

          <nav v-if="tocItems.length" class="sidebar-toc" aria-label="Table of contents">
            <span class="sidebar-label">// In this article</span>
            <ol class="toc-list">
              <li v-for="item in tocItems" :key="item.id" class="toc-item">
                <a :href="`#${item.id}`" class="toc-link">{{ item.text }}</a>
              </li>
            </ol>
          </nav>
        </div>
      </aside>

      <!-- Main content -->
      <main id="article-content" class="article-main">

        <!-- Hero -->
        <header class="article-hero">
          <NuxtLink :to="localePath('/blog')" class="back-link" aria-label="Back to all articles">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M13 8H3M3 8L7 4M3 8L7 12" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            All articles
          </NuxtLink>

          <div class="hero-meta">
            <span class="hero-category-tag">{{ article.category }}</span>
            <time class="hero-date" :datetime="article.date">{{ formatDate(article.date) }}</time>
            <span class="hero-read">{{ article.readTime }} read</span>
          </div>

          <h1 class="article-title">{{ article.title }}</h1>
          <p class="article-description">{{ article.description }}</p>

          <div class="hero-byline">
            <span class="byline-by">By</span>
            <span class="byline-author">{{ article.author }}</span>
          </div>
        </header>

        <!-- Article body -->
        <div class="article-body">
          <ContentRenderer :value="article" />
        </div>

        <!-- Footer CTA -->
        <footer class="article-footer">
          <div class="footer-cta">
            <span class="footer-cta-label">// Continue exploring</span>
            <h2 class="footer-cta-heading">Ready to grow your business?</h2>
            <p class="footer-cta-sub">See how AAXLO helps local businesses compete and win.</p>
            <NuxtLink :to="localePath('/contact')" class="footer-cta-btn">
              Schedule a call
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M3 13L13 3M13 3H6M13 3V10" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </NuxtLink>
          </div>
        </footer>

      </main>
    </div>
  </div>
</template>

<style scoped>
/* ── PAGE SHELL ── */
.article-page {
  position: relative;
  min-height: 100vh;
  background: var(--color-cream);
  display: flex;
  flex-direction: column;
}

/* ── SKIP LINK ── */
.skip-link {
  position: fixed;
  top: -100%;
  left: 16px;
  z-index: 9999;
  padding: 8px 16px;
  background: var(--color-dark);
  color: var(--color-cream);
  font-family: var(--font);
  font-size: 12px;
  font-weight: 600;
  text-decoration: none;
  transition: top 0.2s;
}
.skip-link:focus { top: 16px; }

/* ── PROGRESS BAR ── */
.reading-progress {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  z-index: 100;
  background: rgba(36, 39, 46, 0.1);
}
.progress-fill {
  height: 100%;
  background: var(--color-accent);
  transition: width 0.1s linear;
}

/* ── LAYOUT ── */
.article-layout {
  display: grid;
  grid-template-columns: 200px 1fr;
  min-height: 100vh;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 clamp(24px, 4vw, 64px);
  gap: clamp(32px, 5vw, 72px);
}

/* ── SIDEBAR ── */
.article-sidebar {
  position: sticky;
  top: 0;
  height: 100vh;
  padding-top: clamp(80px, 10vw, 120px);
  border-right: 0.5px solid rgba(36, 39, 46, 0.12);
}
.sidebar-inner {
  display: flex;
  flex-direction: column;
  gap: clamp(24px, 3vw, 32px);
}
.sidebar-label {
  display: block;
  font-family: var(--font);
  font-size: 10px;
  font-weight: 600;
  color: var(--color-muted);
  letter-spacing: 0.18em;
  text-transform: uppercase;
  margin-bottom: 12px;
}
.sidebar-reading {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.sidebar-progress {
  font-family: var(--font);
  font-size: clamp(22px, 2.5vw, 30px);
  font-weight: 600;
  color: var(--color-dark);
  letter-spacing: -0.03em;
  line-height: 1;
}
.sidebar-toc { display: flex; flex-direction: column; }
.toc-list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 8px; }
.toc-link {
  font-family: var(--font);
  font-size: 11px;
  font-weight: 300;
  color: var(--color-muted);
  text-decoration: none;
  line-height: 1.5;
  transition: color 0.2s;
}
.toc-link:hover { color: var(--color-dark); }

/* ── MAIN ── */
.article-main {
  padding-top: clamp(80px, 10vw, 120px);
  padding-bottom: clamp(80px, 10vw, 120px);
  min-width: 0;
}

/* ── BACK LINK ── */
.back-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: var(--font);
  font-size: 11px;
  font-weight: 500;
  color: var(--color-muted);
  text-decoration: none;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  margin-bottom: clamp(32px, 4vw, 48px);
  transition: color 0.2s, gap 0.2s;
}
.back-link:hover { color: var(--color-dark); gap: 12px; }

/* ── HERO ── */
.hero-meta {
  display: flex;
  align-items: center;
  gap: 14px;
  flex-wrap: wrap;
  margin-bottom: clamp(16px, 2vw, 24px);
}
.hero-category-tag {
  font-family: var(--font);
  font-size: 9px;
  font-weight: 600;
  color: var(--color-accent);
  letter-spacing: 0.15em;
  text-transform: uppercase;
  border: 0.5px solid var(--color-accent);
  padding: 4px 10px;
}
.hero-date,
.hero-read {
  font-family: var(--font);
  font-size: 12px;
  font-weight: 300;
  color: var(--color-muted);
}
.article-title {
  font-family: var(--font);
  font-size: clamp(28px, 4vw, 52px);
  font-weight: 600;
  color: var(--color-dark);
  line-height: 1.1;
  letter-spacing: -0.025em;
  margin-bottom: clamp(16px, 2vw, 24px);
}
.article-description {
  font-family: var(--font);
  font-size: clamp(16px, 1.4vw, 19px);
  font-weight: 300;
  color: var(--color-muted);
  line-height: 1.65;
  max-width: 600px;
  margin-bottom: clamp(24px, 3vw, 36px);
}
.hero-byline {
  display: flex;
  align-items: center;
  gap: 8px;
  padding-bottom: clamp(32px, 4vw, 48px);
  border-bottom: 0.5px solid rgba(36, 39, 46, 0.15);
  margin-bottom: clamp(36px, 5vw, 56px);
}
.byline-by {
  font-family: var(--font);
  font-size: 12px;
  font-weight: 400;
  color: var(--color-muted);
}
.byline-author {
  font-family: var(--font);
  font-size: 12px;
  font-weight: 400;
  color: var(--color-dark);
}

/* ── ARTICLE BODY ── */
.article-body {
  max-width: 680px;
}

/* ── FOOTER CTA ── */
.article-footer {
  margin-top: clamp(64px, 8vw, 96px);
  padding: clamp(40px, 5vw, 64px);
  background: var(--color-dark);
}
.footer-cta { max-width: 520px; }
.footer-cta-label {
  display: block;
  font-family: var(--font);
  font-size: 10px;
  font-weight: 600;
  color: var(--color-accent);
  letter-spacing: 0.18em;
  text-transform: uppercase;
  margin-bottom: 16px;
}
.footer-cta-heading {
  font-family: var(--font);
  font-size: clamp(22px, 2.5vw, 30px);
  font-weight: 600;
  color: var(--color-cream);
  letter-spacing: -0.025em;
  line-height: 1.2;
  margin-bottom: 12px;
}
.footer-cta-sub {
  font-family: var(--font);
  font-size: clamp(13px, 1.1vw, 15px);
  font-weight: 300;
  color: rgba(252, 252, 252, 0.55);
  line-height: 1.65;
  margin-bottom: 28px;
}
.footer-cta-btn {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-family: var(--font);
  font-size: 11px;
  font-weight: 600;
  color: var(--color-cream);
  background: var(--color-accent);
  text-decoration: none;
  padding: 14px 28px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  transition: background 0.3s, transform 0.2s;
  cursor: pointer;
}
.footer-cta-btn:hover {
  background: #ff6b52;
  transform: translateY(-1px);
}
.footer-cta-btn:active { transform: scale(0.97); }

/* ── FOCUS STATES ── */
:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 3px;
}

/* ── RESPONSIVE ── */
@media (max-width: 860px) {
  .article-layout {
    grid-template-columns: 1fr;
    padding: 0 24px;
  }
  .article-sidebar { display: none; }
  .article-main { padding-top: 48px; }
}

@media (max-width: 480px) {
  .hero-meta { gap: 10px; }
  .article-footer { padding: 32px 24px; }
}
</style>
