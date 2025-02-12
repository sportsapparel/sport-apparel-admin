import { NextResponse } from "next/server";
// import { auth } from "@clerk/nextjs";
import { db } from "@/lib/db/db";
import { gallery, productImages, products } from "@/lib/db/schema";
import { eq, inArray } from "drizzle-orm";
import { z } from "zod";

// Input validation schema
const productImagesSchema = z.object({
  productId: z.string().uuid(),
  galleryIds: z.array(z.number()).min(1),
});

export async function POST(req: Request) {
  try {
    // Parse and validate request body
    const body = await req.json();
    const validatedData = productImagesSchema.parse(body);
    const { productId, galleryIds } = validatedData;

    // Verify product exists
    // Verify product exists
    const product = await db
      .select()
      .from(products)
      .where(eq(products.id, productId));
    console.log(product, "checking... products");
    if (!product) {
      return new NextResponse("Product not found", { status: 404 });
    }

    // Verify all gallery IDs exist
    const existingGalleryImages = await db
      .select({ id: gallery.id })
      .from(gallery)
      .where(inArray(gallery.id, galleryIds));

    if (existingGalleryImages.length !== galleryIds.length) {
      return new NextResponse("One or more gallery images not found", {
        status: 404,
      });
    }

    // Get current max display order for this product
    const maxOrderResult = await db
      .select({ maxOrder: productImages.displayOrder })
      .from(productImages)
      .where(eq(productImages.productId, productId))
      .orderBy(productImages.displayOrder)
      .limit(1);

    const startOrder = (maxOrderResult[0]?.maxOrder ?? -1) + 1;

    // Create associations in product_images table
    const associations = galleryIds.map((galleryId, index) => ({
      productId,
      imageId: galleryId,
      displayOrder: startOrder + index,
    }));

    await db.insert(productImages).values(associations);

    return NextResponse.json({
      message: "Images associated with product successfully",
      associations,
    });
  } catch (error) {
    console.error("Error associating product images:", error);

    if (error instanceof z.ZodError) {
      return new NextResponse("Invalid request data", { status: 400 });
    }

    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
