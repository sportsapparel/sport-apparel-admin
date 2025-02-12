// schema.ts
import {
  pgTable,
  serial,
  varchar,
  text,
  timestamp,
  boolean,
  integer,
  json,
  uuid,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createId } from "@paralleldrive/cuid2";

// Categories table - Updated with SEO fields
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  description: text("description"),
  image: text("image"),
  // New SEO-related fields
  metaTitle: varchar("meta_title", { length: 255 }),
  metaDescription: varchar("meta_description", { length: 500 }),
  keywords: varchar("keywords", { length: 500 }), // Comma-separated keywords
  canonicalUrl: text("canonical_url"), // Canonical URL for the category page
  createdAt: timestamp("created_at").defaultNow(),
});

// Subcategories table - Updated with SEO fields
export const subcategories = pgTable("subcategories", {
  id: serial("id").primaryKey(),
  categoryId: integer("category_id")
    .notNull()
    .references(() => categories.id),
  name: varchar("name", { length: 100 }).notNull(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  description: text("description"),
  image: text("image"),
  // New SEO-related fields
  metaTitle: varchar("meta_title", { length: 255 }),
  metaDescription: varchar("meta_description", { length: 500 }),
  keywords: varchar("keywords", { length: 500 }), // Comma-separated keywords
  canonicalUrl: text("canonical_url"), // Canonical URL for the subcategory page
  createdAt: timestamp("created_at").defaultNow(),
});

// Products table - Updated with SEO fields
export const products = pgTable("products", {
  id: uuid("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  subcategoryId: integer("subcategory_id")
    .notNull()
    .references(() => subcategories.id),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  description: text("description").notNull(),
  details: json("details"), // Any JSON data
  minOrder: varchar("min_order", { length: 100 }),
  deliveryInfo: text("delivery_info"),
  whatsappNumber: varchar("whatsapp_number", { length: 20 }).notNull(),
  thumbnailId: integer("thumbnail_id").references(() => gallery.id), // Main product image
  isActive: boolean("is_active").default(true),
  // New SEO-related fields
  metaTitle: varchar("meta_title", { length: 255 }),
  metaDescription: varchar("meta_description", { length: 500 }),
  keywords: varchar("keywords", { length: 500 }), // Comma-separated keywords
  canonicalUrl: text("canonical_url"), // Canonical URL for the product page
  structuredData: json("structured_data"), // For adding JSON-LD structured data
  createdAt: timestamp("created_at").defaultNow(),
});

// Gallery table - Added alt text for image SEO
export const gallery = pgTable("gallery", {
  id: serial("id").primaryKey(),
  imageUrl: text("image_url").notNull(),
  originalName: varchar("original_name", { length: 255 }).notNull(), // Original filename
  fileSize: integer("file_size"), // Size in bytes
  mimeType: varchar("mime_type", { length: 100 }), // e.g., 'image/jpeg'
  // New SEO-related fields
  altText: varchar("alt_text", { length: 255 }), // Alt text for images
  createdAt: timestamp("created_at").defaultNow(),
});

// Junction table for products and gallery images
export const productImages = pgTable("product_images", {
  id: serial("id").primaryKey(),
  productId: uuid("product_id")
    .notNull()
    .references(() => products.id),
  imageId: integer("image_id")
    .notNull()
    .references(() => gallery.id),
  displayOrder: integer("display_order").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const categoriesRelations = relations(categories, ({ many }) => ({
  subcategories: many(subcategories),
}));

export const subcategoriesRelations = relations(
  subcategories,
  ({ one, many }) => ({
    category: one(categories, {
      fields: [subcategories.categoryId],
      references: [categories.id],
    }),
    products: many(products),
  })
);

export const productsRelations = relations(products, ({ one, many }) => ({
  subcategory: one(subcategories, {
    fields: [products.subcategoryId],
    references: [subcategories.id],
  }),
  thumbnail: one(gallery, {
    fields: [products.thumbnailId],
    references: [gallery.id],
  }),
  images: many(productImages),
}));

export const galleryRelations = relations(gallery, ({ many }) => ({
  productLinks: many(productImages),
}));

export const productImagesRelations = relations(productImages, ({ one }) => ({
  product: one(products, {
    fields: [productImages.productId],
    references: [products.id],
  }),
  image: one(gallery, {
    fields: [productImages.imageId],
    references: [gallery.id],
  }),
}));

// Update type definitions to include new SEO fields
export type Category = typeof categories.$inferSelect;
export type NewCategory = typeof categories.$inferInsert;

export type Subcategory = typeof subcategories.$inferSelect;
export type NewSubcategory = typeof subcategories.$inferInsert;

export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;

export type GalleryImage = typeof gallery.$inferSelect;
export type NewGalleryImage = typeof gallery.$inferInsert;
