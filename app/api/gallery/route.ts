// app/api/gallery/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db/db";
import { gallery } from "@/lib/db/schema";
import { deleteFromCloudinary, uploadToCloudinary } from "@/utils/cloudinary";
import { eq, inArray } from "drizzle-orm";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const files = formData.getAll("files");

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No files provided" }, { status: 400 });
    }

    console.log(files, "image");

    // Filter only image files
    const imageFiles = files.filter(
      (file) => file instanceof File && file.type.startsWith("image/")
    ) as File[];

    if (imageFiles.length === 0) {
      return NextResponse.json(
        { error: "No valid image files provided" },
        { status: 400 }
      );
    }

    console.log("Uploading image files...");
    const urls = await uploadToCloudinary(
      imageFiles.length === 1 ? imageFiles[0] : imageFiles,
      "product_images"
    );
    console.log("Uploading image files completed in Cloudinary...");

    // Ensure `urls` is an array
    const imageUrls = Array.isArray(urls) ? urls : [urls];
    console.log("Uploading image files", imageUrls);
    // Prepare data for DB insertion
    const dbInserts = imageUrls.map((url, index) => ({
      imageUrl: url,
      originalName: imageFiles[index]?.name || "unknown",
      fileSize: imageFiles[index]?.size || 0,
      mimeType: imageFiles[index]?.type || "unknown",
    }));

    console.log("Inserting into database...");
    await db.insert(gallery).values(dbInserts);
    console.log("Inserted into database successfully");

    return NextResponse.json({
      success: true,
      urls: imageUrls,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Failed to process upload" },
      { status: 500 }
    );
  }
}

// Get all images
export async function GET() {
  try {
    const images = await db.select().from(gallery).orderBy(gallery.createdAt);
    return NextResponse.json(images);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch images" },
      { status: 500 }
    );
  }
}

// Delete image by id
export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    console.log("Request body:", body); // Log the request body for debugging

    // const { imageUrls, deleteAll } = body;
    // console.log(imageUrls, deleteAll);

    if (body.deleteAll) {
      // Delete all images
      console.log("Deleting all images from the database and Cloudinary");
      const allImages = await db.select().from(gallery);
      const publicIds = allImages.map((image) => image.imageUrl);

      // Delete from Cloudinary
      await deleteFromCloudinary(publicIds);

      // Delete from database
      await db.delete(gallery);

      return NextResponse.json({ message: "All images deleted successfully" });
    }

    if (
      !body.imageUrls ||
      (Array.isArray(body.imageUrls) && body.imageUrls.length === 0)
    ) {
      return NextResponse.json(
        { error: "No image URLs provided" },
        { status: 400 }
      );
    }

    if (Array.isArray(body.imageUrls)) {
      // Delete multiple images
      console.log(`Deleting multiple images: ${body.imageUrls.join(", ")}`);
      const imagesToDelete = await db
        .select()
        .from(gallery)
        .where(inArray(gallery.imageUrl, body.imageUrls));
      const publicIds = imagesToDelete.map((image) => image.imageUrl);

      // Delete from Cloudinary
      await deleteFromCloudinary(publicIds);

      // Delete from database
      await db.delete(gallery).where(inArray(gallery.imageUrl, body.imageUrls));

      return NextResponse.json({
        message: "Multiple images deleted successfully",
      });
    } else {
      // Delete a single image
      console.log(`Deleting single image: ${body.imageUrls}`);
      const imageToDelete = await db
        .select()
        .from(gallery)
        .where(eq(gallery.imageUrl, body.imageUrls))
        .limit(1);
      const publicId = imageToDelete[0]?.imageUrl;

      if (!publicId) {
        return NextResponse.json({ error: "Image not found" }, { status: 404 });
      }

      // Delete from Cloudinary
      await deleteFromCloudinary(publicId);

      // Delete from database
      await db.delete(gallery).where(eq(gallery.imageUrl, body.imageUrls));

      return NextResponse.json({ message: "Image deleted successfully" });
    }
  } catch (error) {
    console.error("Delete error:", error);
    return NextResponse.json(
      { error: "Failed to delete image(s)" },
      { status: 500 }
    );
  }
}
export const dynamic = "force-dynamic";
