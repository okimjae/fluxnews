import { db, newsletterIssues, posts, radioEpisodes, shorts, subscribers } from '@fluxnews/db';
import { and, count, desc, eq, ilike, isNotNull, or } from 'drizzle-orm';

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

export interface AdminStats {
  posts: { published: number; draft: number };
  subscribers: { confirmed: number; total: number };
  episodes: number;
  shorts: number;
  lastNewsletter: { sentAt: Date | null; recipients: number | null };
}

export async function getAdminStats(tenant: string): Promise<AdminStats> {
  const [postsPublished, postsDraft, subsConfirmed, subsTotal, episodesTotal, shortsTotal, lastIssue] =
    await Promise.all([
      db.select({ n: count() }).from(posts).where(and(eq(posts.tenant, tenant), eq(posts.status, 'published'))),
      db.select({ n: count() }).from(posts).where(and(eq(posts.tenant, tenant), eq(posts.status, 'draft'))),
      db.select({ n: count() }).from(subscribers).where(and(eq(subscribers.tenant, tenant), isNotNull(subscribers.confirmedAt))),
      db.select({ n: count() }).from(subscribers).where(eq(subscribers.tenant, tenant)),
      db.select({ n: count() }).from(radioEpisodes).where(eq(radioEpisodes.tenant, tenant)),
      db.select({ n: count() }).from(shorts).where(eq(shorts.tenant, tenant)),
      db.select({ sentAt: newsletterIssues.sentAt, recipients: newsletterIssues.recipientCount })
        .from(newsletterIssues)
        .where(and(eq(newsletterIssues.tenant, tenant), isNotNull(newsletterIssues.sentAt)))
        .orderBy(desc(newsletterIssues.sentAt))
        .limit(1),
    ]);

  return {
    posts: { published: postsPublished[0]?.n ?? 0, draft: postsDraft[0]?.n ?? 0 },
    subscribers: { confirmed: subsConfirmed[0]?.n ?? 0, total: subsTotal[0]?.n ?? 0 },
    episodes: episodesTotal[0]?.n ?? 0,
    shorts: shortsTotal[0]?.n ?? 0,
    lastNewsletter: { sentAt: lastIssue[0]?.sentAt ?? null, recipients: lastIssue[0]?.recipients ?? null },
  };
}
