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
    <div
      style={{
        maxWidth: '1280px',
        marginInline: 'auto',
        paddingInline: 'clamp(1rem, 5vw, 2rem)',
        paddingBlock: '2rem',
      }}
    >
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
    ],
  };
  return map[tenant];
}

function post(title: string, excerpt: string, category: string, author: string) {
  return { title, excerpt, category, author, publishedAt: new Date('2026-08-18') };
}
