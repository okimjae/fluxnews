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
  variant: 'hero' | 'card';
}

export function ArticleCard({ post, variant }: ArticleCardProps) {
  const href = post.slug ? `/artigo/${post.slug}` : '#';

  if (variant === 'hero') return <HeroArticle post={post} href={href} />;
  return <GridCard post={post} href={href} />;
}

function HeroArticle({ post, href }: { post: Post; href: string }) {
  return (
    <a
      href={href}
      className="block no-underline rounded-card overflow-hidden relative border border-border hero-card"
    >
      {/* Image placeholder — replaced by real image once pipeline is live */}
      <div
        className="aspect-[21/9] w-full relative"
        style={{
          background: `
            radial-gradient(ellipse 55% 80% at 25% 75%, color-mix(in srgb, var(--color-accent) 40%, transparent), transparent 70%),
            radial-gradient(ellipse 35% 55% at 78% 20%, color-mix(in srgb, var(--color-accent) 22%, transparent), transparent 65%),
            radial-gradient(ellipse 60% 60% at 60% 50%, color-mix(in srgb, var(--color-accent) 10%, transparent), transparent 70%),
            #141619
          `,
          transition: 'background 250ms ease',
        }}
      >
        {/* Dark gradient overlay */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.3) 55%, transparent 100%)',
          }}
        />

        {/* Content */}
        <div
          className="absolute bottom-0 left-0 right-0"
          style={{ padding: 'clamp(1.25rem, 4%, 2rem)' }}
        >
          <div
            className="badge mb-3"
            style={{
              background: 'color-mix(in srgb, var(--color-accent) 18%, rgba(255,255,255,0.08))',
              color: '#fff',
              borderColor: 'rgba(255,255,255,0.2)',
            }}
          >
            {post.category}
          </div>

          <h1 className="font-display text-[clamp(1.5rem,3.5vw,2.5rem)] leading-[1.15] text-white mb-3 text-balance">
            {post.title}
          </h1>

          <p className="font-display italic text-[clamp(0.9rem,1.5vw,1.0625rem)] leading-[1.55] text-white/75 mb-4 max-w-[65ch]">
            {post.excerpt}
          </p>

          <MetaRow author={post.author} publishedAt={post.publishedAt} light />
        </div>
      </div>
    </a>
  );
}

function GridCard({ post, href }: { post: Post; href: string }) {
  return (
    <a
      href={href}
      className="block no-underline bg-surface border border-border rounded-card overflow-hidden card-link"
    >
      {/* Image */}
      <div
        className="aspect-[16/9] relative"
        style={{
          background: `
            radial-gradient(ellipse 50% 70% at 20% 80%, color-mix(in srgb, var(--color-accent) 30%, transparent), transparent 65%),
            radial-gradient(ellipse 40% 50% at 75% 25%, color-mix(in srgb, var(--color-accent) 18%, transparent), transparent 60%),
            #141619
          `,
          transition: 'background 250ms ease',
        }}
      >
        <div className="absolute top-[0.625rem] left-[0.625rem]">
          <span
            className="badge"
            style={{
              background: 'color-mix(in srgb, var(--color-accent) 18%, rgba(255,255,255,0.08))',
              color: '#fff',
              borderColor: 'rgba(255,255,255,0.2)',
            }}
          >
            {post.category}
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="pt-4 px-[1.125rem] pb-[1.125rem]">
        <h2
          className="font-display text-[1.0625rem] leading-[1.35] text-text mb-2 text-balance"
          style={{
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {post.title}
        </h2>

        <p
          className="text-[0.8125rem] text-text-2 leading-[1.55] mb-[0.875rem]"
          style={{
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {post.excerpt}
        </p>

        <MetaRow author={post.author} publishedAt={post.publishedAt} readTimeMinutes={3} />
      </div>
    </a>
  );
}
