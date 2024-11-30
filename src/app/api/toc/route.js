import { NextResponse } from "next/server";
import { ConnectDB } from "@/libs/config/db";
import TOC from "@/libs/models/TOC";

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

    const terms = new TOC({ content });
    await terms.save();

    return NextResponse.json(
      { message: "Terms and Conditions saved successfully!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error saving terms:", error);
    return NextResponse.json(
      { error: "Failed to save terms and conditions." },
      { status: 500 }
    );
  }
}

// OPTIONAL: Method not allowed handler for unsupported HTTP methods
export function OPTIONS() {
  return NextResponse.json(null, { status: 204 }); // Used for preflight requests
}
