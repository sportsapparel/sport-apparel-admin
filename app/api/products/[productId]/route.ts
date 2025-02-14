// app/api/products/[id]/route.ts
import { db } from "@/lib/db/db";
import { gallery, productImages, products } from "@/lib/db/schema";
import { and, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: Request,
  props: { params: Promise<{ productId: string }> }
) {
  const params = await props.params;
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
    console.log(formattedProduct, "format data");
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
export const dynamic = "force-dynamic";

export async function PUT(
  request: NextRequest,
  props: { params: Promise<{ productId: string }> }
) {
  const params = await props.params;
  console.log("PUT /api/products/[productId] - Start", {
    productId: params.productId,
  });

  const { productId } = params;
  const {
    name,
    description,
    thumbnailId,
    images,
    minOrder,
    deliveryInfo,
    whatsappNumber,
    slug,
    details,
    seo,
    createdAt, // Explicitly extract but don't use in update
    ...rest
  } = await request.json();

  // Create update payload without timestamp fields
  const updatePayload = {
    name,
    description,
    thumbnailId,
    minOrder,
    deliveryInfo,
    whatsappNumber,
    slug,
    details,
    seo,
    ...rest,
  };

  // Remove any undefined or null values
  Object.keys(updatePayload).forEach((key) => {
    if (updatePayload[key] === undefined || updatePayload[key] === null) {
      delete updatePayload[key];
    }
  });

  console.log("Cleaned update payload:", updatePayload);

  try {
    console.log("Updating product details...", { productId });

    // Update product details
    await db
      .update(products)
      .set(updatePayload)
      .where(eq(products.id, productId));

    console.log("Product details updated successfully", { productId });

    // Delete existing images
    console.log("Deleting existing product images...", { productId });
    await db
      .delete(productImages)
      .where(eq(productImages.productId, productId));
    console.log("Existing product images deleted", { productId });

    // Insert new images
    if (images && images.length > 0) {
      console.log("Processing new images...", {
        productId,
        imageCount: images.length,
        imageIds: images.map((img: any) => img.id),
      });

      const newProductImages = images.map(
        (image: { id: number; url: string }) => ({
          productId,
          imageId: image.id,
        })
      );

      console.log("Inserting new product images...", {
        productId,
        newImagesCount: newProductImages.length,
      });

      await db.insert(productImages).values(newProductImages);
      console.log("New product images inserted successfully", { productId });
    } else {
      console.log("No new images to process", { productId });
    }

    console.log("Product update completed successfully", { productId });
    return NextResponse.json(
      { message: "Product updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating product:", {
      productId,
      error: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
      updatePayload, // Log the payload that caused the error
    });

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
export async function DELETE(
  request: NextRequest,
  props: { params: Promise<{ productId: string }> }
) {
  const params = await props.params;
  const { productId } = params;
  await db.delete(products).where(eq(products.id, productId));
  return NextResponse.json(
    { message: "Product deleted successfully" },
    { status: 200 }
  );
}
