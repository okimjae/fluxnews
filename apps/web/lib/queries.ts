import { db, posts } from '@fluxnews/db';
import { and, desc, eq } from 'drizzle-orm';

export type PostRow = typeof posts.$inferSelect;

export async function getPublishedPosts(tenant: string, limit = 20): Promise<PostRow[]> {
  return db
    .select()
    .from(posts)
    .where(and(eq(posts.tenant, tenant), eq(posts.status, 'published')))
    .orderBy(desc(posts.publishedAt))
    .limit(limit);
}

export async function getPostBySlug(tenant: string, slug: string): Promise<PostRow | null> {
  const rows = await db
    .select()
    .from(posts)
    .where(and(eq(posts.tenant, tenant), eq(posts.slug, slug), eq(posts.status, 'published')))
    .limit(1);
  return rows[0] ?? null;
}

export async function getRelatedPosts(
  tenant: string,
  currentSlug: string,
  limit = 3,
): Promise<PostRow[]> {
  return db
    .select()
    .from(posts)
    .where(and(eq(posts.tenant, tenant), eq(posts.status, 'published')))
    .orderBy(desc(posts.publishedAt))
    .limit(limit + 1)
    .then((rows) => rows.filter((r) => r.slug !== currentSlug).slice(0, limit));
}
