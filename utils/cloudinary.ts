import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadToCloudinary = async (
  files: File | File[],
  folder: string = "public/cloundinary"
): Promise<string | string[]> => {
  try {
    const isMultiple = Array.isArray(files);
    const filesToUpload = isMultiple ? files : [files];

    const uploadPromises = filesToUpload.map(async (file) => {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      return new Promise<string>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder,
            resource_type: "auto",
          },
          (error, result: any) => {
            if (error) reject(error);
            if (!result) reject(new Error("No result from Cloudinary"));
            resolve(result.secure_url);
          }
        );
        uploadStream.end(buffer);
      });
    });

    const urls = await Promise.all(uploadPromises);
    return isMultiple ? urls : urls[0];
  } catch (error) {
    console.error("Upload error:", error);
    throw new Error("Failed to upload image(s)");
  }
};

export const getPublicIdFromUrl = (url: string): string => {
  const splitUrl = url.split("/");
  const filename = splitUrl[splitUrl.length - 1];
  return filename.split(".")[0];
};

export const deleteFromCloudinary = async (
  urls: string | string[]
): Promise<void> => {
  try {
    if (Array.isArray(urls)) {
      // Delete multiple images
      const publicIds = urls.map(
        (url) => `product_images/${getPublicIdFromUrl(url)}`
      );
      console.log(
        `Deleting multiple images from Cloudinary: ${publicIds.join(", ")}`
      );
      await Promise.all(
        publicIds.map((publicId) => cloudinary.uploader.destroy(publicId))
      );
    } else {
      // Delete a single image
      const publicId = `product_images/${getPublicIdFromUrl(urls)}`;
      console.log(`Deleting single image from Cloudinary: ${publicId}`);
      await cloudinary.uploader.destroy(publicId);
    }
  } catch (error) {
    console.error("Delete error:", error);
    throw new Error("Failed to delete image(s) from Cloudinary");
  }
};
interface CloudinaryResource {
  public_id: string;
}

export const deleteAllFromCloudinary = async (
  folder?: string
): Promise<void> => {
  try {
    // Get all resources from specified folder or root
    const { resources } = await cloudinary.api.resources({
      type: "upload",
      prefix: folder, // If folder is undefined, it will get all resources
      max_results: 500, // Adjust based on your needs
    });

    // Extract public_ids
    const publicIds = resources.map(
      (resource: CloudinaryResource) => resource.public_id
    );

    if (publicIds.length === 0) {
      console.log("No images found to delete");
      return;
    }

    // Delete all resources in parallel
    const deletionPromises = publicIds.map((publicId: string) =>
      cloudinary.uploader.destroy(publicId)
    );

    await Promise.all(deletionPromises);
    console.log(`Successfully deleted ${publicIds.length} images`);
  } catch (error) {
    console.error("Error deleting all images:", error);
    throw new Error("Failed to delete all images");
  }
};

// Optional: Delete with pagination for large collections
export const deleteAllWithPagination = async (
  folder?: string
): Promise<void> => {
  try {
    let hasMore = true;
    let nextCursor = undefined;
    let totalDeleted = 0;

    while (hasMore) {
      const { resources, next_cursor } = await cloudinary.api.resources({
        type: "upload",
        prefix: folder,
        max_results: 500,
        next_cursor: nextCursor,
      });

      const publicIds = resources.map(
        (resource: CloudinaryResource) => resource.public_id
      );

      if (publicIds.length > 0) {
        const deletionPromises = publicIds.map((publicId: string) =>
          cloudinary.uploader.destroy(publicId)
        );
        await Promise.all(deletionPromises);
        totalDeleted += publicIds.length;
      }

      hasMore = !!next_cursor;
      nextCursor = next_cursor;
    }

    console.log(`Successfully deleted ${totalDeleted} images`);
  } catch (error) {
    console.error("Error in paginated deletion:", error);
    throw new Error("Failed to delete all images");
  }
};

// Extract public_id from Cloudinary URL

// // Delete all images in a specific folder
// await deleteAllFromCloudinary('products');

// // Delete all images in account
// await deleteAllFromCloudinary();

// // For large collections, use pagination
// await deleteAllWithPagination('products');
