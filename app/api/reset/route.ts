// app/api/reset/route.ts
import { db } from "@/lib/db/db"; // Adjust this import based on your db configuration
import {
  categories,
  gallery,
  productImages,
  products,
  subcategories,
} from "@/lib/db/schema"; // Adjust path based on your schema location
import { NextResponse } from "next/server";

export async function DELETE(request: Request) {
  try {
    // 1. Delete from product_images (junction table) first
    await db.delete(productImages);

    // 2. Delete from products
    await db.delete(products);

    // 3. Delete from gallery
    await db.delete(gallery);

    // 4. Delete from subcategories
    await db.delete(subcategories);

    // 5. Delete from categories
    await db.delete(categories);

    return NextResponse.json(
      { message: "All tables have been reset successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error resetting tables:", error);
    return NextResponse.json(
      {
        error: "Failed to reset tables",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
