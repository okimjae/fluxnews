# fluxnews — Tenant Specifications

Full configuration spec for all 8 blogs. Each section defines everything needed to bootstrap a tenant: identity, content strategy, monetization, and design tokens.

---

## How Tenants Work

One Next.js app serves all 8 blogs. `middleware.ts` reads the `host` header and sets `x-tenant`. Each tenant has:

- A TypeScript config at `apps/web/tenants/[slug].ts`
- CSS tokens in `apps/web/app/globals.css` under `[data-tenant="slug"]`
- An author persona (bio + avatar for E-E-A-T)
- A set of RSS feeds, keywords, and affiliate programs

The agent pipeline reads the tenant config to produce content in the right voice, for the right keywords, with the right affiliate links.

---

## 1. cripto — Crypto & Web3

| Property | Value |
|---|---|
| **Slug** | `cripto` |
| **Domain** | `criptosignal.com.br` |
| **Niche** | Cryptocurrency, DeFi, Web3, NFTs, blockchain |
| **Accent** | `#F7931A` (Bitcoin orange) |
| **On-Accent** | `#000000` |
| **Display Font** | Instrument Serif |
| **Primary Lang** | `pt` → `en` (Phase 7) |

### Voice & Editorial Line

Analytical and data-driven. No hype, no "to the moon." Every claim backed by on-chain data or credible source. Tone: the knowledgeable friend who has been in the market since 2017 and still isn't euphoric.

**Do:** "Bitcoin's realized cap crossed $600B — here's what that means for price discovery."  
**Don't:** "Bitcoin is about to EXPLODE 🚀"

### Content Sources (RSS)

| Source | Feed URL | Frequency |
|---|---|---|
| CoinDesk | `https://www.coindesk.com/arc/outboundfeeds/rss/` | High |
| CoinTelegraph | `https://cointelegraph.com/rss` | High |
| Decrypt | `https://decrypt.co/feed` | Medium |
| The Block | `https://www.theblock.co/rss.xml` | Medium |
| DeFi Llama Blog | `https://blog.defillama.com/rss/` | Low |

**NewsAPI keywords:** `bitcoin, ethereum, crypto, DeFi, blockchain, web3, NFT, altcoin, stablecoin`

**Google News RSS topics:** `CryptoCurrency`, `Bitcoin`, `Ethereum`

### SEO Focus Keywords

**Short-tail:** bitcoin hoje, ethereum preço, criptomoedas, DeFi  
**Long-tail:** "como comprar bitcoin no brasil", "melhor carteira cripto 2026", "o que é defi"  
**Trending triggers:** halvings, major protocol launches, regulatory news (Brazil CVM, US SEC)

### Monetization

| Program | Type | Commission |
|---|---|---|
| Binance Affiliates | CPA (account creation + trading) | Up to 50% trading fee share |
| Ledger Affiliate | Product sale | 10% commission |
| Coinbase Affiliates | CPA | $10 per new user |
| Mercado Bitcoin | CPA | R$50 per verified account |
| Google AdSense | CPM | Crypto niche RPM ~$8-15 |

**Total revenue potential:** Highest RPM niche in the network. One Ledger sale = ~$15. Active month can yield 20+ conversions.

### Author Persona

**Name:** Lucas Ferreira  
**Title:** Analista de Criptoativos  
**Bio:** Acompanha o mercado de criptomoedas desde 2017. Passou pelo ciclo de baixa de 2018 e pelo boom de 2021 sem vender no pânico. Especialista em análise on-chain e fundamentos de projetos DeFi.  
**Avatar:** AI-generated photo, male, ~32, professional but not corporate  

### Breaking News Triggers

- Bitcoin price moves > ±5% in 1h
- Major protocol hack (any > $1M)
- Regulatory news: Brazil, US, EU
- New ETF filing or approval
- Whale wallet movements (on-chain alert)

---

## 2. saude — Health & Wellness

| Property | Value |
|---|---|
| **Slug** | `saude` |
| **Domain** | `saudeplena.net.br` |
| **Niche** | Health, nutrition, mental health, preventive medicine |
| **Accent** | `#00A878` (clean emerald — health without clinical sterility) |
| **On-Accent** | `#FFFFFF` |
| **Display Font** | Instrument Serif |
| **Primary Lang** | `pt` → `en` |

### Voice & Editorial Line

Evidence-based, warm, accessible. Never alarmist or sensationalist. Translates medical research into language non-doctors understand. Always cites sources (PubMed, WHO, CFM). Adds the "so what" — what can the reader actually do with this information?

**Do:** "New study: 30min walk at moderate pace reduces cardiovascular risk by 21% — here's how to build the habit."  
**Don't:** "Scientists discover walking CURES heart disease!"

### Content Sources (RSS)

| Source | Feed URL | Frequency |
|---|---|---|
| PubMed (via NewsAPI) | API query `health wellness nutrition` | High |
| Healthline | `https://www.healthline.com/rss/health-news` | High |
| Medical News Today | `https://www.medicalnewstoday.com/rss/news.xml` | Medium |
| Harvard Health | `https://www.health.harvard.edu/blog/feed` | Medium |
| WebMD | `https://rss.webmd.com/rss.aspx?RSSSource=RSS_PUBLIC` | Low |

**NewsAPI keywords:** `health, wellness, nutrition, mental health, fitness, medicine, study`

### SEO Focus Keywords

**Short-tail:** saúde, bem-estar, alimentação saudável, exercício  
**Long-tail:** "como melhorar a qualidade do sono", "dieta anti-inflamatória cardápio", "sintomas de burnout"  
**High-value:** mental health content performs well in PT — 3× the search volume of nutrition

### Monetization

| Program | Type | Commission |
|---|---|---|
| iHerb Affiliate | Product sale | 5% commission |
| Gympass | CPA | R$30 per signup |
| Namu Wellness | CPA | Variable |
| Farmácias.com.br | Product sale | 4–8% |
| Google AdSense | CPM | Health RPM ~$6-10 |

### Author Persona

**Name:** Dra. Marina Costa  
**Title:** Médica Preventivista e Nutricionista  
**Bio:** Formada pela UNIFESP, pós-graduação em Medicina do Estilo de Vida. Acredita que prevenção é mais poderosa que tratamento. Escreve para tornar a ciência da saúde acessível para todos.  
**Avatar:** AI-generated photo, female, ~35, approachable professional

### Breaking News Triggers

- New research published in Nature, Lancet, NEJM
- WHO or ANVISA health alert
- Major food recall in Brazil
- Viral health misinformation to debunk

---

## 3. tech — AI & Technology

| Property | Value |
|---|---|
| **Slug** | `tech` |
| **Domain** | `techpulse.com.br` |
| **Niche** | AI, startups, gadgets, programming, future of work |
| **Accent** | `#6366F1` (indigo — tech without the cobalt cliché) |
| **On-Accent** | `#FFFFFF` |
| **Display Font** | Instrument Serif |
| **Primary Lang** | `en` → `pt` (English first — 4× higher RPM in tech niche) |

### Voice & Editorial Line

Curious, forward-thinking, explains complex things simply. Not a press release repeater — always adds a "why does this matter" angle. Not dismissive of AI, not uncritically excited. Pragmatic optimism.

**Do:** "OpenAI's new reasoning model beats PhD-level benchmarks — but here's what it still can't do."  
**Don't:** "OpenAI LAUNCHES new AI that CHANGES EVERYTHING."

### Content Sources (RSS)

| Source | Feed URL | Frequency |
|---|---|---|
| TechCrunch | `https://techcrunch.com/feed/` | High |
| The Verge | `https://www.theverge.com/rss/index.xml` | High |
| Wired | `https://www.wired.com/feed/rss` | Medium |
| MIT Tech Review | `https://www.technologyreview.com/feed/` | Medium |
| Ars Technica | `https://feeds.arstechnica.com/arstechnica/index` | Medium |
| Hacker News Best | `https://hnrss.org/best` | Low (quality filter) |

**NewsAPI keywords:** `artificial intelligence, AI, machine learning, startup, tech, gadgets, OpenAI, Google DeepMind`

### SEO Focus Keywords

**English (primary):** AI tools, machine learning news, best AI apps, tech startups  
**Portuguese:** inteligência artificial, ferramentas de IA, startups brasileiras, programação  
**High-value angle:** "AI for [profession]" — doctors, lawyers, teachers — high search intent

### Monetization

| Program | Type | Commission |
|---|---|---|
| Hostinger Affiliate | Hosting sale | Up to 60% |
| DigitalOcean | CPA | $25 per signup |
| GitHub (Student Pack) | CPA referral | Varies |
| Udemy Affiliate | Course sale | 15% |
| Google AdSense | CPM | Tech RPM EN ~$15-25 |

### Author Persona

**Name:** Rafael Santos  
**Title:** Software Engineer & AI Researcher  
**Bio:** Works at a deep tech startup. Has been following the AI space since GPT-2. Believes good engineering writes are more valuable than hype cycles. Occasional contributor to open source.  
**Avatar:** AI-generated photo, male, ~28, casual tech look

### Breaking News Triggers

- Major AI model release (OpenAI, Google, Anthropic, Meta)
- Startup funding round > $50M in Latin America
- Big Tech earnings beats/misses
- Product launches from Apple, Google, Microsoft

---

## 4. financas — Personal Finance

| Property | Value |
|---|---|
| **Slug** | `financas` |
| **Domain** | `finanzas360.com.br` |
| **Niche** | Investing, personal finance, economy, FGTS, B3 |
| **Accent** | `#1E6B4F` (forest green — money without the clichéd mint) |
| **On-Accent** | `#FFFFFF` |
| **Display Font** | Instrument Serif |
| **Primary Lang** | `pt` |

### Voice & Editorial Line

Trustworthy, practical, demystifying. The persona of a friend who is a financial planner — honest about risk, no silver bullets, no get-rich-quick. Respects that the reader has real money at stake.

**Do:** "Selic a 12,25%: o que muda no seu Tesouro Direto e no crédito do cartão."  
**Don't:** "ESTE fundo vai te fazer MILIONÁRIO em 12 meses!"

### Content Sources (RSS)

| Source | Feed URL | Frequency |
|---|---|---|
| Infomoney | `https://www.infomoney.com.br/feed/` | High |
| Seu Dinheiro | `https://www.seudinheiro.com/feed/` | High |
| Exame Invest | `https://exame.com/invest/feed/` | Medium |
| Bloomberg PT | NewsAPI | Medium |
| Banco Central do Brasil | `https://www.bcb.gov.br/api/feed/pt-br/pressreleases` | Low |

**NewsAPI keywords:** `Selic, FGTS, B3, Tesouro Direto, investimentos, inflação, IPCA, bolsa de valores`

### SEO Focus Keywords

**Short-tail:** Selic, FGTS, investimentos, tesouro direto, renda fixa  
**Long-tail:** "como investir com pouco dinheiro", "melhor investimento 2026", "como declarar cripto no IR"  
**Seasonal:** Imposto de Renda season (Mar–Apr) — massive traffic spike every year

### Monetization

| Program | Type | Commission |
|---|---|---|
| XP Investimentos | CPA | R$100–400 per activated account |
| Rico Investimentos | CPA | R$80 per account |
| NuInvest | CPA | R$50 per account |
| BTG Digital | CPA | Variable |
| Google AdSense | CPM | Finance RPM ~$10-18 |

**Note:** Finance + BR investment broker CPA is the highest payout in the network. One XP conversion = up to R$400.

### Author Persona

**Name:** André Lima  
**Title:** Planejador Financeiro (CFP®)  
**Bio:** Certificado pela Planejar. Ajudou mais de 300 famílias a reorganizar finanças. Acredita que educação financeira deveria ser ensinada na escola e faz sua parte escrevendo para quem não teve essa sorte.  
**Avatar:** AI-generated photo, male, ~40, trustworthy professional look

### Breaking News Triggers

- Copom meeting (SELIC decision)
- IPCA/IPCA-15 release
- B3 circuit breaker (drops > 10%)
- Major company earnings (Petrobras, Vale, Itaú)
- Government economic policy announcements

---

## 5. games — Games & Culture

| Property | Value |
|---|---|
| **Slug** | `games` |
| **Domain** | `gameverse.com.br` |
| **Niche** | Video games, gaming culture, esports, tabletop |
| **Accent** | `#E040FB` (electric magenta — high energy, distinctive) |
| **On-Accent** | `#000000` |
| **Display Font** | Instrument Serif |
| **Primary Lang** | `pt` → `en` |

### Voice & Editorial Line

Enthusiastic, opinionated, in-community. Has taste — not everything that comes out is "amazing." Calls out lazy sequels and celebrates indie gems. Uses gaming vocabulary naturally, without explaining it to outsiders.

**Do:** "Elden Ring Shadow of the Erdtree vendeu 5M em 3 dias — aqui está por que os fãs estão divididos."  
**Don't:** "New game releases — check out the latest titles!"

### Content Sources (RSS)

| Source | Feed URL | Frequency |
|---|---|---|
| IGN | `https://feeds.ign.com/ign/all` | High |
| Kotaku | `https://kotaku.com/rss` | High |
| Rock Paper Shotgun | `https://www.rockpapershotgun.com/feed` | Medium |
| PlayStation Blog | `https://blog.playstation.com/feed/` | Medium |
| Xbox Wire | `https://news.xbox.com/en-us/feed/` | Medium |
| Voxel.com.br | `https://voxel.com.br/feed/` | Medium (PT focus) |

**NewsAPI keywords:** `video games, gaming, PlayStation, Xbox, Nintendo, Steam, esports, indie game`

### SEO Focus Keywords

**Short-tail:** jogos, games, PS5, Xbox, Nintendo Switch  
**Long-tail:** "melhores jogos de 2026", "quando sai [game]", "review [game] vale a pena"  
**High-traffic:** review articles rank well — "vale a pena comprar" intent

### Monetization

| Program | Type | Commission |
|---|---|---|
| Nuuvem (game store) | Product sale | 3–5% |
| PlayStation Store | CPA (PS Plus) | Variable |
| Xbox Game Pass | CPA referral | Variable |
| Amazon Affiliate (consoles) | Product sale | 3–4% |
| Google AdSense | CPM | Games RPM ~$4-8 |

### Author Persona

**Name:** Pedro Alves  
**Title:** Editor de Games  
**Bio:** Joga desde o Mega Drive. Platinou mais de 200 jogos. Acredita que games são a forma de arte mais importante do século XXI e não tem vergonha de defender isso em jantar de família.  
**Avatar:** AI-generated photo, male, ~25, casual, gaming setup background

### Breaking News Triggers

- Major game studio acquisition
- Unexpected game announcement at Nintendo Direct, PlayStation Showcase, Xbox Developer_Direct
- Major game release day (Metacritic score drop)
- Esports tournament results (CBLOL, CS2 Major)

---

## 6. esportes — Football & Sports

| Property | Value |
|---|---|
| **Slug** | `esportes` |
| **Domain** | `golasso.com.br` |
| **Niche** | Brazilian football, Champions League, Formula 1, Olympics |
| **Accent** | `#E63946` (bold red — urgency, passion) |
| **On-Accent** | `#FFFFFF` |
| **Display Font** | Instrument Serif |
| **Primary Lang** | `pt` |

### Voice & Editorial Line

Passionate, fast, real-time. Reads like a smart sports radio presenter — has the information first, analyzes it second, gives an opinion third. Not afraid to say "this transfer was a mistake."

**Do:** "Vini Jr. marca nos últimos minutos. Análise: o que mudou no Real Madrid com Ancelotti."  
**Don't:** "Sports news roundup for the week!"

### Content Sources (RSS)

| Source | Feed URL | Frequency |
|---|---|---|
| GE Globo | `https://ge.globo.com/rss/` | High |
| Lance! | `https://www.lance.com.br/feed/` | High |
| ESPN Brasil | `https://www.espn.com.br/rss` | High |
| Sky Sports | `https://www.skysports.com/rss/12040` | Medium (international) |
| F1 News | `https://www.formula1.com/content/fom-website/en/latest/all.html.xml` | Medium |

**NewsAPI keywords:** `futebol, brasileirão, Champions League, Copa do Mundo, Fórmula 1, Olimpíadas, NFL`

### SEO Focus Keywords

**Short-tail:** futebol, brasileirão, classificação, resultados  
**Long-tail:** "tabela do brasileirão 2026", "próximo jogo do Flamengo", "onde assistir Fórmula 1"  
**Seasonal spikes:** Copa do Mundo, Copa América, Brasileirão season, F1 calendar

### Monetization

| Program | Type | Commission |
|---|---|---|
| Netshoes (sports equipment) | Product sale | 4–8% |
| Decathlon Affiliate | Product sale | 3% |
| Twitch Prime (gaming-adjacent) | CPA | Variable |
| Sports streaming services | CPA | Variable |
| Google AdSense | CPM | Sports RPM ~$5-10 (spikes during events) |

**Note:** Event-based traffic is the differentiator — a Copa do Mundo article can drive 100× normal traffic for 48h.

### Author Persona

**Name:** Carlos Mendes  
**Title:** Repórter Esportivo  
**Bio:** Cobriu dois mundiais. Viajou com a Seleção por 10 anos como repórter free. Sabe o nome de todo jogador do Brasileirão Série B. Fla-flu não tem lado — tem história.  
**Avatar:** AI-generated photo, male, ~45, journalist look

### Breaking News Triggers

- Goal scored in live match (via API)
- Transfer confirmed or denied
- Coach fired or hired
- Injury to key player
- Brazilian National Team squad announcement

---

## 7. streaming — Movies, Series & Entertainment

| Property | Value |
|---|---|
| **Slug** | `streaming` |
| **Domain** | `streamhit.com.br` |
| **Niche** | Netflix, Disney+, streaming wars, film, series |
| **Accent** | `#FF3B30` (cinematic red — vivid, premium feel) |
| **On-Accent** | `#FFFFFF` |
| **Display Font** | Instrument Serif |
| **Primary Lang** | `pt` → `en` |

### Voice & Editorial Line

Entertaining, culturally literate, has an opinion. Writes about streaming as a critic, not as a PR pipeline. Knows the difference between a good season finale and fan service. Recommends things people might have missed.

**Do:** "A 3ª temporada de Succession falha exatamente onde as anteriores triunfavam. Aqui está por quê."  
**Don't:** "New Netflix releases this week you won't want to miss!"

### Content Sources (RSS)

| Source | Feed URL | Frequency |
|---|---|---|
| Deadline | `https://deadline.com/feed/` | High |
| Variety | `https://variety.com/feed/` | High |
| The Wrap | `https://www.thewrap.com/feed/` | Medium |
| IGN Entertainment | `https://feeds.ign.com/ign/entertainment` | Medium |
| Observatório do Cinema | `https://observatoriodocinema.uol.com.br/feed` | Medium (PT) |

**NewsAPI keywords:** `Netflix, streaming, series, film, Disney Plus, HBO, Amazon Prime, movie release`

### SEO Focus Keywords

**Short-tail:** Netflix, séries, filmes, streaming  
**Long-tail:** "o que estreia na netflix em [mês]", "melhores séries de 2026", "onde assistir [título]"  
**High-intent:** "vale a pena assinar [serviço]", review + título específico

### Monetization

| Program | Type | Commission |
|---|---|---|
| Amazon Affiliate (Prime) | CPA | Variable |
| Apple TV+ Affiliate | CPA | Variable |
| Sankhya / ingressos | Ticketing | 3% |
| Book-to-film affiliate (Livraria Cultura) | Product sale | 4% |
| Google AdSense | CPM | Entertainment RPM ~$5-9 |

### Author Persona

**Name:** Ana Beatriz Ramos  
**Title:** Crítica de Entretenimento  
**Bio:** Assistiu mais de 3.000 filmes e perdeu a conta das séries. Tem preferências claras e não tem medo de defender um filme B contra um blockbuster medíocre. Acredita que o melhor da TV nunca esteve tão perto do cinema.  
**Avatar:** AI-generated photo, female, ~30, creative/artistic vibe

### Breaking News Triggers

- Major show cancellation or renewal
- New season premiere (Netflix, Disney+, HBO)
- Major award nominations/wins (Oscar, Emmy, Golden Globe)
- Studio acquisition or merger
- Leak or trailer drop for anticipated title

---

## 8. mobilidade — Cars, EVs & Urban Mobility

| Property | Value |
|---|---|
| **Slug** | `mobilidade` |
| **Domain** | `voltaeletrica.com.br` |
| **Niche** | Electric vehicles, urban mobility, bikes, public transit, automotive |
| **Accent** | `#00B4D8` (electric cyan — EV energy, kinetic) |
| **On-Accent** | `#000000` |
| **Display Font** | Instrument Serif |
| **Primary Lang** | `pt` → `en` |

### Voice & Editorial Line

Technical but accessible, pragmatic, sustainability-aware without being preachy. Covers EVs for the person who is considering buying one, not just for enthusiasts. Honest about range anxiety, charging infrastructure, and real-world costs.

**Do:** "BYD Seagull no Brasil: testamos 800km com apenas R$80 em carregamentos. Resultados reais."  
**Don't:** "Electric cars are the future! Here's everything happening in EVs!"

### Content Sources (RSS)

| Source | Feed URL | Frequency |
|---|---|---|
| Electrek | `https://electrek.co/feed/` | High |
| InsideEVs | `https://insideevs.com/feed/` | High |
| Autoesporte | `https://autoesporte.globo.com/rss/` | Medium |
| Motor Trend | `https://www.motortrend.com/feed/` | Medium |
| Quatro Rodas | `https://quatrorodas.abril.com.br/feed/` | Medium |

**NewsAPI keywords:** `electric vehicle, EV, Tesla, BYD, mobility, charging, autonomous vehicle, e-bike`

### SEO Focus Keywords

**Short-tail:** carro elétrico, EV, Tesla, BYD, mobilidade  
**Long-tail:** "melhor carro elétrico 2026 brasil", "autonomia carro elétrico", "quanto custa carregar elétrico"  
**High-value:** "vale a pena comprar elétrico" — strong purchase intent

### Monetization

| Program | Type | Commission |
|---|---|---|
| OLX/iCarros (auto classifieds) | CPA | Variable |
| Porto Seguro Auto (insurance) | CPA | R$40–100 per lead |
| Webmotors Affiliate | CPA | Variable |
| E-bike affiliate programs | Product sale | 5–10% |
| Google AdSense | CPM | Auto RPM ~$8-15 |

### Author Persona

**Name:** Felipe Torres  
**Title:** Engenheiro e Especialista em Mobilidade Elétrica  
**Bio:** Engenheiro mecânico que virou evangelista de EVs depois de comparar o custo total de propriedade. Tem um BYD, uma e-bike, e uma calculadora sempre à mão. Defende que mobilidade elétrica não é ideologia — é matemática.  
**Avatar:** AI-generated photo, male, ~37, pragmatic-engineer look

### Breaking News Triggers

- New EV model launch in Brazil
- Government incentive for EVs (INOVAR-AUTO, tax changes)
- New charging network expansion
- Recall or safety issue
- Tesla/BYD earnings or delivery numbers

---

## Summary Table

| Slug | Domain | Accent | Lang First | Best Monetization |
|---|---|---|---|---|
| `cripto` | criptosignal.com.br | `#F7931A` | PT | Binance/Ledger CPA |
| `saude` | saudeplena.net.br | `#00A878` | PT | iHerb + Gympass |
| `tech` | techpulse.com.br | `#6366F1` | EN | Hostinger + high RPM |
| `financas` | finanzas360.com.br | `#1E6B4F` | PT | XP/Rico CPA (R$400) |
| `games` | gameverse.com.br | `#E040FB` | PT | Nuuvem + volume ads |
| `esportes` | golasso.com.br | `#E63946` | PT | Event traffic + ads |
| `streaming` | streamhit.com.br | `#FF3B30` | PT | Amazon Prime CPA |
| `mobilidade` | voltaeletrica.com.br | `#00B4D8` | PT | Auto insurance leads |

---

## Phase 6 Checklist (per tenant, before go-live)

- [ ] Domain registered and DNS configured
- [ ] Tenant config file at `apps/web/tenants/[slug].ts`
- [ ] CSS tokens defined in `globals.css`
- [ ] Author persona: name, bio, avatar image
- [ ] RSS feeds validated and tested in Researcher Agent
- [ ] NewsAPI keywords tested (≥ 10 results per query)
- [ ] Affiliate links registered and working
- [ ] Telegram channel created and bot token added to secrets
- [ ] Email list created in Resend
- [ ] Google Search Console property verified
- [ ] Google News Publisher Center submitted
- [ ] Institutional pages live: `/about`, `/contact`, `/editorial-policy`

---

*Last updated: 2026-08-18*
