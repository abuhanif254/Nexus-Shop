ALTER TABLE "posts" ADD COLUMN IF NOT EXISTS "author" text;
ALTER TABLE "posts" ADD COLUMN IF NOT EXISTS "category" text;
ALTER TABLE "posts" ADD COLUMN IF NOT EXISTS "tags" text;
ALTER TABLE "posts" ADD COLUMN IF NOT EXISTS "seo_title" text;
ALTER TABLE "posts" ADD COLUMN IF NOT EXISTS "seo_description" text;
ALTER TABLE "posts" ADD COLUMN IF NOT EXISTS "view_count" integer NOT NULL DEFAULT 0;
