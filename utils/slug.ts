// lib/utils/slug.ts

/**
 * Creates a URL-friendly slug from a string
 * @param str - The string to convert into a slug
 * @returns A URL-friendly slug
 */
export function createSlug(str: string): string {
  return (
    str
      // Convert to lowercase
      .toLowerCase()
      // Remove accents/diacritics
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      // Replace spaces and special characters with hyphens
      .replace(/[^a-z0-9\s-]/g, "") // Remove invalid characters
      .replace(/\s+/g, "-") // Replace spaces with hyphens
      .replace(/-+/g, "-") // Replace multiple hyphens with single hyphen
      .trim() // Remove whitespace from both ends
      .replace(/^-+|-+$/g, "")
  ); // Remove hyphens from start and end
}

/**
 * Creates a unique slug by appending a number if the slug already exists
 * @param str - The string to convert into a slug
 * @param existingSlugs - Array of existing slugs to check against
 * @returns A unique slug
 */
export function createUniqueSlug(str: string, existingSlugs: string[]): string {
  const slug = createSlug(str);
  let counter = 1;
  let uniqueSlug = slug;

  while (existingSlugs.includes(uniqueSlug)) {
    uniqueSlug = `${slug}-${counter}`;
    counter++;
  }

  return uniqueSlug;
}

/**
 * Checks if a string is a valid slug
 * @param slug - The string to validate
 * @returns boolean indicating if the string is a valid slug
 */
export function isValidSlug(slug: string): boolean {
  // Slug should:
  // - Only contain lowercase letters, numbers, and hyphens
  // - Not start or end with a hyphen
  // - Not contain consecutive hyphens
  const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  return slugRegex.test(slug);
}

/**
 * Checks if a slug needs to be updated based on a new title
 * @param currentSlug - The current slug
 * @param newTitle - The new title to compare against
 * @returns boolean indicating if the slug should be updated
 */
export function shouldUpdateSlug(
  currentSlug: string,
  newTitle: string
): boolean {
  const newSlug = createSlug(newTitle);
  return currentSlug !== newSlug;
}
