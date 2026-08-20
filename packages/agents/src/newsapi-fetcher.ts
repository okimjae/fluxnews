/**
 * NewsAPI Fetcher Agent
 *
 * Reads active NewsAPI sources from the DB (kind='newsapi', url=query string),
 * hits the NewsAPI /everything endpoint, and inserts new articles as drafts.
 *
 * Required env: DATABASE_URL, NEWSAPI_KEY
 * Run: pnpm --filter @fluxnews/agents newsapi
 */

import { db, sources, posts } from '@fluxnews/db';
import { eq, and } from 'drizzle-orm';

const NEWSAPI_KEY = process.env.NEWSAPI_KEY;
const NEWSAPI_BASE = 'https://newsapi.org/v2/everything';

interface NewsApiArticle {
  title: string;
  description: string | null;
  content: string | null;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  author: string | null;
  source: { name: string };
}

interface NewsApiResponse {
  status: string;
  totalResults: number;
  articles: NewsApiArticle[];
}

async function fetchNewsApi(query: string, pageSize = 20): Promise<NewsApiArticle[]> {
  if (!NEWSAPI_KEY) throw new Error('NEWSAPI_KEY is not set');

  const params = new URLSearchParams({
    q: query,
    language: 'pt',
    sortBy: 'publishedAt',
    pageSize: String(pageSize),
    apiKey: NEWSAPI_KEY,
  });

  const res = await fetch(`${NEWSAPI_BASE}?${params}`, {
    headers: { 'User-Agent': 'fluxnews-bot/1.0' },
    signal: AbortSignal.timeout(15_000),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`NewsAPI error ${res.status}: ${body}`);
  }

  const data = (await res.json()) as NewsApiResponse;
  if (data.status !== 'ok') throw new Error(`NewsAPI returned status: ${data.status}`);
  return data.articles;
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

async function processNewsApiSource(source: typeof sources.$inferSelect) {
  const query = source.url; // url field stores the NewsAPI query string
  console.log(`[${source.tenant}] NewsAPI query: "${query}"`);

  let articles: NewsApiArticle[];
  try {
    articles = await fetchNewsApi(query);
  } catch (err) {
    console.error(`  ✗ Failed: ${(err as Error).message}`);
    return { inserted: 0, skipped: 0 };
  }

  const existingUrls = await getExistingSourceUrls(source.tenant);
  let inserted = 0;
  let skipped = 0;

  for (const article of articles) {
    if (!article.url || existingUrls.has(article.url)) {
      skipped++;
      continue;
    }

    // Skip removed articles (NewsAPI placeholder)
    if (article.title === '[Removed]') {
      skipped++;
      continue;
    }

    const slug = `${slugify(article.title)}-${Date.now()}`;
    const excerpt = (article.description ?? '').slice(0, 300).trim();

    try {
      await db.insert(posts).values({
        tenant: source.tenant,
        title: article.title.trim(),
        slug,
        excerpt,
        content: article.content ?? excerpt,
        category: article.source.name,
        author: article.author ?? '',
        sourceUrl: article.url,
        publishedAt: article.publishedAt ? new Date(article.publishedAt) : null,
        status: 'draft',
      });
      existingUrls.add(article.url);
      inserted++;
    } catch (err) {
      console.error(`  ✗ Insert failed: ${(err as Error).message}`);
    }
  }

  await db
    .update(sources)
    .set({ lastFetchedAt: new Date() })
    .where(eq(sources.id, source.id));

  console.log(`  ✓ ${inserted} inserted, ${skipped} skipped`);
  return { inserted, skipped };
}

async function main() {
  console.log('🔄 NewsAPI Fetcher starting…');
  const newsapiSources = await db
    .select()
    .from(sources)
    .where(and(eq(sources.kind, 'newsapi'), eq(sources.active, 1)));

  if (newsapiSources.length === 0) {
    console.log('No active NewsAPI sources found.');
    return;
  }

  let totalInserted = 0;
  let totalSkipped = 0;

  for (const source of newsapiSources) {
    const { inserted, skipped } = await processNewsApiSource(source);
    totalInserted += inserted;
    totalSkipped += skipped;
  }

  console.log(`\n✅ Done. ${totalInserted} articles inserted, ${totalSkipped} skipped.`);
}

main().catch((err) => {
  console.error('Fatal:', err);
  process.exit(1);
});
