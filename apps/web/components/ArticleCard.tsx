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
      style={{ display: 'block', textDecoration: 'none', borderRadius: 10, overflow: 'hidden', position: 'relative', border: '1px solid var(--color-border)' }}
      className="hero-card"
    >
      {/* Image placeholder — replaced by real image once pipeline is live */}
      <div
        style={{
          aspectRatio: '21/9',
          width: '100%',
          position: 'relative',
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
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.3) 55%, transparent 100%)',
          }}
        />

        {/* Content */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: 'clamp(1.25rem, 4%, 2rem)' }}>
          <div className="badge" style={{ marginBottom: '0.75rem', background: 'color-mix(in srgb, var(--color-accent) 18%, rgba(255,255,255,0.08))', color: '#fff', borderColor: 'rgba(255,255,255,0.2)' }}>
            {post.category}
          </div>

          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.5rem, 3.5vw, 2.5rem)',
              lineHeight: 1.15,
              color: '#fff',
              marginBottom: '0.75rem',
              textWrap: 'balance',
            }}
          >
            {post.title}
          </h1>

          <p
            style={{
              fontFamily: 'var(--font-display)',
              fontStyle: 'italic',
              fontSize: 'clamp(0.9rem, 1.5vw, 1.0625rem)',
              lineHeight: 1.55,
              color: 'rgba(255,255,255,0.75)',
              marginBottom: '1rem',
              maxWidth: '65ch',
            }}
          >
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
      style={{
        display: 'block',
        textDecoration: 'none',
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 10,
        overflow: 'hidden',
        transition: 'transform 200ms ease-out, box-shadow 200ms ease-out, border-color 200ms ease',
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)';
        (e.currentTarget as HTMLElement).style.boxShadow = 'var(--card-hover-shadow)';
        (e.currentTarget as HTMLElement).style.borderColor = 'color-mix(in srgb, var(--color-accent) 40%, var(--color-border))';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.transform = '';
        (e.currentTarget as HTMLElement).style.boxShadow = '';
        (e.currentTarget as HTMLElement).style.borderColor = '';
      }}
    >
      {/* Image */}
      <div
        style={{
          aspectRatio: '16/9',
          position: 'relative',
          background: `
            radial-gradient(ellipse 50% 70% at 20% 80%, color-mix(in srgb, var(--color-accent) 30%, transparent), transparent 65%),
            radial-gradient(ellipse 40% 50% at 75% 25%, color-mix(in srgb, var(--color-accent) 18%, transparent), transparent 60%),
            #141619
          `,
          transition: 'background 250ms ease',
        }}
      >
        <div style={{ position: 'absolute', top: '0.625rem', left: '0.625rem' }}>
          <span className="badge" style={{ background: 'color-mix(in srgb, var(--color-accent) 18%, rgba(255,255,255,0.08))', color: '#fff', borderColor: 'rgba(255,255,255,0.2)' }}>
            {post.category}
          </span>
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: '1rem 1.125rem 1.125rem' }}>
        <h2
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.0625rem',
            lineHeight: 1.35,
            color: 'var(--color-text)',
            marginBottom: '0.5rem',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textWrap: 'balance',
          }}
        >
          {post.title}
        </h2>

        <p
          style={{
            fontSize: '0.8125rem',
            color: 'var(--color-text-2)',
            lineHeight: 1.55,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            marginBottom: '0.875rem',
          }}
        >
          {post.excerpt}
        </p>

        <MetaRow author={post.author} publishedAt={post.publishedAt} readTimeMinutes={3} />
      </div>
    </a>
  );
}
