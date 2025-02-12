DROP TABLE "product_images" CASCADE;--> statement-breakpoint
ALTER TABLE "categories" ADD COLUMN "meta_title" varchar(255);--> statement-breakpoint
ALTER TABLE "categories" ADD COLUMN "meta_description" varchar(500);--> statement-breakpoint
ALTER TABLE "categories" ADD COLUMN "keywords" varchar(500);--> statement-breakpoint
ALTER TABLE "categories" ADD COLUMN "canonical_url" text;--> statement-breakpoint
ALTER TABLE "gallery" ADD COLUMN "alt_text" varchar(255);--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "meta_title" varchar(255);--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "meta_description" varchar(500);--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "keywords" varchar(500);--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "canonical_url" text;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "structured_data" json;--> statement-breakpoint
ALTER TABLE "subcategories" ADD COLUMN "meta_title" varchar(255);--> statement-breakpoint
ALTER TABLE "subcategories" ADD COLUMN "meta_description" varchar(500);--> statement-breakpoint
ALTER TABLE "subcategories" ADD COLUMN "keywords" varchar(500);--> statement-breakpoint
ALTER TABLE "subcategories" ADD COLUMN "canonical_url" text;