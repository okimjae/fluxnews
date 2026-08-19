import type { TenantSlug } from '@fluxnews/config';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import { MetaRow } from '@/components/MetaRow';
import { NewsletterWidget } from '@/components/NewsletterWidget';
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

function JsonLdScript({ data }: { data: Record<string, unknown> }) {
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
  );
}

function ArticleBody({ html }: { html: string }) {
  return <div className="prose" dangerouslySetInnerHTML={{ __html: html }} />;
}

// Static params for demo — replaced by DB query in Phase 1
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
        <article className="max-w-[740px]">
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
            <span className="text-text-2">{post.title}</span>
          </nav>

          {/* Category badge */}
          <span className="badge mb-4">{post.category}</span>

          {/* Title */}
          <h1 className="font-display text-[clamp(1.875rem,5vw,2.75rem)] leading-[1.15] tracking-[-0.02em] text-text mb-4 text-balance">
            {post.title}
          </h1>

          {/* Deck / excerpt */}
          <p className="font-display italic text-[1.1875rem] leading-[1.6] text-text-2 mb-6">
            {post.excerpt}
          </p>

          {/* Meta bar */}
          <div className="border-t border-b border-border py-[0.875rem] mb-10">
            <MetaRow
              author={post.author}
              publishedAt={post.publishedAt}
              readTimeMinutes={post.readTimeMinutes}
            />
          </div>

          {/* Article body */}
          <ArticleBody html={post.content} />

          {/* Author card */}
          <div className="mt-12 pt-6 border-t border-border flex gap-4 items-start">
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

          {/* Newsletter CTA */}
          <div className="mt-10">
            <NewsletterWidget tenantName={config.name} />
          </div>
        </article>
      </div>
    </>
  );
}
