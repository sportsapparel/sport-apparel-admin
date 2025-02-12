// app/api/categories/[id]/route.ts
import { db } from "@/lib/db/db";
import { categories } from "@/lib/db/schema";
import { createSlug } from "@/utils/slug";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

// Update category
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { name, description, image } = body;

    const slug = name ? createSlug(name) : undefined;

    const [updatedCategory] = await db
      .update(categories)
      .set({
        name,
        slug,
        description,
        image,
      })
      .where(eq(categories.id, parseInt(params.id)))
      .returning();

    if (!updatedCategory) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedCategory);
  } catch (error) {
    console.error("Error updating category:", error);
    return NextResponse.json(
      { error: "Failed to update category" },
      { status: 500 }
    );
  }
}

// Delete category and all related data
// export async function DELETE(
//   request: NextRequest,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     const categoryId = parseInt(params.id);

//     // Start a transaction to ensure all related data is deleted
//     await db.transaction(async (tx) => {
//       // Get all subcategories
//       const subIds = await tx
//         .select({ id: subcategories.id })
//         .from(subcategories)
//         .where(eq(subcategories.categoryId, categoryId));

//       // Delete all related product images for each subcategory
//       for (const sub of subIds) {
//         const productIds = await tx
//           .select({ id: products.id })
//           .from(products)
//           .where(eq(products.subcategoryId, sub.id));

//         for (const prod of productIds) {
//           await tx
//             .delete(productImages)
//             .where(eq(productImages.productId, prod.id));
//         }

//         // Delete products
//         await tx.delete(products).where(eq(products.subcategoryId, sub.id));
//       }

//       // Delete subcategories
//       await tx
//         .delete(subcategories)
//         .where(eq(subcategories.categoryId, categoryId));

//       // Finally, delete the category
//       await tx.delete(categories).where(eq(categories.id, categoryId));
//     });

//     return NextResponse.json({ message: "Category deleted successfully" });
//   } catch (error) {
//     console.error("Error deleting category:", error);
//     return NextResponse.json(
//       { error: "Failed to delete category" },
//       { status: 500 }
//     );
//   }
// }
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  try {
    const result = await db
      .delete(categories)
      .where(eq(categories.id, Number(id)))
      .execute();

    if (result.rowCount === 0) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error("Error deleting category:", error);
    return NextResponse.json(
      { error: "Failed to delete category" },
      { status: 500 }
    );
  }
}
export const dynamic = "force-dynamic";
