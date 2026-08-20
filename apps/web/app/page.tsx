import type { TenantSlug } from '@fluxnews/config';
import { headers } from 'next/headers';
import { ArticleFeed } from '@/components/ArticleFeed';
import { getPublishedPosts } from '@/lib/queries';
import { getTenantConfig } from '@/tenants';

export const revalidate = 3600;

export default async function HomePage() {
  const hdrs = await headers();
  const tenant = (hdrs.get('x-tenant') ?? 'cripto') as TenantSlug;
  const config = getTenantConfig(tenant);

  const dbPosts = await getPublishedPosts(tenant, 20);

  const posts = dbPosts.map((p) => ({
    title: p.title,
    excerpt: p.excerpt || p.content.slice(0, 160).replace(/<[^>]*>/g, ''),
    category: p.category || 'Editorial',
    author: p.author || config.author.name,
    publishedAt: p.publishedAt ?? p.createdAt,
    slug: p.slug,
  }));

  return (
    <div className="max-page px-page py-12">
      <ArticleFeed posts={posts} tenant={tenant} config={config} />
    </div>
  );
}
