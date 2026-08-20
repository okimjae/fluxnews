/**
 * RSS Fetcher Agent
 *
 * Reads active RSS sources from the DB, fetches each feed,
 * and inserts new articles as draft posts (skipping duplicates via source_url).
 *
 * Run: pnpm --filter @fluxnews/agents rss
 */

import { db, sources, posts } from '@fluxnews/db';
import { eq, and } from 'drizzle-orm';
import Parser from 'rss-parser';

const parser = new Parser({
  timeout: 10_000,
  headers: { 'User-Agent': 'fluxnews-bot/1.0' },
});

async function fetchRssSources() {
  return db
    .select()
    .from(sources)
    .where(and(eq(sources.kind, 'rss'), eq(sources.active, 1)));
}

async function getExistingSourceUrls(tenant: string): Promise<Set<string>> {
  const existing = await db
    .select({ sourceUrl: posts.sourceUrl })
    .from(posts)
    .where(eq(posts.tenant, tenant));

  return new Set(existing.map((r) => r.sourceUrl).filter(Boolean) as string[]);
}

function slugify(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, 80);
}

async function processFeed(source: typeof sources.$inferSelect) {
  console.log(`[${source.tenant}] Fetching ${source.label} — ${source.url}`);

  let feed: Awaited<ReturnType<typeof parser.parseURL>>;
  try {
    feed = await parser.parseURL(source.url);
  } catch (err) {
    console.error(`  ✗ Failed to fetch: ${(err as Error).message}`);
    return { inserted: 0, skipped: 0 };
  }

  const existingUrls = await getExistingSourceUrls(source.tenant);
  let inserted = 0;
  let skipped = 0;

  for (const item of feed.items) {
    const sourceUrl = item.link ?? item.guid;
    if (!sourceUrl || existingUrls.has(sourceUrl)) {
      skipped++;
      continue;
    }

    const title = item.title?.trim() ?? 'Sem título';
    const excerpt = (item.contentSnippet ?? item.summary ?? '').slice(0, 300).trim();
    const slug = `${slugify(title)}-${Date.now()}`;

    try {
      await db.insert(posts).values({
        tenant: source.tenant,
        title,
        slug,
        excerpt,
        content: item.content ?? item['content:encoded'] ?? excerpt,
        category: feed.title ?? source.label,
        author: item.creator ?? item.author ?? '',
        sourceUrl,
        publishedAt: item.pubDate ? new Date(item.pubDate) : null,
        status: 'draft',
      });
      existingUrls.add(sourceUrl);
      inserted++;
    } catch (err) {
      console.error(`  ✗ Insert failed for "${title}": ${(err as Error).message}`);
    }
  }

  // Update last_fetched_at
  await db
    .update(sources)
    .set({ lastFetchedAt: new Date() })
    .where(eq(sources.id, source.id));

  console.log(`  ✓ ${inserted} inserted, ${skipped} skipped`);
  return { inserted, skipped };
}

async function main() {
  console.log('🔄 RSS Fetcher starting…');
  const rssSources = await fetchRssSources();

  if (rssSources.length === 0) {
    console.log('No active RSS sources found. Add sources to the DB first.');
    return;
  }

  let totalInserted = 0;
  let totalSkipped = 0;

  for (const source of rssSources) {
    const { inserted, skipped } = await processFeed(source);
    totalInserted += inserted;
    totalSkipped += skipped;
  }

  console.log(`\n✅ Done. ${totalInserted} articles inserted, ${totalSkipped} skipped.`);
}

main().catch((err) => {
  console.error('Fatal:', err);
  process.exit(1);
});
