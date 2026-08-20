import type { MetadataRoute } from 'next';
import type { TenantSlug } from '@fluxnews/config';
import { headers } from 'next/headers';
import { getPublishedPosts } from '@/lib/queries';

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const hdrs = await headers();
  const tenant = (hdrs.get('x-tenant') ?? 'cripto') as TenantSlug;

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://fluxnews.app';

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'hourly', priority: 1 },
    { url: `${baseUrl}/categoria/todos`, lastModified: new Date(), changeFrequency: 'hourly', priority: 0.8 },
    { url: `${baseUrl}/newsletter`, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/sobre`, changeFrequency: 'monthly', priority: 0.3 },
  ];

  const posts = await getPublishedPosts(tenant, 200);
  const articleRoutes: MetadataRoute.Sitemap = posts.map((p) => ({
    url: `${baseUrl}/artigo/${p.slug}`,
    lastModified: p.publishedAt ?? p.createdAt,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...articleRoutes];
}
