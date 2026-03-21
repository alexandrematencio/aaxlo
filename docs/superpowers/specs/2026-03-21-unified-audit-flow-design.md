# Unified Audit Flow — Design Spec

**Date**: 2026-03-21
**Status**: Approved
**Scope**: Frontend UX only (no backend wiring)

---

## Problem

The "get your free audit" conversion flow is fragmented:

- 6 different CTA labels across the site ("Get your free audit", "See what we'd fix first", "Get my free audit", etc.)
- 2 disconnected forms: a 3-field inline form on the homepage (AuditCTA.vue) and a 5-field form on /audit (audit.vue)
- Neither form has a working backend — both just preventDefault or flip a boolean
- No validation, no meaningful success state on the homepage form
- Inconsistent field sets (city on one, phone on the other, neither collecting audit-relevant data)

## Solution

A single `AuditFlow.vue` component with a conversational progressive flow, deployed in two modes:

- **Teaser mode** (homepage): Single business-name input that navigates to /audit with the value pre-filled
- **Full mode** (/audit page): Multi-step progressive form that reveals one question at a time

## Architecture

### Component: `AuditFlow.vue`

Props:
- `mode: 'teaser' | 'full'` — controls which view to render
- `skip: Boolean` — disables GSAP animations (for prerendered/skip states)

State:
- `currentStep: number` — tracks progress (1-based)
- `formData: reactive({ businessName: string, websiteUrl: string, businessType: string, challenges: string[], email: string, name: string, referralSource: string })`
- `submitted: boolean` — toggles success state
- `errors: reactive({})` — per-field validation errors

Imports:
- `useStripeTransition()` composable — destructure `navigateWithStripes` for teaser mode navigation

### Teaser Mode (Homepage)

Replaces the current `AuditCTA.vue` component. Renders:
- Existing headline: "Find out what's costing you customers right now."
- Existing subtitle copy
- Single text input: placeholder "Your business name"
- Button: "Start my free audit →"
- Existing trust copy below

On submit: calls `navigateWithStripes('/audit?business=' + encodeURIComponent(formData.businessName))` to navigate with the diagonal stripe transition.

Animations: Preserves the existing IntersectionObserver + typewriter headline + staggered input reveal pattern from the current AuditCTA.

### Full Mode (/audit page)

Replaces the form card inside `audit.vue`. The page keeps its hero, "What your audit covers" section, and FAQ section unchanged (except copy updates from 48h → 24h).

#### Step 1: Business Name
- Label: "What's your business called?"
- Input: text, placeholder "e.g. Joe's Coffee House"
- Required, min 2 characters
- If `?business=` query param exists and is >= 2 chars, pre-fill the value, briefly show it filled (300ms), then animate forward to step 2. If < 2 chars, ignore the param and show step 1 empty.
- Back button from step 2 returns to step 1 with the pre-filled value still present and editable.
- Button: "Next →"

#### Step 2: Website URL
- Label: "What's your website?"
- Input: url, placeholder "https://example.com"
- Required, URL format validation
- Button: "Next →"

#### Step 3: Business Type
- Label: "What type of business?"
- Chip-select grid (single select): Restaurant, Retail, Salon/Spa, Clinic, Gym/Fitness, Professional Services, Other
- Required — must select one
- Button: "Next →"

#### Step 4: Biggest Challenge (Optional)
- Label: "What's your biggest challenge right now?"
- Chip-select grid (multi-select): "Not enough traffic", "Poor Google ranking", "Low conversions", "Outdated website", "Not sure where to start", "Help me figure it out"
- "Help me figure it out" is mutually exclusive with specific choices (selecting it deselects others, selecting a specific one deselects it)
- No selection = treated as "Help me figure it out"
- Button: "Next →"

#### Step 5: Email
- Label: "Where should we send your report?"
- Input: email, placeholder "you@example.com"
- Required, email format validation
- Button: "Run my free audit →" (final submit)

#### Step 6: Personalize (Optional, post-submit)
- Revealed after step 5 submit with expand animation
- Label: "Want us to personalize the report?"
- Name input: placeholder "Your name" (optional)
- "How did you hear about us?" chips (single select): Word of mouth, Google, Social media, Other
- Button: "Done"
- Skip link: "No thanks, I'm good"

#### Success State
- Replaces form card content with crossfade
- Animated AAXLO glyph with pulse
- Headline (typewriter reveal): "We're on it."
- Body (fade in): "Your personalized audit will land in **{email}** within 24 hours."
- Trust line: "No commitment. No card. No calls unless you ask."
- Link: "← Back to homepage"

### Progress Indicator

A thin horizontal line at the top of the form card. Width grows proportionally across the 5 main steps (20% increments). Step 6 (personalize) and the success state both show 100% — the bar stays full once submission happens. Animated via GSAP with power2.inOut easing. No step numbers or dots — just the line. Color: `var(--color-accent)` on a `var(--color-border)` track, 2px height.

### Navigation

- Back arrow (←) appears from step 2 onward, positioned top-left of the form card
- Clicking back reverses the step transition animation
- Summary of previous answers shown as small muted text above the current step (e.g. after step 1: "Joe's Coffee House" in 13px, opacity 0.5)

## Chip-Select Component

Inline within `AuditFlow.vue` (no separate component needed — it's just a flex grid of buttons).

### Visual Design
- **Default state**: `background: var(--color-cream)`, `border: 0.5px solid #24272e`, `color: var(--color-dark)`, `padding: 12px 20px`, `font-size: 15px`, `font-weight: 500`, `font-family: var(--font)`, `cursor: pointer`
- **Hover**: `border-color: var(--color-accent)`, `transition: border-color 0.25s`
- **Selected**: `background: var(--color-dark)`, `color: var(--color-cream)`, `border-color: var(--color-dark)`, `transition: all 0.2s`
- **No border-radius** (matches site's sharp-edge aesthetic)

### Grid Layout
- `display: flex`, `flex-wrap: wrap`, `gap: 10px`
- Chips are auto-sized based on content (no fixed columns)
- On mobile (< 768px): chips stack to full width (`flex: 1 1 100%` for chips with long text, `flex: 1 1 calc(50% - 5px)` for short ones)

### Behavior
- Single-select (step 3, step 6 referral): clicking a chip deselects the previous one
- Multi-select (step 4): clicking toggles individual chips. "Help me figure it out" is mutually exclusive — selecting it clears others, selecting any specific one clears it.
- Chips use `<button type="button">` (not links or divs) for keyboard accessibility

## Accessibility

- **Focus management**: When a step transitions, focus moves to the first interactive element of the new step (input or first chip). Use `nextTick()` + `el.focus()` after GSAP animation completes.
- **Chip keyboard navigation**: Chips are `<button type="button">` — Tab navigates between them, Enter/Space toggles selection. Selected chips get `aria-pressed="true"`.
- **Step announcements**: Wrap the form area in an `aria-live="polite"` region. Each step's label acts as the announcement when it appears.
- **Progress bar**: `role="progressbar"`, `aria-valuenow` (current step), `aria-valuemin="1"`, `aria-valuemax="5"`, `aria-label="Form progress"`.
- **Error association**: Error messages use `aria-describedby` linking to the input, and `role="alert"` for immediate announcement.
- **Back button**: `aria-label="Go to previous step"`.

## Animations

All animations use GSAP, matching the site's existing motion language:

### Step Transitions (Full Mode)
- **Forward**: Current step animates out (translateX(-40px), opacity 0, duration 0.25s). Next step animates in (translateX(40px) → 0, opacity 0 → 1, duration 0.3s).
- **Backward**: Reverse direction (current goes right, previous comes from left).
- Easing: power2.out (matching existing site patterns)

### Chip Reveals
- Staggered: scale(0.9) → scale(1) + opacity 0 → 1
- Stagger interval: 0.02s per chip
- Duration: 0.2s per chip

### Teaser Mode
- Preserves the existing IntersectionObserver trigger at threshold 0.2
- Typewriter headline reveal with clipPath + steps() easing
- Input + button staggered opacity/translateY reveal
- Trust text fade in

### Success State
- Form content crossfades out (opacity 0, duration 0.2s)
- Glyph scales in (scale 0.8 → 1, opacity 0 → 1, duration 0.3s)
- Headline typewriter reveals (clipPath, steps() ease, matching hero pattern)
- Body text fades in (opacity 0 → 1, translateY(8px) → 0, duration 0.3s)
- Trust line + link fade in last

### Validation Errors
- Error text slides down below input (translateY(-4px) → 0, opacity 0 → 1, duration 0.15s)
- Chip shake: translateX(0, -4px, 4px, -2px, 0) over 0.3s when user tries to advance without selecting

## Validation Rules

| Field | Required | Rule | Error Message |
|-------|----------|------|---------------|
| Business name | Yes | min 2 chars | "Please enter your business name" |
| Website URL | Yes | URL pattern match | "Please enter a valid URL (e.g. https://example.com)" |
| Business type | Yes | one chip selected | Chips shake — no text error |
| Challenges | No | — | — |
| Email | Yes | email format | "Please enter a valid email" |
| Name | No | — | — |
| Referral source | No | — | — |

Errors clear on input change. Validation runs on "Next" button click, not on blur.

## CTA Unification

### Standardized Labels
All CTAs across the site use exactly two text variants:
- **Navigation buttons**: "Get your free audit"
- **Form submit**: "Run my free audit →"

All CTAs link to `/audit`. All use `navigateWithStripes('/audit')` where the stripe transition is already wired.

## Copy Updates (48h → 24h)

In `audit.vue`:
- Hero subtitle: "all in 48 hours" → "all in 24 hours"
- Head meta description: "Results in 48 hours" → "Results in 24 hours"
- FAQ answer about speed: "deliver in 48 hours" → "deliver in 24 hours"
- Trust signals: "Results in 48 hours" → "Results in 24 hours"
- Success state: "within 24 hours" (already correct in new design)

In `AuditCTA.vue` (being replaced, but the teaser copy carries over):
- Subtitle: "Takes us 24 hours" → already says "24 hours" in current copy (confirm)

## Responsive Behavior (< 768px)

- **Step transitions**: Same translateX animation but with reduced distance (20px instead of 40px)
- **Chip grid**: Chips go full-width or 50% width depending on text length (see Chip-Select section)
- **Progress bar**: Full width, same 2px height — no change needed
- **Back button + summary**: Stack vertically above the step content. Summary text wraps normally.
- **Form card**: Padding reduces from 48px to 24px (matching existing audit.vue responsive styles)
- **Step labels**: Font size stays the same (they're already responsive-friendly at 16-18px)
- **Teaser mode**: Follows existing AuditCTA responsive styles — section padding 80px→20px, input padding reduces

## Files Changed (Explicit List)

| File | Action |
|------|--------|
| `app/components/AuditFlow.vue` | **New** — the unified progressive form component |
| `app/components/AuditCTA.vue` | **Delete** — replaced by `<AuditFlow mode="teaser" />` |
| `app/pages/audit.vue` | **Edit** — replace form card with `<AuditFlow mode="full" />`, update 48h → 24h in all copy |
| `app/pages/index.vue` | **Edit** — swap `<AuditCTA>` for `<AuditFlow mode="teaser" />` |
| `app/components/HomepageHero.vue` | **Edit** — relabel "See what we'd fix first" and its nav-label to "Get your free audit" |
| `app/pages/services/visibility.vue` | **Edit** — "Get my free audit" → "Get your free audit" |
| `app/pages/services/content.vue` | **Edit** — "Get my free audit" → "Get your free audit" |
| `app/pages/services/web.vue` | **Edit** — "Get my free audit" → "Get your free audit" |
| `app/pages/services/automation.vue` | **Edit** — "Get my free audit" → "Get your free audit" |
| `app/pages/services/index.vue` | **Edit** — "Get a free audit" → "Get your free audit" |
| `app/pages/about.vue` | **Edit** — "Get a free audit" → "Get your free audit" |
| `app/components/HomeChecklist.vue` | **Edit** — "See what we'd fix first" → "Get your free audit" |
| `app/components/AppHeader.vue` | **Verify only** — already uses "Get your free audit" |
| `app/components/HomeClose.vue` | **Verify only** — already uses "Get your free audit" |
| `app/pages/contact.vue` | **Verify only** — already uses "Get your free audit" |

Note: `app/pages/services/consulting.vue` has no audit CTA — no changes needed.

## Out of Scope

- Backend form submission (placeholder `handleSubmit` stays)
- Email delivery system
- Analytics/conversion tracking
- A/B testing different step orders
