import type { TenantConfig, TenantSlug } from '@fluxnews/config';
import { Fragment } from 'react';
import { AdSlot } from './AdSlot';
import { ArticleCard } from './ArticleCard';
import { NewsletterWidget } from './NewsletterWidget';
import { SidebarMostRead } from './SidebarMostRead';

interface Post {
  title: string;
  excerpt: string;
  category: string;
  author: string;
  publishedAt: Date;
  slug?: string;
}

interface ArticleFeedProps {
  posts: Post[];
  tenant: TenantSlug;
  config: TenantConfig;
  page?: number;
  totalPages?: number;
}

export function ArticleFeed({ posts, tenant, config, page = 1, totalPages = 1 }: ArticleFeedProps) {
  const [hero, ...rest] = posts;
  if (!hero) return null;

  const secondaryPosts = rest.slice(0, 2);
  const gridPosts = rest.slice(2);

  const tenantQuery = `?tenant=${tenant}`;
  const prevPage = page > 1 ? `/${page > 2 ? `page/${page - 1}` : ''}${tenantQuery}` : null;
  const nextPage = page < totalPages ? `/page/${page + 1}${tenantQuery}` : null;

  const month = new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });

  return (
    <div>
      {/* Section header */}
      <div className="section-label">
        <div className="flex items-center gap-3">
          <div className="w-[2px] h-[1.1rem] bg-accent rounded-full" />
          <span className="font-mono text-[0.75rem] font-medium uppercase tracking-[0.1em] text-text-2">
            {config.niche}
          </span>
        </div>
        <span className="font-mono text-[0.6875rem] text-text-m capitalize">{month}</span>
      </div>

      {/* Hero */}
      <div className="animate-fade-up">
        <ArticleCard post={hero} variant="hero" index={1} tenant={tenant} />
      </div>

      {/* Secondary stack below hero */}
      {secondaryPosts.length > 0 && (
        <div className="mt-6 stagger-1">
          {secondaryPosts.map((post) => (
            <ArticleCard key={post.slug ?? post.title} post={post} variant="secondary" tenant={tenant} />
          ))}
        </div>
      )}

      {/* Ad leaderboard between sections */}
      <div className="flex justify-center my-6 sm:my-10">
        <AdSlot size="leaderboard" />
      </div>

      {/* Section 2: Artigos + Sidebar */}
      {gridPosts.length > 0 && (
        <div className="grid lg:grid-cols-[1fr_300px] gap-10 items-start">
          {/* Main grid */}
          <div>
            <div className="section-label">
              <div className="flex items-center gap-3">
                <div className="w-[2px] h-[1.1rem] bg-accent rounded-full" />
                <h2 className="font-mono text-[0.75rem] font-medium uppercase tracking-[0.1em] text-text-2">
                  Artigos
                </h2>
              </div>
              <a
                href="/categoria/todos"
                className="font-mono text-[0.6875rem] uppercase tracking-[0.1em] text-text-m no-underline hover:text-text-2 transition-colors"
              >
                Ver todos →
              </a>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {gridPosts.map((post, i) => (
                <Fragment key={post.slug ?? post.title}>
                  {i === 2 && gridPosts.length > 3 && (
                    <div className="col-span-full flex justify-center my-4 sm:my-6">
                      <AdSlot size="leaderboard" />
                    </div>
                  )}
                  <ArticleCard post={post} variant="card" tenant={tenant} />
                </Fragment>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <aside className="space-y-8 lg:sticky lg:top-[var(--header-h)] pt-0">
            <SidebarMostRead posts={posts} tenant={tenant} />
            <div className="hidden lg:block">
              <AdSlot size="rectangle" />
            </div>
          </aside>
        </div>
      )}

      {/* Newsletter inline CTA */}
      <div className="mt-10">
        <NewsletterWidget tenantName={config.name} />
      </div>

      {/* Pagination + footer */}
      <div className="mt-8 pt-6 border-t border-border flex items-center justify-between flex-wrap gap-3">
        <p className="text-[0.75rem] text-text-m">
          Curadoria editorial ·{' '}
          <span className="text-text-2 font-medium">{config.author.name}</span>
        </p>

        {totalPages > 1 && (
          <nav aria-label="Paginação" className="flex items-center gap-2">
            {prevPage ? (
              <a
                href={prevPage}
                className="font-mono text-[0.6875rem] uppercase tracking-[0.08em] text-text-m no-underline hover:text-text-2 transition-colors"
              >
                ← Anterior
              </a>
            ) : (
              <span className="font-mono text-[0.6875rem] uppercase tracking-[0.08em] text-text-m opacity-30">
                ← Anterior
              </span>
            )}
            <span className="font-mono text-[0.6875rem] text-text-m px-2">
              {page} / {totalPages}
            </span>
            {nextPage ? (
              <a
                href={nextPage}
                className="font-mono text-[0.6875rem] uppercase tracking-[0.08em] text-text-m no-underline hover:text-text-2 transition-colors"
              >
                Próxima →
              </a>
            ) : (
              <span className="font-mono text-[0.6875rem] uppercase tracking-[0.08em] text-text-m opacity-30">
                Próxima →
              </span>
            )}
          </nav>
        )}

        <a
          href={`/newsletter${tenantQuery}`}
          className="font-mono text-[0.6875rem] uppercase tracking-[0.1em] text-accent no-underline hover:opacity-70 transition-opacity"
        >
          Receber digest semanal →
        </a>
      </div>
    </div>
  );
}
