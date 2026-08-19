import type { TenantConfig, TenantSlug } from '@fluxnews/config';
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
}

export function ArticleFeed({ posts, config }: ArticleFeedProps) {
  const [hero, ...rest] = posts;
  if (!hero) return null;

  const secondaryPosts = rest.slice(0, 3);
  const gridPosts = rest.slice(3);

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
        <ArticleCard post={hero} variant="hero" index={1} />
      </div>

      {/* Secondary stack below hero */}
      {secondaryPosts.length > 0 && (
        <div className="mt-6 stagger-1">
          {secondaryPosts.map((post) => (
            <ArticleCard key={post.slug ?? post.title} post={post} variant="secondary" />
          ))}
        </div>
      )}

      {/* Ad leaderboard between sections */}
      <div className="flex justify-center my-10">
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
              {gridPosts.map((post) => (
                <ArticleCard key={post.slug ?? post.title} post={post} variant="card" />
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <aside className="space-y-8 lg:sticky lg:top-[var(--header-h)] pt-0">
            <SidebarMostRead posts={posts} />
            <AdSlot size="rectangle" />
          </aside>
        </div>
      )}

      {/* Newsletter inline CTA */}
      <div className="mt-14">
        <NewsletterWidget tenantName={config.name} />
      </div>

      {/* Footer attribution */}
      <div className="mt-10 pt-6 border-t border-border flex items-center justify-between flex-wrap gap-3">
        <p className="text-[0.75rem] text-text-m">
          Curado por IA · revisado por{' '}
          <span className="text-text-2 font-medium">{config.author.name}</span>
        </p>
        <a
          href="/newsletter"
          className="font-mono text-[0.6875rem] uppercase tracking-[0.1em] text-accent no-underline hover:opacity-70 transition-opacity"
        >
          Receber digest semanal →
        </a>
      </div>
    </div>
  );
}
