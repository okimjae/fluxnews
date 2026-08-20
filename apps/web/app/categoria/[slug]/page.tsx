import type { TenantSlug } from '@fluxnews/config';
import { headers } from 'next/headers';
import { Fragment } from 'react';
import { AdSlot } from '@/components/AdSlot';
import { ArticleCard } from '@/components/ArticleCard';
import { SidebarMostRead } from '@/components/SidebarMostRead';
import { getPostsByCategory } from '@/lib/queries';
import { getTenantConfig } from '@/tenants';

export const revalidate = 1800;

interface Props {
  params: Promise<{ slug: string }>;
}

function slugToLabel(slug: string) {
  return slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const hdrs = await headers();
  const tenant = (hdrs.get('x-tenant') ?? 'cripto') as TenantSlug;
  const config = getTenantConfig(tenant);
  const label = slugToLabel(slug);

  const dbPosts = await getPostsByCategory(tenant, slug, 24);
  const articles = dbPosts.map((p) => ({
    title: p.title,
    excerpt: p.excerpt || p.content.slice(0, 160).replace(/<[^>]*>/g, ''),
    category: p.category || 'Editorial',
    author: p.author || config.author.name,
    publishedAt: p.publishedAt ?? p.createdAt,
    slug: p.slug,
  }));

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
                <ArticleCard post={article} variant="card" tenant={tenant} />
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
                  <ArticleCard key={article.slug} post={article} variant="card" tenant={tenant} />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Sidebar */}
        <aside className="space-y-8 lg:sticky lg:top-[var(--header-h)]">
          <SidebarMostRead posts={articles} tenant={tenant} />
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
