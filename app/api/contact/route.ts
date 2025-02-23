import { db } from "@/lib/db/db";
import { contactUs } from "@/lib/db/schema";
import { NextResponse } from "next/server";

// Get all images
export async function GET() {
  try {
    const contactData = await db
      .select()
      .from(contactUs)
      .orderBy(contactUs.createdAt);
    return NextResponse.json(contactData);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch images" },
      { status: 500 }
    );
  }
}
