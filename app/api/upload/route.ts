// app/api/upload/route.ts
import {
  deleteAllFromCloudinary,
  uploadToCloudinary,
} from "@/utils/cloudinary";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const files = formData.getAll("files");
    const folder = (formData.get("folder") as string) || "product_images";
    console.log(files, "files");
    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No files provided" }, { status: 400 });
    }

    const imageFiles = files.filter(
      (file) => file instanceof File && file.type.startsWith("image/")
    ) as File[];

    if (imageFiles.length === 0) {
      return NextResponse.json(
        { error: "No valid image files provided" },
        { status: 400 }
      );
    }
    console.log("uploading..........");
    const urls = await uploadToCloudinary(
      imageFiles.length === 1 ? imageFiles[0] : imageFiles,
      folder
    );

    return NextResponse.json({ urls });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload images" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { imageUrl } = await request.json();
    console.log(imageUrl, "url");
    if (!imageUrl) {
      return NextResponse.json(
        { error: "No image URL provided" },
        { status: 400 }
      );
    }
    console.log("sending to get url.......");

    // const publicId = getPublicIdFromUrl(imageUrl);
    // console.log(publicId, "deleting......");
    // await deleteFromCloudinary(publicId);
    await deleteAllFromCloudinary(imageUrl as string);

    return NextResponse.json({ message: "Image deleted successfully" });
  } catch (error) {
    console.error("Delete error:", error);
    return NextResponse.json(
      { error: "Failed to delete image" },
      { status: 500 }
    );
  }
}
export const dynamic = "force-dynamic";
