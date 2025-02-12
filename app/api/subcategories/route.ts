import { db } from "@/lib/db/db";
import { categories, subcategories } from "@/lib/db/schema";
import { createSlug } from "@/utils/slug";
import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

// Utility function to generate SEO metadata
function generateSeoMetadata(
  name: string,
  categoryName?: string,
  description?: string | null
) {
  return {
    metaTitle: `${name} ${categoryName ? `- ${categoryName}` : ""} Subcategory`,
    metaDescription: description
      ? description.slice(0, 160)
      : `Explore our ${name} subcategory with high-quality products.`,
    keywords: [
      ...name.toLowerCase().split(" "),
      ...(categoryName ? categoryName.toLowerCase().split(" ") : []),
    ].join(", "),
  };
}

// Create subcategory
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, description, image, categoryId } = body;

    // Validate required fields
    if (!name) {
      return NextResponse.json(
        { error: "Subcategory name is required" },
        { status: 400 }
      );
    }

    if (!categoryId) {
      return NextResponse.json(
        { error: "Category ID is required" },
        { status: 400 }
      );
    }

    // Verify category exists
    const [existingCategory] = await db
      .select({ name: categories.name })
      .from(categories)
      .where(eq(categories.id, categoryId))
      .limit(1);

    if (!existingCategory) {
      return NextResponse.json(
        { error: "Specified category does not exist" },
        { status: 404 }
      );
    }

    // Create slug
    const slug = createSlug(name);

    // Check if subcategory already exists in the category
    const existingSubcategory = await db
      .select()
      .from(subcategories)
      .where(
        and(
          eq(subcategories.slug, slug),
          eq(subcategories.categoryId, categoryId)
        )
      )
      .limit(1);

    if (existingSubcategory.length > 0) {
      return NextResponse.json(
        {
          error: "A subcategory with this name already exists in the category",
        },
        { status: 409 }
      );
    }

    // Generate SEO metadata
    const seoMetadata = generateSeoMetadata(
      name,
      existingCategory.name,
      description
    );

    // Prepare subcategory data
    const subcategoryData = {
      name,
      slug,
      description: description || null,
      image: image || null,
      categoryId,
      // Add SEO fields
      metaTitle: seoMetadata.metaTitle,
      metaDescription: seoMetadata.metaDescription,
      keywords: seoMetadata.keywords,
      canonicalUrl: `https://yourwebsite.com/category/${existingCategory.name}/${slug}`,
    };

    // Insert subcategory
    const [newSubcategory] = await db
      .insert(subcategories)
      .values(subcategoryData)
      .returning();

    return NextResponse.json(newSubcategory, { status: 201 });
  } catch (error) {
    // Log the full error for server-side debugging
    console.error("Error creating subcategory:", error);

    // Determine the error response
    if (error instanceof Error) {
      return NextResponse.json(
        {
          error: "Failed to create subcategory",
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

export const dynamic = "force-dynamic";
