ALTER TABLE "banners" ADD COLUMN IF NOT EXISTS "title" text;
ALTER TABLE "banners" ADD COLUMN IF NOT EXISTS "subtitle" text;
ALTER TABLE "banners" ADD COLUMN IF NOT EXISTS "button_text" text;
ALTER TABLE "banners" ADD COLUMN IF NOT EXISTS "active" boolean NOT NULL DEFAULT true;
