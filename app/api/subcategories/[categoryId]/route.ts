import { NextResponse } from "next/server";

import { db } from "@/lib/db/db";
import { productImages, products, subcategories } from "@/lib/db/schema";

import { NextRequest } from "next/server";
import { eq } from "drizzle-orm";
import { createSlug } from "@/utils/slug";

// Get subcategories by category ID
export async function GET(
  request: NextRequest,
  { params }: { params: { categoryId: string } }
) {
  try {
    const categorySubcategories = await db
      .select()
      .from(subcategories)
      .where(eq(subcategories.categoryId, parseInt(params.categoryId)));

    return NextResponse.json(categorySubcategories);
  } catch (error) {
    console.error("Error fetching subcategories:", error);
    return NextResponse.json(
      { error: "Failed to fetch subcategories" },
      { status: 500 }
    );
  }
}

// app/api/subcategories/[id]/route.ts
// Update subcategory
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { name, description, image, categoryId } = body;

    const slug = name ? createSlug(name) : undefined;

    const [updatedSubcategory] = await db
      .update(subcategories)
      .set({
        name,
        slug,
        description,
        image,
        categoryId,
      })
      .where(eq(subcategories.id, parseInt(params.id)))
      .returning();

    if (!updatedSubcategory) {
      return NextResponse.json(
        { error: "Subcategory not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedSubcategory);
  } catch (error) {
    console.error("Error updating subcategory:", error);
    return NextResponse.json(
      { error: "Failed to update subcategory" },
      { status: 500 }
    );
  }
}

// Delete subcategory and related products
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const subcategoryId = parseInt(params.id);

    await db.transaction(async (tx) => {
      // Delete all related product images
      const productIds = await tx
        .select({ id: products.id })
        .from(products)
        .where(eq(products.subcategoryId, subcategoryId));

      for (const prod of productIds) {
        await tx
          .delete(productImages)
          .where(eq(productImages.productId, prod.id));
      }

      // Delete products
      await tx
        .delete(products)
        .where(eq(products.subcategoryId, subcategoryId));

      // Delete subcategory
      await tx.delete(subcategories).where(eq(subcategories.id, subcategoryId));
    });

    return NextResponse.json({ message: "Subcategory deleted successfully" });
  } catch (error) {
    console.error("Error deleting subcategory:", error);
    return NextResponse.json(
      { error: "Failed to delete subcategory" },
      { status: 500 }
    );
  }
}
export const dynamic = "force-dynamic";
