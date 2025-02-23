import { db } from "@/lib/db/db";
import {
  categories,
  contactUs,
  gallery,
  products,
  subcategories,
} from "@/lib/db/schema";
import { sql } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Get total products count
    const totalProducts = await db
      .select({ count: sql<number>`COUNT(${products.id})` })
      .from(products)
      .then((result) => result[0]?.count || 0);

    // Get total messages count
    const totalMessages = await db
      .select({ count: sql<number>`COUNT(${contactUs.id})` })
      .from(contactUs)
      .then((result) => result[0]?.count || 0);

    // Get total categories count
    const totalCategories = await db
      .select({ count: sql<number>`COUNT(${categories.id})` })
      .from(categories)
      .then((result) => result[0]?.count || 0);

    // Get total subcategories count
    const totalSubcategories = await db
      .select({ count: sql<number>`COUNT(${subcategories.id})` })
      .from(subcategories)
      .then((result) => result[0]?.count || 0);

    // Get total images in gallery count
    const totalImages = await db
      .select({ count: sql<number>`COUNT(${gallery.id})` })
      .from(gallery)
      .then((result) => result[0]?.count || 0);

    const data = {
      stats: [
        {
          label: "Products",
          value: totalProducts,
          icon: "fa-box-open",
        },
        {
          label: "Messages",
          value: totalMessages,
          icon: "fa-envelope",
        },
        {
          label: "Categories",
          value: totalCategories,
          icon: "fa-layer-group",
        },
        {
          label: "Subcategories",
          value: totalSubcategories,
          icon: "fa-sitemap",
        },
        {
          label: "Images",
          value: totalImages,
          icon: "fa-image",
        },
      ],
    };

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return NextResponse.json({ message: error }, { status: 200 });
  }
}
