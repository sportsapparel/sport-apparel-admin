// app/api/products/[id]/route.ts
import { db } from "@/lib/db/db";
import { gallery, productImages, products } from "@/lib/db/schema";
import { and, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { productId: string } }
) {
  try {
    const { productId } = params;
    console.log("====================================");
    console.log(productId);
    console.log("====================================");
    // Get product with its thumbnail
    const [productData] = await db
      .select({
        product: products,
        thumbnail: gallery,
      })
      .from(products)
      .leftJoin(gallery, eq(products.thumbnailId, gallery.id))
      .where(and(eq(products.id, productId), eq(products.isActive, true)));

    if (!productData) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Get all additional product images
    const productImagesData = await db
      .select({
        image: gallery,
        displayOrder: productImages.displayOrder,
      })
      .from(productImages)
      .leftJoin(gallery, eq(productImages.imageId, gallery.id))
      .where(eq(productImages.productId, productId))
      .orderBy(productImages.displayOrder);

    // Format the response
    const formattedProduct = {
      id: productData.product.id,
      name: productData.product.name,
      slug: productData.product.slug,
      description: productData.product.description,
      details: productData.product.details,
      minOrder: productData.product.minOrder,
      deliveryInfo: productData.product.deliveryInfo,
      whatsappNumber: productData.product.whatsappNumber,
      thumbnail: productData.thumbnail
        ? {
            id: productData.thumbnail.id,
            url: productData.thumbnail.imageUrl,
            alt: productData.thumbnail.altText || productData.product.name,
            originalName: productData.thumbnail.originalName,
            fileSize: productData.thumbnail.fileSize,
            mimeType: productData.thumbnail.mimeType,
          }
        : null,
      images: productImagesData.map(({ image, displayOrder }) => ({
        id: image?.id,
        url: image?.imageUrl,
        alt: image?.altText || productData.product.name,
        originalName: image?.originalName,
        fileSize: image?.fileSize,
        mimeType: image?.mimeType,
        displayOrder,
      })),
      seo: {
        metaTitle: productData.product.metaTitle,
        metaDescription: productData.product.metaDescription,
        keywords: productData.product.keywords,
        canonicalUrl: productData.product.canonicalUrl,
        structuredData: productData.product.structuredData,
      },
      createdAt: productData.product.createdAt,
    };

    return NextResponse.json({
      success: true,
      data: formattedProduct,
    });
  } catch (error) {
    console.error("Error fetching product details:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
export async function PUT(
  request: NextRequest,
  { params }: { params: { productId: string } }
) {
  const { productId } = params;
  const { name, description, thumbnailId, imageIds, ...rest } =
    await request.json();

  try {
    // Update product details
    await db
      .update(products)
      .set({ name, description, thumbnailId, ...rest })
      .where(eq(products.id, productId));

    // Update product images
    const existingImageIds = await db
      .select({ imageId: productImages.imageId })
      .from(productImages)
      .where(eq(productImages.productId, productId));

    const newImageIds = imageIds.filter(
      (imageId: number) =>
        !existingImageIds.some(
          (existingImage) => existingImage.imageId === imageId
        )
    );

    if (newImageIds.length > 0) {
      const newProductImages = newImageIds.map((imageId: number) => ({
        productId: productId,
        imageId,
      }));
      await db.insert(productImages).values(newProductImages);
    }

    return NextResponse.json(
      { message: "Product updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
export const dynamic = "force-dynamic";
