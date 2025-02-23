// app/api/categories/route.ts
import { db } from "@/lib/db/db";
import { categories } from "@/lib/db/schema";
import { createSlug } from "@/utils/slug"; // Assuming you have a utility function for creating slugs
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

// Utility function to generate SEO metadata
function generateSeoMetadata(name: string, description?: string | null) {
  return {
    metaTitle: `${name} - Sports Apparel Category`,
    metaDescription: description
      ? description.slice(0, 160)
      : `Explore our ${name} category with high-quality products.`,
    keywords: name.toLowerCase().split(" ").join(", "),
  };
}

export async function POST(request: Request) {
  try {
    // Parse request body
    const body = await request.json();

    // Validate required fields
    if (!body.name) {
      return NextResponse.json(
        { error: "Category name is required" },
        { status: 400 }
      );
    }

    // Create slug
    const slug = createSlug(body.name);

    // Check if category already exists
    const existingCategory = await db
      .select()
      .from(categories)
      .where(eq(categories.slug, slug))
      .limit(1);

    if (existingCategory.length > 0) {
      return NextResponse.json(
        { error: "A category with this name already exists" },
        { status: 409 }
      );
    }

    // Generate SEO metadata
    const seoMetadata = generateSeoMetadata(body.name, body.description);

    // Prepare category data
    const categoryData = {
      name: body.name,
      slug,
      description: body.description || null,
      image: body.image || null,
      // Add SEO fields
      metaTitle: seoMetadata.metaTitle,
      metaDescription: seoMetadata.metaDescription,
      keywords: seoMetadata.keywords,
      canonicalUrl: `https://yourwebsite.com/category/${slug}`, // Replace with your actual domain
    };

    // Insert category
    const [newCategory] = await db
      .insert(categories)
      .values(categoryData)
      .returning();

    // Return created category
    return NextResponse.json(newCategory, { status: 201 });
  } catch (error) {
    // Log the full error for server-side debugging
    console.error("Error creating category:", error);

    // Determine the error response
    if (error instanceof Error) {
      return NextResponse.json(
        {
          error: "Failed to create category",
          message: error.message,
        },
        { status: 500 }
      );
    }

    // Fallback error response
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}

// Get all categories
export async function GET() {
  try {
    const allCategories = await db.select().from(categories);
    return NextResponse.json(allCategories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}
export const dynamic = "force-dynamic";
