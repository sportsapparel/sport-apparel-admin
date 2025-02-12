ALTER TABLE "product_images" ALTER COLUMN "product_id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "products" ALTER COLUMN "id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "products" ALTER COLUMN "id" DROP DEFAULT;