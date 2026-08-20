import type { TenantSlug } from '@fluxnews/config';
import { headers } from 'next/headers';
import { Fragment } from 'react';
import { AdSlot } from '@/components/AdSlot';
import { ArticleCard } from '@/components/ArticleCard';
import { SidebarMostRead } from '@/components/SidebarMostRead';
import { getTenantConfig } from '@/tenants';

export const revalidate = 3600;

interface Props {
  params: Promise<{ slug: string }>;
}

function slugToLabel(slug: string) {
  return slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

function getMockArticles(category: string, tenant: TenantSlug) {
  const config = getTenantConfig(tenant);
  const label = slugToLabel(category);

  return Array.from({ length: 9 }, (_, i) => ({
    title: `${label}: Artigo ${i + 1} — Análise e perspectivas para ${config.niche}`,
    excerpt: `Análise editorial de ${config.author.name}. Uma visão aprofundada sobre ${config.niche} e os temas que moldam o mercado.`,
    category: label,
    author: config.author.name,
    publishedAt: new Date(2026, 7, 18 - i),
    slug: `${category}-artigo-${i + 1}`,
  }));
}

export async function generateStaticParams() {
  return [
    { slug: 'mercado' },
    { slug: 'analise' },
    { slug: 'editorial' },
    { slug: 'pesquisa' },
    { slug: 'review' },
    { slug: 'tendencias' },
    { slug: 'todos' },
  ];
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const hdrs = await headers();
  const tenant = (hdrs.get('x-tenant') ?? 'cripto') as TenantSlug;
  const config = getTenantConfig(tenant);
  const label = slugToLabel(slug);
  const articles = getMockArticles(slug, tenant);

  // First 6 go into the main grid, sidebar uses all for "most read"
  const mainArticles = articles.slice(0, 6);
  const moreArticles = articles.slice(6);

  return (
    <div className="max-page px-page py-10">
      {/* Breadcrumb */}
      <nav
        aria-label="Breadcrumb"
        className="flex gap-2 text-[0.8125rem] text-text-m mb-10 items-center"
      >
        <a href="/" className="text-text-m no-underline hover:text-text-2 transition-colors">
          Início
        </a>
        <span aria-hidden>›</span>
        <span className="text-text-2">{label}</span>
      </nav>

      {/* Header */}
      <div className="mb-10 pb-8 border-b border-border flex items-end justify-between gap-6 flex-wrap">
        <div>
          <span className="badge mb-4">{config.niche}</span>
          <h1 className="font-display text-title text-text text-balance">{label}</h1>
        </div>
        <p className="font-mono text-[0.75rem] text-text-m">{articles.length} artigos</p>
      </div>

      {/* Two-column layout: grid + sidebar */}
      <div className="grid lg:grid-cols-[1fr_300px] gap-10 items-start">
        {/* Main grid with inline ad after row 1 */}
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {mainArticles.map((article, i) => (
              <Fragment key={article.slug}>
                {i === 2 && (
                  <div className="col-span-full flex justify-center my-4">
                    <AdSlot size="leaderboard" />
                  </div>
                )}
                <ArticleCard post={article} variant="card" />
              </Fragment>
            ))}
          </div>

          {/* Extra articles after second ad */}
          {moreArticles.length > 0 && (
            <>
              <div className="flex justify-center my-8">
                <AdSlot size="leaderboard" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {moreArticles.map((article) => (
                  <ArticleCard key={article.slug} post={article} variant="card" />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Sidebar */}
        <aside className="space-y-8 lg:sticky lg:top-[var(--header-h)]">
          <SidebarMostRead posts={articles} />
          <div className="hidden lg:block">
            <AdSlot size="rectangle" />
          </div>
        </aside>
      </div>

      {/* Above pagination ad */}
      <div className="flex justify-center mt-12 mb-6">
        <AdSlot size="leaderboard" />
      </div>

      {/* Pagination */}
      <div className="flex justify-center gap-2">
        <button type="button" disabled className="btn btn-secondary opacity-40 cursor-not-allowed">
          ← Anterior
        </button>
        <span className="btn btn-ghost text-text-m">Página 1</span>
        <button type="button" disabled className="btn btn-secondary opacity-40 cursor-not-allowed">
          Próxima →
        </button>
      </div>
    </div>
  );
}
