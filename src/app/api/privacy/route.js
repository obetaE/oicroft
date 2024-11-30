import { NextResponse } from "next/server";
import { ConnectDB } from "@/libs/config/db";
import Privacy from "@/libs/models/Privacy";

// Ensure database connection
await ConnectDB();

// POST Handler
export async function POST(req) {
  try {
    const { content } = await req.json();

    if ( !content) {
      return NextResponse.json(
        { error: "Can't send an empty message." },
        { status: 400 }
      );
    }

    const privacy = new Privacy({ content });
    await privacy.save();

    return NextResponse.json(
      { message: "Privacy Policy saved successfully!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error saving terms:", error);
    return NextResponse.json(
      { error: "Failed to save Privacy Policy." },
      { status: 500 }
    );
  }
}

// OPTIONAL: Method not allowed handler for unsupported HTTP methods
export function OPTIONS() {
  return NextResponse.json(null, { status: 204 }); // Used for preflight requests
}
