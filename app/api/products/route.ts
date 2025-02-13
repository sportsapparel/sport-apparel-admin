import { db } from "@/lib/db/db";
import { categories, gallery, products, subcategories } from "@/lib/db/schema";
import { autoGenerateSeoFields } from "@/lib/seo";
import { randomUUID } from "crypto";
import { count, desc, eq, sql } from "drizzle-orm";
import { NextResponse } from "next/server";
import { z } from "zod";

// Types
interface ExistingSlug {
  slug: string;
}

// Helper function to create a unique slug
function createSlug(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function createUniqueSlug(str: string, existingSlugs: ExistingSlug[]): string {
  const slug = createSlug(str);
  const existingSlugStrings = existingSlugs.map((item) => item.slug);
  let counter = 1;
  let uniqueSlug = slug;

  while (existingSlugStrings.includes(uniqueSlug)) {
    uniqueSlug = `${slug}-${counter}`;
    counter++;
  }

  return uniqueSlug;
}

// Validation schema with proper types
const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  details: z.any().optional(),
  minOrder: z.string().optional(),
  deliveryInfo: z.string().optional(),
  whatsappNumber: z.string().min(1, "WhatsApp number is required"),
  thumbnailId: z.string().nullable().optional(),
  subcategoryId: z.string().min(1, "Subcategory is required"),
});

// type ProductInput = z.infer<typeof productSchema>;

// Custom error class for better error handling
class ProductAPIError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly status: number
  ) {
    super(message);
    this.name = "ProductAPIError";
  }
}

// Error handler function
function handleError(error: unknown) {
  console.error("[POST /api/products] Error:", error);

  if (error instanceof z.ZodError) {
    return NextResponse.json(
      {
        error: "Invalid input data",
        details: error.errors,
      },
      { status: 400 }
    );
  }

  if (error instanceof ProductAPIError) {
    return NextResponse.json(
      {
        error: error.message,
        code: error.code,
      },
      { status: error.status }
    );
  }

  // Handle database specific errors
  const dbError = error as { code?: string };
  switch (dbError.code) {
    case "23505":
      return NextResponse.json(
        {
          error: "Duplicate entry",
          details: "A product with this name already exists",
        },
        { status: 409 }
      );
    case "22P02":
      return NextResponse.json(
        {
          error: "Invalid data format",
          details: "Invalid UUID format",
        },
        { status: 400 }
      );
    case "23503":
      return NextResponse.json(
        {
          error: "Invalid reference",
          details: "The specified subcategory or thumbnail doesn't exist",
        },
        { status: 400 }
      );
    case "57P01":
    case "57P03":
      return NextResponse.json(
        {
          error: "Service unavailable",
          details: "Database connection error",
        },
        { status: 503 }
      );
    default:
      return NextResponse.json(
        {
          error: "Internal server error",
          details: "An unexpected error occurred",
        },
        { status: 500 }
      );
  }
}

export async function POST(request: Request) {
  try {
    // Parse and validate request body
    const body = await request.json();
    const validatedData = productSchema.parse(body);

    // Convert IDs
    const thumbnailId = validatedData.thumbnailId
      ? parseInt(validatedData.thumbnailId, 10)
      : null;
    const subcategoryId = parseInt(validatedData.subcategoryId, 10);

    // Validate subcategory exists
    const existingSubcategory = await db
      .select({
        id: subcategories.id,
        name: subcategories.name,
      })
      .from(subcategories)
      .where(eq(subcategories.id, subcategoryId))
      .limit(1);

    if (existingSubcategory.length === 0) {
      throw new ProductAPIError(
        "Subcategory not found",
        "SUBCATEGORY_NOT_FOUND",
        404
      );
    }

    // Validate thumbnail exists if provided
    if (thumbnailId) {
      const existingThumbnail = await db
        .select({ id: gallery.id })
        .from(gallery)
        .where(eq(gallery.id, thumbnailId))
        .limit(1);

      if (existingThumbnail.length === 0) {
        throw new ProductAPIError(
          "Thumbnail image not found",
          "THUMBNAIL_NOT_FOUND",
          404
        );
      }
    }

    // Get existing slugs
    const existingProducts = await db
      .select({ slug: products.slug })
      .from(products);

    // Generate unique slug
    const slug = createUniqueSlug(validatedData.name, existingProducts);
    const seoFields = autoGenerateSeoFields({
      name: validatedData.name,
      description: validatedData.description,
      entityType: "product",
      additionalKeywords: [existingSubcategory[0].name.toLowerCase()],
    });
    console.log(seoFields, "seo", validatedData, "validate");
    // Prepare product data
    const productData = {
      id: randomUUID(),
      name: validatedData.name,
      slug,
      description: validatedData.description,
      details: validatedData.details ?? null,
      minOrder: validatedData.minOrder ?? null,
      // price: validatedData.price ?? null,
      deliveryInfo: validatedData.deliveryInfo ?? null,
      whatsappNumber: validatedData.whatsappNumber,
      thumbnailId,
      subcategoryId,
      ...seoFields,
    };

    // Insert product into database
    const [newProduct] = await db
      .insert(products)
      .values(productData)
      .returning();

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    return handleError(error);
  }
}
export async function GET(request: Request) {
  try {
    // Extract query parameters for potential filtering or pagination
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const offset = (page - 1) * limit;

    // Get total count of active products for pagination metadata
    const [{ totalCount }] = await db
      .select({ totalCount: count(products.id) })
      .from(products)
      .where(eq(products.isActive, true));

    // Get products with related data using joins
    const productsWithDetails = await db
      .select({
        // Product fields
        id: products.id,
        name: products.name,
        slug: products.slug,
        description: products.description,
        details: products.details,
        minOrder: products.minOrder,
        deliveryInfo: products.deliveryInfo,
        whatsappNumber: products.whatsappNumber,
        isActive: products.isActive,
        createdAt: products.createdAt,

        // SEO-specific fields
        metaTitle: products.metaTitle,
        metaDescription: products.metaDescription,
        keywords: products.keywords,
        canonicalUrl: products.canonicalUrl,
        structuredData: products.structuredData,

        // Thumbnail image fields
        thumbnail: {
          id: gallery.id,
          imageUrl: gallery.imageUrl,
          originalName: gallery.originalName,
          altText: gallery.altText, // Include alt text for SEO
        },

        // Category fields
        category: {
          id: categories.id,
          name: categories.name,
          slug: categories.slug,
          metaTitle: categories.metaTitle,
          metaDescription: categories.metaDescription,
        },

        // Subcategory fields
        subcategory: {
          id: subcategories.id,
          name: subcategories.name,
          slug: subcategories.slug,
          metaTitle: subcategories.metaTitle,
          metaDescription: subcategories.metaDescription,
        },

        // Additional images for the product
        // images:
        //   sql <
        //   Array<{
        //     id: number;
        //     imageUrl: string;
        //     altText: string;
        //   }>`(
        //   SELECT json_agg(
        //     json_build_object(
        //       'id', g.id,
        //       'imageUrl', g.image_url,
        //       'altText', g.alt_text
        //     )
        //   )
        //   FROM product_images pi
        //   JOIN gallery g ON pi.image_id = g.id
        //   WHERE pi.product_id = products.id
        // )`,
      })
      .from(products)
      // Join with subcategories
      .leftJoin(subcategories, eq(products.subcategoryId, subcategories.id))
      // Join with categories through subcategories
      .leftJoin(categories, eq(subcategories.categoryId, categories.id))
      // Join with gallery for thumbnail
      .leftJoin(gallery, eq(products.thumbnailId, gallery.id))
      // Only get active products
      .where(eq(products.isActive, true))
      // Pagination
      .limit(limit)
      .offset(offset)
      // Optional: Add sorting if needed
      .orderBy(desc(products.createdAt));

    // Construct pagination metadata
    const pagination = {
      currentPage: page,
      pageSize: limit,
      totalProducts: totalCount,
      totalPages: Math.ceil(totalCount / limit),
      hasNextPage: offset + limit < totalCount,
      hasPreviousPage: page > 1,
    };

    // Optional: Generate a summary for SEO
    const productSummary = {
      totalActiveProducts: totalCount,
      categories: await db
        .select({
          id: categories.id,
          name: categories.name,
          slug: categories.slug,
          productCount: sql<number>`(
            SELECT COUNT(*)
            FROM products p
            JOIN subcategories s ON p.subcategory_id = s.id
            WHERE s.category_id = categories.id AND p.is_active = true
          )`,
        })
        .from(categories),
    };

    // Return response with SEO-optimized data
    return NextResponse.json({
      products: productsWithDetails,
      pagination,
      summary: productSummary,
      // Include global SEO metadata
      seoMetadata: {
        title: "Our Products | Sports Apparel",
        description:
          "Explore our wide range of high-quality products across various categories.",
        canonicalUrl: "https://yourwebsite.com/products", // Replace with your actual URL
      },
    });
  } catch (error) {
    return handleError(error);
  }
}
export const dynamic = "force-dynamic";
// You might also want to add pagination and filtering
// export async function GET(request: Request) {
//   try {
//     // Get URL parameters
//     const { searchParams } = new URL(request.url);
//     const page = parseInt(searchParams.get("page") ?? "1");
//     const limit = parseInt(searchParams.get("limit") ?? "10");
//     const categorySlug = searchParams.get("category");
//     const subcategorySlug = searchParams.get("subcategory");
//     const search = searchParams.get("search");

//     // Calculate offset
//     const offset = (page - 1) * limit;

//     // Build base query
//     let query = db
//       .select({
//         // ... same select fields as above ...
//       })
//       .from(products)
//       .leftJoin(subcategories, eq(products.subcategoryId, subcategories.id))
//       .leftJoin(categories, eq(subcategories.categoryId, categories.id))
//       .leftJoin(gallery, eq(products.thumbnailId, gallery.id))
//       .where(eq(products.isActive, true));

//     // Add filters if provided
//     if (categorySlug) {
//       query = query.where(eq(categories.slug, categorySlug));
//     }

//     if (subcategorySlug) {
//       query = query.where(eq(subcategories.slug, subcategorySlug));
//     }

//     if (search) {
//       query = query.where(
//         or(
//           ilike(products.name, `%${search}%`),
//           ilike(products.description, `%${search}%`)
//         )
//       );
//     }

//     // Get total count for pagination
//     const totalCountQuery = query.clone();
//     const [{ count }] = await totalCountQuery.select({
//       count: sql`count(*)`.mapWith(Number),
//     });

//     // Add pagination to main query
//     const productsWithDetails = await query
//       .limit(limit)
//       .offset(offset)
//       .orderBy(desc(products.createdAt));

//     return NextResponse.json({
//       products: productsWithDetails,
//       pagination: {
//         total: count,
//         page,
//         limit,
//         totalPages: Math.ceil(count / limit),
//       },
//     });
//   } catch (error) {
//     return handleError(error);
//   }
// }
// GET /api/products?page=1&limit=10
// GET /api/products?category=electronics
// GET /api/products?subcategory=smartphones
// GET /api/products?search=iphone
