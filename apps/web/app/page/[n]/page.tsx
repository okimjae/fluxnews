import type { TenantSlug } from '@fluxnews/config';
import { headers } from 'next/headers';
import { notFound, redirect } from 'next/navigation';
import { ArticleFeed } from '@/components/ArticleFeed';
import { PAGE_SIZE, countPublishedPosts, getPublishedPosts } from '@/lib/queries';
import { getTenantConfig } from '@/tenants';

export const revalidate = 1800;

interface Props {
  params: Promise<{ n: string }>;
  searchParams: Promise<Record<string, string>>;
}

export default async function PaginatedPage({ params, searchParams }: Props) {
  const { n } = await params;
  const sp = await searchParams;
  const page = Number(n);

  if (!Number.isInteger(page) || page < 1) notFound();
  if (page === 1) redirect(`/?tenant=${sp.tenant ?? 'cripto'}`);

  const hdrs = await headers();
  const tenant = (hdrs.get('x-tenant') ?? 'cripto') as TenantSlug;
  const config = getTenantConfig(tenant);

  const [dbPosts, total] = await Promise.all([
    getPublishedPosts(tenant, PAGE_SIZE, (page - 1) * PAGE_SIZE),
    countPublishedPosts(tenant),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  if (page > totalPages) notFound();

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
      <ArticleFeed posts={posts} tenant={tenant} config={config} page={page} totalPages={totalPages} />
    </div>
  );
}
