# fluxnews — Design System

Visual identity, tokens, and component guidelines for the fluxnews blog network.  
All 8 blogs share one component tree. CSS tokens drive the identity shift.

---

## Design Principles

**1. Speed reads as respect.**  
Every millisecond and every visual element that isn't load-bearing for comprehension costs the reader attention. Remove it.

**2. Tenant identity without diverging code.**  
Eight distinct visual personalities, zero component branching on tenant name. The component doesn't know which blog it's on — it only reads CSS tokens.

**3. Editorial, not algorithmic.**  
AI writes the content. The design makes it feel human. Generous typography, curated spacing, credible visual hierarchy. Avoid the "content farm" look at all costs.

**4. Non-invasive by default.**  
No banners, no pop-ups, no interstitials. Ads are contextual cards. Subscriptions are earned (after 60% scroll), not ambushed.

---

## Color System

### Neutrals (shared, all tenants)

Cool blue-tinted grays. Chosen — not defaulted — because they're compatible with the full range of 8 tenant accent colors without fighting any of them.

| Token | Light Value | Dark Value | Usage |
|---|---|---|---|
| `--color-bg` | `#F5F6F8` | `#0D0F12` | Page background |
| `--color-surface` | `#FFFFFF` | `#141619` | Card surfaces |
| `--color-surface-2` | `#ECEEF1` | `#1C2026` | Hover states, alt surfaces |
| `--color-border` | `#DDE0E5` | `#252A31` | Dividers, card outlines |
| `--color-text` | `#0D0F12` | `#ECEEF2` | Body text |
| `--color-text-2` | `#4A5260` | `#8B9099` | Bylines, secondary |
| `--color-text-muted` | `#8B9099` | `#5A6270` | Timestamps, captions |

### Tenant Accents

One accent per blog. Used for: category badges, links, CTA buttons, header indicator line. Never for semantic states (success/warning/error — those are separate).

| Tenant | Accent | On Accent | Why this color |
|---|---|---|---|
| `cripto` | `#F7931A` | `#000000` | Bitcoin orange — unmistakable, warm energy |
| `saude` | `#00A878` | `#FFFFFF` | Clean emerald — health without clinical sterility |
| `tech` | `#6366F1` | `#FFFFFF` | Indigo — distinct from the cobalt/blue default |
| `financas` | `#1E6B4F` | `#FFFFFF` | Forest green — money without the mint cliché |
| `games` | `#E040FB` | `#000000` | Electric magenta — high energy, distinctive |
| `esportes` | `#E63946` | `#FFFFFF` | Bold red — urgency, passion |
| `streaming` | `#FF3B30` | `#FFFFFF` | Cinematic red — vivid, premium |
| `mobilidade` | `#00B4D8` | `#000000` | Electric cyan — EV energy, forward motion |

### Semantic Colors

Separate from accent. Never repurpose the accent for state — they must be distinguishable even when the tenant accent is red (esportes, streaming).

| Token | Value | Usage |
|---|---|---|
| `--color-success` | `#22C55E` | Published, confirmed, connected |
| `--color-warning` | `#F59E0B` | Pending review, processing |
| `--color-error` | `#EF4444` | Failed pipeline, breaking alert |

### CSS Implementation

```css
/* globals.css */

:root {
  /* Neutrals — light mode */
  --color-bg:          #F5F6F8;
  --color-surface:     #FFFFFF;
  --color-surface-2:   #ECEEF1;
  --color-border:      #DDE0E5;
  --color-text:        #0D0F12;
  --color-text-2:      #4A5260;
  --color-text-muted:  #8B9099;

  /* Default accent (cripto as pilot) */
  --color-accent:      #F7931A;
  --color-on-accent:   #000000;

  /* Semantic */
  --color-success:     #22C55E;
  --color-warning:     #F59E0B;
  --color-error:       #EF4444;
}

/* Dark mode — system preference */
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    --color-bg:        #0D0F12;
    --color-surface:   #141619;
    --color-surface-2: #1C2026;
    --color-border:    #252A31;
    --color-text:      #ECEEF2;
    --color-text-2:    #8B9099;
    --color-text-muted:#5A6270;
  }
}

/* Dark mode — explicit toggle */
:root[data-theme="dark"] {
  --color-bg:        #0D0F12;
  --color-surface:   #141619;
  --color-surface-2: #1C2026;
  --color-border:    #252A31;
  --color-text:      #ECEEF2;
  --color-text-2:    #8B9099;
  --color-text-muted:#5A6270;
}

/* Tenant accent overrides — middleware sets data-tenant on <html> */
[data-tenant="cripto"]    { --color-accent: #F7931A; --color-on-accent: #000000; }
[data-tenant="saude"]     { --color-accent: #00A878; --color-on-accent: #FFFFFF; }
[data-tenant="tech"]      { --color-accent: #6366F1; --color-on-accent: #FFFFFF; }
[data-tenant="financas"]  { --color-accent: #1E6B4F; --color-on-accent: #FFFFFF; }
[data-tenant="games"]     { --color-accent: #E040FB; --color-on-accent: #000000; }
[data-tenant="esportes"]  { --color-accent: #E63946; --color-on-accent: #FFFFFF; }
[data-tenant="streaming"] { --color-accent: #FF3B30; --color-on-accent: #FFFFFF; }
[data-tenant="mobilidade"]{ --color-accent: #00B4D8; --color-on-accent: #000000; }
```

---

## Typography

### Typefaces

| Role | Family | Google Fonts import | Why |
|---|---|---|---|
| **Display** | Instrument Serif | `Instrument+Serif:ital@0;1` | Contemporary serif with editorial character and warmth. Not Playfair, not Georgia. Scales from 64px hero to 24px card headline. Italic variant used for excerpts. |
| **Body** | Plus Jakarta Sans | `Plus+Jakarta+Sans:wght@400;500;600;700` | Warm, readable at small sizes, excellent numerics. Distinctive without being decorative. Not Inter. |
| **Mono** | DM Mono | `DM+Mono:wght@400;500` | Prices, timestamps, code. Pairs well with Jakarta Sans. |

```html
<!-- in <head> -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Plus+Jakarta+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap">
```

### Type Scale

| Token | Size | Line Height | Weight | Family | Usage |
|---|---|---|---|---|---|
| `--text-hero` | `clamp(2.5rem, 5vw, 4rem)` | 1.1 | 700 | Instrument Serif | Hero headline |
| `--text-2xl` | `2rem` | 1.2 | 700 | Instrument Serif | Section headings |
| `--text-xl` | `1.5rem` | 1.3 | 600 | Instrument Serif | Card headlines |
| `--text-lg` | `1.125rem` | 1.4 | 600 | Plus Jakarta Sans | Sub-headings, nav |
| `--text-base` | `1rem` | 1.65 | 400 | Plus Jakarta Sans | Body text |
| `--text-sm` | `0.875rem` | 1.5 | 400 | Plus Jakarta Sans | Captions, bylines |
| `--text-xs` | `0.75rem` | 1.4 | 500 | Plus Jakarta Sans | Badges, labels |
| `--text-mono` | `0.875rem` | 1.4 | 400 | DM Mono | Prices, timestamps |

### Rules

- Headings: Instrument Serif. Body + UI: Plus Jakarta Sans. Data: DM Mono.
- Excerpt text on `HeroArticle` uses Instrument Serif **italic** — adds warmth, distinguishes excerpt from headline.
- Max body line width: `65ch`.
- Uppercase labels: `letter-spacing: 0.08em` (badges, section eyebrows).
- Numbers in tabular context (prices, stats): `font-variant-numeric: tabular-nums`.
- `text-wrap: balance` on all headings.

---

## Layout

### Grid System

- Container: `max-width: 1280px`, centered, `padding-inline: clamp(1rem, 5vw, 2rem)`
- 12-column CSS grid, `gap: 1.5rem`
- Tablet (≥768px): 8 columns
- Mobile (<768px): single column

### Editorial Grid (Home Feed)

Chosen layout: **Hero + 3-column card grid**.

```
Desktop (≥1024px):
┌─────────────────────────────────────────┐
│         HERO ARTICLE (12 cols)          │
│  Image (21:9) · Badge · Title · Excerpt │
└─────────────────────────────────────────┘
┌─────────────┐ ┌─────────────┐ ┌────────┐
│  Card (4)   │ │  Card (4)   │ │Card (4)│
│  16:9 img   │ │  16:9 img   │ │16:9 img│
│  Badge      │ │  Badge      │ │Badge   │
│  Title      │ │  Title      │ │Title   │
│  Meta       │ │  Meta       │ │Meta    │
└─────────────┘ └─────────────┘ └────────┘

Tablet (768px–1023px):
┌─────────────────────────┐
│   HERO (8 cols / full)  │
└─────────────────────────┘
┌─────────────┐ ┌─────────┐
│  Card (4)   │ │ Card (4)│
└─────────────┘ └─────────┘

Mobile (<768px):
┌─────────────┐
│    HERO     │
└─────────────┘
┌─────────────┐
│    Card     │
└─────────────┘
```

### Spacing Scale

Base unit: `4px`. Scale: `4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96`

### Breakpoints (Tailwind 4 notation)

| Name | Min Width | Usage |
|---|---|---|
| `sm` | `640px` | Small tablet |
| `md` | `768px` | Tablet grid switches |
| `lg` | `1024px` | Desktop 3-column grid |
| `xl` | `1280px` | Max container width |

---

## Components

### Header

```
[Logo + tenant name]          [Nav links]          [Search] [☾]
─────────────────────────────────────────────────────────── ← 2px accent line
```

- `position: sticky; top: 0; z-index: 50`
- Glass blur: `backdrop-filter: blur(12px)`
- Background: `color-mix(in srgb, var(--color-bg) 85%, transparent)`
- Bottom border: `2px solid var(--color-accent)` — the one tenant-specific visible touch
- Mobile: hamburger → slide-in drawer from left (`translateX` transition)

### ArticleCard — Hero Variant

Full-width. Used once per feed (the most important article).

- Image: `aspect-ratio: 21/9`, full bleed, `object-fit: cover`
- Overlay: `linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 60%)`
- Category badge: top-left, accent color
- Title: bottom-left, `--text-hero`, Instrument Serif, white
- Excerpt: below title, **Instrument Serif italic**, `--text-lg`, `color: rgba(255,255,255,0.8)`
- Meta row: author avatar (24px) + name + date + read time, `--text-sm`

### ArticleCard — Grid Variant

Used 3 per row (or stacked on mobile).

- Image: `aspect-ratio: 16/9`, `object-fit: cover`
- Category badge: top-left on image
- Title: `--text-xl`, Instrument Serif, max 2 lines, `overflow: hidden`
- Excerpt: `--text-sm`, Plus Jakarta Sans, hidden on mobile, 2 lines on desktop
- Meta: date + read time (no avatar on grid cards — too small)
- Background: `var(--color-surface)`, `border: 1px solid var(--color-border)`

**Hover state (both variants):**
```css
.article-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 24px color-mix(in srgb, var(--color-accent) 15%, transparent);
  transition: transform 200ms ease-out, box-shadow 200ms ease-out;
}
```

### Badge (Category / Tag)

```css
.badge {
  background: color-mix(in srgb, var(--color-accent) 15%, transparent);
  color: var(--color-accent);
  border: 1px solid color-mix(in srgb, var(--color-accent) 30%, transparent);
  border-radius: 4px;
  padding: 2px 8px;
  font-size: var(--text-xs);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}
```

### Button

| Variant | Background | Text | Border | Usage |
|---|---|---|---|---|
| `primary` | `var(--color-accent)` | `var(--color-on-accent)` | none | Main CTA (subscribe, read more) |
| `secondary` | `var(--color-surface-2)` | `var(--color-text)` | `1px solid var(--color-border)` | Secondary actions |
| `ghost` | `transparent` | `var(--color-accent)` | none | Inline, low-emphasis |

All buttons: `border-radius: 6px`, `padding: 10px 20px`, `font-weight: 600`.

### Meta Row

```
[Avatar 24px]  Lucas Ferreira  ·  18 ago 2026  ·  4 min read
```

- Font: Plus Jakarta Sans, `--text-sm`, `--color-text-2`
- Separator: `·` with `color: var(--color-text-muted)`
- Avatar: `border-radius: 50%`, `width: 24px`, `height: 24px`

---

## Motion

**Philosophy:** one purposeful animation beats ten decorative ones. This is a news site — the content moves, not the chrome.

| Interaction | What | Duration | Easing |
|---|---|---|---|
| Card hover | `translateY(-3px)` + accent shadow | `200ms` | `ease-out` |
| Page load cards | Fade + `translateY(8px)` → 0, staggered | `300ms` + `50ms` per card | `ease-out` |
| Nav drawer (mobile) | `translateX(-100%)` → 0 | `250ms` | `cubic-bezier(0.4, 0, 0.2, 1)` |
| Tenant switch | Color transitions via CSS custom props | `250ms` | `ease` |

Always wrap transforms in:
```css
@media (prefers-reduced-motion: reduce) {
  * { animation: none !important; transition: color 150ms, background 150ms !important; }
}
```

---

## Dark Mode Implementation

Default renders in light. Three states handled:

```css
/* 1. Default (system, no data-theme stamp): define full light palette on :root */
:root { --color-bg: #F5F6F8; /* ... */ }

/* 2. System dark (OS dark mode, no explicit user choice): */
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) { --color-bg: #0D0F12; /* ... */ }
}

/* 3. Explicit dark toggle: */
:root[data-theme="dark"] { --color-bg: #0D0F12; /* ... */ }
```

The `body` always has `background: var(--color-bg)` — never transparent.  
No color is defined only inside a media or `[data-theme]` block — that causes the classic "dark text on dark background" bug.

---

## Component File Map

```
apps/web/
├── components/
│   ├── Header.tsx            ← logo + nav + theme toggle
│   ├── ArticleCard.tsx       ← hero + grid variants (variant prop)
│   ├── ArticleFeed.tsx       ← hero + 3-col grid layout
│   ├── Badge.tsx             ← category/tag chip
│   ├── MetaRow.tsx           ← author + date + read time
│   └── Footer.tsx            ← links + radio player slot
├── tenants/
│   ├── cripto.ts
│   ├── saude.ts
│   ├── tech.ts
│   ├── financas.ts
│   ├── games.ts
│   ├── esportes.ts
│   ├── streaming.ts
│   └── mobilidade.ts
└── app/
    └── globals.css           ← all tokens + tenant overrides

packages/ui/
└── src/components/
    ├── Button.tsx            ← 3 variants
    └── Typography.tsx        ← Heading, Text, Mono wrappers
```

---

## Tenant Typography Per Niche (Optional Overrides)

Base: Instrument Serif display + Plus Jakarta Sans body for all tenants.

Tenants that benefit from additional weight/tracking adjustments:

| Tenant | Heading Weight | Notes |
|---|---|---|
| `cripto` | 700 | Slightly tighter tracking on hero (`letter-spacing: -0.02em`) |
| `games` | 700 | Can use `font-style: italic` for energy |
| `esportes` | 700 | Uppercase hero title (`text-transform: uppercase`) |
| `financas` | 600 | More conservative, no tracking adjustment |

These are *optional CSS overrides* in `globals.css` under `[data-tenant="slug"]`, not separate component logic.

---

*Last updated: 2026-08-18*
