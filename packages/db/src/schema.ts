import {
  index,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  vector,
} from 'drizzle-orm/pg-core';

// ─── ENUMS ────────────────────────────────────────────────────────────────────

export const sourceKindEnum = pgEnum('source_kind', ['rss', 'newsapi']);

export const postStatusEnum = pgEnum('post_status', ['draft', 'published', 'archived']);

// ─── SOURCES ──────────────────────────────────────────────────────────────────
// RSS feeds and NewsAPI queries managed per tenant

export const sources = pgTable(
  'sources',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    tenant: text('tenant').notNull(),
    kind: sourceKindEnum('kind').notNull(),
    url: text('url').notNull(),         // RSS URL or NewsAPI query string
    label: text('label').notNull(),     // human-readable, e.g. "CoinDesk RSS"
    active: integer('active').notNull().default(1),
    lastFetchedAt: timestamp('last_fetched_at'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (t) => [
    index('sources_tenant_idx').on(t.tenant),
    uniqueIndex('sources_tenant_url_idx').on(t.tenant, t.url),
  ],
);

// ─── POSTS ────────────────────────────────────────────────────────────────────

export const posts = pgTable(
  'posts',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    tenant: text('tenant').notNull(),
    lang: text('lang').notNull().default('pt'),
    status: postStatusEnum('status').notNull().default('draft'),
    title: text('title').notNull(),
    slug: text('slug').notNull(),
    excerpt: text('excerpt').notNull().default(''),
    content: text('content').notNull(),
    category: text('category').notNull().default(''),
    author: text('author').notNull().default(''),
    seoScore: integer('seo_score'),
    sourceUrl: text('source_url'),      // original article URL
    publishedAt: timestamp('published_at'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    embedding: vector('embedding', { dimensions: 1536 }),
  },
  (t) => [
    uniqueIndex('posts_tenant_slug_idx').on(t.tenant, t.slug),
    index('posts_tenant_status_idx').on(t.tenant, t.status),
    index('posts_published_at_idx').on(t.publishedAt),
  ],
);

// ─── SUBSCRIBERS ──────────────────────────────────────────────────────────────

export const subscribers = pgTable(
  'subscribers',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    tenant: text('tenant').notNull(),
    email: text('email').notNull(),
    confirmedAt: timestamp('confirmed_at'),
    unsubscribedAt: timestamp('unsubscribed_at'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (t) => [
    uniqueIndex('subscribers_tenant_email_idx').on(t.tenant, t.email),
    index('subscribers_tenant_idx').on(t.tenant),
  ],
);

// ─── NEWSLETTER ISSUES ────────────────────────────────────────────────────────

export const newsletterIssues = pgTable(
  'newsletter_issues',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    tenant: text('tenant').notNull(),
    subject: text('subject').notNull(),
    htmlContent: text('html_content').notNull(),
    sentAt: timestamp('sent_at'),
    recipientCount: integer('recipient_count'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (t) => [index('newsletter_issues_tenant_idx').on(t.tenant)],
);

// ─── RADIO EPISODES ───────────────────────────────────────────────────────────

export const radioEpisodes = pgTable(
  'radio_episodes',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    tenant: text('tenant').notNull(),
    lang: text('lang').notNull().default('pt'),
    title: text('title').notNull(),
    audioUrl: text('audio_url').notNull(),
    transcript: text('transcript').notNull().default(''),
    durationSeconds: integer('duration_seconds'),
    publishedAt: timestamp('published_at').defaultNow().notNull(),
  },
  (t) => [index('radio_episodes_tenant_idx').on(t.tenant)],
);

// ─── SHORTS ───────────────────────────────────────────────────────────────────

export const shorts = pgTable(
  'shorts',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    tenant: text('tenant').notNull(),
    postId: uuid('post_id').references(() => posts.id, { onDelete: 'cascade' }),
    videoUrl: text('video_url').notNull(),
    thumbnailUrl: text('thumbnail_url').notNull().default(''),
    durationSeconds: integer('duration_seconds'),
    publishedAt: timestamp('published_at').defaultNow().notNull(),
  },
  (t) => [index('shorts_tenant_idx').on(t.tenant)],
);
