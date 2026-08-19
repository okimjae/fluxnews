import type { TenantConfig, TenantSlug } from '@fluxnews/config';
import { ArticleCard } from './ArticleCard';

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
  const [hero, second, ...rest] = posts;
  if (!hero) return null;

  return (
    <div>
      {/* Section label */}
      <div className="flex items-center gap-4 mb-6">
        <div className="divider-accent flex-1 max-w-[3rem]" />
        <p className="font-mono text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-accent">
          {config.niche}
        </p>
      </div>

      {/* Hero */}
      <div className="mb-5 animate-fade-up">
        <ArticleCard post={hero} variant="hero" />
      </div>

      {/* Grid — secondary + rest */}
      {(second || rest.length > 0) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {second && <ArticleCard key={second.slug ?? second.title} post={second} variant="card" />}
          {rest.map((post) => (
            <ArticleCard key={post.slug ?? post.title} post={post} variant="card" />
          ))}
        </div>
      )}

      {/* Footer attribution */}
      <div className="mt-12 pt-6 border-t border-border flex items-center justify-between flex-wrap gap-3">
        <p className="text-[0.75rem] text-text-m">
          Curado por IA · revisado por{' '}
          <span className="text-text-2 font-medium">{config.author.name}</span>
        </p>
        <a
          href="/newsletter"
          className="font-mono text-[0.6875rem] uppercase tracking-[0.1em] text-accent no-underline hover:opacity-70 transition-opacity"
        >
          Assinar newsletter →
        </a>
      </div>
    </div>
  );
}
