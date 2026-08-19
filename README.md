# fluxnews

Rede de blogs de nicho operados por agentes de IA. Pesquisa, escreve, otimiza e publica conteúdo automaticamente — 24h por dia, custo operacional mínimo.

---

## Visão Geral

```
Fontes (RSS, NewsAPI, Google News)
        ↓
Agentes IA (Researcher → Writer → SEO → Publisher)
        ↓
Supabase (banco + storage + realtime)
        ↓
Next.js multi-tenant (8 blogs, 1 codebase, Vercel free)
        ↓
Distribuição (Telegram, Newsletter, Rádio, Shorts, Pinterest)
```

**Frontend:** Next.js 16 · React 19 · TypeScript 7 · Tailwind 4 · shadcn/ui  
**Qualidade:** Biome 2 · Turborepo 2 · pnpm 11  
**Banco:** Supabase · Drizzle ORM · pgvector · Zod 4  
**Agentes:** Python 3.13 · Gemini 2.0 Flash · Groq/Llama 3.3 · MoviePy  
**Infra:** Vercel · GitHub Actions · Cloudflare R2 · Resend  
**Custo operacional:** ~R$ 27/mês (só domínios) · Modelos 100% gratuitos

---

## Os Blogs

| Slug | Nicho | Monetização Principal |
|---|---|---|
| `cripto` | Criptomoedas & Web3 | Afiliado CPA + Ads |
| `saude` | Saúde & bem-estar | Afiliado + Ads |
| `tech` | IA & Tecnologia | Afiliado hosting |
| `financas` | Finanças pessoais | Afiliado + Ads |
| `games` | Games & cultura | Ads volume |
| `esportes` | Futebol & esportes | Ads eventos |
| `streaming` | Filmes & séries | Ads + afiliado |
| `mobilidade` | Carros & EVs | Afiliado + Ads |

---

## Estrutura do Monorepo

```
fluxnews/
├── apps/
│   └── web/                  # Next.js — todos os blogs
│       ├── app/
│       │   ├── [tenant]/     # rota dinâmica por nicho
│       │   └── api/          # revalidação ISR, subscribe, RSS
│       ├── tenants/          # config por nicho (tema, voz, afiliados)
│       └── middleware.ts     # detecta domínio → injeta tenant
├── packages/
│   ├── ui/                   # componentes compartilhados (shadcn/ui)
│   ├── db/                   # schema Supabase + queries
│   └── config/               # tipos e constantes compartilhados
├── agents/                   # pipeline Python
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
│       ├── pipeline.yml      # cron 4h — pipeline completo
│       ├── breaking.yml      # cron 30min — breaking news
│       ├── newsletter.yml    # cron diário 8h
│       └── radio.yml         # cron 2h — boletins de áudio
└── supabase/
    └── migrations/           # schema versionado
```

---

## Roadmap de Implementação

> As fases são cumulativas — cada uma adiciona sobre a anterior.  
> Cada fase tem um loop de validação antes de avançar.

---

### Fase 0 — Fundação

**Objetivo:** monorepo rodando com 1 blog estático no ar.

- [ ] Criar monorepo com Turborepo
- [ ] Configurar Next.js com App Router
- [ ] Implementar `middleware.ts` multi-tenant
- [ ] Criar design tokens base (cores, fontes, espaçamentos)
- [ ] Configurar tenant `cripto` como piloto
- [ ] Deploy no Vercel (domínio temporário)
- [ ] Configurar GA4 + Microsoft Clarity
- [ ] Criar schema inicial no Supabase

**Critério de conclusão:** blog `cripto` no ar com página home e layout correto.

---

### Fase 1 — Pipeline de Conteúdo

**Objetivo:** primeiros artigos publicados automaticamente.

- [ ] Researcher Agent (RSS + Google News RSS + NewsAPI)
- [ ] Writer Agent (Groq + Llama 3.3 70B)
- [ ] SEO Agent (quality gates + title + meta + JSON-LD)
- [ ] Publisher Agent (Supabase + ISR revalidation)
- [ ] Orchestrator (lógica Python pura)
- [ ] GitHub Actions workflow `pipeline.yml` (cron 4h)
- [ ] Sistema de tags (banco + páginas `/tag/[slug]`)
- [ ] Internal linking via pgvector

**Critério de conclusão:** 3 artigos publicados automaticamente sem intervenção.

---

### Fase 2 — Distribuição Básica

**Objetivo:** conteúdo chegando além do blog.

- [ ] Telegram Bot por nicho (Publisher Agent envia)
- [ ] Breaking news detector (`breaking.yml`, cron 30min)
- [ ] Web Stories format (5 cards por artigo)
- [ ] Newsletter Agent + Resend
- [ ] Formulário de inscrição inline nos artigos
- [ ] Push notifications (OneSignal snippet)
- [ ] Taboola widget (snippet)

**Critério de conclusão:** artigo publicado → chega no Telegram e na newsletter automaticamente.

---

### Fase 3 — Áudio e Rádio

**Objetivo:** blog com rádio própria e podcast gerado automaticamente.

- [ ] Radio Agent (script de locução + Google Cloud TTS)
- [ ] Storage de áudio no Cloudflare R2
- [ ] Player persistente no rodapé do blog
- [ ] Página `/radio` com histórico de boletins
- [ ] RSS feed de podcast (`/podcast/[tenant]/feed.xml`)
- [ ] GitHub Actions `radio.yml` (cron 2h)
- [ ] Transcrição do boletim indexada pelo SEO

**Critério de conclusão:** boletim gerado a cada 2h, tocando no blog, disponível como podcast.

---

### Fase 4 — Shorts Nativos

**Objetivo:** feed de vídeos curtos hospedado no próprio blog.

- [ ] Video Agent (MoviePy — combina story cards + áudio TTS)
- [ ] Storage de vídeo no Cloudflare R2
- [ ] Página `/shorts` com feed vertical (scroll-snap)
- [ ] Player mobile com auto-play
- [ ] Video structured data (JSON-LD `VideoObject`)
- [ ] AdSense for Video (pre-roll 3s bumper)
- [ ] Tabela `shorts` no Supabase

**Critério de conclusão:** short gerado automaticamente a cada artigo, tocando no blog.

---

### Fase 5 — Ads Não-Invasivos

**Objetivo:** sistema de ads contextual que preserva UX.

- [ ] Ad Agent (decide tipo de ad por contexto do artigo)
- [ ] Contextual Inline Card (affiliate por tag)
- [ ] End Card (newsletter + afiliado após leitura completa)
- [ ] Scroll-triggered (após 60% de leitura)
- [ ] Product Recommendation Cards (para artigos com intenção de compra)
- [ ] Sponsor of the Day (slot premium por blog por dia)
- [ ] Data Visualization patrocinada

**Critério de conclusão:** ad correto aparece para artigo correto, sem banner genérico.

---

### Fase 6 — Escala (8 nichos)

**Objetivo:** replicar para todos os blogs com mínimo de esforço.

- [ ] Criar tenant config para os 7 nichos restantes
- [ ] Design tokens por nicho (cores, fontes, modo claro/escuro)
- [ ] Personas de autores por nicho (bios, fotos geradas)
- [ ] Páginas institucionais por domínio (`/sobre`, `/contato`, `/politica-editorial`)
- [ ] Canais Telegram por nicho
- [ ] Listas de email por nicho
- [ ] Submissão ao Google News Publisher Center (8 propriedades)
- [ ] Google Search Console (8 propriedades)
- [ ] Pinterest auto-posting no Publisher Agent

**Critério de conclusão:** todos os 8 blogs publicando automaticamente com identidade própria.

---

### Fase 7 — Multilíngue

**Objetivo:** inglês como segundo idioma (maior RPM).

- [ ] Decisão de estrutura: subdiretórios `/en/` no mesmo domínio
- [ ] Writer Agent gera EN nativamente (não tradução)
- [ ] SEO Agent pesquisa keywords no mercado US
- [ ] hreflang em todas as páginas
- [ ] TTS em inglês (voz `en-US-Neural2-D`)
- [ ] Tenant configs em EN para todos os nichos

**Critério de conclusão:** mesmo artigo publicado em PT e EN com URLs e keywords distintas.

---

### Fase 8 — Gerador de Novos Blogs (skill)

**Objetivo:** criar um novo blog em qualquer nicho com 1 comando.

- [ ] CLI `fluxnews create-blog --niche "moda" --lang pt`
- [ ] Gera automaticamente: tenant config, design tokens, personas, afiliados sugeridos
- [ ] Cria canal Telegram, lista de email, propriedade Search Console
- [ ] Documenta o novo nicho no README
- [ ] Skill Claude Code para orquestrar tudo isso

**Critério de conclusão:** novo blog no ar em menos de 30 minutos, sem editar código manualmente.

---

## Como Rodar Localmente

```bash
# clone
git clone git@github.com:okimjae/fluxnews.git
cd fluxnews

# instala dependências
npm install

# configura variáveis de ambiente
cp .env.example .env.local
# preencha: SUPABASE_URL, SUPABASE_ANON_KEY, GEMINI_API_KEY, GROQ_API_KEY...

# sobe o banco
npx supabase start

# roda o blog
npm run dev

# roda os agentes manualmente
cd agents && python orchestrator.py --tenant cripto --dry-run
```

---

## Variáveis de Ambiente

```env
# Supabase
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Modelos IA (gratuitos)
GEMINI_API_KEY=
GROQ_API_KEY=

# Fontes de notícia
NEWSAPI_KEY=
SERPER_API_KEY=

# Distribuição
TELEGRAM_BOT_TOKEN_CRIPTO=
RESEND_API_KEY=

# Storage
CLOUDFLARE_R2_ACCESS_KEY=
CLOUDFLARE_R2_SECRET_KEY=
CLOUDFLARE_R2_BUCKET=

# TTS
GOOGLE_CLOUD_TTS_KEY=
```

---

## Documentação Completa

Ver [`/docs/architecture.md`](/docs/architecture.md) para detalhes de cada agente, decisões de tecnologia e estratégia de monetização.

---

*fluxnews — okimjae · 2026*
