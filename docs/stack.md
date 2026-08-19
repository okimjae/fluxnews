# fluxnews — Stack de Tecnologias

Versões fixadas e justificativas de cada escolha.

---

## Runtime

| Tecnologia | Versão | Justificativa |
|---|---|---|
| **Node.js** | 22 LTS | LTS ativo até abril 2027. Estável para produção. |
| **pnpm** | 11.x | Workspace nativo, disco compartilhado entre pacotes, mais rápido que npm/yarn. |
| **Python** | 3.13 (via pyenv) | Features modernas de async/await, tipagem nativa melhorada, suporte até 2029. |

### Gerenciar Python com pyenv

```bash
brew install pyenv
pyenv install 3.13
echo "3.13" > agents/.python-version  # versão local do projeto
pip install uv                          # gerenciador de pacotes Python rápido
```

---

## Frontend

| Tecnologia | Versão | Justificativa |
|---|---|---|
| **Next.js** | 16.x | App Router maduro, Turbopack estável, ISR, middleware para multi-tenant. |
| **React** | 19.x | Server Components, concurrent features, use() hook. |
| **TypeScript** | 7.x | Strict mode, performance melhorada. Migração de TS 5→7 exige `verbatimModuleSyntax`. |
| **Tailwind CSS** | 4.x | CSS-first config (sem tailwind.config.js), tokens nativos via CSS custom properties. |
| **shadcn/ui** | latest | Componentes copiados para o projeto (você possui o código), Radix UI acessível. |

### Por que Tailwind 4 muda o jogo para multi-tenant

No Tailwind 3, design tokens eram configurados em JS. No Tailwind 4, são CSS custom properties nativas — perfeito para nosso sistema de temas por tenant:

```css
/* apps/web/app/globals.css */
@theme {
  --color-accent: #F7931A;       /* cripto: laranja */
  --font-display: "Space Grotesk";
}

[data-tenant="saude"] {
  --color-accent: #2D9E6B;       /* saude: verde */
  --font-display: "Lora";
}
```

---

## Banco de Dados

| Tecnologia | Versão | Justificativa |
|---|---|---|
| **Supabase** | hosted | PostgreSQL + pgvector + Realtime + Storage em um serviço. Free tier robusto. |
| **Drizzle ORM** | 0.45.x | Type-safe queries, schema-as-code, migrations versionadas. Sem abstração mágica. |
| **Zod** | 4.x | Validação de schemas em runtime. Integra com Drizzle para inferência de tipos. |

### Por que Drizzle e não Supabase JS direto

Supabase JS retorna `any[]` sem geração de tipos. Drizzle define o schema em TypeScript e infere os tipos de todas as queries automaticamente:

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

// query 100% tipada — TypeScript sabe o shape de `posts`
const posts = await db
  .select()
  .from(postsTable)
  .where(and(
    eq(postsTable.tenant, 'cripto'),
    eq(postsTable.lang, 'pt'),
  ))
```

---

## Qualidade de Código

| Tecnologia | Versão | Justificativa |
|---|---|---|
| **Biome** | 2.x | Lint + format em um binário Rust. 10-100x mais rápido que ESLint + Prettier. Sem conflito de regras. |

### Configuração Biome

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

Comandos:
```bash
pnpm biome ci          # CI: verifica lint + format (não altera)
pnpm biome check       # local: verifica tudo
pnpm biome check --write  # local: corrige automaticamente
```

---

## Build / Monorepo

| Tecnologia | Versão | Justificativa |
|---|---|---|
| **Turborepo** | 2.x | Cache inteligente de tasks, paralelização, pipelines entre pacotes. |

### Pipeline do Turborepo

```json
// turbo.json
{
  "pipeline": {
    "build":      { "dependsOn": ["^build"], "outputs": [".next/**"] },
    "dev":        { "cache": false, "persistent": true },
    "type-check": { "dependsOn": ["^build"] },
    "lint":       {}
  }
}
```

---

## Agentes Python

| Tecnologia | Versão | Justificativa |
|---|---|---|
| **google-generativeai** | latest | Gemini 2.0 Flash — 1.5M context, grátis, multimodal. |
| **groq** | latest | Llama 3.3 70B — geração de texto ultra-rápida, grátis. |
| **httpx** | latest | HTTP async, substituto moderno do requests. |
| **pydantic** | v2 | Validação e serialização de dados dos agentes. |
| **MoviePy** | 2.x | Geração de vídeo (shorts) a partir de imagens + áudio. |
| **feedparser** | latest | Parsing de RSS feeds. |

---

## Infraestrutura / Serviços

| Serviço | Plano | Uso |
|---|---|---|
| **Vercel** | Hobby (free) | Hosting Next.js, preview por PR, domínios customizados |
| **Supabase** | Free tier | PostgreSQL + pgvector + Realtime + Storage |
| **Cloudflare R2** | Free (10GB) | Storage de áudio (boletins) e vídeo (shorts) |
| **GitHub Actions** | Free (público) | Cron dos agentes, CI/CD |
| **Resend** | Free (3k/mês) | Envio de newsletter |
| **Google Cloud TTS** | Free (1M chars) | Text-to-speech para rádio |
| **Google AI Studio** | Free | API do Gemini Flash |
| **Groq** | Free tier | API do Llama 3.3 |
| **NewsAPI.org** | Free (100 req/dia) | Busca de notícias |
| **OneSignal** | Free (10k subs) | Push notifications |

**Custo total: ~R$ 27/mês** (só domínios .com.br)

---

## Variáveis de Ambiente

```env
# Supabase
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Database (Drizzle)
DATABASE_URL=

# IA Models (gratuitos)
GEMINI_API_KEY=
GROQ_API_KEY=

# Fontes de notícia
NEWSAPI_KEY=
SERPER_API_KEY=

# Distribuição
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

# Next.js
NEXTJS_REVALIDATE_SECRET=
```

---

*Última atualização: 2026-08-18*
