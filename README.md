# fluxnews

AI-powered niche blog network. Agents research, write, optimize, and publish content automatically — 24/7, minimal operational cost.

---

## Overview

```
Sources (RSS, NewsAPI, Google News)
        ↓
AI Agents (Researcher → Writer → SEO → Publisher)
        ↓
Supabase (database + storage + realtime)
        ↓
Next.js multi-tenant (8 blogs, 1 codebase, Vercel free)
        ↓
Distribution (Telegram, Newsletter, Radio, Shorts, Pinterest)
```

**Frontend:** Next.js 16 · React 19 · TypeScript 7 · Tailwind 4 · shadcn/ui  
**Quality:** Biome 2 · Turborepo 2 · pnpm 11  
**Database:** Supabase · Drizzle ORM · pgvector · Zod 4  
**Agents:** Python 3.13 · Gemini 2.0 Flash · Groq/Llama 3.3 · MoviePy  
**Infra:** Vercel · GitHub Actions · Cloudflare R2 · Resend  
**Operational cost:** ~$5/month (domains only) · 100% free AI models

---

## Blogs

| Slug | Domain | Niche | Accent | Best Monetization |
|---|---|---|---|---|
| `cripto` | criptosignal.com.br | Crypto & Web3 | `#F7931A` | Binance/Ledger CPA |
| `saude` | saudeplena.net.br | Health & Wellness | `#00A878` | iHerb + Gympass |
| `tech` | techpulse.com.br | AI & Technology | `#6366F1` | Hostinger + high EN RPM |
| `financas` | finanzas360.com.br | Personal Finance | `#1E6B4F` | XP/Rico CPA (up to R$400) |
| `games` | gameverse.com.br | Games & Culture | `#E040FB` | Nuuvem + volume ads |
| `esportes` | golasso.com.br | Football & Sports | `#E63946` | Event traffic spikes |
| `streaming` | streamhit.com.br | Movies & Series | `#FF3B30` | Amazon Prime CPA |
| `mobilidade` | voltaeletrica.com.br | Cars & EVs | `#00B4D8` | Auto insurance leads |

> Full tenant specs (voice, RSS sources, affiliates, author personas, SEO keywords): [docs/tenants.md](docs/tenants.md)

---

## Monorepo Structure

```
fluxnews/
├── apps/
│   └── web/                  # Next.js — all blogs
│       ├── app/
│       │   ├── [tenant]/     # dynamic route per niche
│       │   └── api/          # ISR revalidation, subscribe, RSS
│       ├── tenants/          # config per niche (theme, voice, affiliates)
│       └── middleware.ts     # detects domain → injects tenant
├── packages/
│   ├── ui/                   # shared components (shadcn/ui)
│   ├── db/                   # Drizzle schema + queries
│   └── config/               # shared types and constants
├── agents/                   # Python pipeline
│   ├── orchestrator.py
│   ├── researcher.py
│   ├── writer.py
│   ├── seo_agent.py
│   ├── publisher.py
│   ├── newsletter_agent.py
│   ├── radio_agent.py
│   ├── video_agent.py
│   └── ad_agent.py
├── .github/
│   └── workflows/
│       ├── ci.yml            # PR checks (Biome + TypeScript + build)
│       ├── pipeline.yml      # cron 4h — full content pipeline
│       ├── breaking.yml      # cron 30min — breaking news detector
│       ├── newsletter.yml    # daily 8am — email digest
│       └── radio.yml         # cron 2h — audio bulletins
└── supabase/
    └── migrations/           # versioned schema
```

---

## Implementation Roadmap

> Phases are cumulative — each one builds on the previous.  
> Each phase has a validation loop before advancing.

---

### Phase 0 — Foundation
**Goal:** monorepo running with 1 static blog live on Vercel.

- [ ] Create monorepo with Turborepo + pnpm workspaces
- [ ] Configure Next.js 16 with App Router
- [ ] Implement multi-tenant `middleware.ts`
- [ ] Base design tokens (colors, fonts, spacing)
- [ ] Configure `cripto` tenant as pilot
- [ ] Deploy to Vercel
- [ ] Set up GA4 + Microsoft Clarity
- [ ] Initial Supabase schema with Drizzle ORM

**Done when:** `cripto` blog is live with home page and correct layout.

---

### Phase 1 — Content Pipeline
**Goal:** first articles published automatically.

- [ ] Researcher Agent (RSS + Google News RSS + NewsAPI)
- [ ] Writer Agent (Groq + Llama 3.3 70B)
- [ ] SEO Agent (quality gates + title + meta + JSON-LD)
- [ ] Publisher Agent (Supabase + ISR revalidation)
- [ ] Orchestrator (pure Python logic)
- [ ] GitHub Actions `pipeline.yml` (cron every 4h)
- [ ] Tag system (database + `/tag/[slug]` pages)
- [ ] Internal linking via pgvector semantic search

**Done when:** 3 articles published automatically without intervention.

---

### Phase 2 — Basic Distribution
**Goal:** content reaching beyond the blog.

- [ ] Telegram Bot per niche (Publisher Agent sends)
- [ ] Breaking news detector (`breaking.yml`, cron 30min)
- [ ] Web Stories format (5 cards per article)
- [ ] Newsletter Agent + Resend
- [ ] Inline subscription form in articles
- [ ] Push notifications (OneSignal snippet)
- [ ] Taboola widget

**Done when:** article published → arrives on Telegram and newsletter automatically.

---

### Phase 3 — Audio & Radio
**Goal:** blog with its own radio and auto-generated podcast.

- [ ] Radio Agent (narration script + Google Cloud TTS)
- [ ] Audio storage on Cloudflare R2
- [ ] Persistent player in blog footer
- [ ] `/radio` page with bulletin history
- [ ] Podcast RSS feed (`/podcast/[tenant]/feed.xml`)
- [ ] GitHub Actions `radio.yml` (cron every 2h)
- [ ] Bulletin transcript indexed by SEO Agent

**Done when:** bulletin generated every 2h, playing on blog, available as podcast.

---

### Phase 4 — Native Shorts
**Goal:** short video feed hosted on the blog itself.

- [ ] Video Agent (MoviePy — combines story cards + TTS audio)
- [ ] Video storage on Cloudflare R2
- [ ] `/shorts` page with vertical feed (CSS scroll-snap)
- [ ] Mobile player with auto-play
- [ ] Video structured data (JSON-LD `VideoObject`)
- [ ] AdSense for Video (3s bumper pre-roll)
- [ ] `shorts` table in Supabase

**Done when:** short auto-generated per article, playing on blog.

---

### Phase 5 — Non-Invasive Ads
**Goal:** contextual ad system that preserves UX.

- [ ] Ad Agent (decides ad type based on article context)
- [ ] Contextual Inline Card (affiliate triggered by tag)
- [ ] End Card (newsletter + affiliate after full read)
- [ ] Scroll-triggered (after 60% scroll depth)
- [ ] Product Recommendation Cards (purchase-intent articles)
- [ ] Sponsor of the Day (premium slot per blog per day)
- [ ] Sponsored Data Visualization

**Done when:** correct ad appears for correct article, no generic banners.

---

### Phase 6 — Scale (8 niches)
**Goal:** replicate to all blogs with minimal effort.

- [ ] Tenant config for remaining 7 niches
- [ ] Design tokens per niche (colors, fonts, light/dark)
- [ ] Author personas per niche (bios, AI-generated photos)
- [ ] Institutional pages per domain (`/about`, `/contact`, `/editorial-policy`)
- [ ] Telegram channels per niche
- [ ] Email lists per niche
- [ ] Submit to Google News Publisher Center (8 properties)
- [ ] Google Search Console (8 properties)
- [ ] Pinterest auto-posting in Publisher Agent

**Done when:** all 8 blogs publishing automatically with distinct identities.

---

### Phase 7 — Multilingual
**Goal:** English as second language (higher RPM).

- [ ] Subdirectory structure `/en/` on same domain
- [ ] Writer Agent generates EN natively (not translation)
- [ ] SEO Agent researches keywords in US market
- [ ] hreflang on all pages
- [ ] TTS in English (voice `en-US-Neural2-D`)
- [ ] EN tenant configs for all niches

**Done when:** same article published in PT and EN with distinct URLs and keywords.

---

### Phase 8 — Blog Generator (CLI skill)
**Goal:** create a new blog in any niche with 1 command.

- [ ] CLI `fluxnews create-blog --niche "fashion" --lang en`
- [ ] Auto-generates: tenant config, design tokens, author personas, suggested affiliates
- [ ] Creates Telegram channel, email list, Search Console property
- [ ] Documents new niche in README
- [ ] Claude Code skill to orchestrate everything

**Done when:** new blog live in under 30 minutes, no manual code editing.

---

## Getting Started

```bash
# clone
git clone git@github.com:okimjae/fluxnews.git
cd fluxnews

# install dependencies
pnpm install

# set up environment variables
cp .env.example .env.local

# start local database
npx supabase start

# run the blog
pnpm dev

# run agents manually (dry run)
cd agents && python orchestrator.py --tenant cripto --dry-run
```

---

## Documentation

| Document | Description |
|---|---|
| [docs/stack.md](docs/stack.md) | Tech stack, versions and justifications |
| [docs/workflow.md](docs/workflow.md) | TBD branching, Scrum process, PR flow |
| [docs/tenants.md](docs/tenants.md) | Full spec for all 8 blogs (voice, RSS, affiliates, personas) |
| [docs/design.md](docs/design.md) | Design system: tokens, typography, components *(coming soon)* |
| [docs/architecture.md](docs/architecture.md) | Agent pipeline deep dive *(coming soon)* |

---

*fluxnews — [okimjae](https://github.com/okimjae) · 2026*
