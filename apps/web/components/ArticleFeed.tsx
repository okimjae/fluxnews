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
      <div style={{ marginBottom: '1.25rem' }}>
        <ArticleCard post={hero} variant="hero" />
      </div>

      {/* 3-column grid */}
      {rest.length > 0 && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '1.25rem',
          }}
        >
          {rest.map((post) => (
            <ArticleCard key={post.slug ?? post.title} post={post} variant="card" />
          ))}
        </div>
      )}

      {/* Section label */}
      <div
        style={{
          marginTop: '3rem',
          paddingTop: '2rem',
          borderTop: '1px solid var(--color-border)',
        }}
      >
        <p
          style={{
            fontSize: '0.75rem',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.09em',
            color: 'var(--color-accent)',
            marginBottom: '0.25rem',
            transition: 'color 250ms',
          }}
        >
          {config.niche}
        </p>
        <p style={{ fontSize: '0.875rem', color: 'var(--color-text-m)' }}>
          Conteúdo gerado automaticamente por agentes de IA e revisado editorialmente · por{' '}
          {config.author.name}
        </p>
      </div>
    </div>
  );
}
