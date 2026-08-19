import type { TenantSlug } from '@fluxnews/config';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import { AdSlot } from '@/components/AdSlot';
import { ArticleCard } from '@/components/ArticleCard';
import { MetaRow } from '@/components/MetaRow';
import { NewsletterWidget } from '@/components/NewsletterWidget';
import { ShareButtons } from '@/components/ShareButtons';
import { getTenantConfig } from '@/tenants';

export const revalidate = 3600;

interface Props {
  params: Promise<{ slug: string }>;
}

function slugToTitle(slug: string) {
  return slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

function getMockPost(slug: string, tenant: TenantSlug) {
  const config = getTenantConfig(tenant);
  const title = slugToTitle(slug);
  return {
    title,
    excerpt: `${title} — análise aprofundada sobre ${config.niche} por ${config.author.name}.`,
    content: `<p>Este é um artigo completo sobre <strong>${title}</strong> na categoria ${config.niche}.</p>
<p>O FluxNews utiliza agentes de inteligência artificial para curadoria e geração de conteúdo editorial de alta qualidade. Cada publicação passa por verificação factual antes de ir ao ar.</p>
<h2>O que você vai aprender</h2>
<p>Neste artigo, exploramos os principais aspectos do tema com base nas últimas pesquisas e dados disponíveis. Nossa abordagem é sempre embasada em evidências, sem especulação desnecessária.</p>
<h2>Contexto e importância</h2>
<p>Compreender ${title.toLowerCase()} é fundamental para quem acompanha ${config.niche}. O cenário mudou significativamente nos últimos meses, e esta análise ajuda a contextualizar as transformações em curso.</p>
<h2>Conclusão</h2>
<p>O conteúdo real deste artigo será gerado automaticamente pelo pipeline de IA assim que o banco de dados estiver configurado. Até lá, este placeholder serve como validação visual do layout editorial.</p>`,
    category: 'Editorial',
    author: config.author.name,
    authorTitle: config.author.title,
    publishedAt: new Date('2026-08-18'),
    readTimeMinutes: 6,
    config,
  };
}

function getMockRelated(slug: string, tenant: TenantSlug) {
  const config = getTenantConfig(tenant);
  return [
    {
      title: 'Tendências que vão moldar o mercado em 2026',
      excerpt: `Uma análise das principais forças em ${config.niche} para o próximo ano.`,
      category: 'Análise',
      author: config.author.name,
      publishedAt: new Date('2026-08-10'),
      slug: `tendencias-${slug}`,
    },
    {
      title: 'Guia completo para iniciantes',
      excerpt: `Tudo que você precisa saber para começar em ${config.niche}.`,
      category: 'Guia',
      author: config.author.name,
      publishedAt: new Date('2026-07-25'),
      slug: `guia-completo-para-iniciantes`,
    },
    {
      title: 'Análise semanal: números que importam',
      excerpt: `Os dados mais relevantes de ${config.niche} desta semana.`,
      category: 'Editorial',
      author: config.author.name,
      publishedAt: new Date('2026-07-18'),
      slug: `analise-semanal`,
    },
  ];
}

function JsonLdScript({ data }: { data: Record<string, unknown> }) {
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
  );
}

function ArticleBody({ html }: { html: string }) {
  return <div className="prose" dangerouslySetInnerHTML={{ __html: html }} />;
}

export async function generateStaticParams() {
  return [
    { slug: 'analise-semanal' },
    { slug: 'tendencias-do-mercado' },
    { slug: 'guia-completo-para-iniciantes' },
  ];
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const hdrs = await headers();
  const tenant = (hdrs.get('x-tenant') ?? 'cripto') as TenantSlug;
  const post = getMockPost(slug, tenant);
  const related = getMockRelated(slug, tenant);

  if (!slug) notFound();

  const config = post.config;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    author: { '@type': 'Person', name: post.author },
    publisher: { '@type': 'Organization', name: config.name },
    datePublished: post.publishedAt.toISOString(),
    inLanguage: config.primaryLang,
  };

  return (
    <>
      <JsonLdScript data={jsonLd} />

      <div className="max-page px-page py-10">
        {/* Two-column layout: article + sidebar */}
        <div className="grid lg:grid-cols-[1fr_300px] gap-12 items-start">
          {/* Article */}
          <article>
            {/* Breadcrumb */}
            <nav
              aria-label="Breadcrumb"
              className="flex gap-2 text-[0.8125rem] text-text-m mb-7 items-center flex-wrap"
            >
              <a href="/" className="text-text-m no-underline hover:text-text-2 transition-colors">
                Início
              </a>
              <span aria-hidden>›</span>
              <a
                href={`/categoria/${post.category.toLowerCase()}`}
                className="text-text-m no-underline hover:text-text-2 transition-colors"
              >
                {post.category}
              </a>
              <span aria-hidden>›</span>
              <span className="text-text-2 line-clamp-1">{post.title}</span>
            </nav>

            <span className="badge mb-4 inline-flex">{post.category}</span>

            <h1 className="font-display text-[clamp(1.875rem,5vw,2.75rem)] leading-[1.15] tracking-[-0.02em] text-text mb-4 text-balance">
              {post.title}
            </h1>

            <p className="font-display italic text-[1.1875rem] leading-[1.6] text-text-2 mb-6">
              {post.excerpt}
            </p>

            {/* Meta bar + share buttons */}
            <div className="border-t border-b border-border py-[0.875rem] mb-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <MetaRow
                author={post.author}
                publishedAt={post.publishedAt}
                readTimeMinutes={post.readTimeMinutes}
              />
              <ShareButtons title={post.title} />
            </div>

            <ArticleBody html={post.content} />

            {/* Share row after article */}
            <div className="mt-10 pt-6 border-t border-border">
              <ShareButtons title={post.title} />
            </div>

            {/* Author card */}
            <div className="mt-10 pt-6 border-t border-border flex gap-4 items-start">
              <div className="avatar-surface w-12 h-12 rounded-full flex items-center justify-center text-xl shrink-0 text-accent font-bold">
                {post.author.charAt(0)}
              </div>
              <div>
                <p className="text-[0.9375rem] font-semibold text-text mb-0.5">{post.author}</p>
                <p className="text-[0.8125rem] text-text-m">
                  {post.authorTitle} · {config.name}
                </p>
              </div>
            </div>
          </article>

          {/* Sidebar */}
          <aside className="space-y-8 lg:sticky lg:top-[var(--header-h)]">
            <NewsletterWidget tenantName={config.name} />
            <AdSlot size="rectangle" />
          </aside>
        </div>

        {/* Related articles */}
        <section className="mt-16 pt-8 border-t border-border">
          <div className="section-label">
            <div className="flex items-center gap-3">
              <div className="w-[2px] h-[1.1rem] bg-accent rounded-full" />
              <h2 className="font-mono text-[0.75rem] font-medium uppercase tracking-[0.1em] text-text-2">
                Artigos Relacionados
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {related.map((rpost) => (
              <ArticleCard key={rpost.slug} post={rpost} variant="card" />
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
