import slugify from "slugify";

// Utility to truncate text
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + "...";
}

// Generate meta title
export function generateMetaTitle(
  name: string,
  suffix: string = "| Sports Apparel"
): string {
  const baseTitle = truncateText(name, 57); // Leave room for suffix
  return `${baseTitle} ${suffix}`.trim();
}

// Generate meta description
export function generateMetaDescription(
  description: string | null,
  name: string
): string {
  // If description exists, use it (truncated)
  if (description) {
    return truncateText(description, 160);
  }

  // Fallback to a generic description using the name
  return truncateText(
    `Discover ${name}. High-quality product with exceptional features and value.`,
    160
  );
}

// Generate keywords
export function generateKeywords(
  name: string,
  additionalKeywords: string[] = []
): string {
  // Basic keywords from the name
  const nameKeywords = name.split(/\s+/).map((word) => word.toLowerCase());

  // Combine and deduplicate
  const keywords = Array.from(
    new Set([...nameKeywords, ...additionalKeywords])
  ).slice(0, 10); // Limit to 10 keywords

  return keywords.join(", ");
}

// Generate canonical URL
export function generateCanonicalUrl(
  slug: string,
  baseUrl: string,
  entityType: "category" | "subcategory" | "product"
): string {
  // Ensure the base URL doesn't end with a slash
  const cleanBaseUrl = baseUrl.replace(/\/+$/, "");

  return `${cleanBaseUrl}/${entityType}/${slug}`;
}

// Auto-generate structured data for products
export function generateProductStructuredData(product: {
  name: string;
  description: string;
  thumbnailUrl?: string;
  price?: string;
}) {
  return {
    "@context": "https://schema.org/",
    "@type": "Product",
    name: product.name,
    description: truncateText(product.description, 300),
    ...(product.thumbnailUrl && { image: product.thumbnailUrl }),
    ...(product.price && {
      offers: {
        "@type": "Offer",
        price: product.price,
        priceCurrency: "USD", // Adjust as needed
      },
    }),
  };
}

// Utility to auto-generate SEO fields during insertion
export function autoGenerateSeoFields(input: {
  name: string;
  description?: string | null;
  slug?: string;
  entityType: "category" | "subcategory" | "product";
  additionalKeywords?: string[];
  baseUrl?: string;
  thumbnailUrl?: string;
  price?: string;
}) {
  const {
    name,
    description = null,
    slug = slugify(name, { lower: true, strict: true }),
    entityType,
    additionalKeywords = [],
    baseUrl = "https://yourwebsite.com", // Replace with your actual base URL
    thumbnailUrl,
    price,
  } = input;

  return {
    metaTitle: generateMetaTitle(name),
    metaDescription: generateMetaDescription(description, name),
    keywords: generateKeywords(name, additionalKeywords),
    canonicalUrl: generateCanonicalUrl(slug, baseUrl, entityType),
    ...(entityType === "product" && {
      structuredData: generateProductStructuredData({
        name,
        description: description || "",
        thumbnailUrl,
        price,
      }),
    }),
  };
}
