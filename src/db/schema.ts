import { pgTable, text, doublePrecision, integer, primaryKey, timestamp, boolean } from 'drizzle-orm/pg-core';

export const products = pgTable('products', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  brand: text('brand').notNull(),
  category: text('category').notNull(),
  price: doublePrecision('price').notNull(),
  oldPrice: doublePrecision('old_price'),
  discount: integer('discount').default(0),
  rating: doublePrecision('rating').default(0),
  reviews: integer('reviews').default(0),
  soldCount: integer('sold_count').default(0),
  totalStock: integer('total_stock').notNull().default(0),
  vendor: text('vendor'),
  description: text('description'),
  image: text('image').notNull(),
  featured: boolean('featured').default(false),
  createdAt: timestamp('created_at', { mode: 'date' }).notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date' }),
});

export const banners = pgTable('banners', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  image: text('image').notNull(),
  link: text('link').notNull(),
  position: text('position').notNull(), // 'home', 'shop', etc.
  order: integer('order').notNull().default(0),
  createdAt: timestamp('created_at', { mode: 'date' }).notNull(),
});

export const categories = pgTable('categories', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  image: text('image'),
  createdAt: timestamp('created_at', { mode: 'date' }).notNull().defaultNow(),
});

export const brands = pgTable('brands', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  logo: text('logo'),
  createdAt: timestamp('created_at', { mode: 'date' }).notNull().defaultNow(),
});

export const storeSettings = pgTable('store_settings', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  storeName: text('store_name').notNull().default('My Store'),
  contactEmail: text('contact_email').notNull().default('support@store.com'),
  currency: text('currency').notNull().default('USD'),
  taxRate: doublePrecision('tax_rate').notNull().default(0),
  flatShippingFee: doublePrecision('flat_shipping_fee').notNull().default(0),
  updatedAt: timestamp('updated_at', { mode: 'date' }).notNull().defaultNow(),
});

export const coupons = pgTable('coupons', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  code: text('code').notNull().unique(),
  discountPercentage: doublePrecision('discount_percentage').notNull(),
  validUntil: timestamp('valid_until', { mode: 'date' }).notNull(),
  usageLimit: integer('usage_limit').notNull().default(0), // 0 means unlimited
  usedCount: integer('used_count').notNull().default(0),
  createdAt: timestamp('created_at', { mode: 'date' }).notNull().defaultNow(),
});

export const posts = pgTable('posts', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  title: text('title').notNull(),
  slug: text('slug').notNull().unique(),
  content: text('content').notNull(), // HTML string
  excerpt: text('excerpt'),
  featuredImage: text('featured_image'),
  isPublished: boolean('is_published').default(false),
  publishedAt: timestamp('published_at', { mode: 'date' }),
  createdAt: timestamp('created_at', { mode: 'date' }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { mode: 'date' }).notNull().defaultNow(),
});

export const shippingAddresses = pgTable('shipping_addresses', {
  id: text('id').primaryKey(),
  orderId: text('order_id').notNull().references(() => orders.id),
  email: text('email').notNull(),
  fullName: text('full_name').notNull(),
  phone: text('phone').notNull(),
  addressLine1: text('address_line_1').notNull(),
  addressLine2: text('address_line_2'),
  city: text('city').notNull(),
  postalCode: text('postal_code').notNull(),
  country: text('country').notNull(),
});

export const userAddresses = pgTable('user_addresses', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  fullName: text('full_name').notNull(),
  phone: text('phone').notNull(),
  addressLine1: text('address_line_1').notNull(),
  city: text('city').notNull(),
  postalCode: text('postal_code').notNull(),
  country: text('country').notNull(),
  isDefault: boolean('is_default').default(false),
});

export const reviews = pgTable('reviews', {
  id: text('id').primaryKey(),
  productId: text('product_id').notNull().references(() => products.id, { onDelete: 'cascade' }),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  rating: integer('rating').notNull(), // 1-5
  comment: text('comment'),
  createdAt: timestamp('created_at', { mode: 'date' }).notNull(),
});

export const wishlists = pgTable('wishlists', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  productId: text('product_id').notNull().references(() => products.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at', { mode: 'date' }).notNull(),
});

export const orders = pgTable('orders', {
  id: text('id').primaryKey(),
  userId: text('user_id'), // Optional: guest checkout allowed
  totalAmount: doublePrecision('total_amount').notNull(),
  taxAmount: doublePrecision('tax_amount').notNull().default(0),
  shippingFee: doublePrecision('shipping_fee').notNull().default(0),
  paymentMethod: text('payment_method').notNull(), // 'CARD', 'CASH_ON_DELIVERY', 'BKASH', 'NAGAD'
  paymentIntentId: text('payment_intent_id'),
  paymentStatus: text('payment_status', { enum: ['PENDING', 'PAID', 'FAILED', 'REFUNDED'] }).notNull().default('PENDING'),
  status: text('status', { enum: ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'] }).notNull().default('PENDING'),
  createdAt: timestamp('created_at', { mode: 'date' }).notNull(),
});

export const orderItems = pgTable('order_items', {
  id: text('id').primaryKey(),
  orderId: text('order_id').notNull().references(() => orders.id),
  productId: text('product_id').notNull(),
  productName: text('product_name').notNull(),
  quantity: integer('quantity').notNull(),
  priceAtPurchase: doublePrecision('price_at_purchase').notNull(),
});

// --- NEXTAUTH ADAPTER SCHEMA ---

export const users = pgTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  email: text("email").unique(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
  password: text("password"),
});

export const accounts = pgTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  })
);

export const sessions = pgTable("session", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = pgTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  })
);
