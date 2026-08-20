# fluxnews — Tech Stack

Pinned versions and justification for every technology choice.

---

## Runtime

| Technology | Version | Justification |
|---|---|---|
| **Node.js** | 22 LTS | Active LTS until April 2027. Production-stable. |
| **pnpm** | 11.x | Native workspaces, shared disk cache, faster than npm/yarn in monorepos. |
| **Python** | 3.13 (via pyenv) | Modern async/await, improved native typing, supported until 2029. |

### Managing Python with pyenv

```bash
brew install pyenv
pyenv install 3.13
echo "3.13" > agents/.python-version   # project-local version
pip install uv                           # fast Python package manager
```

---

## Frontend

| Technology | Version | Justification |
|---|---|---|
| **Next.js** | 16.x | Stable App Router, Turbopack, ISR, middleware for multi-tenant routing. |
| **React** | 19.x | Server Components, concurrent features, `use()` hook. |
| **TypeScript** | 7.x | Strict mode, improved performance. TS 7 requires `verbatimModuleSyntax`. |
| **Tailwind CSS** | 4.x | CSS-first config (no `tailwind.config.js`), native CSS custom properties. |
| **shadcn/ui** | latest | Components copied into the project (you own the code), Radix UI accessibility. |

### Why Tailwind 4 is ideal for multi-tenant

In Tailwind 3, design tokens lived in JS config. In Tailwind 4, they are native CSS custom properties — perfect for our per-tenant theme system:

```css
/* apps/web/app/globals.css */
@theme {
  --color-accent: #F7931A;
  --font-display: "Space Grotesk";
}

[data-tenant="saude"] {
  --color-accent: #2D9E6B;
  --font-display: "Lora";
}
```

One `<ArticleCard />` component, eight distinct visuals — zero code duplication.

---

## Database

| Technology | Version | Justification |
|---|---|---|
| **Supabase** | hosted | PostgreSQL + pgvector + Realtime + Storage in one service. Generous free tier. |
| **Drizzle ORM** | 0.45.x | Type-safe queries, schema-as-code, versioned migrations. No magic abstraction. |
| **Zod** | 4.x | Runtime schema validation. Integrates with Drizzle for full type inference. |

### Why Drizzle over raw Supabase JS

Supabase JS returns `any[]` without type generation. Drizzle defines the schema in TypeScript and infers types across all queries automatically:

```typescript
// packages/db/schema.ts
export const posts = pgTable('posts', {
  id:          uuid('id').primaryKey().defaultRandom(),
  tenant:      text('tenant').notNull(),
  title:       text('title').notNull(),
  slug:        text('slug').notNull(),
  content:     text('content').notNull(),
  lang:        text('lang').notNull().default('pt'),
  seoScore:    integer('seo_score'),
  publishedAt: timestamp('published_at'),
  embedding:   vector('embedding', { dimensions: 1536 }),
})

// fully typed query — TypeScript knows the exact shape of `posts`
const posts = await db
  .select()
  .from(postsTable)
  .where(and(
    eq(postsTable.tenant, 'cripto'),
    eq(postsTable.lang, 'pt'),
  ))
```

---

## Code Quality

| Technology | Version | Justification |
|---|---|---|
| **Biome** | 2.x | Lint + format in one Rust binary. 10-100x faster than ESLint + Prettier. No rule conflicts. |

### Biome configuration

```json
// biome.json
{
  "$schema": "https://biomejs.dev/schemas/2.0.0/schema.json",
  "organizeImports": { "enabled": true },
  "linter": {
    "enabled": true,
    "rules": { "recommended": true }
  },
  "formatter": {
    "enabled": true,
    "indentStyle": "space",
    "indentWidth": 2
  }
}
```

Commands:
```bash
pnpm biome ci            # CI: check lint + format (read-only)
pnpm biome check         # local: check everything
pnpm biome check --write # local: auto-fix
```

---

## Build / Monorepo

| Technology | Version | Justification |
|---|---|---|
| **Turborepo** | 2.x | Smart task caching, parallelization, cross-package pipelines. |

### Turborepo pipeline

```json
// turbo.json
{
  "pipeline": {
    "build":       { "dependsOn": ["^build"], "outputs": [".next/**"] },
    "dev":         { "cache": false, "persistent": true },
    "type-check":  { "dependsOn": ["^build"] },
    "lint":        {}
  }
}
```

---

## Python Agents

| Package | Version | Justification |
|---|---|---|
| **google-generativeai** | latest | Gemini 2.0 Flash — primary LLM. 1.5M context window, free, multimodal. |
| **httpx** | latest | Sync HTTP client, modern replacement for `requests`. |
| **pydantic** | v2 | Agent data validation and serialization. |
| **MoviePy** | 2.x | Video generation (shorts) from images + audio. |
| **feedparser** | latest | RSS feed parsing. |

> **Gemini 2.0 Flash** is the sole LLM used across all agents (content generator, SEO, radio script). The free tier (Google AI Studio key) covers the expected volume. Groq was evaluated but removed to reduce dependency surface and keep a single AI provider.

---

## Infrastructure & Services

| Service | Plan | Usage |
|---|---|---|
| **Vercel** | Hobby (free) | Next.js hosting, PR previews, custom domains |
| **Supabase** | Free tier | PostgreSQL + pgvector + Realtime + Storage |
| **Cloudflare R2** | Free (10GB) | Audio (bulletins) and video (shorts) storage |
| **GitHub Actions** | Free (public repo) | Agent cron jobs, CI/CD |
| **Resend** | Free (3k/month) | Newsletter sending |
| **Google Cloud TTS** | Free (1M chars) | Text-to-speech for radio |
| **Google AI Studio** | Free | Gemini Flash API |
| **Google AI Studio** | Free | Gemini Flash API — sole LLM |
| **NewsAPI.org** | Free (100 req/day) | News search |
| **OneSignal** | Free (10k subs) | Push notifications |

**Total cost: ~$5/month** (domains only)

---

## Environment Variables

```env
# Supabase
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Database (Drizzle direct connection)
DATABASE_URL=

# AI Models (free)
GEMINI_API_KEY=
# GROQ_API_KEY — removed, Gemini is the sole LLM

# News sources
NEWSAPI_KEY=
SERPER_API_KEY=

# Distribution
TELEGRAM_BOT_TOKEN_CRIPTO=
TELEGRAM_BOT_TOKEN_SAUDE=
TELEGRAM_BOT_TOKEN_TECH=
TELEGRAM_BOT_TOKEN_FINANCAS=
TELEGRAM_BOT_TOKEN_GAMES=
TELEGRAM_BOT_TOKEN_ESPORTES=
TELEGRAM_BOT_TOKEN_STREAMING=
TELEGRAM_BOT_TOKEN_MOBILIDADE=
RESEND_API_KEY=

# Storage (Cloudflare R2)
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET=
R2_PUBLIC_URL=

# TTS
GOOGLE_CLOUD_TTS_KEY=

# Next.js internal
NEXTJS_REVALIDATE_SECRET=
```

---

*Last updated: 2026-08-18*
