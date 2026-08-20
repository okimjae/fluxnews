import type { TenantSlug } from '@fluxnews/config';
import { headers } from 'next/headers';
import { ArticleFeed } from '@/components/ArticleFeed';
import { getTenantConfig } from '@/tenants';

export default async function HomePage() {
  const hdrs = await headers();
  const tenant = (hdrs.get('x-tenant') ?? 'cripto') as TenantSlug;
  const config = getTenantConfig(tenant);

  // Phase 0: static placeholder articles until agent pipeline is live (Phase 1)
  const placeholderPosts = getPlaceholderPosts(tenant);

  return (
    <div className="max-page px-page py-12">
      <ArticleFeed posts={placeholderPosts} tenant={tenant} config={config} />
    </div>
  );
}

function getPlaceholderPosts(tenant: TenantSlug) {
  const map: Record<TenantSlug, ReturnType<typeof post>[]> = {
    cripto: [
      post(
        'Bitcoin ETF Inflows Hit $3.2B in a Single Week as Institutional Demand Surges',
        'CoinShares data reveals a historic influx into spot Bitcoin ETFs — driven entirely by institutional reallocation, not retail. The implication for price discovery is significant.',
        'Mercado',
        'Lucas Ferreira'
      ),
      post(
        'Ethereum Layer-2 Networks Now Process 70% of All On-Chain Transactions',
        'Arbitrum, Base, and Optimism collectively surpassed mainnet volume for the first time since the Merge.',
        'DeFi',
        'Lucas Ferreira'
      ),
      post(
        "Brazil's CVM Approves First Domestic Crypto Fund for Retail Investors",
        'The new regulatory framework opens direct BTC and ETH exposure to 45M retail brokerage accounts.',
        'Regulação',
        'Lucas Ferreira'
      ),
      post(
        'DeFi TVL Rebounds to $180B After Three Months of Market Stabilization',
        'Capital is returning to decentralized lending — but the composition has shifted dramatically since 2024.',
        'Análise',
        'Lucas Ferreira'
      ),
      post(
        'On-Chain Data Reveals Whale Accumulation Pattern Not Seen Since 2020 Bull Run',
        'Large wallets have been quietly absorbing supply for 8 weeks. Historical patterns suggest what comes next.',
        'On-Chain',
        'Lucas Ferreira'
      ),
      post(
        'Stablecoin Supply Hits Record $230B — A Sign of Dry Powder or Permanent Shift?',
        'Analysts are divided: is this capital waiting to enter risk assets, or a structural move away from crypto?',
        'Análise',
        'Lucas Ferreira'
      ),
      post(
        'Bitcoin Halving Impact 12 Months Later: A Complete Data Analysis',
        'Supply shock, miner behavior, and institutional flows — the full picture of what actually happened after the halving.',
        'Mercado',
        'Lucas Ferreira'
      ),
    ],
    saude: [
      post(
        'Caminhada de 30 Minutos ao Dia Reduz Risco Cardiovascular em 21%',
        'Pesquisa publicada na The Lancet acompanhou 48 mil adultos por 10 anos. O efeito é mais forte quando feito em espaços verdes.',
        'Pesquisa',
        'Dra. Marina Costa'
      ),
      post(
        'Dieta Anti-Inflamatória: O Que a Ciência Diz Sobre Alimentos e Inflamação Crônica',
        'Revisão sistemática de 34 estudos aponta padrões alimentares que reduzem marcadores inflamatórios.',
        'Nutrição',
        'Dra. Marina Costa'
      ),
      post(
        'Burnout Atinge 42% dos Profissionais Brasileiros em 2026, Alerta CFM',
        'O Conselho Federal de Medicina classifica o esgotamento profissional como epidemia silenciosa.',
        'Mental',
        'Dra. Marina Costa'
      ),
      post(
        'A Janela de Sono Perfeita: Por Que Dormir às 22h Faz Diferença Real',
        'A cronobiologia explica como o ritmo circadiano modula a qualidade do sono além do número de horas.',
        'Sono',
        'Dra. Marina Costa'
      ),
      post(
        'Suplementação de Vitamina D: Quando Vale a Pena e Quem Realmente Precisa',
        'Revisão de 60 ensaios clínicos mostra que a suplementação beneficia apenas grupos específicos.',
        'Suplementos',
        'Dra. Marina Costa'
      ),
      post(
        'Exercício Anaeróbico Versus Aeróbico: O Debate Que a Ciência Finalmente Resolveu',
        'Dados de 20 anos de pesquisa mostram que a combinação importa mais do que a preferência.',
        'Fitness',
        'Dra. Marina Costa'
      ),
      post(
        'Jejum Intermitente 16:8 vs 5:2: O Que as Novas Pesquisas Dizem Sobre Eficácia',
        'Meta-análise de 28 estudos compara protocolos de jejum em populações com diferentes perfis metabólicos.',
        'Nutrição',
        'Dra. Marina Costa'
      ),
    ],
    tech: [
      post(
        "New Reasoning Model Outperforms PhD-Level Benchmarks — But Here's What It Still Can't Do",
        'The latest release scores in the top 1% on graduate-level STEM evaluations. The gaps in common-sense reasoning remain instructive.',
        'AI',
        'Rafael Santos'
      ),
      post(
        "Brazil's AI Startup Ecosystem Raised $890M in H1 2026, Up 340% Year-on-Year",
        'São Paulo now ranks 8th globally for AI investment per capita, ahead of Paris and Tel Aviv.',
        'Startups',
        'Rafael Santos'
      ),
      post(
        'The 12 AI Tools That Actually Saved Developers Time in 2026',
        'After surveying 2,000 engineers, we identified which tools are genuinely used daily — and which are hype.',
        'Tools',
        'Rafael Santos'
      ),
      post(
        "Llama 5 Released: Meta's Largest Open Model Yet Matches Frontier Performance",
        'With 800B parameters and Apache 2.0 license, the release reshapes the open-source AI landscape.',
        'Open Source',
        'Rafael Santos'
      ),
      post(
        'Claude 5 vs GPT-5 vs Gemini 2.5 Ultra: The Benchmark That Actually Matters in 2026',
        'We ran all three on real engineering tasks for 4 weeks. The results differ from official leaderboards.',
        'Comparativo',
        'Rafael Santos'
      ),
      post(
        'Open Source AI Is Winning the Enterprise: Why Fortune 500s Are Ditching Proprietary APIs',
        'Cost, data sovereignty, and customization are driving a quiet but irreversible shift.',
        'Enterprise',
        'Rafael Santos'
      ),
      post(
        'The State of Developer Tools in 2026: What Actually Replaced GitHub Copilot',
        'Survey of 4,500 developers reveals which tools won after the wave of AI coding assistants matured.',
        'Tools',
        'Rafael Santos'
      ),
    ],
    financas: [
      post(
        'Copom Mantém Selic em 12,25%: O Que Muda no Seu Tesouro Direto e no Crédito',
        'A decisão era esperada, mas os detalhes da ata revelam mais sobre o horizonte de cortes do que o mercado antecipava.',
        'Selic',
        'André Lima'
      ),
      post(
        'Renda Fixa Ainda Vale a Pena em 2026? Simulamos 6 Cenários',
        'Com Selic acima de 12%, os papéis pós-fixados seguem competitivos, mas o pré-fixado guarda surpresa.',
        'Investimentos',
        'André Lima'
      ),
      post(
        'FGTS Digital: Como Consultar e Movimentar o Saldo Pelo Novo App em 4 Passos',
        'O sistema substituiu o FGTS tradicional em janeiro. Veja o que mudou e como aproveitar as novidades.',
        'FGTS',
        'André Lima'
      ),
      post(
        'Imposto de Renda 2026: Prazo, Novas Regras e o Que Mudou Para Investidores',
        'A Receita Federal ampliou as obrigações de declaração de criptoativos e fundos offshore.',
        'IR 2026',
        'André Lima'
      ),
      post(
        'Fundos Imobiliários Pagaram 14,2% ao Ano em 2025 — Vale Ainda em 2026?',
        'O IFIX segue atraente, mas os riscos setoriais pedem atenção antes de aportar.',
        'FIIs',
        'André Lima'
      ),
      post(
        'CDB, LCI ou Tesouro? Como Escolher Com a Selic a 12,25%',
        'Comparativo prático considerando imposto de renda, liquidez e horizonte de investimento.',
        'Renda Fixa',
        'André Lima'
      ),
      post(
        'Reserva de Emergência em 2026: Quanto Guardar e Onde Deixar Rendendo',
        'A fórmula clássica dos 6 meses já não se aplica a todos. Veja como calcular o seu número real.',
        'Planejamento',
        'André Lima'
      ),
    ],
    games: [
      post(
        'Elden Ring: Nightreign Revisita a Fórmula e Divide os Fãs da Série',
        'O DLC mais esperado de 2026 é tecnicamente impecável. Se o design cumpre a promessa é outra conversa.',
        'Review',
        'Pedro Alves'
      ),
      post(
        'Os 10 Jogos Mais Esperados do Segundo Semestre de 2026',
        'De sequências confirmadas a surpresas de estúdios independentes: o calendário está cheio de grandes apostas.',
        'Lançamentos',
        'Pedro Alves'
      ),
      post(
        'CBLOL 2026: Loud Vence o Split 1 Após Final Épica Contra a FURIA',
        'A final mais assistida da história do campeonato terminou no game 5, com virada no último minuto.',
        'Esports',
        'Pedro Alves'
      ),
      post(
        'Hades III Chega ao Early Access: Vale Pagar Para Jogar Incompleto?',
        'Supergiant mantém a tradição de entregas polidas mesmo em acesso antecipado.',
        'Indie',
        'Pedro Alves'
      ),
      post(
        'Os Jogos Indie que Surpreenderam a Gamescom 2026',
        'Estúdios menores roubaram o show de AAAs bilionários. Aqui estão os 7 que você precisa acompanhar.',
        'Indie',
        'Pedro Alves'
      ),
      post(
        'PlayStation 6 Confirmado: Tudo que Sabemos Sobre Preço, Data e Retrocompatibilidade',
        'A Sony finalmente confirmou o que era rumor. A janela de lançamento muda tudo para o mercado.',
        'Hardware',
        'Pedro Alves'
      ),
      post(
        'Os 5 RPGs Que Você Precisa Jogar Antes do Fim de 2026',
        'De mundos abertos a histórias lineares, selecionamos os títulos que definem o gênero este ano.',
        'Review',
        'Pedro Alves'
      ),
    ],
    esportes: [
      post(
        'Flamengo e Palmeiras Abrem 5 Pontos na Liderança Após Rodada 22 do Brasileirão',
        'As duas equipes vencem fora de casa e se isolam no G-4. A briga pelo título promete chegar à última rodada.',
        'Brasileirão',
        'Carlos Mendes'
      ),
      post(
        'Real Madrid x Manchester City: Análise Tática da Semifinal que Parou o Mundo',
        'Ancelotti ajustou o esquema no intervalo. A decisão de tirar Bellingham foi ousada e genial.',
        'Champions',
        'Carlos Mendes'
      ),
      post(
        'GP do Brasil 2026: Verstappen Vence em Interlagos com Estratégia de Pit Stop Ousada',
        'A corrida mais dramática do campeonato definiu o título com 3 provas de antecedência.',
        'Fórmula 1',
        'Carlos Mendes'
      ),
      post(
        'Dorival Convoca Seleção Para as Eliminatórias: Veja os 26 Nomes e as Novidades',
        'Três estreantes e o retorno de Neymar surpreendem a lista divulgada nesta tarde.',
        'Seleção',
        'Carlos Mendes'
      ),
      post(
        'LeBron James Anuncia Aposentadoria aos 41 — Um Legado Que Vai Além das Estatísticas',
        'Quatro títulos, dois times diferentes, 25 anos de carreira. O que fica além dos números.',
        'NBA',
        'Carlos Mendes'
      ),
      post(
        'Olimpíadas 2028: Los Angeles Projeta 10 Ouros Para o Brasil — Metas Realistas ou Devaneio?',
        'O COB apresentou seu plano de metas. Analisamos modalidade a modalidade.',
        'Olimpíadas',
        'Carlos Mendes'
      ),
      post(
        'Neymar Volta à Seleção: Análise Física, Tática e o Que Esperar nas Eliminatórias',
        'Três anos depois, o camisa 10 retorna em momento decisivo. Os dados dizem se ainda faz sentido.',
        'Seleção',
        'Carlos Mendes'
      ),
    ],
    streaming: [
      post(
        'Stranger Things Temporada Final: Uma Despedida à Altura de Uma Série Que Formou Uma Geração?',
        'Os Duffers entregaram o capítulo mais caro da história da Netflix. Se entregaram também o melhor, você decide.',
        'Review',
        'Ana Beatriz Ramos'
      ),
      post(
        'O Que Estreia na Netflix em Setembro 2026: A Lista com Nossa Curadoria',
        'São 47 títulos novos. Separamos os 8 que realmente valem seu tempo — e os 3 que você pode pular.',
        'Lançamentos',
        'Ana Beatriz Ramos'
      ),
      post(
        'House of the Dragon S3: A Série Finalmente Entregou o Que a Primeira Temporada Prometia',
        'A guerra dos dragões atinge o ponto de inflexão que todos esperávamos. E é glorioso.',
        'HBO',
        'Ana Beatriz Ramos'
      ),
      post(
        'Dune: Messiah Ganha Trailer e Data de Estreia — O Que Esperar da Conclusão da Trilogia',
        'Denis Villeneuve confirma que o terceiro filme será o mais íntimo e o mais ousado dos três.',
        'Cinema',
        'Ana Beatriz Ramos'
      ),
      post(
        'Succession vs. The Bear: A Batalha Pelos Melhores Roteiros da Última Década',
        'Dois pesos pesados do drama televisivo contemporâneo — mas apenas um define o zeitgeist.',
        'Análise',
        'Ana Beatriz Ramos'
      ),
      post(
        'Os 10 Melhores Filmes de 2026 Até Agora, Segundo Nossa Curadoria',
        'De Cannes a Sundance, passando por blockbusters inesperados. A lista que vai guiar seu streaming.',
        'Cinema',
        'Ana Beatriz Ramos'
      ),
      post(
        'O Fim das Senhas: Como o Passkey Chegou ao Streaming e Por Que Você Deve Ativar',
        'Netflix, Disney+, e Prime Video migraram para autenticação sem senha. Entenda o impacto na segurança.',
        'Tecnologia',
        'Ana Beatriz Ramos'
      ),
    ],
    mobilidade: [
      post(
        'BYD Seagull no Brasil: Testamos 800 km com Apenas R$ 80 em Carregamentos',
        'Fizemos a rota São Paulo–Rio–São Paulo com o elétrico mais acessível do mercado. Os números surpreendem.',
        'Teste Real',
        'Felipe Torres'
      ),
      post(
        'Vendas de Elétricos no Brasil Crescem 280% em 2026: BYD, GWM e Volkswagen Lideram',
        'O Brasil se tornou o 4º maior mercado de EVs da América, superando o México em março.',
        'Mercado',
        'Felipe Torres'
      ),
      post(
        'Mapa dos 2.400 Pontos de Recarga no Brasil: As Regiões Ainda Descobertas em 2026',
        'A cobertura avançou, mas o interior de SP e MG ainda tem lacunas críticas para viagens longas.',
        'Infraestrutura',
        'Felipe Torres'
      ),
      post(
        'BYD Yuan Plus vs. Volkswagen ID.4: Qual Comprar com R$ 180 Mil em 2026?',
        'Testamos os dois por 30 dias. O resultado é mais apertado do que imaginávamos.',
        'Comparativo',
        'Felipe Torres'
      ),
      post(
        'Recarga em Casa: Guia Completo Para Instalar um Wallbox Sem Contratar Enganador',
        'Potência, instalação elétrica, certificação e marcas confiáveis — tudo que você precisa saber.',
        'Guia',
        'Felipe Torres'
      ),
      post(
        'Tesla Model 3 Highland Chega ao Brasil: Preço, Autonomia Real e Comparativo Local',
        'Testamos 800 km com o novo modelo no calor de Goiânia. A autonomia real surpreende.',
        'Teste Real',
        'Felipe Torres'
      ),
      post(
        'Carros Elétricos Usados: Como Avaliar a Saúde da Bateria Antes de Comprar',
        'O mercado de EVs seminovos cresce 180% ao ano. O risco da bateria degradada é real — veja como testar.',
        'Guia',
        'Felipe Torres'
      ),
    ],
  };
  return map[tenant];
}

function post(title: string, excerpt: string, category: string, author: string) {
  const slug = title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
  return { title, excerpt, category, author, publishedAt: new Date('2026-08-18'), slug };
}
