import { NextResponse } from "next/server";
import { ConnectDB } from "@/libs/config/db";
import TOC from "@/libs/models/TOC";

// Ensure database connection
await ConnectDB();

// GET Handler
export async function GET() {
  try {
    const latestTerms = await TOC.findOne().sort({ uploadedAt: -1 }); // Fetch the most recent terms
    if (!latestTerms) {
      return NextResponse.json(
        { error: "No terms and conditions found." },
        { status: 404 }
      );
    }
    return NextResponse.json(latestTerms, { status: 200 });
  } catch (error) {
    console.error("Error fetching terms:", error);
    return NextResponse.json(
      { error: "Failed to fetch terms and conditions." },
      { status: 500 }
    );
  }
}
