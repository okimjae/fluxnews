import { integer, pgTable, text, timestamp, uuid, vector } from 'drizzle-orm/pg-core';

export const posts = pgTable('posts', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenant: text('tenant').notNull(),
  lang: text('lang').notNull().default('pt'),
  title: text('title').notNull(),
  slug: text('slug').notNull(),
  excerpt: text('excerpt').notNull().default(''),
  content: text('content').notNull(),
  category: text('category').notNull().default(''),
  author: text('author').notNull().default(''),
  seoScore: integer('seo_score'),
  publishedAt: timestamp('published_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  embedding: vector('embedding', { dimensions: 1536 }),
});

export const subscribers = pgTable('subscribers', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenant: text('tenant').notNull(),
  email: text('email').notNull(),
  confirmedAt: timestamp('confirmed_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const radioEpisodes = pgTable('radio_episodes', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenant: text('tenant').notNull(),
  lang: text('lang').notNull().default('pt'),
  title: text('title').notNull(),
  audioUrl: text('audio_url').notNull(),
  transcript: text('transcript').notNull().default(''),
  durationSeconds: integer('duration_seconds'),
  publishedAt: timestamp('published_at').defaultNow().notNull(),
});

export const shorts = pgTable('shorts', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenant: text('tenant').notNull(),
  postId: uuid('post_id').references(() => posts.id),
  videoUrl: text('video_url').notNull(),
  thumbnailUrl: text('thumbnail_url').notNull().default(''),
  durationSeconds: integer('duration_seconds'),
  publishedAt: timestamp('published_at').defaultNow().notNull(),
});
