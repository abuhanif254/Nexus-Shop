import { sqliteTable, text, real, integer, primaryKey } from 'drizzle-orm/sqlite-core';


// Removed duplicate users table, using NextAuth users table below

export const products = sqliteTable('products', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  brand: text('brand').notNull(),
  category: text('category').notNull(),
  price: real('price').notNull(),
  oldPrice: real('old_price'),
  discount: integer('discount').default(0),
  rating: real('rating').default(0),
  reviews: integer('reviews').default(0),
  soldCount: integer('sold_count').default(0),
  totalStock: integer('total_stock').notNull().default(0),
  vendor: text('vendor'),
  image: text('image').notNull(),
  featured: integer('featured', { mode: 'boolean' }).default(false),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }),
});

export const shippingAddresses = sqliteTable('shipping_addresses', {
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

export const userAddresses = sqliteTable('user_addresses', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  fullName: text('full_name').notNull(),
  phone: text('phone').notNull(),
  addressLine1: text('address_line_1').notNull(),
  city: text('city').notNull(),
  postalCode: text('postal_code').notNull(),
  country: text('country').notNull(),
  isDefault: integer('is_default', { mode: 'boolean' }).default(false),
});

export const reviews = sqliteTable('reviews', {
  id: text('id').primaryKey(),
  productId: text('product_id').notNull().references(() => products.id, { onDelete: 'cascade' }),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  rating: integer('rating').notNull(), // 1-5
  comment: text('comment'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
});

export const wishlists = sqliteTable('wishlists', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  productId: text('product_id').notNull().references(() => products.id, { onDelete: 'cascade' }),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
});

export const orders = sqliteTable('orders', {
  id: text('id').primaryKey(),
  userId: text('user_id'), // Optional: guest checkout allowed
  totalAmount: real('total_amount').notNull(),
  taxAmount: real('tax_amount').notNull().default(0),
  shippingFee: real('shipping_fee').notNull().default(0),
  paymentMethod: text('payment_method').notNull(), // 'CARD', 'CASH_ON_DELIVERY', 'BKASH', 'NAGAD'
  paymentIntentId: text('payment_intent_id'),
  paymentStatus: text('payment_status', { enum: ['PENDING', 'PAID', 'FAILED', 'REFUNDED'] }).notNull().default('PENDING'),
  status: text('status', { enum: ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'] }).notNull().default('PENDING'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
});

export const orderItems = sqliteTable('order_items', {
  id: text('id').primaryKey(),
  orderId: text('order_id').notNull().references(() => orders.id),
  productId: text('product_id').notNull(),
  productName: text('product_name').notNull(),
  quantity: integer('quantity').notNull(),
  priceAtPurchase: real('price_at_purchase').notNull(),
});

// --- NEXTAUTH ADAPTER SCHEMA ---

export const users = sqliteTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  email: text("email").unique(),
  emailVerified: integer("emailVerified", { mode: "timestamp_ms" }),
  image: text("image"),
  password: text("password"),
});

export const accounts = sqliteTable(
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

export const sessions = sqliteTable("session", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: integer("expires", { mode: "timestamp_ms" }).notNull(),
});

export const verificationTokens = sqliteTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: integer("expires", { mode: "timestamp_ms" }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  })
);
