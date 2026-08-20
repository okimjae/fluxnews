import { MetaRow } from './MetaRow';

interface Post {
  title: string;
  excerpt: string;
  category: string;
  author: string;
  publishedAt: Date;
  slug?: string;
}

interface ArticleCardProps {
  post: Post;
  variant: 'hero' | 'card' | 'secondary';
  index?: number;
  tenant?: string;
}

export function ArticleCard({ post, variant, index, tenant }: ArticleCardProps) {
  const tenantQuery = tenant ? `?tenant=${tenant}` : '';
  const href = post.slug ? `/artigo/${post.slug}${tenantQuery}` : '#';
  if (variant === 'hero') return <HeroArticle post={post} href={href} index={index ?? 1} />;
  if (variant === 'secondary') return <SecondaryCard post={post} href={href} />;
  return <GridCard post={post} href={href} />;
}

function HeroArticle({ post, href, index }: { post: Post; href: string; index: number }) {
  const num = String(index).padStart(2, '0');
  return (
    <a href={href} className="group block no-underline">
      <div className="hero-card grid lg:grid-cols-[3fr_2fr] border border-border rounded-card overflow-hidden bg-surface">
        <div className="p-8 sm:p-10 lg:p-14 flex flex-col gap-6 justify-center min-h-[280px] lg:min-h-[360px]">
          <span className="badge self-start">{post.category}</span>

          <h1 className="font-display text-hero text-text text-balance leading-[1.08]">
            {post.title}
          </h1>

          <p className="font-display italic text-text-2 text-[1.125rem] leading-[1.7] max-w-[52ch]">
            {post.excerpt}
          </p>

          <div className="flex items-center justify-between flex-wrap gap-3">
            <MetaRow author={post.author} publishedAt={post.publishedAt} />
            <span className="font-mono text-[0.75rem] text-accent tracking-[0.04em] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              Ler artigo →
            </span>
          </div>
        </div>

        <div className="img-dot-grid hidden lg:flex items-end justify-end p-8 min-h-[360px]">
          <span className="article-number" aria-hidden="true">
            {num}
          </span>
        </div>
      </div>
    </a>
  );
}

function SecondaryCard({ post, href }: { post: Post; href: string }) {
  return (
    <a href={href} className="secondary-card no-underline group">
      {/* Dot-grid thumbnail */}
      <div className="img-dot-grid shrink-0 w-[72px] h-[72px] rounded-sm" aria-hidden="true" />

      <div className="flex-1 min-w-0">
        <span className="badge mb-2 inline-flex">{post.category}</span>
        <h3 className="secondary-card-title text-[0.9375rem] font-semibold text-text leading-[1.35] line-clamp-2 mb-2">
          {post.title}
        </h3>
        <MetaRow author={post.author} publishedAt={post.publishedAt} readTimeMinutes={4} compact />
      </div>
    </a>
  );
}

function GridCard({ post, href }: { post: Post; href: string }) {
  return (
    <a href={href} className="card-text card block no-underline p-6 group">
      <span className="badge mb-5 inline-flex">{post.category}</span>

      <h2 className="font-display text-[1.0625rem] tracking-[-0.01em] leading-[1.35] text-text mb-3 text-balance line-clamp-3">
        {post.title}
      </h2>

      <p className="text-[0.8125rem] text-text-2 leading-[1.65] mb-5 line-clamp-2">
        {post.excerpt}
      </p>

      <MetaRow author={post.author} publishedAt={post.publishedAt} readTimeMinutes={4} />
    </a>
  );
}
