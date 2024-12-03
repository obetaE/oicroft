import { NextResponse } from "next/server";
import { ConnectDB } from "@/libs/config/db";
import Privacy from "@/libs/models/Privacy";

// Ensure database connection
await ConnectDB();

// GET Handler
export async function GET() {
  try {
    const latestPrivacy = await Privacy.findOne().sort({ uploadedAt: -1 }); // Fetch the most recent terms
    if (!latestPrivacy) {
      return NextResponse.json(
        { error: "No Privacy Policy found." },
        { status: 404 }
      );
    }
    return NextResponse.json(latestPrivacy, { status: 200 });
  } catch (error) {
    console.error("Error fetching Privacy Policy:", error);
    return NextResponse.json(
      { error: "Failed to fetch Privacy Policy." },
      { status: 500 }
    );
  }
}
