import type { TenantSlug } from '@fluxnews/config';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import { AdSlot } from '@/components/AdSlot';
import { ArticleCard } from '@/components/ArticleCard';
import { MetaRow } from '@/components/MetaRow';
import { NewsletterWidget } from '@/components/NewsletterWidget';
import { ShareButtons } from '@/components/ShareButtons';
import { getPostBySlug, getRelatedPosts } from '@/lib/queries';
import { getTenantConfig } from '@/tenants';

export const revalidate = 3600;

interface Props {
  params: Promise<{ slug: string }>;
}

function ArticleBody({ html }: { html: string }) {
  return <div className="prose" dangerouslySetInnerHTML={{ __html: html }} />;
}

function JsonLdScript({ data }: { data: Record<string, unknown> }) {
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
  );
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const hdrs = await headers();
  const tenant = (hdrs.get('x-tenant') ?? 'cripto') as TenantSlug;
  const config = getTenantConfig(tenant);

  const [post, related] = await Promise.all([
    getPostBySlug(tenant, slug),
    getRelatedPosts(tenant, slug),
  ]);

  if (!post) notFound();

  const publishedAt = post.publishedAt ?? post.createdAt;
  const wordCount = post.content.replace(/<[^>]*>/g, '').split(/\s+/).length;
  const readTimeMinutes = Math.max(1, Math.round(wordCount / 200));

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    author: { '@type': 'Person', name: post.author || config.author.name },
    publisher: { '@type': 'Organization', name: config.name },
    datePublished: publishedAt.toISOString(),
    inLanguage: config.primaryLang,
  };

  return (
    <>
      <JsonLdScript data={jsonLd} />

      <div className="max-page px-page py-10">
        <div className="grid lg:grid-cols-[1fr_300px] gap-12 items-start">
          <article>
            <nav
              aria-label="Breadcrumb"
              className="flex gap-2 text-[0.8125rem] text-text-m mb-7 items-center flex-wrap"
            >
              <a href="/" className="text-text-m no-underline hover:text-text-2 transition-colors">
                Início
              </a>
              <span aria-hidden>›</span>
              <a
                href={`/categoria/${(post.category || 'editorial').toLowerCase()}`}
                className="text-text-m no-underline hover:text-text-2 transition-colors"
              >
                {post.category || 'Editorial'}
              </a>
              <span aria-hidden>›</span>
              <span className="text-text-2 line-clamp-1">{post.title}</span>
            </nav>

            <span className="badge mb-4 inline-flex">{post.category || 'Editorial'}</span>

            <h1 className="font-display text-[clamp(1.875rem,5vw,2.75rem)] leading-[1.15] tracking-[-0.02em] text-text mb-4 text-balance">
              {post.title}
            </h1>

            {post.excerpt && (
              <p className="font-display italic text-[1.1875rem] leading-[1.6] text-text-2 mb-6">
                {post.excerpt}
              </p>
            )}

            <div className="border-t border-b border-border py-[0.875rem] mb-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <MetaRow
                author={post.author || config.author.name}
                publishedAt={publishedAt}
                readTimeMinutes={readTimeMinutes}
              />
              <ShareButtons title={post.title} />
            </div>

            <div className="flex justify-center mb-8">
              <AdSlot size="rectangle" />
            </div>

            <ArticleBody html={post.content} />

            <div className="mt-10 pt-6 border-t border-border">
              <ShareButtons title={post.title} />
            </div>

            <div className="mt-10 pt-6 border-t border-border flex gap-4 items-start">
              <div className="avatar-surface w-12 h-12 rounded-full flex items-center justify-center text-xl shrink-0 text-accent font-bold">
                {(post.author || config.author.name).charAt(0)}
              </div>
              <div>
                <p className="text-[0.9375rem] font-semibold text-text mb-0.5">
                  {post.author || config.author.name}
                </p>
                <p className="text-[0.8125rem] text-text-m">
                  {config.author.title} · {config.name}
                </p>
              </div>
            </div>
          </article>

          <aside className="space-y-8 lg:sticky lg:top-[var(--header-h)]">
            <NewsletterWidget tenantName={config.name} />
            <AdSlot size="rectangle" />
          </aside>
        </div>

        {related.length > 0 && (
          <section className="mt-12 pt-6 border-t border-border">
            <div className="section-label">
              <div className="flex items-center gap-3">
                <div className="w-[2px] h-[1.1rem] bg-accent rounded-full" />
                <h2 className="font-mono text-[0.75rem] font-medium uppercase tracking-[0.1em] text-text-2">
                  Artigos Relacionados
                </h2>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {related.map((rpost) => (
                <ArticleCard
                  key={rpost.slug}
                  post={{
                    title: rpost.title,
                    excerpt: rpost.excerpt || '',
                    category: rpost.category || 'Editorial',
                    author: rpost.author || config.author.name,
                    publishedAt: rpost.publishedAt ?? rpost.createdAt,
                    slug: rpost.slug,
                  }}
                  variant="card"
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
