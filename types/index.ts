export interface GalleryData {
  id: number;
  imageUrl: string;
  originalName: string;
  fileSize?: number;
  mimeType: string;
  createdAt: string;
}
export interface CategoryData extends Record<string, unknown> {
  id: number;
  name: string;
  slug: string;
  description: string;
  image: string;
  createdAt: string;
}
export interface SubCategoryData extends Record<string, unknown> {
  id: number;
  name: string;
  slug: string;
  description: string;
  image: string;
  categoryId: number;
  createdAt: string;
}
// Thumbnail Image Interface
interface ThumbnailImage {
  id: number;
  imageUrl: string;
  originalName: string;
  altText: string | null;
}

// Category Interface with SEO Fields
interface Category {
  id: number;
  name: string;
  slug: string;
  metaTitle: string | null;
  metaDescription: string | null;
}

// Subcategory Interface with SEO Fields
interface Subcategory {
  id: number;
  name: string;
  slug: string;
  metaTitle: string | null;
  metaDescription: string | null;
}

// Structured Data Interface (Optional)
interface StructuredData {
  [key: string]: any;
}

// Detailed Product Interface with Index Signature
export interface ProductData {
  [key: string]: any; // This allows any additional string indexing

  id: string;
  name: string;
  slug: string;
  description: string;
  details: Record<string, any> | null;
  minOrder: string | null;
  deliveryInfo: string | null;
  whatsappNumber: string;
  isActive: boolean;
  createdAt: string; // Using string for ISO date format

  // SEO-specific fields
  metaTitle: string | null;
  metaDescription: string | null;
  keywords: string | null;
  canonicalUrl: string | null;
  structuredData: StructuredData | null;

  // Relationships
  thumbnail: ThumbnailImage | null;
  category: Category;
  subcategory: Subcategory;
}

// Pagination Interface
interface Pagination {
  currentPage: number;
  pageSize: number;
  totalProducts: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

// Category Summary Interface
interface CategorySummary {
  id: number;
  name: string;
  slug: string;
  productCount: string;
}

// Summary Interface
interface ProductSummary {
  totalActiveProducts: number;
  categories: CategorySummary[];
}

// SEO Metadata Interface
interface SeoMetadata {
  title: string;
  description: string;
  canonicalUrl: string;
}

// Complete Products Response Interface
export interface ProductsResponse {
  products: ProductData[];
  pagination: Pagination;
  summary: ProductSummary;
  seoMetadata: SeoMetadata;
}
export interface ContactData extends Record<string, unknown> {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
}
