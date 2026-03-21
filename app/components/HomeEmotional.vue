<script setup>
import { gsap } from 'gsap'

const props = defineProps({
  skip: { type: Boolean, default: false },
})

const section = ref(null)

function showFinalState() {
  const el = section.value
  if (!el) return

  el.querySelectorAll('.tw-hide').forEach(t => {
    gsap.set(t, { clipPath: 'inset(-0.1em 0% -0.25em 0)' })
  })
}

onMounted(() => {
  const el = section.value
  if (!el) return

  if (props.skip) {
    showFinalState()
    return
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const tl = gsap.timeline({ defaults: { ease: 'power2.out' } })

          /* Label typewriter */
          tl.to(el.querySelector('.emotional-label'), {
            clipPath: 'inset(-0.1em 0% -0.25em 0)', duration: 0.15, ease: 'steps(10)',
          }, '-=0.15')

          /* Headline typewriter */
          tl.to(el.querySelector('.emotional-headline'), {
            clipPath: 'inset(-0.1em 0% -0.25em 0)', duration: 0.15, ease: 'steps(26)',
          }, '-=0.1')

          /* Paragraphs stagger typewriter */
          const paragraphs = el.querySelectorAll('.emotional-para')
          paragraphs.forEach((p, i) => {
            tl.to(p, {
              clipPath: 'inset(-0.1em 0% -0.25em 0)',
              duration: 0.9,
              ease: 'steps(50)',
            }, i === 0 ? '+=0.06' : '-=0.1')
          })

          observer.disconnect()
        }
      })
    },
    { threshold: 0.15 }
  )
  observer.observe(el)
})
</script>

<template>
  <section ref="section" class="home-emotional">
    <div class="emotional-container">
      <div class="emotional-cell">
        <span class="emotional-label tw-hide">THE REASON</span>
        <h2 class="emotional-headline tw-hide">
          You built something worth finding.
        </h2>
      </div>

      <div class="emotional-cell">
        <p class="emotional-para tw-hide">
          You didn't start your business to learn about meta descriptions or manage a content calendar. You started it because you're good at something and you decided to bet on yourself.
        </p>
      </div>

      <div class="emotional-cell">
        <p class="emotional-para tw-hide">
          That bet — the late nights, the slow months, the figuring-it-out-as-you-go — that was the hard part. And that's yours.
        </p>
      </div>

      <div class="emotional-cell">
        <p class="emotional-para tw-hide">
          Getting people to find you online, keeping your social media alive, automating the stuff that eats your time — that's on us. And we care about getting it right. Not in an abstract "we value our clients" way. In a "we check if it's actually working three weeks later" way.
        </p>
      </div>
    </div>

  </section>
</template>

<style scoped>
.home-emotional {
  position: relative;
  background: #FFF1EF;
  padding: 120px clamp(32px, 6vw, 96px);
  border-top: 0.5px solid #24272e;
  display: flex;
  justify-content: center;
}

.tw-hide {
  clip-path: inset(-0.1em 100% -0.25em 0);
}

.emotional-container {
  max-width: 700px;
  width: 100%;
  display: flex;
  flex-direction: column;
}

.emotional-cell {
  border: 0.5px solid #24272e;
  border-top: none;
  padding: 16px;
}
.emotional-cell:first-child {
  border-top: 0.5px solid #24272e;
}

.emotional-label {
  display: block;
  font-family: var(--font);
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: rgba(36, 39, 46, 0.5);
  margin-bottom: 8px;
}

.emotional-headline {
  font-family: var(--font);
  font-size: clamp(32px, 5vw, 48px);
  font-weight: 600;
  color: var(--color-dark);
  line-height: 1.1;
  letter-spacing: -0.02em;
  margin: 0;
}

.emotional-para {
  font-family: var(--font);
  font-size: 20px;
  font-weight: 300;
  color: var(--color-dark);
  line-height: 1.6;
  margin: 0;
}

@media (max-width: 768px) {
  .home-emotional {
    padding: 80px 20px;
  }
  .emotional-headline {
    font-size: clamp(26px, 6vw, 36px);
  }
  .emotional-para {
    font-size: 17px;
  }
  .emotional-cell {
    padding: 10px;
  }
}
</style>
