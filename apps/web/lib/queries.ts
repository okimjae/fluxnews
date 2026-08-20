import { db, posts, subscribers } from '@fluxnews/db';
import { and, desc, eq, ilike, or } from 'drizzle-orm';

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

export async function getPostsByCategory(
  tenant: string,
  categorySlug: string,
  limit = 20,
): Promise<PostRow[]> {
  const baseFilter = and(eq(posts.tenant, tenant), eq(posts.status, 'published'));
  if (categorySlug === 'todos') {
    return db.select().from(posts).where(baseFilter).orderBy(desc(posts.publishedAt)).limit(limit);
  }
  const label = categorySlug.replace(/-/g, ' ');
  return db
    .select()
    .from(posts)
    .where(and(baseFilter, or(ilike(posts.category, label), ilike(posts.category, `%${label}%`))))
    .orderBy(desc(posts.publishedAt))
    .limit(limit);
}

export type SubscriberRow = typeof subscribers.$inferSelect;

export async function subscribeEmail(tenant: string, email: string): Promise<'ok' | 'exists'> {
  const existing = await db
    .select({ id: subscribers.id })
    .from(subscribers)
    .where(and(eq(subscribers.tenant, tenant), eq(subscribers.email, email)))
    .limit(1);
  if (existing.length > 0) return 'exists';
  await db.insert(subscribers).values({ tenant, email });
  return 'ok';
}
