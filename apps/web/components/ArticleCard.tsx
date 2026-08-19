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
    <a href={href} className="block no-underline group relative rounded-card overflow-hidden">
      {/* Image / gradient placeholder */}
      <div
        className="aspect-[21/9] w-full relative"
        style={{
          background: `
            radial-gradient(ellipse 70% 80% at 15% 85%, color-mix(in srgb, var(--color-accent) 35%, transparent), transparent 65%),
            radial-gradient(ellipse 45% 60% at 80% 20%, color-mix(in srgb, var(--color-accent) 18%, transparent), transparent 60%),
            radial-gradient(ellipse 80% 50% at 50% 110%, color-mix(in srgb, var(--color-accent) 8%, transparent), transparent 70%),
            var(--color-surface-2)
          `,
        }}
      >
        {/* Gradient overlay from bottom */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to top, rgba(10,12,15,0.96) 0%, rgba(10,12,15,0.55) 45%, rgba(10,12,15,0.1) 100%)',
          }}
        />

        {/* Accent line on left edge */}
        <div
          className="absolute left-0 top-0 bottom-0 w-[3px]"
          style={{ background: 'var(--color-accent)', opacity: 0.8 }}
        />

        {/* Content overlay */}
        <div className="absolute bottom-0 left-0 right-0 px-page pb-[clamp(1.5rem,4%,2.5rem)] pt-8">
          <span className="badge mb-4 inline-flex">{post.category}</span>

          <h1
            className="font-display text-[clamp(1.75rem,4vw,3rem)] font-normal leading-[1.1] text-white mb-3 text-balance"
            style={{ letterSpacing: '-0.02em' }}
          >
            {post.title}
          </h1>

          <p
            className="text-[clamp(0.875rem,1.5vw,1rem)] leading-[1.6] mb-5 max-w-[60ch]"
            style={{ color: 'rgba(240,242,245,0.65)' }}
          >
            {post.excerpt}
          </p>

          <MetaRow author={post.author} publishedAt={post.publishedAt} light />
        </div>

        {/* Hover: subtle brighten on gradient */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100"
          style={{
            background: 'color-mix(in srgb, var(--color-accent) 4%, transparent)',
            transition: 'opacity 300ms ease',
          }}
        />
      </div>

      {/* Bottom accent bar — grows on hover */}
      <div
        className="h-[2px]"
        style={{
          background:
            'linear-gradient(to right, var(--color-accent), color-mix(in srgb, var(--color-accent) 20%, transparent))',
          transform: 'scaleX(0.4)',
          transformOrigin: 'left',
          transition: 'transform 300ms ease',
        }}
      />
    </a>
  );
}

function GridCard({ post, href }: { post: Post; href: string }) {
  return (
    <a href={href} className="card block no-underline group">
      {/* Image placeholder */}
      <div
        className="aspect-[16/9] relative"
        style={{
          background: `
            radial-gradient(ellipse 60% 80% at 20% 85%, color-mix(in srgb, var(--color-accent) 28%, transparent), transparent 65%),
            radial-gradient(ellipse 40% 50% at 78% 22%, color-mix(in srgb, var(--color-accent) 14%, transparent), transparent 60%),
            var(--color-surface-2)
          `,
        }}
      >
        {/* Category badge in corner */}
        <div className="absolute top-3 left-3">
          <span
            className="badge"
            style={{
              background: 'rgba(10,12,15,0.75)',
              backdropFilter: 'blur(8px)',
              color: 'var(--color-accent)',
              borderColor: 'color-mix(in srgb, var(--color-accent) 30%, rgba(255,255,255,0.1))',
            }}
          >
            {post.category}
          </span>
        </div>
      </div>

      {/* Card body */}
      <div className="p-5">
        <h2
          className="font-display leading-[1.3] text-text mb-2 text-balance"
          style={{
            fontSize: 'clamp(1rem, 1.5vw, 1.125rem)',
            letterSpacing: '-0.01em',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {post.title}
        </h2>

        <p
          className="text-[0.8125rem] text-text-2 leading-[1.55] mb-4"
          style={{
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {post.excerpt}
        </p>

        <MetaRow author={post.author} publishedAt={post.publishedAt} readTimeMinutes={4} />
      </div>
    </a>
  );
}
