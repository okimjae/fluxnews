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
      <div className="img-hero aspect-[21/9] w-full relative">
        {/* Bottom-up gradient overlay */}
        <div className="hero-overlay absolute inset-0" />

        {/* Accent edge */}
        <div className="accent-edge absolute left-0 top-0 bottom-0 w-[3px]" />

        {/* Content overlay */}
        <div className="absolute bottom-0 left-0 right-0 px-page pb-[clamp(1.5rem,4%,2.5rem)] pt-8">
          <span className="badge mb-4 inline-flex">{post.category}</span>

          <h1 className="font-display text-hero font-normal text-white mb-3 text-balance">
            {post.title}
          </h1>

          <p className="text-[clamp(0.875rem,1.5vw,1rem)] leading-[1.6] mb-5 max-w-[60ch] text-white/65">
            {post.excerpt}
          </p>

          <MetaRow author={post.author} publishedAt={post.publishedAt} light />
        </div>

        {/* Hover: subtle accent tint */}
        <div className="hero-hover absolute inset-0 opacity-0 group-hover:opacity-100" />
      </div>

      {/* Bottom accent bar — grows on hover */}
      <div className="accent-reveal scale-x-[0.4] group-hover:scale-x-100 transition-transform duration-300 origin-left" />
    </a>
  );
}

function GridCard({ post, href }: { post: Post; href: string }) {
  return (
    <a href={href} className="card block no-underline group">
      {/* Image placeholder */}
      <div className="img-card aspect-[16/9] relative">
        {/* Category badge in corner */}
        <div className="absolute top-3 left-3">
          <span className="badge badge-glass">{post.category}</span>
        </div>
      </div>

      {/* Card body */}
      <div className="p-5">
        <h2 className="font-display text-[clamp(1rem,1.5vw,1.125rem)] tracking-[-0.01em] leading-[1.3] text-text mb-2 text-balance line-clamp-3">
          {post.title}
        </h2>

        <p className="text-[0.8125rem] text-text-2 leading-[1.55] mb-4 line-clamp-2">
          {post.excerpt}
        </p>

        <MetaRow author={post.author} publishedAt={post.publishedAt} readTimeMinutes={4} />
      </div>
    </a>
  );
}
