import { db } from "@/lib/db/db";
import { contactUs } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  request: NextRequest,
  props: { params: Promise<{ id: number }> }
) {
  const params = await props.params;
  const { id } = params;
  console.log(id, "id");
  // Check if the contact exists
  const existingContact = await db
    .select()
    .from(contactUs)
    .where(eq(contactUs.id, id));
  // .first();
  console.log(existingContact, "existingContact");
  if (existingContact.length === 0) {
    return NextResponse.json({ message: "Contact not found" }, { status: 404 });
  }

  await db.delete(contactUs).where(eq(contactUs.id, id));
  return NextResponse.json(
    { message: "Contact deleted successfully" },
    { status: 200 }
  );
}
