CREATE TYPE "public"."post_status" AS ENUM('draft', 'published', 'archived');--> statement-breakpoint
CREATE TYPE "public"."source_kind" AS ENUM('rss', 'newsapi');--> statement-breakpoint
CREATE TABLE "newsletter_issues" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant" text NOT NULL,
	"subject" text NOT NULL,
	"html_content" text NOT NULL,
	"sent_at" timestamp,
	"recipient_count" integer,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "posts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant" text NOT NULL,
	"lang" text DEFAULT 'pt' NOT NULL,
	"status" "post_status" DEFAULT 'draft' NOT NULL,
	"title" text NOT NULL,
	"slug" text NOT NULL,
	"excerpt" text DEFAULT '' NOT NULL,
	"content" text NOT NULL,
	"category" text DEFAULT '' NOT NULL,
	"author" text DEFAULT '' NOT NULL,
	"seo_score" integer,
	"source_url" text,
	"published_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"embedding" vector(1536)
);
--> statement-breakpoint
CREATE TABLE "radio_episodes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant" text NOT NULL,
	"lang" text DEFAULT 'pt' NOT NULL,
	"title" text NOT NULL,
	"audio_url" text NOT NULL,
	"transcript" text DEFAULT '' NOT NULL,
	"duration_seconds" integer,
	"published_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "shorts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant" text NOT NULL,
	"post_id" uuid,
	"video_url" text NOT NULL,
	"thumbnail_url" text DEFAULT '' NOT NULL,
	"duration_seconds" integer,
	"published_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sources" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant" text NOT NULL,
	"kind" "source_kind" NOT NULL,
	"url" text NOT NULL,
	"label" text NOT NULL,
	"active" integer DEFAULT 1 NOT NULL,
	"last_fetched_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "subscribers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant" text NOT NULL,
	"email" text NOT NULL,
	"confirmed_at" timestamp,
	"unsubscribed_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "shorts" ADD CONSTRAINT "shorts_post_id_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "newsletter_issues_tenant_idx" ON "newsletter_issues" USING btree ("tenant");--> statement-breakpoint
CREATE UNIQUE INDEX "posts_tenant_slug_idx" ON "posts" USING btree ("tenant","slug");--> statement-breakpoint
CREATE INDEX "posts_tenant_status_idx" ON "posts" USING btree ("tenant","status");--> statement-breakpoint
CREATE INDEX "posts_published_at_idx" ON "posts" USING btree ("published_at");--> statement-breakpoint
CREATE INDEX "radio_episodes_tenant_idx" ON "radio_episodes" USING btree ("tenant");--> statement-breakpoint
CREATE INDEX "shorts_tenant_idx" ON "shorts" USING btree ("tenant");--> statement-breakpoint
CREATE INDEX "sources_tenant_idx" ON "sources" USING btree ("tenant");--> statement-breakpoint
CREATE UNIQUE INDEX "sources_tenant_url_idx" ON "sources" USING btree ("tenant","url");--> statement-breakpoint
CREATE UNIQUE INDEX "subscribers_tenant_email_idx" ON "subscribers" USING btree ("tenant","email");--> statement-breakpoint
CREATE INDEX "subscribers_tenant_idx" ON "subscribers" USING btree ("tenant");