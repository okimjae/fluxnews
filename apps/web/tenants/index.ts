import type { TenantConfig, TenantSlug } from '@fluxnews/config';

const configs: Record<TenantSlug, TenantConfig> = {
  cripto: {
    slug: 'cripto',
    name: 'CriptoSignal',
    domain: 'criptosignal.com.br',
    accent: '#F7931A',
    onAccent: '#000000',
    niche: 'Crypto & Web3',
    voice:
      'Analytical and data-driven. No hype, no "to the moon." Every claim backed by on-chain data.',
    primaryLang: 'pt',
    affiliates: ['binance', 'ledger', 'coinbase', 'mercado-bitcoin'],
    rssSources: [
      'https://www.coindesk.com/arc/outboundfeeds/rss/',
      'https://cointelegraph.com/rss',
      'https://decrypt.co/feed',
      'https://www.theblock.co/rss.xml',
    ],
    newsApiKeywords: ['bitcoin', 'ethereum', 'crypto', 'DeFi', 'blockchain', 'web3', 'NFT'],
    author: {
      name: 'Lucas Ferreira',
      title: 'Analista de Criptoativos',
      bio: 'Acompanha o mercado de criptomoedas desde 2017. Especialista em análise on-chain e fundamentos de projetos DeFi.',
    },
  },
  saude: {
    slug: 'saude',
    name: 'SaúdePlena',
    domain: 'saudeplena.net.br',
    accent: '#00A878',
    onAccent: '#FFFFFF',
    niche: 'Saúde & Bem-estar',
    voice: 'Evidence-based, warm, accessible. Never alarmist. Always cites sources.',
    primaryLang: 'pt',
    affiliates: ['iherb', 'gympass', 'namu'],
    rssSources: [
      'https://www.healthline.com/rss/health-news',
      'https://www.medicalnewstoday.com/rss/news.xml',
      'https://www.health.harvard.edu/blog/feed',
    ],
    newsApiKeywords: ['health', 'wellness', 'nutrition', 'mental health', 'fitness', 'medicine'],
    author: {
      name: 'Dra. Marina Costa',
      title: 'Médica Preventivista e Nutricionista',
      bio: 'Formada pela UNIFESP, pós-graduação em Medicina do Estilo de Vida. Acredita que prevenção é mais poderosa que tratamento.',
    },
  },
  tech: {
    slug: 'tech',
    name: 'TechPulse',
    domain: 'techpulse.com.br',
    accent: '#6366F1',
    onAccent: '#FFFFFF',
    niche: 'AI & Technology',
    voice:
      'Curious, forward-thinking, explains complex things simply. Not a press release repeater.',
    primaryLang: 'en',
    affiliates: ['hostinger', 'digitalocean', 'udemy'],
    rssSources: [
      'https://techcrunch.com/feed/',
      'https://www.theverge.com/rss/index.xml',
      'https://www.wired.com/feed/rss',
      'https://feeds.arstechnica.com/arstechnica/index',
    ],
    newsApiKeywords: [
      'artificial intelligence',
      'AI',
      'machine learning',
      'startup',
      'tech',
      'OpenAI',
    ],
    author: {
      name: 'Rafael Santos',
      title: 'Software Engineer & AI Researcher',
      bio: 'Works at a deep tech startup. Has been following the AI space since GPT-2. Occasional open source contributor.',
    },
  },
  financas: {
    slug: 'financas',
    name: 'Finanzas360',
    domain: 'finanzas360.com.br',
    accent: '#1E6B4F',
    onAccent: '#FFFFFF',
    niche: 'Finanças Pessoais',
    voice: 'Trustworthy, practical, demystifying. Honest about risk, no silver bullets.',
    primaryLang: 'pt',
    affiliates: ['xp-investimentos', 'rico', 'nuinvest', 'btg-digital'],
    rssSources: [
      'https://www.infomoney.com.br/feed/',
      'https://www.seudinheiro.com/feed/',
      'https://exame.com/invest/feed/',
    ],
    newsApiKeywords: ['Selic', 'FGTS', 'B3', 'Tesouro Direto', 'investimentos', 'inflação', 'IPCA'],
    author: {
      name: 'André Lima',
      title: 'Planejador Financeiro (CFP®)',
      bio: 'Certificado pela Planejar. Ajudou mais de 300 famílias a reorganizar finanças. Acredita que educação financeira deveria ser ensinada na escola.',
    },
  },
  games: {
    slug: 'games',
    name: 'GameVerse',
    domain: 'gameverse.com.br',
    accent: '#E040FB',
    onAccent: '#000000',
    niche: 'Games & Culture',
    voice:
      'Enthusiastic, opinionated, in-community tone. Has taste. Not afraid to call out lazy sequels.',
    primaryLang: 'pt',
    affiliates: ['nuuvem', 'amazon-games'],
    rssSources: [
      'https://feeds.ign.com/ign/all',
      'https://kotaku.com/rss',
      'https://www.rockpapershotgun.com/feed',
      'https://blog.playstation.com/feed/',
    ],
    newsApiKeywords: [
      'video games',
      'gaming',
      'PlayStation',
      'Xbox',
      'Nintendo',
      'Steam',
      'esports',
    ],
    author: {
      name: 'Pedro Alves',
      title: 'Editor de Games',
      bio: 'Joga desde o Mega Drive. Platinou mais de 200 jogos. Acredita que games são a forma de arte mais importante do século XXI.',
    },
  },
  esportes: {
    slug: 'esportes',
    name: 'Golasso',
    domain: 'golasso.com.br',
    accent: '#E63946',
    onAccent: '#FFFFFF',
    niche: 'Futebol & Esportes',
    voice: 'Passionate, fast, real-time. Reads like a smart sports radio presenter.',
    primaryLang: 'pt',
    affiliates: ['netshoes', 'decathlon'],
    rssSources: [
      'https://ge.globo.com/rss/',
      'https://www.lance.com.br/feed/',
      'https://www.skysports.com/rss/12040',
    ],
    newsApiKeywords: ['futebol', 'brasileirão', 'Champions League', 'Copa do Mundo', 'Fórmula 1'],
    author: {
      name: 'Carlos Mendes',
      title: 'Repórter Esportivo',
      bio: 'Cobriu dois mundiais. Viajou com a Seleção por 10 anos como repórter free. Sabe o nome de todo jogador do Brasileirão Série B.',
    },
  },
  streaming: {
    slug: 'streaming',
    name: 'StreamHit',
    domain: 'streamhit.com.br',
    accent: '#FF3B30',
    onAccent: '#FFFFFF',
    niche: 'Filmes & Séries',
    voice:
      'Entertaining, culturally literate, has an opinion. Writes as a critic, not a PR pipeline.',
    primaryLang: 'pt',
    affiliates: ['amazon-prime', 'apple-tv'],
    rssSources: [
      'https://deadline.com/feed/',
      'https://variety.com/feed/',
      'https://www.thewrap.com/feed/',
    ],
    newsApiKeywords: ['Netflix', 'streaming', 'series', 'film', 'Disney Plus', 'HBO', 'movie'],
    author: {
      name: 'Ana Beatriz Ramos',
      title: 'Crítica de Entretenimento',
      bio: 'Assistiu mais de 3.000 filmes e perdeu a conta das séries. Acredita que o melhor da TV nunca esteve tão perto do cinema.',
    },
  },
  mobilidade: {
    slug: 'mobilidade',
    name: 'VoltaElétrica',
    domain: 'voltaeletrica.com.br',
    accent: '#00B4D8',
    onAccent: '#000000',
    niche: 'Carros & EVs',
    voice:
      'Technical but accessible, pragmatic. Covers EVs for the buyer, not just the enthusiast.',
    primaryLang: 'pt',
    affiliates: ['icarros', 'porto-seguro-auto', 'webmotors'],
    rssSources: [
      'https://electrek.co/feed/',
      'https://insideevs.com/feed/',
      'https://autoesporte.globo.com/rss/',
    ],
    newsApiKeywords: ['electric vehicle', 'EV', 'Tesla', 'BYD', 'mobility', 'charging', 'e-bike'],
    author: {
      name: 'Felipe Torres',
      title: 'Engenheiro e Especialista em Mobilidade Elétrica',
      bio: 'Engenheiro mecânico que virou evangelista de EVs depois de comparar o custo total de propriedade.',
    },
  },
};

export function getTenantConfig(slug: TenantSlug): TenantConfig {
  return configs[slug];
}

export { configs as tenantConfigs };
