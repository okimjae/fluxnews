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

  const month = new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });

  return (
    <div>
      {/* Section label — editorial header */}
      <div className="flex items-center justify-between mb-8 pb-5 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-[2px] h-[1.1rem] bg-accent rounded-full" />
          <span className="font-mono text-[0.75rem] font-medium uppercase tracking-[0.1em] text-text-2">
            {config.niche}
          </span>
        </div>
        <span className="font-mono text-[0.6875rem] text-text-m capitalize">{month}</span>
      </div>

      {/* Hero */}
      <div className="mb-8 animate-fade-up">
        <ArticleCard post={hero} variant="hero" />
      </div>

      {/* Grid — secondary + rest */}
      {(second || rest.length > 0) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-2">
          {second && <ArticleCard key={second.slug ?? second.title} post={second} variant="card" />}
          {rest.map((post) => (
            <ArticleCard key={post.slug ?? post.title} post={post} variant="card" />
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="mt-14 pt-6 border-t border-border flex items-center justify-between flex-wrap gap-3">
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
