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
  const [hero, ...rest] = posts;
  if (!hero) return null;

  return (
    <div>
      {/* Hero */}
      <div className="mb-5">
        <ArticleCard post={hero} variant="hero" />
      </div>

      {/* 3-column grid */}
      {rest.length > 0 && (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-5">
          {rest.map((post) => (
            <ArticleCard key={post.slug ?? post.title} post={post} variant="card" />
          ))}
        </div>
      )}

      {/* Section label */}
      <div className="mt-12 pt-8 border-t border-border">
        <p
          className="text-xs font-semibold uppercase tracking-[0.09em] text-accent mb-1"
          style={{ transition: 'color 250ms' }}
        >
          {config.niche}
        </p>
        <p className="text-sm text-text-m">
          Conteúdo gerado automaticamente por agentes de IA e revisado editorialmente · por{' '}
          {config.author.name}
        </p>
      </div>
    </div>
  );
}
