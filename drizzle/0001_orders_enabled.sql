ALTER TABLE "store_settings" ADD COLUMN IF NOT EXISTS "orders_enabled" boolean DEFAULT true NOT NULL;
